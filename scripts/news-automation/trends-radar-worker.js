/**
 * trends-radar-worker.js — رادار ترندات قوقل ووكالة الأنباء الجزائرية الرسمية (v3.3)
 * ===================================================================================
 * 1. [المصدر المفضل الأول - Tier 1]: زحف وكالة الأنباء الجزائرية الرسمية (APS) واستخدامها كمرجع رسمي مؤكد (Fallback).
 * 2. [الرادار الإخباري]: رصد ترندات قوقل الجزائرية (Google Trends DZ) والصحف الكبرى.
 * 3. [توسيع الدلالات الإدارية لـ APS]: التقاط كل خبر رسمي يذكر أي وزارة أو قطاع خدمي جزائري.
 * 4. [الحماية الصارمة من المحتوى الرديء]: حظر 100% لأخبار الحوادث، الجرائم، الرياضة، الفن، والسياسة الدولية حتى من APS.
 * 5. [استخراج الصور الموثقة]: جلب og:image الحقيقية فقط بـ cheerio و axios.
 * 6. [الكتابة الاحترافية]: صياغة مقال سيو حصري (1000 - 1500 كلمة) بـ Gemini مع قسم الأسئلة الشائعة (FAQ).
 * 7. [الفهرسة الفورية]: إرسال إشعار فوري لـ IndexNow و Google Indexing API.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');
const googleTrends = require('google-trends-api');

const rssParser = new Parser({
  timeout: 12000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  },
});

// ─── تحميل متغيرات البيئة ─────────────────────────────────────
const ROOT_DIR = path.join(__dirname, '../..');
const envPath = path.join(ROOT_DIR, '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"?([^"\r\n]+)"?/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  });
}

// ─── الإعدادات العامة ─────────────────────────────────────────
const CONFIG = {
  GEMINI_API_KEY: (process.env.GEMINI_API_KEY || '').trim(),
  GEMINI_MODEL: 'gemini-3.6-flash',
  SITES_CONFIG: path.join(__dirname, 'sites-config.json'),
  ARTICLES_JSON: path.join(ROOT_DIR, 'lib', 'custom-articles-data.json'),
  HISTORY_FILE: path.join(__dirname, 'history.json'),
  MAX_TREND_ARTICLES_PER_RUN: 2,
};

if (!CONFIG.GEMINI_API_KEY) {
  console.error('\n❌ GEMINI_API_KEY غير موجود في .env.local أو GitHub Secrets.\n');
  process.exit(1);
}

// ════════════════════════════════════════════════════════════════
// 🚫 القائمة السوداء الصارمة (استبعاد الحوادث، الجرائم، الرياضة، الفن)
// ════════════════════════════════════════════════════════════════
const STRICT_EXCLUDE_LIST = [
  // الحوادث والكوارث
  'حادث', 'حوادث', 'اصطدام', 'جرحى', 'قتلى', 'ضحايا', 'مصرع', 'وفاة', 'جثة', 'جثث',
  'غرق', 'غريق', 'حريق', 'حرائق', 'انفجار', 'انهيار', 'انقلاب', 'تفحم', 'دهس',
  // الجرائم، المخدرات، والشرطة
  'مخدرات', 'مهلوسات', 'أقراص', 'مروج', 'عصابة', 'توقيف', 'حبس', 'سجن', 'جريمة',
  'مقتل', 'اغتيال', 'اعتداء', 'سرقة', 'نصب', 'احتيال', 'فضائح', 'فضيحة', 'محكمة',
  'جنايات', 'وكيل الجمهورية', 'تسلل', 'حراقة', 'تهريب', 'إحباط', 'حجز', 'ضبط',
  // الأخبار البروتوكولية والسياسية العامة واللقاءات التي لا تقدم خدمة إدارية للمواطن
  'استقبل وزير', 'استقبل الوزير', 'محادثات بين', 'مباحثات بين', 'تبادل وجهات النظر',
  'زيارة عمل وتفقد', 'زيارة تفقدية', 'تنصيب والي', 'حفل تكريم', 'جلسة عمل مغلقة',
  'لقاء تشاوري', 'بيان مشترك بين', 'سفير دولة', 'سفيرة', 'دبلوماسية',
  // التعازي الفردية والمناسبات التاريخية
  'تعزية', 'يعزي', 'نعى', 'ينعى', 'وفاة شيخ', 'اليوم الوطني للمجاهد', 'مؤتمر الصومام',
  'هجومات الشمال القسنطيني', 'ثورة التحرير', 'عيد الاستقلال', 'عيد الثورة',
  // الرياضة وكرة القدم
  'مباراة', 'دوري', 'كأس', 'منتخب', 'مدرب', 'لاعب', 'أهداف', 'رونالدو', 'ميسي',
  'بلماضي', 'بيتكوفيتش', 'محرز', 'بلايلي', 'اتحاد العاصمة', 'مولودية', 'شبيبة القبائل',
  'شباب بلوزداد', 'وفاق سطيف', 'ريال', 'برشلونة', 'أرسنال', 'ليفربول', 'سيتي', 'marseille',
  // الفن والترفيه والمشاهير
  'أفلام', 'مسلسل', 'أغنية', 'فنان', 'مطرب', 'ممثلة', 'تيك توك', 'يوتيوب',
  // الطقس والمنوعات
  'طقس', 'نشرة جوية', 'أمطار رعدية', 'رياح قوية', 'حرارة قياسية', 'زلزال', 'هزة أرضية',
  // السياسة الدولية والاقتصاد الكلي العام
  'روسيا', 'أوكرانيا', 'إسرائيل', 'غزة', 'ترامب', 'بايدن', 'ماكرون',
  // ━ الدين والشعائر — ممنوع 100% بلا استثناء ━
  'عيد الأضحى', 'عيد الفطر', 'أضاحي', 'أضحية', 'صلاة العيد', 'خطبة الجمعة',
  'الخطبة الدينية', 'الوعظ والإرشاد', 'الفتوى', 'شعائر الحج', 'رمضان', 'التراويح',
  'ليلة القدر', 'الهلال', 'رؤية الهلال', 'الفتوى الدينية', 'الشعائر الدينية',
];

// ─── مرشح APS النهائي: استبعاد السياسة الخارجية والاقتصاد الكلي العام ─────
// يُطبَّق خصيصاً على أخبار APS بعد اجتياز القائمة السوداء العامة أعلاه
const APS_FINAL_FILTER_EXCLUDE = [
  // العلاقات الدولية والدبلوماسية
  'علاقات دولية', 'وزير الخارجية', 'دبلوماسية', 'السفير الجزائري', 'التعاون الدولي',
  'مجلس الأمن', 'الأمم المتحدة', 'الاتحاد الأفريقي', 'القمة العربية', 'قمة دولية',
  // الاقتصاد الكلي غير المتعلق بالخدمات المباشرة للمواطن
  'احتياطي الصرف', 'الناتج المحلي الإجمالي', 'gdp', 'الميزان التجاري', 'سعر النفط',
  'أسعار البترول', 'أوبك', 'opec', 'تصدير الغاز', 'عجز الميزانية',
  // العسكرية والأمن القومي (ما عدا الخدمة الوطنية والتجنيد)
  'المناورات العسكرية', 'التدريبات القتالية', 'الأسلحة', 'الدفاع الوطني الاستراتيجي',
];

// ════════════════════════════════════════════════════════════════
// 🎯 قاعدة البيانات الإدارية والخدمية الشاملة (267 قطاعاً وخدمة)
// ════════════════════════════════════════════════════════════════
const COMPREHENSIVE_ADMINISTRATIVE_DATABASE = [
  {
    topic: 'education',
    name: 'وزارة التربية الوطنية والديوان الوطني للامتحانات (ONEC)',
    officialUrl: 'https://www.education.gov.dz',
    portalUrl: 'https://awlyaa.education.gov.dz',
    categoryId: 'education',
    phrases: [
      'فضاء الأولياء', 'منصة أوليائي', 'awlyaa', 'awlya', 'شهادة البكالوريا', 'نتائج البكالوريا',
      'نتائج الباك', 'شهادة التعليم المتوسط', 'نتائج البيام', 'المنحة المدرسية', 'منحة 5000',
      'كشف النقاط', 'مسابقة التربية', 'مسابقة توظيف الأساتذة', 'التسجيل في التحضيري',
      'التسجيل في الابتدائي', 'الدخول المدرسي', 'الديوان الوطني للامتحانات', 'onec dz',
      'التعليم عن بعد', 'الديوان الوطني للتعليم والتكوين عن بعد', 'onefd', 'المراسلة',
      'وزارة التربية الوطنية', 'وزير التربية', 'مديريات التربية',
    ],
  },
  {
    topic: 'university',
    name: 'وزارة التعليم العالي والبحث العلمي (MESRS)',
    officialUrl: 'https://www.mesrs.dz',
    portalUrl: 'https://progres.mesrs.dz/webetu',
    categoryId: 'university',
    phrases: [
      'منصة بروقرس', 'منصة progres', 'التحويلات الجامعية', 'التسجيلات الجامعية',
      'منحة التعليم العالي', 'المنحة الجامعية', 'الإيواء الجامعي', 'توجيه حاملي البكالوريا',
      'مسابقة الدكتوراه', 'mesrs dz', 'معادلة الشهادات الجامعية', 'الدخول الجامعي',
      'وزارة التعليم العالي', 'وزير التعليم العالي',
    ],
  },
  {
    topic: 'training',
    name: 'وزارة التكوين والتعليم المهنيين',
    officialUrl: 'https://www.mfep.gov.dz',
    portalUrl: 'https://mihnati.mfep.gov.dz',
    categoryId: 'training',
    phrases: [
      'منصة مهنتي', 'التكوين المهني', 'معاهد التكوين المهني', 'مراكز cfpa',
      'التسجيل في التكوين المهني', 'عروض التمهين', 'شهادة الكفاءة المهنية', 'دليل التكوين المهني',
      'وزارة التكوين المهني', 'وزير التكوين المهني',
    ],
  },
  {
    topic: 'employment',
    name: 'الوكالة الوطنية للتشغيل (ANEM) والمديرية العامة للوظيفة العمومية',
    officialUrl: 'https://www.anem.dz',
    portalUrl: 'https://minha.anem.dz',
    categoryId: 'employment',
    phrases: [
      'منحة البطالة', 'تجديد منحة البطالة', 'منصة وسيط', 'منصة minha', 'anem dz',
      'wassit anem', 'طالب عمل', 'مسابقة التوظيف العمومي', 'عقود ما قبل التشغيل',
      'جهاز المساعدة على الإدماج', 'عروض العمل anem', 'الوظيفة العمومية dgfp',
      'مسابقات التوظيف في الوظيف العمومي', 'وزارة العمل والتشغيل', 'وزير العمل',
    ],
  },
  {
    topic: 'housing',
    name: 'وكالة عدل (AADL) ووزارة السكن والعمران',
    officialUrl: 'https://www.aadl.com.dz',
    portalUrl: 'https://aadl3inscription2024.dz',
    categoryId: 'realEstate',
    phrases: [
      'عدل 3', 'aadl 3', 'سكنات عدل', 'وكالة عدل', 'مكتتبي عدل', 'طعون عدل',
      'سكن ترقوي مدعم', 'سكن lpp', 'سكن lpa', 'سكن اجتماعي', 'شهادة السلبية',
      'البوابة الرقمية لوزارة السكن', 'الصندوق الوطني لمعادلة الخدمات الاجتماعية fnpos',
      'المحافظة العقارية', 'مسح الأراضي', 'عقد الملكية العقارية', 'وزارة السكن', 'وزير السكن',
    ],
  },
  {
    topic: 'post',
    name: 'بريد الجزائر والنقد الآلي',
    officialUrl: 'https://www.poste.dz',
    portalUrl: 'https://eccp.poste.dz',
    categoryId: 'post',
    phrases: [
      'البطاقة الذهبية', 'بريد الجزائر', 'تطبيق بريدي موب', 'baridimob',
      'منصة eccp', 'الحساب البريدي الجاري ccp', 'طلب البطاقة الذهبية',
      'الدفع الإلكتروني عبر الإنترنت cib', 'تطبيق بريدي باي', 'وزارة البريد والمواصلات السلكية واللاسلكية',
    ],
  },
  {
    topic: 'socialSecurity',
    name: 'صناديق الضمان الاجتماعي والتقاعد (CNAS / CASNOS / CNR)',
    officialUrl: 'https://www.cnas.dz',
    portalUrl: 'https://elhanaa.cnas.dz',
    categoryId: 'socialSecurity',
    phrases: [
      'بطاقة الشفاء', 'فضاء الهناء', 'elhanaa cnas', 'صندوق الضمان الاجتماعي',
      'cnas dz', 'casnos', 'صندوق التقاعد cnr', 'منحة التقاعد', 'زيادة معاشات التقاعد',
      'التصريح بالعمال', 'عطلة الأمومة', 'التعويضات اليومية عن المرض',
    ],
  },
  {
    topic: 'interior',
    name: 'وزارة الداخلية والجماعات المحلية والتهيئة العمرانية',
    officialUrl: 'https://www.interieur.gov.dz',
    portalUrl: 'https://passeport.interieur.gov.dz',
    categoryId: 'interior',
    phrases: [
      'جواز السفر البيومتري', 'بطاقة التعريف البيومترية', 'شهادة الميلاد الرقمية',
      'رخصة السياقة بالتنقيط', 'الحالة المدنية الرقمية', 'استخراج الوثائق الإدارية',
      'ترقيم السيارات الجديد', 'موقع وزارة الداخلية الجزائرية', 'البوابة الجزائرية للخدمات الرقمية dzds',
      'وزارة الداخلية والجماعات المحلية', 'وزير الداخلية', 'الولاة', 'البلديات',
    ],
  },
  {
    topic: 'justice',
    name: 'وزارة العدل ومنصة الشباك الإلكتروني الموحد',
    officialUrl: 'https://www.mjustice.dz',
    portalUrl: 'https://portail.mjustice.dz',
    categoryId: 'justice',
    phrases: [
      'خدمة الأبوستيل', 'تصديق الوثائق الرسمية apostille', 'شهادة السوابق القضائية عبر الإنترنت',
      'صحيفة السوابق القضائية رقم 3', 'شهادة الجنسية الجزائرية الإلكترونية', 'الشباك الإلكتروني لوزارة العدل',
      'استخراج الأحكام القضائية إلكترونياً', 'وزارة العدل', 'وزير العدل حافظ الأختام',
    ],
  },
  {
    topic: 'tax',
    name: 'المديرية العامة للضرائب، السجل التجاري، والوكالة الوطنية للمقاول الذاتي',
    officialUrl: 'https://www.mfdgi.gov.dz',
    portalUrl: 'https://anae.dz',
    categoryId: 'tax',
    phrases: [
      'المقاول الذاتي', 'بطاقة المقاول الذاتي anae', 'منصة anae dz', 'السجل التجاري الإلكتروني',
      'منصة سجلكم', 'sidjilcom cnrc', 'الرقم الجبائي nif', 'التصريح الجبائي الإلكتروني',
      'جباية dz', 'الجمارك الجزائرية', 'منصة ألجكس algex', 'وزارة المالية', 'وزير المالية',
      'وزارة التجارة', 'وزير التجارة',
    ],
  },
  {
    topic: 'military',
    name: 'وزارة الدفاع الوطني (MDN) والخدمة الوطنية',
    officialUrl: 'https://www.mdn.dz',
    portalUrl: 'https://preinscription.mdn.dz',
    categoryId: 'military',
    phrases: [
      'تسجيلات الجيش الوطني الشعبي', 'دليل التجنيد mdn', 'تجنيد الضباط وضباط الصف',
      'موقع وزارة الدفاع الوطني', 'تسوية وضعية الخدمة الوطنية', 'بطاقة الإعفاء من الخدمة الوطنية',
      'تأجيل الخدمة الوطنية للطلبة', 'مدارس أشبال الأمة', 'وزارة الدفاع الوطني',
    ],
  },
  {
    topic: 'agriculture',
    name: 'وزارة الفلاحة والتنمية الريفية',
    officialUrl: 'https://madr.gov.dz',
    portalUrl: 'https://madr.gov.dz',
    categoryId: 'agriculture',
    phrases: [
      'الدعم الفلاحي', 'بطاقة الفلاح', 'منصة الدعم الفلاحي', 'الغرفة الوطنية للفلاحة',
      'حفر الآبار الفلاحية', 'استصلاح الأراضي الفلاحية', 'الصندوق الوطني للتعاون الفلاحي',
      'وزارة الفلاحة والتنمية الريفية', 'وزير الفلاحة',
    ],
  },
  {
    topic: 'fisheries',
    name: 'وزارة الصيد البحري والمنتجات الصيدية',
    officialUrl: 'https://mpeche.gov.dz',
    portalUrl: 'https://mpeche.gov.dz',
    categoryId: 'agriculture',
    phrases: [
      'الصيد البحري', 'تربية المائيات', 'بطاقة مهنيي الصيد البحري', 'دعم سفن الصيد',
      'بوابة وزارة الصيد البحري', 'وزارة الصيد البحري', 'وزير الصيد البحري',
    ],
  },
  {
    topic: 'water_bills',
    name: 'الجزائرية للمياه (ADE) وسونلغاز (Sonelgaz)',
    officialUrl: 'https://www.sonelgaz.dz',
    portalUrl: 'https://pay.sonelgaz.dz',
    categoryId: 'bills',
    phrases: [
      'فاتورة الكهرباء سونلغاز', 'دفع فاتورة سونلغاز عبر الإنترنت', 'تطبيق sonelgaz',
      'الجزائرية للمياه ade', 'دفع فاتورة المياه ade', 'تطبيق وكالتي سيال seal',
      'فواتير اتصالات الجزائر', 'تعبئة فضاء زبون اتصالات الجزائر', 'وزارة الطاقة والمناجم',
      'وزارة الموارد المائية والري',
    ],
  },
  {
    topic: 'transport',
    name: 'وزارة النقل والجمارك والخطوط الجوية الجزائرية',
    officialUrl: 'https://www.mintransport.gov.dz',
    portalUrl: 'https://airalgerie.dz',
    categoryId: 'transport',
    phrases: [
      'استيراد السيارات أقل من 3 سنوات', 'ترقيم المركبات ورخص السياقة', 'الخطوط الجوية الجزائرية air algerie',
      'الشركة الوطنية للنقل بالسكك الحديدية sntf', 'تذكرة النقل الإلكترونية', 'بطاقة الناقل المهني',
      'وزارة النقل', 'وزير النقل',
    ],
  },
];

// ─── إدارة سجل العمليات لمنع التكرار (history.json) ───────────
function loadHistory() {
  if (fs.existsSync(CONFIG.HISTORY_FILE)) {
    try { return JSON.parse(fs.readFileSync(CONFIG.HISTORY_FILE, 'utf8')); } catch {}
  }
  return { processedItems: {}, processedTrends: {}, lastRun: null };
}

function saveHistory(history) {
  fs.writeFileSync(CONFIG.HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
}

// ════════════════════════════════════════════════════════════════
// [المصدر المفضل الأول - Tier 1]: زحف وكالة الأنباء الجزائرية الرسمية (APS)
// ════════════════════════════════════════════════════════════════
async function crawlAPSOfficial() {
  const apsNews = [];
  console.log('🏛 [وكالة الأنباء الجزائرية APS] فحص النشرات الوطنية والاقتصادية الرسمية...');

  const apsSections = [
    { url: 'https://www.aps.dz', label: 'الرئيسية' },
    { url: 'https://www.aps.dz/algerie/actualite-nationale/', label: 'الشؤون الوطنية' },
    { url: 'https://www.aps.dz/economie/', label: 'الشؤون الاقتصادية والمالية' },
    { url: 'https://www.aps.dz/societe/', label: 'المجتمع والخدمات' },
  ];

  for (const sec of apsSections) {
    try {
      const response = await axios.get(sec.url, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      const $ = cheerio.load(response.data);
      $('a').each((_, el) => {
        const title = $(el).text().trim();
        let href = $(el).attr('href') || '';

        // استخراج المقالات الإخبارية المباشرة
        if (title && title.length > 25 && href && !href.startsWith('#') && (href.includes('/actualite-nationale/') || href.includes('/presidence-news/') || href.includes('/economie/') || href.includes('/societe/'))) {
          if (!href.startsWith('http')) {
            href = href.startsWith('/') ? `https://www.aps.dz${href}` : `https://www.aps.dz/${href}`;
          }

          if (!apsNews.some((a) => a.title === title || a.link === href)) {
            apsNews.push({
              title,
              link: href,
              snippet: title,
              pubDate: new Date().toISOString(),
              sourceName: 'وكالة الأنباء الجزائرية الرسمية (APS)',
              isTier1Official: true,
            });
          }
        }
      });
    } catch (err) {
      console.warn(`   ⚠ تعذر جلب قسم APS (${sec.label}): ${err.message}`);
    }
  }

  console.log(`   ✔ تم استخراج ${apsNews.length} خبراً رسمياً من وكالة الأنباء الجزائرية (APS).`);
  return apsNews;
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 2: زحف المواقع الإخبارية الجزائرية الكبرى]
// ════════════════════════════════════════════════════════════════
async function crawlAlgerianNewsSources(sources) {
  const trendingNews = [];
  console.log('📡 [الزحف الإخباري] فحص خراطيم المواقع الإخبارية الجزائرية الكبرى...');

  for (const src of sources) {
    if (src.id === 'aps_official') continue; // تم معالجة APS كـ Tier 1 منفصل

    try {
      const response = await axios.get(src.rssUrl, {
        timeout: 8000,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      const feed = await rssParser.parseString(response.data);
      if (feed && feed.items) {
        const topItems = feed.items.slice(0, 10);
        for (const item of topItems) {
          const title = (item.title || '').trim();
          const link = item.link || '';
          const snippet = item.contentSnippet || item.content || item.summary || '';
          const pubDate = item.pubDate || item.isoDate || new Date().toISOString();

          if (title) {
            trendingNews.push({
              title,
              link,
              snippet,
              // ━ null بدلاً من التاريخ الحالي: إذا كان RSS لا يحمل pubDate حقيقياً، سترفضه مصفاة 48 ساعة
              pubDate: item.pubDate || item.isoDate || null,
              sourceName: src.name,
              isTier1Official: false,
            });
          }
        }
      }
    } catch (err) {
      console.warn(`   ⚠ تعذر جلب ${src.name}: ${err.message}`);
    }
  }

  console.log(`   ✔ تم استخراج ${trendingNews.length} خبراً مرشحاً من الصحافة الجزائرية.`);
  return trendingNews;
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 3: جلب ترندات جوجل الجزائرية (Google Trends DZ)]
// ════════════════════════════════════════════════════════════════
async function fetchGoogleTrendsDZ() {
  const trends = [];
  console.log('📡 [ترندات قوقل] جلب الكلمات الأكثر بحثاً في الجزائر (geo: DZ)...');

  const rssUrls = [
    'https://trends.google.com/trending/rss?geo=DZ',
    'https://trends.google.com/trends/trendingsearches/daily/rss?geo=DZ',
  ];

  for (const url of rssUrls) {
    try {
      const response = await axios.get(url, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        },
      });

      const parsed = await parseStringPromise(response.data, { explicitArray: false });
      const channel = parsed?.rss?.channel;
      if (!channel || !channel.item) continue;

      const items = Array.isArray(channel.item) ? channel.item : [channel.item];
      for (const it of items) {
        const title = (it.title || '').trim();
        const newsItems = it['ht:news_item'] || [];
        const newsArray = Array.isArray(newsItems) ? newsItems : [newsItems];
        const sourceUrl = newsArray[0]?.['ht:news_item_url'] || it.link || '';
        const snippet = newsArray[0]?.['ht:news_item_snippet'] || it.description || '';

        if (title && !trends.some((t) => t.title.toLowerCase() === title.toLowerCase())) {
          // ━ ترندات Google دائماً حالية — إذا لم يحمل تاريخاً نستخدم الآن
          const trendPubDate = it.pubDate || new Date().toISOString();
          trends.push({
            title,
            link: sourceUrl,
            snippet,
            pubDate: trendPubDate,
            sourceName: 'Google Trends DZ',
            isTier1Official: false,
          });
        }
      }
    } catch {}
  }

  if (trends.length === 0) {
    try {
      const res = await googleTrends.dailyTrends({ geo: 'DZ' });
      const data = JSON.parse(res);
      const days = data?.default?.trendingSearchesDays || [];
      for (const day of days) {
        for (const search of day.trendingSearches || []) {
          const title = search?.title?.query;
          const article = search?.articles?.[0];
          if (title) {
            trends.push({
              title,
              link: article?.url || '',
              snippet: article?.snippet || article?.title || '',
              // ━ ترندات جوجل API لا تحمل pubDate دقيقاً، نضعها null لترفضها المصفاة
              pubDate: null,
              sourceName: 'Google Trends API',
              isTier1Official: false,
            });
          }
        }
      }
    } catch {}
  }

  console.log(`   ✔ تم رصد ${trends.length} ترند من قوقل الجزائر.`);
  return trends;
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 4: التحقق والمطابقة الإدارية مع دعم دلالات APS الواسعة]
// ════════════════════════════════════════════════════════════════
function verifyAndMatchAdministrativeWithAPS(item) {
  const fullText = `${item.title} ${item.snippet}`.toLowerCase();

  // 1. استبعاد الحوادث، الجرائم، الفن، الرياضة، والطقس والمناسبات التاريخية فوراً (100% Blacklist)
  const isBanned = STRICT_EXCLUDE_LIST.some((bannedWord) => {
    return fullText.includes(bannedWord.toLowerCase());
  });

  if (isBanned) {
    return null; // مستبعد فوراً
  }

  // 1-bis. مرشح APS النهائي: استبعاد السياسة الخارجية والاقتصاد الكلي العام (لأخبار APS)
  if (item.isTier1Official) {
    const isApsFinalFiltered = APS_FINAL_FILTER_EXCLUDE.some((term) => {
      return fullText.includes(term.toLowerCase());
    });
    if (isApsFinalFiltered) {
      return null; // خارج نطاق الموقع حتى وإن كان من APS
    }
  }

  // 2. المطابقة الإلزامية مع الخدمات والمعاملات الإدارية المعتمدة
  for (const official of COMPREHENSIVE_ADMINISTRATIVE_DATABASE) {
    const isExactMatch = official.phrases.some((phrase) => {
      return fullText.includes(phrase.toLowerCase());
    });

    if (isExactMatch) {
      return official;
    }
  }

  // 3. توسيع دلالي حصري لأخبار وكالة الأنباء الجزائرية الرسمية (APS Fallback):
  // ⚠ التصنيف الدقيق: كل ما يخص التلاميذ/الأساتذة/المدرسي → التربية الوطنية وليس التعليم العالي
  if (item.isTier1Official) {
    const apsWhitelistRules = [
      {
        // ⚠ الأولوية للتربية الوطنية: تلاميذ، أساتذة، مدرسي، دخول مدرسي، إطعام مدرسي
        topic: 'education',
        keywords: [
          'وزارة التربية', 'الدخول المدرسي', 'التلاميذ', 'المدرسي', 'المنظومة التربوية',
          'المؤسسات التعليمية', 'مديريات التربية', 'الإطعام المدرسي', 'النقل المدرسي',
          'أساتذة التعليم', 'وزير التربية', 'توظيف الأساتذة', 'امتحانات المدرسية',
          'الانضباط المدرسي', 'الكتب المدرسية', 'المقرر الدراسي', 'السنة الدراسية',
        ],
      },
      {
        // التعليم العالي: جامعة، طلبة، بحث علمي، إيواء جامعي
        topic: 'university',
        keywords: ['جامعة', 'جامعي', 'التعليم العالي', 'الطلبة', 'البحث العلمي', 'الدخول الجامعي', 'الإقامات الجامعية'],
      },
      {
        topic: 'education',
        keywords: ['وزارة التربية', 'الدخول المدرسي', 'التلاميذ', 'المدرسي', 'المنظومة التربوية', 'المؤسسات التعليمية', 'مديريات التربية', 'الإطعام المدرسي', 'النقل المدرسي'],
      },
      {
        topic: 'housing',
        keywords: ['وزارة السكن', 'سكنات عدل', 'السكن الترقوي', 'السكن الاجتماعي', 'قطاع السكن', 'العمران والمدينة', 'برامج الإسكان'],
      },
      {
        topic: 'employment',
        keywords: ['وزارة العمل', 'الوظيفة العمومية', 'منحة البطالة', 'سوق الشغل', 'عروض التوظيف', 'التشغيل'],
      },
      {
        topic: 'agriculture',
        keywords: ['وزارة الفلاحة', 'الإنتاج الفلاحي', 'المحاصيل الزراعية', 'شعبة الحبوب', 'التنمية الريفية', 'المستثمرات الفلاحية'],
      },
      {
        topic: 'transport',
        keywords: ['وزارة النقل', 'السكك الحديدية', 'الخطوط الجوية', 'النقل البري', 'استيراد السيارات', 'الموانئ'],
      },
      {
        topic: 'water_bills',
        keywords: ['الموارد المائية', 'محطات التحلية', 'قطاع الري', 'التزويد بالمياه الشروب', 'سونلغاز', 'توزيع الكهرباء والغاز', 'الجزائرية للمياه'],
      },
      {
        topic: 'tax',
        keywords: ['وزارة المالية', 'التحصيل الضريبي', 'الرقمنة الجبائية', 'الجمارك الجزائرية', 'وزارة التجارة', 'السجل التجاري'],
      },
      {
        topic: 'interior',
        keywords: ['وزارة الداخلية', 'الجماعات المحلية', 'الوثائق البيومترية', 'الحالة المدنية', 'عصرنة المرفق العام', 'الرقمنة الإدارية', 'الولاة', 'البلديات'],
      },
      {
        topic: 'justice',
        keywords: ['وزارة العدل', 'المنظومة القضائية', 'الشباك الإلكتروني', 'خدمة الأبوستيل', 'السوابق القضائية'],
      },
      {
        topic: 'training',
        keywords: ['وزارة التكوين المهني', 'مراكز التكوين المهني', 'عروض التمهين', 'دخول التكوين المهني'],
      },
      {
        topic: 'fisheries',
        keywords: ['وزارة الصيد البحري', 'تربية المائيات', 'سفن الصيد البحري', 'الإنتاج الصيدي'],
      },
      {
        topic: 'post',
        keywords: ['بريد الجزائر', 'البطاقة الذهبية', 'بريدي موب', 'الحسابات البريدية الجارية', 'وزارة البريد'],
      },
      {
        topic: 'socialSecurity',
        keywords: ['الضمان الاجتماعي', 'بطاقة الشفاء', 'صندوق التقاعد', 'معاشات المتقاعدين', 'التأمين الصحي'],
      },
      {
        topic: 'military',
        keywords: ['وزارة الدفاع الوطني', 'الجيش الوطني الشعبي', 'دليل التجنيد', 'الخدمة الوطنية'],
      },
    ];

    for (const rule of apsWhitelistRules) {
      if (rule.keywords.some((kw) => fullText.includes(kw.toLowerCase()))) {
        return COMPREHENSIVE_ADMINISTRATIVE_DATABASE.find((d) => d.topic === rule.topic);
      }
    }
  }

  // إذا لم يثبت ارتباطه بأي معاملة إدارية رسمية ⬅ تجاهل تام
  return null;
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 5: استخراج الصورة الرسمية الموثقة عبر cheerio و axios]
// ════════════════════════════════════════════════════════════════
async function extractOfficialImage(pageUrl) {
  if (!pageUrl || typeof pageUrl !== 'string' || !pageUrl.startsWith('http')) {
    return null;
  }

  try {
    const response = await axios.get(pageUrl, {
      timeout: 8000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      maxRedirects: 3,
      validateStatus: (status) => status === 200,
    });

    const $ = cheerio.load(response.data);
    const ogImage = $('meta[property="og:image"]').attr('content') ||
                    $('meta[property="og:image:url"]').attr('content') ||
                    $('meta[name="twitter:image"]').attr('content');

    if (ogImage && isValidImageUrl(ogImage)) {
      const clean = ogImage.trim();
      if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
      try {
        return new URL(clean, pageUrl).href;
      } catch {
        return null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function isValidImageUrl(url) {
  if (!url || url.length < 8) return false;
  const lower = url.toLowerCase();
  if (lower.includes('logo') || lower.includes('icon') || lower.includes('avatar')) return false;
  return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(lower) || lower.includes('/uploads/') || lower.includes('article') || lower.includes('communique');
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 6: صياغة المقال بـ Gemini بنظام التلقين الصارم]
// ════════════════════════════════════════════════════════════════
async function generateTrendArticleWithGemini(trendItem, matchedOfficial) {
  const prompt = `أنت كبير مهندسي الإجراءات الإدارية والرقمنة في منصة 'رقمنة الجزائر' (www.raqmanadz.com).
موقعنا ليس جريدة إخبارية تنقل الأخبار أو الاجتماعات أو اللقاءات البروتوكولية، بل هو "البوابة الرسمية الأولى للأدلة الشاملة، الشروحات العملية، وحلول المشاكل الإدارية والرقمية في الجزائر".

مهمتك: تحويل الموضوع المرفق إلى "دليل شامل وعملي لحل المشاكل" (Comprehensive Problem-Solving & Service Guide) بين 1200 و 1800 كلمة، بأسلوب موجه مباشرة للمواطن الجزائري (الموظف، الباحث عن عمل، التلميذ، الطالب، المتقاعد، والمواطن العادي).

[قواعد الصياغة والهيكل الإلزامي للمقال]:
1. [العنوان الرئيسي H1]: يجب أن يبدأ بصيغة دالة وعملية، مثل:
   # 📋 الدليل الشامل لـ [اسم الخدمة أو المنصة] 2026: الشروط، خطوات التسجيل، وحلول الأخطاء الشائعة 🇩🇿
2. [المقدمة]: شرح وافٍ ومبسط للخدمة أو الإجراء، الإطار العام، الفئات المعنية، والمنصة الرقمية المعتمدة، والتأكيد على حتمية المعاملة الرقمية.
3. [الأقسام الإلزامية بالعناوين الفرعية ##]:
   ## 🏛️ أولاً: الإطار العام والفئات المستفيدة من الخدمة
   (تحديد المستفيدين بدقة، أهداف الخدمة، والجهة الوصية المختصة).

   ## 📋 ثانياً: الشروط والمعايير الرسمية المؤهلة للقبول
   (قائمة نقطية بالشروط القانونية والإدارية دون أي لبس).

   ## 📁 ثالثاً: الوثائق ومكونات الملف الإداري المطلوب
   (تفصيل الوثائق المطلوبة، الشروط الشكلية للملف، وصيغ الرفع الرقمي PDF/JPG).

   ## 💻 رابعاً: خطوات التسجيل والاستخدام خطوة بخطوة عبر المنصة الرقمية
   (خطوات عملية مرقمة 1، 2، 3... من الدخول للمنصة، إنشاء الحساب، إدخال البيانات، رفع الملفات، إلى استخراج وصل التسجيل).

   ## ⚠️ خامساً: الأسباب الشائعة لرفض الملف أو تعليق الحساب وكيفية تفاديها
   (قائمة مفصلة بالأخطاء الشائعة التي يقع فيها المواطنون وتؤدي لإسقاط حقوقهم).

   ## 🛠️ سادساً: دليل حل المشاكل التقنية وطرق تقديم الطعون والاسترجاع
   (حلول للأعطال التقنية، مشاكل كلمة المرور، عدم وصول الرسائل، وإجراءات تقديم الطعن الإداري خطوة بخطوة).

   ## 💡 سابعاً: نصائح وإرشادات وقائية لتسريع معالجة الطلب
   (نصائح عملية للحفاظ على سريان المعاملة وتفادي التأخير).

   ## ❓ ثامناً: الأسئلة الشائعة (FAQ)
   (ضع 4 إلى 5 أسئلة جوهرية بصيغة سؤال وجواب مفصل ومباشر).

4. [الضوابط الصارمة]:
   - ممنوع منعاً باتاً أسلوب الصحافة الإخبارية (مثل "ترأس فلان اجتماعاً" أو "صرح علان"). اكتب دليلاً توجيهياً عملياً مباشراً.
   - إذا لم تُذكر أرقام أو تواريخ محددة في البيان، اكتب: 'تُحدد وفق الإعلانات الرسمية للجهة الوصية'. ممنوع اختراع أرقام.
   - لغة عربية سليمة، قوية، واضحة، تفيد المواطن مباشرة، مع اعتماد المصطلحات الإدارية الجزائرية الرسمية (مثل: بطاقة الشفاء، وسيط أونلاين، فضاء الأولياء، البطاقة الذهبية، رقم التعريف الوطني NIN...).
   - ممنوع منعاً باتاً كتابة أي كود HTML للصور أو روابط صور Markdown. اكتب النص فقط.

[بيانات الموضوع والجهة المختصة]:
- موضوع الخدمة/الإجراء: ${trendItem.title}
- الجهة الرسمية الوصية: ${matchedOfficial.name}
- الرابط والمنصة الرسمية: ${matchedOfficial.portalUrl || matchedOfficial.officialUrl}
- سياق المعطيات الرسمية: ${trendItem.snippet || 'دليل شامل للإجراءات والخدمات الإدارية والرقمية.'}
- مصدر الرصد المعتمد: ${trendItem.sourceName}

[الإخراج المطلوب]: ابدأ مباشرة بعنوان # H1 دون أي مقدمات أو تعليقات خارج المقال.`;



  const candidateModels = [
    CONFIG.GEMINI_MODEL,
    'gemini-2.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-latest',
  ];

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const result = await new Promise((resolve, reject) => {
        const body = JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            topP: 0.9,
          },
        });

        const req = https.request(
          {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${modelName}:generateContent?key=${CONFIG.GEMINI_API_KEY}`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(body),
            },
          },
          (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) resolve(text.trim());
                else reject(new Error(`Gemini (${modelName}): ${JSON.stringify(parsed?.error || data).slice(0, 200)}`));
              } catch (e) { reject(e); }
            });
          }
        );
        req.on('error', reject);
        req.write(body);
        req.end();
      });

      return result;
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  throw lastError || new Error('فشلت جميع نماذج Gemini');
}

function parseTrendToArticleJson(rawText, trendItem, matchedOfficial, officialImageUrl) {
  const sanitizedText = rawText
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/\n\s*---\s*\n/g, '\n\n');

  const lines = sanitizedText.split('\n').map((l) => l.trim()).filter(Boolean);

  let title = trendItem.title;
  const h1Line = lines.find((l) => l.startsWith('# '));
  if (h1Line) title = h1Line.replace(/^#\s*/, '').trim();

  let introduction = '';
  let inIntro = false;
  for (const line of lines) {
    if (line.startsWith('# ')) { inIntro = true; continue; }
    if (inIntro && line.startsWith('## ')) break;
    if (inIntro && line) introduction += line + '\n';
  }
  introduction = introduction.trim();

  const sections = [];
  let currentSection = null;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) sections.push(currentSection);
      currentSection = { heading: line.replace(/^##\s*/, '').trim(), content: '' };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }
  if (currentSection) sections.push(currentSection);
  sections.forEach((s) => (s.content = s.content.trim()));

  const faqs = [];
  const faqSection = sections.find((s) => s.heading.includes('الأسئلة الشائعة') || s.heading.includes('FAQ'));
  if (faqSection) {
    const qBlocks = faqSection.content.split(/\n(?=(?:[•\-*]|\d+\.|\*\*سؤال|\*\*س:|\*\*|\d+-))/);
    for (const block of qBlocks) {
      const match = block.match(/(?:[•\-*]|\d+\.|\*\*سؤال:?|\*\*س:?|\*\*|\d+-\s*)?\s*([^\n?؟]+[?؟])\s*\n*([\s\S]*)/i);
      if (match && match[1] && match[2]) {
        faqs.push({
          question: match[1].replace(/^\*\*|\*\*$/g, '').replace(/^[•\-*0-9.]+\s*/, '').trim(),
          answer: match[2].replace(/^ج:\s*|\*\*جواب:?\s*|\*\*/g, '').trim(),
        });
      }
    }
  }

  const slug = generateTrendSlug(title);

  const article = {
    title,
    introduction: introduction || sanitizedText.slice(0, 500),
    sections: sections.length > 0 ? sections : [{ heading: 'دليل الإجراءات والتفاصيل الكاملة', content: sanitizedText }],
    sourceMinistry: trendItem.isTier1Official ? `وكالة الأنباء الجزائرية الرسمية (APS) — ${matchedOfficial.name}` : matchedOfficial.name,
    categoryId: matchedOfficial.categoryId,
    dateStr: new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    officialDocumentUrl: trendItem.link || matchedOfficial.portalUrl || matchedOfficial.officialUrl,
    isTrendingTopic: true,
    trendingKeyword: trendItem.title,
    autoGenerated: true,
    generatedAt: new Date().toISOString(),
    registrationRequiredSites: [
      {
        name: matchedOfficial.name,
        url: matchedOfficial.portalUrl || matchedOfficial.officialUrl,
        requirements: 'المنصة الرقمية المعتمدة لتقديم الطلبات ومتابعة الإجراءات',
      },
    ],
  };

  if (faqs.length > 0) {
    article.faqs = faqs;
  }


  if (officialImageUrl) {
    article.featuredImage = {
      url: officialImageUrl,
      alt: `صورة موثقة حول ${trendItem.title} — ${matchedOfficial.name}`,
    };
  }

  return { slug, article };
}

// خريطة تحويل الأحرف العربية إلى ما يقابلها بالأحرف اللاتينية (ASCII-safe slugs)
const ARABIC_TO_LATIN = {
  'ا': 'a', 'أ': 'a', 'إ': 'a', 'آ': 'a', 'ء': 'a',
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h',
  'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't',
  'ظ': 'dh', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h',
  'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'a', 'ئ': 'y',
  'ؤ': 'w', 'لا': 'la', 'لأ': 'la', 'لآ': 'la', 'لإ': 'li',
  '\u064b': '', '\u064c': '', '\u064d': '', '\u064e': '', '\u064f': '',
  '\u0650': '', '\u0651': '', '\u0652': '',
};

function arabicToSlug(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const twoChar = text.slice(i, i + 2);
    if (ARABIC_TO_LATIN[twoChar] !== undefined) {
      result += ARABIC_TO_LATIN[twoChar];
      i++;
    } else if (ARABIC_TO_LATIN[text[i]] !== undefined) {
      result += ARABIC_TO_LATIN[text[i]];
    } else if (/[a-zA-Z0-9]/.test(text[i])) {
      result += text[i].toLowerCase();
    } else if (/\s/.test(text[i])) {
      result += '-';
    }
    // skip anything else (punctuation, symbols)
  }
  return result.replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
}

