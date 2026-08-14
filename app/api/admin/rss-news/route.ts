import { NextResponse } from "next/server";

export const revalidate = 900; // 15 minutes cache

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceAr: string;
  emoji: string;
}

const RSS_SOURCES = [
  {
    url: "https://www.aps.dz/ar/?format=feed&type=rss",
    source: "APS",
    sourceAr: "وكالة الأنباء الجزائرية",
    emoji: "📰",
  },
  {
    url: "https://www.education.gov.dz/ar/feed/",
    source: "education",
    sourceAr: "وزارة التربية الوطنية",
    emoji: "📚",
  },
  {
    url: "https://www.mesrs.dz/ar/feed/",
    source: "mesrs",
    sourceAr: "وزارة التعليم العالي",
    emoji: "🎓",
  },
  {
    url: "https://www.anem.dz/ar/rss.xml",
    source: "anem",
    sourceAr: "وسيط ANEM / منحة البطالة",
    emoji: "💼",
  },
  {
    url: "https://www.interieur.gov.dz/index.php/ar/?format=feed&type=rss",
    source: "interior",
    sourceAr: "وزارة الداخلية",
    emoji: "🏛️",
  },
];

function parseRssItems(xml: string, sourceAr: string, emoji: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i);
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);

    const title = titleMatch?.[1]?.trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    const link = linkMatch?.[1]?.trim();
    const pubDate = pubDateMatch?.[1]?.trim() || new Date().toUTCString();

    if (title && link) {
      items.push({ title, link, pubDate, source, sourceAr, emoji });
    }
    if (items.length >= 5) break;
  }

  return items;
}

export async function GET() {
  const results: NewsItem[] = [];

  await Promise.allSettled(
    RSS_SOURCES.map(async ({ url, source, sourceAr, emoji }) => {
      try {
        const res = await fetch(url, {
          next: { revalidate: 900 },
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; RaqmanadZ-NewsBot/1.0; +https://www.raqmanadz.com)",
            Accept: "application/rss+xml, application/xml, text/xml",
          },
          signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) return;

        const xml = await res.text();
        const items = parseRssItems(xml, sourceAr, emoji, source);
        results.push(...items);
      } catch {
        // Silently skip unavailable sources
      }
    })
  );

  // Sort by date (most recent first)
  results.sort((a, b) => {
    const da = new Date(a.pubDate).getTime() || 0;
    const db = new Date(b.pubDate).getTime() || 0;
    return db - da;
  });

  return NextResponse.json({
    success: true,
    count: results.length,
    items: results.slice(0, 20),
    fetchedAt: new Date().toISOString(),
  });
}
