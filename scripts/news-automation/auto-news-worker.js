/**
 * auto-news-worker.js — محرك أتمتة الأخبار الحكومية الجزائرية
 * ============================================================
 * يراقب المواقع الحكومية، يستخرج الأخبار، يكتب مقالات SEO احترافية
 * بالاستعانة بـ Gemini AI، ثم يحفظها في قاعدة بيانات المشروع.
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
  MAX_ARTICLES_PER_RUN: 5,    // حد أقصى للمقالات في كل دورة
  REQUEST_TIMEOUT_MS: 12000,  // مهلة الطلب 12 ثانية
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

// ─── 2. تحميل وحفظ الحالة (لتجنب إعادة نشر نفس الخبر) ────────
function loadState() {
  if (fs.existsSync(CONFIG.STATE_FILE)) {
    try { return JSON.parse(fs.readFileSync(CONFIG.STATE_FILE, 'utf8')); } catch {}
  }
  return { processedItems: {} };
}

function saveState(state) {
  fs.writeFileSync(CONFIG.STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// ─── 3. دالة طلب HTTP/HTTPS عامة ─────────────────────────────
function fetchUrl(url, timeoutMs = CONFIG.REQUEST_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(
      url,
      {
        timeout: timeoutMs,
        headers: {
          'User-Agent': 'RaqmanaNewsBot/1.0 (+https://www.raqmanadz.com)',
          'Accept': 'text/html,application/xml,application/rss+xml,*/*',
        },
      },
      (res) => {
        // متابعة التحويلات (redirects) تلقائياً حتى 3 مرات
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

    // دعم RSS 2.0 و Atom
    const items = channel.item || channel.entry || [];
    const itemsArray = Array.isArray(items) ? items : [items];

    return itemsArray.slice(0, 10).map((item) => ({
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

// ─── 5. استخراج الصورة من الصفحة باستخدام Cheerio ───────────
// ⚠ هذا القسم هو المكان الوحيد الذي يبحث فيه عن الصورة — لا يطلب من Gemini أبداً
async function extractImageFromPage(pageUrl) {
  try {
    const { body, statusCode } = await fetchUrl(pageUrl, 8000);
    if (statusCode !== 200) return null;

    const $ = cheerio.load(body);

    // الأولوية 1: og:image (أدق مصدر)
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage && isValidImageUrl(ogImage)) return ogImage.trim();

    // الأولوية 2: twitter:image
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage && isValidImageUrl(twitterImage)) return twitterImage.trim();

    // الأولوية 3: أول صورة كبيرة في المقال
    let firstLargeImg = null;
    $('img').each((_, el) => {
      if (firstLargeImg) return;
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      if (src && isValidImageUrl(src) && !src.includes('logo') && !src.includes('icon')) {
        firstLargeImg = src.startsWith('http') ? src : new URL(src, pageUrl).href;
      }
    });
    if (firstLargeImg) return firstLargeImg;

    return null; // لم توجد صورة
  } catch {
    return null; // في حالة الخطأ نعود بـ null
  }
}

function isValidImageUrl(url) {
  if (!url || url.length < 10) return false;
  return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url) || url.includes('image') || url.includes('photo');
}

// ─── 6. منطق الصورة البديلة ───────────────────────────────────
// ⚠ هذا القسم الخاص بحالة عدم وجود صورة:
// إذا لم يُعثر على صورة من الصفحة، نستخدم شعار الوزارة كصورة بديلة
// مع إضافة وسم alt واضح: "صورة توضيحية"
function resolveArticleImage(foundImage, site) {
  if (foundImage) {
    // ✅ تم العثور على صورة حقيقية من البيان
    return {
      url: foundImage,
      alt: `صورة من بيان ${site.name}`,
      isPlaceholder: false,
    };
  }

  // ⚠ لم تُوجد صورة — استخدام شعار الوزارة أو الصورة الافتراضية
  // لا نخترع رابطاً ولا نكذب على القارئ
  return {
    url: site.fallbackImage || site.logoUrl,
    alt: `صورة توضيحية — ${site.name} (بدون بيان مصور)`,
    isPlaceholder: true,
  };
}

// ─── 7. توليد المقال باستخدام Gemini AI ──────────────────────
async function generateArticleWithGemini(newsItem, site, imageInfo) {
  // تعليمات صارمة لـ Gemini بشأن الصور
  const imageInstruction = imageInfo.isPlaceholder
    ? `[تعليمات الصورة للكاتب الذكي]: لم يرسل لك السكريبت رابط صورة حقيقية من البيان.
       - لا تخترع رابط صورة.
       - لا تصف صورة غير موجودة.
       - تجاهل قسم الصور تماماً.
       - اكتفِ بالكتابة النصية الاحترافية فقط.`
    : `[الصورة المرفقة]: تم العثور على صورة رسمية من البيان: ${imageInfo.url}
       أشر إليها في المقال بشكل طبيعي إن أمكن.`;

  const prompt = `أنت محرر صحفي جزائري متخصص في تحليل وكتابة مقالات إخبارية سيو (SEO) احترافية باللغة العربية الفصيحة.

[المصدر]: ${site.name} (${site.url})
[عنوان الخبر الأصلي]: ${newsItem.title}
[ملخص البيان]: ${newsItem.description || 'غير متوفر'}
[رابط البيان الأصلي]: ${newsItem.link}
[تاريخ النشر]: ${newsItem.pubDate}

${imageInstruction}

[قواعد الكتابة الصارمة]:
1. اكتب مقالاً باللغة العربية الفصيحة بين 1000 و1500 كلمة.
2. الهيكل المطلوب:
   - عنوان H1 جذاب ومحسّن للسيو (لا يتجاوز 65 حرفاً)
   - مقدمة قوية (150-200 كلمة) تلخص الخبر وتستقطب القارئ
   - 4-6 عناوين فرعية H2 مع محتوى مفيد تحت كل منها
   - قوائم نقطية حيثما أمكن
   - خاتمة فعّالة مع دعوة للفعل (CTA)
3. اقتبس جملة حرفية واحدة على الأقل من البيان بين علامتي تنصيص مع ذكر المصدر.
4. لا تخترع أرقاماً أو تواريخ لم يذكرها البيان. إذا لم تُذكر، اكتب "لم يُكشف عن الأرقام".
5. أضف في نهاية المقال قسم "الأسئلة الشائعة (FAQ)" بسؤالين على الأقل.
6. استخدم كلمات مفتاحية ذات صلة بالجزائر والخدمة المذكورة.
7. لا تنسَ الإشارة إلى الرابط الرسمي للمصدر.

[الإخراج المطلوب]: أعد المقال كاملاً بدون أي تعليق إضافي منك. ابدأ مباشرة بعنوان H1.`;

  const candidateModels = [
    CONFIG.GEMINI_MODEL,
    'gemini-2.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-latest'
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
      // إذا كان الخطأ 503 أو غيره، نجرب النموذج التالي بعد انتظار نصف ثانية
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  throw lastError || new Error('فشلت جميع نماذج Gemini المتاحة');
}

// ─── 8. تحويل نص Gemini إلى هيكل JSON للمقال ─────────────────
function parseGeminiToArticleJson(rawText, newsItem, site, imageInfo) {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  // استخراج العنوان (H1)
  let title = newsItem.title;
  const h1Line = lines.find((l) => l.startsWith('# '));
  if (h1Line) title = h1Line.replace(/^#\s*/, '').trim();

  // استخراج المقدمة (أول فقرة قبل H2)
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

  // توليد slug من العنوان
  const slug = generateSlug(title, newsItem.guid);

  // تجميع JSON النهائي للمقال بنفس هيكل custom-articles-data.json
  const article = {
    title,
    introduction: introduction || rawText.slice(0, 500),
    sections: sections.length > 0 ? sections : [{ heading: 'تفاصيل الخبر', content: rawText }],
    sourceMinistry: site.name,
    categoryId: site.categoryId,
    dateStr: new Date(newsItem.pubDate).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    officialDocumentUrl: newsItem.link,
    autoGenerated: true,
    generatedAt: new Date().toISOString(),
  };

  // ─── إضافة الصورة إن وجدت ────────────────────────────────────
  // ⚠ القسم الخاص بحالة الصورة: نضيف الصورة فقط إذا كانت حقيقية من البيان
  // إذا كانت placeholder نضيف metadata فقط دون إدراجها في المقال كصورة رئيسية
  if (!imageInfo.isPlaceholder) {
    article.featuredImage = {
      url: imageInfo.url,
      alt: imageInfo.alt,
    };
  } else {
    // صورة توضيحية — شعار الوزارة
    article.placeholderImage = {
      url: imageInfo.url,
      alt: imageInfo.alt,
      note: 'صورة توضيحية — لا يوجد بيان مصور رسمي لهذا الخبر',
    };
  }

  return { slug, article };
}

function generateSlug(title, guid) {
  // إنشاء slug من آخر جزء من الـ guid أو من العنوان
  const base = guid
    ? guid.split('/').pop().replace(/[^a-zA-Z0-9-]/g, '-').slice(0, 60)
    : title.replace(/[^\u0621-\u064A0-9a-zA-Z\s]/g, '').replace(/\s+/g, '-').slice(0, 60);
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

// ─── 11. معالجة موقع واحد (مع Try/Catch لمنع التوقف الكامل) ─
async function processSite(site, state, articlesCount) {
  console.log(`\n🔍 فحص: ${site.name} (${site.id})`);

  try {
    // جلب RSS
    const items = await fetchRssItems(site.rssUrl);
    if (items.length === 0) {
      console.log(`   ℹ لا توجد عناصر جديدة في RSS`);
      return articlesCount;
    }

    let newCount = 0;
    for (const item of items) {
      // تجاوز العناصر السابقة
      if (state.processedItems[item.guid || item.link]) {
        continue;
      }

      if (articlesCount + newCount >= CONFIG.MAX_ARTICLES_PER_RUN) {
        console.log(`   ⏸ وصلنا للحد الأقصى للجلسة (${CONFIG.MAX_ARTICLES_PER_RUN} مقالات).`);
        break;
      }

      console.log(`   📰 خبر جديد: ${item.title.slice(0, 60)}...`);

      try {
        // استخراج الصورة بـ Cheerio (لا نطلب من Gemini أبداً)
        process.stdout.write('   🖼 استخراج الصورة...');
        const foundImage = item.link ? await extractImageFromPage(item.link) : null;
        const imageInfo = resolveArticleImage(foundImage, site);
        console.log(imageInfo.isPlaceholder
          ? ` ⚠ لم توجد صورة — سيُستخدم الشعار الرسمي`
          : ` ✅ صورة حقيقية`);

        // توليد المقال بـ Gemini
        process.stdout.write('   ✍ الكتابة بـ Gemini...');
        const rawArticle = await generateArticleWithGemini(item, site, imageInfo);
        console.log(' ✅');

        // تحويل النص إلى JSON
        const { slug, article } = parseGeminiToArticleJson(rawArticle, item, site, imageInfo);

        // حفظ المقال
        saveArticleToJson(slug, article);
        console.log(`   💾 حُفظ: /articles/${slug}`);

        // فهرسة فورية
        const articleUrl = `https://www.raqmanadz.com/articles/${slug}`;
        pingIndexNow(articleUrl);
        console.log(`   📡 IndexNow أُرسل`);

        // تحديث الحالة
        state.processedItems[item.guid || item.link] = {
          slug,
          processedAt: new Date().toISOString(),
          site: site.id,
        };
        newCount++;

        // انتظر ثانيتين بين المقالات لتجنب Rate Limiting
        await new Promise((r) => setTimeout(r, 2000));

      } catch (itemErr) {
        // ⚠ Try/Catch للعنصر الفردي: الفشل لا يوقف بقية المواقع
        console.error(`   ❌ خطأ في معالجة الخبر: ${itemErr.message}`);
        state.processedItems[item.guid || item.link] = {
          error: itemErr.message,
          skippedAt: new Date().toISOString(),
        };
      }
    }

    console.log(`   ✅ تم معالجة ${newCount} خبر جديد من ${site.name}`);
    return articlesCount + newCount;

  } catch (siteErr) {
    // ⚠ Try/Catch للموقع الكامل: إذا تعطل موقع لا يتوقف السكريبت
    console.error(`   ❌ تعذّر الوصول لـ ${site.name}: ${siteErr.message}`);
    return articlesCount;
  }
}

// ─── 12. الدالة الرئيسية ──────────────────────────────────────
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🤖 RAQMANA — محرك أتمتة الأخبار الحكومية v1.0');
  console.log('='.repeat(60));
  console.log(`📋 المواقع المجدولة: ${sitesToProcess.length} موقع`);
  console.log(`📦 الحد الأقصى للمقالات: ${CONFIG.MAX_ARTICLES_PER_RUN} مقال/جلسة\n`);

  const state = loadState();
  let totalArticles = 0;

  for (const site of sitesToProcess) {
    totalArticles = await processSite(site, state, totalArticles);
    saveState(state); // حفظ الحالة بعد كل موقع
    if (totalArticles >= CONFIG.MAX_ARTICLES_PER_RUN) break;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 اكتملت الجلسة — تم كتابة ${totalArticles} مقال جديد`);
  console.log('='.repeat(60) + '\n');
}

main().catch((err) => {
  console.error('❌ خطأ عام في المحرك:', err.message);
  process.exit(1);
});
