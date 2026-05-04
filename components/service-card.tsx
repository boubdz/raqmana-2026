"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { ExternalLink, Smartphone, Globe } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ServiceCardProps {
  name: { ar: string; en: string }
  url: string
  isApp?: boolean
}

export function ServiceCard({ name, url, isApp }: ServiceCardProps) {
  const { language, t } = useLanguage()
  const [imgError, setImgError] = useState(false)
  
  // Extract domain for display
  let domain = ""
  try {
    domain = new URL(url).hostname.replace('www.', '')
  } catch {
    domain = url
  }
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full outline-none"
    >
      <div className="relative h-full flex flex-col p-6 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-black/[0.03] dark:border-white/[0.03] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.01)] hover:-translate-y-1.5 group-focus:ring-2 group-focus:ring-primary/20">
        
        <div className="flex items-start justify-between mb-6">
          {/* Icon Container - High Quality Favicon */}
          <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 shadow-sm ${isApp ? 'bg-primary/5' : 'bg-gray-50 dark:bg-white/5 border border-black/[0.03] dark:border-white/[0.03]'}`}>
            {isApp ? (
              <Smartphone className="h-7 w-7 text-primary" />
            ) : !imgError ? (
              <Image
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
          </div>

          {/* Minimal Arrow Button */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 border border-black/[0.03] dark:border-white/[0.03] transition-all duration-300 group-hover:bg-[#1a1a1a] dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black">
            <ExternalLink className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-all" />
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-auto">
          <div className="mb-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isApp ? 'text-primary' : 'text-muted-foreground/50'}`}>
              {isApp ? t("services.app") : "Official Portal"}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-white/90 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {name[language]}
          </h3>
          <p className="mt-2 text-xs font-bold text-muted-foreground/40 truncate tracking-wide">
            {domain}
          </p>
        </div>
      </div>
    </a>
  )
}
