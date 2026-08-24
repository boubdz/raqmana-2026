"use client";

import { useEffect } from "react";
import Script from "next/script";

export function OneSignalInit() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).OneSignalDeferred = (window as any).OneSignalDeferred || [];
      (window as any).OneSignalDeferred.push(async function (OneSignal: any) {
        try {
          await OneSignal.init({
            appId: "0a805f59-03b6-41cf-92d4-6f25db136459",
            allowLocalhostAsSecureOrigin: true,
            notifyButton: {
              enable: false, // We use custom UI or native slide prompt
            },
            promptOptions: {
              slidedown: {
                prompts: [
                  {
                    type: "push",
                    autoPrompt: true,
                    text: {
                      actionMessage: "هل ترغب في استقبال تنبيهات فورية بجديد مسابقات التوظيف والخدمات الرقمية؟ 🇩🇿",
                      acceptButton: "تفعيل التنبيهات 🔔",
                      cancelButton: "لاحقاً",
                    },
                    delay: {
                      pageViews: 1,
                      timeDelay: 5,
                    },
                  },
                ],
              },
            },
          });
        } catch (err) {
          console.error("OneSignal init error:", err);
        }
      });
    }
  }, []);

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      strategy="lazyOnload"
    />
  );
}
