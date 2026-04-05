"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentTemplates = exports.serviceCategories = void 0;
exports.serviceCategories = [
    // 1. خدمات الدفع الإلكتروني للفواتير
    {
        id: "bills",
        nameKey: "category.bills",
        icon: "Receipt",
        color: "from-emerald-500 to-green-600",
        services: [],
        subCategories: [
            {
                nameKey: "subcategory.ade",
                services: [
                    { name: { ar: "فاتورة ADE", en: "ADE Bill Payment" }, url: "https://www.ade.dz" },
                    { name: { ar: "فضاء الزبون الجزائرية للمياه", en: "ADE Customer Space" }, url: "https://www.ade.dz/espace-client" },
                    { name: { ar: "محاكاة الفاتورة", en: "Bill Simulator" }, url: "https://www.ade.dz/simulateur" },
                    { name: { ar: "تطبيق Miyahimob", en: "Miyahimob App" }, url: "https://play.google.com/store/apps/details?id=dz.ade.miyahimob", isApp: true },
                ],
            },
            {
                nameKey: "subcategory.sonelgaz",
                services: [
                    { name: { ar: "فاتورة الكهرباء والغاز", en: "Electricity & Gas Bill" }, url: "https://www.sonelgaz.dz" },
                    { name: { ar: "تصفح فاتورتك عبر الأنترنت", en: "View Bill Online" }, url: "https://www.sonelgaz.dz/fr/espace-client" },
                    { name: { ar: "محاكاة فاتورتك", en: "Bill Simulator" }, url: "https://www.sonelgaz.dz/fr/simulateur" },
                    { name: { ar: "تطبيق Sonelgaz Mobile", en: "Sonelgaz Mobile App" }, url: "https://play.google.com/store/apps/details?id=dz.sonelgaz.mobile", isApp: true },
                ],
            },
            {
                nameKey: "subcategory.seaal",
                services: [
                    { name: { ar: "فاتورة المياه SEAAL", en: "SEAAL Water Bill" }, url: "https://www.seaal.dz" },
                    { name: { ar: "الوكالة الرقمية", en: "Digital Agency" }, url: "https://www.seaal.dz/agence-virtuelle" },
                    { name: { ar: "تطبيق SEAAL Mobile", en: "SEAAL Mobile App" }, url: "https://play.google.com/store/apps/details?id=dz.seaal.mobile", isApp: true },
                ],
            },
            {
                nameKey: "subcategory.aadl",
                services: [
                    { name: { ar: "فاتورة كراء عدل", en: "AADL Rent Bill" }, url: "https://www.aadl.com.dz" },
                    { name: { ar: "تطبيق AADL Mobile", en: "AADL Mobile App" }, url: "https://play.google.com/store/apps/details?id=dz.aadl.mobile", isApp: true },
                ],
            },
            {
                nameKey: "subcategory.opgi",
                services: [
                    { name: { ar: "فاتورة كراء OPGI", en: "OPGI Rent Bill" }, url: "https://www.opgi.dz" },
                ],
            },
        ],
    },
    // 2. تعبئة الهاتف النقال
    {
        id: "mobile",
        nameKey: "category.mobile",
        icon: "Smartphone",
        color: "from-violet-500 to-purple-600",
        services: [],
        subCategories: [
            {
                nameKey: "subcategory.mobilis",
                services: [
                    { name: { ar: "تعبئة الرصيد - موبيليس", en: "Mobilis Recharge" }, url: "https://www.mobilis.dz/flexy" },
                    { name: { ar: "تطبيق MobiSpace", en: "MobiSpace App" }, url: "https://play.google.com/store/apps/details?id=dz.mobilis.mobispace", isApp: true },
                ],
            },
            {
                nameKey: "subcategory.djezzy",
                services: [
                    { name: { ar: "تعبئة الرصيد - جيزي", en: "Djezzy Recharge" }, url: "https://www.djezzy.dz/flexy" },
                    { name: { ar: "تطبيق Djezzy", en: "Djezzy App" }, url: "https://play.google.com/store/apps/details?id=com.djezzy.selfcare", isApp: true },
                ],
            },
            {
                nameKey: "subcategory.ooredoo",
                services: [
                    { name: { ar: "تعبئة الرصيد - أوريدو", en: "Ooredoo Recharge" }, url: "https://www.ooredoo.dz/flexy" },
                    { name: { ar: "تطبيق My Ooredoo", en: "My Ooredoo App" }, url: "https://play.google.com/store/apps/details?id=com.ooredoo.selfcare", isApp: true },
                ],
            },
        ],
    },
    // 3. بريد الجزائر
    {
        id: "post",
        nameKey: "category.post",
        icon: "Mail",
        color: "from-amber-500 to-yellow-600",
        officialSite: "https://www.poste.dz",
        phone: "1530",
        services: [],
        subCategories: [
            {
                nameKey: "subcategory.postIndividual",
                services: [
                    { name: { ar: "فتح حساب بريدي", en: "Open Postal Account" }, url: "https://www.poste.dz/services/ccp" },
                    { name: { ar: "الاطلاع على رصيد CCP", en: "Check CCP Balance" }, url: "https://eccp.poste.dz" },
                    { name: { ar: "طلب البطاقة الذهبية", en: "Golden Card Request" }, url: "https://www.poste.dz/services/carte-edahabia" },
                    { name: { ar: "بريدي ويب BaridiWeb", en: "BaridiWeb" }, url: "https://baridiweb.poste.dz" },
                    { name: { ar: "تطبيق بريدي موب BaridiMob", en: "BaridiMob App" }, url: "https://play.google.com/store/apps/details?id=dz.poste.baridimob", isApp: true },
                    { name: { ar: "تتبع الطرود البريدية", en: "Track Parcels" }, url: "https://www.poste.dz/tracking" },
                    { name: { ar: "تقديم شكاوي ومتابعتها", en: "Submit Complaints" }, url: "https://reclamation.poste.dz" },
                    { name: { ar: "البحث عن مكاتب البريد", en: "Find Post Offices" }, url: "https://www.poste.dz/bureaux" },
                ],
            },
            {
                nameKey: "subcategory.postBusiness",
                services: [
                    { name: { ar: "تحقق من كشوفات الحسابات - Tikka", en: "Verify Statements - Tikka" }, url: "https://tikka.poste.dz" },
                    { name: { ar: "الحساب البريدي للأعمال - Cashless", en: "Business Account - Cashless" }, url: "https://cashless.poste.dz" },
                    { name: { ar: "خدمات التوصيل - Amantec", en: "Delivery Services - Amantec" }, url: "https://amantec.poste.dz" },
                ],
            },
        ],
    },
    // 4. اتصالات الجزائر
    {
        id: "telecom",
        nameKey: "category.telecom",
        icon: "Wifi",
        color: "from-sky-500 to-blue-600",
        officialSite: "https://www.algerietelecom.dz",
        phone: "12",
        services: [],
        subCategories: [
            {
                nameKey: "subcategory.telecomPayment",
                services: [
                    { name: { ar: "تسديد فواتير الهاتف الثابت", en: "Pay Fixed Phone Bills" }, url: "https://www.algerietelecom.dz/paiement" },
                    { name: { ar: "تعبئة حساب الانترنت", en: "Internet Account Recharge" }, url: "https://www.algerietelecom.dz/recharge" },
                    { name: { ar: "تعبئة IDOOM 4G LTE", en: "IDOOM 4G LTE Recharge" }, url: "https://www.algerietelecom.dz/idoom4g" },
                ],
            },
            {
                nameKey: "subcategory.telecomServices",
                services: [
                    { name: { ar: "طلب التحويل للألياف البصرية", en: "Fiber Optic Transfer" }, url: "https://ftth.algerietelecom.dz" },
                    { name: { ar: "فضاء الزبون", en: "Customer Space" }, url: "https://espace.algerietelecom.dz" },
                    { name: { ar: "الإبلاغ عن عطب", en: "Report Issue" }, url: "https://www.algerietelecom.dz/signaler" },
                    { name: { ar: "تطبيق My IDOOM", en: "My IDOOM App" }, url: "https://play.google.com/store/apps/details?id=dz.algerietelecom.myidoom", isApp: true },
                ],
            },
        ],
    },
    // 5. التربية والتعليم
    {
        id: "education",
        nameKey: "category.education",
        icon: "GraduationCap",
        color: "from-blue-500 to-indigo-600",
        officialSite: "https://www.education.gov.dz",
        phone: "+213 23 52 72 27",
        services: [],
        subCategories: [
            {
                nameKey: "subcategory.eduTeacher",
                services: [
                    { name: { ar: "المنصة الرقمية للأساتذة", en: "Teacher Platform" }, url: "https://ostad.education.gov.dz" },
                    { name: { ar: "تقييم المكتسبات", en: "Learning Assessment" }, url: "https://evaluation.education.gov.dz" },
                    { name: { ar: "توظيف الأساتذة المتعاقدين", en: "Contract Teacher Recruitment" }, url: "https://tawdif.education.gov.dz" },
                ],
            },
            {
                nameKey: "subcategory.eduParent",
                services: [
                    { name: { ar: "فضاء أولياء التلاميذ", en: "Parents Portal" }, url: "https://awlyaa.education.gov.dz" },
                    { name: { ar: "تحضير الفروض والاختبارات", en: "Exam Preparation" }, url: "https://dzexams.com" },
                ],
            },
            {
                nameKey: "subcategory.eduDistance",
                services: [
                    { name: { ar: "التسجيل في التعليم عن بعد", en: "Distance Learning Registration" }, url: "https://onefd.edu.dz" },
                    { name: { ar: "شهادة إثبات المستوى", en: "Level Certificate" }, url: "https://onefd.edu.dz/attestation" },
                ],
            },
            {
                nameKey: "subcategory.eduExams",
                services: [
                    { name: { ar: "تسجيل شهادة التعليم المتوسط BEM", en: "BEM Registration" }, url: "https://bem.onec.dz" },
                    { name: { ar: "تسجيل شهادة البكالوريا BAC", en: "BAC Registration" }, url: "https://bac.onec.dz" },
                    { name: { ar: "الدفع الإلكتروني لمستحقات الامتحانات", en: "Exam Fee Payment" }, url: "https://tarbiapay.education.gov.dz" },
                ],
            },
            {
                nameKey: "subcategory.eduResults",
                services: [
                    { name: { ar: "نتائج شهادة التعليم المتوسط", en: "BEM Results" }, url: "https://bem.onec.dz/resultats" },
                    { name: { ar: "نتائج شهادة البكالوريا", en: "BAC Results" }, url: "https://bac.onec.dz/resultats" },
                ],
            },
        ],
    },
    // 6. الخدمات الجامعية
    {
        id: "university",
        nameKey: "category.university",
        icon: "School",
        color: "from-indigo-500 to-violet-600",
        officialSite: "https://www.mesrs.dz",
        phone: "+213 23 93 91 32",
        services: [
            { name: { ar: "التسجيل الأولي الجامعي", en: "University Pre-registration" }, url: "https://www.orientation.esi.dz" },
            { name: { ar: "منصة Progres", en: "Progres Platform" }, url: "https://progres.mesrs.dz" },
            { name: { ar: "دفع حقوق إعادة التسجيل", en: "Re-registration Fee Payment" }, url: "https://progres.mesrs.dz/paiement" },
            { name: { ar: "دفع حقوق الإيواء", en: "Accommodation Fee Payment" }, url: "https://progres.mesrs.dz/hebergement" },
            { name: { ar: "طلبات الإيواء", en: "Accommodation Requests" }, url: "https://progres.mesrs.dz/demande-hebergement" },
            { name: { ar: "تطبيق Progres", en: "Progres App" }, url: "https://play.google.com/store/apps/details?id=dz.mesrs.progres", isApp: true },
            { name: { ar: "التحويلات الجامعية", en: "University Transfers" }, url: "https://progres.mesrs.dz/transfert" },
        ],
    },
    // 7. التكوين والتعليم المهنيين
    {
        id: "vocational",
        nameKey: "category.vocational",
        icon: "Wrench",
        color: "from-orange-500 to-red-600",
        officialSite: "https://www.mfep.gov.dz",
        phone: "+213 23 25 52 66",
        services: [
            { name: { ar: "التسجيل في التكوين المهني", en: "Vocational Training Registration" }, url: "https://mihnati.mfep.gov.dz" },
            { name: { ar: "تسجيلات الامتحانات المهنية", en: "Professional Exam Registration" }, url: "https://dfep.mfep.gov.dz" },
        ],
    },
    // 8. خدمات الإدارة المحلية
    {
        id: "interior",
        nameKey: "category.interior",
        icon: "Building2",
        color: "from-slate-500 to-gray-600",
        officialSite: "https://www.interieur.gov.dz",
        phone: "1100",
        services: [
            { name: { ar: "استخراج شهادة الميلاد", en: "Birth Certificate" }, url: "https://etatcivil.interieur.gov.dz" },
            { name: { ar: "استخراج عقد الزواج", en: "Marriage Certificate" }, url: "https://etatcivil.interieur.gov.dz/mariage" },
            { name: { ar: "استخراج شهادة الميلاد S12", en: "S12 Birth Certificate" }, url: "https://etatcivil.interieur.gov.dz/s12" },
            { name: { ar: "استخراج شهادة الوفاة", en: "Death Certificate" }, url: "https://etatcivil.interieur.gov.dz/deces" },
            { name: { ar: "طلب بطاقة التعريف البيومترية", en: "Biometric ID Card" }, url: "https://passeport.interieur.gov.dz/cni" },
            { name: { ar: "طلب جواز السفر البيومتري", en: "Biometric Passport" }, url: "https://passeport.interieur.gov.dz" },
            { name: { ar: "الشباك عن بعد", en: "Remote Counter" }, url: "https://guichet.interieur.gov.dz" },
            { name: { ar: "طلب منحة رمضان", en: "Ramadan Solidarity Grant" }, url: "https://minha.interieur.gov.dz" },
            { name: { ar: "العرائض والشكاوى", en: "Petitions & Complaints" }, url: "https://reclamation.interieur.gov.dz" },
        ],
    },
    // 9. وكالة عدل AADL
    {
        id: "aadl",
        nameKey: "category.aadl",
        icon: "Home",
        color: "from-teal-500 to-emerald-600",
        officialSite: "https://www.aadl.com.dz",
        phone: "3040",
        services: [
            { name: { ar: "تسجيل الدخول لمنصة عدل 3", en: "AADL 3 Platform Login" }, url: "https://aadl3.aadl.com.dz" },
            { name: { ar: "دفع فاتورة تكاليف الكراء", en: "Rent Payment" }, url: "https://www.aadl.com.dz/paiement" },
            { name: { ar: "تطبيق AADL Mobile", en: "AADL Mobile App" }, url: "https://play.google.com/store/apps/details?id=dz.aadl.mobile", isApp: true },
        ],
    },
    // 10. المؤسسة الوطنية للترقية العقارية ENPI
    {
        id: "enpi",
        nameKey: "category.enpi",
        icon: "Building",
        color: "from-cyan-500 to-teal-600",
        officialSite: "https://www.enpi.dz",
        phone: "+21323536722",
        services: [
            { name: { ar: "التسجيل لاقتناء سكن LPP", en: "LPP Housing Registration" }, url: "https://lpp.enpi.dz" },
            { name: { ar: "التسجيل لاقتناء سكن LPL", en: "LPL Housing Registration" }, url: "https://lpl.enpi.dz" },
            { name: { ar: "التسجيل لاقتناء محل تجاري", en: "Commercial Property Registration" }, url: "https://local.enpi.dz" },
            { name: { ar: "فضاء الزبائن", en: "Customer Space" }, url: "https://espace.enpi.dz" },
        ],
    },
    // 11. خدمات جبائية إلكترونية
    {
        id: "tax",
        nameKey: "category.tax",
        icon: "Banknote",
        color: "from-green-500 to-emerald-600",
        officialSite: "https://www.mf.gov.dz",
        phone: "+21321595252",
        services: [],
        subCategories: [
            {
                nameKey: "subcategory.taxStamps",
                services: [
                    { name: { ar: "إقتناء حقوق الطابع الجبائي", en: "Fiscal Stamp Purchase" }, url: "https://timbres.mf.gov.dz" },
                    { name: { ar: "إعادة إقتناء حقوق الطابع", en: "Stamp Repurchase" }, url: "https://timbres.mf.gov.dz/repurchase" },
                ],
            },
            {
                nameKey: "subcategory.taxVignette",
                services: [
                    { name: { ar: "إقتناء قسيمة السيارات", en: "Vehicle Tax Vignette" }, url: "https://vignette.mf.gov.dz" },
                    { name: { ar: "إعادة إصدار قسيمة السيارات", en: "Vignette Reissue" }, url: "https://vignette.mf.gov.dz/reissue" },
                ],
            },
        ],
    },
    // 12. خدمات مع العدالة
    {
        id: "justice",
        nameKey: "category.justice",
        icon: "Scale",
        color: "from-amber-500 to-orange-600",
        officialSite: "https://www.mjustice.dz",
        phone: "1078",
        services: [
            { name: { ar: "استخراج صحيفة السوابق القضائية", en: "Criminal Record (Casier Judiciaire)" }, url: "https://casier.mjustice.dz" },
            { name: { ar: "استخراج الجنسية الجزائرية", en: "Algerian Nationality Certificate" }, url: "https://nationalite.mjustice.dz" },
            { name: { ar: "طلب مستخرج الوجود بالسجن إبان الثورة", en: "Revolution Prison Record" }, url: "https://www.mjustice.dz/prison-revolution" },
            { name: { ar: "طلب نسخة من عقود المحاكم", en: "Court Document Copy" }, url: "https://www.mjustice.dz/documents" },
            { name: { ar: "رخص الاتصال بالمحبوسين", en: "Prisoner Visitation Permit" }, url: "https://www.mjustice.dz/visite" },
            { name: { ar: "النيابة الإلكترونية - تسجيل شكوى", en: "E-Prosecution - File Complaint" }, url: "https://e-niyaba.mjustice.dz" },
            { name: { ar: "النيابة الإلكترونية - متابعة شكوى", en: "E-Prosecution - Track Complaint" }, url: "https://e-niyaba.mjustice.dz/suivi" },
            { name: { ar: "تطبيق AdalaTic", en: "AdalaTic App" }, url: "https://play.google.com/store/apps/details?id=dz.mjustice.adalatic", isApp: true },
        ],
    },
    // 13. الصفقات العمومية
    {
        id: "publicContracts",
        nameKey: "category.publicContracts",
        icon: "FileText",
        color: "from-purple-500 to-violet-600",
        officialSite: "https://www.mf.gov.dz",
        phone: "+21321595151",
        services: [
            { name: { ar: "بوابة الصفقات العمومية", en: "Public Contracts Portal" }, url: "https://baosem.mf.gov.dz" },
            { name: { ar: "صندوق ضمان الصفقات العمومية", en: "Contract Guarantee Fund" }, url: "https://cgmp.mf.gov.dz" },
            { name: { ar: "محاكاة ضمان الصفقات", en: "Contract Guarantee Simulator" }, url: "https://cgmp.mf.gov.dz/simulation" },
        ],
    },
    // 14. خدمات الأملاك العقارية
    {
        id: "realEstate",
        nameKey: "category.realEstate",
        icon: "Landmark",
        color: "from-stone-500 to-zinc-600",
        officialSite: "https://www.dgdn.dz",
        phone: "+213 21 59 51 51",
        services: [],
        subCategories: [
            {
                nameKey: "subcategory.realEstatePublic",
                services: [
                    { name: { ar: "مستخرجات الوثائق العقارية", en: "Property Document Extracts" }, url: "https://tasjil.dgdn.dz" },
                    { name: { ar: "طلب مستخرج المصفوفة المسحية CC11", en: "CC11 Cadastral Extract" }, url: "https://tasjil.dgdn.dz/cc11" },
                    { name: { ar: "طلب مستخرج حالة القسم CC12", en: "CC12 Section Extract" }, url: "https://tasjil.dgdn.dz/cc12" },
                    { name: { ar: "طلب الدفتر العقاري", en: "Property Register Request" }, url: "https://tasjil.dgdn.dz/livret" },
                    { name: { ar: "متابعة طلب الدفتر العقاري", en: "Track Register Request" }, url: "https://tasjil.dgdn.dz/suivi" },
                ],
            },
            {
                nameKey: "subcategory.realEstatePro",
                services: [
                    { name: { ar: "فضاء المحافظ العقاري", en: "Property Registrar Space" }, url: "https://conservateur.dgdn.dz" },
                    { name: { ar: "فضاء المفتشين العقاريين", en: "Property Inspector Space" }, url: "https://inspecteur.dgdn.dz" },
                    { name: { ar: "فضاء الموثقين", en: "Notary Space" }, url: "https://notaire.dgdn.dz" },
                ],
            },
        ],
    },
    // 15. وزارة الشؤون الخارجية
    {
        id: "foreignAffairs",
        nameKey: "category.foreignAffairs",
        icon: "Globe",
        color: "from-blue-600 to-indigo-700",
        officialSite: "https://www.mae.gov.dz",
        phone: "+213 21 50 45 45",
        services: [
            { name: { ar: "ترحيل الوثائق للتصديق", en: "Document Apostille" }, url: "https://apostille.mae.gov.dz" },
            { name: { ar: "كاتب الدولة للجالية بالخارج", en: "Diaspora Secretary" }, url: "https://jaliya.mae.gov.dz" },
            { name: { ar: "الممثليات الدبلوماسية الجزائرية", en: "Algerian Embassies" }, url: "https://www.mae.gov.dz/ambassades" },
            { name: { ar: "الممثليات الأجنبية بالجزائر", en: "Foreign Embassies in Algeria" }, url: "https://www.mae.gov.dz/ambassades-etrangeres" },
        ],
    },
    // 16. خدمات الضمان الاجتماعي
    {
        id: "socialSecurity",
        nameKey: "category.socialSecurity",
        icon: "Shield",
        color: "from-rose-500 to-pink-600",
        officialSite: "https://www.mtess.gov.dz",
        phone: "3010",
        services: [],
        subCategories: [
            {
                nameKey: "subcategory.cnas",
                services: [
                    { name: { ar: "شهادة الانتساب CNAS", en: "CNAS Membership Certificate" }, url: "https://telemactik.cnas.dz/attestation" },
                    { name: { ar: "شهادة عدم الانتساب CNAS", en: "CNAS Non-Membership Certificate" }, url: "https://telemactik.cnas.dz/non-affiliation" },
                    { name: { ar: "تطبيق فضاء الهناء", en: "El Hanaa App" }, url: "https://play.google.com/store/apps/details?id=dz.cnas.elhanaa", isApp: true },
                ],
            },
            {
                nameKey: "subcategory.casnos",
                services: [
                    { name: { ar: "شهادة عدم الانتساب CASNOS", en: "CASNOS Non-Membership" }, url: "https://www.casnos.com.dz/attestation" },
                    { name: { ar: "شهادة الانتساب CASNOS", en: "CASNOS Membership" }, url: "https://www.casnos.com.dz/affiliation" },
                    { name: { ar: "طلب الانتساب CASNOS", en: "CASNOS Registration" }, url: "https://www.casnos.com.dz/demande" },
                ],
            },
            {
                nameKey: "subcategory.cnr",
                services: [
                    { name: { ar: "تطبيق المتقاعد CNR", en: "CNR Retiree App" }, url: "https://play.google.com/store/apps/details?id=dz.cnr.retraite", isApp: true },
                ],
            },
        ],
    },
    // 17. الخدمات الصحية
    {
        id: "health",
        nameKey: "category.health",
        icon: "Heart",
        color: "from-red-500 to-rose-600",
        officialSite: "https://www.sante.gov.dz",
        phone: "+213 23 05 93 85",
        services: [
            { name: { ar: "منصة التكوين - الشبه طبي", en: "Paramedical Training" }, url: "https://formation.sante.gov.dz" },
            { name: { ar: "العيادة الرقمية", en: "Digital Clinic" }, url: "https://clinique.sante.gov.dz" },
            { name: { ar: "تطبيق أطباء الجزائر", en: "Algeria Doctors App" }, url: "https://play.google.com/store/apps/details?id=dz.doctors", isApp: true },
            { name: { ar: "تطبيق بنك الدم الجزائري", en: "Algeria Blood Bank App" }, url: "https://play.google.com/store/apps/details?id=dz.bloodbank", isApp: true },
        ],
    },
    // 18. فحص المركبات
    {
        id: "vehicles",
        nameKey: "category.vehicles",
        icon: "Car",
        color: "from-zinc-500 to-slate-600",
        officialSite: "https://www.mem.gov.dz",
        phone: "+21321488522",
        services: [
            { name: { ar: "مركبتي لفحص المركبات", en: "Vehicle Inspection - Markabati" }, url: "https://markabati.mem.gov.dz" },
            { name: { ar: "تصاريح الاستيراد", en: "Import Permits" }, url: "https://import.mem.gov.dz" },
            { name: { ar: "خلية الاستماع", en: "Support Hotline" }, url: "https://www.mem.gov.dz/contact" },
        ],
    },
    // 19. النقل وحجز التذاكر
    {
        id: "transport",
        nameKey: "category.transport",
        icon: "Plane",
        color: "from-sky-500 to-cyan-600",
        officialSite: "https://www.mt.gov.dz",
        phone: "+21323059385",
        services: [
            { name: { ar: "حجز الخطوط الجوية الجزائرية", en: "Air Algerie Booking" }, url: "https://www.airalgerie.dz" },
            { name: { ar: "حجز طيران الطاسيلي", en: "Tassili Airlines Booking" }, url: "https://www.tassiliairlines.dz" },
            { name: { ar: "تتبع حركة الملاحة الجوية", en: "Flight Tracking" }, url: "https://www.flightradar24.com/35.72,3.25/7" },
            { name: { ar: "تطبيق تواصل للترامواي", en: "Tawasol Tramway App" }, url: "https://play.google.com/store/apps/details?id=dz.tramway.tawasol", isApp: true },
            { name: { ar: "تطبيق محطتي SOGRAL", en: "Mahattati SOGRAL App" }, url: "https://play.google.com/store/apps/details?id=dz.sogral.mahattati", isApp: true },
            { name: { ar: "النقل البحري للمسافرين", en: "Maritime Passenger Transport" }, url: "https://www.entmv.dz" },
            { name: { ar: "مواقيت القطارات SNTF", en: "SNTF Train Schedules" }, url: "https://www.sntf.dz" },
            { name: { ar: "تطبيق ETUSA Mob", en: "ETUSA Mob App" }, url: "https://play.google.com/store/apps/details?id=dz.etusa.mob", isApp: true },
        ],
    },
    // 20. الوكالة الوطنية للتشغيل ANEM
    {
        id: "employment",
        nameKey: "category.employment",
        icon: "Briefcase",
        color: "from-violet-500 to-purple-600",
        officialSite: "https://www.anem.dz",
        phone: "3005",
        services: [
            { name: { ar: "التسجيل في منحة البطالة", en: "Unemployment Allowance Registration" }, url: "https://minha.anem.dz" },
            { name: { ar: "تمديد طلب العمل", en: "Job Request Extension" }, url: "https://www.anem.dz/extension" },
            { name: { ar: "فرصتي - التقدم لعروض العمل", en: "Forsati - Job Applications" }, url: "https://forsati.anem.dz" },
            { name: { ar: "فرص عمل وإعلانات", en: "Job Opportunities" }, url: "https://www.anem.dz/offres" },
            { name: { ar: "تطبيق ANEM-Dz", en: "ANEM-Dz App" }, url: "https://play.google.com/store/apps/details?id=dz.anem.app", isApp: true },
        ],
    },
    // 21. خدمات وزارة التجارة
    {
        id: "commerce",
        nameKey: "category.commerce",
        icon: "ShoppingBag",
        color: "from-fuchsia-500 to-pink-600",
        officialSite: "https://www.commerce.gov.dz",
        phone: "1020",
        services: [
            { name: { ar: "الصندوق الخاص لترقية الصادرات", en: "Export Promotion Fund" }, url: "https://fspe.commerce.gov.dz" },
            { name: { ar: "جباية تيك Jibayatic", en: "Jibayatic Declaration" }, url: "https://jibayatic.mf.gov.dz" },
            { name: { ar: "خلية الإصغاء", en: "Consumer Hotline" }, url: "https://www.commerce.gov.dz/contact" },
        ],
    },
    // 22. الجمارك الجزائرية
    {
        id: "customs",
        nameKey: "category.customs",
        icon: "Package",
        color: "from-amber-600 to-orange-700",
        officialSite: "https://www.douane.gov.dz",
        phone: "1023",
        services: [
            { name: { ar: "المعلومة التعريفية الملزمة RTC", en: "Binding Tariff Information" }, url: "https://rtc.douane.gov.dz" },
            { name: { ar: "خلية الاستماع للجمارك", en: "Customs Support Hotline" }, url: "https://www.douane.gov.dz/contact" },
        ],
    },
    // 23. المقاول الذاتي
    {
        id: "autoEntrepreneur",
        nameKey: "category.autoEntrepreneur",
        icon: "UserCheck",
        color: "from-emerald-500 to-teal-600",
        officialSite: "https://ae.andi.dz",
        phone: "1071",
        services: [
            { name: { ar: "طلب بطاقة المقاول الذاتي", en: "Auto-Entrepreneur Card Request" }, url: "https://ae.andi.dz" },
        ],
    },
    // 24. الحج والعمرة
    {
        id: "hajj",
        nameKey: "category.hajj",
        icon: "Moon",
        color: "from-emerald-600 to-green-700",
        officialSite: "https://www.onpo.dz",
        phone: "+213 23 77 78 62",
        services: [
            { name: { ar: "التسجيل في قرعة الحج", en: "Hajj Lottery Registration" }, url: "https://hajj.onpo.dz" },
            { name: { ar: "البوابة الجزائرية للحج", en: "Algeria Hajj Portal" }, url: "https://www.onpo.dz/hajj" },
            { name: { ar: "البوابة الجزائرية للعمرة", en: "Algeria Umrah Portal" }, url: "https://www.onpo.dz/omra" },
        ],
    },
    // 25. ترقية الاستثمار
    {
        id: "investment",
        nameKey: "category.investment",
        icon: "TrendingUp",
        color: "from-blue-500 to-cyan-600",
        officialSite: "https://www.aapi.dz",
        phone: "+213 23 83 30 30",
        services: [
            { name: { ar: "التسجيل في وكالة ترقية الاستثمار", en: "Investment Agency Registration" }, url: "https://www.aapi.dz/inscription" },
            { name: { ar: "بوابة المستثمر", en: "Investor Portal" }, url: "https://investor.aapi.dz" },
            { name: { ar: "حامل مشروع", en: "Project Holder" }, url: "https://projet.aapi.dz" },
        ],
    },
    // 26. السلطة الوطنية للانتخابات
    {
        id: "elections",
        nameKey: "category.elections",
        icon: "Vote",
        color: "from-red-600 to-rose-700",
        officialSite: "https://www.anie.dz",
        phone: "+21321376874",
        services: [
            { name: { ar: "التسجيل في القوائم الانتخابية", en: "Electoral Registration" }, url: "https://inscription.anie.dz" },
            { name: { ar: "طلب نسخة من بطاقة الناخب", en: "Voter Card Copy" }, url: "https://carte.anie.dz" },
            { name: { ar: "هل أنت مسجل؟", en: "Check Registration" }, url: "https://verification.anie.dz" },
            { name: { ar: "طلب تغيير مكان الإقامة", en: "Change Residence" }, url: "https://changement.anie.dz" },
        ],
    },
    // 27. الأمن الوطني
    {
        id: "police",
        nameKey: "category.police",
        icon: "ShieldCheck",
        color: "from-blue-700 to-indigo-800",
        officialSite: "https://www.dgsn.dz",
        phone: "1584",
        services: [
            { name: { ar: "التصريح بضياع الوثائق", en: "Lost Document Declaration" }, url: "https://perte.dgsn.dz" },
            { name: { ar: "إدلاء بشهادة", en: "Give Testimony" }, url: "https://temoignage.dgsn.dz" },
            { name: { ar: "بحث في فائدة العائلات", en: "Family Search" }, url: "https://recherche.dgsn.dz" },
            { name: { ar: "الدليل الهاتفي", en: "Phone Directory" }, url: "https://annuaire.dgsn.dz" },
            { name: { ar: "تطبيق ألو الشرطة", en: "Allo Police App" }, url: "https://play.google.com/store/apps/details?id=dz.dgsn.allopolice", isApp: true },
        ],
    },
    // 28. سلطة ضبط البريد والاتصالات
    {
        id: "arpce",
        nameKey: "category.arpce",
        icon: "Radio",
        color: "from-indigo-500 to-violet-600",
        officialSite: "https://www.arpce.dz",
        phone: "3333",
        services: [
            { name: { ar: "طلب خدمة عبر الموقع", en: "Online Service Request" }, url: "https://www.arpce.dz/demande" },
            { name: { ar: "إيداع شكوى", en: "File Complaint" }, url: "https://reclamation.arpce.dz" },
            { name: { ar: "دفع فاتورة سلطة الضبط", en: "ARPCE Bill Payment" }, url: "https://paiement.arpce.dz" },
            { name: { ar: "التحقق من الشرائح SIM المسجلة *254#", en: "Check Registered SIMs *254#" }, url: "tel:*254%23" },
            { name: { ar: "تطبيق جودتي", en: "Jawdati App" }, url: "https://play.google.com/store/apps/details?id=dz.arpce.jawdati", isApp: true },
        ],
    },
    // 29. التأمينات
    {
        id: "insurance",
        nameKey: "category.insurance",
        icon: "ShieldPlus",
        color: "from-teal-500 to-cyan-600",
        services: [
            { name: { ar: "الشركة الجزائرية للتأمينات SAA", en: "SAA Insurance" }, url: "https://www.saa.dz", phone: "+213 21 22 50 00" },
            { name: { ar: "شركة CAAR للتأمين", en: "CAAR Insurance" }, url: "https://www.caar.dz", phone: "+213 22 16 32 07" },
            { name: { ar: "شركة CAARAMA للتأمين", en: "CAARAMA Insurance" }, url: "https://www.caarama.dz" },
            { name: { ar: "ترست الجزائر للتأمينات", en: "Trust Algeria Insurance" }, url: "https://www.trustalgeria.com" },
            { name: { ar: "أليانس للتأمينات", en: "Alliance Assurances" }, url: "https://www.allianceassurances.com.dz", phone: "3315" },
            { name: { ar: "أكسا للتأمينات AXA", en: "AXA Algeria" }, url: "https://www.axa.dz" },
            { name: { ar: "سلامة للتأمينات", en: "Salama Assurances" }, url: "https://www.salama.dz" },
        ],
    },
    // 30. الخدمات البنكية
    {
        id: "banking",
        nameKey: "category.banking",
        icon: "Landmark",
        color: "from-emerald-600 to-green-700",
        services: [],
        subCategories: [
            {
                nameKey: "subcategory.publicBanks",
                services: [
                    { name: { ar: "بنك الجزائر الخارجي BEA", en: "BEA Bank" }, url: "https://www.bea.dz", phone: "+213 21 43 60 00" },
                    { name: { ar: "البنك الوطني الجزائري BNA", en: "BNA Bank" }, url: "https://www.bna.dz", phone: "3020" },
                    { name: { ar: "بنك الفلاحة والتنمية الريفية BADR", en: "BADR Bank" }, url: "https://www.badr-bank.dz" },
                    { name: { ar: "القرض الشعبي الجزائري CPA", en: "CPA Bank" }, url: "https://www.cpa-bank.dz" },
                    { name: { ar: "الصندوق الوطني للتوفير CNEP", en: "CNEP Bank" }, url: "https://www.cnepbanque.dz" },
                    { name: { ar: "البنك الوطني للإسكان BNH", en: "BNH Bank" }, url: "https://www.bnh.dz" },
                ],
            },
            {
                nameKey: "subcategory.privateBanks",
                services: [
                    { name: { ar: "بنك الخليج الجزائر AGB", en: "AGB Bank" }, url: "https://www.agb.dz" },
                    { name: { ar: "بنك ABC الجزائر", en: "ABC Bank Algeria" }, url: "https://www.bank-abc.com/dz" },
                    { name: { ar: "البنك العربي", en: "Arab Bank" }, url: "https://www.arabbank.dz" },
                    { name: { ar: "سوسيتي جنرال الجزائر", en: "Société Générale Algeria" }, url: "https://www.societegenerale.dz" },
                    { name: { ar: "بنك BNP باريبا", en: "BNP Paribas Algeria" }, url: "https://www.bnpparibas.dz" },
                ],
            },
        ],
    },
];
exports.documentTemplates = [
    { id: "complaint", nameKey: "template.complaint", icon: "FileWarning" },
    { id: "request", nameKey: "template.request", icon: "FileText" },
    { id: "appeal", nameKey: "template.appeal", icon: "Gavel" },
    { id: "certificate", nameKey: "template.certificate", icon: "Award" },
    { id: "authorization", nameKey: "template.authorization", icon: "Shield" },
    { id: "resignation", nameKey: "template.resignation", icon: "UserMinus" },
];
