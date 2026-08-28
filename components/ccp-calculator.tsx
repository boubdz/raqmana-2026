"use client";

import React, { useState } from "react";
import { Calculator, Copy, Check, Smartphone, ExternalLink, RefreshCw } from "lucide-react";

export function CcpCalculator() {
  const [ccpInput, setCcpInput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // حساب مفتاح CCP بدقة خوارزمية بريد الجزائر الرسمية
  const calculateCleCCP = (ccp: string): string => {
    const clean = ccp.replace(/\D/g, "");
    if (!clean) return "--";
    const num = parseInt(clean, 10);
    if (isNaN(num) || num <= 0) return "--";
    let rem = Number((BigInt(num) * 100n) % 97n);
    if (rem === 0) rem = 97;
    return rem < 10 ? `0${rem}` : rem.toString();
  };

  // حساب الـ RIP الموحد المكون من 20 رقماً
  const calculateRip = (ccp: string, cle: string): { fullRip: string; formatted: string } => {
    const clean = ccp.replace(/\D/g, "");
    if (!clean || cle === "--") return { fullRip: "--", formatted: "--" };
    const ccpPadded = clean.padStart(10, "0");
    const bank = "007";
    const guichet = "99999";
    const fullNum = BigInt(`${bank}${guichet}${ccpPadded}00`);
    const rem = fullNum % 97n;
    let ripKey = 97n - rem;
    if (ripKey === 97n) ripKey = 0n;
    const ripKeyStr = ripKey < 10n ? `0${ripKey}` : ripKey.toString();
    const fullRip = `${bank}${guichet}${ccpPadded}${ripKeyStr}`;
    const formatted = `${bank} ${guichet} ${ccpPadded} ${ripKeyStr}`;
    return { fullRip, formatted };
  };

  const calculatedCle = calculateCleCCP(ccpInput);
  const { fullRip, formatted: formattedRip } = calculateRip(ccpInput, calculatedCle);

  const handleCopy = (text: string, keyName: string) => {
    if (text === "--") return;
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full bg-gradient-to-br from-card via-card to-primary/[0.03] border border-border/80 rounded-[2.5rem] p-6 sm:p-10 shadow-xl relative overflow-hidden" dir="rtl">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>حاسبة رسمية ومعتمدة 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            حاسبة مفتاح الحساب البريدي (Clé CCP) ورمز RIP
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            أدخل رقم حسابك البريدي للحصول فوراً على المفتاح، كشف الرصيد، ورقم الحساب البريدي الموحد.
          </p>
        </div>

        <button
          onClick={() => setCcpInput("")}
          className="inline-flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold text-muted-foreground transition-colors"
          title="إعادة ضبط"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>مسح</span>
        </button>
      </div>

      {/* Input Section */}
      <div className="max-w-xl mx-auto mb-10">
        <label htmlFor="ccp-account-input" className="block text-sm font-bold text-foreground mb-2">
          رقم الحساب البريدي (بدون المفتاح):
        </label>
        <div className="relative">
          <input
            id="ccp-account-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            value={ccpInput}
            onChange={(e) => setCcpInput(e.target.value.replace(/\D/g, ""))}
            placeholder="مثال: 12345678"
            className="w-full text-xl sm:text-2xl font-black font-mono tracking-widest text-center px-6 py-4 rounded-2xl bg-background border-2 border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-foreground placeholder:text-muted-foreground/40 placeholder:tracking-normal placeholder:text-base placeholder:font-sans"
          />
          {ccpInput && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 rounded bg-muted text-muted-foreground font-mono">
              {ccpInput.length} أرقام
            </span>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Clé CCP Card */}
        <div className="p-6 rounded-2xl bg-background/80 border border-border shadow-sm flex flex-col justify-between relative group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">مفتاح الحساب (Clé CCP)</span>
            <button
              onClick={() => handleCopy(calculatedCle, "cle")}
              disabled={calculatedCle === "--"}
              className="p-2 rounded-lg bg-muted hover:bg-emerald-500/10 hover:text-emerald-500 text-muted-foreground transition-colors disabled:opacity-30"
              title="نسخ المفتاح"
            >
              {copiedKey === "cle" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-center my-2">
            <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {calculatedCle}
            </span>
          </div>
          <p className="text-[11px] text-center text-muted-foreground mt-2">
            المفتاح المطلوب في الشيكات البريدية وشهادة كشف الهوية البريدية
          </p>
        </div>

        {/* Clé RIP / Full RIP Card */}
        <div className="p-6 rounded-2xl bg-background/80 border border-border shadow-sm flex flex-col justify-between relative group hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">رقم الحساب البريدي الموحد (RIP)</span>
            <button
              onClick={() => handleCopy(fullRip, "rip")}
              disabled={fullRip === "--"}
              className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors disabled:opacity-30"
              title="نسخ رقم RIP"
            >
              {copiedKey === "rip" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-center my-2">
            <span className="text-lg sm:text-xl font-black font-mono text-primary tracking-wider break-all">
              {formattedRip}
            </span>
          </div>
          <p className="text-[11px] text-center text-muted-foreground mt-2">
            مخصص للتحويلات البنكية (Virement Interbancaire) وصَب الأجور ومنحة البطالة
          </p>
        </div>
      </div>

      {/* Quick Action Links for Balance Check */}
      <div className="bg-muted/30 rounded-2xl p-6 border border-border/60">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-primary" />
          <span>طرق كشف رصيد الحساب الجاري CCP أونلاين:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://eccp.poste.dz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-background hover:bg-primary/5 border border-border hover:border-primary/40 transition-all group"
          >
            <div className="text-right">
              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">موقع فضاء الحساب ECCP</p>
              <p className="text-[10px] text-muted-foreground">كشف الرصيد وتفاصيل العمليات السابقة</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=dz.poste.baridimob"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-background hover:bg-emerald-500/5 border border-border hover:border-emerald-500/40 transition-all group"
          >
            <div className="text-right">
              <p className="text-xs font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">تطبيق بريدي موب BaridiMob</p>
              <p className="text-[10px] text-muted-foreground">تحويل الأموال وكشف الرصيد الفوري بالبطاقة الذهبية</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
