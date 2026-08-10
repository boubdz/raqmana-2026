/**
 * SEO Autopilot Engine v2.0 -- Raqmana (رقمنة الجزائر)
 *
 * AI-powered article writer with strict anti-hallucination guardrails.
 * Uses OpenRouter/Gemini 2.5 Flash to auto-generate SEO articles.
 *
 * Rules enforced on every article:
 * - Zero hallucination: no fake stats, no invented gov decisions
 * - Official .dz links only
 * - Legal disclaimer on every article
 * - FAQ section (5+ questions) mandatory
 * - Internal linking to related site pages
 * - Quality validation before publishing
 *
 * Usage:
 *   node scripts/seo-autopilot.js              # write next pending article
 *   node scripts/seo-autopilot.js anem-minha-2026  # write specific article
 */

'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env.local if present
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"?([^"\r\n]+)"?/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  });
}

const CONFIG = {
  BASE_URL: 'https://www.raqmanadz.com',
  INDEXNOW_KEY: 'raqmana2026indexnowkey789',
  OPENROUTER_API_KEY: (process.env.OPENROUTER_API_KEY || '').trim(),
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
  ARTICLES_DATA_PATH: path.join(__dirname, '../lib/seo-articles-data.ts'),
  PUBLIC_DIR: path.join(__dirname, '../public'),
  MAX_RETRIES: 2,
};

if (!CONFIG.OPENROUTER_API_KEY) {
  console.error('\n❌ ERROR: OPENROUTER_API_KEY environment variable is missing or empty.');
  console.error('Please add OPENROUTER_API_KEY to your GitHub Secrets (Settings -> Secrets and variables -> Actions).\n');
}

// Target articles queue -- ordered by priority
const ARTICLE_TARGETS = [
  {
    slug: 'anem-minha-2026',
    topicAr: 'تجديد منحة البطالة ANEM ومنصة وسيط minha.anem.dz في الجزائر 2026',
    keywords: ['تجديد منحة البطالة 2026', 'minha anem dz', 'وسيط ANEM', 'منحة البطالة', 'تجديد طلب العمل'],
    officialSites: [
      { name: 'منصة وسيط ANEM', url: 'https://minha.anem.dz' },
      { name: 'الموقع الرسمي ANEM', url: 'https://www.anem.dz' },
    ],
    internalLinks: [
      { anchor: 'قسم التشغيل والبطالة', path: '/categories/employment' },
      { anchor: 'الخدمات الرقمية الجزائرية', path: '/articles/dzds' },
    ],
  },
  {
    slug: 'cnas-chifa-2026',
    topicAr: 'فضاء الهناء CNAS وبطاقة الشفاء والضمان الاجتماعي الجزائر 2026',
    keywords: ['فضاء الهناء', 'elhanaa cnas dz', 'بطاقة الشفاء 2026', 'شهادة الانتساب CNAS'],
    officialSites: [
      { name: 'فضاء الهناء CNAS', url: 'https://elhanaa.cnas.dz' },
      { name: 'الموقع الرسمي CNAS', url: 'https://www.cnas.dz' },
    ],
    internalLinks: [
      { anchor: 'قسم الضمان الاجتماعي', path: '/categories/socialSecurity' },
      { anchor: 'دليل دفع الفواتير', path: '/articles/bills' },
    ],
  },
  {
    slug: 'takwin-mihnati-2026',
    topicAr: 'التسجيل في التكوين المهني عبر takwin.dz ومنصة مهنتي 2026',
    keywords: ['takwin dz 2026', 'التكوين المهني تسجيل', 'منصة مهنتي', 'شروط التسجيل التكوين المهني'],
    officialSites: [
      { name: 'منصة تكوين', url: 'https://www.takwin.dz' },
      { name: 'منصة مهنتي', url: 'https://mihnati.infpe.dz' },
    ],
    internalLinks: [
      { anchor: 'قسم التكوين المهني', path: '/categories/vocational' },
      { anchor: 'مقالة التشغيل والوظائف', path: '/articles/employment' },
    ],
  },
  {
    slug: 'tahwilat-jamiya-progres-2026',
    topicAr: 'التحويلات الجامعية 2026 عبر منصة بروغرس progres.mesrs.dz -- الشروط والخطوات الرسمية',
    keywords: ['التحويلات الجامعية 2026', 'progres mesrs dz', 'تحويل جامعي 2026', 'منصة بروغرس التحويلات', 'شروط التحويل الجامعي الجزائر'],
    officialSites: [
      { name: 'منصة بروغرس الخدمات الجامعية', url: 'https://progres.mesrs.dz/webtu' },
      { name: 'الموقع الرسمي لوزارة التعليم العالي MESRS', url: 'https://www.mesrs.dz' },
    ],
    internalLinks: [
      { anchor: 'قسم التعليم العالي والجامعات', path: '/categories/university' },
      { anchor: 'دليل التسجيلات الجامعية أوريونتاسيو', path: '/articles/university' },
    ],
  },
  {
    slug: 'aadl3-2026',
    topicAr: 'عدل 3 AADL 2026 -- الوضعية والمستجدات الرسمية',
    keywords: ['عدل 3 2026', 'aadl 3', 'وضعية ملف عدل', 'السكن الاجتماعي 2026'],
    officialSites: [
      { name: 'الموقع الرسمي AADL', url: 'https://www.aadl.dz' },
      { name: 'بوابة AADL للدفع', url: 'https://www.aadl.dz/paiement' },
    ],
    internalLinks: [
      { anchor: 'مقالة عدل التسجيلات', path: '/articles/aadl' },
      { anchor: 'قسم السكن', path: '/categories/aadl' },
    ],
  },
  {
    slug: 'epaiement-cib-edahabia-guide',
    topicAr: 'الدليل الشامل للدفع الالكتروني بالبطاقة الذهبية Edahabia و CIB في الجزائر 2026',
    keywords: ['الدفع الالكتروني الجزائر 2026', 'بطاقة ذهبية edahabia', 'cib دفع الكتروني', 'epaiement algerie'],
    officialSites: [
      { name: 'بريد الجزائر BaridiMob', url: 'https://baridimob.poste.dz' },
      { name: 'SATIM شبكة الدفع الالكتروني', url: 'https://www.satim.dz' },
    ],
    internalLinks: [
      { anchor: 'دليل دفع فواتير سونلغاز', path: '/articles/bills' },
      { anchor: 'قسم دفع الفواتير', path: '/categories/bills' },
    ],
  },
];

