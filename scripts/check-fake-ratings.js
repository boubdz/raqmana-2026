#!/usr/bin/env node

/**
 * Pre-Deploy Check: Fake Ratings and Schema Spam
 * Ensures zero aggregateRating or fake reviews exist in codebase.
 */

const fs = require('fs');
const path = require('path');

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
  
  if (content.includes('aggregateRating')) {
    errors.push(`❌ ${file}: يحتوي على aggregateRating في Schema.`);
  }

  if (content.includes('ratingCount') || content.includes('ratingValue')) {
    errors.push(`❌ ${file}: يحتوي على ratingValue / ratingCount.`);
  }

  if (content.includes('124 تقييم') || content.includes('82%') && content.includes('⭐⭐⭐⭐⭐')) {
    errors.push(`❌ ${file}: يحتوي على تقييمات أو نسب رضا مصطنعة.`);
  }
});

console.log('\n=========================================');
console.log('🔍 فحص 3: كشف التقييمات الوهمية و Structured Data Spam');
console.log('=========================================');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  console.error(`\n❌ فشل الفحص: تم العثور على ${errors.length} خطأ.`);
  process.exit(1);
} else {
  console.log('✅ تم بنجاح: لا توجد تقييمات وهمية أو aggregateRating في المشروع.');
  process.exit(0);
}
