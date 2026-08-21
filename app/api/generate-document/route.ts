import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const maxDuration = 10;

export async function POST(req: Request) {
  const openrouterApiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!openrouterApiKey && !groqApiKey) {
    return NextResponse.json(
      { error: 'خدمة الذكاء الاصطناعي غير متاحة. يرجى إعداد مفتاح API في المتغيرات البيئية.' },
      { status: 503 }
    );
  }

  try {
    const { description, docType, toneInstruction } = await req.json();

    if (!description) {
      return NextResponse.json({ error: 'الوصف مطلوب لتوليد النص' }, { status: 400 });
    }

    let generatedText = '';

    // ----- استخدام OpenRouter -----
    if (openrouterApiKey) {
      const openRouterModel = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash:floor';

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openrouterApiKey.trim()}`,
          'HTTP-Referer': 'https://www.raqmanadz.com',
          'X-Title': 'Raqmana Algeria',
          'X-OpenRouter-Cache': 'true',
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: [
            {
              role: 'system',
              content: `أنت مساعد كتابة النماذج الإدارية الجزائرية الرسمية.

              تعليمات صارمة:
              1. لا تكتب "الجمهورية الجزائرية الديمقراطية الشعبية" ولا تضع أي عنوان علوي مثل "طلب إداري" لأن الترويسة مطبوعة مسبقاً في رأس الورقة الرسمية.
              2. ابدأ مباشرة بأسطر أو جدول بيانات الطرفين:
                 - الطرف الأيمن: الاسم واللقب: ......، العنوان: ......، رقم الهاتف: ......، البريد الإلكتروني: ......
                 - الطرف الأيسر: إلى السيد/ة: ......، المؤسسة/الجهة الوصية: ......، العنوان: ......
              3. سطر "الموضوع:" يليه المحتوى المطلوب مباشرة.
              4. بعد انتهاء المحتوى، أضف عبارة ختامية مهذبة تناسب الجهة المرسل إليها.
              5. في أسفل اليسار: كلمة "التوقيع:" فقط.
              6. اكتب المحتوى بأسلوب ${toneInstruction || 'رسمي إداري'} دون أي مقدمات أو تعليقات خارجية.`
            },
            {
              role: 'user',
              content: `المطلوب صياغته: ${description}`
            }
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        generatedText = data.choices?.[0]?.message?.content || '';
      }
    }

    // ----- الاحتياط 1: Groq -----
    if (!generatedText && groqApiKey) {
      try {
        const groq = new Groq({ apiKey: groqApiKey });
        const response = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `اكتب النموذج بالهيكل التالي بدقة:
              1. لا تكتب "الجمهورية الجزائرية الديمقراطية الشعبية" لأنها موجودة في رأس الصفحة.
              2. ابدأ مباشرة ببيانات الطرفين:
                 - اليمين: الاسم الكامل: ......، العنوان: ......، رقم الهاتف: ......، البريد الإلكتروني: ......
                 - اليسار: إلى السيد/ة: ......، المؤسسة/المديرية: ......، العنوان: ......
              3. الموضوع: ثم المحتوى المطلوب بأسلوب رسمي.
              4. عبارة ختامية مهذبة لائقة بالمسؤول أو الجهة.
              5. في الأسفل: كلمة "التوقيع:" فقط.`,
            },
            {
              role: 'user',
              content: `المطلوب: ${description}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 800,
        });
        generatedText = response.choices[0]?.message?.content || '';
      } catch (groqErr) {
        console.warn('Groq fallback error:', groqErr);
      }
    }

    // ----- الاحتياط 2: Google Gemini (حصري ومجاني وآمن) -----
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!generatedText && geminiApiKey) {
      try {
        const geminiPrompt = `أنت مساعد كتابة النماذج والعرائض الإدارية الجزائرية الرسمية.
اكتب وثيقة إدارية بالهيكل التالي بدقة:
1. لا تكتب "الجمهورية الجزائرية الديمقراطية الشعبية" لأن ترويسة الورقة الرسمية مطبوعة مسبقاً في الصفحة.
2. ابدأ مباشرة ببيانات الطرفين:
   - الطرف الأيمن: الاسم واللقب: ......، العنوان: ......، رقم الهاتف: ......، البريد الإلكتروني: ......
   - الطرف الأيسر: إلى السيد/ة: ......، المؤسسة/الجهة الوصية: ......، العنوان: ......
3. سطر "الموضوع:" يليه المحتوى المطلوب بأسلوب ${toneInstruction || 'رسمي إداري جزائري رصين'}.
4. عبارة ختامية مهذبة لائقة بالجهة الإدارية.
5. في أسفل اليسار: كلمة "التوقيع:" فقط.
ممنوع كتابة أي مقدمات أو شروحات خارج الوثيقة.

بيانات الطلب:
${description}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: geminiPrompt }] }],
              generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
            }),
          }
        );
        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          generatedText = gData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (gErr) {
        console.warn('Gemini fallback error:', gErr);
      }
    }

    // ===== دالة تنظيف قوية =====
    function cleanGeneratedText(text: string): string {
      if (!text) return '';

      let cleaned = text;

      // 1. حذف أي تكرار لعبارة "الجمهورية الجزائرية الديمقراطية الشعبية" لأنها موجودة في ترويسة الورقة
      cleaned = cleaned.replace(/الجمهورية الجزائرية الديمقراطية الشعبية/g, '');

      // 2. حذف العبارات التمهيدية المزعجة
      const prefixesToRemove = [
        /^بالتأكيد،?\s*/i,
        /^بالطبع،?\s*/i,
        /^إليك\s*/i,
        /^هذا هو\s*/i,
        /^هذه هي\s*/i,
        /^نص\s*/i,
        /^فيما يلي\s*/i,
        /^بناءً على طلبك،?\s*/i,
        /^تفضل\s*/i,
        /^هذا نص\s*/i,
        /^إليك نص\s*/i,
        /^ها هو\s*/i,
        /^ها هي\s*/i,
        /^حسب طلبك،?\s*/i,
      ];

      for (const pattern of prefixesToRemove) {
        if (pattern.test(cleaned)) {
          cleaned = cleaned.replace(pattern, '');
          break;
        }
      }

      // 3. تنظيف الأسطر الفارغة المتكررة
      cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

      // 4. التأكد من أن التوقيع هو فقط "التوقيع:" وليس معه اسم أو تاريخ
      const signatureLines = cleaned.split('\n');
      const newLines = [];
      let signatureFound = false;

      for (const line of signatureLines) {
        if (line.includes('التوقيع') && !signatureFound) {
          newLines.push('التوقيع:');
          signatureFound = true;
        } else if (!line.includes('التوقيع')) {
          if (signatureFound && (line.includes('الاسم') || line.includes('التاريخ') || line.includes('الصفة'))) {
            continue;
          } else {
            newLines.push(line);
          }
        }
      }

      cleaned = newLines.join('\n').trim();

      return cleaned;
    }

    // تنظيف النص الناتج
    generatedText = cleanGeneratedText(generatedText);

    if (!generatedText) {
      return NextResponse.json(
        { error: 'عذراً، لم أتمكن من توليد النص. يرجى المحاولة مجدداً.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ generatedText });
  } catch (error) {
    console.error('Generate Document Error:', error);
    return NextResponse.json(
      { error: `حدث خطأ داخلي في الخادم: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` },
      { status: 500 }
    );
  }
}