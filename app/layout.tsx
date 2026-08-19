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
  display: "swap",
})

const alexandria = Alexandria({
  subsets: ["arabic"],
  variable: "--font-alexandria",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: 'البوابة الوطنية للخدمات الرقمية 2026 🇩🇿 — الرابط المباشر لكل المنصات والوثائق',
    template: '%s | رقمنة'
  },
  description: 'البوابة الوطنية الجزائرية للخدمات الرقمية (رقمنة 2026): 267+ خدمة مجمعة بروابط مباشرة — منحة البطالة ANEM، بريدي موب، سكنات عدل 3، والوثائق الإدارية S12 بدون إعلانات ⚡',
  generator: 'Raqmana',
  applicationName: 'رقمنة',
  referrer: 'origin-when-cross-origin',
  keywords: [
    // Exact GSC High-Volume Impression Search Queries (ANEM / Lanam, El Hanaa, Sonelgaz, BaridiMob, RAG, ENPI)
    'لانام', 'لانام منحة البطالة', 'حجز موعد منحة البطالة 2026', 'أنام', 'تجديد لانام', 'فضاء طالب العمل', 'minha anem dz', 'wasit anem',
    'فضاء الهناء', 'موقع الهناء', 'تتبع بطاقة الشفاء', 'فضاء الهناء casnos', 'elhanaa cnas',
    'فضاء الزبون سونلغاز', 'مرجع الزبون سونلغاز', 'دفع فاتورة الكهرباء الجزائر', 'مرجع زبون سونلغاز',
    'بريدي موب لا يعمل 2026', 'eccp.poste.dz', 'baridiweb', 'بريدي ويب',
    'rag mesrs dz', 'rag.mesrs', 'البوابة الرقمية لقطاع التربية الوطنية',
    'enpi dz', 'المؤسسة الوطنية للترقية العقارية', 'lpp 2026', 'سكنات lpp',
    'البوابة الرقمية لاستخراج الوثائق', 'موقع استخراج شهادة الميلاد الجزائرية من الانترنت', 'شهادة السوابق العدلية الجزائر',
    // Primary brand + platform
    'البوابة الجزائرية للخدمات الرقمية', 'رقمنة الجزائر', 'رقمنة الجزائر 2026', 'رقمنة 2026', 'البوابة الرقمية الجزائرية', 'الخدمات الرقمية في الجزائر',
    'خدمات رقمية حكومية الجزائر', 'الجزائر', 'خدمات رقمية', 'حكومة إلكترونية',
    // High-intent document searches
    'استخراج شهادة الميلاد S12', 'استخراج صحيفة السوابق القضائية', 'جواز السفر البيومتري الجزائر',
    'بطاقة التعريف الوطنية البيومترية', 'شهادة الجنسية الجزائرية', 'عقد الزواج إلكتروني',
    // Payments & banking
    'منصة أضاحي 2026', 'بريد الجزائر', 'البطاقة الذهبية Edahabia', 'BaridiMob تطبيق', 'CIB دفع إلكتروني',
    'دفع فواتير سونلغاز', 'منصة إي-طاقتي E-Taqaty', 'دفع فاتورة ADE', 'رصيد CCP',
    // Education
    'عدل 3', 'اكتتاب عدل', 'فضاء الأولياء', 'نتائج البكالوريا 2026', 'نتائج BEM 2026',
    'منصة بروغرس progress mesrs', 'التسجيلات الجامعية 2026',
    // Employment & social
    'منحة البطالة ANEM', 'فضاء الهناء CNAS', 'تجديد منحة البطالة', 'CASNOS خدمات',
    // Digital services directory
    'البوابة الوطنية للخدمات الرقمية', 'Dzair Digital Services', 'التوقيع الإلكتروني e-Tawki3',
    'الهوية الرقمية الجزائرية', 'الجزائر 2030', 'استخراج وثائق إدارية في الجزائر',
    'روابط مباشرة خدمات حكومية الجزائر',
  ],
  authors: [{ name: 'Raqmana Team' }],
  creator: 'Raqmana',
  publisher: 'Raqmana',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-icon.png',
  },
  metadataBase: new URL('https://www.raqmanadz.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/',
      'en': '/en',
      'ar-dz': '/',
      'x-default': '/',
    },
    types: {
      'application/rss+xml': [
        { url: '/api/rss', title: 'رقمنة - آخر الخدمات والتحيينات الرقمية' }
      ]
    }
  },
  openGraph: {
    title: 'البوابة الجزائرية للخدمات الرقمية | رقمنة الجزائر 2026',
    description: 'البوابة الجزائرية للخدمات الرقمية (رقمنة 2026): دليلك الموثوق للوصول السريع إلى كافة الخدمات الحكومية والعمومية في الجزائر بروابط مباشرة وبدون إعلانات.',
    url: 'https://www.raqmanadz.com',
    siteName: 'البوابة الجزائرية للخدمات الرقمية',
    locale: 'ar_DZ',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'رقمنة الجزائر 2026 - البوابة الجزائرية للخدمات الرقمية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'البوابة الجزائرية للخدمات الرقمية | رقمنة الجزائر 2026',
    description: 'البوابة الجزائرية للخدمات الرقمية (رقمنة 2026): دليلك الموثوق للوصول السريع إلى كافة الخدمات الحكومية والعمومية في الجزائر بروابط مباشرة وبدون إعلانات.',
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.raqmanadz.com/#organization",
              "name": "البوابة الجزائرية للخدمات الرقمية | رقمنة الجزائر",
              "alternateName": ["رقمنة", "رقمنة الجزائر 2026", "البوابة الجزائرية للخدمات الرقمية"],
              "url": "https://www.raqmanadz.com/",
              "logo": "https://www.raqmanadz.com/icon-512x512.png",
              "description": "البوابة الجزائرية للخدمات الرقمية (رقمنة 2026): دليل مستقل للوصول السريع إلى كافة الخدمات الحكومية والعمومية في الجزائر بروابط مباشرة",
              "foundingDate": "2026",
              "areaServed": {
                "@type": "Country",
                "name": "DZ"
              },
              "knowsAbout": [
                "البوابة الجزائرية للخدمات الرقمية",
                "رقمنة الجزائر",
                "الخدمات الرقمية في الجزائر",
                "الإدارة الإلكترونية الجزائر",
                "استخراج الوثائق الإدارية في الجزائر",
                "الدفع الإلكتروني بالبطاقة الذهبية"
              ],
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
              "name": "البوابة الجزائرية للخدمات الرقمية",
              "alternateName": ["رقمنة الجزائر 2026", "رقمنة الجزائر"],
              "url": "https://www.raqmanadz.com/",
              "inLanguage": "ar-DZ",
              "publisher": {
                "@id": "https://www.raqmanadz.com/#organization"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.raqmanadz.com/categories?q={search_term_string}"
                },
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

            {/* Google Analytics — lazyOnload + async */}
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
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
