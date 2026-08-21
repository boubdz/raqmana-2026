import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';

// قائمة النطاقات المؤقتة والوهمية الشائعة
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com',
  'sharklasers.com', 'trashmail.com', 'yopmail.com', 'discard.email',
  'getnada.com', 'temp-mail.org', 'fakeinbox.com', 'maildrop.cc',
  'dispostable.com', 'inboxkitten.com', 'mohmal.com', 'generator.email',
  'throwawaymail.com', 'mytemp.email', 'crazymailing.com', 'emailondeck.com',
  'burnermail.io', 'dropmail.me', 'harakirimail.com', 'spam4.me',
  'grr.la', 'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de',
  'guerrillamail.net', 'guerrillamail.org', 'test.com', 'example.com',
]);

async function checkDomainMxRecords(domain: string): Promise<boolean> {
  // نطاقات كبرى موثوقة دائماً
  const trustedDomains = ['gmail.com', 'yahoo.com', 'yahoo.fr', 'outlook.com', 'outlook.fr', 'hotmail.com', 'hotmail.fr', 'icloud.com', 'live.com', 'proton.me', 'protonmail.com', 'zoho.com', 'mail.ru', 'yandex.com', 'aol.com'];
  if (trustedDomains.includes(domain.toLowerCase())) {
    return true;
  }

  try {
    const records = await dns.promises.resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'يرجى إدخال البريد الإلكتروني' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. فحص بنية البريد الإلكتروني
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'صيغة البريد الإلكتروني غير صحيحة' },
        { status: 400 }
      );
    }

    const domain = cleanEmail.split('@')[1];

    // 2. حظر النطاقات المؤقتة والوهمية
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return NextResponse.json(
        { error: 'البريد المؤقت أو الوهمي غير مقبول. يرجى استخدام بريدك الشخصي (Gmail أو Outlook)' },
        { status: 400 }
      );
    }

    // 3. التحقق من وجود خادم بريد حقيقي للنطاق (DNS MX Lookup)
    const isDomainValid = await checkDomainMxRecords(domain);
    if (!isDomainValid) {
      return NextResponse.json(
        { error: `النطاق (${domain}) غير موجود أو لا يستقبل رسائل حقيقية. يرجى إدخال بريد حقيقي مثل Gmail` },
        { status: 400 }
      );
    }

    // 4. الإرسال إلى Formspree لتسجيل المشترك في النيوزليتر
    const FORMSPREE_ID = process.env.FORMSPREE_ID ?? 'mlgqjoda';

    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        source: 'مساعد صياغة الوثائق الإدارية - رقمنة الجزائر',
        _subject: `🎉 مشترك جديد في النيوزليتر: ${cleanEmail}`,
        date: new Date().toLocaleString('ar-DZ', { timeZone: 'Africa/Algiers' }),
      }),
    });

    if (!res.ok) {
      console.warn('Formspree response not ok, but continuing');
    }

    return NextResponse.json({ success: true, email: cleanEmail });
  } catch (error) {
    console.error('[Newsletter] Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التحقق، يرجى المحاولة مجدداً' },
      { status: 500 }
    );
  }
}

