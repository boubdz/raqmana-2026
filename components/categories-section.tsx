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
  Leaf,
  Droplets,
  Sparkles,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

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
  cnrc: "/categories/cnrc",
  youth: "/categories/youth",
  culture: "/categories/culture",
  tourism: "/categories/tourism",
  water: "/categories/water",
  industry: "/categories/industry",
  environment: "/categories/environment",
  media: "/categories/media",
};

const iconMap: Record<string, React.ElementType> = {
  Scale, Heart, GraduationCap, Banknote, Car, Home, Briefcase, Users, Wifi,
  Building2, ShoppingBag, Wheat, Receipt, Smartphone, Mail, School, Wrench,
  Building, FileText, Landmark, Globe, Shield, Plane, Package, UserCheck, Moon,
  TrendingUp, Vote, ShieldCheck, Radio, ShieldPlus, Leaf, Droplets, Sparkles,
};

const quickLinks = [
  { key: "quickLinks.s12", url: "https://etatcivil.interieur.gov.dz/s12", icon: FileText },
  { key: "quickLinks.casier", url: "https://casier.mjustice.dz", icon: Scale },
  { key: "quickLinks.passport", url: "https://passeport.interieur.gov.dz", icon: Globe },
  { key: "quickLinks.cni", url: "https://passeport.interieur.gov.dz/cni", icon: ShieldCheck },
  { key: "quickLinks.unemployment", url: "https://minha.anem.dz", icon: Banknote },
  { key: "quickLinks.bac", url: "https://bac.onec.dz/resultats", icon: GraduationCap },
];

export function CategoriesSection() {
  const { t, language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return serviceCategories.map((category) => {
      const filteredServices = category.services.filter(s =>
        s.name.ar.toLowerCase().includes(query) || s.name.en.toLowerCase().includes(query)
      );
      return { ...category, services: filteredServices };
    }).filter(c => c.services.length > 0);
  }, [searchQuery]);

  return (
    <section id="services" className="py-32 bg-white dark:bg-[#080808]" dir={dir}>
      <div className="container mx-auto px-6">

        {/* Section Header - Antigravity Style */}
        <div className="mb-24 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-[#1a1a1a] dark:text-white uppercase">
            {t("categories.title")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground/50 font-medium">
            {t("categories.subtitle")}
          </p>
        </div>

        {/* Search Bar - Sleek & Modern */}
        <div className="mx-auto mb-20 max-w-2xl">
          <div className="relative group">
            <Search className="absolute top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground/50 start-5 transition-colors group-focus-within:text-primary" />
            <Input
              type="search"
              placeholder={t("services.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-16 ps-14 text-lg bg-[#f5f5f5] dark:bg-[#111] border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Quick Access Pills */}
        <div className="mb-24 flex flex-wrap justify-center gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-full bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 px-6 py-3 text-sm font-bold text-[#1a1a1a] dark:text-white transition-all hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-white dark:hover:text-black shadow-sm"
              >
                <Icon className="h-4 w-4" />
                {t(link.key)}
                <ExternalLink className="h-3 w-3 opacity-30 group-hover:opacity-100" />
              </a>
            );
          })}
        </div>

        {/* Main Grid - High End Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {serviceCategories.map((category) => {
            const Icon = iconMap[category.icon];
            const pageUrl = categoryPageMap[category.id] || "#";
            return (
              <Link
                key={category.id}
                href={pageUrl}
                className="group relative flex flex-col items-center gap-6 rounded-[2.5rem] p-8 transition-all duration-500 bg-[#fcfcfc] dark:bg-[#0c0c0c] border border-black/[0.03] dark:border-white/[0.03] hover:bg-white dark:hover:bg-[#111] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(255,255,255,0.02)] hover:-translate-y-2"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  {Icon && <Icon className="h-8 w-8" />}
                </div>
                <div className="text-center">
                  <span className="text-sm font-black uppercase tracking-widest text-[#1a1a1a] dark:text-white/90">
                    {t(category.nameKey)}
                  </span>
                  <div className="mt-2 h-1 w-0 bg-primary mx-auto transition-all duration-500 group-hover:w-8 rounded-full" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Search Results Display */}
        {searchQuery.trim() && filteredCategories.length > 0 && (
          <div className="mt-20 space-y-12 animate-in fade-in duration-500">
            <h3 className="text-2xl font-black text-center uppercase tracking-tighter">Results for "{searchQuery}"</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => {
                const Icon = iconMap[category.icon];
                return (
                  <Card key={category.id} className="p-6 rounded-3xl border-black/5 dark:border-white/5 bg-white dark:bg-[#111] shadow-xl">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                        {Icon && <Icon className="h-4 w-4" />}
                      </div>
                      {t(category.nameKey)}
                    </h4>
                  <div className="space-y-3">
                    {category.services.map((s, idx) => (
                      <ServiceCard key={idx} name={s.name} url={s.url} isApp={s.isApp} />
                    ))}
                  </div>
                </Card>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}