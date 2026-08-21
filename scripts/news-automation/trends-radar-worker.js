/**
 * trends-radar-worker.js — رادار ترندات قوقل والإعلام الجزائري (v3.1 — بنظام الفلترة الإدارية الصارم)
 * ===============================================================================================
 * 🛡 الحماية الصارمة من المحتوى غير المرتبط:
 * 1. استبعاد فوري لأي أخبار حوادث (اصطدام، غرق، حرائق، قتلى، جرحى)، جرائم (مخدرات، توقيف، سرقة، محاكم)،
 *    رياضة، فن، فضائح، ونشرات جوية.
 * 2. مطابقة إدارية دقيقة وحصرية (Administrative Whitelist) مع الخدمات والمعاملات العمومية والمنصات الرسمية.
 * 3. إذا لم يثبت ارتباط الموضوع بخدمة حكومية أو معاملة إدارية رسمية، يتم تجاهله فوراً ويكتب 0 مقالات.
 * 4. استخراج الصورة الرسمية عبر cheerio و axios، ومنع Gemini تماماً من توليد أي وسوم صور.
 * 5. كتابة مقال سيو حصري (1000 - 1500 كلمة) مع قسم الأسئلة الشائعة (FAQ) والفهرسة الفورية (IndexNow).
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
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'ar,fr;q=0.9,en;q=0.8',
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
// 🎯 القائمة الإدارية البيضاء المعتمدة (Administrative Whitelist)
// ════════════════════════════════════════════════════════════════
const STRICT_ADMINISTRATIVE_DATABASE = [
  {
    topic: 'education',
    name: 'وزارة التربية الوطنية والتعليم',
    officialUrl: 'https://www.education.gov.dz',
    portalUrl: 'https://awlyaa.education.gov.dz',
    categoryId: 'education',
    // عبارات مركبة دقيقة لا تحتمل الخطأ
    phrases: [
      'فضاء الأولياء', 'منصة أوليائي', 'awlyaa', 'awlya', 'شهادة البكالوريا', 'نتائج البكالوريا',
      'نتائج الباك', 'شهادة التعليم المتوسط', 'نتائج البيام', 'المنحة المدرسية', 'منحة 5000',
      'كشف النقاط', 'مسابقة التربية', 'مسابقة توظيف الأساتذة', 'التسجيل في التحضيري',
      'التسجيل في الابتدائي', 'الدخول المدرسي', 'الديوان الوطني للامتحانات', 'onec dz',
    ],
  },
  {
    topic: 'university',
    name: 'وزارة التعليم العالي والبحث العلمي',
    officialUrl: 'https://www.mesrs.dz',
    portalUrl: 'https://progres.mesrs.dz/webetu',
    categoryId: 'university',
    phrases: [
      'منصة بروقرس', 'منصة progres', 'التحويلات الجامعية', 'التسجيلات الجامعية',
      'منحة التعليم العالي', 'المنحة الجامعية', 'الإيواء الجامعي', 'توجيه حاملي البكالوريا',
      'مسابقة الدكتوراه', 'mesrs dz',
    ],
  },
  {
    topic: 'employment',
    name: 'الوكالة الوطنية للتشغيل (ANEM) ووزارة العمل',
    officialUrl: 'https://www.anem.dz',
    portalUrl: 'https://minha.anem.dz',
    categoryId: 'employment',
    phrases: [
      'منحة البطالة', 'تجديد منحة البطالة', 'منصة وسيط', 'منصة minha', 'anem dz',
      'wassit anem', 'طالب عمل', 'مسابقة التوظيف العمومي', 'عقود ما قبل التشغيل',
      'جهاز المساعدة على الإدماج',
    ],
  },
  {
    topic: 'housing',
    name: 'وكالة عدل (AADL) ووزارة السكن',
    officialUrl: 'https://www.aadl.com.dz',
    portalUrl: 'https://aadl3inscription2024.dz',
    categoryId: 'realEstate',
    phrases: [
      'عدل 3', 'aadl 3', 'سكنات عدل', 'وكالة عدل', 'مكتتبي عدل', 'طعون عدل',
      'سكن ترقوي مدعم', 'سكن lpp', 'سكن lpa', 'سكن اجتماعي', 'شهادة السلبية',
      'البوابة الرقمية لوزارة السكن',
    ],
  },
  {
    topic: 'post',
    name: 'بريد الجزائر',
    officialUrl: 'https://www.poste.dz',
    portalUrl: 'https://eccp.poste.dz',
    categoryId: 'post',
    phrases: [
      'البطاقة الذهبية', 'بريد الجزائر', 'تطبيق بريدي موب', 'baridimob',
      'منصة eccp', 'الحساب البريدي الجاري ccp', 'طلب البطاقة الذهبية',
    ],
  },
  {
    topic: 'socialSecurity',
    name: 'الصندوق الوطني للضمان الاجتماعي والتقاعد (CNAS / CNR)',
    officialUrl: 'https://www.cnas.dz',
    portalUrl: 'https://elhanaa.cnas.dz',
    categoryId: 'socialSecurity',
    phrases: [
      'بطاقة الشفاء', 'فضاء الهناء', 'elhanaa cnas', 'صندوق الضمان الاجتماعي',
      'cnas dz', 'casnos', 'صندوق التقاعد cnr', 'منحة التقاعد', 'زيادة معاشات التقاعد',
    ],
  },
  {
    topic: 'interior',
    name: 'وزارة الداخلية والجماعات المحلية',
    officialUrl: 'https://www.interieur.gov.dz',
    portalUrl: 'https://passeport.interieur.gov.dz',
    categoryId: 'interior',
    phrases: [
      'جواز السفر البيومتري', 'بطاقة التعريف البيومترية', 'شهادة الميلاد الرقمية',
      'رخصة السياقة بالتنقيط', 'الحالة المدنية الرقمية', 'استخراج الوثائق الإدارية',
      'ترقيم السيارات الجديد', 'موقع وزارة الداخلية الجزائرية',
    ],
  },
  {
    topic: 'tax',
    name: 'المديرية العامة للضرائب والمقاول الذاتي',
    officialUrl: 'https://www.mfdgi.gov.dz',
    portalUrl: 'https://anae.dz',
    categoryId: 'tax',
    phrases: [
      'المقاول الذاتي', 'منصة anae', 'السجل التجاري الإلكتروني', 'منصة سجلكم',
      'sidjilcom', 'الرقم الجبائي nif', 'التصريح الجبائي الإلكتروني', 'جباية dz',
    ],
  },
  {
    topic: 'bills',
    name: 'سونلغاز والجزائرية للمياه',
    officialUrl: 'https://www.sonelgaz.dz',
    portalUrl: 'https://pay.sonelgaz.dz',
    categoryId: 'bills',
    phrases: [
      'فاتورة الكهرباء سونلغاز', 'دفع فاتورة سونلغاز', 'تطبيق sonelgaz',
      'الجزائرية للمياه ade', 'دفع فاتورة المياه',
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
      // استخدام axios مع headers واقعية لتفادي مشكلة الـ timeout
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
        const topItems = feed.items.slice(0, 8);
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

  // دعم احتياطي عبر google-trends-api
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
// [المرحلة 3: التحقق الصارم والمطابقة الإدارية (Zero False Positives)]
// ════════════════════════════════════════════════════════════════
function verifyAndMatchAdministrativeOnly(trendItem) {
  const fullText = `${trendItem.title} ${trendItem.snippet}`.toLowerCase();

  // 1. الفحص الصارم الأول: استبعاد الحوادث والجرائم والرياضة والفن فوراً
  const isBanned = STRICT_EXCLUDE_LIST.some((bannedWord) => {
    return fullText.includes(bannedWord.toLowerCase());
  });

  if (isBanned) {
    return null; // مستبعد فوراً (حادث، جريمة، مخدرات، رياضة، مشاهير)
  }

  // 2. الفحص الصارم الثاني: المطابقة الإلزامية مع العبارات الإدارية المعتمدة
  for (const official of STRICT_ADMINISTRATIVE_DATABASE) {
    const isExactMatch = official.phrases.some((phrase) => {
      return fullText.includes(phrase.toLowerCase());
    });

    if (isExactMatch) {
      return official; // تم التحقق والربط بالجهة الرسمية والخدمة المعتمدة
    }
  }

  // إذا لم يطابق أي عبارة إدارية حكومية واضحة ⬅ يتم استبعاده تماماً
  return null;
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
- سياق الخبر ومعطياته: ${trendItem.snippet || 'دليل شامل حول الخدمة والإجراءات الإدارية.'}
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
  console.log('\n' + '='.repeat(65));
  console.log('🔥 RAQMANA — رادار تصيد الترندات والإعلام الجزائري (v3.1)');
  console.log('🛡 الفلترة الصارمة: خدمات ومعاملات عمومية فقط | حظر الحوادث والجرائم 100%');
  console.log('='.repeat(65) + '\n');

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

    // 🛡 الفحص الصارم المزدوج: استبعاد الحوادث/الجرائم + المطابقة الإدارية الحصرية
    const matchedOfficial = verifyAndMatchAdministrativeOnly(item);
    if (!matchedOfficial) {
      // تم استبعاده (حادث، جريمة، رياضة، أو موضوع عام غير إداري) ⬅ تجاهل تام
      continue;
    }

    if (writtenCount >= CONFIG.MAX_TREND_ARTICLES_PER_RUN) {
      console.log(`\n⏸ تم بلوغ حد المقالات في هذه الجلسة (${CONFIG.MAX_TREND_ARTICLES_PER_RUN}).`);
      break;
    }

    console.log(`\n🎯 [صيد إداري وخدماتي حقيقي مُوثّق]: "${item.title}"`);
    console.log(`   🏛 الجهة المعتمدة: ${matchedOfficial.name}`);

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

  console.log('\n' + '='.repeat(65));
  console.log(`🎉 اكتمل تشغيل الرادار — تم صيد وكتابة ${writtenCount} مقال إداري وخدماتي رسمي موثق!`);
  console.log('='.repeat(65) + '\n');
}

main().catch((err) => {
  console.error('❌ خطأ في رادار الترندات:', err.message);
  process.exit(1);
});
