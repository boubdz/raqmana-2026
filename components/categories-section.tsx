"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ServiceCard } from "@/components/service-card"
import { serviceCategories } from "@/lib/services-data"
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
} from "lucide-react"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"

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
}

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
]

export function CategoriesSection() {
  const { t, language, dir } = useLanguage()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return serviceCategories

    const query = searchQuery.toLowerCase()
    return serviceCategories
      .map((category) => {
        // Filter main services
        const filteredServices = category.services.filter(
          (service) =>
            service.name.ar.toLowerCase().includes(query) ||
            service.name.en.toLowerCase().includes(query) ||
            service.url.toLowerCase().includes(query)
        )
        
        // Filter subcategory services
        const filteredSubCategories = category.subCategories?.map((sub) => ({
          ...sub,
          services: sub.services.filter(
            (service) =>
              service.name.ar.toLowerCase().includes(query) ||
              service.name.en.toLowerCase().includes(query) ||
              service.url.toLowerCase().includes(query)
          ),
        })).filter((sub) => sub.services.length > 0)

        return {
          ...category,
          services: filteredServices,
          subCategories: filteredSubCategories,
        }
      })
      .filter((category) => 
        category.services.length > 0 || 
        (category.subCategories && category.subCategories.length > 0)
      )
  }, [searchQuery])

  // Calculate total services
  const totalServices = serviceCategories.reduce((acc, cat) => {
    let count = cat.services.length
    if (cat.subCategories) {
      count += cat.subCategories.reduce((subAcc, sub) => subAcc + sub.services.length, 0)
    }
    return acc + count
  }, 0)

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
              const IconComponent = link.icon
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
              )
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

        {/* Category Icons Grid */}
        <div className="mb-12 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10">
          {serviceCategories.map((category) => {
            const IconComponent = iconMap[category.icon]
            const isExpanded = expandedCategories.has(category.id)
            
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`group flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-300 ${
                  isExpanded
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card hover:bg-accent hover:shadow-md border border-border/50"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ${
                    isExpanded
                      ? "bg-primary-foreground/20"
                      : "bg-gradient-to-br " + category.color + " text-white"
                  }`}
                >
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                </div>
                <span className="text-xs font-medium text-center leading-tight line-clamp-2">
                  {t(category.nameKey)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Expanded Category Services */}
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.has(category.id) || searchQuery.trim()
            const IconComponent = iconMap[category.icon]
            const hasServices = category.services.length > 0
            const hasSubCategories = category.subCategories && category.subCategories.length > 0

            if (!isExpanded) return null
            if (!hasServices && !hasSubCategories) return null

            return (
              <Card
                key={category.id}
                className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm"
              >
                {/* Category Header */}
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
                  {!searchQuery.trim() && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <ChevronUp className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                {/* Services Content */}
                <div className="p-4">
                  {/* Main Services */}
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

                  {/* Subcategories */}
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
            )
          })}
        </div>

        {/* Show All Button */}
        {!searchQuery.trim() && expandedCategories.size === 0 && (
          <div className="mt-10 text-center">
            <Button
              size="lg"
              onClick={() => {
                const allIds = new Set(serviceCategories.map((c) => c.id))
                setExpandedCategories(allIds)
              }}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            >
              {t("services.viewAll")}
              <ChevronDown className="h-4 w-4 ms-2" />
            </Button>
          </div>
        )}

        {/* Collapse All Button */}
        {!searchQuery.trim() && expandedCategories.size > 0 && (
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setExpandedCategories(new Set())}
              className="border-primary/30 hover:bg-primary/10"
            >
              {t("common.collapse")}
              <ChevronUp className="h-4 w-4 ms-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
