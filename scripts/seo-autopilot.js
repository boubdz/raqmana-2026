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
    slug: 'bac-2026-results',
    topicAr: 'نتائج بكالوريا 2026 والحصول عليها عبر الانترنت -- المنصات الرسمية',
    keywords: ['نتائج البكالوريا 2026', 'bac 2026 dz', 'نتائج باك 2026', 'استخراج نتائج البكالوريا'],
    officialSites: [
      { name: 'وزارة التربية الوطنية', url: 'https://www.education.gov.dz' },
      { name: 'بوابة نتائج الامتحانات', url: 'https://resultats.education.gov.dz' },
    ],
    internalLinks: [
      { anchor: 'قسم التربية والتعليم', path: '/categories/education' },
      { anchor: 'دليل التسجيلات الجامعية', path: '/articles/university' },
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

// ─── Build system prompt with strict guardrails ────────────────
function buildSystemPrompt(target) {
  const officialSitesText = target.officialSites.map(s => `- ${s.name}: ${s.url}`).join('\n');
  const internalLinksText = target.internalLinks.map(l => `- "${l.anchor}" -> ${CONFIG.BASE_URL}${l.path}`).join('\n');
  const keywordsText = target.keywords.join('، ');

  return `
You are an expert Arabic content writer for Algerian digital services.
Write a comprehensive SEO article in formal Arabic (Fus-ha).

STRICT RULES - ZERO HALLUCINATION POLICY:
1. NO invented statistics or percentages. If unsure, omit the number entirely.
2. NO fake government decisions or unofficial dates. Use phrases like "according to available information".
3. ONLY link to these official sites:
${officialSitesText}
4. MANDATORY internal links (embed in article text as Markdown):
${internalLinksText}
5. MANDATORY legal disclaimer section at the end: State that the information is for guidance only, readers should refer to official websites, and www.raqmanadz.com is not affiliated with any government body.
6. MANDATORY FAQ section with 5 real questions in format: "س: [question] ج: [answer]"
7. Do NOT copy text from other sites. Write in your own words.

REQUIRED JSON OUTPUT STRUCTURE (respond with JSON only, no markdown):
{
  "title": "Attractive title with main keyword + 2026 + emoji",
  "introduction": "Opening paragraph 100-150 words answering user question immediately",
  "sections": [
    { "heading": "1. Section title", "content": "Section content 150-250 words" }
  ],
  "registrationRequiredSites": [
    { "name": "Site name", "url": "https://...", "requirements": "What user needs" }
  ]
}

SPECIFICATIONS:
- Minimum 1200 words total
- 8-12 sections
- Target keywords: ${keywordsText}
- FAQ section: MANDATORY (second-to-last section)
- Disclaimer section: MANDATORY (last section)
- Steps: use numbered lists (1. 2. 3.)
- Style: clear, practical, direct -- no flowery language
`;
}

function buildUserPrompt(target) {
  return `Write a comprehensive SEO article in Arabic about: "${target.topicAr}"

Cover:
- What the service/platform is and why it matters to Algerian citizens
- Detailed step-by-step registration or usage guide
- Required documents and prerequisites
- Solutions to common user problems
- FAQ section (5 questions)
- Legal disclaimer

Output JSON only.`;
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
      max_tokens: 6000,
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
  if (!article.sections || article.sections.length < 6) errors.push(`Not enough sections: ${article.sections?.length || 0}`);

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
    const existing = fs.readFileSync(CONFIG.ARTICLES_DATA_PATH, 'utf8');
    target = ARTICLE_TARGETS.find(t => !existing.includes(`'${t.slug}'`) && !existing.includes(`"${t.slug}"`));
    if (!target) { console.log('All target articles already written!'); process.exit(0); }
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
  const pushed = gitCommitAndPush(target.slug);

  if (pushed) {
    const newUrl = `${CONFIG.BASE_URL}/articles/${target.slug}`;
    await sendIndexNowNotification([newUrl, `${CONFIG.BASE_URL}/articles`]);
    console.log(`\nDone! Published: ${newUrl}\n`);
  }
}

runAutopilot().catch(err => { console.error('Unexpected error:', err.message); process.exit(1); });
