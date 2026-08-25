import { jobCompetitionsData } from '@/lib/jobs-data';

export async function GET() {
  const baseUrl = 'https://www.raqmanadz.com';
  const now = new Date().toISOString();

  // ✅ نُدرج فقط صفحة /jobs الرئيسية كمركز مجمع (Hub Page)
  // الصفحات الفردية للمسابقات تُعرض بالجافاسكريبت ولا تُفهرس بشكل مستقل
  // هذا يمنع تضخم عدد الروابط (URL Bloat) واستنزاف ميزانية الزحف
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/jobs</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
