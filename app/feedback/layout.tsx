import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "الملاحظات والآراء — رقمنة الجزائر",
  description: "شاركنا بملاحظاتك واقتراحاتك حول منصة رقمنة الجزائر لتحسين الدليل والخدمات الرقمية للمواطنين.",
  alternates: {
    canonical: "https://www.raqmanadz.com/feedback",
  },
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
