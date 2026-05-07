import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Using Ennahar as a more reliable source for Algerian news
    const rssUrl = "https://www.ennaharonline.com/feed/";
    
    const response = await fetch(rssUrl, { 
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const xmlText = await response.text();

    // Enhanced regex parser for RSS items
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null && items.length < 15) {
      const itemContent = match[1];
      
      // Extract title (handles both CDATA and plain text)
      const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      // Extract link
      const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/i);
      // Extract pubDate
      const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);

      if (titleMatch && linkMatch) {
        let title = titleMatch[1].trim();
        // Clean up title (remove some common garbage from RSS)
        title = title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
        
        items.push({
          title: title,
          link: linkMatch[1].trim(),
          date: dateMatch ? new Date(dateMatch[1]).toLocaleDateString('ar-DZ') : "",
        });
      }
    }

    if (items.length === 0) {
      console.log("No items found in RSS XML:", xmlText.substring(0, 500));
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("RSS Fetch Error:", error);
    // Fallback to empty array instead of error to prevent UI crash
    return NextResponse.json([]);
  }
}
