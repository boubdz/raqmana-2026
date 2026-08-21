/**
 * trends-radar-worker.js — رادار تصيد ترندات قوقل الجزائر وصناعة المقالات الحصرية
 * ==============================================================================
 * 1. رصد وتحليل Google Trends الحية في الجزائر (geo=DZ) لحظياً.
 * 2. فلترة ذكية لاختيار المواضيع الحكومية، الخدمات الرقمية، التوظيف، التعليم، والسكن.
 * 3. ربط الترند بالوزارة أو الهيئة الرسمية المعنية مع استخراج الرابط المعتمد.
 * 4. فحص واستخراج الصورة الرسمية عبر Node.js (إن وُجد بيان مصور)، وإلا ترك المقال نصياً نقياً.
 * 5. كتابة مقال سيو احترافي خارق (1000 - 1500 كلمة) بـ Gemini مع قسم الأسئلة الشائعة (FAQ).
 * 6. الفهرسة الفورية عبر IndexNow و Google Indexing API لاحتلال المرتبة الأولى في نتائج البحث.
 *
 * الاستخدام:
 *   node scripts/news-automation/trends-radar-worker.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const axios = require('axios');
const { parseStringPromise } = require('xml2js');
const cheerio = require('cheerio');

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
  ARTICLES_JSON: path.join(ROOT_DIR, 'lib', 'custom-articles-data.json'),
  STATE_FILE: path.join(__dirname, 'trends-state.json'),
  MAX_TREND_ARTICLES_PER_RUN: 2, // حد أقصى لمقالات الترند في الدورة الواحدة لضمان أقصى جودة
};

if (!CONFIG.GEMINI_API_KEY) {
  console.error('\n❌ GEMINI_API_KEY غير موجود. أضفه إلى .env.local أو GitHub Secrets.\n');
  process.exit(1);
}

// ─── 1. بنك الكلمات المفتاحية وفلتر تخصص الموقع ────────────────
const EXCLUDE_KEYWORDS = [
  // رياضة ومباريات
  'كرة', 'مباراة', 'فريق', 'دوري', 'كأس', 'رونالدو', 'ميسي', 'نادي', 'لاعب', 'هدف',
  'تصفيات', 'منتخب', 'ريال', 'برشلونة', 'أرسنال', 'ليفربول', 'سيتي', 'marseille',
  'madrid', 'barcelona', 'champions', 'league', 'football', 'match',
  // فن ومشاهير
  'مطرب', 'فنان', 'ممثل', 'مسلسل', 'أغنية', 'فيلم', 'سينما', 'تيك توك',
  // سياسة دولية غير خدمية
  'روسيا', 'أوكرانيا', 'إسرائيل', 'غزة', 'ترامب', 'بايدن',
];

const GOV_TOPIC_RULES = [
  {
    topic: 'education',
    name: 'وزارة التربية الوطنية والتعليم',
    officialUrl: 'https://www.education.gov.dz',
    portalUrl: 'https://awlyaa.education.gov.dz',
    categoryId: 'education',
    keywords: ['بكالوريا', 'باك', 'bac', 'بيام', 'bem', 'أوليائي', 'awlya', 'فضاء الأولياء', 'ابتدائي', 'متوسط', 'ثانوي', 'دخول مدرسي', 'منحة 5000', 'كشف النقاط', 'onec', 'تربية', 'أساتذة', 'توجيه', 'شهادة التعليم'],
  },
  {
    topic: 'university',
    name: 'وزارة التعليم العالي والبحث العلمي',
    officialUrl: 'https://www.mesrs.dz',
    portalUrl: 'https://progres.mesrs.dz/webetu',
    categoryId: 'university',
    keywords: ['جامعة', 'بروقرس', 'progres', 'تحويلات جامعية', 'منحة جامعية', 'إيواء', 'نقل جامعي', 'تسجيلات جامعية', 'دكتوراه', 'ماستر', 'ليسانس'],
  },
  {
    topic: 'employment',
    name: 'الوكالة الوطنية للتشغيل (ANEM) ووزارة العمل',
    officialUrl: 'https://www.anem.dz',
    portalUrl: 'https://minha.anem.dz',
    categoryId: 'employment',
    keywords: ['منحة البطالة', 'بطالة', 'anem', 'وسيط', 'wassit', 'طالب عمل', 'تجديد منحة', 'مسابقة توظيف', 'عقود التشغيل', 'توظيف', 'عروض عمل', 'منحة'],
  },
  {
    topic: 'housing',
    name: 'وكالة عدل (AADL) ووزارة السكن',
    officialUrl: 'https://www.aadl.com.dz',
    portalUrl: 'https://aadl3inscription2024.dz',
    categoryId: 'realEstate',
    keywords: ['عدل', 'aadl', 'عدل 3', 'سكن ترقوي', 'lpp', 'سكن اجتماعي', 'سكن تساهمي', 'lpa', 'وكالة عدل', 'مكتتبي عدل', 'طعون عدل', 'شهادة السلبية'],
  },
  {
    topic: 'post',
    name: 'بريد الجزائر',
    officialUrl: 'https://www.poste.dz',
    portalUrl: 'https://eccp.poste.dz',
    categoryId: 'post',
    keywords: ['بريد الجزائر', 'بطاقة ذهبية', 'الذهبية', 'بريدي موب', 'baridimob', 'eccp', 'تخليص', 'حساب بريدي', 'ccp', 'كشف رصيد'],
  },
  {
    topic: 'socialSecurity',
    name: 'الصندوق الوطني للضمان الاجتماعي (CNAS / CASNOS)',
    officialUrl: 'https://www.cnas.dz',
    portalUrl: 'https://elhanaa.cnas.dz',
    categoryId: 'socialSecurity',
    keywords: ['بطاقة الشفاء', 'شفاء', 'cnas', 'casnos', 'فضاء الهناء', 'elhanaa', 'عطلة مرضية', 'تقاعد', 'cnr', 'ضمان اجتماعي', 'منحة التقاعد'],
  },
  {
    topic: 'interior',
    name: 'وزارة الداخلية والجماعات المحلية',
    officialUrl: 'https://www.interieur.gov.dz',
    portalUrl: 'https://passeport.interieur.gov.dz',
    categoryId: 'interior',
    keywords: ['جواز سفر', 'بيومتري', 'بطاقة تعريف', 'شهادة ميلاد', 'رخصة سياقة', 'سياقة بالتنقيط', 'حالة مدنية', 'بلدية', 'دائرة', 'ولاية', 'ترقيم السيارات'],
  },
  {
    topic: 'tax',
    name: 'المديرية العامة للضرائب والمقاول الذاتي',
    officialUrl: 'https://www.mfdgi.gov.dz',
    portalUrl: 'https://anae.dz',
    categoryId: 'tax',
    keywords: ['ضرائب', 'ضريبة', 'مقاول ذاتي', 'anae', 'سجل تجاري', 'sidjilcom', 'تصريح جبائي', 'رقم التعريف الجبائي', 'nif', 'nis'],
  },
  {
    topic: 'bills',
    name: 'سونلغاز والجزائرية للمياه',
    officialUrl: 'https://www.sonelgaz.dz',
    portalUrl: 'https://pay.sonelgaz.dz',
    categoryId: 'bills',
    keywords: ['سونلغاز', 'فاتورة الكهرباء', 'الجزائرية للمياه', 'ade', 'دفع فواتير', 'عداد الكهرباء', 'انقطاع الكهرباء'],
  },
];

// ─── 2. إدارة الحالة ──────────────────────────────────────────
function loadTrendsState() {
  if (fs.existsSync(CONFIG.STATE_FILE)) {
    try { return JSON.parse(fs.readFileSync(CONFIG.STATE_FILE, 'utf8')); } catch {}
  }
  return { processedTrends: {} };
}

function saveTrendsState(state) {
  fs.writeFileSync(CONFIG.STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// ─── 3. جلب ترندات جوجل الجزائرية الحية ────────────────────────
async function fetchAlgeriaTrends() {
  const trendsList = [];
  const rssUrls = [
    'https://trends.google.com/trending/rss?geo=DZ',
    'https://trends.google.com/trends/trendingsearches/daily/rss?geo=DZ',
  ];

  for (const url of rssUrls) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        },
      });

      const parsed = await parseStringPromise(response.data, { explicitArray: false });
      const channel = parsed?.rss?.channel;
      if (!channel || !channel.item) continue;

      const items = Array.isArray(channel.item) ? channel.item : [channel.item];
      for (const it of items) {
        const title = (it.title || '').trim();
        const approxTraffic = it['ht:approx_traffic'] || '';
        const description = (it.description || '').trim();
        const newsItems = it['ht:news_item'] || [];
        const newsArray = Array.isArray(newsItems) ? newsItems : [newsItems];

        // استخراج روابط الأخبار المرفقة بالترند إن وجدت
        const sourceUrl = newsArray[0]?.['ht:news_item_url'] || it.link || '';
        const sourceSnippet = newsArray[0]?.['ht:news_item_snippet'] || description || '';

        if (title && !trendsList.some((t) => t.keyword.toLowerCase() === title.toLowerCase())) {
          trendsList.push({
            keyword: title,
            approxTraffic,
            snippet: sourceSnippet,
            sourceUrl,
          });
        }
      }
    } catch (err) {
      // تجاهل أخطاء الرابط وتجربة الرابط البديل
    }
  }

  return trendsList;
}

// ─── 4. مطابقة الترند مع اختصاصات الموقع ─────────────────────────
function matchTrendWithGovRule(trendKeyword, snippet = '') {
  const text = `${trendKeyword} ${snippet}`.toLowerCase();

  // استبعاد الرياضة والمشاهير والسياسة الدولية
  const isExcluded = EXCLUDE_KEYWORDS.some((ex) => {
    if (ex.length <= 4) {
      const reg = new RegExp(`\\b${ex}\\b`, 'i');
      return reg.test(text);
    }
    return text.includes(ex.toLowerCase());
  });
  if (isExcluded) return null;

  // مطابقة مع القواعد الحكومية والخدمات بدقة عالية
  for (const rule of GOV_TOPIC_RULES) {
    const matched = rule.keywords.some((kw) => {
      const kwLower = kw.toLowerCase();
      // إذا كانت الكلمة قصيرة أو باللاتينية نستخدم فحص الكلمة الكاملة
      if (kwLower.length <= 4 && /^[a-z0-9]+$/i.test(kwLower)) {
        const reg = new RegExp(`\\b${kwLower}\\b`, 'i');
        return reg.test(text);
      }
      return text.includes(kwLower);
    });

    if (matched) {
      return rule;
    }
  }

  return null;
}

// ─── 5. فحص واستخراج الصورة الرسمية عبر Node.js ─────────────────
// ⚠ قاعدة الصور الصارمة: إذا وُجد بيان مصور حقيقي نضعه، وإلا لا نضع شيئاً إطلاقاً
async function extractOfficialImage(pageUrl) {
  if (!pageUrl || typeof pageUrl !== 'string' || !pageUrl.startsWith('http')) {
    return null;
  }

  try {
    const response = await axios.get(pageUrl, {
      timeout: 8000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      maxRedirects: 3,
      validateStatus: (status) => status === 200,
    });

    const $ = cheerio.load(response.data);
    const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');

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
  // تجنب الصور العامة والشعارات الصغيرة
  if (lower.includes('logo') || lower.includes('icon') || lower.includes('avatar')) return false;
  return /\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(lower) || lower.includes('/uploads/') || lower.includes('communique');
}

// ─── 6. كتابة مقال الترند السيو الخارق بـ Gemini ─────────────────
async function generateTrendArticleWithGemini(trend, matchedRule) {
  const prompt = `أنت خبير صحفي واستراتيجي تصدر محركات البحث (SEO Master) في الجزائر.
الهدف: كتابة مقال شامل، حصري، واحترافي بنسبة 100% ليحتل المرتبة الأولى في بحث جوجل عن الكلمة الرائجة الحالية.

[الكلمة الرائجة في جوجل الآن]: "${trend.keyword}"
[الجهة الرسمية المختصة]: ${matchedRule.name}
[الرابط والمنصة الرسمية]: ${matchedRule.portalUrl || matchedRule.officialUrl}
[سياق الخبر والبيانات المتاحة]: ${trend.snippet || 'موضوع رائج يبحث عنه المواطنون الجزائريون بكثافة الآن.'}

[قواعد تحرير المقال الصارمة]:
1. الطول: بين 1000 و 1500 كلمة باللغة العربية الفصيحة ذات الأسلوب الصحفي الموثوق.
2. الهيكل المعماري للسيو:
   - # عنوان H1 جذاب جداً وقوي (Click-Worthy) يستهدف الكلمة المفتاحية ويثير اهتمام القارئ دون مبالغة (ضمن 60 حرفاً).
   - مقدمة قوية (150-200 كلمة) تجيب مباشرة على "نية الباحث" (Search Intent) وتشرح أهمية الموضوع وما يحتاجه القارئ فوراً.
   - ## عناوين فرعية H2 و H3 (من 4 إلى 6 عناوين) تشمل:
     • الشروط والفئات المعنية والمستفيدة.
     • خطوات التسجيل أو الاستفادة خطوة بخطوة بالترتيب.
     • الملف والوثائق الإدارية المطلوبة.
     • نصائح عملية لتفادي الأخطاء الشائعة أو تعليق الطلبات.
   - قوائم نقطية ورقمية منظمة لسهولة القراءة على الهاتف.
   - اقتباس رسمي واحد على الأقل بين علامات تنصيص مع نسبته للمصدر الرسمي: [${matchedRule.name}](${matchedRule.portalUrl || matchedRule.officialUrl}).
   - قسم إلزامي في النهاية: ## الأسئلة الشائعة حول ${trend.keyword} (FAQ) يحتوي على 3 إلى 4 أسئلة دقيقة وإجابات وافية ومفصلة.
   - خاتمة موجهة للمواطنين مع دعوة للفعل ورابط مباشر للمنصة الرسمية.
3. الدقة والواقعية: لا تخترع أرقاماً غير متوفرة (اكتب: "وفق ما توضحه الجهات الرسمية").
4. 🚫 قاعدة صارمة جداً بخصوص الصور:
   - يُمْنَع منعاً باتاً كتابة أي وسوم صور مثل ![]() أو <img> أو اختراع روابط صور وهمية.
   - ركز فقط على المحتوى النصي الفاخر والمتقن.

[الإخراج المطلوب]: ابدأ مباشرة بعنوان # H1 دون أي مقدمات أو هوامش.`;

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

// ─── 7. تحويل النص لـ JSON نظيف متوافق مع نظام الموقع ──────────
function parseTrendToArticleJson(rawText, trend, matchedRule, officialImageUrl) {
  const sanitizedText = rawText
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/\n\s*---\s*\n/g, '\n\n');

  const lines = sanitizedText.split('\n').map((l) => l.trim()).filter(Boolean);

  // استخراج العنوان H1
  let title = trend.keyword;
  const h1Line = lines.find((l) => l.startsWith('# '));
  if (h1Line) title = h1Line.replace(/^#\s*/, '').trim();

  // استخراج المقدمة
  let introduction = '';
  let inIntro = false;
  for (const line of lines) {
    if (line.startsWith('# ')) { inIntro = true; continue; }
    if (inIntro && line.startsWith('## ')) break;
    if (inIntro && line) introduction += line + '\n';
  }
  introduction = introduction.trim();

  // استخراج الأقسام
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

  // توليد slug معبر عن الترند
  const slug = generateTrendSlug(trend.keyword);

  const article = {
    title,
    introduction: introduction || sanitizedText.slice(0, 500),
    sections: sections.length > 0 ? sections : [{ heading: 'تفاصيل الدليل والمعلومات الكاملة', content: sanitizedText }],
    sourceMinistry: matchedRule.name,
    categoryId: matchedRule.categoryId,
    dateStr: new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    officialDocumentUrl: matchedRule.portalUrl || matchedRule.officialUrl,
    isTrendingTopic: true,
    trendingKeyword: trend.keyword,
    autoGenerated: true,
    generatedAt: new Date().toISOString(),
    registrationRequiredSites: [
      {
        name: matchedRule.name,
        url: matchedRule.portalUrl || matchedRule.officialUrl,
        requirements: 'الولوج للمنصة الرسمية لاستكمال الإجراءات',
      },
    ],
  };

  // ⚠ قاعدة الصور الصارمة: إذا وُجدت صورة رسمية موثقة نضعها، وإلا لا نضع أي صورة
  if (officialImageUrl) {
    article.featuredImage = {
      url: officialImageUrl,
      alt: `بيان رسمي حول ${trend.keyword} — ${matchedRule.name}`,
    };
  }

  return { slug, article };
}

