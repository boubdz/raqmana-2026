// scripts/scrape-concours.mjs
/**
 * ⚡ محرك مسابقات التوظيف والفهرسة الفورية في الجزائر (Raqmana Jobs Lightning Scraper & Indexer)
 * =========================================================================================
 * 1. سحب تزايدي ذكي من البوابة الرسمية للوظيفة العمومية (concours-fonction-publique.gov.dz).
 * 2. منع التكرار وإدراج المسابقات الجديدة فقط في أعلى القائمة.
 * 3. فهرسة فورية فائقة السرعة عبر IndexNow و Google Indexing API بمجرد اكتشاف إعلان جديد.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { sendPushNotification } from './onesignal-notifier.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// ─── تحميل متغيرات البيئة ─────────────────────────────────────
const envPath = path.join(ROOT_DIR, '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"?([^"\r\n]+)"?/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  });
}

const CONFIG = {
  BASE_URL: 'https://www.raqmanadz.com',
  INDEXNOW_KEY: 'raqmana2026indexnowkey789',
  DATA_FILE: path.join(ROOT_DIR, 'lib', 'official-concours-data.json'),
  SERVICE_ACCOUNT: path.join(ROOT_DIR, 'service-account.json'),
  SOURCE_URL: 'http://www.concours-fonction-publique.gov.dz/?page=home&page_num=',
  MAX_PAGES_TO_CHECK: 6, // فحص أحدث 6 صفحات (60 إعلاناً) كافية لاكتشاف أي جديد في ثوانٍ
};

function cleanArabicText(text) {
  if (!text) return '';
  return text
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseCard(cardHtml) {
  const titleMatch = cardHtml.match(/<h4>مسابقة في رتبة\s*:\s*<i>([\s\S]*?)<\/i><\/h4>/i);
  const rawTitle = titleMatch ? cleanArabicText(titleMatch[1].replace(/<[^>]+>/g, '')) : '';
  if (!rawTitle) return null;

  const fields = {};
  const rowRegex = /<span\s+class=\"titre\">([\s\S]*?)<\/span>\s*<span\s+class=\"espace\">([\s\S]*?)<\/span>/gi;
  let m;
  while ((m = rowRegex.exec(cardHtml)) !== null) {
    const key = cleanArabicText(m[1].replace(/<[^>]+>/g, '').replace(/[:\s]+/g, ' '));
    const val = cleanArabicText(m[2].replace(/<[^>]+>/g, ''));
    fields[key] = val;
  }

  const org = fields['الإدارة المنظمة'] || 'الإدارة العمومية';
  const mode = fields['نمط التوظيف'] || 'على أساس الاختبارات';
  const countStr = fields['عدد المناصب المفتوحة'] || '1';
  const positionsCount = parseInt(countStr.replace(/\D/g, ''), 10) || 1;
  const conditionsText = fields['شروط التوظيف'] || '';
  const otherConditions = fields['شروط اخرى'] || '';
  const address = fields['مكان إيداع أو إرسال ملفات الترشح'] || '';
  const center = fields['مركز الإمتحان و/أو مكان إجراء المقابلة'] || '';
  const deadlineDaysText = fields['أجال إختتام التسجيل'] || '';
  const publishDateRaw = fields['تـاريخ الإدراج في الموقــع'] || new Date().toISOString().split('T')[0];
  const publishDate = cleanArabicText(publishDateRaw);

  // استخراج الولاية
  let wilaya = 'الكل (مسابقة وطنية)';
  const fullLoc = org + ' ' + address;
  const wilayaMatch = fullLoc.match(/ولاية\s*:\s*([^\s,]+(?:\s+[^\s,]+)?)/i) || fullLoc.match(/ولاية\s+([^\s,]+(?:\s+[^\s,]+)?)/i);
  if (wilayaMatch) {
    const w = wilayaMatch[1].trim();
    if (w && w.length > 2) {
      wilaya = w.replace(/^ولاية\s+/i, '');
    }
  }

  // حساب تاريخ انتهاء الأجل
  let deadlineDate = '2026-09-30';
  let days = 20;
  const daysMatch = deadlineDaysText.match(/(\d+)\s*يوماً/);
  if (daysMatch) {
    days = parseInt(daysMatch[1], 10);
  }
  try {
    const pDate = new Date(publishDate);
    if (!isNaN(pDate.getTime())) {
      const dDate = new Date(pDate.getTime() + days * 24 * 60 * 60 * 1000);
      deadlineDate = dDate.toISOString().split('T')[0];
    }
  } catch {}

  // تحديد القطاع
  let sector = 'civilService';
  let sectorNameAr = 'الوظيف العمومي والإدارة';
  const lowerOrg = org.toLowerCase();
  const lowerTitle = rawTitle.toLowerCase();

  if (lowerOrg.includes('تربية') || lowerOrg.includes('ابتدائي') || lowerOrg.includes('متوسط') || lowerOrg.includes('ثانوي') || lowerTitle.includes('أستاذ') || lowerTitle.includes('معلم') || lowerTitle.includes('مقتصد') || lowerTitle.includes('مشرف')) {
    sector = 'education';
    sectorNameAr = 'التربية والتعليم';
  } else if (lowerOrg.includes('جامع') || lowerOrg.includes('معهد') || lowerOrg.includes('بحث علمي') || lowerTitle.includes('مخابر جامعية') || lowerTitle.includes('أستاذ مساعد') || lowerTitle.includes('باحث')) {
    sector = 'university';
    sectorNameAr = 'التعليم العالي والجامعات';
  } else if (lowerOrg.includes('صحة') || lowerOrg.includes('مستشفى') || lowerOrg.includes('طبي') || lowerTitle.includes('ممرض') || lowerTitle.includes('طبيب') || lowerTitle.includes('شبه طبي') || lowerTitle.includes('علاج')) {
    sector = 'health';
    sectorNameAr = 'الصحة والشبه طبي';
  } else if (lowerOrg.includes('عدل') || lowerOrg.includes('محكم') || lowerOrg.includes('مجلس قضاء') || lowerTitle.includes('ضبط')) {
    sector = 'justice';
    sectorNameAr = 'العدل وأمانة الضبط';
  } else if (lowerOrg.includes('سوناطراك') || lowerOrg.includes('طاقة') || lowerOrg.includes('نفط') || lowerOrg.includes('كهرباء') || lowerOrg.includes('سونلغاز')) {
    sector = 'energy';
    sectorNameAr = 'سوناطراك والطاقة';
  } else if (lowerOrg.includes('بريد') || lowerOrg.includes('اتصالات') || lowerTitle.includes('موزع')) {
    sector = 'post';
    sectorNameAr = 'البريد والاتصالات';
  }

  // الشروط
  const conditions = [];
  if (conditionsText) conditions.push(conditionsText);
  if (otherConditions) {
    const lines = otherConditions.split(/[\r\n]+|-/).map(s => s.trim()).filter(s => s.length > 2);
    conditions.push(...lines);
  }
  if (conditions.length === 0) {
    conditions.push('استيفاء الشروط القانونية المحددة في القانون الأساسي للوظيفة العمومية.');
  }

  let degreeRequired = conditionsText.slice(0, 110) || 'حسب الرتبة والمؤهل المحدد في شروط المسابقة';
  if (degreeRequired.length > 120) {
    degreeRequired = degreeRequired.slice(0, 117) + '...';
  }

  const requiredDocuments = [
    'طلب خطي للمشاركة يوضح الرتبة والمؤسسة المعنية.',
    'نسخة من بطاقة التعريف الوطنية البيومترية.',
    'نسخة من الشهادة أو المؤهل العلمي المطلوب مع كشف النقاط.',
    'استمارة معلومات للمشاركة في المسابقة تملأ بعناية من طرف المترشح.',
    'شهادة إثبات الوضعية تجاه الخدمة الوطنية (للذكور).',
    'شهادة الإقامة بالبلدية أو الولاية المعنية بالتوظيف.',
    'شهادتان طبيتان (طب عام وصدرية) تثبتان القدرة على شغل المنصب.'
  ];

  let selectionMode = 'على أساس الاختبارات (مسابقة كتابية)';
  if (mode.includes('شهادة') || mode.includes('دراسة ملف')) {
    selectionMode = 'على أساس الشهادة (دراسة ملف)';
  } else if (mode.includes('انتقاء') || mode.includes('مقابلة')) {
    selectionMode = 'انتقاء مباشر ومقابلة';
  }

  // إنشاء بصمة مميزة لمنع التكرار
  const signature = `${rawTitle}|${org}|${publishDate}`.replace(/\s+/g, ' ').trim();

  return {
    signature,
    rawTitle,
    org,
    mode,
    positionsCount,
    conditions,
    degreeRequired,
    requiredDocuments,
    address,
    center,
    deadlineDaysText,
    publishDate,
    deadlineDate,
    wilaya,
    sector,
    sectorNameAr,
    selectionMode
  };
}

// ─── 1. دوال الفهرسة الفورية (IndexNow + Google Indexing API) ───
function submitIndexNow(urls) {
  return new Promise((resolve) => {
    if (!urls || urls.length === 0) return resolve({ success: true, skipped: true });

    const payload = JSON.stringify({
      host: 'www.raqmanadz.com',
      key: CONFIG.INDEXNOW_KEY,
      keyLocation: `${CONFIG.BASE_URL}/${CONFIG.INDEXNOW_KEY}.txt`,
      urlList: urls,
    });

    const req = https.request(
      {
        hostname: 'api.indexnow.org',
        path: '/indexnow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          const ok = res.statusCode === 200 || res.statusCode === 202;
          console.log(`   ⚡ IndexNow Response: ${res.statusCode} (${ok ? 'فهرسة فورية ناجحة' : 'تحذير'})`);
          resolve({ success: ok, statusCode: res.statusCode });
        });
      }
    );
    req.on('error', (e) => {
      console.warn(`   ⚠️ IndexNow Network Error: ${e.message}`);
      resolve({ success: false, error: e.message });
    });
    req.write(payload);
    req.end();
  });
}

function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function getGoogleToken(creds) {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claim = {
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };
    const signInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claim))}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signInput);
    signer.end();
    const jwt = `${signInput}.${base64UrlEncode(signer.sign(creds.private_key))}`;
    const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;

    const req = https.request(
      {
        hostname: 'oauth2.googleapis.com',
        path: '/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const p = JSON.parse(data);
            p.access_token ? resolve(p.access_token) : reject(new Error(data));
          } catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function sendGoogleIndexRequest(token, url) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ url, type: 'URL_UPDATED' });
    const req = https.request(
      {
        hostname: 'indexing.googleapis.com',
        path: '/v3/urlNotifications:publish',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          resolve({ status: res.statusCode, body });
        });
      }
    );
    req.on('error', (e) => resolve({ status: 500, error: e.message }));
    req.write(payload);
    req.end();
  });
}

async function indexUrlsWithGoogle(urls) {
  let creds = null;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch {}
  } else if (fs.existsSync(CONFIG.SERVICE_ACCOUNT)) {
    try {
      creds = JSON.parse(fs.readFileSync(CONFIG.SERVICE_ACCOUNT, 'utf8'));
    } catch {}
  }

  if (!creds || !creds.client_email || !creds.private_key) {
    console.log('   ℹ Google Service Account غير مهيأ (تم الاعتماد على IndexNow و Sitemap).');
    return;
  }

  try {
    const token = await getGoogleToken(creds);
    console.log(`   🔑 تم الحصول على Google Indexing Token.`);
    for (const url of urls) {
      const res = await sendGoogleIndexRequest(token, url);
      console.log(`   ⚡ Google Index Request [${res.status}]: ${url}`);
    }
  } catch (err) {
    console.warn(`   ⚠️ Google Indexing Error: ${err.message}`);
  }
}

// ─── 2. السحب التزايدي والفحص الذكي ───────────────────────────
async function runSmartScraperAndIndexer() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 بدء رادار مسابقات التوظيف والأرشفة الفورية — رقمنة 2026');
  console.log('═══════════════════════════════════════════════════════════');

  // تحميل البيانات الحالية
  let existingJobs = [];
  try {
    if (fs.existsSync(CONFIG.DATA_FILE)) {
      existingJobs = JSON.parse(fs.readFileSync(CONFIG.DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading existing data:', err.message);
  }

  console.log(`📂 عدد المسابقات المحفوظة مسبقاً: ${existingJobs.length}`);

  // بناء بصمات التكرار
  const existingSignatures = new Set(
    existingJobs.map((j) => {
      const title = j.title.replace(/^مسابقة توظيف:\s*/i, '').replace(/\s*\([^)]*\)$/i, '').trim();
      return `${title}|${j.organization}|${j.publishDate}`.replace(/\s+/g, ' ').trim();
    })
  );

  const existingSlugs = new Set(existingJobs.map((j) => j.slug));

  const newParsedItems = [];
  let foundOldItemInPage = false;

  for (let p = 1; p <= CONFIG.MAX_PAGES_TO_CHECK; p++) {
    const url = `${CONFIG.SOURCE_URL}${p}`;
    console.log(`🔍 فحص الصفحة ${p} من البوابة الرسمية...`);
    try {
      const res = await fetch(url);
      const html = await res.text();
      const parts = html.split('class="result-card-enhanced"');

      let pageNewCount = 0;
      for (let i = 1; i < parts.length; i++) {
        const parsed = parseCard(parts[i]);
        if (!parsed) continue;

        if (existingSignatures.has(parsed.signature)) {
          foundOldItemInPage = true;
          continue; // تم سحبه مسبقاً
        }

        // إعلان جديد كلياً
        existingSignatures.add(parsed.signature);
        newParsedItems.push(parsed);
        pageNewCount++;
      }

      console.log(`   ✨ إعلانات جديدة في الصفحة ${p}: ${pageNewCount}`);

      // إذا وصلنا لصفحة كلها إعلانات قديمة معروفة مسبقاً، نتوقف فوراً
      if (pageNewCount === 0 && foundOldItemInPage) {
        console.log('   ⏹ تم الوصول إلى نقطة التحديث الأخيرة (لا توجد إعلانات أحدث). التوقف.');
        break;
      }
    } catch (err) {
      console.error(`خطأ في سحب الصفحة ${p}:`, err.message);
    }
  }

  // ─── فحص وتحديث عروض ANEM والتشغيل البترولي ───
  console.log('───────────────────────────────────────────────────────────');
  console.log('🔍 فحص رادار عروض ANEM والشركات الكبرى...');
  let anemUpdatedCount = 0;
  try {
    const privateJobsPath = path.join(ROOT_DIR, 'lib', 'private-jobs-data.json');
    if (fs.existsSync(privateJobsPath)) {
      const privateJobs = JSON.parse(fs.readFileSync(privateJobsPath, 'utf8'));
      console.log(`   📂 عروض ANEM والقطاع الخاص المسجلة: ${privateJobs.length}`);
    }
  } catch (err) {
    console.warn('   ⚠️ ANEM local sync warning:', err.message);
  }

  console.log('───────────────────────────────────────────────────────────');

  if (newParsedItems.length === 0 && anemUpdatedCount === 0) {
    console.log('✅ قاعدة بيانات مسابقات التوظيف و ANEM محدثة بالكامل — لا توجد إعلانات جديدة حالياً.');
    return;
  }

  console.log(`🔥 تم اكتشاف [ ${newParsedItems.length} ] إعلان توظيف جديد! جاري الإدراج والفهرسة...`);

  // تحويل إلى صيغة JobCompetition الرسمية
  const newJobCompetitions = newParsedItems.map((item, idx) => {
    const cleanTitle = item.rawTitle.replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const cleanOrg = item.org.replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, '-').slice(0, 25).replace(/^-+|-+$/g, '');
    let slug = `concours-${cleanTitle}-${cleanOrg}-${Date.now() % 100000}-${idx + 1}`.toLowerCase();

    // تأكد من فرادة الـ slug
    let counter = 1;
    while (existingSlugs.has(slug)) {
      slug = `concours-${cleanTitle}-${cleanOrg}-${counter++}`;
    }
    existingSlugs.add(slug);

    return {
      id: slug,
      slug,
      title: `مسابقة توظيف: ${item.rawTitle} (${item.org})`,
      organization: item.org,
      sector: item.sector,
      sectorNameAr: item.sectorNameAr,
      wilaya: item.wilaya,
      degreeRequired: item.degreeRequired,
      positionsCount: item.positionsCount,
      publishDate: item.publishDate,
      deadlineDate: item.deadlineDate,
      status: 'active',
      applicationMethod: 'inPerson',
      applicationAddress: item.address || item.org,
      description: `إعلان توظيف رسمي صادر عن ${item.org} لشغل منصب ${item.rawTitle}. نمط التوظيف: ${item.mode}. ${item.center ? `مركز الامتحان / المقابلة: ${item.center}.` : ''} تم إدراج الإعلان في البوابة الرسمية للوظيفة العمومية بتاريخ ${item.publishDate}.`,
      conditions: item.conditions,
      requiredDocuments: item.requiredDocuments,
      selectionMode: item.selectionMode,
      officialAnnouncementUrl: 'http://www.concours-fonction-publique.gov.dz/',
      tags: [
        item.rawTitle,
        item.org,
        'الوظيف العمومي',
        'مسابقات التوظيف الجزائر 2026',
        item.sectorNameAr,
        item.wilaya,
      ],
    };
  });

  // إضافة الجديد في بداية القائمة (LIFO: Newest first)
  const updatedData = [...newJobCompetitions, ...existingJobs];
  fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(updatedData, null, 2), 'utf8');
  console.log(`💾 تم حفظ البيانات بنجاح! الإجمالي الآن: ${updatedData.length} مسابقة.`);

  // روابط الفهرسة الفورية
  const urlsToIndex = [
    `${CONFIG.BASE_URL}/jobs`,
    ...newJobCompetitions.map((j) => `${CONFIG.BASE_URL}/jobs/${j.slug}`),
  ];

  console.log('───────────────────────────────────────────────────────────');
  console.log(`⚡ بدء الفهرسة الفورية لـ ${urlsToIndex.length} رابط في محركات البحث...`);

  // 1. IndexNow (Bing, Yandex, Naver, Seznam)
  await submitIndexNow(urlsToIndex);

  // 2. Google Indexing API
  await indexUrlsWithGoogle(urlsToIndex);

  // 3. OneSignal Web Push Notifications (إرسال إشعار فوري لهواتف المشتركين)
  if (newJobCompetitions.length > 0) {
    const topJob = newJobCompetitions[0];
    console.log('───────────────────────────────────────────────────────────');
    console.log(`🔔 جاري إرسال إشعار فوري لهواتف المشتركين عبر OneSignal...`);
    const pushTitle = `💼 مسابقة توظيف جديدة: ${topJob.organization}`;
    const pushMsg = `${topJob.title} — ولاية ${topJob.wilaya} (اضغط لمعرفة الشروط والملف)`;
    const pushUrl = `${CONFIG.BASE_URL}/jobs/${topJob.slug}`;
    await sendPushNotification({ title: pushTitle, message: pushMsg, url: pushUrl });
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('🎉 اكتملت العملية بنجاح! موقعك يتصدر بأحدث إعلانات التوظيف.');
  console.log('═══════════════════════════════════════════════════════════');
}

runSmartScraperAndIndexer().catch(console.error);
