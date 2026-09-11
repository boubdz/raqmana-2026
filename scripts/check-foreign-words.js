#!/usr/bin/env node

/**
 * Pre-Deploy Check: Foreign Words in Arabic Texts
 * Ensures no untranslated English category words leak into Arabic text.
 */

const fs = require('fs');
const path = require('path');

const forbidden = [
  'banking',
  'police',
  'government',
  'education',
  'health',
  'finance',
  'transport',
  'justice'
];

function walkDir(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'scratch', 'news-automation'].includes(entry.name)) {
        files = files.concat(walkDir(fullPath));
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name) && !entry.name.endsWith('.generated.js') && !entry.name.endsWith('.bak')) {
      files.push(fullPath);
    }
  }
  return files;
}

const targetDirs = ['./app', './lib', './components'];
let allFiles = [];
targetDirs.forEach(d => {
  if (fs.existsSync(d)) allFiles = allFiles.concat(walkDir(d));
});

let errors = [];

allFiles.forEach(file => {
  // Skip test/check scripts and locale mapping dictionaries
  if (file.includes('scripts/') || file.includes('language-context') || file.includes('sitemap')) return;

  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Skip import lines, comments, URL definitions, image tags, schema definitions, and english translations
    if (/^\s*(\/\/|\/\*|\*|import|export const|const \w+ =|url:|domain:|href=)/.test(line)) return;
    if (line.includes('http://') || line.includes('https://') || line.includes('en:')) return;
    if (line.includes('category.') || line.includes('id:') || line.includes('catId ===') || line.includes('key:')) return;

    // Check if line contains Arabic
    if (/[\u0600-\u06FF]/.test(line)) {
      forbidden.forEach(word => {
        // Look for pattern where the forbidden English word is embedded directly in an Arabic sentence
        // e.g., "ضمن قطاع banking" or "منصة police"
        const regex = new RegExp(`[\\u0600-\\u06FF]{2,}\\s+${word}|${word}\\s+[\\u0600-\\u06FF]{2,}`, 'i');
        if (regex.test(line)) {
          // Allow valid technical domain references or code keys
          if (line.includes(`"${word}"`) && line.includes(':')) return;
          errors.push(`❌ ${file}:${idx + 1} -> يحتوي الكلمة الأجنبية "${word}" في سياق عربي: "${line.trim().substring(0, 100)}"`);
        }
      });
    }
  });
});

console.log('\n=========================================');
console.log('🔍 فحص 1: الكلمات الأجنبية العائمة في نصوص عربية');
console.log('=========================================');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  console.error(`\n❌ فشل الفحص: تم العثور على ${errors.length} خطأ.`);
  process.exit(1);
} else {
  console.log('✅ تم بنجاح: لا توجد كلمات أجنبية عائمة في النصوص العربية.');
  process.exit(0);
}
