import { NextResponse } from 'next/server';
import { articles } from '@/lib/articles-data';

export async function GET() {
  const baseUrl = 'https://raqmana.vercel.app';

  const pad = (num: number) => String(num).padStart(2, '0');

  const urlElements = articles.map((article, index) => {
    // Generate a deterministic unique date distributed backwards from 2026-06-21
    const date = new Date('2026-06-21T06:00:00Z');
    date.setUTCHours(date.getUTCHours() - (index * 8));
    date.setUTCMinutes(date.getUTCMinutes() - (index * 21));

    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    const lastmod = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;

    return `  <url>
    <loc>${baseUrl}/solutions/${article.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`;
  }).join('\n');

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
