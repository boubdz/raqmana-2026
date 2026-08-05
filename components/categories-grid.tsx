import Link from "next/link";
import { serviceCategories } from "@/lib/services-data";
import { categoryPageMap, iconMap } from "./categories-data-shared";
import { CategoryTranslation } from "./category-translation";

export function CategoriesGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {serviceCategories.map((category) => {
        const Icon = iconMap[category.icon];
        const pageUrl = categoryPageMap[category.id] || "#";
        return (
          <Link
            key={category.id}
            href={pageUrl}
            itemProp="url"
            className="group relative flex flex-col items-center gap-6 rounded-[2.5rem] p-8 transition-all duration-500 bg-[#fcfcfc] dark:bg-[#0c0c0c] border border-black/[0.03] dark:border-white/[0.03] hover:bg-white dark:hover:bg-[#111] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(255,255,255,0.02)] hover:-translate-y-2"
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
              {Icon && <Icon className="h-8 w-8" />}
            </div>
            <div className="text-center">
              <span
                className="text-sm font-black uppercase tracking-widest text-[#1a1a1a] dark:text-white/90"
                itemProp="name"
              >
                <CategoryTranslation nameKey={category.nameKey} />
              </span>
              <div className="mt-2 h-1 w-0 bg-primary mx-auto transition-all duration-500 group-hover:w-8 rounded-full" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
