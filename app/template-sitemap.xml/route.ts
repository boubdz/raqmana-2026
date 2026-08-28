import { NextResponse } from 'next/server';
import { officialTemplatesData } from '@/lib/templates-data';

export async function GET() {
  const baseUrl = 'https://www.raqmanadz.com';
  const now = new Date().toISOString();

  const urlElements = officialTemplatesData
    .map(
      (t) => `  <url>
    <loc>${baseUrl}/templates/${t.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
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
