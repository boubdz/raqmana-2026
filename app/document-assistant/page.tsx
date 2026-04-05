// app/document-assistant/page.tsx
"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

// تحميل المكون ديناميكياً مع تعطيل SSR
const DocumentAssistant = dynamic(
  () => import('@/components/document-assistant').then(mod => mod.DocumentAssistant),
  { ssr: false }
);

export default function DocumentAssistantPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            العودة إلى الرئيسية
          </Button>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">المساعد الذكي للوثائق</h1>
        <p className="text-muted-foreground">
          اكتب وصفاً بالدارجة، وسيقوم الذكاء الاصطناعي بإنشاء النص الإداري المناسب. يمكنك تعديله، ثم طباعته أو تحميله كـ PDF.
        </p>
      </div>
      <DocumentAssistant />
    </div>
  );
}