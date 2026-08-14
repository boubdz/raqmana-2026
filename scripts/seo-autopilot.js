/**
 * SEO Autopilot Engine v2.1 -- Raqmana (رقمنة الجزائر)
 * Trend-first then queue-based article writer.
 * Usage:
 *   node scripts/seo-autopilot.js              # auto-select (trend OR queue)
 *   node scripts/seo-autopilot.js <slug>       # specific article
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
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
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
  console.error('\n ERROR: OPENROUTER_API_KEY missing. Add it to GitHub Secrets.\n');
}

// ---- Target articles queue -- ordered by priority -----------------
// The bot will:
// 1. Try to match a live Google Trend to any unwritten article.
// 2. If no trend match, fall back to writing the first unwritten article in this list.
const ARTICLE_TARGETS = [
  {
    slug: 'awlya-ibtidai-2026',
    topicAr: 'التسجيل في الابتدائي 2026 عبر منصة أوليائي awlya.education.gov.dz',
    keywords: ['أرضية أوليائي', 'awlya education gov dz', 'التسجيل في الابتدائي 2026', 'فضاء الأولياء وزارة التربية', 'تسجيل الاطفال 2026'],
    officialSites: [
      { name: 'فضاء الأولياء وزارة التربية', url: 'https://awlya.education.gov.dz' },
      { name: 'وزارة التربية الوطنية', url: 'https://www.education.gov.dz' },
    ],
    internalLinks: [
      { anchor: 'قسم التربية والتعليم', path: '/categories/education' },
      { anchor: 'دليل الدخول المدرسي', path: '/articles/dawla-madrasiya-2026-2027' },
    ],
  },
  {
    slug: 'minha-5000-madrasiya-2026',
    topicAr: 'تفاصيل وشروط المنحة المدرسية 5000 دج في الجزائر 2026',
    keywords: ['المنحة المدرسية 5000 دج', 'منحة المعوزين 5000', 'ملف منحة 5000 دج', 'منحة المتمدرسين 2026', 'منحة المدرسة 2026'],
    officialSites: [
      { name: 'وزارة التربية الوطنية', url: 'https://www.education.gov.dz' },
      { name: 'وزارة التضامن الوطني', url: 'https://www.msnfcf.gov.dz' },
    ],
    internalLinks: [
      { anchor: 'قسم التربية والتعليم', path: '/categories/education' },
      { anchor: 'قسم بريد الجزائر', path: '/categories/post' },
    ],
  },
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
      { anchor: 'مقالة التشغيل', path: '/articles/employment' },
    ],
  },
  {
    slug: 'tahwilat-jamiya-progres-2026',
    topicAr: 'التحويلات الجامعية 2026 عبر منصة بروغرس progres.mesrs.dz',
    keywords: ['التحويلات الجامعية 2026', 'progres mesrs dz', 'تحويل جامعي 2026', 'منصة بروغرس'],
    officialSites: [
      { name: 'منصة بروغرس', url: 'https://progres.mesrs.dz/webtu' },
      { name: 'وزارة التعليم العالي MESRS', url: 'https://www.mesrs.dz' },
    ],
    internalLinks: [
      { anchor: 'قسم الجامعات', path: '/categories/university' },
      { anchor: 'دليل التوجيه الجامعي', path: '/articles/university' },
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
      { anchor: 'مقالة عدل', path: '/articles/aadl' },
      { anchor: 'قسم السكن', path: '/categories/aadl' },
    ],
  },
  {
    slug: 'epaiement-cib-edahabia-guide',
    topicAr: 'دليل الدفع الالكتروني بالبطاقة الذهبية Edahabia و CIB في الجزائر 2026',
    keywords: ['الدفع الالكتروني الجزائر 2026', 'بطاقة ذهبية edahabia', 'cib دفع', 'epaiement algerie'],
    officialSites: [
      { name: 'بريد الجزائر BaridiMob', url: 'https://baridimob.poste.dz' },
      { name: 'SATIM', url: 'https://www.satim.dz' },
    ],
    internalLinks: [
      { anchor: 'دليل دفع فواتير سونلغاز', path: '/articles/bills' },
      { anchor: 'قسم دفع الفواتير', path: '/categories/bills' },
    ],
  },
  {
    slug: 'dawla-madrasiya-2026-2027',
    topicAr: 'التحضيرات للدخول المدرسي 2026/2027 في الجزائر: دليل عملي شامل للأسر',
    keywords: ['الدخول المدرسي 2026', 'دخول مدرسي 2026 2027', 'لوازم المدرسة الجزائر', 'وزارة التربية الوطنية الجزائر'],
    officialSites: [
      { name: 'وزارة التربية الوطنية', url: 'https://www.education.gov.dz' },
      { name: 'ديوان الامتحانات ONEC', url: 'https://www.onec.dz' },
    ],
    internalLinks: [
      { anchor: 'قسم التربية والتعليم', path: '/categories/education' },
      { anchor: 'دليل التوجيه التعليمي', path: '/articles/education' },
    ],
  },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---- Fetch Live Google Trends for Algeria -------------------------
async function fetchGoogleTrendsDZ() {
  return new Promise((resolve) => {
    const req = https.get('https://trends.google.com/trending/rss?geo=DZ', {
      headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36' },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const titleMatches = data.match(/<title>(.*?)<\/title>/gi) || [];
        const kws = titleMatches
          .map(t => t.replace(/<\/?title>/gi, '').trim())
          .filter(t => t && t !== 'Daily Search Trends' && t !== 'Google Trends');
        resolve(kws);
      });
    });
    req.on('error', err => { console.warn('Trends RSS error:', err.message); resolve([]); });
    req.setTimeout(8000, () => { req.destroy(); resolve([]); });
  });
}

// ---- Build AI prompts --------------------------------------------
function buildSystemPrompt(target) {
  const officialSitesText = target.officialSites.map(s => `- ${s.name}: ${s.url}`).join('\n');
  const internalLinksText = target.internalLinks.map(l => `- [${l.anchor}](${CONFIG.BASE_URL}${l.path})`).join('\n');
  const keywordsText = target.keywords.join('، ');
  const today = new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });
  return `أنت محرر محتوى عربي متخصص في الخدمات الرقمية الجزائرية. اليوم هو: ${today}.
قواعد صارمة لا استثناء فيها:
1. لا تواريخ تخمينية. إذا لم تتأكد: "لم يصدر إعلان رسمي حتى الآن".
2. لا أرقام دون مصدر: "لم تُفصح الجهات الرسمية".
3. الروابط الداخلية فقط (لا تضع رابطاً لموقع خارجي قابل للنقر):\n${internalLinksText}
4. المراجع الرسمية (للذكر النصي فقط):\n${officialSitesText}
5. ذكر raqmanadz.com مرة واحدة فقط في الخاتمة.

هيكل JSON المطلوب (بدون markdown):
{
  "title": "عنوان + 2026 + ايموجي",
  "introduction": "100-150 كلمة",
  "sections": [{ "heading": "1. ...", "content": "150-250 كلمة" }],
  "registrationRequiredSites": [{ "name": "...", "url": "https://...", "requirements": "..." }]
}

المواصفات: 800-1000 كلمة، 5-6 أقسام، كلمات مفتاحية: ${keywordsText}
قسم الأسئلة الشائعة: إلزامي (5 أسئلة بصيغة س:/ج:). قسم إخلاء المسؤولية: إلزامي آخر قسم.`;
}

function buildUserPrompt(target) {
  return `اكتب مقالاً بالعربية الفصحى عن: "${target.topicAr}". أخرج JSON فقط.`;
}

// ---- OpenRouter API call ------------------------------------------
async function callOpenRouter(systemPrompt, userPrompt, retryCount) {
  if (retryCount === undefined) retryCount = 0;
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
        'Authorization': 'Bearer ' + CONFIG.OPENROUTER_API_KEY,
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
          if (parsed.error) { reject(new Error('OpenRouter: ' + parsed.error.message)); return; }
          const content = parsed.choices && parsed.choices[0] && parsed.choices[0].message && parsed.choices[0].message.content;
          if (!content) { reject(new Error('Empty response')); return; }
          resolve(content);
        } catch (e) { reject(new Error('Parse error: ' + e.message)); }
      });
    });
    req.on('error', function(err) {
      if (retryCount < CONFIG.MAX_RETRIES) {
        console.log('Retry ' + (retryCount + 1) + '/' + CONFIG.MAX_RETRIES + '...');
        setTimeout(function() {
          callOpenRouter(systemPrompt, userPrompt, retryCount + 1).then(resolve).catch(reject);
        }, 3000);
      } else { reject(err); }
    });
    req.write(payload);
    req.end();
  });
}

// ---- Quality validation ------------------------------------------
function validateArticle(article, target) {
  const errors = [];
  if (!article.title || article.title.length < 30) errors.push('Title too short');
  if (!article.introduction || article.introduction.length < 200) errors.push('Introduction too short');
  if (!article.sections || article.sections.length < 5) errors.push('Not enough sections: ' + (article.sections ? article.sections.length : 0));
  const hasFaq = article.sections && article.sections.some(function(s) {
    return s.heading && (s.heading.includes('\u0627\u0644\u0623\u0633\u0626\u0644\u0629') || s.heading.includes('\u0623\u0633\u0626\u0644\u0629'));
  });
  if (!hasFaq) errors.push('Missing FAQ section');
  const hasDisclaimer = article.sections && article.sections.some(function(s) {
    return s.heading && (s.heading.includes('\u062a\u0646\u0628\u064a\u0647') || s.heading.includes('\u0625\u062e\u0644\u0627\u0621') || s.heading.includes('\u0645\u0633\u0624\u0648\u0644\u064a\u0629'));
  });
  if (!hasDisclaimer) errors.push('Missing Legal disclaimer section');
  const fullText = JSON.stringify(article);
  const hasOfficialLink = target.officialSites.some(function(s) { return fullText.includes(s.url); });
  if (!hasOfficialLink) errors.push('No official site links found');
  return errors;
}

// ---- Inject article into seo-articles-data.ts --------------------
function addArticleToDataFile(slug, article) {
  const filePath = CONFIG.ARTICLES_DATA_PATH;
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("'" + slug + "'") || content.includes('"' + slug + '"')) {
    console.log('Article "' + slug + '" already exists. Skipping.');
    return false;
  }
  const varName = slug.replace(/-/g, '_');
  const sectionsTs = (article.sections || []).map(function(s) {
    return '    {\n      heading: ' + JSON.stringify(s.heading) + ',\n      content: ' + JSON.stringify(s.content) + ',\n    }';
  }).join(',\n');
  const sitesTs = (article.registrationRequiredSites || []).map(function(s) {
    return '    {\n      name: ' + JSON.stringify(s.name) + ',\n      url: ' + JSON.stringify(s.url) + ',\n      requirements: ' + JSON.stringify(s.requirements || '') + ',\n    }';
  }).join(',\n');
  const sitesBlock = sitesTs ? '\n  registrationRequiredSites: [\n' + sitesTs + '\n  ],' : '';
  const articleTs = '\n// Auto-generated by SEO Autopilot v2.1\nconst ' + varName + 'Article: SeoArticle = {\n  title: ' + JSON.stringify(article.title) + ',\n  introduction: ' + JSON.stringify(article.introduction) + ',\n  sections: [\n' + sectionsTs + '\n  ],' + sitesBlock + '\n};\n';
  const exportIdx = content.lastIndexOf('export const seoArticles');
  if (exportIdx === -1) { console.error('Cannot find seoArticles export'); return false; }
  const newContent = content.slice(0, exportIdx) + articleTs + '\n' + content.slice(exportIdx);
  const braceIdx = newContent.indexOf('{', newContent.indexOf('export const seoArticles'));
  const entryLine = "\n  '" + slug + "': " + varName + 'Article,';
  const finalContent = newContent.slice(0, braceIdx + 1) + entryLine + newContent.slice(braceIdx + 1);
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log('Added article "' + slug + '" to seo-articles-data.ts');
  return true;
}

// ---- IndexNow notification ---------------------------------------
function sendIndexNowNotification(urls) {
  return new Promise(function(resolve) {
    const payload = JSON.stringify({
      host: 'www.raqmanadz.com',
      key: CONFIG.INDEXNOW_KEY,
      keyLocation: CONFIG.BASE_URL + '/' + CONFIG.INDEXNOW_KEY + '.txt',
      urlList: urls,
    });
    const options = {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) },
    };
    const req = https.request(options, function(res) {
      let d = ''; res.on('data', function(c) { d += c; });
      res.on('end', function() { console.log('IndexNow: ' + res.statusCode); resolve(res.statusCode === 200 || res.statusCode === 202); });
    });
    req.on('error', function(e) { console.warn('IndexNow error: ' + e.message); resolve(false); });
    req.write(payload); req.end();
  });
}

function ensureIndexNowKeyFile() {
  if (!fs.existsSync(CONFIG.PUBLIC_DIR)) fs.mkdirSync(CONFIG.PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(CONFIG.PUBLIC_DIR, CONFIG.INDEXNOW_KEY + '.txt'), CONFIG.INDEXNOW_KEY, 'utf8');
  console.log('IndexNow key file verified');
}

function gitCommitAndPush(slug) {
  const execSync = require('child_process').execSync;
  try {
    execSync('git add lib/seo-articles-data.ts', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    execSync('git commit -m "content: add SEO article \'' + slug + '\' via autopilot v2.1"', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    execSync('git push', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('git push complete -- Vercel deploying...');
    return true;
  } catch (e) { console.error('git error: ' + e.message); return false; }
}

// ---- Main engine -------------------------------------------------
function runAutopilot() {
  console.log('\nRaqmana SEO Autopilot v2.1 -- Starting\n');
  ensureIndexNowKeyFile();

  const targetSlug = process.argv[2];

  if (targetSlug) {
    const target = ARTICLE_TARGETS.find(function(t) { return t.slug === targetSlug; });
    if (!target) {
      console.error('Slug "' + targetSlug + '" not found. Available: ' + ARTICLE_TARGETS.map(function(t) { return t.slug; }).join(', '));
      process.exit(1);
    }
    runArticleGeneration(target);
    return;
  }

  console.log('Fetching live Google Trends for Algeria (geo=DZ)...');
  fetchGoogleTrendsDZ().then(function(liveTrends) {
    if (liveTrends.length > 0) {
      console.log('Trends (' + liveTrends.length + '):', liveTrends.slice(0, 8).join(' | '));
    } else {
      console.log('No live trends. Using queue fallback.');
    }

    const existing = fs.readFileSync(CONFIG.ARTICLES_DATA_PATH, 'utf8');
    let bestTarget = null;
    let maxScore = -1;

    ARTICLE_TARGETS.forEach(function(t) {
      const isWritten = existing.includes("'" + t.slug + "'") || existing.includes('"' + t.slug + '"');
      if (isWritten) return;

      let score = 0;
      t.keywords.forEach(function(kw) {
        const kwLower = kw.toLowerCase();
        liveTrends.forEach(function(trendKw) {
          const trendLower = trendKw.toLowerCase();
          if (kwLower.includes(trendLower) || trendLower.includes(kwLower)) score += 20;
        });
      });
      if (t.slug.includes('2026')) score += 5;
      if (score > maxScore) { maxScore = score; bestTarget = t; }
    });

    // Fallback: if no trend matched, pick first unwritten article in queue
    if (!bestTarget || maxScore <= 0) {
      bestTarget = ARTICLE_TARGETS.find(function(t) {
        return !existing.includes("'" + t.slug + "'") && !existing.includes('"' + t.slug + '"');
      });
    }

    if (!bestTarget) {
      console.log('\nAll target articles published. Add new topics to continue.');
      process.exit(0);
    }

    console.log('\nSelected: "' + bestTarget.topicAr + '" (Score: ' + (maxScore > 0 ? maxScore : 'Queue') + ')');
    runArticleGeneration(bestTarget);
  });
}

function runArticleGeneration(target) {
  console.log('\nTopic: ' + target.topicAr + '\nSlug:  ' + target.slug + '\n');
  console.log('Generating via Gemini 2.5 Flash (OpenRouter)...');

  callOpenRouter(buildSystemPrompt(target), buildUserPrompt(target)).then(function(rawContent) {
    let article;
    try {
      const cleaned = rawContent.replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
      article = JSON.parse(cleaned);
    } catch (err) {
      console.error('Failed to parse JSON from AI. Raw (first 500):', rawContent.substring(0, 500));
      process.exit(1);
    }

    console.log('\nValidating quality...');
    const errors = validateArticle(article, target);
    if (errors.length > 0) {
      console.error('Quality FAILED:');
      errors.forEach(function(e) { console.error('  - ' + e); });
      const draftDir = path.join(__dirname, '../drafts');
      if (!fs.existsSync(draftDir)) fs.mkdirSync(draftDir, { recursive: true });
      fs.writeFileSync(path.join(draftDir, target.slug + '-draft.json'), JSON.stringify(article, null, 2), 'utf8');
      console.log('Draft saved: drafts/' + target.slug + '-draft.json');
      process.exit(1);
    }
    console.log('Quality PASSED\n');

    if (!addArticleToDataFile(target.slug, article)) process.exit(1);

    let pushedPromise;
    if (!process.env.CI) {
      const pushed = gitCommitAndPush(target.slug);
      pushedPromise = Promise.resolve(pushed);
    } else {
      console.log('CI mode: git handled by workflow step.');
      pushedPromise = Promise.resolve(true);
    }

    pushedPromise.then(function(pushed) {
      if (pushed) {
        const newUrl = CONFIG.BASE_URL + '/articles/' + target.slug;
        sendIndexNowNotification([newUrl, CONFIG.BASE_URL + '/articles']).then(function() {
          console.log('\nDone! Published: ' + newUrl + '\n');
        });
      }
    });
  }).catch(function(err) {
    console.error('OpenRouter failed: ' + err.message);
    process.exit(1);
  });
}

runAutopilot();
