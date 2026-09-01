import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.raqmanadz.com';

  const now = new Date().toISOString();
  const pages = [
    { loc: `${baseUrl}/`, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/document-assistant`, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/document-guide`, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/templates`, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/cv-builder`, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/ccp-calculator`, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/articles`, lastmod: now, changefreq: 'daily', priority: '0.95' },
    { loc: `${baseUrl}/solutions`, lastmod: now, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/status`, lastmod: now, changefreq: 'hourly', priority: '0.85' },
    { loc: `${baseUrl}/sitemap`, lastmod: now, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/feedback`, lastmod: now, changefreq: 'monthly', priority: '0.5' },
  ];

  const urlElements = pages
    .map(
      (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
