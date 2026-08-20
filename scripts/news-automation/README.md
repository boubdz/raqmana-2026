# 🤖 دليل نظام أتمتة الأخبار الحكومية — راقمنا للأنباء

> نظام ذكي يراقب المواقع الحكومية الجزائرية تلقائياً، يستخرج الأخبار، ويكتب مقالات SEO احترافية بالعربية باستخدام Gemini AI.

---

## 📋 فهرس المحتوى

1. [هيكل النظام](#هيكل-النظام)
2. [إعداد GitHub Secrets](#إعداد-github-secrets)
3. [التشغيل المحلي](#التشغيل-المحلي)
4. [إضافة مواقع جديدة](#إضافة-مواقع-جديدة)
5. [قواعد الصور والمحتوى](#قواعد-الصور-والمحتوى)
6. [الأسئلة الشائعة](#الأسئلة-الشائعة)

---

## 🏗 هيكل النظام

```
scripts/news-automation/
├── sites-config.json       # إعدادات المواقع (Tier 1 و Tier 2)
├── auto-news-worker.js     # المحرك الرئيسي (جلب RSS + كتابة المقالات)
├── indexing-process.js     # توليد Sitemap + فهرسة Google/IndexNow
└── news-state.json         # سجل الأخبار المعالجة (يُنشأ تلقائياً)

.github/workflows/
└── autopilot.yml           # جدولة GitHub Actions (Tier 1 + Tier 2)
```

### طبقات المراقبة (Smart Tiers):

| الطبقة | المواقع | التكرار | الوصف |
|--------|---------|---------|-------|
| **Tier 1** | 10 مواقع أساسية | كل 15 دقيقة | وزارة التربية، الداخلية، الصحة، ANEM... |
| **Tier 2** | 257 موقع آخر | مرة يومياً 3:00 ص | باقي الوزارات والمؤسسات |

---

## 🔐 إعداد GitHub Secrets

قبل تشغيل الـ Workflow، يجب إضافة هذه الأسرار في:
**GitHub → Repository → Settings → Secrets and variables → Actions → New repository secret**

### السر الأول: `GEMINI_API_KEY`
```
القيمة: مفتاح Gemini API الخاص بك من aistudio.google.com
```

### السر الثاني: `GOOGLE_SERVICE_ACCOUNT_KEY`
```
القيمة: محتوى ملف service-account.json كاملاً (JSON) أو مُشفَّراً بـ Base64
```

لتحويل الملف إلى Base64 (اختياري):
```bash
base64 -w 0 service-account.json
```

### خطوات الإضافة:
1. افتح مستودعك على GitHub
2. اذهب إلى **Settings → Secrets and variables → Actions**
3. اضغط **New repository secret**
4. أضف `GEMINI_API_KEY` ثم `GOOGLE_SERVICE_ACCOUNT_KEY`

---

## 💻 التشغيل المحلي

### 1. تثبيت التبعيات الإضافية:
```bash
npm install --save-dev xml2js cheerio
```

### 2. إعداد المفاتيح في `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. أوامر التشغيل:

```bash
# تشغيل Tier 1 (المواقع الأساسية)
node scripts/news-automation/auto-news-worker.js

# تشغيل Tier 2 (باقي المواقع)
node scripts/news-automation/auto-news-worker.js --tier=2

# تشغيل الكل
node scripts/news-automation/auto-news-worker.js --all

# تشغيل الفهرسة فقط (بدون كتابة مقالات)
node scripts/news-automation/indexing-process.js
```

---

## ➕ إضافة مواقع جديدة

افتح `scripts/news-automation/sites-config.json` وأضف كائناً جديداً في `tier1` أو `tier2`:

```json
{
  "id": "معرف-فريد",
  "name": "اسم الوزارة أو المؤسسة",
  "url": "https://www.example.gov.dz",
  "rssUrl": "https://www.example.gov.dz/feed/",
  "logoUrl": "https://www.example.gov.dz/logo.png",
  "fallbackImage": "https://www.raqmanadz.com/images/fallbacks/example.jpg",
  "categoryId": "معرف-التصنيف",
  "checkIntervalMinutes": 15
}
```

**معرفات التصنيفات المتاحة:**
`education` | `interior` | `employment` | `health` | `socialSecurity` | `tax` | `post` | `bills` | `justice` | `realEstate` | `commerce` | `transport` | `dzds`

---

## 🖼 قواعد الصور والمحتوى

### سياسة الصور (صارمة لمنع التزييف):

| الحالة | التصرف |
|--------|--------|
| ✅ وجود `og:image` في الصفحة | استخدام الصورة الحقيقية |
| ✅ وجود `twitter:image` | استخدام الصورة الحقيقية |
| ⚠ لا صورة في الصفحة | استخدام شعار الوزارة كـ "صورة توضيحية" |
| ❌ Gemini يُطلب منه صورة | **محظور تماماً** — لا يُطلب من Gemini أبداً |

### قواعد المقال:
- ✅ بين 1000 و1500 كلمة
- ✅ اقتباس حرفي واحد من البيان بين علامات تنصيص
- ❌ لا أرقام أو تواريخ مخترعة
- ✅ قسم "الأسئلة الشائعة (FAQ)" في النهاية

---

## ❓ الأسئلة الشائعة

**س: هل يتوقف النظام إذا تعطل موقع واحد؟**
لا، كل موقع محاط بـ `try/catch` مستقل. في حالة فشل موقع، يُسجَّل الخطأ ويكمل النظام عمله مع بقية المواقع.

**س: هل يُكرر نشر نفس الخبر مرتين؟**
لا، يحتفظ الملف `news-state.json` بسجل لكل الأخبار المعالجة باستخدام الـ GUID الخاص بكل خبر RSS.

**س: ما الحد الأقصى لعدد المقالات في كل جلسة؟**
5 مقالات افتراضياً لتجنب تجاوز حد Gemini API. يمكن تغييره في `CONFIG.MAX_ARTICLES_PER_RUN`.

**س: كيف أعرف أن النظام يعمل؟**
اذهب إلى GitHub → Actions وستجد سجلات تفصيلية لكل تشغيل. كذلك ستظهر مقالات جديدة في `lib/custom-articles-data.json`.

**س: ماذا يحدث عند استنفاد حصة Google Indexing API (200/يوم)?**
يتوقف النظام فوراً عند استلام خطأ `429`، ويحفظ التقدم. في اليوم التالي يكمل من حيث توقف.

**س: هل يمكن إضافة أكثر من 10 مواقع لـ Tier 1؟**
نعم، فقط أضفها في `sites-config.json`. لكن انتبه: GitHub Actions لديه حد أقصى 6 ساعات في كل تشغيل، و3 مقالات/ساعة تقريباً (بسبب وقت توليد Gemini).

---

## 📊 إحصائيات الأداء المتوقعة

| المؤشر | القيمة |
|--------|-------|
| مقالات يومياً (Tier 1) | ~20-30 مقال |
| مقالات يومياً (Tier 2) | ~5-10 مقال |
| وقت كتابة مقال واحد | ~30-60 ثانية |
| حصة Gemini Flash | 1500 طلب/يوم (مجاني) |
| حصة Google Indexing | 200 رابط/يوم |

---

*آخر تحديث: أغسطس 2026 | راقمنا للأنباء — raqmanadz.com*
