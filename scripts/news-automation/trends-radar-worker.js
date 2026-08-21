/**
 * trends-radar-worker.js — رادار ترندات قوقل والإعلام الجزائري (v3.2 — النطاق الإداري والخدماتي الشامل)
 * =====================================================================================================
 * 🎯 نطاق العمل الحصري لموقع "راقمنا" (267 خدمة وهيئة حكومية):
 * 1. الإدارة والوثائق: الحالة المدنية، الجواز البيومتري، بطاقة التعريف، شهادة الميلاد، رخصة السياقة بالتنقيط، السوابق القضائية، الأبوستيل (Apostille).
 * 2. العمل والتوظيف: مسابقات التوظيف، عروض العمل، منحة البطالة وتجديدها، منصة وسيط ANEM، مسابقات الأساتذة والوظيفة العمومية.
 * 3. التربية والتعليم: فضاء الأولياء، أوليائي، التسجيلات المدرسية، كشف النقاط، البكالوريا، البيام، المنحة المدرسية 5000، التعليم عن بعد والمراسلة ONEFD.
 * 4. التكوين المهني: منصة مهنتي، معاهد CFPA، عروض التمهين والتكوين.
 * 5. التعليم العالي: منصة بروقرس Progres، التحويلات الجامعية، التسجيلات، المنحة الجامعية، الإيواء.
 * 6. السكن والعقار: سكنات عدل (AADL 3)، شروط التسجيل، طعون عدل، سكن ترقوي LPP/LPA، شهادة السلبية، المحافظة العقارية.
 * 7. البريد والمالية: بريد الجزائر، البطاقة الذهبية، بريدي موب، الحساب البريدي CCP/ECCP، الدفع الإلكتروني.
 * 8. الضمان والتقاعد والصحة: بطاقة الشفاء، فضاء الهناء، CNAS، CASNOS، منحة وزيادة التقاعد CNR، المواعيد الطبية.
 * 9. الضرائب والتجارة: المقاول الذاتي ANAE، السجل التجاري (سجلكم Sidjilcom)، الرقم الجبائي NIF، الجمارك الجزائرية.
 * 10. الجيش والتجنيد: تسجيلات الجيش الوطني الشعبي (MDN)، دليل التجنيد، تسوية الخدمة الوطنية والإعفاء والتأجيل.
 * 11. الفلاحة والصيد والري: الدعم الفلاحي، منصات الفلاحة، الصيد البحري، الموارد المائية.
 * 12. الفواتير والخدمات: فواتير سونلغاز، الجزائرية للمياه ADE، سيال، اتصالات الجزائر، بوابة dzds.dz.
 *
 * ⛔ أي موضوع خارج هذا النطاق (حوادث، جرائم، رياضة، فن، طقس، سياسة دولية) يُحظر تماماً ويكتب 0 مقالات.
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
  // الرياضة وكرة القدم
  'مباراة', 'دوري', 'كأس', 'منتخب', 'مدرب', 'لاعب', 'أهداف', 'رونالدو', 'ميسي',
  'بلماضي', 'بيتكوفيتش', 'محرز', 'بلايلي', 'اتحاد العاصمة', 'مولودية', 'شبيبة القبائل',
  'شباب بلوزداد', 'وفاق سطيف', 'ريال', 'برشلونة', 'أرسنال', 'ليفربول', 'سيتي', 'marseille',
  // الفن والترفيه والمشاهير
  'أفلام', 'مسلسل', 'أغنية', 'فنان', 'مطرب', 'ممثلة', 'تيك توك', 'يوتيوب',
  // الطقس والمنوعات
  'طقس', 'نشرة جوية', 'أمطار رعدية', 'رياح قوية', 'حرارة قياسية', 'زلزال', 'هزة أرضية',
  // السياسة الدولية
  'روسيا', 'أوكرانيا', 'إسرائيل', 'غزة', 'ترامب', 'بايدن', 'ماكرون',
];

// ════════════════════════════════════════════════════════════════
// 🎯 قاعدة البيانات الإدارية والخدمية الشاملة (267 قطاعاً وخدمة)
// ════════════════════════════════════════════════════════════════
const COMPREHENSIVE_ADMINISTRATIVE_DATABASE = [
  // 1. التربية والتعليم والامتحانات الوطنية
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
    ],
  },
  // 2. التعليم العالي والبحث العلمي
  {
    topic: 'university',
    name: 'وزارة التعليم العالي والبحث العلمي (MESRS)',
    officialUrl: 'https://www.mesrs.dz',
    portalUrl: 'https://progres.mesrs.dz/webetu',
    categoryId: 'university',
    phrases: [
      'منصة بروقرس', 'منصة progres', 'التحويلات الجامعية', 'التسجيلات الجامعية',
      'منحة التعليم العالي', 'المنحة الجامعية', 'الإيواء الجامعي', 'توجيه حاملي البكالوريا',
      'مسابقة الدكتوراه', 'mesrs dz', 'معادلة الشهادات الجامعية',
    ],
  },
  // 3. التكوين والتعليم المهنيين
  {
    topic: 'training',
    name: 'وزارة التكوين والتعليم المهنيين',
    officialUrl: 'https://www.mfep.gov.dz',
    portalUrl: 'https://mihnati.mfep.gov.dz',
    categoryId: 'training',
    phrases: [
      'منصة مهنتي', 'التكوين المهني', 'معاهد التكوين المهني', 'مراكز cfpa',
      'التسجيل في التكوين المهني', 'عروض التمهين', 'شهادة الكفاءة المهنية', 'دليل التكوين المهني',
    ],
  },
  // 4. العمل والتشغيل والوظيفة العمومية
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
      'مسابقات التوظيف في الوظيف العمومي',
    ],
  },
  // 5. السكن والعقار والمدينة
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
      'المحافظة العقارية', 'مسح الأراضي', 'عقد الملكية العقارية',
    ],
  },
  // 6. البريد والمعاملات المالية الإلكترونية
  {
    topic: 'post',
    name: 'بريد الجزائر والنقد الآلي',
    officialUrl: 'https://www.poste.dz',
    portalUrl: 'https://eccp.poste.dz',
    categoryId: 'post',
    phrases: [
      'البطاقة الذهبية', 'بريد الجزائر', 'تطبيق بريدي موب', 'baridimob',
      'منصة eccp', 'الحساب البريدي الجاري ccp', 'طلب البطاقة الذهبية',
      'الدفع الإلكتروني عبر الإنترنت cib', 'تطبيق بريدي باي',
    ],
  },
  // 7. الضمان الاجتماعي والتقاعد
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
  // 8. الداخلية، الحالة المدنية، ورخص السياقة
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
    ],
  },
  // 9. العدل، صحيفة السوابق القضائية، وخدمة الأبوستيل (Apostille)
  {
    topic: 'justice',
    name: 'وزارة العدل ومنصة الشباك الإلكتروني الموحد',
    officialUrl: 'https://www.mjustice.dz',
    portalUrl: 'https://portail.mjustice.dz',
    categoryId: 'justice',
    phrases: [
      'خدمة الأبوستيل', 'تصديق الوثائق الرسمية apostille', 'شهادة السوابق القضائية عبر الإنترنت',
      'صحيفة السوابق القضائية رقم 3', 'شهادة الجنسية الجزائرية الإلكترونية', 'الشباك الإلكتروني لوزارة العدل',
      'استخراج الأحكام القضائية إلكترونياً',
    ],
  },
  // 10. الضرائب، السجل التجاري، والمقاول الذاتي
  {
    topic: 'tax',
    name: 'المديرية العامة للضرائب، السجل التجاري، والوكالة الوطنية للمقاول الذاتي',
    officialUrl: 'https://www.mfdgi.gov.dz',
    portalUrl: 'https://anae.dz',
    categoryId: 'tax',
    phrases: [
      'المقاول الذاتي', 'بطاقة المقاول الذاتي anae', 'منصة anae dz', 'السجل التجاري الإلكتروني',
      'منصة سجلكم', 'sidjilcom cnrc', 'الرقم الجبائي nif', 'التصريح الجبائي الإلكتروني',
      'جباية dz', 'الجمارك الجزائرية', 'منصة ألجكس algex',
    ],
  },
  // 11. وزارة الدفاع الوطني، الخدمة الوطنية، والتجنيد
  {
    topic: 'military',
    name: 'وزارة الدفاع الوطني (MDN) والخدمة الوطنية',
    officialUrl: 'https://www.mdn.dz',
    portalUrl: 'https://preinscription.mdn.dz',
    categoryId: 'military',
    phrases: [
      'تسجيلات الجيش الوطني الشعبي', 'دليل التجنيد mdn', 'تجنيد الضباط وضباط الصف',
      'موقع وزارة الدفاع الوطني', 'تسوية وضعية الخدمة الوطنية', 'بطاقة الإعفاء من الخدمة الوطنية',
      'تأجيل الخدمة الوطنية للطلبة', 'مدارس أشبال الأمة',
    ],
  },
  // 12. الفلاحة، التنمية الريفية، والغابات
  {
    topic: 'agriculture',
    name: 'وزارة الفلاحة والتنمية الريفية',
    officialUrl: 'https://madr.gov.dz',
    portalUrl: 'https://madr.gov.dz',
    categoryId: 'agriculture',
    phrases: [
      'الدعم الفلاحي', 'بطاقة الفلاح', 'منصة الدعم الفلاحي', 'الغرفة الوطنية للفلاحة',
      'حفر الآبار الفلاحية', 'استصلاح الأراضي الفلاحية', 'الصندوق الوطني للتعاون الفلاحي',
    ],
  },
  // 13. الصيد البحري وتربية المائيات
  {
    topic: 'fisheries',
    name: 'وزارة الصيد البحري والمنتجات الصيدية',
    officialUrl: 'https://mpeche.gov.dz',
    portalUrl: 'https://mpeche.gov.dz',
    categoryId: 'agriculture',
    phrases: [
      'الصيد البحري', 'تربية المائيات', 'بطاقة مهنيي الصيد البحري', 'دعم سفن الصيد',
      'بوابة وزارة الصيد البحري',
    ],
  },
  // 14. الموارد المائية، الري، والفواتير
  {
    topic: 'water_bills',
    name: 'الجزائرية للمياه (ADE) وسونلغاز (Sonelgaz)',
    officialUrl: 'https://www.sonelgaz.dz',
    portalUrl: 'https://pay.sonelgaz.dz',
    categoryId: 'bills',
    phrases: [
      'فاتورة الكهرباء سونلغاز', 'دفع فاتورة سونلغاز عبر الإنترنت', 'تطبيق sonelgaz',
      'الجزائرية للمياه ade', 'دفع فاتورة المياه ade', 'تطبيق وكالتي سيال seal',
      'فواتير اتصالات الجزائر', 'تعبئة فضاء زبون اتصالات الجزائر',
    ],
  },
  // 15. النقل والمشاريع واستيراد السيارات
  {
    topic: 'transport',
    name: 'وزارة النقل والجمارك والخطوط الجوية الجزائرية',
    officialUrl: 'https://www.mintransport.gov.dz',
    portalUrl: 'https://airalgerie.dz',
    categoryId: 'transport',
    phrases: [
      'استيراد السيارات أقل من 3 سنوات', 'ترقيم المركبات ورخص السياقة', 'الخطوط الجوية الجزائرية air algerie',
      'الشركة الوطنية للنقل بالسكك الحديدية sntf', 'تذكرة النقل الإلكترونية', 'بطاقة الناقل المهني',
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
// [المرحلة 1: زحف المواقع الإخبارية الجزائرية الكبرى]
// ════════════════════════════════════════════════════════════════
async function crawlAlgerianNewsSources(sources) {
  const trendingNews = [];
  console.log('📡 [الزحف الإخباري] فحص خراطيم المواقع الإخبارية الجزائرية الكبرى...');

  for (const src of sources) {
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
              pubDate,
              sourceName: src.name,
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
// [المرحلة 2: جلب ترندات جوجل الجزائرية (Google Trends DZ)]
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
          trends.push({
            title,
            link: sourceUrl,
            snippet,
            pubDate: it.pubDate || new Date().toISOString(),
            sourceName: 'Google Trends DZ',
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
              pubDate: new Date().toISOString(),
              sourceName: 'Google Trends API',
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
// [المرحلة 3: التحقق والمطابقة الإدارية الحصرية 100%]
// ════════════════════════════════════════════════════════════════
function verifyAndMatchAdministrativeOnly(trendItem) {
  const fullText = `${trendItem.title} ${trendItem.snippet}`.toLowerCase();

  // 1. استبعاد الحوادث، الجرائم، الفن، الرياضة، والطقس فوراً
  const isBanned = STRICT_EXCLUDE_LIST.some((bannedWord) => {
    return fullText.includes(bannedWord.toLowerCase());
  });

  if (isBanned) {
    return null;
  }

  // 2. المطابقة الإلزامية مع إحدى الخدمات والمعاملات الإدارية الـ 15 المعتمدة
  for (const official of COMPREHENSIVE_ADMINISTRATIVE_DATABASE) {
    const isExactMatch = official.phrases.some((phrase) => {
      return fullText.includes(phrase.toLowerCase());
    });

    if (isExactMatch) {
      return official;
    }
  }

  // إذا لم يثبت ارتباطه بأي معاملة إدارية رسمية ⬅ تجاهل تام
  return null;
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 4: استخراج الصورة الرسمية الموثقة عبر cheerio و axios]
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
  return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(lower) || lower.includes('/uploads/') || lower.includes('communique');
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 5: صياغة المقال بـ Gemini بنظام التلقين الصارم]
// ════════════════════════════════════════════════════════════════
async function generateTrendArticleWithGemini(trendItem, matchedOfficial) {
  const prompt = `أنت محرر صحفي خبير في السيو. اكتب مقالاً احترافياً بين 1000 و 1500 كلمة يستوفي الشروط التالية:
1. عنوان رئيسي جذاب (H1)، مقدمة قوية، عناوين فرعية (H2, H3)، فقرات قصيرة، قوائم نقطية، خاتمة ودعوة لاتخاذ إجراء (CTA).
2. إذا لم يذكر البيان الرسمي أرقاماً معينة، اكتب حرفياً: 'لم يُكشف بعد عن الأرقام الرسمية'. ممنوع منعاً باتاً اختراع أو تخمين أرقام أو تواريخ.
3. اقتبس حرفياً الفقرة الرسمية الأولى من البيان مع وضع علامات تنصيص وذكر المصدر والجهة.
4. في نهاية المقال، أنشئ قسماً بعنوان "الأسئلة الشائعة" يضم 3 أسئلة وأجوبة تخص الموضوع.
5. ممنوع منعاً باتاً كتابة أي كود HTML للصور أو إضافة روابط صور، لأن السكريبت الخارجي يتكفل بالصور. أنت تكتب النص فقط.
6. يجب أن يكون اللغة عربية فصيحة، مع مراعاة المصطلحات المتداولة في الجزائر.

[بيانات الخدمة والمعاملة الحكومية المعتمدة]:
- موضوع الترند والخدمة: ${trendItem.title}
- الجهة الرسمية المختصة: ${matchedOfficial.name}
- الرابط والمنصة الرسمية: ${matchedOfficial.portalUrl || matchedOfficial.officialUrl}
- سياق الخبر ومعطياته: ${trendItem.snippet || 'دليل شامل حول الإجراءات والخدمات الإدارية.'}
- مصدر الرصد: ${trendItem.sourceName} (${trendItem.link || matchedOfficial.portalUrl})

[الإخراج المطلوب]: ابدأ مباشرة بعنوان # H1 دون أي هوامش أو تعليقات خارجية.`;

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

  const slug = generateTrendSlug(title);

  const article = {
    title,
    introduction: introduction || sanitizedText.slice(0, 500),
    sections: sections.length > 0 ? sections : [{ heading: 'دليل الإجراءات والتفاصيل الكاملة', content: sanitizedText }],
    sourceMinistry: matchedOfficial.name,
    categoryId: matchedOfficial.categoryId,
    dateStr: new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    officialDocumentUrl: matchedOfficial.portalUrl || matchedOfficial.officialUrl,
    isTrendingTopic: true,
    trendingKeyword: trendItem.title,
    autoGenerated: true,
    generatedAt: new Date().toISOString(),
    registrationRequiredSites: [
      {
        name: matchedOfficial.name,
        url: matchedOfficial.portalUrl || matchedOfficial.officialUrl,
        requirements: 'المنصة الرسمية المعتمدة',
      },
    ],
  };

  if (officialImageUrl) {
    article.featuredImage = {
      url: officialImageUrl,
      alt: `صورة موثقة حول ${trendItem.title} — ${matchedOfficial.name}`,
    };
  }

  return { slug, article };
}

function generateTrendSlug(title) {
  const clean = title
    .replace(/[^\u0621-\u064A0-9a-zA-Z\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 45);
  return `trend-${clean}-${Date.now().toString(36)}`.toLowerCase();
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 6: الحفظ والفهرسة الفورية]
// ════════════════════════════════════════════════════════════════
function saveArticle(slug, article) {
  let data = {};
  if (fs.existsSync(CONFIG.ARTICLES_JSON)) {
    try { data = JSON.parse(fs.readFileSync(CONFIG.ARTICLES_JSON, 'utf8')); } catch {}
  }
  data[slug] = article;
  fs.writeFileSync(CONFIG.ARTICLES_JSON, JSON.stringify(data, null, 2), 'utf8');
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
  console.log('🔥 RAQMANA — رادار تصيد الترندات والإعلام الجزائري (v3.2 الشامل)');
  console.log('🏛 النطاق: 267 قطاعاً إدارياً وخدمات رقمية ومعاملات عمومية حصراً');
  console.log('='.repeat(70) + '\n');

  const history = loadHistory();
  if (!history.processedTrends) history.processedTrends = {};

  const sitesConfig = JSON.parse(fs.readFileSync(CONFIG.SITES_CONFIG, 'utf8'));
  const newsSources = sitesConfig.algerian_news_sources || [];

  const [googleTrendsList, mediaNewsList] = await Promise.all([
    fetchGoogleTrendsDZ(),
    crawlAlgerianNewsSources(newsSources),
  ]);

  const allCandidateTrends = [...googleTrendsList, ...mediaNewsList];
  console.log(`\n📊 إجمالي المواضيع المرصودة للتحليل: ${allCandidateTrends.length} موضوع.`);

  let writtenCount = 0;

  for (const item of allCandidateTrends) {
    const itemKey = item.title.toLowerCase().trim();

    if (history.processedTrends[itemKey] || (item.link && history.processedItems[item.link])) {
      continue;
    }

    // 🛡 الفحص الصارم: استبعاد المحتوى غير الإداري + مطابقة الخدمات الـ 15
    const matchedOfficial = verifyAndMatchAdministrativeOnly(item);
    if (!matchedOfficial) {
      continue; // غير مطابق للخدمات الإدارية ⬅ تجاهل تام
    }

    if (writtenCount >= CONFIG.MAX_TREND_ARTICLES_PER_RUN) {
      console.log(`\n⏸ تم بلوغ حد المقالات في هذه الجلسة (${CONFIG.MAX_TREND_ARTICLES_PER_RUN}).`);
      break;
    }

    console.log(`\n🎯 [صيد إداري وخدماتي حقيقي مُوثّق]: "${item.title}"`);
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
