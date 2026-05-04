import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/contexts/theme-context'
import { LanguageProvider } from '@/contexts/language-context'
import InstallButton from '@/components/InstallButton'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist",
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: 'رقمنة 2026 | دليل الخدمات الرقمية والمنصات الحكومية الجزائرية',
  description: 'أكبر دليل مستقل للخدمات الرقمية في الجزائر (أكثر من 280 خدمة). استخراج الوثائق، حجز الأضاحي، التسجيل في عدل 3، وخدمات بريد الجزائر. روابط مباشرة وتحديثات يومية.',
  generator: 'Raqmana',
  keywords: [
    'الجزائر', 'خدمات رقمية', 'حكومة إلكترونية', 'استخراج شهادة الميلاد', 'منصة أضاحي 2026', 'بريد الجزائر', 
    'عدل 3', 'جواز السفر', 'البوابة الرقمية الجزائر', 'رابط مباشر', 'تطبيقات حكومية'
  ],
  authors: [{ name: 'Raqmana Team' }],
  creator: 'Raqmana',
  publisher: 'Raqmana',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'رقمنة 2026 | دليلك الشامل للخدمات الرقمية في الجزائر',
    description: 'كل المنصات الحكومية الجزائرية في تطبيق واحد. روابط مباشرة، تحديثات 2026، وسهولة تامة في الوصول.',
    url: 'https://raqmana.vercel.app',
    siteName: 'رقمنة - Raqmana',
    locale: 'ar_DZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'رقمنة 2026 | دليل الخدمات الرقمية الجزائرية',
    description: 'أكثر من 280 خدمة رقمية حكومية بين يديك الآن بروابط مباشرة.',
    creator: '@raqmana',
  },
  alternates: {
    canonical: 'https://raqmana.vercel.app',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1520' },
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
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0d1520" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} ${notoArabic.variable} font-sans antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <InstallButton />
      </body>
    </html>
  )
}