#!/usr/bin/env node
/**
 * سكريبت توليد محتوى SEO حصري وعالي الجودة لصفحات الخدمات الغير مفهرسة
 * يستخدم Gemini API لإنتاج وصف وخطوات وFAQs فريدة لكل خدمة
 */

const fs = require('fs');
const path = require('path');

// ─── قائمة الخدمات الغير مفهرسة (158 خدمة) ────────────────────
const NON_INDEXED_SERVICES = [
  { slug: "الطاقة-الشمسية-sonelgaz-sonelgaz", name: "الطاقة الشمسية - سونلغاز", domain: "energy.sonelgaz.dz", category: "فواتير الطاقة" },
  { slug: "تطبيق-wassit-anem-التشغيل-play", name: "تطبيق وسيط ANEM للتشغيل", domain: "play.google.com", category: "التشغيل والبطالة" },
  { slug: "تطبيق-mobispace-موبيليس-play", name: "تطبيق MobiSpace موبيليس", domain: "play.google.com", category: "الاتصالات" },
  { slug: "وكالة-دعم-المقاولاتية-anade-anade", name: "وكالة دعم المقاولاتية ANADE", domain: "anade.dz", category: "الاستثمار والمقاولاتية" },
  { slug: "تصاريح-الاستيراد-import", name: "تصاريح الاستيراد", domain: "commerce.gov.dz", category: "التجارة والاستيراد" },
  { slug: "فضاء-الزبون-الجزائرية-للمياه-ade", name: "فضاء الزبون - الجزائرية للمياه ADE", domain: "ade.dz", category: "فواتير المياه" },
  { slug: "استخراج-مستخرج-السجل-التجاري-sidjilcom", name: "استخراج مستخرج السجل التجاري", domain: "sidjilcom.cnrc.org.dz", category: "السجل التجاري" },
  { slug: "البحث-عن-سجل-تجاري-sidjilcom", name: "البحث عن السجل التجاري عبر Sidjilcom", domain: "sidjilcom.cnrc.org.dz", category: "السجل التجاري" },
  { slug: "تطبيق-banxy-natixis-play", name: "تطبيق Banxy - ناتيكسيس الجزائر", domain: "play.google.com", category: "الخدمات البنكية" },
  { slug: "التسجيل-في-وكالة-ترقية-الاستثمار-aapi", name: "التسجيل في وكالة ترقية الاستثمار AAPI", domain: "aapi.dz", category: "الاستثمار" },
  { slug: "تتبع-الطرود-البريدية-4tracking", name: "تتبع الطرود البريدية", domain: "4tracking.poste.dz", category: "بريد الجزائر" },
  { slug: "بوابة-وزارة-التكوين-المهني-mfep", name: "بوابة وزارة التكوين المهني MFEP", domain: "mfep.gov.dz", category: "التكوين المهني" },
  { slug: "بوابة-بنك-التنمية-المحلية-bdl-bdl", name: "بوابة بنك التنمية المحلية BDL", domain: "bdl.dz", category: "الخدمات البنكية" },
  { slug: "المكتبة-الوطنية-الجزائرية-biblionat", name: "المكتبة الوطنية الجزائرية", domain: "biblionat.dz", category: "الثقافة والتراث" },
  { slug: "سوسيتي-جنرال-الجزائر-societegenerale", name: "Société Générale Algérie - الخدمات البنكية", domain: "societegenerale.dz", category: "الخدمات البنكية" },
  { slug: "الديوان-الوطني-للحرف-التقليدية-onat-onat", name: "الديوان الوطني للحرف التقليدية ONAT", domain: "onat.dz", category: "الصناعة التقليدية" },
  { slug: "فضاء-صاحب-العمل-فضاء-أرباب-العمل", name: "فضاء أرباب العمل - CNAS", domain: "cnas.dz", category: "الضمان الاجتماعي" },
  { slug: "seor-مياه-وصرف-الشرق-seor", name: "SEOR - مياه وصرف الشرق", domain: "seor.dz", category: "فواتير المياه" },
  { slug: "بنك-الجزائر-البوابة-الرسمية-bank-of-algeria", name: "بنك الجزائر المركزي - البوابة الرسمية", domain: "bank-of-algeria.dz", category: "الخدمات البنكية" },
  { slug: "بوابة-وزارة-البيئة-environment", name: "بوابة وزارة البيئة والطاقات المتجددة", domain: "environment.dz", category: "البيئة" },
  { slug: "تطبيق-cpa-mobile-play", name: "تطبيق CPA Mobile - القرض الشعبي الجزائري", domain: "play.google.com", category: "الخدمات البنكية" },
  { slug: "المتحف-الوطني-الجزائري-musee-bardo", name: "المتحف الوطني الجزائري باردو", domain: "musee-bardo.dz", category: "الثقافة والتراث" },
  { slug: "صندوق-ضمان-الصفقات-العمومية-cgmp", name: "صندوق ضمان الصفقات العمومية CGMP", domain: "cgmp.dz", category: "الصفقات العمومية" },
  { slug: "الشركة-الجزائرية-للتأمينات-saa-saa", name: "الشركة الجزائرية للتأمينات SAA", domain: "saa.dz", category: "التأمين" },
  { slug: "فاتورة-كراء-عدل-aadl", name: "دفع فاتورة كراء عدل AADL", domain: "aadl.com.dz", category: "السكن والعقار" },
  { slug: "طلب-بطاقة-المقاول-الذاتي-anae", name: "طلب بطاقة المقاول الذاتي - ANAE", domain: "anae.dz", category: "المقاولاتية" },
  { slug: "تطبيق-wimpay-bna-الدفع-play", name: "تطبيق WimPay - BNA الجزائر للدفع", domain: "play.google.com", category: "الخدمات البنكية" },
  { slug: "المركز-الوطني-لتكنولوجيا-الإنتاج-cnpbr-cnpbr", name: "المركز الوطني لتكنولوجيا الإنتاج CNPBR", domain: "cnpbr.dz", category: "الصناعة والإنتاج" },
  { slug: "منصة-مرافقة-الطلبة-الجدد-rag-rag", name: "منصة RAG - مرافقة الطلبة الجدد", domain: "rag.mesrs.dz", category: "الخدمات الجامعية" },
  { slug: "التصريح-بضياع-الوثائق-algeriepolice", name: "التصريح بضياع الوثائق - الشرطة الجزائرية", domain: "algeriepolice.dz", category: "الأمن والشرطة" },
  { slug: "بوابة-وزارة-العدل-mjustice", name: "بوابة وزارة العدل mjustice.dz", domain: "mjustice.dz", category: "العدل والقضاء" },
  { slug: "الوكالة-الوطنية-للسياحة-onat", name: "الوكالة الوطنية للسياحة ONAT", domain: "onat.dz", category: "السياحة" },
  { slug: "فضاء-الزبون-سونلغاز-sonelgaz", name: "فضاء الزبون سونلغاز - إدارة حسابك", domain: "clients.sonelgaz.dz", category: "فواتير الطاقة" },
  { slug: "استخراج-شهادة-الميلاد-12-etat-civil", name: "استخراج شهادة الميلاد رقم 12 عبر الإنترنت", domain: "etat-civil.interieur.gov.dz", category: "الحالة المدنية" },
  { slug: "استخراج-عقد-الزواج-etat-civil", name: "استخراج عقد الزواج من الإنترنت", domain: "etat-civil.interieur.gov.dz", category: "الحالة المدنية" },
  { slug: "استخراج-شهادة-الوفاة-etat-civil", name: "استخراج شهادة الوفاة من الإنترنت", domain: "etat-civil.interieur.gov.dz", category: "الحالة المدنية" },
  { slug: "تجديد-طلب-العمل-منحة-البطالة-anem", name: "تجديد طلب العمل - منحة البطالة ANEM", domain: "minha.anem.dz", category: "التشغيل والبطالة" },
  { slug: "حجز-موعد-منحة-البطالة-wasit", name: "حجز موعد منحة البطالة عبر وسيط", domain: "wassitonline.dz", category: "التشغيل والبطالة" },
  { slug: "التسجيل-في-منحة-البطالة-2026-anem", name: "التسجيل في منحة البطالة 2026 - ANEM", domain: "minha.anem.dz", category: "التشغيل والبطالة" },
  { slug: "دفع-حقوق-الإيواء-progres", name: "دفع حقوق الإيواء الجامعي عبر Progres", domain: "progres.mesrs.dz", category: "الخدمات الجامعية" },
  { slug: "دفع-حقوق-إعادة-التسجيل-progres", name: "دفع حقوق إعادة التسجيل الجامعي", domain: "progres.mesrs.dz", category: "الخدمات الجامعية" },
  { slug: "التحويلات-الجامعية-progres", name: "التحويلات الجامعية للطلبة عبر Progres", domain: "progres.mesrs.dz", category: "الخدمات الجامعية" },
  { slug: "فضاء-الهناء-البوابة-الرقمية-elhanaa", name: "فضاء الهناء - البوابة الرقمية CNAS", domain: "elhanaa.cnas.dz", category: "الضمان الاجتماعي" },
  { slug: "بوابة-البريد-الوطني-eccp", name: "بوابة البريد الوطني eCCP.dz", domain: "eccp.dz", category: "بريد الجزائر" },
  { slug: "طلب-الانتساب-casnos-damancom", name: "طلب الانتساب إلى CASNOS عبر Damancom", domain: "damancom.dz", category: "الضمان الاجتماعي" },
  { slug: "تطبيق-فضاء-الأولياء-tharwa-play", name: "تطبيق فضاء الأولياء Tharwa", domain: "play.google.com", category: "التربية والتعليم" },
  { slug: "منصة-AAPI-الاستثمار-الرقمي", name: "منصة AAPI للاستثمار الرقمي في الجزائر", domain: "aapi.dz", category: "الاستثمار" },
  { slug: "نتائج-مسابقة-شبه-طبي-formation", name: "نتائج مسابقة شبه الطبي - وزارة الصحة", domain: "formation.sante.gov.dz", category: "الصحة" },
  { slug: "منصة-جيل-77-7-مهارات-777", name: "منصة جيل 7.7.7 - مهارات رقمية للجميع", domain: "777.dz", category: "التكوين الرقمي" },
  { slug: "التسجيل-في-القوائم-الانتخابية-services", name: "التسجيل في القوائم الانتخابية", domain: "services.interieur.gov.dz", category: "الإدارة المحلية" },
  { slug: "تطبيق-adalatic-وزارة-العدل-play", name: "تطبيق Adalatic - بوابة وزارة العدل", domain: "play.google.com", category: "العدل والقضاء" },
  { slug: "تطبيق-محطتي-sogral-play", name: "تطبيق محطتي - SOGRAL للحافلات", domain: "play.google.com", category: "النقل والمواصلات" },
  { slug: "المنصة-الرقمية-للاستثمار-aapi", name: "المنصة الرقمية للاستثمار - AAPI", domain: "aapi.dz", category: "الاستثمار" },
  { slug: "منصة-جباية-تيك-jibayatic", name: "منصة جباية تيك - الأداء الضريبي الإلكتروني", domain: "jibayatic.dg-imp.dz", category: "الضرائب" },
  { slug: "الشباك-عن-بعد-LPA", name: "الشباك عن بعد - وزارة الداخلية LPA", domain: "chezmoipourtous.interieur.gov.dz", category: "الإدارة المحلية" },
  { slug: "تتبع-بطاقة-الشفاء-cnas", name: "تتبع بطاقة الشفاء عبر بوابة CNAS", domain: "cnas.dz", category: "الضمان الاجتماعي" },
  { slug: "تتبع-الدفتر-العقاري-cadastre", name: "تتبع طلب الدفتر العقاري", domain: "cadastre.dz", category: "العقار وأملاك الدولة" },
  { slug: "فتح-حساب-بريدي-ccpnet", name: "فتح حساب بريدي جاري CCP عبر الإنترنت", domain: "ccpnet.poste.dz", category: "بريد الجزائر" },
  { slug: "حساب-CCP-خدمات-البريد", name: "خدمات الحساب البريدي الجاري CCP", domain: "ccpnet.poste.dz", category: "بريد الجزائر" },
  { slug: "بوابة-الصيد-البحري-inspa-dz", name: "بوابة الصيد البحري وتربية المائيات", domain: "inspa.dz", category: "الفلاحة والصيد البحري" },
  { slug: "الصناعة-التقليدية-والحرف-msatf", name: "الصناعة التقليدية والحرف - MSATF", domain: "msatf.gov.dz", category: "الصناعة التقليدية" },
  { slug: "العيادة-الرقمية-clinique", name: "العيادة الرقمية - الصحة الإلكترونية", domain: "sante.gov.dz", category: "الصحة" },
  { slug: "الغرفة-الوطنية-للفلاحة-cna", name: "الغرفة الوطنية للفلاحة CNA", domain: "cna.dz", category: "الفلاحة" },
  { slug: "القرض-الشعبي-الجزائري-cpa", name: "القرض الشعبي الجزائري CPA - الخدمات الرقمية", domain: "cpa.dz", category: "الخدمات البنكية" },
  { slug: "المخيمات-الصيفية-injep", name: "المخيمات الصيفية - INJEP وزارة الشباب", domain: "injep.dz", category: "الشباب والرياضة" },
  { slug: "الممثليات-الدبلوماسية-mfa", name: "الممثليات الدبلوماسية الجزائرية بالخارج", domain: "mae.dz", category: "الشؤون الخارجية" },
  { slug: "المناطق-الصناعية-aniref", name: "المناطق الصناعية - ANIREF", domain: "aniref.dz", category: "الاستثمار والصناعة" },
  { slug: "الوكالة-الوطنية-للأدوية-anpp", name: "الوكالة الوطنية للأدوية ANPP", domain: "anpp.dz", category: "الصحة والأدوية" },
  { slug: "تراخيص-الأنشطة-الثقافية-m-culture", name: "تراخيص الأنشطة الثقافية - وزارة الثقافة", domain: "m-culture.gov.dz", category: "الثقافة" },
  { slug: "ترخيص-الوكالة-السياحية-mta", name: "ترخيص فتح وكالة سياحية - وزارة السياحة MTA", domain: "mta.gov.dz", category: "السياحة" },
  { slug: "تطبيق-الجوية-الجزائرية-play", name: "تطبيق Air Algérie - الجوية الجزائرية", domain: "play.google.com", category: "النقل الجوي" },
  { slug: "تطبيق-جيزي-djezzy-play", name: "تطبيق Djezzy - جيزي للاتصالات", domain: "play.google.com", category: "الاتصالات" },
  { slug: "تطبيق-مياهي-موب-miyahimob-play", name: "تطبيق مياهي موب - Miyahi Mob", domain: "play.google.com", category: "فواتير المياه" },
  { slug: "تطبيق-وكالتي-wakalati-سيال-play", name: "تطبيق وكالتي - Wakalati SEAAL", domain: "play.google.com", category: "فواتير المياه" },
  { slug: "تطبيق-يسير-yassir-نقل-play", name: "تطبيق يسير Yassir - طلب سيارات الأجرة", domain: "play.google.com", category: "النقل" },
  { slug: "تطبيق-sntf-القطارات-play", name: "تطبيق SNTF - حجز تذاكر القطارات الجزائرية", domain: "play.google.com", category: "النقل بالسكة الحديدية" },
  { slug: "تعبئة-الرصيد-أرسلي-موبيليس", name: "تعبئة رصيد أرسلي - موبيليس عبر الإنترنت", domain: "e-paiement.mobilis.dz", category: "الاتصالات" },
  { slug: "تعبئة-الرصيد-جيزي-moncompte", name: "تعبئة رصيد جيزي عبر Mon Compte", domain: "moncompte.djezzy.dz", category: "الاتصالات" },
  { slug: "خلية-الإصغاء-commerce", name: "خلية الإصغاء والشكاوى - وزارة التجارة", domain: "commerce.gov.dz", category: "التجارة" },
  { slug: "خلية-الاستماع-للجمارك-douane", name: "خلية الاستماع والشكاوى - الجمارك الجزائرية", domain: "douane.gov.dz", category: "الجمارك" },
  { slug: "ديوان-حقوق-المؤلف-onda", name: "ديوان حقوق المؤلف والحقوق المجاورة ONDA", domain: "onda.dz", category: "حقوق الملكية الفكرية" },
  { slug: "سلطة-ضبط-السمعي-البصري-arpa", name: "سلطة ضبط السمعي البصري ARPA", domain: "arpa.dz", category: "الإعلام والاتصال" },
  { slug: "شركة-caar-للتأمين", name: "شركة CAAR للتأمين وإعادة التأمين", domain: "caar.dz", category: "التأمين" },
  { slug: "طلب-تثمين-المعاشات-cnr", name: "طلب تثمين معاشات التقاعد - CNR", domain: "cnr.dz", category: "التقاعد" },
  { slug: "طلب-جواز-السفر-البيومتري-passeport", name: "طلب جواز السفر البيومتري الجزائري", domain: "passeport.interieur.gov.dz", category: "الوثائق الرسمية" },
  { slug: "طلب-بطاقة-التعريف-البيومترية-passeport", name: "طلب بطاقة التعريف البيومترية الجزائرية", domain: "passeport.interieur.gov.dz", category: "الوثائق الرسمية" },
  { slug: "طلب-منحة-رمضان-interieur", name: "طلب منحة رمضان - الضمان الاجتماعي", domain: "interieur.gov.dz", category: "الضمان الاجتماعي" },
  { slug: "طلب-نسخة-من-بطاقة-الناخب-services", name: "طلب نسخة من بطاقة الناخب - وزارة الداخلية", domain: "services.interieur.gov.dz", category: "الإدارة المحلية" },
  { slug: "فاتورة-الكهرباء-والغاز-sonelgaz", name: "دفع فاتورة الكهرباء والغاز سونلغاز", domain: "etaqaty.sonelgaz.dz", category: "فواتير الطاقة" },
  { slug: "فاتورة-المياه-seaal", name: "دفع فاتورة المياه SEAAL", domain: "seaal.dz", category: "فواتير المياه" },
  { slug: "فاتورة-كراء-opgi", name: "دفع فاتورة كراء OPGI", domain: "opgi.dz", category: "السكن والعقار" },
  { slug: "فاتورة-ade", name: "دفع فاتورة المياه ADE الجزائرية للمياه", domain: "ade.dz", category: "فواتير المياه" },
  { slug: "فرصتي-التقدم-لعروض-العمل-wassitonline", name: "فرصتي - التقدم لعروض العمل عبر وسيط أونلاين", domain: "wassitonline.dz", category: "التشغيل" },
  { slug: "فضاء-الزبائن-enpi", name: "فضاء الزبائن - ENPI الترقية العقارية", domain: "enpi.net.dz", category: "السكن والعقار" },
  { slug: "فضاء-المفتشين-العقاريين-fadaeldjazair", name: "فضاء المفتشين العقاريين - فضائل الجزائر", domain: "fadaeldjazair.dz", category: "العقار" },
  { slug: "كاتب-الدولة-للجالية-بالخارج-mfa", name: "كاتب الدولة المكلف بالجالية الجزائرية بالخارج", domain: "mae.dz", category: "الشؤون الخارجية" },
  { slug: "مترجم-جوجل-google-translate-play", name: "مترجم جوجل - Google Translate", domain: "translate.google.com", category: "الأدوات الرقمية" },
  { slug: "هل-أنت-مسجل-services", name: "الاستعلام عن التسجيل في القوائم الانتخابية", domain: "services.interieur.gov.dz", category: "الإدارة المحلية" },
  { slug: "وكالة-الأنباء-الجزائرية-aps", name: "وكالة الأنباء الجزائرية APS", domain: "aps.dz", category: "الإعلام" },
  { slug: "ona-الديوان-الوطني-للتطهير", name: "الديوان الوطني للتطهير ONA", domain: "ona.dz", category: "البيئة والتطهير" },
  { slug: "sde-مياه-وصرف-الشرق-الكبير", name: "SDE - مياه وصرف الشرق الكبير", domain: "sde-est.dz", category: "فواتير المياه" },
  { slug: "البوابة-الجزائرية-للعمرة-bawabetelomra", name: "البوابة الجزائرية للعمرة", domain: "bawabetelomra.com", category: "الحج والعمرة" },
  { slug: "البوابة-الرسمية-للسياحة-mta", name: "البوابة الرسمية للسياحة الجزائرية MTA", domain: "mta.gov.dz", category: "السياحة" },
  { slug: "التحقق-من-صحة-وثائق-المتقاعدين", name: "التحقق من صحة وثائق المتقاعدين - CNR", domain: "cnr.dz", category: "التقاعد" },
  { slug: "التسجيل-في-تكوين-البارامبريكال-formation", name: "التسجيل في تكوين شبه الطبي (Paramédical)", domain: "formation.sante.gov.dz", category: "الصحة والتكوين" },
  { slug: "التسجيل-في-تكوين-صيانة-الهواتف-takwin", name: "التسجيل في تكوين صيانة الهواتف النقالة", domain: "mfep.gov.dz", category: "التكوين المهني" },
  { slug: "التسجيل-في-دور-الشباب-mjs", name: "التسجيل في دور الشباب - وزارة الشباب MJS", domain: "mjs.gov.dz", category: "الشباب" },
  { slug: "التسجيل-لاقتناء-سكن-lpp-enpi-net", name: "التسجيل لاقتناء سكن LPP عبر ENPI", domain: "enpi.net.dz", category: "السكن" },
  { slug: "التسجيل-لاقتناء-محل-تجاري-enpi-net", name: "التسجيل لاقتناء محل تجاري عبر ENPI", domain: "enpi.net.dz", category: "التجارة والعقار" },
  { slug: "التلفزيون-الجزائري-entv", name: "التلفزيون الجزائري ENTV - البث المباشر", domain: "entv.dz", category: "الإعلام" },
  { slug: "الحساب-البريدي-للأعمال-cashless", name: "الحساب البريدي للأعمال Cashless", domain: "cashless.poste.dz", category: "بريد الجزائر" },
  { slug: "الدليل-الهاتفي-للأمن-dgsn", name: "الدليل الهاتفي لمراكز الأمن الوطني DGSN", domain: "algeriepolice.dz", category: "الأمن" },
  { slug: "طلب-مستخرج-الوجود-بالسجن-mjustice", name: "طلب مستخرج الوجود بالسجن إبان الثورة", domain: "mjustice.dz", category: "العدل والقضاء" },
  { slug: "طلب-مستخرج-حالة-القسم-cc12-fadaeldjazair", name: "طلب مستخرج حالة القسم CC12", domain: "fadaeldjazair.dz", category: "العقار" },
  { slug: "تطبيق-تقاعدي-play", name: "تطبيق تقاعدي الرسمي - CNR", domain: "play.google.com", category: "التقاعد" },
  { slug: "تطبيق-bea-mobile-play", name: "تطبيق BEA Mobile - بنك الخليج والبحر المتوسط", domain: "play.google.com", category: "الخدمات البنكية" },
  { slug: "خرائط-جوجل-google-maps-play", name: "خرائط جوجل Google Maps - الجزائر", domain: "maps.google.com", category: "الأدوات الرقمية" },
];

