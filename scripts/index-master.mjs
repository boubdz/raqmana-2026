/**
 * RAQMANA 2026 — INDEX MASTER (المحرك الشامل للأرشفة الفورية)
 * 
 * Features:
 * 1. Dynamic Discovery of all URLs (Services, Categories, Articles, Solutions, Static Pages)
 * 2. Instant IndexNow Submission (Bing, Yandex, Seznam) with batching
 * 3. Google Indexing API Automated Dispatch (with 150/day safe batching & state caching)
 * 4. Google & Bing Sitemaps Ping
 * 5. CLI Status & Verification Report
 * 
 * Usage:
 *   node scripts/index-master.mjs           # Run full indexing cycle
 *   node scripts/index-master.mjs --status  # View current indexing progress
 *   node scripts/index-master.mjs --google  # Send Google batch only
 *   node scripts/index-master.mjs --indexnow # Send IndexNow only
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Load environment variables from .env.local
const envPath = path.join(ROOT_DIR, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"?([^"\r\n]+)"?/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  });
}

const CONFIG = {
  HOST: 'www.raqmanadz.com',
  BASE_URL: 'https://www.raqmanadz.com',
  INDEXNOW_KEY: 'raqmana2026indexnowkey789',
  INDEXNOW_ENDPOINT: 'https://api.indexnow.org/indexnow',
  GOOGLE_DAILY_LIMIT: 150,
  STATE_FILE: path.join(__dirname, 'indexing-state.json'),
  CREDENTIALS_FILES: [
    path.join(ROOT_DIR, 'service-account.json'),
    path.join(ROOT_DIR, 'gsc-key.json'),
    path.join(ROOT_DIR, 'google-credentials.json'),
    path.join(ROOT_DIR, 'service_account.json')
  ]
};

// -------------------------------------------------------------
// 1. URL DISCOVERY ENGINE
// -------------------------------------------------------------
function extractServices() {
  const servicesFilePath = path.join(ROOT_DIR, 'lib', 'services-data.ts');
  const services = [];
  const categories = [];

  if (!fs.existsSync(servicesFilePath)) return { services, categories };

  const content = fs.readFileSync(servicesFilePath, 'utf8');
  
  // Extract category IDs
  const catMatches = content.matchAll(/id:\s*["']([a-zA-Z0-9_-]+)["']/g);
  for (const match of catMatches) {
    if (!categories.includes(match[1]) && match[1] !== 'dzds' && !match[1].startsWith('service-')) {
      categories.push(match[1]);
    }
  }
  if (!categories.includes('dzds')) categories.unshift('dzds');

  // Extract service URLs from category-mapper logic
  const urlRegex = /name:\s*\{\s*ar:\s*["']([^"']+)["'],\s*en:\s*["']([^"']+)["']\s*\},\s*url:\s*["']([^"']+)["']/g;
  let match;
  const idCounts = new Map();

  while ((match = urlRegex.exec(content)) !== null) {
    const nameAr = match[1];
    const url = match[3];

    let domain = '';
    try {
      domain = new URL(url).hostname.replace(/^www\./, '').split('.')[0];
    } catch {
      domain = '';
    }

    const cleanAr = nameAr
      .replace(/[^\u0621-\u064A0-9a-zA-Z]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const baseId = domain && domain.length > 2
      ? `${cleanAr}-${domain}`.toLowerCase()
      : cleanAr.toLowerCase() || `service-${Math.abs(url.length * 31)}`;

    let uniqueId = baseId;
    const count = idCounts.get(baseId) || 0;
    if (count > 0) {
      uniqueId = `${baseId}-${count + 1}`;
    }
    idCounts.set(baseId, count + 1);

    services.push({ id: uniqueId, name: nameAr, url });
  }

  return { services, categories };
}

function extractArticles() {
  const articles = [];
  
  // 1. From seo-articles-data.ts
  const seoDataPath = path.join(ROOT_DIR, 'lib', 'seo-articles-data.ts');
  if (fs.existsSync(seoDataPath)) {
    const content = fs.readFileSync(seoDataPath, 'utf8');
    const slugMatches = content.matchAll(/["']([a-zA-Z0-9_-]+)["']:\s*\{[\s\S]*?title:\s*["']/g);
    for (const m of slugMatches) {
      if (!articles.includes(m[1])) articles.push(m[1]);
    }
  }

  // 2. From custom-articles-data.json
  const customJsonPath = path.join(ROOT_DIR, 'lib', 'custom-articles-data.json');
  if (fs.existsSync(customJsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(customJsonPath, 'utf8'));
      Object.keys(data).forEach((slug) => {
        if (!articles.includes(slug)) articles.push(slug);
      });
    } catch {}
  }

  return articles;
}

function getAllUrls() {
  const { services, categories } = extractServices();
  const articles = extractArticles();

  const staticPages = [
    '',
    '/ar',
    '/en',
    '/articles',
    '/solutions',
    '/document-assistant',
    '/document-guide',
    '/feedback',
    '/privacy-policy',
    '/terms-of-service',
    '/status',
    '/sitemap'
  ];

  const solutions = [
    'dzds-portal-guide',
    'dzds-comprehensive-guide',
    'baridimob-blocked',
    'aadl3-nin-error',
    'anem-renewal-problem',
    'chifa-activation-guide',
    'sonelgaz-client-number-guide',
    'progres-transfer-guide',
    'auto-entrepreneur-tax-guide',
    'etawki3-signature-guide'
  ];

  const all = [];

  staticPages.forEach((p) => all.push(`${CONFIG.BASE_URL}${p}`));
  categories.forEach((c) => all.push(`${CONFIG.BASE_URL}/categories/${c}`));
  articles.forEach((a) => all.push(`${CONFIG.BASE_URL}/articles/${a}`));
  solutions.forEach((s) => all.push(`${CONFIG.BASE_URL}/solutions/${s}`));
  services.forEach((s) => all.push(`${CONFIG.BASE_URL}/services/${s.id}`));

  return {
    totalUrls: all,
    stats: {
      services: services.length,
      categories: categories.length,
      articles: articles.length,
      solutions: solutions.length,
      staticPages: staticPages.length
    }
  };
}

// -------------------------------------------------------------
// 2. STATE MANAGER (Tracks Submitted URLs)
// -------------------------------------------------------------
function loadState() {
  if (fs.existsSync(CONFIG.STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG.STATE_FILE, 'utf8'));
    } catch {}
  }
  return {
    lastRun: null,
    googleIndexed: {},
    indexNowSubmitted: {}
  };
}

function saveState(state) {
  fs.writeFileSync(CONFIG.STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// -------------------------------------------------------------
// 3. INDEXNOW ENGINE (Bing, Yandex, Seznam)
// -------------------------------------------------------------
async function submitIndexNow(urls) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: CONFIG.HOST,
      key: CONFIG.INDEXNOW_KEY,
      keyLocation: `${CONFIG.BASE_URL}/${CONFIG.INDEXNOW_KEY}.txt`,
      urlList: urls
    });

    const parsed = new URL(CONFIG.INDEXNOW_ENDPOINT);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            success: res.statusCode === 200 || res.statusCode === 202,
            body
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

// -------------------------------------------------------------
// 4. GOOGLE INDEXING API (Zero-Dependency JWT Auth & Dispatch)
// -------------------------------------------------------------
function getGoogleCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      if (raw.startsWith('{')) return JSON.parse(raw);
      return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
    } catch {}
  }

  for (const credPath of CONFIG.CREDENTIALS_FILES) {
    if (fs.existsSync(credPath)) {
      try {
        return JSON.parse(fs.readFileSync(credPath, 'utf8'));
      } catch {}
    }
  }

  return null;
}

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getGoogleAccessToken(creds) {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaim = base64UrlEncode(JSON.stringify(claimSet));
    const signInput = `${encodedHeader}.${encodedClaim}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signInput);
    signer.end();

    const signature = signer.sign(creds.private_key);
    const encodedSignature = base64UrlEncode(signature);
    const jwt = `${signInput}.${encodedSignature}`;

    const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;

    const req = https.request(
      {
        hostname: 'oauth2.googleapis.com',
        path: '/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.access_token) {
              resolve(parsed.access_token);
            } else {
              reject(new Error(data));
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function sendGoogleIndexingRequest(token, urlToPublish) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      url: urlToPublish,
      type: 'URL_UPDATED'
    });

    const req = https.request(
      {
        hostname: 'indexing.googleapis.com',
        path: '/v3/urlNotifications:publish',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            success: res.statusCode === 200,
            body
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

// -------------------------------------------------------------
// 5. SITEMAP PINGER
// -------------------------------------------------------------
async function pingSitemaps() {
  const sitemapUrl = encodeURIComponent(`${CONFIG.BASE_URL}/sitemap.xml`);
  const targets = [
    `https://www.google.com/ping?sitemap=${sitemapUrl}`,
    `https://www.bing.com/ping?sitemap=${sitemapUrl}`
  ];

  const results = [];
  for (const t of targets) {
    try {
      const res = await new Promise((resolve) => {
        https.get(t, (r) => {
          resolve({ url: t, status: r.statusCode });
        }).on('error', (e) => resolve({ url: t, error: e.message }));
      });
      results.push(res);
    } catch {}
  }
  return results;
}

// -------------------------------------------------------------
// 6. MAIN EXECUTION
// -------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const isStatus = args.includes('--status');
  const isGoogleOnly = args.includes('--google');
  const isIndexNowOnly = args.includes('--indexnow');

  console.log('\n======================================================');
  console.log('🚀 RAQMANA 2026 — INDEX MASTER (محرك الأرشفة الفورية)');
  console.log('======================================================\n');

  const { totalUrls, stats } = getAllUrls();
  const state = loadState();

  console.log(`📊 إجمالي الروابط المكتشفة: ${totalUrls.length}`);
  console.log(`   ├─ خدمات رقمية (Services):    ${stats.services}`);
  console.log(`   ├─ قطاعات وتصنيفات (Cats):   ${stats.categories}`);
  console.log(`   ├─ مقالات وأدلة (Articles):   ${stats.articles}`);
  console.log(`   ├─ حلول تفاعلية (Solutions):   ${stats.solutions}`);
  console.log(`   └─ صفحات أساسية (Static):     ${stats.staticPages}\n`);

  if (isStatus) {
    const googleCount = Object.keys(state.googleIndexed).length;
    const indexNowCount = Object.keys(state.indexNowSubmitted).length;
    console.log('📈 حالة الأرشفة الحالية (Indexing Status):');
    console.log(`   ├─ روابط تم إرسالها لـ Google API:  ${googleCount} / ${totalUrls.length}`);
    console.log(`   ├─ روابط أرسلت لـ IndexNow:        ${indexNowCount} / ${totalUrls.length}`);
    console.log(`   └─ آخر تشغيل للمحرك:               ${state.lastRun || 'لم يُشغل بعد'}\n`);
    return;
  }

  // ---- 1. IndexNow Submission ----
  if (!isGoogleOnly) {
    console.log('⚡ [1/3] إرسال الروابط الفوري لمحركات البحث عبر IndexNow (Bing/Yandex)...');
    const indexNowRes = await submitIndexNow(totalUrls);
    if (indexNowRes.success) {
      console.log(`   ✔ تم قبول إرسال ${totalUrls.length} رابط بنجاح (HTTP ${indexNowRes.statusCode})`);
      totalUrls.forEach((u) => (state.indexNowSubmitted[u] = new Date().toISOString()));
    } else {
      console.log(`   ⚠ رد IndexNow: ${indexNowRes.statusCode || indexNowRes.error}`);
    }
    console.log('');
  }

  // ---- 2. Google Indexing API ----
  if (!isIndexNowOnly) {
    console.log('🤖 [2/3] معالجة الإرسال الآمن لـ Google Indexing API...');
    const creds = getGoogleCredentials();

    if (!creds) {
      console.log('   ℹ لم يتم العثور على ملف service-account.json');
      console.log('   💡 لتفعيل إرسال Google API تلقائياً:');
      console.log('      1. ضع ملف المفتاح باسم service-account.json في مجلد المشروع.');
      console.log('      2. أضف البريد الخاص بالـ Service Account في Search Console كمستخدم.');
    } else {
      try {
        console.log(`   🔑 تم التعرف على الحساب: ${creds.client_email}`);
        const token = await getGoogleAccessToken(creds);

        // Find URLs not yet submitted to Google
        const unindexed = totalUrls.filter((u) => !state.googleIndexed[u]);
        const batch = unindexed.slice(0, CONFIG.GOOGLE_DAILY_LIMIT);

        console.log(`   📦 دفعة اليوم المتاحة: ${batch.length} رابط (المتبقي للغد: ${unindexed.length - batch.length})`);

        let successCount = 0;
        let quotaExhausted = false;
        for (const url of batch) {
          if (quotaExhausted) break;
          const res = await sendGoogleIndexingRequest(token, url);
          if (res.success) {
            successCount++;
            state.googleIndexed[url] = new Date().toISOString();
            process.stdout.write(`\r   ⏳ جاري الإرسال: ${successCount}/${batch.length} `);
          } else if (res.statusCode === 429) {
            // Quota exhausted for today — stop immediately and don't mark as indexed
            console.log(`\n   🛑 تم استنفاد الحصة اليومية (200 طلب/يوم). توقف تلقائي.`);
            console.log(`   ℹ سيتم إرسال الروابط المتبقية في جلسة الغد تلقائياً.`);
            quotaExhausted = true;
          } else {
            console.log(`\n   ⚠ تعذر إرسال ${url}: HTTP ${res.statusCode} - ${res.body}`);
          }
          // Safe delay (200ms)
          if (!quotaExhausted) await new Promise((r) => setTimeout(r, 200));
        }

        if (quotaExhausted) {
          console.log(`\n   ✔ تم إرسال ${successCount} رابط بنجاح قبل استنفاد الحصة.`);
        } else {
          console.log(`\n   ✔ تم إرسال ${successCount} رابط لـ Googlebot بنجاح!`);
        }
      } catch (err) {
        console.log(`   ❌ خطأ أثناء الاتصال بـ Google API: ${err.message}`);
      }
    }
    console.log('');
  }

  // ---- 3. Sitemaps Ping ----
  console.log('📡 [3/3] إرسال تنبيه خريطة الموقع (Sitemaps Ping)...');
  const pingResults = await pingSitemaps();
  pingResults.forEach((p) => {
    console.log(`   ✔ تم إرسال Ping لـ ${p.url.includes('google') ? 'Google' : 'Bing'} (Status: ${p.status || p.error})`);
  });

  state.lastRun = new Date().toISOString();
  saveState(state);

  console.log('\n======================================================');
  console.log('🎉 اكتملت عملية الأرشفة بنجاح وحُفظت النتائج في السجل!');
  console.log('======================================================\n');
}

main().catch(console.error);
