import { serviceCategories } from "@/lib/services-data";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  return serviceCategories.map((cat) => ({ id: cat.id }));
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = serviceCategories.find((cat) => cat.id === params.id);
  if (!category) return notFound();

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">{category.nameKey}</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        {category.officialSite && <p><strong>الموقع الرسمي:</strong> <a href={category.officialSite} target="_blank">{category.officialSite}</a></p>}
        {category.phone && <p><strong>رقم الهاتف:</strong> <a href={`tel:${category.phone}`}>{category.phone}</a></p>}
      </div>
      <h2 className="text-2xl font-semibold mb-4">خدمات {category.nameKey}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {category.services?.map((service, idx) => (
          <div key={idx} className="border p-3 rounded">
            <a href={service.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {service.name.ar}
            </a>
            <div className="text-xs text-gray-500 mt-1">{service.url}</div>
          </div>
        ))}
      </div>
      <Link href="/" className="inline-block mt-8 bg-blue-600 text-white px-4 py-2 rounded">← العودة</Link>
    </div>
  );
}