import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'بريد إلكتروني غير صالح' },
        { status: 400 }
      );
    }

    // Store to Formspree — form ID from env or hardcoded default
    const FORMSPREE_ID = process.env.FORMSPREE_ID ?? 'mlgqjoda';

    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, _subject: 'اشتراك جديد - رقمنة الجزائر' }),
    });
    if (!res.ok) {
      throw new Error('Formspree error');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Newsletter] Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ، حاول مرة أخرى' },
      { status: 500 }
    );
  }
}