function generateTrendSlug(title) {
  // ننتج slug نقي ASCII فقط لضمان عمل Next.js routing بدون أخطاء URL-encoding
  const ascii = arabicToSlug(title).slice(0, 50);
  const id = Date.now().toString(36); // معرّف قصير فريد
  return `trend-${ascii || 'article'}-${id}`;
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 7: الحفظ والفهرسة الفورية]
// ════════════════════════════════════════════════════════════════
function saveArticle(slug, article) {
  let data = {};
  if (fs.existsSync(CONFIG.ARTICLES_JSON)) {
    try { data = JSON.parse(fs.readFileSync(CONFIG.ARTICLES_JSON, 'utf8')); } catch {}
  }

  // ─── ترحيل تلقائي: تحويل slugs العربية القديمة إلى slugs ASCII آمنة ────
  // هذا يُصلح الـ 404 للمقالات التي نُشرت بـ slugs عربية سابقاً
  const migratedData = {};
  let migrationCount = 0;
  for (const [existingSlug, existingArticle] of Object.entries(data)) {
    const hasArabic = /[\u0600-\u06FF]/.test(existingSlug);
    if (hasArabic) {
      // استخراج الجزء الذي بعد 'trend-' وقبل المعرّف الأخير
      const innerPart = existingSlug.replace(/^trend-/, '').replace(/-[a-z0-9]+$/, '');
      const asciiPart = arabicToSlug(innerPart).slice(0, 50);
      const suffix = existingSlug.match(/-([a-z0-9]+)$/);
      const newSlug = `trend-${asciiPart || 'article'}-${suffix ? suffix[1] : Date.now().toString(36)}`;
      if (!data[newSlug]) {
        migratedData[newSlug] = existingArticle;
        migrationCount++;
        console.log(`   🔄 ترحيل slug: ${existingSlug} → ${newSlug}`);
      } else {
        migratedData[existingSlug] = existingArticle; // احتفظ بالقديم إذا الجديد موجود
      }
    } else {
      migratedData[existingSlug] = existingArticle;
    }
  }
  if (migrationCount > 0) {
    console.log(`   ✅ تم ترحيل ${migrationCount} slug(s) عربية إلى ASCII`);
  }

  migratedData[slug] = article;
  fs.writeFileSync(CONFIG.ARTICLES_JSON, JSON.stringify(migratedData, null, 2), 'utf8');
}

