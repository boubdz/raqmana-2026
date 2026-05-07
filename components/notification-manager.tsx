"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

export function NotificationManager() {
  const { language } = useLanguage();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;
    
    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      // Simulate a welcome notification
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(
          language === "ar" ? "تم تفعيل التنبيهات بنجاح" : "Notifications Activated",
          {
            body: language === "ar" 
              ? "ستصلك الآن تنبيهات بخصوص مستجدات الخدمات الرقمية في الجزائر." 
              : "You will now receive updates about digital services in Algeria.",
            icon: "/icon-192x192.png",
            badge: "/favicon-32x32.png",
            vibrate: [200, 100, 200],
          }
        );
      }
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center">
      {permission === "granted" ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
            {language === "ar" ? "التنبيهات نشطة" : "Alerts Active"}
          </span>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={requestPermission}
          disabled={permission === "denied"}
          className={`h-10 px-4 rounded-full border border-black/5 dark:border-white/5 transition-all ${
            permission === "denied" ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/10 hover:text-primary"
          }`}
          title={language === "ar" ? "تفعيل التنبيهات" : "Enable Notifications"}
        >
          {permission === "denied" ? (
            <BellOff className="h-4 w-4" />
          ) : (
            <div className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
          )}
          <span className="text-[10px] font-black uppercase tracking-widest ms-2 hidden lg:block">
            {language === "ar" ? "تفعيل التنبيهات" : "Enable Alerts"}
          </span>
        </Button>
      )}
    </div>
  );
}
