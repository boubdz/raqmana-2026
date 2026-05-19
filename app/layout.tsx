import type { Metadata, Viewport } from 'next'
import { Inter, Alexandria } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/contexts/theme-context'
import { LanguageProvider } from '@/contexts/language-context'
import InstallButton from '@/components/InstallButton'
import { SiteShare } from '@/components/site-share'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const alexandria = Alexandria({
  subsets: ["arabic"],
  variable: "--font-alexandria",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: {
    default: 'رقمنة 2026 | البوابة الجزائرية للخدمات الرقمية المستقلة (روابط مباشرة)',
    template: '%s | رقمنة 2026'
  },
  description: 'بوابتك الجزائرية الأسرع للوصول المباشر إلى كافة الخدمات الرقمية الحكومية بدون إعلانات. استخرج وثائقك الرسمية (S12)، سدد فواتيرك، وسجل في المسابقات والوظائف بنقرة واحدة.',
  generator: 'Raqmana',
  applicationName: 'رقمنة',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'الجزائر', 'خدمات رقمية', 'حكومة إلكترونية', 'البوابة الرقمية الجزائرية', 'البوابة الجزائرية للخدمات الرقمية', 'استخراج شهادة الميلاد S12', 'منصة أضاحي 2026', 'بريد الجزائر', 
    'عدل 3', 'جواز السفر البيومتري', 'البوابة الرقمية الجزائر', 'رابط مباشر', 'تطبيقات حكومية', 'منصة فضاء الأولياء',
    'استخراج السوابق القضائية', 'حجز تذاكر الجوية الجزائرية', 'دفع فواتير سونلغاز', 'اتصالات الجزائر 4G',
    'البوابة الوطنية للخدمات الرقمية', 'Dzair Digital Services', 'التوقيع الإلكتروني e-Tawki3', 'الهوية الرقمية الجزائرية',
    'الجزائر 2030', 'تطبيق بريد موب', 'تجديد منحة البطالة', 'فضاء الهناء CNAS'
  ],
  authors: [{ name: 'Raqmana Team' }],
  creator: 'Raqmana',
  publisher: 'Raqmana',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://raqmana.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'رقمنة 2026 | البوابة الجزائرية للخدمات الرقمية المستقلة',
    description: 'كل المنصات الحكومية الجزائرية في مكان واحد. روابط مباشرة، تحديثات 2026، وسهولة تامة في الوصول بدون إعلانات.',
    url: 'https://raqmana.vercel.app',
    siteName: 'رقمنة - Raqmana',
    locale: 'ar_DZ',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'رقمنة 2026 - البوابة الجزائرية للخدمات الرقمية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'رقمنة 2026 | البوابة الجزائرية للخدمات الرقمية المستقلة',
    description: 'أكثر من 300 خدمة رقمية حكومية جزائرية بين يديك الآن بروابط مباشرة وبدون إعلانات.',
    creator: '@raqmana',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'G-TWMTPY4E30', // Using the tag ID as a placeholder if no specific token provided
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
  width: 'device-width',
  initialScale: 1,
  // ✅ iOS safe-area support (notch/Dynamic Island)
  viewportFit: 'cover',
  // ✅ Prevent iOS auto-zoom on input focus (font-size ≥ 16px enforced via CSS)
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "رقمنة 2026",
              "url": "https://raqmana.vercel.app",
              "logo": "https://raqmana.vercel.app/logo.png",
              "description": "المنصة الشاملة للخدمات الرقمية في الجزائر",
              "sameAs": [
                "https://facebook.com/raqmana",
                "https://twitter.com/raqmana"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://raqmana.vercel.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://raqmana.vercel.app/services?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${alexandria.variable} font-alexandria antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        
        {/* PWA Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>

        {/* Google Analytics — lazyOnload: defers until page is idle, reduces TBT */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TWMTPY4E30"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TWMTPY4E30', { send_page_view: false });
          `}
        </Script>

        <Analytics />
        <InstallButton />
        <SiteShare />
      </body>
    </html>
  )
}