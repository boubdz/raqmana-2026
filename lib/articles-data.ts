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
    id: "dzds-portal-guide",
    title: { ar: "دليل التسجيل في البوابة الجزائرية للخدمات الرقمية dzds.dz", en: "Guide to the Algerian Digital Services Portal dzds.dz" },
    category: "tech",
    summary: { 
      ar: "تعرف على مميزات البوابة الرقمية الشاملة الجديدة، وكيفية إنشاء حساب واستخراج الوثائق الإدارية عن بعد.", 
      en: "Learn about the new digital portal features, how to create an account, and extract administrative documents online." 
    },
    content: { 
      ar: "1. الدخول إلى المنصة الرسمية عبر الرابط dzds.dz.\n2. إنشاء حساب باستخدام رقم التعريف الوطني (NIN).\n3. تأكيد رقم الهاتف لاستقبال الرمز السري.\n4. الولوج للوحة التحكم لاختيار الخدمة المطلوبة واستخراج الوثائق الإدارية فورياً.", 
      en: "1. Visit the official portal at dzds.dz.\n2. Create an account using your National Identity Number (NIN).\n3. Confirm your phone number via SMS OTP.\n4. Access the dashboard to select services and download documents instantly." 
    },
    source: "البوابة الجزائرية للخدمات الرقمية dzds.dz",
    tags: ["البوابة الرقمية", "dzds.dz", "الرقمنة", "الجزائر", "خدمات حكومية"]
  },
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
  },
  {
    id: "hcn-algeria-portal",
    title: { ar: "دليل البوابة الرقمية الجزائرية الجديدة hcn.dz للخدمات الحكومية", en: "Guide to the New Algerian Digital Portal hcn.dz" },
    category: "tech",
    summary: { 
      ar: "كل ما تحتاج معرفته عن البوابة الوطنية الجديدة للخدمات الرقمية التي أطلقتها المحافظة السامية للرقمنة وكيفية التسجيل فيها.", 
      en: "Everything you need to know about the new national portal for digital services and how to register." 
    },
    content: { 
      ar: "1. البوابة تم إطلاقها رسمياً من طرف المحافظة السامية للرقمنة عبر الرابط hcn.dz. 2. تهدف البوابة لتجميع وتسهيل الوصول لكافة الخدمات الإدارية الجزائرية الرقمية في مكان واحد. 3. للتسجيل وإنشاء حساب، ستحتاج إلى رقم التعريف الوطني البيومتري (NIN) المكون من 18 رقماً. 4. المنصة تضمن الأمان والتكامل بين القطاعات الوزارية المختلفة لتسهيل استخراج الوثائق المعنية دون تنقل.", 
      en: "1. The portal is officially launched by the High Commissariat for Digitization at hcn.dz. 2. It aims to unify and simplify access to all Algerian digital administrative services in one place. 3. To register and create an account, you will need your 18-digit Biometric National Identification Number (NIN). 4. The platform ensures security and integration between different ministries to facilitate document retrieval without traveling." 
    },
    source: "المحافظة السامية للرقمنة / وكالة الأنباء الجزائرية",
    tags: ["البوابة الرقمية", "hcn.dz", "الرقمنة", "الجزائر", "خدمات حكومية"]
  },
  {
    id: "dzds-comprehensive-guide",
    title: { 
      ar: "الدليل الشامل لبوابة dzds.dz: كل قسم وكيفية استخدامه وماذا تستفيد", 
      en: "Full Guide to dzds.dz: Every Portal Section, How to Use It, and Benefits" 
    },
    category: "tech",
    summary: { 
      ar: "دليل عملي ومفصل لبوابة dzds.dz الجزائرية: كيفية إنشاء الحساب، شرح كل قسم (الحالة المدنية، العدالة، التجارة، النقل، التعليم، الصحة، التشغيل)، طريقة الدفع الإلكتروني، وكيف تستفيد أقصى استفادة دون التنقل.", 
      en: "Practical and detailed guide to Algeria's dzds.dz portal: account creation, explanation of every section (civil status, justice, commerce, transport, education, health, employment), electronic payment, and how to get the most out of it without traveling." 
    },
    content: { 
      ar: "التسجيل في بوابة dzds.dz: ادخل إلى الرابط الرسمي dzds.dz عبر متصفحك (لا تحتاج لأي تطبيق)، اضغط على إنشاء حساب، وأدخل رقم التعريف الوطني (NIN) المكون من 18 رقماً الموجود في بطاقتك البيومترية مع تاريخ ميلادك كما هو مسجل رسمياً — أي خطأ في هذه البيانات سيمنع التسجيل.\nتفعيل الحساب برمز OTP: أدخل رقم هاتفك الشخصي وستصلك رسالة SMS تحتوي على كود سري مكون من 6 أرقام يجب إدخاله في أقل من دقيقتين، ثم اختر كلمة مرور قوية (أحرف وأرقام ورموز) وأضف بريدك الإلكتروني لاستعادتها مستقبلاً. حسابك جاهز الآن.\nقسم الحالة المدنية — وداعاً للطوابير: من هنا تستخرج شهادة الميلاد العادية وشهادة الميلاد الممتازة (12S) المطلوبة للتوظيف، شهادة الوفاة للورثة، وعقد الزواج — كلها تصلك PDF في ثوانٍ بـ QR Code معتمد قانونياً يغني تماماً عن ختم البلدية. يمكنك طلب شهادة أي شخص بمجرد رقمه الوطني.\nقسم العدالة والمحاكم — ملفاتك في يدك: استخرج صحيفة السوابق العدلية (القسيمة رقم 3) المطلوبة في كل ملفات التوظيف والسفارات دون الذهاب للمحكمة، تابع جلسات قضاياك (التاريخ والغرفة والقاضي)، وتحقق من الحجز التحفظي لأي سيارة مستعملة قبل شرائها بإدخال رقم اللوحة أو الهيكل لحمايتك من النصب.\nقسم التجارة والضرائب — أطلق مشروعك رقمياً: يستطيع المقاولون وأصحاب المشاريع تأسيس شركاتهم (EURL أو SARL) والحصول على السجل التجاري الإلكتروني عبر CNRC دون أي حضور، كما يمكن للشباب التسجيل كمقاول ذاتي (Auto-entrepreneur) مع دفع ضرائب مخفضة بنسبة 0.5%، واستخراج الرقم الجبائي (NIF) — كل ذلك عن بعد وفي يوم واحد.\nقسم النقل والمركبات — سيّر ملفاتك بلا انتظار: اطّلع على كل مخالفاتك المرورية مسجلة بصور الرادار وسددها إلكترونياً قبل تضاعف قيمتها، طلب تجديد رخصة السياقة في حال الضياع أو التلف، وحجز موعد مسبق للفحص التقني لتجنب طوابير المراكز.\nقسم التربية والتعليم — تابع أبناءك لحظة بلحظة: راقب كشوف النقاط الفصلية وغيابات أبنائك من هاتفك عبر فضاء الأولياء (Tharwa)، وسحب نتائج البكالوريا وشهادات BEM في يوم الإعلان بالكود الرسمي للتحقق من صحتها.\nقسم الصحة والتشغيل — ابقَ على اطلاع بحقوقك: تابع حالة تعويضاتك الطبية لدى CNAS وتاريخ صرفها في حسابك البريدي، استخرج شهادة الانتساب للتأمين (مطلوبة في كثير من الملفات)، جدد بطاقة طالب العمل أو تحقق من سريان منحة البطالة (ANEM) دون الحضور الشهري للوكالة.\nالدفع الإلكتروني الآمن: كل خدمة مدفوعة (السوابق العدلية، الغرامات المرورية، رخصة السياقة، السجل التجاري) تُسدَّد لحظياً بالبطاقة الذهبية (Edahabia) أو بطاقة CIB البنكية، وتتلقى وصلاً إلكترونياً فورياً بقوة قانونية كاملة مقبولاً في جميع الإدارات الجزائرية.\nنصيحة للجالية بالخارج: إذا كنت مقيماً في فرنسا، كندا، بلجيكا أو أي دولة أخرى، فبوابة dzds.dz هي حلك الأمثل لاستخراج وثائقك (شهادات الميلاد، السوابق العدلية، الوكالات) وإرسالها رقمياً دون أي سفر أو توكيل.",
      en: "Register on dzds.dz: Open the official link dzds.dz in your browser (no app needed), click Create Account, enter your 18-digit NIN from your biometric ID and your exact birth date — any mismatch will block registration.\nActivate with OTP: Enter your Algerian mobile number to receive a 6-digit SMS code valid for 2 minutes, set a strong password, and add your email for future recovery. Your account is ready.\nCivil Status Section: Download birth certificates (standard and 12S for employment), death certificates, and marriage contracts as QR-coded PDFs in seconds — legally valid without any physical stamp, requestable for any person using their NIN.\nJustice Section: Extract your criminal record bulletin (Bulletin No. 3) needed for job applications without visiting court, track your case hearing dates, and verify judicial seizures on used cars before buying.\nCommerce and Tax Section: Register companies (EURL, SARL) and get an electronic commercial register via CNRC without attending in person; register as an auto-entrepreneur with 0.5% reduced taxes and extract your NIF tax number — all in one day remotely.\nTransport Section: View traffic violations with radar photos and pay fines before they double, request a replacement driver's license, and book a technical inspection appointment.\nEducation Section: Monitor your children's grades and absences via the Parents' Space (Tharwa), and download official Bac or BEM results with verification codes on announcement day.\nHealth and Employment Section: Track CNAS medical reimbursements and payment dates, extract your insurance affiliation certificate, and renew your job-seeker card or check your ANEM unemployment grant without monthly office visits.\nSecure Electronic Payment: All paid services are settled using Edahabia or CIB cards, with an instantly generated digital receipt recognized by all Algerian administrations.\nFor the Algerian diaspora: Whether in France, Canada, or Belgium, dzds.dz lets you extract all your official documents and send them digitally without any travel or power of attorney." 
    },
    source: "بوابة الخدمات الرقمية الجزائرية dzds.dz",
    tags: [
      "البوابة الرقمية", "dzds.dz", "الرقمنة", "الجزائر", "دليل شامل",
      "استخراج شهادة ميلاد", "السجل التجاري", "السوابق العدلية",
      "رقم التعريف الوطني", "NIN", "البطاقة الذهبية", "المقاول الذاتي",
      "التحول الرقمي", "خدمات حكومية", "hcn.dz", "الجالية الجزائرية"
    ]
  }
];
