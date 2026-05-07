import type { Metadata, Viewport } from 'next'
import { Inter, Alexandria } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/contexts/theme-context'
import { LanguageProvider } from '@/contexts/language-context'
import InstallButton from '@/components/InstallButton'
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
    default: 'رقمنة 2026 | دليل الخدمات الرقمية والمنصات الحكومية الجزائرية',
    template: '%s | رقمنة 2026'
  },
  description: 'البوابة الشاملة للوصول إلى أكثر من 280 خدمة رقمية حكومية في الجزائر. استخراج الوثائق (S12, جواز سفر), منصة أضاحي 2026, تسجيلات عدل 3, بريد الجزائر, واتصالات الجزائر. روابط مباشرة وتحديثات يومية فورية.',
  generator: 'Raqmana',
  applicationName: 'رقمنة',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'الجزائر', 'خدمات رقمية', 'حكومة إلكترونية', 'استخراج شهادة الميلاد S12', 'منصة أضاحي 2026', 'بريد الجزائر', 
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
    languages: {
      'ar-DZ': '/ar',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'رقمنة 2026 | دليلك الشامل للخدمات الرقمية في الجزائر',
    description: 'كل المنصات الحكومية الجزائرية في تطبيق واحد. روابط مباشرة، تحديثات 2026، وسهولة تامة في الوصول.',
    url: 'https://raqmana.vercel.app',
    siteName: 'رقمنة - Raqmana',
    locale: 'ar_DZ',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'رقمنة 2026 - دليل الخدمات الرقمية الجزائرية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'رقمنة 2026 | دليل الخدمات الرقمية الجزائرية',
    description: 'أكثر من 280 خدمة رقمية حكومية بين يديك الآن بروابط مباشرة.',
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

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TWMTPY4E30"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-TWMTPY4E30');
          `}
        </Script>

        <Analytics />
        <InstallButton />
      </body>
    </html>
  )
}