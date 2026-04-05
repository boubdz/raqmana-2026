import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function FeedbackPage() {
  const formUrl = "https://docs.google.com/forms/d/e/.../viewform"; // ⬅️ ضع رابطك هنا

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            العودة إلى الرئيسية
          </Button>
        </Link>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">ملاحظاتك تهمنا</h1>
        <p className="text-muted-foreground">شاركنا رأيك لنساعد في تحسين رَقمنة.</p>
      </div>
      <div className="rounded-lg overflow-hidden border shadow-sm">
        <iframe src={formUrl} width="100%" height="600" frameBorder="0" title="نموذج الملاحظات">
          جاري التحميل...
        </iframe>
      </div>
    </div>
  );
}