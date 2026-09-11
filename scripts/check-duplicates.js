#!/usr/bin/env node

/**
 * Pre-Deploy Check: Duplicate Content Within Pages
 * Scans article data for identical paragraphs appearing multiple times within the same article.
 */

const fs = require('fs');
const path = require('path');

let errors = [];

// Check lib/seo-articles-data.ts and lib/trend-articles-2026.ts
const articleFiles = [
  './lib/seo-articles-data.ts',
  './lib/trend-articles-2026.ts',
  './lib/tools-guide-articles-2026.ts'
];

articleFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf-8');

  // Match each section content: "content: '...'"
  const sections = content.split(/sections:\s*\[/);
  
  sections.slice(1).forEach((secBlock, artIdx) => {
    const sectionContents = [];
    const contentMatches = secBlock.matchAll(/content:\s*["`']([^"`']{50,})["`']/g);
    
    for (const match of contentMatches) {
      const text = match[1].trim();
      if (sectionContents.includes(text)) {
        errors.push(`❌ ${file}: فقرة متكررة حرفياً داخل نفس المقال: "${text.substring(0, 60)}..."`);
      } else {
        sectionContents.push(text);
      }
    }
  });
});

console.log('\n=========================================');
console.log('🔍 فحص 4: كشف تكرار المحتوى داخل المقالات');
console.log('=========================================');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  console.error(`\n❌ فشل الفحص: تم العثور على ${errors.length} تكرار.`);
  process.exit(1);
} else {
  console.log('✅ تم بنجاح: لا يوجد تكرار حرفي للفقرات داخل المقالات.');
  process.exit(0);
}
