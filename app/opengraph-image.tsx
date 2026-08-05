import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'رقمنة الجزائر 2026 - البوابة الوطنية للخدمات الرقمية';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0f172a 100%)',
          padding: '60px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.04) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Green glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Blue glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* TOP: Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            🇩🇿
          </div>
          <div>
            <div style={{ color: '#ffffff', fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>
              رقمنة الجزائر
            </div>
            <div style={{ color: '#6b7280', fontSize: '16px', fontWeight: 500 }}>
              raqmana.vercel.app
            </div>
          </div>
        </div>

        {/* MIDDLE: Main headline */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '100px',
              padding: '6px 16px',
              width: 'fit-content',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
              }}
            />
            <span style={{ color: '#10b981', fontSize: '14px', fontWeight: 700 }}>
              البوابة الوطنية الشاملة للخدمات الرقمية 2026
            </span>
          </div>

          <div
            style={{
              color: '#ffffff',
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-2px',
            }}
          >
            كل الخدمات الرقمية
            <br />
            <span style={{ color: '#10b981' }}>في مكان واحد ⚡</span>
          </div>

          <div style={{ color: '#9ca3af', fontSize: '22px', fontWeight: 400, marginTop: '8px' }}>
            267+ خدمة حكومية • روابط مباشرة • بدون إعلانات
          </div>
        </div>

        {/* BOTTOM: Stats bar */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            position: 'relative',
          }}
        >
          {[
            { icon: '🏛️', label: 'فئة رسمية', value: '42+' },
            { icon: '🔗', label: 'خدمة مباشرة', value: '267+' },
            { icon: '🇩🇿', label: 'للجزائريين', value: '100%' },
            { icon: '⚡', label: 'مجاني دائماً', value: '✓' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '12px 20px',
              }}
            >
              <span style={{ fontSize: '24px' }}>{stat.icon}</span>
              <div>
                <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 900 }}>{stat.value}</div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
