const fs = require('fs');
const path = require('path');

// قراءة ملف services-data.ts
const tsPath = path.join(__dirname, '../lib/services-data.ts');
let content = fs.readFileSync(tsPath, 'utf8');

// إزالة جميع الأسطر التي تبدأ بـ "import" أو "export interface" أو "export type"
const lines = content.split('\n');
const filteredLines = lines.filter(line => {
  const trimmed = line.trim();
  return !trimmed.startsWith('import ') &&
         !trimmed.startsWith('export interface') &&
         !trimmed.startsWith('export type') &&
         !trimmed.startsWith('type ') &&
         !trimmed.startsWith('interface ') &&
         !trimmed.includes('ServiceCategory') &&
         !trimmed.includes('SubCategory') &&
         !trimmed.includes('ServiceLink');
});

let jsContent = filteredLines.join('\n');

// استبدال export const serviceCategories = const serviceCategories =
jsContent = jsContent.replace('export const serviceCategories', 'const serviceCategories');

// إضافة تصدير CommonJS في النهاية
jsContent += '\n\nmodule.exports = { serviceCategories };';

// حفظ كملف JS مؤقت
const jsPath = path.join(__dirname, '../lib/services-data.generated.js');
fs.writeFileSync(jsPath, jsContent, 'utf8');

console.log('✅ تم تحويل الملف إلى JavaScript في lib/services-data.generated.js');