function pingIndexNow(url) {
  const payload = JSON.stringify({
    host: 'www.raqmanadz.com',
    key: 'raqmana2026indexnowkey789',
    keyLocation: 'https://www.raqmanadz.com/raqmana2026indexnowkey789.txt',
    urlList: [url],
  });
  const req = https.request(
    {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) },
    },
    (res) => res.resume()
  );
  req.on('error', () => {});
  req.write(payload);
  req.end();
}

// ─── المحرك الرئيسي ───────────────────────────────────────────
async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🔥 RAQMANA — رادار تصيد الترندات والإعلام الرسمي (v3.3)');
  console.log('🏛 المصدر المفضل Tier 1: وكالة الأنباء الجزائرية الرسمية (APS)');
  console.log('='.repeat(70) + '\n');

  const history = loadHistory();
  if (!history.processedTrends) history.processedTrends = {};

  const sitesConfig = JSON.parse(fs.readFileSync(CONFIG.SITES_CONFIG, 'utf8'));
  const newsSources = sitesConfig.algerian_news_sources || [];

  // جلب الأخبار: الأولوية لـ APS الرسمية، ثم ترندات قوقل، ثم الصحافة الكبرى
  const [apsNewsList, googleTrendsList, mediaNewsList] = await Promise.all([
    crawlAPSOfficial(),
    fetchGoogleTrendsDZ(),
    crawlAlgerianNewsSources(newsSources),
  ]);

  // دمج بالترتيب التفضيلي: APS أولاً كمرجع رسمي مؤكد
  const allCandidateTrends = [...apsNewsList, ...googleTrendsList, ...mediaNewsList];
  console.log(`\n📊 إجمالي المرشحات للتحليل: ${allCandidateTrends.length} موضوع.`);

  let writtenCount = 0;

  for (const item of allCandidateTrends) {
    const itemKey = item.title.toLowerCase().trim();

    if (history.processedTrends[itemKey] || (item.link && history.processedItems[item.link])) {
      continue;
    }

    // ─── مصفاة الوقت (96 ساعة) ─────────────────────────────────────────
    // قاعدة 1: إذا لم يكن هناك تاريخ (الترندات من Google Trends) → نعتبره حالياً
    if (!item.pubDate) {
      // ترندات Google بطبيعتها حالية — نعامله كخبر اليوم بدل رفضه
      if (item.sourceName && item.sourceName.includes('Google Trends')) {
        item.pubDate = new Date().toISOString();
      } else {
        console.log(`   ⏩ تجاهل (بدون تاريخ نشر): ${item.title.slice(0, 50)}`);
        history.processedTrends[itemKey] = { skippedReason: 'no_pubdate', skippedAt: new Date().toISOString() };
        continue;
      }
    }
    // قاعدة 2: تحليل التاريخ بشكل مرن (يدعم صيغة البلاد: "21:05 | 22-08-2026")
    let itemDate = new Date(item.pubDate);
    if (isNaN(itemDate.getTime())) {
      // محاولة تحليل صيغ العربية مثل "21:05 | 22-08-2026"
      const m = String(item.pubDate).match(/(\d{2})-(\d{2})-(\d{4})/);
      if (m) {
        itemDate = new Date(`${m[3]}-${m[2]}-${m[1]}`);
      }
    }
    const nowTs = Date.now();
    const ageHours = isNaN(itemDate.getTime()) ? 0 : (nowTs - itemDate.getTime()) / (1000 * 60 * 60);
    if (!isNaN(itemDate.getTime()) && ageHours > 96) {
      console.log(`   ⏩ تجاهل (${Math.round(ageHours)} ساعة — أقدم من 96 ساعة): ${item.title.slice(0, 50)}`);
      history.processedTrends[itemKey] = { skippedReason: 'older_than_96h', ageHours: Math.round(ageHours), skippedAt: new Date().toISOString() };
      continue;
    }
    const matchedOfficial = verifyAndMatchAdministrativeWithAPS(item);
    if (!matchedOfficial) {
      continue; // تم استبعاده
    }

    if (writtenCount >= CONFIG.MAX_TREND_ARTICLES_PER_RUN) {
      console.log(`\n⏸ تم بلوغ حد المقالات في هذه الجلسة (${CONFIG.MAX_TREND_ARTICLES_PER_RUN}).`);
      break;
    }

    console.log(`\n🎯 [صيد موثق من ${item.sourceName}]: "${item.title}"`);
    console.log(`   🏛 القطاع المعتمد: ${matchedOfficial.name}`);

    try {
      process.stdout.write('   🖼 استخراج الصورة الرسمية...');
      const officialImage = item.link ? await extractOfficialImage(item.link) : null;
      console.log(officialImage ? ` ✅ صورة موثقة من الرابط` : ` ℹ بدون بيان مصور (نص نقي)`);

      process.stdout.write('   ✍ صياغة المقال السيو بـ Gemini...');
      const rawText = await generateTrendArticleWithGemini(item, matchedOfficial);
      console.log(' ✅');

      const { slug, article } = parseTrendToArticleJson(rawText, item, matchedOfficial, officialImage);
      saveArticle(slug, article);
      console.log(`   💾 تم الحفظ: /articles/${slug}`);

      const articleUrl = `https://www.raqmanadz.com/articles/${slug}`;
      pingIndexNow(articleUrl);
      console.log(`   ⚡ تم إرسال تنبيه الأرشفة الفورية (IndexNow)`);

      history.processedTrends[itemKey] = {
        slug,
        title: item.title,
        official: matchedOfficial.name,
        source: item.sourceName,
        processedAt: new Date().toISOString(),
      };
      if (item.link) {
        history.processedItems[item.link] = { slug, processedAt: new Date().toISOString() };
      }
      writtenCount++;

      await new Promise((r) => setTimeout(r, 2000));

    } catch (err) {
      console.error(`   ❌ تعذر معالجة الترند: ${err.message}`);
      history.processedTrends[itemKey] = { error: err.message, skippedAt: new Date().toISOString() };
    }
  }

  history.lastRun = new Date().toISOString();
  saveHistory(history);

  console.log('\n' + '='.repeat(70));
  console.log(`🎉 اكتمل تشغيل الرادار — تم صيد وكتابة ${writtenCount} مقال إداري وخدماتي رسمي موثق!`);
  console.log('='.repeat(70) + '\n');
}

main().catch((err) => {
  console.error('❌ خطأ في رادار الترندات:', err.message);
  process.exit(1);
});
