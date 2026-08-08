import { ImageResponse } from 'next/og';
import { seoArticles } from '@/lib/seo-articles-data';

export const runtime = 'edge';
export const alt = 'رقمنة الجزائر — مقال';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Map slugs to emoji icons
const slugEmojis: Record<string, string> = {
  mdn: '🎖️',
  tawdhif: '📚',
  aadl3: '🏠',
  chifa: '🏥',
  startups: '🚀',
  dzds: '💻',
  bills: '💡',
  mobile: '📱',
  post: '📬',
  telecom: '📡',
  education: '🎓',
  university: '🏛️',
  orientation: '🗺️',
  employment: '💼',
  aadl: '🏠',
  socialSecurity: '🛡️',
  justice: '⚖️',
  health: '❤️',
  vehicles: '🚗',
  transport: '✈️',
  banking: '🏦',
  hajj: '🕌',
  investment: '📈',
  foreignAffairs: '🌍',
  insurance: '🔒',
  tax: '📊',
  commerce: '🏪',
  autoEntrepreneur: '👔',
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleOGImage({ params }: Props) {
  const { slug } = await params;
  const article = seoArticles[slug];

  const title = article?.title ?? 'مقال رقمنة الجزائر';
  const intro = article?.introduction?.substring(0, 120) ?? '';
  const emoji = slugEmojis[slug] ?? '📖';

  // Trending slugs get special badge
  const trendingSlugs = ['mdn', 'tawdhif', 'aadl3', 'chifa', 'startups'];
  const isTrending = trendingSlugs.includes(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 60%, #0f172a 100%)',
          padding: '60px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* BG grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* TOP: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              🇩🇿
            </div>
            <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: 900 }}>رقمنة الجزائر</div>
          </div>

          {isTrending && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '100px',
                padding: '8px 18px',
              }}
            >
              <span style={{ fontSize: '16px' }}>🔥</span>
              <span style={{ color: '#f87171', fontSize: '14px', fontWeight: 800 }}>تريند عاجل 2026</span>
            </div>
          )}
        </div>

        {/* MIDDLE: Article title */}
        <div style={{ position: 'relative', display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
          {/* Big emoji */}
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '24px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '52px',
              flexShrink: 0,
            }}
          >
            {emoji}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '8px',
                padding: '5px 14px',
                width: 'fit-content',
              }}
            >
              <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 700 }}>
                📖 دليل رقمنة الجزائر
              </span>
            </div>

            <div
              style={{
                color: '#ffffff',
                fontSize: title.length > 60 ? '34px' : '42px',
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: '-1px',
              }}
            >
              {title.length > 80 ? title.substring(0, 80) + '...' : title}
            </div>

            {intro && (
              <div style={{ color: '#9ca3af', fontSize: '18px', lineHeight: 1.5 }}>
                {intro.length > 110 ? intro.substring(0, 110) + '...' : intro}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM: CTA bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '16px 24px',
            position: 'relative',
          }}
        >
          <div style={{ color: '#6b7280', fontSize: '16px' }}>
            www.raqmanadz.com/articles/{slug}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#10b981',
              borderRadius: '10px',
              padding: '10px 20px',
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: 800 }}>اقرأ الدليل الكامل</span>
            <span style={{ color: '#ffffff', fontSize: '16px' }}>←</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