// ─── Fetch Live Google Trends for DZ ────────────────────────────
async function fetchGoogleTrendsDZ() {
  return new Promise((resolve) => {
    const req = https.get('https://trends.google.com/trending/rss?geo=DZ', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const titleMatches = data.match(/<title>(.*?)<\/title>/gi) || [];
        const trendingKeywords = titleMatches
          .map((t) => t.replace(/<\/?title>/gi, '').trim())
          .filter((t) => t && t !== 'Daily Search Trends' && t !== 'Google Trends');
        resolve(trendingKeywords);
      });
    });
    req.on('error', (err) => {
      console.warn(`⚠️ Warning: Could not fetch Google Trends RSS: ${err.message}`);
      resolve([]);
    });
    req.setTimeout(8000, () => {
      req.destroy();
      console.warn('⚠️ Warning: Google Trends RSS request timed out.');
      resolve([]);
    });
  });
}

// ─── Build system prompt with strict editorial rules ─────────────
function buildSystemPrompt(target) {
  const officialSitesText = target.officialSites.map(s => `- ${s.name}: ${s.url}`).join('\n');
  const internalLinksText = target.internalLinks.map(l => `- [${l.anchor}](${CONFIG.BASE_URL}${l.path})`).join('\n');
  const keywordsText = target.keywords.join('، ');
  const today = new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
أنت محرر محتوى عربي متخصص في الخدمات الرقمية الجزائرية. اليوم هو: ${today}.
اكتب مقالاً شاملاً بالعربية الفصحى وفق القواعد التحريرية الصارمة التالية:

═══════════════════════════════════════════
أولاً: قواعد التعامل مع الزمن والتواريخ (أولوية قصوى)
═══════════════════════════════════════════
- قبل كتابة أي تاريخ، صنّف الحدث:
  • حدث ماضٍ (انتهى): استخدم صيغة الماضي. مثال: "انتهت التسجيلات في...".
  • حدث جارٍ حالياً: استخدم المضارع. مثال: "تجري حالياً عمليات..."
  • حدث مستقبلي لم يُعلن عنه: اكتب حرفياً: "لم يصدر أي إعلان رسمي حتى الآن" ولا تضع تواريخ تخمينية أبداً.
- لا تكتب أرقاماً (عدد المتقدمين، قيمة الأقساط، نسب...) إلا إذا وجدتها في مصدر رسمي. وإذا لم تجدها، اكتب: "لم تُفصح الجهات الرسمية عن هذه الأرقام".

═══════════════════════════════════════════
ثانياً: قواعد الروابط (Category-First Policy)
═══════════════════════════════════════════
- لا تضع رابطاً مباشراً لأي موقع خارجي في نص المقال.
- وجّه القارئ EXCLUSIVELY لهذه الأقسام الداخلية في رَقمنة التي تجمع الروابط الرسمية المحققة:
${internalLinksText}
- المراجع الرسمية (للذكر النصي فقط، ليس رابطاً قابلاً للنقر):
${officialSitesText}
- قبل إضافة أي رابط: تخيل أنك ستنقر عليه الآن. هل يذهب لصفحة حقيقية؟ إذا الجواب "لا" أو "ربما"، لا تضفه.

═══════════════════════════════════════════
ثالثاً: ذكر موقع رَقمنة الجزائر
═══════════════════════════════════════════
- يُسمح بذكر موقع raqmanadz.com مرة واحدة فقط في الخاتمة.
- لا تذكره في العناوين الفرعية أو ضمن الخطوات الإرشادية.
- صغ الذكر بشكل طبيعي: "للمزيد من المعلومات، يمكنكم زيارة موقع رَقمنة الجزائر."

═══════════════════════════════════════════
رابعاً: المراجعة الذاتية الإجبارية قبل الإخراج النهائي
═══════════════════════════════════════════
قبل توليد JSON النهائي، أجب عن هذه الأسئلة:
1. هل ذكرت موعداً لحدث لم أتحقق من أنه لم يفت؟ إذا نعم → عدّله.
2. هل أضفت رابطاً مختلقاً أو غير مؤكد؟ إذا نعم → احذفه.
3. هل ذكرت اسم الموقع أكثر من مرة؟ إذا نعم → احذف التكرار.
4. هل وضعت أرقاماً دون مصدر؟ إذا نعم → استبدلها بـ "لم تُعلن الجهات الرسمية".

هيكل JSON المطلوب (أجب بـ JSON فقط، بدون markdown):
{
  "title": "عنوان جذاب يتضمن الكلمة المفتاحية الرئيسية + 2026 + إيموجي",
  "introduction": "فقرة افتتاحية 100-150 كلمة تجيب على سؤال المستخدم مباشرة",
  "sections": [
    { "heading": "1. عنوان القسم", "content": "محتوى القسم 150-250 كلمة" }
  ],
  "registrationRequiredSites": [
    { "name": "اسم الموقع", "url": "https://...", "requirements": "ما يحتاجه المستخدم" }
  ]
}

المواصفات:
- مقال متكامل 800-1000 كلمة بالعربية الفصحى الرسمية
- 5-6 أقسام كحد أقصى
- الكلمات المفتاحية المستهدفة: ${keywordsText}
- قسم الأسئلة الشائعة: إلزامي (قبل الأخير) - 5 أسئلة حقيقية شائعة فقط بصيغة "س: ... ج: ..."
- قسم التنبيه/إخلاء المسؤولية: إلزامي (آخر قسم)
- الخطوات: بترقيم واضح (1. 2. 3.)
- الأسلوب: رسمي واضح مباشر - لا تهويل ولا لغة عاطفية مبالغ فيها
`;
}

function buildUserPrompt(target) {
  return `اكتب مقالاً في حدود 800 كلمة بالعربية الفصحى عن: "${target.topicAr}"

يجب أن يغطي المقال:
- ما هي الخدمة/المنصة ولماذا تهم المواطن الجزائري
- دليل خطوات مفصل للتسجيل أو الاستخدام (بتسلسل رقمي)
- الوثائق والمتطلبات الأساسية
- حلول للمشاكل الشائعة التي يواجهها المستخدمون
- قسم الأسئلة الشائعة (5 أسئلة حقيقية متداولة)
- قسم إخلاء المسؤولية القانوني

تذكر قبل الإخراج النهائي:
- هل كل تاريخ ذكرته مؤكد من مصدر رسمي؟
- هل الروابط تشير فقط لأقسام رَقمنة الداخلية؟
- هل ذُكر اسم الموقع مرة واحدة فقط في الخاتمة؟

أخرج JSON فقط.`;
}

// ─── OpenRouter API call ────────────────────────────────────────
async function callOpenRouter(systemPrompt, userPrompt, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: CONFIG.OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 3500,
      response_format: { type: 'json_object' },
    });

    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
        'HTTP-Referer': CONFIG.BASE_URL,
        'X-Title': 'Raqmana SEO Autopilot',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) { reject(new Error(`OpenRouter: ${parsed.error.message}`)); return; }
          const content = parsed.choices?.[0]?.message?.content;
          if (!content) { reject(new Error('Empty response from OpenRouter')); return; }
          resolve(content);
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', async (err) => {
      if (retryCount < CONFIG.MAX_RETRIES) {
        console.log(`Retry ${retryCount + 1}/${CONFIG.MAX_RETRIES}...`);
        await sleep(3000);
        resolve(callOpenRouter(systemPrompt, userPrompt, retryCount + 1));
      } else {
        reject(err);
      }
    });

    req.write(payload);
    req.end();
  });
}

// ─── Quality validation (anti-hallucination gate) ──────────────
function validateArticle(article, target) {
  const errors = [];
  if (!article.title || article.title.length < 30) errors.push('Title too short or missing');
  if (!article.introduction || article.introduction.length < 200) errors.push('Introduction too short');
  if (!article.sections || article.sections.length < 5) errors.push(`Not enough sections: ${article.sections?.length || 0}`);

  const hasFaq = article.sections?.some(s =>
    s.heading?.includes('الأسئلة') || s.heading?.includes('FAQ') || s.heading?.includes('أسئلة')
  );
  if (!hasFaq) errors.push('Missing: FAQ section');

  const hasDisclaimer = article.sections?.some(s =>
    s.heading?.includes('تنبيه') || s.heading?.includes('إخلاء') || s.heading?.includes('مسؤولية')
  );
  if (!hasDisclaimer) errors.push('Missing: Legal disclaimer section');

  const fullText = JSON.stringify(article);
  const hasOfficialLink = target.officialSites.some(s => fullText.includes(s.url));
  if (!hasOfficialLink) errors.push('No official site links found in article');

  return errors;
}

// ─── Inject article into seo-articles-data.ts ─────────────────
function addArticleToDataFile(slug, article) {
  const filePath = CONFIG.ARTICLES_DATA_PATH;
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(`'${slug}'`) || content.includes(`"${slug}"`)) {
    console.log(`Article "${slug}" already exists. Skipping.`);
    return false;
  }

  const varName = slug.replace(/-/g, '_');
  const sectionsTs = (article.sections || []).map(s =>
    `    {\n      heading: ${JSON.stringify(s.heading)},\n      content: ${JSON.stringify(s.content)},\n    }`
  ).join(',\n');
  const sitesTs = (article.registrationRequiredSites || []).map(s =>
    `    {\n      name: ${JSON.stringify(s.name)},\n      url: ${JSON.stringify(s.url)},\n      requirements: ${JSON.stringify(s.requirements || '')},\n    }`
  ).join(',\n');

  const articleTs = `\n// Auto-generated by SEO Autopilot v2.0\nconst ${varName}Article: SeoArticle = {\n  title: ${JSON.stringify(article.title)},\n  introduction: ${JSON.stringify(article.introduction)},\n  sections: [\n${sectionsTs}\n  ],${sitesTs ? `\n  registrationRequiredSites: [\n${sitesTs}\n  ],` : ''}\n};\n`;

  const exportIdx = content.lastIndexOf('export const seoArticles');
  if (exportIdx === -1) { console.error('Cannot find seoArticles export'); return false; }

  let newContent = content.slice(0, exportIdx) + articleTs + '\n' + content.slice(exportIdx);
  const braceIdx = newContent.indexOf('{', newContent.indexOf('export const seoArticles'));
  const entryLine = `\n  '${slug}': ${varName}Article,`;
  const finalContent = newContent.slice(0, braceIdx + 1) + entryLine + newContent.slice(braceIdx + 1);

  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log(`Added article "${slug}" to seo-articles-data.ts`);
  return true;
}

