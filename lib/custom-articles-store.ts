import { seoArticles, SeoArticle } from "@/lib/seo-articles-data";
import fs from "fs";
import path from "path";

const CUSTOM_ARTICLES_FILE = path.join(process.cwd(), "lib", "custom-articles-data.json");

export function getCustomArticles(): Record<string, SeoArticle> {
  try {
    if (fs.existsSync(CUSTOM_ARTICLES_FILE)) {
      const data = fs.readFileSync(CUSTOM_ARTICLES_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading custom articles:", err);
  }
  return {};
}

export function getAllArticlesMerged(): Record<string, SeoArticle> {
  const custom = getCustomArticles();
  return {
    ...seoArticles,
    ...custom,
  };
}

export function saveCustomArticle(slug: string, article: SeoArticle): boolean {
  try {
    const existing = getCustomArticles();
    existing[slug] = article;
    fs.writeFileSync(CUSTOM_ARTICLES_FILE, JSON.stringify(existing, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving custom article:", err);
    return false;
  }
}

export function getCustomArticleBySlug(slug: string): SeoArticle | null {
  const custom = getCustomArticles();
  if (custom[slug]) return custom[slug];
  try {
    const decoded = decodeURIComponent(slug);
    if (custom[decoded]) return custom[decoded];
  } catch {}
  try {
    const encoded = encodeURIComponent(slug);
    if (custom[encoded]) return custom[encoded];
  } catch {}
  return null;
}

export function deleteCustomArticle(slug: string): boolean {
  try {
    const custom = getCustomArticles();
    if (custom[slug]) {
      delete custom[slug];
      fs.writeFileSync(CUSTOM_ARTICLES_FILE, JSON.stringify(custom, null, 2), "utf-8");
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error deleting custom article:", err);
    return false;
  }
}
