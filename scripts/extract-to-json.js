const fs = require('fs');
const path = require('path');

// قراءة ملف services-data.ts
const tsPath = path.join(__dirname, '../lib/services-data.ts');
let content = fs.readFileSync(tsPath, 'utf8');

// استخراج serviceCategories كمصفوفة (طريقة بسيطة باستخدام regex)
const startMarker = 'export const serviceCategories: ServiceCategory[] = ';
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) throw new Error('لم يتم العثور على serviceCategories');

let jsonStr = content.substring(startIdx + startMarker.length);

// إزالة التعليقات (//) ولكن الحفاظ على الروابط
jsonStr = jsonStr.replace(/\/\/[^\n]*/g, '');
// إزالة export const documentTemplates وما بعده
const endIdx = jsonStr.indexOf('export const documentTemplates');
if (endIdx !== -1) jsonStr = jsonStr.substring(0, endIdx);

// إضافة علامات اقتباس للمفاتيح
jsonStr = jsonStr.replace(/(\w+)(?=\s*:)/g, '"$1"');
// إزالة الفواصل الزائدة
jsonStr = jsonStr.replace(/,\s*}/g, '}');
jsonStr = jsonStr.replace(/,\s*]/g, ']');

// محاولة تحويل إلى JSON
let categories;
try {
  // استخدام Function بدلاً من eval (أكثر أماناً نسبياً)
  categories = new Function('return (' + jsonStr + ')')();
  console.log(`✅ تم استخراج ${categories.length} فئة بنجاح.`);
} catch (err) {
  console.error('❌ فشل التحليل:', err.message);
  process.exit(1);
}

// حفظ البيانات كـ JSON في مجلد public (لتكون متاحة للتطبيق أيضاً)
const outputPath = path.join(__dirname, '../public/services-data.json');
fs.writeFileSync(outputPath, JSON.stringify(categories, null, 2));
console.log(`📁 تم حفظ البيانات في: public/services-data.json`);