const fs = require('fs');
const path = require('path');

// قراءة ملف services-data.ts
const tsPath = path.join(__dirname, '../lib/services-data.ts');
let content = fs.readFileSync(tsPath, 'utf8');

// البحث عن بداية تعريف مصفوفة التصنيفات وتخطي جميع الـ interfaces
const startIndex = content.indexOf('export const serviceCategories');
if (startIndex === -1) {
  console.error('❌ لم يتم العثور على export const serviceCategories في ملف TS!');
  process.exit(1);
}

// أخذ الجزء الخاص بالبيانات فقط وتجاهل الواجهات بالكامل
let jsContent = content.substring(startIndex);

// استبدال تعريف التصدير في تيب سكريبت إلى جافا سكريبت عادية
jsContent = jsContent.replace(/export\s+const\s+serviceCategories(:\s*\w+\[\])?\s*=/, 'const serviceCategories =');

// إضافة تصدير CommonJS المتوافق في النهاية
jsContent += '\n\nmodule.exports = { serviceCategories };';

// حفظ كملف JS المولد النظيف والخالي من أخطاء بناء الجملة للـ Typescript
const jsPath = path.join(__dirname, '../lib/services-data.generated.js');
fs.writeFileSync(jsPath, jsContent, 'utf8');

console.log('✅ تم تحويل الملف بنجاح وخلوه من أخطاء الأنواع: lib/services-data.generated.js');