"use client";

import dynamic from 'next/dynamic';

// تحميل المكون الأساسي ديناميكياً مع تعطيل SSR
const DocumentAssistant = dynamic(
  () => import('@/components/document-assistant').then(mod => mod.DocumentAssistant),
  { ssr: false }
);

export default function DocumentAssistantClient() {
  return <DocumentAssistant />;
}
