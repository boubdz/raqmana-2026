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
    title: { ar: "حل مشكلة حساب بريدي موب المقيد (Compte Bloqué) في الجزائر", en: "Fix BaridiMob Account Blocked or Restricted" },
    category: "post",
    summary: { 
      ar: "دليل شامل لأسباب تجميد حساب بريدي موب وكيفية رفع التقييد وإعادة التفعيل خطوة بخطوة.", 
      en: "Comprehensive guide to unblocking a restricted BaridiMob account and reactivating mobile services." 
    },
    content: { 
      ar: "تُعد رسالة 'حساب مقيد' (Compte Restreint / Bloqué) في تطبيق بريدي موب إجراءً أمنياً احترازياً يتخذه بريد الجزائر لحماية أرصدة الزبائن. نستعرض أسباب الحظر والحلول العملية:\n\n### أولاً: الأسباب الشائعة لحظر الحساب:\n1. **إدخال كلمة المرور أو رمز 3D-Secure خطأ 3 مرات متتالية:** يؤدي ذلك إلى قفل الحساب فورياً لمنع محاولات الاختراق.\n2. **محاولة الولوج من شبكات اتصال خارجية أو عناوين غير محلية:** تطبق خوادم بريد الجزائر تدابير حماية متقدمة تمنع الاتصالات غير المصرح بها لحماية أرصدة المواطنين من القرصنة.\n3. **تغيير شريحة الهاتف SIM أو نقلها لهاتف جديد:** عند تغيير رقم الهاتف المسجل دون تحيينه عبر الصراف الآلي، يتم تعليق الحساب لمطابقة الهوية.\n4. **تجاوز سقف التحويل اليومي:** تجاوز حد 200,000 دج في اليوم أو إجراء تحويلات متتالية مشبوهة.\n\n### ثانياً: خطوات رفع التقييد وإعادة التفعيل:\n1. **الاتصال المباشر عبر شبكة الهاتف المحلية:** تأكد من الاتصال عبر شبكة الهاتف النقال الوطنية المباشرة (4G/5G) دون وسائط توجيه اتصال، لضمان التعرف النظامي على موقع الاتصال.\n2. **تحديث رقم الهاتف عبر الصراف الآلي (GAB):** توجه لأقرب موزع آلي لبريد الجزائر، أدخل بطاقتك الذهبية والرمز السري، اختر 'خدمات الهاتف النقال' ثم 'تأكيد رقم الهاتف'.\n3. **الاتصال بمركز النداء 1530:** اتصل بخدمة الزبائن لبريد الجزائر وقدم رقم البطاقة الذهبية ورقم الحساب CCP لإعادة تصفير محاولات الدخول الخاطئة.\n4. **زيارة مكتب البريد في الحالات المستعصية:** في حال استمرار التجميد، توجه لمكتب البريد مصحوباً ببطاقة الهوية البيومترية وصك مشطوب وملء استمارة تسوية الحساب الرقمي.", 
      en: "A restricted BaridiMob account is a security measure taken by Algerie Poste to protect funds. Common causes include: 3 wrong PIN/OTP entries, connection attempts from unrecognized foreign networks, or switching SIM cards without ATM verification. To resolve: connect directly through your local national mobile network (4G/5G), re-verify phone number at any ATM (GAB) under mobile services, call Algerie Poste support at 1530, or visit a post branch with your ID and voided cheque." 
    },
    source: "مؤسسة بريد الجزائر — مركز خدمة الزبائن (1530) وموقع poste.dz",
    tags: ["بريدي موب", "حلول", "بريد الجزائر", "البطاقة الذهبية", "خدمات مالية"]
  },
  {
    id: "aadl3-nin-error",
    title: { ar: "حل مشكلة خطأ رقم التعريف الوطني (NIN) في التسجيل بسكنات عدل 3", en: "Fix NIN Error in AADL 3 Registration" },
    category: "housing",
    summary: { 
      ar: "كيفية تصحيح أخطاء عدم تطابق رقم التعريف الوطني وتفادي رفض التسجيل في منصة عدل 3.", 
      en: "How to resolve National Identification Number (NIN) validation errors in AADL 3 registration portal." 
    },
    content: { 
      ar: "يواجه بعض المكتتبين رسالة خطأ تفيد بأن 'رقم التعريف الوطني خاطئ' أو 'غير مطابق' أثناء التسجيل في منصة عدل 3. إليك خطوات المعالجة والحلول التقنية المعتمدة:\n\n### أسباب الخطأ الأكثر شيوعاً:\n1. **كتابة أرقام خاطئة أو إدخال مسافات:** يتكون رقم NIN من 18 رقماً يجب كتابتها بدقة باللغة اللاتينية دون أي مسافات أو فواصل.\n2. **عدم تطابق بيانات الحالة المدنية:** التحقق الآلي يتم عبر قاعدة بيانات وزارة الداخلية، وأي اختلاف بين تاريخ الميلاد المسجل والوثيقة البيومترية يسبب رفض الاستمارة.\n3. **وجود ملف سابق في عدل 1 أو عدل 2:** إذا كان المكتتب أو زوجه مسجلاً سابقاً في برامج سكنية، قد يقوم النظام بفرز الطلب آلياً.\n\n### خطوات حل المشكلة:\n1. **التأكد من رقم NIN المطبوع:** استخرج الرقم من بطاقة التعريف الوطنية البيومترية (المتواجد أسفل الصورة مباشرة) أو من الصفحة الأولى لجواز السفر البيومتري.\n2. **استخدام متصفح حديث في أوقات خارج الذروة:** التسجيل في الصباح الباكر أو في المساء لتفادي بطء الاستجابة مع سيرفرات الحالة المدنية.\n3. **الاتصال بالرقم الأخضر لوكالة عدل (3040):** للإبلاغ عن مشكلة عدم تطابق البيانات وتصحيحها في المنظومة الرقمية.", 
      en: "NIN mismatch errors occur during AADL 3 registration due to incorrect 18-digit entry, formatting spaces, civil registry data mismatches, or previous subscriptions. Ensure the 18 digits match your biometric ID card, input digits without spaces, use a modern browser during off-peak hours, or contact AADL support at 3040." 
    },
    source: "وكالة تحسين السكن وتطويره (AADL) — الرقم الأخضر 3040",
    tags: ["عدل 3", "NIN", "سكنات عدل", "حلول تقنية"]
  },
  {
    id: "minha-suspended",
    title: { ar: "أسباب تعليق منحة البطالة (Suspension Minha) وإجراءات استرجاعها 2026", en: "Minha Suspension Causes and Reactivation Guide 2026" },
    category: "employment",
    summary: { 
      ar: "شرح قانوني مفصل لأسباب توقيف صب منحة البطالة لدى ANEM والملف المطلوب لإعادة التفعيل.", 
      en: "Detailed legal explanation of ANEM unemployment grant suspensions and required reactivation procedures." 
    },
    content: { 
      ar: "تخضع منحة البطالة (18,000 دج) لنظام رقابة ومطابقة دورية آلية بين الوكالة الوطنية للتشغيل وصناديق الضمان الاجتماعي والسجل التجاري. نوضح هنا الحالات القانونية للتعليق وكيفية تقديم الطعن:\n\n### أهم أسباب تعليق الصرف:\n1. **الانتساب إلى هيئات الضمان الاجتماعي (CNAS / CASNOS):** أي تصريح بالعمل كأجير أو غير أجير، حتى وإن كان مؤقتاً، يسقط صفة الباحث عن عمل تلقائياً.\n2. **بلوغ سن الـ 40 سنة:** تنص الشروط التنظيمية على أن المنحة موجهة للفئة العمرية بين 19 و 40 سنة، وتتوقف آلياً عند بلوغ هذا السن.\n3. **عدم تجديد بطاقة طالب العمل عبر 'وسيط أونلاين':** تجديد التسجيل إلزامي كل 6 أشهر، وإهماله يؤدي إلى تعليق المنحة مؤقتاً.\n4. **الغياب عن التكوين المهني الإلزامي:** في حال توجيه المستفيد لدورة تأهيلية لدى مركز التكوين وعدم الالتحاق دون مبرر شرعي.\n5. **امتلاك سجل تجاري أو بطاقة حرفي نشطة:** حتى لو لم يتم ممارسة النشاط فعلياً، يجب شطب السجل رسمياً.\n\n### كيفية رفع التعليق والطعن:\n1. **استخراج شهادة عدم الانتساب:** استخراج الوثيقة من فضاء الهناء CNAS وبوابة ضمانكم CASNOS تثبت خلو الذمة.\n2. **تقديم ملف الطعن لدى ملحقة ANEM:** التوجه للملحقة المحلية للتشغيل التابع لها المعني مصحوباً بالوثائق المبررة وإيداع استمارة إعادة النظر في أجل لا يتعدى 15 يوماً.", 
      en: "The Algerian unemployment grant (Minha) is automatically audited against social security and commerce registries. Common causes for suspension include social security affiliation (CNAS/CASNOS), turning 40, failing to renew Wassit registration every 6 months, or missing mandatory vocational training. To appeal: obtain non-affiliation certificates and visit your local ANEM agency with supporting documents." 
    },
    source: "الوكالة الوطنية للتشغيل (ANEM) — وزارة العمل والتشغيل والضمان الاجتماعي",
    tags: ["منحة البطالة", "ANEM", "وسيط اونلاين", "التشغيل", "حلول"]
  },
  {
    id: "eccp-otp-not-received",
    title: { ar: "حل مشكلة عدم وصول رمز التأكيد (OTP SMS) في منصة ECCP والبطاقة الذهبية", en: "Fix OTP SMS Delays for ECCP and Edahabia" },
    category: "post",
    summary: { 
      ar: "خطوات حل تأخر وصول رسائل التأكيد عبر الهاتف عند طلب البطاقة الذهبية أو التحويل المالي.", 
      en: "Troubleshooting guide for SMS verification code delays during Edahabia card requests and online transactions." 
    },
    content: { 
      ar: "يُعتبر رمز التحقق لمرة واحدة (OTP) خطوة الأمان الأساسية في معاملات بريد الجزائر عبر الإنترنت. إذا لم يصلك الرمز، اتبع الخطوات التالية:\n\n1. **التأكد من ربط رقم الهاتف بالبطاقة الذهبية:** يجب أن يكون رقم هاتفك مربوطاً بخدمة الرسائل القصيرة في مكتب البريد أو عبر الصراف الآلي (GAB).\n2. **التحقق من عدم حظر أرقام الخدمات القصيرة (Shortcodes):** تأكد من إعدادات تطبيق الرسائل في هاتفك أنه لا يصنف رسائل بريد الجزائر (AlgeriePoste) كرسائل غير مرغوب فيها (Spam).\n3. **إعادة تشغيل الهاتف أو التبديل لوضع الطيران:** يساعد ذلك في إعادة الاتصال بأقرب برج إرسال وتفريغ قائمة انتظار الرسائل القصيرة.\n4. **تفضيل شبكة موبيليس للخدمات المالية:** تشير التجارب الميدانية إلى أن شرائح Mobilis تستقبل رموز البريد بأعلى سرعة نظراً للتكامل المباشر مع خوادم بريد الجزائر.", 
      en: "If OTP codes fail to arrive: ensure your phone is officially linked via ATM, check that shortcode SMS are not blocked as spam in your phone settings, toggle airplane mode to refresh network connection, or use Mobilis SIM cards which offer the fastest delivery integration with Algerie Poste." 
    },
    source: "مؤسسة بريد الجزائر — مديرية الرقمنة والخدمات المالية",
    tags: ["البطاقة الذهبية", "بريد الجزائر", "OTP", "ECCP"]
  },
  {
    id: "sonelgaz-online-payment",
    title: { ar: "دليل دفع فاتورة سونلغاز بالبطاقة الذهبية والبطاقة البنكية CIB", en: "Pay Sonelgaz Electricity and Gas Bill Online" },
    category: "tech",
    summary: { 
      ar: "شرح تفصيلي لتسديد فواتير الكهرباء والغاز من منزلك عبر بوابة الدفع الإلكتروني واستخراج الوصل.", 
      en: "Step-by-step guide to paying Sonelgaz electricity and gas bills online using Edahabia or CIB cards." 
    },
    content: { 
      ar: "يُتيح مجمع سونلغاز بالتعاون مع بريد الجزائر وبنك الجزائر خدمة الدفع الإلكتروني لفواتير استهلاك الطاقة على مدار 24 ساعة دون أي عمولات إضافية:\n\n### خطوات الدفع بالبطاقة الذهبية عبر الإنترنت:\n1. **الدخول إلى بوابة الدفع:** الولوج مباشرة إلى الرابط الرسمي (baridinet.poste.dz/sonelgaz).\n2. **إدخال بيانات الفاتورة:** نقل 'رقم الفاتورة' ورمز 'EBB' المكون من 3 أرقام والمطبوع في أعلى الفاتورة الورقية بدقة.\n3. **تأكيد المبلغ:** إدخال المبلغ الإجمالي المستحق بالدينار الجزائري.\n4. **إدخال بيانات البطاقة الذهبية:** كتابة الرقم المكون من 16 خانة، تاريخ انتهاء الصلاحية، ورمز CVV2 الموجود خلف البطاقة.\n5. **تأكيد العملية:** إدخال رمز الأمان المرسل عبر SMS وتنزيل وصل السداد الرقمي بصيغة PDF والاحتفاظ به كإثبات قانوني.", 
      en: "Sonelgaz bill payment is available 24/7 via baridinet.poste.dz/sonelgaz. Enter your bill number, the 3-digit EBB code found on the paper bill, input the total amount, enter your Edahabia/CIB card details, confirm with the SMS OTP code, and download your official digital payment receipt." 
    },
    source: "مجمع سونلغاز وبريد الجزائر — بوابة الدفع الإلكتروني المعتمدة",
    tags: ["سونلغاز", "فاتورة", "دفع إلكتروني", "البطاقة الذهبية"]
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
