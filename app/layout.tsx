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
  title: 'Raqmana - رقمنة | البوابة الجزائرية للخدمات الرقمية',
  description: 'اكتشف أكثر من 280 خدمة رقمية حكومية في مكان واحد. Discover over 280 Algerian government digital services in one place.',
  generator: 'Raqmana',
  keywords: ['Algeria', 'digital services', 'government', 'e-government', 'الجزائر', 'خدمات رقمية', 'حكومة إلكترونية'],
  authors: [{ name: 'Raqmana' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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