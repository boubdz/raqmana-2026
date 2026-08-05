import { NextResponse } from 'next/server';
import { serviceCategories } from '@/lib/services-data';

export async function GET() {
  const baseUrl = 'https://raqmana.vercel.app';

  const highActivityCategories = new Set([
    'bills', 'mobile', 'post', 'education', 'aadl',
    'employment', 'university', 'interior', 'socialSecurity',
  ]);

  const pad = (num: number) => String(num).padStart(2, '0');

  const urlElements = serviceCategories.map((category, index) => {
    // Generate a deterministic unique date distributed backwards from 2026-06-20
    const date = new Date('2026-06-20T12:00:00Z');
    date.setUTCHours(date.getUTCHours() - (index * 4));
    date.setUTCMinutes(date.getUTCMinutes() - (index * 13));

    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    const lastmod = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;

    const isHigh = highActivityCategories.has(category.id);
    const changefreq = isHigh ? 'daily' : 'weekly';
    const priority = isHigh ? '0.9' : '0.8';

    return `  <url>
    <loc>${baseUrl}/categories/${category.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
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
