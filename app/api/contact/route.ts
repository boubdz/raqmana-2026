import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة)' },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'يرجى إدخال بريد إلكتروني صالح' },
        { status: 400 }
      );
    }

    // Log contact submission for review
    console.log(`[Contact Form Received] From: ${name} <${email}> | Subject: ${subject || 'بدون موضوع'} | Message: ${message.substring(0, 100)}...`);

    return NextResponse.json(
      {
        success: true,
        message: 'تم استلام رسالتك بنجاح، سيقوم فريق منصة رقمنة بالتواصل معك قريباً.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Contact API Error]:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة الطلب، يرجى المحاولة لاحقاً.' },
      { status: 500 }
    );
  }
}
