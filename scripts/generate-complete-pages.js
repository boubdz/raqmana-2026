const fs = require('fs');
const path = require('path');

// قراءة ملف services-data.ts
const filePath = path.join(__dirname, '../lib/services-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// استخراج النص بين أقواس المصفوفة serviceCategories
const startMarker = 'export const serviceCategories: ServiceCategory[] = ';
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) throw new Error('لم يتم العثور على serviceCategories');

let categoriesStr = content.substring(startIdx + startMarker.length);

// إزالة الأجزاء بعد المصفوفة (مثل export const documentTemplates)
const endMarker = 'export const documentTemplates';
const endIdx = categoriesStr.indexOf(endMarker);
if (endIdx !== -1) categoriesStr = categoriesStr.substring(0, endIdx);

// الآن نقوم بتنظيف النص لجعله قابلاً للتقييم
// 1. إزالة التعليقات // (مع مراعاة عدم إزالة // داخل النصوص)
categoriesStr = categoriesStr.replace(/\/\/[^\n]*/g, ''); // إزالة التعليقات

// 2. إضافة علامات اقتباس حول المفاتيح (id, nameKey, إلخ)
//    نستخدم regex لالتقاط الكلمات التي تلي بداية السطر أو الفاصلة أو المسافة ثم :
categoriesStr = categoriesStr.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

// 3. إزالة الفواصل الزائدة (مثل ,] أو ,})
categoriesStr = categoriesStr.replace(/,\s*]/g, ']');
categoriesStr = categoriesStr.replace(/,\s*}/g, '}');

// 4. التأكد من أن true/false بدون علامات اقتباس (هي بالفعل صحيحة)
//    لكن قد يتم تحويلها إلى "true" إذا كانت ضمن مفاتيح، لذلك لا داعي للتعديل.

let categories;
try {
  // نضيف الأقواس لتحويله إلى كائن صالح
  categories = eval(`(${categoriesStr})`);
  console.log(`✅ تم تحليل ${categories.length} فئة بنجاح.`);
} catch (err) {
  console.error('❌ فشل التحليل:', err.message);
  console.error('نص الخطأ حول الموضع:', categoriesStr.substring(err.offset, err.offset + 100));
  process.exit(1);
}

// دالة توليد صفحة HTML (نفس السابق ولكن مع تحسينات بسيطة)
function generatePage(category) {
  const mainServices = category.services?.length
    ? category.services.map(s => `
      <div class="service-card">
        <a href="${s.url}" target="_blank" rel="noopener noreferrer">
          <div class="service-name">${s.name.ar}</div>
          <div class="service-url">${s.url}</div>
          ${s.phone ? `<div class="service-phone">📞 ${s.phone}</div>` : ''}
          ${s.isApp ? '<span class="app-badge">📱 تطبيق</span>' : ''}
        </a>
      </div>
    `).join('')
    : '<p>لا توجد خدمات رئيسية.</p>';

  const subCategoriesHtml = category.subCategories?.length
    ? category.subCategories.map(sub => `
      <div class="subcategory">
        <h3>${sub.nameKey}</h3>
        <div class="services-grid">
          ${sub.services.map(s => `
            <div class="service-card">
              <a href="${s.url}" target="_blank" rel="noopener noreferrer">
                <div class="service-name">${s.name.ar}</div>
                <div class="service-url">${s.url}</div>
                ${s.phone ? `<div class="service-phone">📞 ${s.phone}</div>` : ''}
                ${s.isApp ? '<span class="app-badge">📱 تطبيق</span>' : ''}
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')
    : '';

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${category.nameKey} - دليلك الرقمي</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #0055aa;
            border-bottom: 2px solid #0055aa;
            padding-bottom: 10px;
        }
        h2 {
            color: #0077cc;
            margin-top: 30px;
        }
        .info {
            background: #eef2ff;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }
        .service-card {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 12px;
            border: 1px solid #e0e0e0;
            transition: all 0.2s;
        }
        .service-card:hover {
            background: #eef2ff;
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .service-card a {
            text-decoration: none;
            display: block;
        }
        .service-name {
            font-weight: bold;
            color: #0055aa;
            margin-bottom: 5px;
        }
        .service-url {
            font-size: 12px;
            color: #555;
            word-break: break-all;
        }
        .service-phone {
            font-size: 12px;
            color: #2c7a4d;
            margin-top: 5px;
        }
        .app-badge {
            display: inline-block;
            background: #4caf50;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 12px;
            margin-top: 5px;
        }
        .subcategory {
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
        .subcategory h3 {
            color: #0077cc;
            border-right: 3px solid #0077cc;
            padding-right: 10px;
        }
        .media-section {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 12px;
            margin: 30px 0;
        }
        .video-container {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            margin: 20px 0;
        }
        .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 8px;
        }
        .article-list {
            list-style: none;
            padding: 0;
        }
        .article-list li {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 8px;
        }
        .back-link {
            display: inline-block;
            margin-top: 30px;
            background: #0055aa;
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            text-decoration: none;
        }
        .back-link:hover {
            background: #003d80;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${category.nameKey}</h1>
        <div class="info">
            ${category.officialSite ? `<p><strong>الموقع الرسمي:</strong> <a href="${category.officialSite}" target="_blank">${category.officialSite}</a></p>` : ''}
            ${category.phone ? `<p><strong>رقم الهاتف:</strong> <a href="tel:${category.phone}">${category.phone}</a></p>` : ''}
        </div>

        <h2>📌 خدمات ${category.nameKey}</h2>
        <div class="services-grid">
            ${mainServices}
        </div>
        ${subCategoriesHtml ? `<h2>📂 الخدمات الفرعية</h2>${subCategoriesHtml}` : ''}

        <div class="media-section">
            <h2>🎥 فيديوهات تعليمية</h2>
            <p>ستجد هنا فيديوهات تشرح كيفية استخدام خدمات ${category.nameKey}. (يمكنك إضافة أكواد تضمين من يوتيوب)</p>
            <div class="video-container">
                <p style="text-align: center; color: #666;">(سيتم إضافة فيديو تعليمي قريباً)</p>
            </div>
        </div>

        <div class="media-section">
            <h2>📝 مقالات وأخبار</h2>
            <p>مقالات وشروحات مفصلة حول خدمات ${category.nameKey}. يمكنك أيضاً إضافة خلاصات RSS من المواقع الرسمية.</p>
            <ul class="article-list">
                <li>📄 <strong>قريباً:</strong> مقال يشرح خطوات التسجيل في منصة ${category.nameKey}.</li>
            </ul>
        </div>

        <a href="/" class="back-link">⬅ العودة إلى الرئيسية</a>
    </div>
</body>
</html>`;
}

// إنشاء مجلد public/categories إذا لم يكن موجوداً
const outDir = path.join(__dirname, '../public/categories');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// توليد الصفحات
categories.forEach(cat => {
  const fileName = `${cat.id}.html`;
  const filePath = path.join(outDir, fileName);
  const html = generatePage(cat);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ تم إنشاء: categories/${fileName}`);
});

console.log(`🎉 تم إنشاء ${categories.length} صفحة كاملة.`);