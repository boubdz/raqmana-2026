import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.raqmanadz.com';

  const pages = [
    { loc: `${baseUrl}/`, lastmod: '2026-06-26T10:00:00+00:00', changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/document-assistant`, lastmod: '2026-06-26T09:00:00+00:00', changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/document-guide`, lastmod: '2026-06-26T09:00:00+00:00', changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/articles`, lastmod: '2026-07-24T12:00:00+00:00', changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/solutions`, lastmod: '2026-07-24T12:00:00+00:00', changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/status`, lastmod: '2026-06-26T10:00:00+00:00', changefreq: 'hourly', priority: '0.85' },
    { loc: `${baseUrl}/sitemap`, lastmod: '2026-06-26T09:00:00+00:00', changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/feedback`, lastmod: '2026-06-21T08:00:00+00:00', changefreq: 'monthly', priority: '0.5' },
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
