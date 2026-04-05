"use client";

import dynamic from "next/dynamic";

// استيراد المكون الرئيسي من الحزمة بشكل ديناميكي (فقط على جانب المستخدم)
const SiteViews = dynamic(() => import("react-siteviews"), { ssr: false });

const ViewsCounter = () => {
  return (
    <SiteViews
      projectName="raqmana-website" // اسم فريد لمشروعك، يمكنك تغييره
      style={{ fontSize: '0.9rem', color: '#555', fontWeight: 'bold' }}
      refresh="60" // تحديث العدد كل 60 ثانية
      suppressLogs // إخفاء رسائل الحزمة من وحدة التحكم
    >
      جاري تحميل العداد...
    </SiteViews>
  );
};

export default ViewsCounter;