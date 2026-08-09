/**
 * Raqmana News Catcher Engine v1.0
 *
 * Automatically scans official Algerian government RSS feeds and news sources
 * for new announcements related to social/administrative services.
 * When new breaking news is detected, it auto-generates an SEO article
 * using Gemini AI, publishes it, and shares it on Facebook & Telegram.
 *
 * Usage:
 *   node scripts/news-catcher.js
 *
 * Runs automatically every 12 hours via GitHub Actions.
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

const { shareArticleOnSocials } = require('./social-poster.js');

const CONFIG = {
  BASE_URL: 'https://www.raqmanadz.com',
  INDEXNOW_KEY: 'raqmana2026indexnowkey789',
  OPENROUTER_API_KEY: (process.env.OPENROUTER_API_KEY || '').trim(),
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
  ARTICLES_DATA_PATH: path.join(__dirname, '../lib/seo-articles-data.ts'),
  // File that tracks which news items were already processed to avoid duplicates
  SEEN_ITEMS_PATH: path.join(__dirname, '../lib/news-seen-items.json'),
  MAX_RETRIES: 2,
};

// ─── Official Algerian Government RSS/News Sources ──────────────────────────
// These are the official news feeds we monitor for breaking announcements
const NEWS_SOURCES = [
  {
    name: 'APS - وكالة الأنباء الجزائرية',
    rssUrl: 'https://www.aps.dz/index.php/ar/?format=feed&type=rss',
    keywords: ['تسجيل', 'بكالوريا', 'منحة', 'سكن', 'مباراة', 'مسابقة', 'اجتماعي', 'عمل', 'توظيف', 'مزايا']
  },
  {
    name: 'وزارة العمل والتشغيل',
    rssUrl: 'https://www.mtss.gov.dz/index.php/ar/actualites?format=feed&type=rss',
    keywords: ['منحة', 'تشغيل', 'عمل', 'بطالة', 'ANEM', 'ANS']
  },
  {
    name: 'وزارة التربية الوطنية',
    rssUrl: 'https://www.education.gov.dz/ar/actualites/?feed=rss2',
    keywords: ['بكالوريا', 'تسجيل', 'امتحانات', 'نتائج', 'إعلان']
  },
  {
    name: 'وزارة التعليم العالي',
    rssUrl: 'https://www.mesrs.dz/index.php/ar/actualites?format=feed&type=rss',
    keywords: ['تسجيل', 'منحة', 'جامعة', 'orientation', 'تحويل', 'إيواء']
  },
  {
    name: 'وزارة السكن والعمران',
    rssUrl: 'https://www.mhu.gov.dz/ar/actualites?format=feed&type=rss',
    keywords: ['سكن', 'AADL', 'LPA', 'LLS', 'عدل', 'تسجيل']
  }
];

// ─── Breaking news article template ────────────────────────────────────────
function buildNewsSystemPrompt() {
  return `أنت محرر صحفي متخصص في الشؤون الإدارية والخدمات الرقمية الجزائرية.
مهمتك: كتابة مقال إخباري عاجل وشامل للموقع يتوافق مع معايير SEO العربية.
القواعد الصارمة:
1. المعلومات فقط من الخبر المقدم، لا تخترع أرقاماً أو تواريخ أو قرارات.
2. ضع رابطاً رسمياً واحداً على الأقل من نطاق .gov.dz أو .dz.
3. أضف تنبيهاً قانونياً في نهاية المقال: "المعلومات أعلاه مستمدة من المصادر الرسمية. يرجى متابعة الجهات الرسمية للتحديثات."
4. استخدم أسلوباً صحفياً واضحاً وجذاباً للقارئ الجزائري.
5. العنوان يجب أن يكون لافتاً ويحتوي على كلمات بحثية مهمة.
أعد JSON فقط بنفس البنية المطلوبة.`;
}

function buildNewsUserPrompt(newsItem) {
  return `الخبر الرسمي المكتشف:
العنوان: "${newsItem.title}"
المصدر: "${newsItem.source}"
الرابط الأصلي: "${newsItem.link}"
ملخص الخبر: "${newsItem.description}"
تاريخ الخبر: "${newsItem.pubDate}"

اكتب مقالاً إخبارياً شاملاً بهذا الخبر بالعربية الفصحى الواضحة مع:
- العنوان الجذاب (title) مع سنة 2026
- مقدمة تلخيصية قوية (introduction, ~200 كلمة)
- 5 أقسام شرحية مفصلة (sections: heading + content)
- قسم للأسئلة الشائعة (5 أسئلة وإجابات)
- إخلاء مسؤولية قانونية

الرابط الرسمي: "${newsItem.link}"

أعد JSON فقط بهذا الشكل:
{
  "title": "...",
  "introduction": "...",
  "sections": [{"heading": "...", "content": "..."}, ...],
  "registrationRequiredSites": [{"name": "المصدر الرسمي", "url": "${newsItem.link}", "requirements": "للاطلاع على التفاصيل الكاملة"}]
}`;
}

// ─── HTTP utility ──────────────────────────────────────────────────────────
function fetchUrl(url, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : require('http');
    const req = lib.get(url, { timeout: timeoutMs, headers: { 'User-Agent': 'Raqmana-NewsBot/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, timeoutMs).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
  });
}

// ─── Simple RSS XML Parser ────────────────────────────────────────────────
function parseRssItems(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXml = match[1];
    const get = (tag) => {
      const m = itemXml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>|<${tag}[^>]*>([^<]*)<\/${tag}>`, 'i'));
      return m ? (m[1] || m[2] || '').trim() : '';
    };
    const title = get('title');
    const link = get('link');
    const description = get('description');
    const pubDate = get('pubDate');
    if (title && link) {
      items.push({ title, link, description: description.replace(/<[^>]*>/g, '').substring(0, 500), pubDate });
    }
  }
  return items;
}

// ─── Check if item is relevant to Raqmana audience ────────────────────────
function isRelevantItem(item, keywords) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return keywords.some(kw => text.includes(kw.toLowerCase()));
}

// ─── Seen items tracker ────────────────────────────────────────────────────
function loadSeenItems() {
  if (fs.existsSync(CONFIG.SEEN_ITEMS_PATH)) {
    try { return JSON.parse(fs.readFileSync(CONFIG.SEEN_ITEMS_PATH, 'utf8')); }
    catch { return []; }
  }
  return [];
}

function markItemAsSeen(link) {
  const seen = loadSeenItems();
  if (!seen.includes(link)) {
    seen.push(link);
    // Keep only last 500 items to avoid file bloat
    const trimmed = seen.slice(-500);
    fs.writeFileSync(CONFIG.SEEN_ITEMS_PATH, JSON.stringify(trimmed, null, 2), 'utf8');
  }
}

// ─── OpenRouter API call ───────────────────────────────────────────────────
async function callOpenRouter(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: CONFIG.OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 4096,
    });
    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
        'HTTP-Referer': CONFIG.BASE_URL,
        'X-Title': 'Raqmana-NewsCatcher',
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.message?.content;
          if (!content) return reject(new Error(`No content in response: ${data.substring(0, 300)}`));
          resolve(content);
        } catch (e) { reject(new Error(`JSON parse failed: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ─── Generate slug from Arabic title ──────────────────────────────────────
function generateSlug(title, pubDate) {
  const date = new Date(pubDate || Date.now());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  // Use timestamp-based slug for uniqueness
  const ts = `${year}${month}${day}`;
  // Extract key Arabic words (very basic romanization for slug)
  const keyWords = title
    .replace(/[^\u0600-\u06FF\s0-9]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join('-');
  return `news-${ts}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '').substring(0, 60);
}

// ─── Add news article to the data file ────────────────────────────────────
function addNewsArticleToDataFile(slug, article) {
  const filePath = CONFIG.ARTICLES_DATA_PATH;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes(`'${slug}'`) || content.includes(`"${slug}"`)) {
    console.log(`Article "${slug}" already exists, skipping.`);
    return false;
  }

  const sections = (article.sections || []).map(s => 
    `    {\n      heading: ${JSON.stringify(s.heading)},\n      content: ${JSON.stringify(s.content)},\n    }`
  ).join(',\n');
  
  const sites = (article.registrationRequiredSites || []).map(s =>
    `    { name: ${JSON.stringify(s.name)}, url: ${JSON.stringify(s.url)}, requirements: ${JSON.stringify(s.requirements || '')} }`
  ).join(',\n');

  const articleCode = `

// Auto-generated by Raqmana News Catcher Engine v1.0
const ${slug.replace(/-/g, '_')}Article: SeoArticle = {
  title: ${JSON.stringify(article.title)},
  introduction: ${JSON.stringify(article.introduction)},
  sections: [
${sections}
  ],
  registrationRequiredSites: [
${sites}
  ],
};

seoArticles['${slug}'] = ${slug.replace(/-/g, '_')}Article;
`;

  // Insert before the last line (the export statement)
  const exportIdx = content.lastIndexOf('\nexport');
  if (exportIdx === -1) {
    content += articleCode;
  } else {
    content = content.substring(0, exportIdx) + articleCode + content.substring(exportIdx);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ News article "${slug}" added to seo-articles-data.ts`);
  return true;
}

// ─── Send IndexNow notification ────────────────────────────────────────────
async function sendIndexNow(url) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.indexnow.org',
      path: `/indexnow?url=${encodeURIComponent(url)}&key=${CONFIG.INDEXNOW_KEY}`,
      method: 'GET',
    };
    https.get(options, (res) => {
      console.log(`IndexNow ping: ${res.statusCode} for ${url}`);
      resolve();
    }).on('error', () => resolve());
  });
}

// ─── Git commit and push (when running locally) ────────────────────────────
function gitCommitAndPush(slug) {
  const { execSync } = require('child_process');
  try {
    execSync('git config --global user.name "Raqmana NewsCatcher Bot"', { stdio: 'inherit' });
    execSync('git config --global user.email "bot@raqmanadz.com"', { stdio: 'inherit' });
    execSync('git add -A', { stdio: 'inherit' });
    execSync(`git commit -m "news(auto): breaking news article - ${slug}"`, { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    return true;
  } catch (err) {
    console.error('Git push failed:', err.message);
    return false;
  }
}

// ─── Main News Catcher runner ─────────────────────────────────────────────
async function runNewsCatcher() {
  console.log('\n🔍 Raqmana News Catcher Engine v1.0 starting...\n');
  
  if (!CONFIG.OPENROUTER_API_KEY) {
    console.error('❌ ERROR: OPENROUTER_API_KEY is missing. Please set it in GitHub Secrets.');
    process.exit(1);
  }

  const seenItems = loadSeenItems();
  let foundNew = false;

  for (const source of NEWS_SOURCES) {
    console.log(`\n📡 Scanning: ${source.name}...`);
    let rssContent;
    try {
      rssContent = await fetchUrl(source.rssUrl);
    } catch (err) {
      console.warn(`  ⚠️  Failed to fetch RSS from ${source.name}: ${err.message}`);
      continue;
    }
    
    const items = parseRssItems(rssContent);
    console.log(`  Found ${items.length} items`);
    
    for (const item of items) {
      // Skip already processed items
      if (seenItems.includes(item.link)) continue;
      
      // Check if item is relevant to Raqmana audience
      if (!isRelevantItem(item, source.keywords)) {
        markItemAsSeen(item.link);
        continue;
      }
      
      console.log(`\n🔥 BREAKING: "${item.title}"`);
      console.log(`   Source: ${source.name}`);
      console.log(`   Link: ${item.link}`);
      
      // Generate article using Gemini AI
      console.log('\n✍️  Generating SEO article with Gemini AI...');
      let rawContent;
      try {
        rawContent = await callOpenRouter(
          buildNewsSystemPrompt(),
          buildNewsUserPrompt({ ...item, source: source.name })
        );
      } catch (err) {
        console.error(`  AI generation failed: ${err.message}`);
        markItemAsSeen(item.link);
        continue;
      }
      
      let article;
      try {
        const cleaned = rawContent.replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
        article = JSON.parse(cleaned);
      } catch {
        console.error('  Failed to parse AI response as JSON, skipping.');
        markItemAsSeen(item.link);
        continue;
      }
      
      // Generate unique slug for this news article
      const slug = generateSlug(item.title, item.pubDate);
      
      // Add to data file
      const added = addNewsArticleToDataFile(slug, article);
      if (!added) {
        markItemAsSeen(item.link);
        continue;
      }
      
      // Mark as seen so we don't re-process it
      markItemAsSeen(item.link);
      foundNew = true;
      
      // Share on social media (Facebook + Telegram)
      await shareArticleOnSocials(slug, article.title, article.introduction);
      
      // Commit and push
      const articleUrl = `${CONFIG.BASE_URL}/articles/${slug}`;
      if (!process.env.CI) {
        gitCommitAndPush(slug);
      } else {
        console.log('Running in CI - git push handled by workflow step.');
      }
      
      // Ping IndexNow
      await sendIndexNow(articleUrl);
      
      console.log(`\n✅ Published breaking news article: ${articleUrl}`);
      
      // Only publish ONE new article per run to avoid spam
      break;
    }
    
    if (foundNew) break;
  }
  
  if (!foundNew) {
    console.log('\n✅ No new relevant news found at this time. Will check again later.\n');
  }
  
  console.log('\n🏁 News Catcher Engine finished.\n');
}

runNewsCatcher().catch(err => {
  console.error('Unexpected error in News Catcher:', err.message);
  process.exit(1);
});
