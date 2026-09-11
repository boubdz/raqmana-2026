import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "اتصل بنا — منصة رقمنة الجزائر",
  description: "تواصل مع فريق منصة رقمنة الجزائر لطرح الاستفسارات، التبليغ عن روابط معطلة، أو اقتراح خدمات رقمية جديدة.",
  alternates: {
    canonical: "https://www.raqmanadz.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
