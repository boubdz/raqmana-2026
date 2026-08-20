/**
 * auto-news-worker.js — محرك أتمتة الأخبار الحكومية الجزائرية (مُحدّث بمصفاة الوقت وضوابط الصور)
 * =========================================================================================
 * 1. فحص خراطيم RSS للمواقع الرسمية وتصفية الأخبار الأقدم من 48 ساعة.
 * 2. استخراج og:image الحقيقية فقط عبر axios و cheerio في Node.js.
 * 3. حظر Gemini تماماً من توليد أي وسوم صور أو روابط وهمية.
 * 4. حفظ المقال وتوليد الفهرسة الفورية لمحركات البحث.
 *
 * الاستخدام:
 *   node scripts/news-automation/auto-news-worker.js             # تشغيل tier1
 *   node scripts/news-automation/auto-news-worker.js --tier=2   # تشغيل tier2
 *   node scripts/news-automation/auto-news-worker.js --all      # تشغيل الكل
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
  SITES_CONFIG: path.join(__dirname, 'sites-config.json'),
  ARTICLES_JSON: path.join(ROOT_DIR, 'lib', 'custom-articles-data.json'),
  STATE_FILE: path.join(__dirname, 'news-state.json'),
  MAX_ARTICLES_PER_RUN: 5,         // حد أقصى للمقالات في كل دورة
  REQUEST_TIMEOUT_MS: 12000,       // مهلة طلبات RSS (12 ثانية)
  MAX_NEWS_AGE_HOURS: 48,          // مصفاة الوقت: تجاهل الأخبار الأقدم من 48 ساعة
  DEFAULT_PLACEHOLDER: '/images/default-placeholder.png', // الصورة الافتراضية
};

if (!CONFIG.GEMINI_API_KEY) {
  console.error('\n❌ GEMINI_API_KEY غير موجود. أضفه إلى .env.local أو GitHub Secrets.\n');
  process.exit(1);
}

// ─── قراءة إعدادات المواقع ────────────────────────────────────
const sitesConfig = JSON.parse(fs.readFileSync(CONFIG.SITES_CONFIG, 'utf8'));

// ─── 1. تحديد الـ Tier المطلوب ────────────────────────────────
const args = process.argv.slice(2);
const tierArg = args.find((a) => a.startsWith('--tier='));
const isAll = args.includes('--all');
let sitesToProcess = [];
if (isAll) {
  sitesToProcess = [...sitesConfig.tier1, ...sitesConfig.tier2];
} else if (tierArg && tierArg.includes('2')) {
  sitesToProcess = sitesConfig.tier2;
} else {
  sitesToProcess = sitesConfig.tier1; // الافتراضي: Tier 1
}

// ─── 2. تحميل وحفظ الحالة (لتجنب إعادة معالجة أي خبر) ────────
function loadState() {
  if (fs.existsSync(CONFIG.STATE_FILE)) {
    try { return JSON.parse(fs.readFileSync(CONFIG.STATE_FILE, 'utf8')); } catch {}
  }
  return { processedItems: {} };
}

function saveState(state) {
  fs.writeFileSync(CONFIG.STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// ─── 3. دالة طلب HTTP/HTTPS عامة للـ RSS ──────────────────────
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

function fetchUrl(url, timeoutMs = CONFIG.REQUEST_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    const req = client.get(
      url,
      {
        timeout: timeoutMs,
        agent: isHttps ? httpsAgent : undefined,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RaqmanaNewsBot/1.0; +https://www.raqmanadz.com)',
          'Accept': 'text/html,application/xml,application/rss+xml,*/*',
        },
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          return fetchUrl(res.headers.location, timeoutMs).then(resolve).catch(reject);
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }
    );
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
    req.on('error', reject);
  });
}

