import { seoArticles } from '@/lib/seo-articles-data';

export async function GET() {
  const baseUrl = 'https://raqmana.vercel.app';
  const lastmod = '2026-07-17T12:00:00+00:00';

  // Articles index page
  const indexEntry = `  <url>
    <loc>${baseUrl}/articles</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

  // Individual article pages
  const articleEntries = Object.keys(seoArticles)
    .map(
      (slug) => `  <url>
    <loc>${baseUrl}/articles/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexEntry}
${articleEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
