export interface Article {
  id: string;
  title: { ar: string; en: string };
  category: "post" | "housing" | "employment" | "education" | "tech";
  summary: { ar: string; en: string };
  content: { ar: string; en: string };
  source: string;
  tags: string[];
}

export const articles: Article[] = [
  {
    id: "baridimob-blocked",
    title: { ar: "حل مشكلة حساب بريدي موب المقيد (Blocked)", en: "Fix BaridiMob Account Blocked" },
    category: "post",
    summary: { 
      ar: "ماذا تفعل إذا توقف تطبيق بريدي موب عن العمل أو ظهرت رسالة 'حساب مقيد'؟", 
      en: "What to do if your BaridiMob account is restricted or blocked?" 
    },
    content: { 
      ar: "1. تأكد من تحديث التطبيق لآخر نسخة من المتجر الرسمي. 2. إذا كنت خارج الجزائر، فالتطبيق معطل حالياً لأسباب أمنية. 3. إذا تكرر الخطأ، يجب التوجه لمكتب البريد لربط رقم الهاتف مجدداً (إجراء أمني 2026). 4. تجنب استخدام VPN عند فتح التطبيق.", 
      en: "1. Update to the latest official version. 2. If abroad, service is restricted for security. 3. Visit a post office to re-verify your phone number. 4. Disable VPN before using the app." 
    },
    source: "بريد الجزائر / مجموعات تقنية",
    tags: ["بريدي موب", "حلول", "بريد"]
  },
  {
    id: "aadl3-nin-error",
    title: { ar: "خطأ في رقم التعريف الوطني (NIN) في عدل 3", en: "NIN Error in AADL 3 Registration" },
    category: "housing",
    summary: { 
      ar: "حلول تقنية عند ظهور رسالة 'رقم التعريف خاطئ' أثناء التسجيل.", 
      en: "Technical solutions for 'Invalid NIN' error during AADL 3 registration." 
    },
    content: { 
      ar: "1. تأكد من كتابة الـ 18 رقماً كاملة دون فواصل. 2. إذا كنت مسجلاً سابقاً في عدل 1 أو 2، فقد يرفض النظام طلبك آلياً. 3. جرب التسجيل في أوقات خارج الذروة (بعد الفجر). 4. في حال استمرار المشكلة، اتصل بالرقم الأخضر 3040 لتصحيح البيانات.", 
      en: "1. Enter all 18 digits without spaces. 2. Previous AADL 1/2 subscribers may be auto-rejected. 3. Register during off-peak hours (dawn). 4. Call 3040 if the data mismatch persists." 
    },
    source: "وكالة عدل / صفحة المكتتبين",
    tags: ["عدل 3", "NIN", "سكن"]
  },
  {
    id: "minha-suspended",
    title: { ar: "أسباب تعليق منحة البطالة وكيفية استرجاعها", en: "Minha Suspension Reasons & Recovery" },
    category: "employment",
    summary: { 
      ar: "لماذا تحولت حالة منحتك إلى 'موقوفة' (Suspendu)؟", 
      en: "Why is your unemployment grant status 'Suspended'?" 
    },
    content: { 
      ar: "1. امتلاك سجل تجاري أو بطاقة حرفي (حتى لو كانت قديمة). 2. عدم الالتحاق بالتكوين المهني بعد استدعائك. 3. انتساب الزوج(ة) لمنظومة الضمان الاجتماعي براتب يتجاوز الحد. 4. الحل: التوجه لملحقة ANEM مع 'شهادة عدم انتساب' (Non-Affiliation) لإعادة التفعيل.", 
      en: "1. Owning a commercial record or artisan card. 2. Not attending mandatory vocational training. 3. Spouse earning above the social security threshold. 4. Solution: Visit ANEM with a 'Non-Affiliation' certificate to reactivate." 
    },
    source: "الوكالة الوطنية للتشغيل / فيسبوك",
    tags: ["منحة البطالة", "ANEM", "حلول"]
  },
  {
    id: "eccp-otp-not-received",
    title: { ar: "حل مشكلة عدم وصول رمز التأكيد (OTP)", en: "Fix OTP Not Received in ECCP" },
    category: "post",
    summary: { 
      ar: "خطوات حل تأخر وصول رسائل التأكيد عند طلب البطاقة الذهبية.", 
      en: "Steps to fix SMS confirmation code delays for Edahabia requests." 
    },
    content: { 
      ar: "1. تأكد أن رقم الهاتف مرتبط رسمياً بالحساب (خدمة Notification SMS). 2. جرب تغيير المتصفح أو حذف ملفات الكوكيز. 3. تأكد من عدم امتلاء ذاكرة الرسائل في هاتفك. 4. الأفضل استخدام شريحة 'موبيليس' لضمان سرعة الوصول مقارنة بالمتعاملين الآخرين.", 
      en: "1. Ensure the number is officially linked via 'Notification SMS'. 2. Switch browsers or clear cookies. 3. Check if your phone's SMS storage is full. 4. Mobilis SIMs typically receive ECCP codes faster." 
    },
    source: "بريد الجزائر / مجتمع التقنية",
    tags: ["البطاقة الذهبية", "بريد", "OTP"]
  },
  {
    id: "sonelgaz-online-payment",
    title: { ar: "دليل دفع فاتورة سونلغاز بالبطاقة الذهبية", en: "Pay Sonelgaz Bill with Edahabia" },
    category: "tech",
    summary: { 
      ar: "كيفية تسديد فواتير الكهرباء والغاز من منزلك عبر الإنترنت.", 
      en: "How to pay your electricity and gas bills online from home." 
    },
    content: { 
      ar: "1. ادخل لموقع baridinet.poste.dz/sonelgaz. 2. أدخل رقم الفاتورة ورمز EBB المكون من 3 أرقام. 3. أدخل مبلغ الفاتورة بدقة. 4. أدخل معلومات البطاقة الذهبية وأكد العملية برمز الرسالة القصيرة. ستتلقى وصلاً رقمياً فورياً.", 
      en: "1. Visit baridinet.poste.dz/sonelgaz. 2. Enter bill number and 3-digit EBB code. 3. Enter the exact amount. 4. Input Edahabia card details and confirm via SMS. You will receive an instant digital receipt." 
    },
    source: "سونلغاز / بريد الجزائر",
    tags: ["سونلغاز", "فاتورة", "دفع"]
  },
  {
    id: "license-points-2026",
    title: { ar: "تحديث: رخصة السياقة بالنقاط في الجزائر 2026", en: "Update: Points-based Driver's License 2026" },
    category: "tech",
    summary: { 
      ar: "كل ما تحتاج معرفته عن رصيد النقاط وكيفية استرجاعها.", 
      en: "Everything you need to know about point balances and recovery." 
    },
    content: { 
      ar: "1. النظام الجديد يمنح 12 نقطة للسائقين الجدد و24 للمحترفين. 2. يتم خصم النقاط آلياً عند ارتكاب مخالفات مسجلة بالكاميرات أو الرادارات. 3. يمكن متابعة رصيدك عبر بوابة 'طريقي'. 4. استرجاع النقاط يتطلب دورات تكوينية أو مرور سنة دون مخالفات.", 
      en: "1. New system grants 12 points to new drivers, 24 to others. 2. Points are auto-deducted for violations. 3. Monitor balance via 'Tariky' portal. 4. Points recovery requires training or a violation-free year." 
    },
    source: "وزارة الداخلية / طريقي",
    tags: ["رخصة السياقة", "نقاط", "مرور"]
  },
  {
    id: "tharwa-password-reset",
    title: { ar: "استرجاع كلمة مرور فضاء الأولياء (Tharwa)", en: "Reset Tharwa Parent Portal Password" },
    category: "education",
    summary: { 
      ar: "حل مشكلة نسيان كلمة السر للاطلاع على كشوف نقاط الأبناء.", 
      en: "Fix password issues to access your children's report cards." 
    },
    content: { 
      ar: "1. ادخل لموقع awlyaa.education.dz. 2. اضغط على 'نسيت كلمة المرور'. 3. أدخل البريد الإلكتروني الذي سجلت به أول مرة. 4. في حال تعذر ذلك، يجب التوجه لمديرية المؤسسة التعليمية لإعادة تفعيل الحساب يدوياً.", 
      en: "1. Visit awlyaa.education.dz. 2. Click 'Forgot Password'. 3. Enter your registered email. 4. If unavailable, visit the school administration to manually reset the account." 
    },
    source: "وزارة التربية الوطنية",
    tags: ["التعليم", "كشف النقاط", "فضاء الأولياء"]
  }
];
