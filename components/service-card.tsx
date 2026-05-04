"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { ExternalLink, Smartphone } from "lucide-react"
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
  
  // Extract domain for favicon
  let domain = ""
  try {
    domain = new URL(url).hostname
  } catch {
    domain = url
  }
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <Card className="relative h-full overflow-hidden border-border/40 bg-card/40 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 ring-1 ring-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex items-center gap-4 p-5">
          {/* Favicon / Thumbnail */}
          <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-inner transition-transform duration-500 group-hover:scale-110 ${isApp ? 'bg-gradient-to-br from-primary/20 to-primary/10' : 'bg-muted/50 border border-border/30'}`}>
            {isApp ? (
              <Smartphone className="h-7 w-7 text-primary" />
            ) : !imgError ? (
              <Image
                src={faviconUrl}
                alt={name[language]}
                width={40}
                height={40}
                className="h-10 w-10 object-contain p-1 filter drop-shadow-sm"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                {name[language].charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
              {name[language]}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${isApp ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
              <p className="truncate text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {isApp ? t("services.app") : domain}
              </p>
            </div>
          </div>

          {/* External Link Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30 group-hover:bg-primary/20 transition-colors">
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
          </div>
        </div>
      </Card>
    </a>
  )
}
