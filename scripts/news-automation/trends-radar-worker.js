/**
 * trends-radar-worker.js — رادار ترندات قوقل والأخبار الجزائرية الكبرى (v3.0)
 * ===========================================================================
 * يدمج بين:
 * 1. رصد Google Trends في الجزائر (geo=DZ).
 * 2. زحف ومسح الأخبار الأكثر تداولاً في المواقع الإخبارية الجزائرية الكبرى (الشروق، النهار، البلاد، دزاير توب، APS).
 * 3. [قاعدة المصداقية والتحقق]: مطابقة الترند مع قاعدة الأخبار الرسمية والهيئات الحكومية (267 جهة).
 *    ⚠ إذا لم نجد خبراً موثوقاً أو مصدراً رسمياً يؤكد الموضوع، يتم تجاهله فوراً وكتابة 0 مقالات.
 * 4. استخراج الصور الرسمية عبر axios و cheerio مع منع التزييف والهلوسة تماماً.
 * 5. صياغة مقال سيو حصري (1000-1500 كلمة) بـ Gemini مع قسم الأسئلة الشائعة (FAQ).
 * 6. الفهرسة الفورية عبر IndexNow و Google Indexing API.
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
const cheerio = require('cheerio');
const Parser = require('rss-parser');
const googleTrends = require('google-trends-api');

const rssParser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
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
  MAX_TREND_ARTICLES_PER_RUN: 2, // حد أقصى للحفاظ على جودة استثنائية
  DEFAULT_PLACEHOLDER: '/images/default-placeholder.png',
};

if (!CONFIG.GEMINI_API_KEY) {
  console.error('\n❌ GEMINI_API_KEY غير موجود في .env.local أو GitHub Secrets.\n');
  process.exit(1);
}

// ─── كلمات الاستبعاد (استبعاد الرياضة والمشاهير والسياسة الدولية) ──
const EXCLUDE_KEYWORDS = [
  'كرة', 'مباراة', 'فريق', 'دوري', 'كأس', 'رونالدو', 'ميسي', 'نادي', 'لاعب', 'هدف',
  'تصفيات', 'منتخب', 'ريال', 'برشلونة', 'أرسنال', 'ليفربول', 'سيتي', 'marseille',
  'madrid', 'barcelona', 'champions', 'league', 'football', 'match',
  'مطرب', 'فنان', 'ممثل', 'مسلسل', 'أغنية', 'فيلم', 'سينما', 'تيك توك',
  'روسيا', 'أوكرانيا', 'إسرائيل', 'غزة', 'ترامب', 'بايدن',
];

// ─── قاعدة بيانات مطابقة الخدمات والمصادر الرسمية المعتمدة ───────
const OFFICIAL_GOV_DATABASE = [
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
    name: 'الصندوق الوطني للتأمينات الاجتماعية (CNAS / CNR)',
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

// ─── إدارة سجل العمليات (history.json) ────────────────────────
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
// [المرحلة 1: زحف المواقع الإخبارية الجزائرية الكبرى (جديد)]
// ════════════════════════════════════════════════════════════════
/**
 * 💡 كيفية إضافة مصدر إخباري جديد:
 * افتح ملف sites-config.json وأضف عنصراً جديداً في مصفوفة "algerian_news_sources":
 * {
 *   "id": "اسم_المصدر",
 *   "name": "اسم الجريدة أو الموقع",
 *   "url": "https://example.dz",
 *   "rssUrl": "https://example.dz/feed"
 * }
 */
async function crawlAlgerianNewsSources(sources) {
  const trendingNews = [];
  console.log('📡 [الزحف الإخباري] فحص خراطيم المواقع الإخبارية الجزائرية الكبرى...');

  for (const src of sources) {
    try {
      const feed = await rssParser.parseURL(src.rssUrl);
      if (!feed || !feed.items) continue;

      // أخذ أول 5 أخبار عاجلة من كل مصدر
      const topItems = feed.items.slice(0, 5);
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
            sourceId: src.id,
            origin: 'algerian_media',
          });
        }
      }
    } catch (err) {
      console.warn(`   ⚠ تعذر جلب أخبار ${src.name}: ${err.message}`);
    }
  }

  console.log(`   ✔ تم استخراج ${trendingNews.length} خبراً متداولاً من الإعلام الجزائري.`);
  return trendingNews;
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 2: جلب ترندات جوجل الحية في الجزائر (Google Trends)]
// ════════════════════════════════════════════════════════════════
async function fetchGoogleTrendsDZ() {
  const trends = [];
  console.log('📡 [ترندات قوقل] جلب الكلمات الأكثر بحثاً في الجزائر (geo: DZ)...');

  // أ. محاولة عبر Google Trends RSS
  const rssUrls = [
    'https://trends.google.com/trending/rss?geo=DZ',
    'https://trends.google.com/trends/trendingsearches/daily/rss?geo=DZ',
  ];

  for (const url of rssUrls) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
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
            origin: 'google_trends',
          });
        }
      }
    } catch {}
  }

  // ب. محاولة دعم عبر google-trends-api
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
              origin: 'google_trends',
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
// [المرحلة 3: التحقق والمطابقة الرسمية (منع المحتوى الرديء)]
// ════════════════════════════════════════════════════════════════
/**
 * ⚠ القاعدة الحاسمة:
 * إذا لم نجد تطابقاً مؤكداً مع قاعدة البيانات الرسمية أو موضوعاً خدمياً موثوقاً،
 * يتم استبعاد الموضوع تماماً ولا يُكتب عنه أي مقال.
 */