// ─── 4. استخراج عناصر RSS ─────────────────────────────────────
async function fetchRssItems(rssUrl) {
  try {
    const { body } = await fetchUrl(rssUrl);
    const parsed = await parseStringPromise(body, { explicitArray: false });
    const channel = parsed?.rss?.channel || parsed?.feed;
    if (!channel) return [];

    const items = channel.item || channel.entry || [];
    const itemsArray = Array.isArray(items) ? items : [items];

    return itemsArray.slice(0, 15).map((item) => ({
      title: extractText(item.title),
      link: extractText(item.link) || extractText(item.id),
      description: extractText(item.description) || extractText(item.summary) || '',
      pubDate: extractText(item.pubDate) || extractText(item.updated) || new Date().toISOString(),
      guid: extractText(item.guid) || extractText(item.id) || extractText(item.link),
    }));
  } catch (err) {
    console.warn(`   ⚠ خطأ في RSS (${rssUrl}): ${err.message}`);
    return [];
  }
}

function extractText(val) {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object') return (val._ || val['$t'] || val['#text'] || '').trim();
  return String(val).trim();
}

// ─── 5. استخراج الصورة الرسمية عبر axios و cheerio ───────────
// ⚠ البحث عن الصورة يتم في Node.js فقط وبشكل معزول تماماً عن Gemini لمنع التزييف
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

    // 1. فحص og:image (المعيار الرسمي)
    const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[property="og:image:url"]').attr('content');
    if (ogImage && isValidImageUrl(ogImage)) {
      return normalizeUrl(ogImage, pageUrl);
    }

    // 2. فحص twitter:image
    const twitterImage = $('meta[name="twitter:image"]').attr('content') || $('meta[name="twitter:image:src"]').attr('content');
    if (twitterImage && isValidImageUrl(twitterImage)) {
      return normalizeUrl(twitterImage, pageUrl);
    }

    // 3. فحص أول صورة رئيسية داخل نص المقال (إن وُجدت وليست أيقونة أو لوغو)
    let bodyImage = null;
    $('article img, .post-content img, .entry-content img, .content img').each((_, el) => {
      if (bodyImage) return;
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      if (src && isValidImageUrl(src) && !src.toLowerCase().includes('logo') && !src.toLowerCase().includes('icon')) {
        bodyImage = normalizeUrl(src, pageUrl);
      }
    });
    if (bodyImage) return bodyImage;

    return null; // لم يُعثر على صورة رسمية
  } catch (err) {
    // try/catch يحمي السكريبت من التوقف إذا تعطل موقع أو رفض الاتصال
    return null;
  }
}

function isValidImageUrl(url) {
  if (!url || url.length < 8) return false;
  const lower = url.toLowerCase();
  return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(lower) || lower.includes('/uploads/') || lower.includes('image');
}

function normalizeUrl(rawUrl, baseUrl) {
  try {
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl.trim();
    return new URL(rawUrl.trim(), baseUrl).href;
  } catch {
    return null;
  }
}

// ─── 6. منطق الصورة البديلة (Fallback Logic) ─────────────────
// ⚠ إذا فشل العثور على صورة رسمية من البيان:
// نستخدم شعار الوزارة أو الصورة الافتراضية المخصصة للموقع مع وسم توضيحي
function resolveArticleImage(foundImage, site) {
  if (foundImage) {
    // ✅ تم العثور على صورة حقيقية موثقة من البيان
    return {
      url: foundImage,
      alt: `صورة رسمية من بيان ${site.name}`,
      isPlaceholder: false,
    };
  }

  // ⚠ حالة عدم وجود صورة: ندرج الصورة الافتراضية أو شعار المؤسسة
  const fallbackUrl = site.fallbackImage || site.logoUrl || CONFIG.DEFAULT_PLACEHOLDER;
  return {
    url: fallbackUrl,
    alt: `صورة توضيحية — ${site.name} (بدون بيان مصور)`,
    isPlaceholder: true,
  };
}

