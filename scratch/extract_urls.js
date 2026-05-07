const fs = require('fs');
const content = fs.readFileSync('c:/Users/g7256/raqmana-2026/lib/services-data.ts', 'utf8');
const urls = [...content.matchAll(/url:\s*"(https?:\/\/[^"]+)"/g)].map(m => m[1]);
const uniqueUrls = [...new Set(urls)].sort();
console.log(JSON.stringify(uniqueUrls, null, 2));
