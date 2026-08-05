import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SolutionsHub } from "@/components/solutions-hub";

export const metadata: Metadata = {
  title: "مركز الحلول الذكية — رقمنة الجزائر",
  description: "مركز الحلول الذكية للمشاكل التقنية والخدمات الرقمية في الجزائر. حلول للمشاكل الشائعة في منصات بريدي موب، عدل، الخدمة العمومية والمنصات الحكومية.",
};

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
      <Header />
      <main className="pt-24 pb-16">
        <SolutionsHub />
      </main>
      <Footer />
    </div>
  );
}
