import { CategoriesSearch } from "./categories-search";
import { CategoriesGrid } from "./categories-grid";

export function CategoriesSection() {
  return (
    <section
      id="services"
      aria-label="البوابة الجزائرية للخدمات الرقمية وروابط استخراج الوثائق"
      itemScope
      itemType="https://schema.org/ItemList"
      className="py-32 bg-white dark:bg-[#080808]"
    >
      <div className="container mx-auto px-6">
        <CategoriesSearch>
          <CategoriesGrid />
        </CategoriesSearch>
      </div>
    </section>
  );
}