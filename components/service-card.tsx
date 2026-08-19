"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { ExternalLink, Smartphone, Globe, Info } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { slugifyService } from "@/lib/category-mapper"

import { InstantShareButton } from "@/components/instant-share-button"
import { ServiceToolbarBar } from "@/components/service-toolbar-bar"

interface ServiceCardProps {
  name: { ar: string; en: string }
  url: string
  isApp?: boolean
  status?: "active" | "slow" | "down"
  customStatusNote?: string
  isTrending?: boolean
}

export function ServiceCard({ name, url, isApp, status: initialStatus, customStatusNote, isTrending }: ServiceCardProps) {
  const { language, t } = useLanguage()
  const [imgError, setImgError] = useState(false)
  const [status, setStatus] = useState(initialStatus || "active")
  const [hasReported, setHasReported] = useState(false)
  
  // Extract domain for display
  let domain = ""
  try {
    domain = new URL(url).hostname.replace('www.', '')
  } catch {
    domain = url
  }
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  const serviceId = slugifyService(name.ar, url)

  return (
    <div className="group block h-full outline-none">
      <div className="relative h-full flex flex-col p-6 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-black/[0.03] dark:border-white/[0.03] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.01)] hover:-translate-y-1.5">
        
        <div className="flex items-start justify-between mb-6">
          {/* Icon Container */}
          <Link href={`/services/${serviceId}`} className={`relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 shadow-sm hover:scale-105 ${isApp ? 'bg-primary/5' : 'bg-gray-50 dark:bg-white/5 border border-black/[0.03] dark:border-white/[0.03]'}`}>
            {isApp ? (
              <Smartphone className="h-7 w-7 text-primary" />
            ) : !imgError ? (
              <img
                src={faviconUrl}
                alt={name[language]}
                width={48}
                height={48}
                className="h-9 w-9 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                onError={() => setImgError(true)}
              />
            ) : (
              <Globe className="h-7 w-7 text-muted-foreground/30" />
            )}
          </Link>

          {/* External Link Direct Button */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="زيارة المنصة الرسمية الآن"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 border border-black/[0.03] dark:border-white/[0.03] transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <ExternalLink className="h-4 w-4 opacity-70 hover:opacity-100 transition-all" />
          </a>
        </div>

        {/* Text Content */}
        <div className="mt-auto flex flex-col justify-between flex-1">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isApp ? 'text-primary' : 'text-muted-foreground/50'}`}>
                {isApp ? t("services.app") : "Official Portal"}
              </span>
              
              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.03]">
                <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                  status === "active" ? "bg-emerald-500" : 
                  status === "slow" ? "bg-amber-500" : "bg-red-500"
                }`} />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                  {status === "active" ? (language === "ar" ? "يعمل" : "Live") : 
                   status === "slow" ? (language === "ar" ? "ضغط عالٍ" : "Slow") : 
                   (language === "ar" ? "متوقف" : "Down")}
                </span>
              </div>
            </div>

            {/* Custom Status Note */}
            {customStatusNote && (
              <div className="mb-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-700 dark:text-amber-300 leading-snug">
                📢 {customStatusNote}
              </div>
            )}

            <Link href={`/services/${serviceId}`} className="block group-hover:text-primary transition-colors">
              <h3 className="text-base font-bold text-[#1a1a1a] dark:text-white/90 leading-tight line-clamp-2 mt-1">
                {name[language]}
              </h3>
            </Link>
          </div>
          
          <div className="mt-4 pt-3 border-t border-border/40 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground/50 truncate max-w-[65%]">
                {domain}
              </span>
              
              <Link
                href={`/services/${serviceId}`}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
              >
                <span>الدليل والحلول</span>
                <Info className="w-3 h-3" />
              </Link>
            </div>

            {/* Toolbar & Social Proof */}
            <div className="mt-2 space-y-2">
              <ServiceToolbarBar
                serviceId={serviceId}
                serviceTitle={name[language]}
                url={url}
              />
              <InstantShareButton title={name[language]} url={url} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