// ─── 7. توليد المقال باستخدام Gemini AI (نصي فقط بدون صور) ────
async function generateArticleWithGemini(newsItem, site) {
  // ⚠ تم حذف أي طلب للصور من الـ Prompt نهائياً لمنع الهلوسة والتزييف
  const prompt = `أنت محرر صحفي جزائري متخصص في تحليل وكتابة مقالات إخبارية سيو (SEO) احترافية باللغة العربية الفصيحة.

[المصدر الرسمي]: ${site.name} (${site.url})
[عنوان الخبر]: ${newsItem.title}
[ملخص البيان]: ${newsItem.description || 'غير متوفر'}
[رابط البيان]: ${newsItem.link}
[تاريخ النشر]: ${newsItem.pubDate}

[قواعد التحرير الصارمة]:
1. اكتب مقالاً إخبارياً تحليلياً باللغة العربية الفصيحة بين 1000 و1500 كلمة.
2. الهيكل الإلزامي:
   - عنوان رئيسي H1 جذاب ومحسّن لمحركات البحث (لا يتجاوز 65 حرفاً)
   - مقدمة قوية وشاملة (150-200 كلمة) تلخص سياق الخبر وتجذب القارئ
   - 4 إلى 6 عناوين فرعية H2 مع شرح وتفاصيل وافية تحت كل عنوان
   - قوائم نقطية لتبسيط الخطوات أو الشروط للمواطنين
   - قسم في النهاية: الأسئلة الشائعة (FAQ) بسؤالين وإجابتين مفصلتين
   - خاتمة وتوجيهات للمواطنين مع ذكر رابط المصدر الرسمي
3. اقتبس جملة أو فقرة حرفية واحدة على الأقل من البيان بين علامتي تنصيص مع نسبتها للمصدر.
4. لا تخترع أي أرقام، إحصائيات، أو تواريخ غير مذكورة في البيان. إذا لم تُذكر، اكتب صراحة: "لم يُكشف عن الأرقام الرسمية بعد".
5. قواعد صارمة جداً بخصوص الصور:
   - يُمْنَع منعاً باتاً كتابة أي كود أو وسم صور من نوع Markdown مثل ![]() أو HTML <img>.
   - لا تضع أي روابط صور إطلاقاً ولا تصف صورة غير موجودة.
   - ركّز حصرياً على المحتوى النصي المتقن فقط؛ إدارة الصور تتم برمجياً خارج الذكاء الاصطناعي.

[الإخراج المطلوب]: ابدأ مباشرة بعنوان # H1 بدون أي مقدمات أو هوامش تعليقية منك.`;

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

      return result; // نجح التوليد
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  throw lastError || new Error('فشلت جميع نماذج Gemini المتاحة');
}

