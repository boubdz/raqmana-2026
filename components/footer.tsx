// components/footer.tsx
"use client";

import { useLanguage } from "@/contexts/language-context";
import { serviceCategories } from "@/lib/services-data";
import Link from "next/link";
import { Globe, Phone, ExternalLink } from "lucide-react";
import ViewsCounter from "@/components/ViewsCounter";
import { SocialLinks } from "@/components/SocialLinks";
import { DownloadButtons } from "@/components/DownloadButtons"; // <-- أضف هذا السطر

export function Footer() {
  const { t, language, dir } = useLanguage();

  const quickLinks = [
    { key: "nav.home", href: "/" },
    { key: "nav.services", href: "#services" },
    { key: "nav.assistant", href: "#assistant" },
    { key: "footer.sitemap", href: "#sitemap" },
  ];

  const legalLinks = [
    { key: "footer.privacy", href: "#" },
    { key: "footer.terms", href: "#" },
    { key: "footer.contact", href: "#" },
  ];

  const feedbackFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSedd55gYqLbxAf1mNnE3fo5DTgRNsAI2E_ndeKXaoMp9IHd7A/viewform?usp=preview";

  const getSitemapServices = (category: typeof serviceCategories[0]) => {
    const allServices = [...category.services];
    if (category.subCategories) {
      category.subCategories.forEach((sub) => {
        allServices.push(...sub.services);
      });
    }
    return allServices.slice(0, 4);
  };

  return (
    <footer className="border-t border-border/50 bg-card/50" dir={dir}>
      {/* Sitemap Section */}
      <div id="sitemap" className="border-b border-border/50 py-16 bg-muted/20">
        {/* ... (محتويات هذا القسم كما هي دون تغيير) ... */}
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2">{t("footer.sitemap")}</h2>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "جميع الخدمات الرقمية مصنفة حسب القطاعات"
                : "All digital services organized by sector"}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {serviceCategories.map((category) => {
              const services = getSitemapServices(category);
              return (
                <div key={category.id} className="rounded-lg border border-border/50 bg-card/50 p-4">
                  <h3 className="mb-3 font-bold text-foreground border-b border-border/50 pb-2">
                    {t(category.nameKey)}
                  </h3>
                  {(category.officialSite || category.phone) && (
                    <div className="mb-3 flex flex-wrap gap-2 text-xs">
                      {category.officialSite && (
                        <a
                          href={category.officialSite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <Globe className="h-3 w-3" />
                          {language === "ar" ? "الموقع الرسمي" : "Official Site"}
                        </a>
                      )}
                      {category.phone && (
                        <a
                          href={`tel:${category.phone}`}
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                        >
                          <Phone className="h-3 w-3" />
                          {category.phone}
                        </a>
                      )}
                    </div>
                  )}
                  <ul className="space-y-1.5">
                    {services.map((service, index) => (
                      <li key={index}>
                        <a
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                        >
                          <span className="line-clamp-1">{service.name[language]}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-100" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href="/" className="mb-4 inline-flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-lg shadow-lg">
                  R
                </div>
                <div>
                  <span className="text-xl font-bold text-gradient block">Raqmana | رقمنة</span>
                </div>
              </Link>
              <p className="mb-4 text-sm text-muted-foreground">{t("brand.tagline")}</p>
              <p className="text-sm text-muted-foreground max-w-md">{t("footer.aboutText")}</p>
            </div>

            {/* Quick Links Section */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">
                {language === "ar" ? "روابط سريعة" : "Quick Links"}
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.key}>
                    <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {t(link.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">
                {language === "ar" ? "معلومات قانونية" : "Legal"}
              </h3>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.key}>
                    <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {t(link.key)}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={feedbackFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary inline-flex items-center gap-1"
                  >
                    📝 {language === "ar" ? "أرسل ملاحظاتك" : "Send feedback"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Download Section */}
            <div>
              <DownloadButtons />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50 py-6 bg-muted/30">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <SocialLinks />
            <ViewsCounter />
            <span className="text-xs text-muted-foreground/60">
              {language === "ar" ? "عصر الرقمنة " : "The Digital Age"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}