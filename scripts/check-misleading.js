#!/usr/bin/env node

/**
 * Pre-Deploy Check: Misleading Claims and Hallucinated Legal References
 * Ensures no fraudulent claims (no ads, official endorsement, fake laws, VPN) exist.
 */

const fs = require('fs');
const path = require('path');

const misleading = [
  'دون إعلانات',
  'بدون إعلانات',
  'دليل رسمي',
  'معتمد من قبل',
  'لأسباب أمنية',
  'إجراء أمني 2026',
  'مجموعات تقنية',
  'رسمي موثق',
  'قانون 26-02',
  'القانون 26-02',
  'بطاقة الشفاء 2.0',
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
  if (file.includes('scripts/check-') || file.includes('DEPLOY_CHECKLIST.md')) return;

  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    if (/^\s*(\/\/|\/\*|\*)/.test(line)) return;

    // Check misleading phrases
    misleading.forEach(phrase => {
      if (line.includes(phrase)) {
        errors.push(`❌ ${file}:${idx + 1} -> يحتوي عبارة غير دقيقة/مضللة: "${phrase}"`);
      }
    });

    // Check for VPN mentions in Arabic text
    if (/[\u0600-\u06FF]/.test(line) && /\bvpn\b/i.test(line)) {
      errors.push(`❌ ${file}:${idx + 1} -> يحتوي ذكر أداة VPN في سياق عربي.`);
    }
  });
});

console.log('\n=========================================');
console.log('🔍 فحص 2: كشف العبارات المضللة والقوانين المختلقة');
console.log('=========================================');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  console.error(`\n❌ فشل الفحص: تم العثور على ${errors.length} خطأ.`);
  process.exit(1);
} else {
  console.log('✅ تم بنجاح: لا توجد عبارات مضللة أو قوانين مختلقة.');
  process.exit(0);
}