// ─── دالة توليد المحتوى باستخدام Gemini API ──────────────────────
async function generateServiceContent(service) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY غير موجود');

  const prompt = `أنت خبير في الخدمات الحكومية الجزائرية الرقمية وكاتب محتوى SEO متخصص.

اكتب محتوى SEO حصرياً وفريداً باللغة العربية لصفحة الخدمة التالية:
- اسم الخدمة: ${service.name}
- القطاع: ${service.category}
- النطاق الرسمي: ${service.domain}

المطلوب (JSON فقط بدون أي نص خارجه):
{
  "description": "وصف تفصيلي 200-250 كلمة يشرح: ما هي الخدمة، الجهة المسؤولة، الفئة المستفيدة، أهميتها في حياة الجزائري، وآخر التحديثات 2026",
  "steps": ["الخطوة 1...", "الخطوة 2...", "الخطوة 3...", "الخطوة 4...", "الخطوة 5..."],
  "faqs": [
    {"q": "السؤال الأول؟", "a": "إجابة مفصلة 2-3 جمل"},
    {"q": "السؤال الثاني؟", "a": "إجابة مفصلة 2-3 جمل"},
    {"q": "السؤال الثالث؟", "a": "إجابة مفصلة 2-3 جمل"}
  ]
}

مهم: أجب بـ JSON فقط، لا تضف أي شرح قبله أو بعده.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  
  // الرد قد يحتوي على thoughtSignature أو نص مباشر
  const parts = data.candidates?.[0]?.content?.parts || [];
  let text = '';
  for (const part of parts) {
    if (part.text) text += part.text;
  }
  
  if (!text.trim()) throw new Error('لا يوجد نص في الرد');

  // استخراج JSON - يبحث عن أول { حتى آخر }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error(`لم يتم العثور على JSON - الرد: ${text.slice(0, 100)}`);
  
  const jsonStr = text.slice(start, end + 1);
  return JSON.parse(jsonStr);
}

// ─── دالة حفظ المحتوى في ملف JSON ──────────────────────────────
function saveProgress(results) {
  const outputPath = path.join(__dirname, '../../lib/services-seo-content.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`✅ تم حفظ ${Object.keys(results).length} خدمة في services-seo-content.json`);
}

// ─── البرنامج الرئيسي ──────────────────────────────────────────
async function main() {
  console.log(`🚀 بدء توليد المحتوى لـ ${NON_INDEXED_SERVICES.length} خدمة...`);
  console.log('⏳ المدة المتوقعة: 15-20 دقيقة\n');

  const outputPath = path.join(__dirname, '../../lib/services-seo-content.json');
  let results = {};

  // استئناف من حيث توقفنا
  if (fs.existsSync(outputPath)) {
    results = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    console.log(`📂 استئناف من الخدمة رقم ${Object.keys(results).length + 1}`);
  }

  let success = 0;
  let errors = 0;

  for (let i = 0; i < NON_INDEXED_SERVICES.length; i++) {
    const service = NON_INDEXED_SERVICES[i];

    // تخطي الخدمات المعالجة مسبقاً
    if (results[service.slug]) {
      console.log(`⏭️  [${i + 1}/${NON_INDEXED_SERVICES.length}] تخطي: ${service.name}`);
      continue;
    }

    console.log(`⚙️  [${i + 1}/${NON_INDEXED_SERVICES.length}] معالجة: ${service.name}`);

    try {
      const content = await generateServiceContent(service);
      results[service.slug] = {
        slug: service.slug,
        name: service.name,
        category: service.category,
        domain: service.domain,
        ...content,
        generatedAt: new Date().toISOString(),
      };
      success++;
      console.log(`   ✅ تم (${content.description.length} حرف)`);

      // حفظ كل 5 خدمات
      if (success % 5 === 0) saveProgress(results);

      // انتظار 1.5 ثانية بين الطلبات
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      errors++;
      console.error(`   ❌ خطأ: ${err.message}`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  saveProgress(results);
  console.log(`\n🎉 اكتمل التوليد!`);
  console.log(`✅ نجاح: ${success} خدمة`);
  console.log(`❌ أخطاء: ${errors} خدمة`);
}

main().catch(console.error);
