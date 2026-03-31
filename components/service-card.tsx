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
      className="group block"
    >
      <Card className="relative h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
        <div className="flex items-center gap-3 p-4">
          {/* Favicon / Thumbnail */}
          <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl ${isApp ? 'bg-gradient-to-br from-primary/20 to-primary/10' : 'bg-muted'}`}>
            {isApp ? (
              <Smartphone className="h-6 w-6 text-primary" />
            ) : !imgError ? (
              <Image
                src={faviconUrl}
                alt={name[language]}
                width={32}
                height={32}
                className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-sm">
                {name[language].charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {name[language]}
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {isApp ? t("services.app") : domain}
            </p>
          </div>

          {/* External Link Icon */}
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Card>
    </a>
  )
}
