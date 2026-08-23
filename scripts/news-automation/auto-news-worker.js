/**
 * auto-news-worker.js — محرك أتمتة الأخبار الرسمية الجزائرية (مُحدّث بالمعايير الشاملة)
 * ====================================================================================
 * يراقب المواقع والهيئات الحكومية الجزائرية وفق دورة مجدولة:
 *   [المرحلة 1: الرصد] جلب الأخبار وتطبيق مصفاة الوقت (48 ساعة) وفلتر التخصص (منع الرياضة والمشاهير).
 *   [المرحلة 2: التحقق واستخراج الصور] فحص الرابط الأصلي بـ cheerio و axios لاستخراج og:image الحقيقية فقط.
 *   [المرحلة 3: الكتابة الاحترافية] إرسال النص لـ Gemini لكتابة مقال سيو حصري متكامل (1000 - 1500 كلمة).
 *   [المرحلة 4: الحفظ والنشر والفهرسة] حفظ المقال في قاعدة البيانات وإرسال إشعار فوري لـ IndexNow.
 *
 * الاستخدام:
 *   node scripts/news-automation/auto-news-worker.js             # فحص المواقع الأساسية (Tier 1)
 *   node scripts/news-automation/auto-news-worker.js --tier=2   # فحص المواقع اليومية (Tier 2)
 *   node scripts/news-automation/auto-news-worker.js --all      # فحص جميع المواقع الحكومية
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');

const rssParser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: ['media:content', 'enclosure', 'content:encoded'],
  },
  // تجاوز أخطاء شهادات SSL للمواقع الحكومية
  requestOptions: { rejectUnauthorized: false },
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
  MAX_ARTICLES_PER_RUN: 3,         // حد أقصى للمقالات في الجلسة الواحدة لتوفير الموارد
  MAX_NEWS_AGE_HOURS_GOV: 720,     // مواقع حكومية: 30 يوم (تنشر بشكل متقطع)
  MAX_NEWS_AGE_HOURS_MEDIA: 48,    // مواقع إعلامية: 48 ساعة فقط (تنشر يومياً لكن بصخب كثير)
  DEFAULT_PLACEHOLDER: '/images/default-placeholder.png',
};


if (!CONFIG.GEMINI_API_KEY) {
  console.error('\n❌ GEMINI_API_KEY غير موجود في .env.local أو GitHub Secrets.\n');
  process.exit(1);
}

// ─── كلمات الاستبعاد (فلتر التخصص الذكي) ──────────────
const EXCLUDE_KEYWORDS = [
  // الرياضة وكرة القدم
  'كرة', 'مباراة', 'فريق', 'دوري', 'كأس', 'رونالدو', 'ميسي', 'نادي', 'لاعب', 'هدف',
  'تصفيات', 'ريال', 'برشلونة', 'أرسنال', 'ليفربول', 'سيتي', 'marseille',
  'madrid', 'barcelona', 'champions', 'league', 'football', 'match',
  // الفن والترفيه
  'مطرب', 'ممثل', 'مسلسل', 'أغنية', 'فيلم', 'سينما', 'تيك توك',
  // الأخبار البروتوكولية واللقاءات التي لا تقدم خدمة إدارية للمواطن
  'استقبل وزير', 'استقبل الوزير', 'محادثات بين', 'مباحثات بين', 'تبادل وجهات النظر',
  'زيارة تفقدية', 'تنصيب والي', 'حفل تكريم', 'جلسة عمل مغلقة',
  'لقاء تشاوري', 'بيان مشترك بين', 'سفير دولة', 'سفيرة', 'دبلوماسية',
  // السياسة الدولية
  'روسيا', 'أوكرانيا', 'إسرائيل', 'غزة', 'ترامب', 'بايدن',
  // ━ الدين والشعائر — ممنوع 100% ━
  'عيد الأضحى', 'عيد الفطر', 'أضاحي', 'أضحية', 'صلاة العيد', 'خطبة الجمعة',
  'الخطبة الدينية', 'الوعظ والإرشاد', 'الفتوى', 'شعائر الحج', 'رمضان', 'التراويح',
  'ليلة القدر', 'الهلال', 'رؤية الهلال', 'الفتوى الدينية', 'الشعائر الدينية',
];

// كلمات مفتاحية ذات الصلة بالخدمات الإدارية — إذا وُجدت في الخبر يُمرَّر مباشرةً حتى لو كان المصدر إعلامياً
const ADMIN_KEYWORDS_WHITELIST = [
  'منصة', 'تسجيل', 'مسابقة توظيف', 'وظيف عمومي', 'استمارة', 'بطاقة',
  'بطاقة الشفاء', 'خدمات إلكترونية', 'رقمنة', 'بلدية', 'منحة', 'تعويض',
  'إجراءات', 'وثائق', 'ملف', 'طلب', 'مسابقة', 'ترقية', 'دراسة ملف',
  'تسجيل إلكتروني', 'منصة رقمية', 'خدمة عمومية', 'شهادة', 'أجور',
  'تقاعد', 'بطالة', 'إعانة', 'تأمين', 'رخصة', 'وكالة', 'سكن',
];


// ─── قراءة إعدادات المواقع ────────────────────────────────────
const sitesConfig = JSON.parse(fs.readFileSync(CONFIG.SITES_CONFIG, 'utf8'));

// تحديد الطبقة المطلوب فحصها
const args = process.argv.slice(2);
const tierArg = args.find((a) => a.startsWith('--tier='));
const isAll = args.includes('--all');
let sitesToProcess = [];
if (isAll) {
  sitesToProcess = [...(sitesConfig.trending_sites_tier1 || []), ...(sitesConfig.daily_sites_tier2 || [])];
} else if (tierArg && tierArg.includes('2')) {
  sitesToProcess = sitesConfig.daily_sites_tier2 || [];
} else {
  sitesToProcess = sitesConfig.trending_sites_tier1 || [];
}

// ─── إدارة سجل العمليات لمنع التكرار (history.json) ───────────
function loadHistory() {
  if (fs.existsSync(CONFIG.HISTORY_FILE)) {
    try { return JSON.parse(fs.readFileSync(CONFIG.HISTORY_FILE, 'utf8')); } catch {}
  }
  return { processedItems: {}, lastRun: null };
}

function saveHistory(history) {
  fs.writeFileSync(CONFIG.HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 1: الرصد وجلب الـ RSS وتطبيق الفلاتر]
// ════════════════════════════════════════════════════════════════
async function fetchFeedItems(rssUrl) {
  try {
    // محاولة أولى عبر rss-parser
    const feed = await rssParser.parseURL(rssUrl);
    if (feed && feed.items) {
      return feed.items.map((item) => ({
        title: (item.title || '').trim(),
        link: item.link || item.guid || '',
        description: item.contentSnippet || item.content || item.summary || '',
        // ━ لا يُستبدل بالتاريخ الحالي إذا كان pubDate فارغاً — null يجعل المصفاة ترفضه فوراً
        pubDate: item.pubDate || item.isoDate || null,
        guid: item.guid || item.link || item.title,
      }));
    }
  } catch (parserErr) {
    // محاولة ثانية عبر axios مع تجاوز شهادات SSL المحلية
    try {
      const resp = await axios.get(rssUrl, {
        timeout: 10000,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });
      const feed = await rssParser.parseString(resp.data);
      if (feed && feed.items) {
        return feed.items.map((item) => ({
          title: (item.title || '').trim(),
          link: item.link || item.guid || '',
          description: item.contentSnippet || item.content || item.summary || '',
          // ━ null بدلاً من التاريخ الحالي — يضمن رفض الأخبار بدون تاريخ
          pubDate: item.pubDate || item.isoDate || null,
          guid: item.guid || item.link || item.title,
        }));
      }
    } catch (fallbackErr) {
      console.warn(`   ⚠ تعذر قراءة RSS (${rssUrl}): ${fallbackErr.message}`);
    }
  }
  return [];
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 2: التحقق من المصدر واستخراج الصورة الرسمية]
// ════════════════════════════════════════════════════════════════
// ⚠ استخراج الصور يتم في Node.js فقط عبر cheerio ولا يُطلب من Gemini أبداً لمس الصور
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

    // 1. فحص og:image أو twitter:image
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

    // 2. فحص أول صورة رئيسية داخل نص المقال (إن وُجدت وليست أيقونة أو لوغو)
    let articleImg = null;
    $('article img, .entry-content img, .post-content img').each((_, el) => {
      if (articleImg) return;
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      if (src && isValidImageUrl(src) && !src.toLowerCase().includes('logo') && !src.toLowerCase().includes('icon')) {
        articleImg = src.startsWith('http') ? src : new URL(src, pageUrl).href;
      }
    });
    if (articleImg) return articleImg;

    return null;
  } catch {
    return null; // في حالة الخطأ يرجع null فوراً
  }
}

function isValidImageUrl(url) {
  if (!url || url.length < 8) return false;
  const lower = url.toLowerCase();
  if (lower.includes('logo') || lower.includes('icon') || lower.includes('avatar')) return false;
  return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(lower) || lower.includes('/uploads/') || lower.includes('communique');
}

function resolveArticleImage(foundImage, site) {
  if (foundImage) {
    return {
      url: foundImage,
      alt: `صورة رسمية من بيان ${site.name}`,
      isPlaceholder: false,
    };
  }
  // إذا لم نجد صورة نضع الصورة الافتراضية
  return {
    url: CONFIG.DEFAULT_PLACEHOLDER,
    alt: `صورة توضيحية — ${site.name}`,
    isPlaceholder: true,
  };
}

// ════════════════════════════════════════════════════════════════
// [المرحلة 3: التحرير والكتابة الاحترافية — محرك الأدلة وحلول المشاكل]
// ════════════════════════════════════════════════════════════════
async function generateArticleWithGemini(newsItem, site) {
  const prompt = `أنت كبير مهندسي الإجراءات الإدارية والرقمنة في منصة 'رقمنة الجزائر' (www.raqmanadz.com).
موقعنا ليس جريدة إخبارية تنقل الأخبار أو الاجتماعات أو اللقاءات البروتوكولية، بل هو "البوابة الرسمية الأولى للأدلة الشاملة، الشروحات العملية، وحلول المشاكل الإدارية والرقمية في الجزائر".

مهمتك: تحويل البيان أو الإعلان الرسمي المرفق الصادر عن (${site.name}) إلى "دليل شامل وعملي لحل المشاكل" (Comprehensive Problem-Solving & Service Guide) بين 1200 و 1800 كلمة، بأسلوب موجه مباشرة للمواطن الجزائري (الموظف، الباحث عن عمل، التلميذ، الطالب، المتقاعد، والمواطن العادي).

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

[بيانات الخبر والمصدر الرسمي]:
- المصدر والجهة الرسمية: ${site.name} (${site.url})
- الرابط المعتمد: ${newsItem.link}
- عنوان البيان/الإجراء: ${newsItem.title}
- تفاصيل وملخص البيان: ${newsItem.description || 'بيان رسمي صادر عن الجهة الوصية.'}
- تاريخ النشر: ${newsItem.pubDate}

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

  throw lastError || new Error('فشلت جميع نماذج Gemini المتاحة');
}

function parseGeminiToArticleJson(rawText, newsItem, site, imageInfo) {
  // تطهير النص من أي وسوم صور مكسورة أو هلوسة
  const sanitizedText = rawText
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/\n\s*---\s*\n/g, '\n\n');

  const lines = sanitizedText.split('\n').map((l) => l.trim()).filter(Boolean);

  let title = newsItem.title;
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

  const slug = generateSlug(title, newsItem.guid);

  const article = {
    title,
    introduction: introduction || sanitizedText.slice(0, 500),
    sections: sections.length > 0 ? sections : [{ heading: 'دليل الإجراءات والتفاصيل الكاملة', content: sanitizedText }],
    sourceMinistry: site.name,
    categoryId: site.categoryId,
    dateStr: new Date(newsItem.pubDate).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    officialDocumentUrl: newsItem.link,
    autoGenerated: true,
    generatedAt: new Date().toISOString(),
    registrationRequiredSites: [
      {
        name: site.name,
        url: site.portalUrl || site.url,
        requirements: 'المنصة الرقمية المعتمدة لتقديم الطلبات ومتابعة الإجراءات',
      },
    ],
  };

  if (faqs.length > 0) {
    article.faqs = faqs;
  }


  if (!imageInfo.isPlaceholder) {
    article.featuredImage = {
      url: imageInfo.url,
      alt: imageInfo.alt,
    };
  } else {
    article.placeholderImage = {
      url: imageInfo.url,
      alt: imageInfo.alt,
      note: 'صورة توضيحية — بدون بيان مصور',
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
  }
  return result.replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
}

function generateSlug(title, guid) {
  const ascii = arabicToSlug(title).slice(0, 50);
  const id = Date.now().toString(36);
  return `auto-${ascii || 'article'}-${id}`;
}


// ════════════════════════════════════════════════════════════════
// [المرحلة 4: الحفظ والفهرسة الفورية]
// ════════════════════════════════════════════════════════════════
function saveArticleToJson(slug, article) {
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

// ─── معالجة موقع حكومي واحد ──────────────────────────────────
async function processSite(site, history, articlesCount) {
  console.log(`\n🔍 [المرحلة 1: الرصد] فحص: ${site.name} (${site.id})`);

  try {
    const items = await fetchFeedItems(site.rssUrl);
    if (items.length === 0) {
      console.log(`   ℹ لا توجد عناصر في RSS`);
      return articlesCount;
    }

    let newCount = 0;
    for (const item of items) {
      // 1. فحص سجل التكرار
      if (history.processedItems[item.guid || item.link]) {
        continue;
      }

      // 2. بلوغ الحد الأقصى للجلسة
      if (articlesCount + newCount >= CONFIG.MAX_ARTICLES_PER_RUN) {
        console.log(`   ⏸ تم بلوغ حد المقالات في هذه الجلسة (${CONFIG.MAX_ARTICLES_PER_RUN}).`);
        break;
      }

      // 3. فلتر التخصص — الـ whitelist يتغلب على قائمة الاستبعاد
      const fullText = `${item.title} ${item.description}`.toLowerCase();
      const isWhitelisted = ADMIN_KEYWORDS_WHITELIST.some((kw) => fullText.includes(kw.toLowerCase()));
      const isExcluded = !isWhitelisted && EXCLUDE_KEYWORDS.some((ex) => fullText.includes(ex.toLowerCase()));
      if (isExcluded) {
        history.processedItems[item.guid || item.link] = { skippedReason: 'excluded_category', skippedAt: new Date().toISOString() };
        continue;
      }

      // 4. مصفاة الوقت ━ ذكية: الحكومية 30 يوم، الإعلامية 48 ساعة فقط
      if (!item.pubDate) {
        history.processedItems[item.guid || item.link] = { skippedReason: 'no_pubdate', skippedAt: new Date().toISOString() };
        continue;
      }
      let newsDate = new Date(item.pubDate);
      if (isNaN(newsDate.getTime())) {
        // دعم صيغة البلاد: "21:05 | 22-08-2026"
        const m = String(item.pubDate).match(/(\d{2})-(\d{2})-(\d{4})/);
        if (m) newsDate = new Date(`${m[3]}-${m[2]}-${m[1]}`);
      }
      const now = new Date();
      const diffHours = isNaN(newsDate.getTime()) ? 0 : (now.getTime() - newsDate.getTime()) / (1000 * 60 * 60);

      // الحد الزمني يختلف حسب نوع المصدر
      const maxAgeHours = site.isMediaSite
        ? CONFIG.MAX_NEWS_AGE_HOURS_MEDIA   // 48 ساعة للمواقع الإعلامية (صخب كثير)
        : CONFIG.MAX_NEWS_AGE_HOURS_GOV;    // 720 ساعة للمواقع الحكومية (تنشر نادراً)

      if (!isNaN(newsDate.getTime()) && diffHours > maxAgeHours) {
        history.processedItems[item.guid || item.link] = {
          skippedReason: site.isMediaSite ? 'media_older_than_48h' : 'gov_older_than_30d',
          skippedAt: new Date().toISOString(),
        };
        continue;
      }

      console.log(`   📰 خبر جديد مؤهل (${Math.round(diffHours)} ساعة): ${item.title.slice(0, 55)}...`);

      try {
        // [المرحلة 2: التحقق واستخراج الصورة]
        process.stdout.write('   🖼 [المرحلة 2: التحقق] استخراج الصورة الرسمية...');
        const foundImage = await extractOfficialImage(item.link);
        const imageInfo = resolveArticleImage(foundImage, site);
        console.log(imageInfo.isPlaceholder ? ` ℹ بدون بيان مصور (وضع الشعار الافتراضي)` : ` ✅ بيان مصور رسمي`);

        // [المرحلة 3: الكتابة بـ Gemini]
        process.stdout.write('   ✍ [المرحلة 3: الكتابة] صياغة المقال بـ Gemini...');
        const rawArticle = await generateArticleWithGemini(item, site);
        console.log(' ✅');

        // [المرحلة 4: الحفظ والنشر]
        const { slug, article } = parseGeminiToArticleJson(rawArticle, item, site, imageInfo);
        saveArticleToJson(slug, article);
        console.log(`   💾 [المرحلة 4: النشر] تم الحفظ: /articles/${slug}`);

        const articleUrl = `https://www.raqmanadz.com/articles/${slug}`;
        pingIndexNow(articleUrl);
        console.log(`   ⚡ تم إرسال تنبيه الفهرسة الفورية (IndexNow)`);

        history.processedItems[item.guid || item.link] = {
          slug,
          site: site.id,
          processedAt: new Date().toISOString(),
        };
        newCount++;

        await new Promise((r) => setTimeout(r, 2000));

      } catch (itemErr) {
        console.error(`   ❌ تعذر معالجة الخبر: ${itemErr.message}`);
        history.processedItems[item.guid || item.link] = { error: itemErr.message, skippedAt: new Date().toISOString() };
      }
    }

    return articlesCount + newCount;

  } catch (siteErr) {
    console.error(`   ❌ تعذر فحص ${site.name}: ${siteErr.message}`);
    return articlesCount;
  }
}

// ─── الدالة الرئيسية ──────────────────────────────────────────
async function main() {
  console.log('\n' + '='.repeat(65));
  console.log('🤖 RAQMANA — محرك الأخبار الحكومية الرسمية (Auto News Worker v3.0)');
  console.log('⏱ مصفاة الوقت: 48 ساعة | 🎯 فلتر التخصص: خدمات وحكومة فقط');
  console.log('='.repeat(65));
  console.log(`📋 عدد المواقع المجدولة: ${sitesToProcess.length} موقع\n`);

  const history = loadHistory();
  let totalArticles = 0;

  for (const site of sitesToProcess) {
    totalArticles = await processSite(site, history, totalArticles);
    saveHistory(history);
    if (totalArticles >= CONFIG.MAX_ARTICLES_PER_RUN) break;
  }

  history.lastRun = new Date().toISOString();
  saveHistory(history);

  console.log('\n' + '='.repeat(65));
  console.log(`🎉 اكتملت الجلسة — تم تحرير ونشر ${totalArticles} مقال رسمي جديد بنجاح!`);
  console.log('='.repeat(65) + '\n');
}

main().catch((err) => {
  console.error('❌ خطأ في محرك الأخبار:', err.message);
  process.exit(1);
});
