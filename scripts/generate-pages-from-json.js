const fs = require('fs');
const path = require('path');

// استيراد البيانات من الملف المحول
const { serviceCategories } = require('../lib/services-data.generated.js');

// دالة توليد صفحة HTML (نفس السابق)
function generatePage(cat) {
  const mainServices = cat.services?.length
    ? cat.services.map(s => `
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

  const subCategoriesHtml = cat.subCategories?.length
    ? cat.subCategories.map(sub => `
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
    <title>${cat.nameKey} - دليلك الرقمي</title>
    <style>
        /* نفس الأنماط السابقة (يمكنك نسخها من أي سكريبت سابق) */
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #f8f9fa; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1 { color: #0055aa; border-bottom: 2px solid #0055aa; }
        h2 { color: #0077cc; margin-top: 30px; }
        .info { background: #eef2ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; margin: 15px 0; }
        .service-card { background: #f9f9f9; border-radius: 8px; padding: 12px; border: 1px solid #e0e0e0; }
        .service-card a { text-decoration: none; display: block; }
        .service-name { font-weight: bold; color: #0055aa; }
        .service-url { font-size: 12px; color: #555; word-break: break-all; }
        .service-phone { font-size: 12px; color: #2c7a4d; margin-top: 5px; }
        .app-badge { background: #4caf50; color: white; font-size: 10px; padding: 2px 6px; border-radius: 12px; display: inline-block; margin-top: 5px; }
        .subcategory { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; }
        .subcategory h3 { color: #0077cc; border-right: 3px solid #0077cc; padding-right: 10px; }
        .media-section { background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 30px 0; }
        .video-container { position: relative; padding-bottom: 56.25%; height: 0; margin: 20px 0; }
        .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px; }
        .back-link { display: inline-block; margin-top: 30px; background: #0055aa; color: white; padding: 8px 16px; border-radius: 5px; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${cat.nameKey}</h1>
        <div class="info">
            ${cat.officialSite ? `<p><strong>الموقع الرسمي:</strong> <a href="${cat.officialSite}" target="_blank">${cat.officialSite}</a></p>` : ''}
            ${cat.phone ? `<p><strong>رقم الهاتف:</strong> <a href="tel:${cat.phone}">${cat.phone}</a></p>` : ''}
        </div>
        <h2>📌 خدمات ${cat.nameKey}</h2>
        <div class="services-grid">${mainServices}</div>
        ${subCategoriesHtml ? `<h2>📂 الخدمات الفرعية</h2>${subCategoriesHtml}` : ''}
        <div class="media-section">
            <h2>🎥 فيديوهات تعليمية</h2>
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
        <div class="media-section">
            <h2>📝 مقالات وأخبار</h2>
            <ul><li>📄 <strong>قريباً:</strong> مقال يشرح خطوات التسجيل في منصة ${cat.nameKey}.</li></ul>
        </div>
        <a href="/" class="back-link">⬅ العودة إلى الرئيسية</a>
    </div>
</body>
</html>`;
}

// إنشاء مجلد public/categories
const outDir = path.join(__dirname, '../public/categories');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// توليد الصفحات
serviceCategories.forEach(cat => {
  const filePath = path.join(outDir, `${cat.id}.html`);
  fs.writeFileSync(filePath, generatePage(cat), 'utf8');
  console.log(`✅ تم إنشاء: categories/${cat.id}.html`);
});

console.log(`🎉 تم إنشاء ${serviceCategories.length} صفحة كاملة.`);