// ─── 8. تحويل نص Gemini إلى هيكل JSON للمقال وتطهير الصور الوهمية ──
function parseGeminiToArticleJson(rawText, newsItem, site, imageInfo) {
  // تنظيف النص وتطهير أي هلوسة صور قد يفلت بها الذكاء الاصطناعي
  const sanitizedText = rawText
    .replace(/!\[.*?\]\(.*?\)/g, '')   // إزالة أي وسم صورة markdown وهمي
    .replace(/<img[^>]*>/gi, '')       // إزالة أي وسم html img وهمي
    .replace(/\n\s*---\s*\n/g, '\n\n'); // إزالة الخطوط الأفقية الزائدة

  const lines = sanitizedText.split('\n').map((l) => l.trim()).filter(Boolean);

  // استخراج العنوان (H1)
  let title = newsItem.title;
  const h1Line = lines.find((l) => l.startsWith('# '));
  if (h1Line) title = h1Line.replace(/^#\s*/, '').trim();

  // استخراج المقدمة (أول فقرة قبل أول H2)
  let introduction = '';
  let inIntro = false;
  for (const line of lines) {
    if (line.startsWith('# ')) { inIntro = true; continue; }
    if (inIntro && line.startsWith('## ')) break;
    if (inIntro && line) introduction += line + '\n';
  }
  introduction = introduction.trim();

  // استخراج الأقسام (H2 + المحتوى)
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

  // توليد slug فريد
  const slug = generateSlug(title, newsItem.guid);

  // تجميع هيكل المقال النهائي
  const article = {
    title,
    introduction: introduction || sanitizedText.slice(0, 500),
    sections: sections.length > 0 ? sections : [{ heading: 'تفاصيل الخبر والبيان الرسمي', content: sanitizedText }],
    sourceMinistry: site.name,
    categoryId: site.categoryId,
    dateStr: new Date(newsItem.pubDate).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    officialDocumentUrl: newsItem.link,
    autoGenerated: true,
    generatedAt: new Date().toISOString(),
  };

  // ─── ربط الصورة المستخرجة عبر Node.js بالبيانات ───────────────
  if (!imageInfo.isPlaceholder) {
    article.featuredImage = {
      url: imageInfo.url,
      alt: imageInfo.alt,
    };
  } else {
    article.placeholderImage = {
      url: imageInfo.url,
      alt: imageInfo.alt,
      note: 'صورة توضيحية — لا يوجد بيان مصور رسمي لهذا الخبر',
    };
  }

  return { slug, article };
}

function generateSlug(title, guid) {
  const base = guid
    ? guid.split('/').pop().replace(/[^a-zA-Z0-9-]/g, '-').slice(0, 50)
    : title.replace(/[^\u0621-\u064A0-9a-zA-Z\s]/g, '').replace(/\s+/g, '-').slice(0, 50);
  return `auto-${base}-${Date.now().toString(36)}`.toLowerCase();
}

// ─── 9. حفظ المقال في custom-articles-data.json ───────────────
function saveArticleToJson(slug, article) {
  let data = {};
  if (fs.existsSync(CONFIG.ARTICLES_JSON)) {
    try { data = JSON.parse(fs.readFileSync(CONFIG.ARTICLES_JSON, 'utf8')); } catch {}
  }
  data[slug] = article;
  fs.writeFileSync(CONFIG.ARTICLES_JSON, JSON.stringify(data, null, 2), 'utf8');
}

// ─── 10. فهرسة فورية بـ IndexNow ─────────────────────────────
function pingIndexNow(url) {
  const payload = JSON.stringify({
    host: 'www.raqmanadz.com',
    key: 'raqmana2026indexnowkey789',
    keyLocation: 'https://www.raqmanadz.com/raqmana2026indexnowkey789.txt',
    urlList: [url],
  });
  const req = https.request(
    { hostname: 'api.indexnow.org', path: '/indexnow', method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) } },
    (res) => res.resume()
  );
  req.on('error', () => {});
  req.write(payload);
  req.end();
}

