import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { description, docType, toneInstruction } = await req.json();

    if (!description) {
      return NextResponse.json({ error: 'الوصف مطلوب' }, { status: 400 });
    }

    const prompt = `
أنت مساعد إداري خبير في القوانين والإجراءات الإدارية الجزائرية.
بناءً على الوصف التالي، قم بإنشاء نص رسمي ومهني من نوع "${docType || 'وثيقة'}" باللغة العربية الفصحى.

**تعليمات اللهجة:** ${toneInstruction || 'رسمية'}

**تعليمات صارمة:**
- لا تطلب أي معلومات شخصية (رقم بطاقة تعريف، عنوان تفصيلي، أرقام سرية).
- لا تطلب أي وثائق أو مرفقات.
- اعتمد فقط على الوصف العام المقدم.
- استخدم الصياغات الرسمية المتبعة في المراسلات الإدارية الجزائرية.
- خاطب الجهة المعنية بصيغة "السيد/السيدة المحترم/ة".
- اترك مكاناً فارغاً بين قوسين معقوفين للمعلومات التي يجب أن يملأها المستخدم (مثل [الاسم الكامل]، [تاريخ الميلاد]).
- اجعل النص جاهزاً للتعبئة والطباعة.

**وصف المستخدم:**
${description}

**النص المُولّد:**
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 800,
    });

    const generatedText = response.choices[0]?.message?.content || "عذراً، لم أتمكن من توليد النص.";

    return NextResponse.json({ generatedText });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'حدث خطأ أثناء توليد النص' }, { status: 500 });
  }
}