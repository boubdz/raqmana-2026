"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServiceCard } from "@/components/service-card";
import { serviceCategories } from "@/lib/services-data";
import {
  Scale,
  Heart,
  GraduationCap,
  Banknote,
  Car,
  Home,
  Briefcase,
  Users,
  Wifi,
  Building2,
  ShoppingBag,
  Wheat,
  ChevronDown,
  ChevronUp,
  Search,
  Receipt,
  Smartphone,
  Mail,
  School,
  Wrench,
  Building,
  FileText,
  Landmark,
  Globe,
  Shield,
  Plane,
  Package,
  UserCheck,
  Moon,
  TrendingUp,
  Vote,
  ShieldCheck,
  Radio,
  ShieldPlus,
  ExternalLink,
  Phone,
  Zap,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// خريطة ربط الفئات بالصفحات الداخلية (جميع المعرفات موجودة الآن)
const categoryPageMap: Record<string, string> = {
  bills: "/categories/bills",
  mobile: "/categories/mobile",
  post: "/categories/post",
  telecom: "/categories/telecom",
  education: "/categories/education",
  university: "/categories/university",
  vocational: "/categories/vocational",
  interior: "/categories/interior",
  aadl: "/categories/aadl",
  enpi: "/categories/enpi",
  tax: "/categories/tax",
  justice: "/categories/justice",
  publicContracts: "/categories/publicContracts",
  realEstate: "/categories/realEstate",
  foreignAffairs: "/categories/foreignAffairs",
  socialSecurity: "/categories/socialSecurity",
  health: "/categories/health",
  vehicles: "/categories/vehicles",
  transport: "/categories/transport",
  employment: "/categories/employment",
  commerce: "/categories/commerce",
  customs: "/categories/customs",
  autoEntrepreneur: "/categories/autoEntrepreneur",
  hajj: "/categories/hajj",
  investment: "/categories/investment",
  elections: "/categories/elections",
  police: "/categories/police",
  arpce: "/categories/arpce",
  insurance: "/categories/insurance",
  banking: "/categories/banking",
  agriculture: "/categories/agriculture",
};

const iconMap: Record<string, React.ElementType> = {
  Scale,
  Heart,
  GraduationCap,
  Banknote,
  Car,
  Home,
  Briefcase,
  Users,
  Wifi,
  Building2,
  ShoppingBag,
  Wheat,
  Receipt,
  Smartphone,
  Mail,
  School,
  Wrench,
  Building,
  FileText,
  Landmark,
  Globe,
  Shield,
  Plane,
  Package,
  UserCheck,
  Moon,
  TrendingUp,
  Vote,
  ShieldCheck,
  Radio,
  ShieldPlus,
  Wheat,
};

// Quick links for most popular services
const quickLinks = [
  { key: "quickLinks.s12", url: "https://etatcivil.interieur.gov.dz/s12", icon: FileText },
  { key: "quickLinks.casier", url: "https://casier.mjustice.dz", icon: Scale },
  { key: "quickLinks.passport", url: "https://passeport.interieur.gov.dz", icon: Globe },
  { key: "quickLinks.cni", url: "https://passeport.interieur.gov.dz/cni", icon: ShieldCheck },
  { key: "quickLinks.autoEntrepreneur", url: "https://ae.andi.dz", icon: UserCheck },
  { key: "quickLinks.unemployment", url: "https://minha.anem.dz", icon: Banknote },
  { key: "quickLinks.bac", url: "https://bac.onec.dz/resultats", icon: GraduationCap },
  { key: "quickLinks.bem", url: "https://bem.onec.dz/resultats", icon: School },
];

export function CategoriesSection() {
  const { t, language, dir } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // تصفية الفئات والخدمات بناءً على نص البحث
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return serviceCategories
      .map((category) => {
        const filteredServices = category.services.filter(
          (service) =>
            service.name.ar.toLowerCase().includes(query) ||
            service.name.en.toLowerCase().includes(query) ||
            service.url.toLowerCase().includes(query)
        );
        const filteredSubCategories = category.subCategories?.map((sub) => ({
          ...sub,
          services: sub.services.filter(
            (service) =>
              service.name.ar.toLowerCase().includes(query) ||
              service.name.en.toLowerCase().includes(query) ||
              service.url.toLowerCase().includes(query)
          ),
        })).filter((sub) => sub.services.length > 0);

        return {
          ...category,
          services: filteredServices,
          subCategories: filteredSubCategories,
        };
      })
      .filter((category) => category.services.length > 0 || (category.subCategories && category.subCategories.length > 0));
  }, [searchQuery]);

  const totalServices = serviceCategories.reduce((acc, cat) => {
    let count = cat.services.length;
    if (cat.subCategories) {
      count += cat.subCategories.reduce((subAcc, sub) => subAcc + sub.services.length, 0);
    }
    return acc + count;
  }, 0);

  return (
    <section id="services" className="py-20 bg-muted/30" dir={dir}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            {t("categories.mainDirectory")}
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            {t("categories.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            {t("categories.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="rounded-full bg-card px-4 py-2 text-sm font-medium shadow-sm">
              <span className="text-primary font-bold">{serviceCategories.length}</span> {t("services.categories")}
            </div>
            <div className="rounded-full bg-card px-4 py-2 text-sm font-medium shadow-sm">
              <span className="text-primary font-bold">{totalServices}+</span> {t("services.count")}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h3 className="mb-4 text-lg font-semibold text-center">{t("quickLinks.title")}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all hover:from-primary hover:to-primary hover:text-primary-foreground hover:shadow-lg"
                >
                  <IconComponent className="h-4 w-4" />
                  {t(link.key)}
                  <ExternalLink className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-10 max-w-xl">
          <div className="relative">
            <Search className="absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground start-3" />
            <Input
              type="search"
              placeholder={t("services.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 ps-10 text-base bg-background"
            />
          </div>
        </div>

        {/* Category Icons Grid (internal links) */}
        <div className="mb-12 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10">
          {serviceCategories.map((category) => {
            const IconComponent = iconMap[category.icon];
            const pageUrl = categoryPageMap[category.id] || "/categories/coming-soon.html";
            return (
              <Link
                key={category.id}
                href={pageUrl}
                className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-300 bg-card hover:bg-accent hover:shadow-md border border-border/50"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${category.color} text-white shadow-md transition-all duration-300 group-hover:scale-105`}
                >
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                </div>
                <span className="text-xs font-medium text-center leading-tight line-clamp-2">
                  {t(category.nameKey)}
                </span>
              </Link>
            );
          })}
        </div>

        {/* نتائج البحث (تظهر فقط عند وجود searchQuery) */}
        {searchQuery.trim() && filteredCategories.length > 0 && (
          <div className="space-y-6 mt-8">
            <h3 className="text-xl font-semibold text-center mb-4">نتائج البحث لـ "{searchQuery}"</h3>
            {filteredCategories.map((category) => {
              const IconComponent = iconMap[category.icon];
              const hasServices = category.services.length > 0;
              const hasSubCategories = category.subCategories && category.subCategories.length > 0;

              return (
                <Card
                  key={category.id}
                  className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between border-b border-border/50 p-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}
                      >
                        {IconComponent && <IconComponent className="h-6 w-6" />}
                      </div>
                      <div className="text-start">
                        <h3 className="font-bold text-lg">{t(category.nameKey)}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {category.officialSite && (
                            <a
                              href={category.officialSite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                            >
                              <Globe className="h-3 w-3" />
                              {t("services.official")}
                            </a>
                          )}
                          {category.phone && (
                            <a
                              href={`tel:${category.phone}`}
                              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                            >
                              <Phone className="h-3 w-3" />
                              {category.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {hasServices && (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {category.services.map((service, index) => (
                          <ServiceCard
                            key={index}
                            name={service.name}
                            url={service.url}
                            isApp={service.isApp}
                          />
                        ))}
                      </div>
                    )}

                    {hasSubCategories && (
                      <div className="space-y-6 mt-4">
                        {category.subCategories!.map((subCategory, subIndex) => (
                          <div key={subIndex}>
                            <h4 className="mb-3 font-semibold text-sm text-muted-foreground border-b border-border/50 pb-2">
                              {t(subCategory.nameKey)}
                            </h4>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                              {subCategory.services.map((service, serviceIndex) => (
                                <ServiceCard
                                  key={serviceIndex}
                                  name={service.name}
                                  url={service.url}
                                  isApp={service.isApp}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* رسالة في حالة عدم وجود نتائج */}
        {searchQuery.trim() && filteredCategories.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">عذراً، لم يتم العثور على خدمات تطابق "{searchQuery}".</p>
          </div>
        )}
      </div>
    </section>
  );
}