function generateTrendSlug(keyword) {
  const clean = keyword
    .replace(/[^\u0621-\u064A0-9a-zA-Z\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 45);
  return `trend-${clean}-${Date.now().toString(36)}`.toLowerCase();
}

// ─── 8. حفظ المقال والفهرسة الفورية ──────────────────────────
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

// ─── 9. المحرك الرئيسي للرادار ────────────────────────────────
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🔥 RAQMANA — رادار تصيد ترندات جوجل الجزائر v1.0');
  console.log('🎯 الهدف: احتلال المرتبة الأولى في مواضيع البحث الرائجة');
  console.log('='.repeat(60) + '\n');

  const state = loadTrendsState();

  console.log('📡 جلب أحدث ترندات البحث في الجزائر (Google Trends DZ)...');
  const liveTrends = await fetchAlgeriaTrends();
  console.log(`📊 تم رصد ${liveTrends.length} كلمة بحث رائجة اليوم.\n`);

  let generatedCount = 0;

  for (const trend of liveTrends) {
    // 1. تجاوز الترندات المعالجة سابقاً
    const trendKey = trend.keyword.toLowerCase().trim();
    if (state.processedTrends[trendKey]) {
      continue;
    }

    // 2. التحقق من مطابقة الترند لخدمات وتخصص الموقع
    const matchedRule = matchTrendWithGovRule(trend.keyword, trend.snippet);
    if (!matchedRule) {
      continue; // ترند رياضي أو فني أو غير متعلق بالموقع
    }

    if (generatedCount >= CONFIG.MAX_TREND_ARTICLES_PER_RUN) {
      console.log(`⏸ تم بلوغ حد الدورة (${CONFIG.MAX_TREND_ARTICLES_PER_RUN} مقالات ترند حصرية).`);
      break;
    }

    console.log(`\n🎯 صيد ثمين! ترند مطابق لتخصصنا: "${trend.keyword}"`);
    console.log(`   🏛 الجهة المختصة: ${matchedRule.name}`);

    try {
      // 3. فحص واستخراج الصورة الرسمية
      process.stdout.write('   🖼 فحص الصورة الرسمية...');
      const officialImage = trend.sourceUrl ? await extractOfficialImage(trend.sourceUrl) : null;
      console.log(officialImage ? ` ✅ تم العثور على بيان مصور` : ` ℹ بدون بيان مصور (مقال نصي نقي)`);

      // 4. كتابة المقال السيو بـ Gemini
      process.stdout.write('   ✍ صياغة المقال الحصري بـ Gemini...');
      const rawText = await generateTrendArticleWithGemini(trend, matchedRule);
      console.log(' ✅');

      // 5. تحويل وتخزين المقال
      const { slug, article } = parseTrendToArticleJson(rawText, trend, matchedRule, officialImage);
      saveArticle(slug, article);
      console.log(`   💾 تم حفظ المقال: /articles/${slug}`);

      // 6. الفهرسة الفورية (IndexNow)
      const articleUrl = `https://www.raqmanadz.com/articles/${slug}`;
      pingIndexNow(articleUrl);
      console.log(`   ⚡ تم إرسال تنبيه الأرشفة الفورية (IndexNow)`);

      // 7. تحديث الحالة
      state.processedTrends[trendKey] = {
        slug,
        keyword: trend.keyword,
        category: matchedRule.categoryId,
        processedAt: new Date().toISOString(),
      };
      generatedCount++;

      // انتظار فاصل زمني
      await new Promise((r) => setTimeout(r, 2000));

    } catch (err) {
      console.error(`   ❌ تعذر إكمال مقال الترند: ${err.message}`);
      state.processedTrends[trendKey] = {
        error: err.message,
        skippedAt: new Date().toISOString(),
      };
    }
  }

  saveTrendsState(state);

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 اكتمل تشغيل الرادار — تم صيد وكتابة ${generatedCount} مقال ترند حصري!`);
  console.log('='.repeat(60) + '\n');
}

main().catch((err) => {
  console.error('❌ خطأ في رادار الترندات:', err.message);
  process.exit(1);
});