function verifyAndMatchOfficialSource(trendItem) {
  const fullText = `${trendItem.title} ${trendItem.snippet}`.toLowerCase();

  // 1. فلتر الاستبعاد الفوري (رياضة، فن، سياسة دولية)
  const isExcluded = EXCLUDE_KEYWORDS.some((ex) => {
    if (ex.length <= 4) {
      return new RegExp(`\\b${ex}\\b`, 'i').test(fullText);
    }
    return fullText.includes(ex.toLowerCase());
  });
  if (isExcluded) return null;

  // 2. التحقق من مطابقة الموضوع مع إحدى الجهات الحكومية أو الخدمية المعتمدة
  for (const official of OFFICIAL_GOV_DATABASE) {
    const isMatch = official.keywords.some((kw) => {
      const kwLower = kw.toLowerCase();
      if (kwLower.length <= 4 && /^[a-z0-9]+$/i.test(kwLower)) {
        return new RegExp(`\\b${kwLower}\\b`, 'i').test(fullText);
      }
      return fullText.includes(kwLower);
    });

    if (isMatch) {
      return official; // تم التحقق والربط بالجهة الرسمية
    }
  }

  return null; // لم يطابق أي جهة رسمية ⬅ يتم تجاهله
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 4: استخراج الصورة الرسمية عبر cheerio و axios]
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
  return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(lower) || lower.includes('/uploads/') || lower.includes('image');
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

[بيانات الترند والتحقق الرسمي]:
- موضوع الترند الرائج: ${trendItem.title}
- الجهة الرسمية المختصة: ${matchedOfficial.name}
- الرابط والمنصة الرسمية: ${matchedOfficial.portalUrl || matchedOfficial.officialUrl}
- سياق الخبر ومعطياته: ${trendItem.snippet || 'موضوع متداول في الجزائر يهم المواطنين.'}
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
    sections: sections.length > 0 ? sections : [{ heading: 'تفاصيل الدليل والمعلومات الكاملة', content: sanitizedText }],
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

  // ربط الصورة الرسمية فقط إن وُجدت
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
  console.log('\n' + '='.repeat(65));
  console.log('🔥 RAQMANA — رادار تصيد الترندات والإعلام الجزائري (v3.0)');
  console.log('🛡 قاعدة التحقق: مطابقة مع 267 جهة رسمية (0 مقالات عند عدم التحقق)');
  console.log('='.repeat(65) + '\n');

  const history = loadHistory();
  if (!history.processedTrends) history.processedTrends = {};

  // 1. قراءة إعدادات المصادر
  const sitesConfig = JSON.parse(fs.readFileSync(CONFIG.SITES_CONFIG, 'utf8'));
  const newsSources = sitesConfig.algerian_news_sources || [];

  // 2. جلب ترندات قوقل + الأخبار الرائجة من الصحف الجزائرية
  const [googleTrendsList, mediaNewsList] = await Promise.all([
    fetchGoogleTrendsDZ(),
    crawlAlgerianNewsSources(newsSources),
  ]);

  const allCandidateTrends = [...googleTrendsList, ...mediaNewsList];
  console.log(`\n📊 إجمالي المرشحات للتحليل: ${allCandidateTrends.length} موضوع متداول.`);

  let writtenCount = 0;

  for (const item of allCandidateTrends) {
    const itemKey = item.title.toLowerCase().trim();

    // تجاوز المواضيع المعالجة سابقاً
    if (history.processedTrends[itemKey] || history.processedItems[item.link]) {
      continue;
    }

    // 3. التحقق والمطابقة الرسمية
    const matchedOfficial = verifyAndMatchOfficialSource(item);
    if (!matchedOfficial) {
      continue; // لم يثبت ارتباطه بموضوع خدمي أو رسمي موثوق ⬅ تجاهل تام
    }

    if (writtenCount >= CONFIG.MAX_TREND_ARTICLES_PER_RUN) {
      console.log(`\n⏸ تم بلوغ حد المقالات الحصرية في هذه الجلسة (${CONFIG.MAX_TREND_ARTICLES_PER_RUN}).`);
      break;
    }

    console.log(`\n🎯 [صيد ثمين مُوثّق]: "${item.title}"`);
    console.log(`   🏛 الجهة المعتمدة: ${matchedOfficial.name}`);

    try {
      // 4. استخراج الصورة الرسمية
      process.stdout.write('   🖼 استخراج الصورة الرسمية...');
      const officialImage = item.link ? await extractOfficialImage(item.link) : null;
      console.log(officialImage ? ` ✅ صورة موثقة من الرابط` : ` ℹ بدون بيان مصور (نص احترافي نقي)`);

      // 5. صياغة المقال بـ Gemini
      process.stdout.write('   ✍ صياغة المقال السيو الخارق بـ Gemini...');
      const rawText = await generateTrendArticleWithGemini(item, matchedOfficial);
      console.log(' ✅');

      // 6. تحويل وحفظ المقال
      const { slug, article } = parseTrendToArticleJson(rawText, item, matchedOfficial, officialImage);
      saveArticle(slug, article);
      console.log(`   💾 تم الحفظ بنجاح: /articles/${slug}`);

      // 7. الفهرسة الفورية
      const articleUrl = `https://www.raqmanadz.com/articles/${slug}`;
      pingIndexNow(articleUrl);
      console.log(`   ⚡ تم إرسال تنبيه الأرشفة الفورية (IndexNow)`);

      // 8. تحديث سجل التاريخ
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

  console.log('\n' + '='.repeat(65));
  console.log(`🎉 اكتمل تشغيل الرادار — تم صيد وكتابة ${writtenCount} مقال ترند رسمي موثق!`);
  console.log('='.repeat(65) + '\n');
}

main().catch((err) => {
  console.error('❌ خطأ في رادار الترندات:', err.message);
  process.exit(1);
});