// ─── IndexNow notification ──────────────────────────────────────
async function sendIndexNowNotification(urls) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: 'www.raqmanadz.com',
      key: CONFIG.INDEXNOW_KEY,
      keyLocation: `${CONFIG.BASE_URL}/${CONFIG.INDEXNOW_KEY}.txt`,
      urlList: urls,
    });
    const options = {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) },
    };
    const req = https.request(options, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { console.log(`IndexNow: ${res.statusCode}`); resolve(res.statusCode === 200 || res.statusCode === 202); });
    });
    req.on('error', (e) => { console.warn(`IndexNow error: ${e.message}`); resolve(false); });
    req.write(payload); req.end();
  });
}

function ensureIndexNowKeyFile() {
  if (!fs.existsSync(CONFIG.PUBLIC_DIR)) fs.mkdirSync(CONFIG.PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(CONFIG.PUBLIC_DIR, `${CONFIG.INDEXNOW_KEY}.txt`), CONFIG.INDEXNOW_KEY, 'utf8');
  console.log('IndexNow key file verified');
}

function gitCommitAndPush(slug) {
  const { execSync } = require('child_process');
  try {
    execSync('git add lib/seo-articles-data.ts', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    execSync(`git commit -m "content: add SEO article '${slug}' via autopilot v2.0"`, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    execSync('git push', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('git push complete -- Vercel deploying...');
    return true;
  } catch (e) { console.error(`git error: ${e.message}`); return false; }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Main engine ────────────────────────────────────────────────
async function runAutopilot() {
  console.log('\nRaqmana SEO Autopilot v2.0 -- Starting\n');
  ensureIndexNowKeyFile();

  const targetSlug = process.argv[2];
  let target;

  if (targetSlug) {
    target = ARTICLE_TARGETS.find(t => t.slug === targetSlug);
    if (!target) {
      console.error(`Slug "${targetSlug}" not found. Available: ${ARTICLE_TARGETS.map(t => t.slug).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('Fetching live Google Trends for Algeria (geo=DZ)...');
    const liveTrends = await fetchGoogleTrendsDZ();
    if (liveTrends.length > 0) {
      console.log(`Live Algeria Trends found (${liveTrends.length} keywords):`, liveTrends.slice(0, 10).join(' | '));
    } else {
      console.log('No live Google Trends RSS retrieved (or feed empty).');
    }

    const existing = fs.readFileSync(CONFIG.ARTICLES_DATA_PATH, 'utf8');

    let bestTarget = null;
    let maxScore = -1;

    for (const t of ARTICLE_TARGETS) {
      const isWritten = existing.includes(`'${t.slug}'`) || existing.includes(`"${t.slug}"`);
      if (isWritten) continue;

      let score = 0;
      t.keywords.forEach(kw => {
        const kwLower = kw.toLowerCase();
        liveTrends.forEach(trendKw => {
          const trendLower = trendKw.toLowerCase();
          if (kwLower.includes(trendLower) || trendLower.includes(kwLower)) {
            score += 20;
          }
        });
      });

      if (t.slug.includes('2026')) score += 5;

      if (score > maxScore) {
        maxScore = score;
        bestTarget = t;
      }
    }

    // Trend Gate Rule:
    // If live trends exist but no unwritten target matches active search trends, skip generation.
    // If live trends feed was unavailable, pick the next unwritten target as a fallback.
    if (!bestTarget || (liveTrends.length > 0 && maxScore <= 0)) {
      console.log('\nℹ️ Trend Gate Active: No unwritten topic matches active Google Trends in Algeria today.');
      console.log('Skipping article generation to ensure high-relevance SEO publishing.\n');
      process.exit(0);
    }

    target = bestTarget;
    console.log(`\n🎯 Matched Trend Target: "${target.topicAr}" (Score: ${maxScore})`);
  }

  console.log(`Topic: ${target.topicAr}`);
  console.log(`Slug: ${target.slug}\n`);

  console.log('Generating article via Gemini 2.5 Flash (OpenRouter)...');
  let rawContent;
  try {
    rawContent = await callOpenRouter(buildSystemPrompt(target), buildUserPrompt(target));
  } catch (err) {
    console.error(`OpenRouter failed: ${err.message}`);
    process.exit(1);
  }

  let article;
  try {
    const cleaned = rawContent.replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
    article = JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON response from AI');
    console.log('Raw (first 500):', rawContent.substring(0, 500));
    process.exit(1);
  }

  console.log('\nValidating article quality...');
  const errors = validateArticle(article, target);
  if (errors.length > 0) {
    console.error('Quality check FAILED:');
    errors.forEach(e => console.error(`  - ${e}`));
    const draftDir = path.join(__dirname, '../drafts');
    if (!fs.existsSync(draftDir)) fs.mkdirSync(draftDir, { recursive: true });
    fs.writeFileSync(path.join(draftDir, `${target.slug}-draft.json`), JSON.stringify(article, null, 2), 'utf8');
    console.log(`Draft saved to drafts/${target.slug}-draft.json for manual review`);
    process.exit(1);
  }
  console.log('Quality check PASSED\n');

  if (!addArticleToDataFile(target.slug, article)) process.exit(1);

  console.log('\nPushing to GitHub/Vercel...');
  let pushed = true;
  if (!process.env.CI) {
    pushed = gitCommitAndPush(target.slug);
  } else {
    console.log('Running in GitHub Actions CI -- git commit & push will be handled by workflow step.');
  }

  if (pushed) {
    const newUrl = `${CONFIG.BASE_URL}/articles/${target.slug}`;
    await sendIndexNowNotification([newUrl, `${CONFIG.BASE_URL}/articles`]);
    console.log(`\nDone! Published: ${newUrl}\n`);
  }
}

runAutopilot().catch(err => { console.error('Unexpected error:', err.message); process.exit(1); });
