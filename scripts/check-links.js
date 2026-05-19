const fs = require('fs');
const path = require('path');

function parseTsFile() {
  const filePath = path.join(__dirname, '../lib/services-data.ts');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: Could not find services data file at ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Match categories using the "// DD. Name" comment format
  const categoryRegex = /\/\/\s*(\d+)\.\s*([^\n\r]+)/g;
  const categories = [];
  let match;
  while ((match = categoryRegex.exec(content)) !== null) {
    categories.push({
      index: match[1],
      name: match[2].trim(),
      pos: match.index
    });
  }

  const allServices = [];

  for (let i = 0; i < categories.length; i++) {
    const currentCat = categories[i];
    const startPos = currentCat.pos;
    const endPos = (i + 1 < categories.length) ? categories[i + 1].pos : content.length;
    const sectionContent = content.substring(startPos, endPos);

    // Matches standard structure: name: { ar: "...", en: "..." }, url: "..."
    const serviceRegex = /name:\s*{\s*ar:\s*["'`](.*?)["'`],\s*en:\s*["'`](.*?)["'`]\s*},\s*url:\s*["'`](.*?)["'`]/g;
    let sMatch;
    while ((sMatch = serviceRegex.exec(sectionContent)) !== null) {
      allServices.push({
        category: `${currentCat.index}. ${currentCat.name}`,
        name: sMatch[1],
        url: sMatch[3]
  });
    }
  }

  // Fallback to flat matching if category comments aren't found or parse differently
  if (allServices.length === 0) {
    const serviceRegex = /name:\s*{\s*ar:\s*["'`](.*?)["'`],\s*en:\s*["'`](.*?)["'`]\s*},\s*url:\s*["'`](.*?)["'`]/g;
    let sMatch;
    while ((sMatch = serviceRegex.exec(content)) !== null) {
      allServices.push({
        category: 'الخدمات الرقمية',
        name: sMatch[1],
        url: sMatch[3]
      });
    }
  }

  return allServices;
}

async function checkUrl(url) {
  if (url.startsWith('tel:') || url.startsWith('mailto:')) {
    return { ok: true, status: 'skipped', error: null };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok || (response.status >= 300 && response.status < 400)) {
      return { ok: true, status: response.status, error: null };
    } else {
      return { ok: false, status: response.status, error: `HTTP Error ${response.status}` };
    }
  } catch (error) {
    let errorMsg = error.message;
    if (error.name === 'AbortError') {
      errorMsg = 'Timeout (site is too slow or down)';
    } else if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('fetch failed')) {
      errorMsg = 'DNS Lookup Failed (domain might be dead or geoblocked)';
    }
    return { ok: false, status: 'error', error: errorMsg };
  }
}

async function main() {
  console.log('🔍 Starting link checker for Raqmana 2026 directory (Pure TS Parser)...\n');
  
  const allServices = parseTsFile();
  const brokenLinks = [];
  let totalChecked = 0;

  console.log(`📋 Found ${allServices.length} live links to verify in services-data.ts.\n`);

  for (let i = 0; i < allServices.length; i++) {
    const service = allServices[i];
    totalChecked++;
    process.stdout.write(`⚡ Checking [${totalChecked}/${allServices.length}]: ${service.name}... `);

    const result = await checkUrl(service.url);

    if (result.ok) {
      console.log('✅ OK');
    } else {
      console.log(`❌ FAILED (${result.error})`);
      brokenLinks.push({
        ...service,
        error: result.error,
        status: result.status
      });
    }
  }

  console.log('\n======================================');
  console.log('📊 CHECK RESULTS SUMMARY');
  console.log('======================================');
  console.log(`Total Checked: ${totalChecked}`);
  console.log(`Working: ${totalChecked - brokenLinks.length}`);
  console.log(`Broken: ${brokenLinks.length}`);
  console.log('======================================\n');

  if (brokenLinks.length > 0) {
    console.log('🚨 BROKEN LINKS REPORT:\n');
    
    let reportMd = `# Broken Links Report - Raqmana 2026\n\n`;
    reportMd += `Generated on: ${new Date().toLocaleString()}\n`;
    reportMd += `Total Broken Links Found: **${brokenLinks.length}**\n\n`;
    reportMd += `| Category | Service Name | Broken URL | Issue/Error |\n`;
    reportMd += `| --- | --- | --- | --- |\n`;

    brokenLinks.forEach(item => {
      console.log(`📁 Category: ${item.category}`);
      console.log(`🔗 Service:  ${item.name}`);
      console.log(`🌐 URL:      ${item.url}`);
      console.log(`❌ Error:    ${item.error}\n--------------------------------------`);
      
      reportMd += `| ${item.category} | ${item.name} | [Link](${item.url}) | ${item.error} |\n`;
    });

    const reportPath = path.join(__dirname, '../broken-links-report.md');
    fs.writeFileSync(reportPath, reportMd);
    console.log(`\n💾 Saved detailed markdown report to: [broken-links-report.md]`);
  } else {
    console.log('🎉 Excellent! All links are working perfectly.');
  }
}

main().catch(console.error);