// ─── 11. معالجة موقع واحد (مع تطبيق مصفاة الوقت والـ Try/Catch) ─
async function processSite(site, state, articlesCount) {
  console.log(`\n🔍 فحص: ${site.name} (${site.id})`);

  try {
    const items = await fetchRssItems(site.rssUrl);
    if (items.length === 0) {
      console.log(`   ℹ لا توجد عناصر في RSS`);
      return articlesCount;
    }

    let newCount = 0;
    for (const item of items) {
      // 1. تجاوز الأخبار التي تمت معالجتها سابقاً
      if (state.processedItems[item.guid || item.link]) {
        continue;
      }

      // 2. التوقف عند بلوغ الحد الأقصى للمقالات في الدورة الواحدة
      if (articlesCount + newCount >= CONFIG.MAX_ARTICLES_PER_RUN) {
        console.log(`   ⏸ وصلنا للحد الأقصى للجلسة (${CONFIG.MAX_ARTICLES_PER_RUN} مقالات).`);
        break;
      }

      // ─── شرط مصفاة الوقت (Time Filter): حماية السيو من الأخبار القديمة ───
      // إذا كان الخبر أقدم من 48 ساعة من الوقت الحالي، نقوم بتخطيه فوراً (continue)
      const newsDate = new Date(item.pubDate);
      const now = new Date();
      const diffHours = (now.getTime() - newsDate.getTime()) / (1000 * 60 * 60);

      if (isNaN(diffHours) || diffHours > CONFIG.MAX_NEWS_AGE_HOURS) {
        const ageLabel = isNaN(diffHours) ? 'تاريخ غير معروف' : `${Math.round(diffHours)} ساعة مضت`;
        console.log(`   ⏭ تم تخطي الخبر لأنه قديم (${ageLabel}): ${item.title.slice(0, 45)}...`);
        state.processedItems[item.guid || item.link] = {
          skippedReason: 'older_than_48h',
          pubDate: item.pubDate,
          skippedAt: new Date().toISOString(),
        };
        continue;
      }

      console.log(`   📰 خبر طازج وجديد (${Math.round(diffHours)} ساعة): ${item.title.slice(0, 55)}...`);

      try {
        // استخراج الصورة الرسمية عبر axios و cheerio (في Node.js فقط)
        process.stdout.write('   🖼 استخراج الصورة الرسمية...');
        const foundImage = await extractOfficialImage(item.link);
        const imageInfo = resolveArticleImage(foundImage, site);
        console.log(imageInfo.isPlaceholder
          ? ` ⚠ لا توجد صورة رسمية — تم إدراج الشعار التوضيحي`
          : ` ✅ تم العثور على og:image حقيقية`);

        // توليد المقال النصي بـ Gemini (بدون أي صور)
        process.stdout.write('   ✍ تحرير المقال بـ Gemini...');
        const rawArticle = await generateArticleWithGemini(item, site);
        console.log(' ✅');

        // تحويل النص إلى JSON وتطهيره
        const { slug, article } = parseGeminiToArticleJson(rawArticle, item, site, imageInfo);

        // حفظ المقال
        saveArticleToJson(slug, article);
        console.log(`   💾 حُفظ: /articles/${slug}`);

        // فهرسة فورية في محركات البحث
        const articleUrl = `https://www.raqmanadz.com/articles/${slug}`;
        pingIndexNow(articleUrl);
        console.log(`   📡 تم إرسال IndexNow`);

        // تحديث السجل
        state.processedItems[item.guid || item.link] = {
          slug,
          processedAt: new Date().toISOString(),
          site: site.id,
        };
        newCount++;

        // انتظار ثانيتين بين المقالات
        await new Promise((r) => setTimeout(r, 2000));

      } catch (itemErr) {
        // try/catch لكل خبر على حدة لكي لا يوقف باقي الأخبار
        console.error(`   ❌ خطأ أثناء معالجة الخبر: ${itemErr.message}`);
        state.processedItems[item.guid || item.link] = {
          error: itemErr.message,
          skippedAt: new Date().toISOString(),
        };
      }
    }

    console.log(`   ✅ معالجة ${newCount} خبر جديد من ${site.name}`);
    return articlesCount + newCount;

  } catch (siteErr) {
    // try/catch للموقع ككل: إذا تعطل السيرفر الخاص بأي وزارة، يكمل السكريبت عمله مع باقي الوزارات
    console.error(`   ❌ تعذّر جلب بيانات ${site.name}: ${siteErr.message}`);
    return articlesCount;
  }
}

// ─── 12. الدالة الرئيسية ──────────────────────────────────────
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🤖 RAQMANA — محرك أتمتة الأخبار الحكومية v2.0');
  console.log('⏱ مصفاة الوقت: أخبار الـ 48 ساعة الأخيرة فقط');
  console.log('🖼 ضوابط الصور: og:image حقيقية فقط + حظر هلوسة Gemini');
  console.log('='.repeat(60));
  console.log(`📋 المواقع المجدولة: ${sitesToProcess.length} موقع`);
  console.log(`📦 الحد الأقصى للمقالات: ${CONFIG.MAX_ARTICLES_PER_RUN} مقال/جلسة\n`);

  const state = loadState();
  let totalArticles = 0;

  for (const site of sitesToProcess) {
    totalArticles = await processSite(site, state, totalArticles);
    saveState(state);
    if (totalArticles >= CONFIG.MAX_ARTICLES_PER_RUN) break;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 اكتملت الجلسة — تم كتابة ${totalArticles} مقال جديد حديث`);
  console.log('='.repeat(60) + '\n');
}

main().catch((err) => {
  console.error('❌ خطأ عام في المحرك:', err.message);
  process.exit(1);
});
