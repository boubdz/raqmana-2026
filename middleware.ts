import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * CRITICAL SEO FIX: Redirect old Vercel domain to new custom domain.
 * Google was picking raqmana.vercel.app as the canonical because it still served content.
 * This middleware ensures all traffic to raqmana.vercel.app gets 308 redirected.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  if (host.includes('raqmana.vercel.app')) {
    const url = request.nextUrl.clone();
    url.host = 'www.raqmanadz.com';
    url.protocol = 'https:';
    url.port = '';
    // 308 Permanent Redirect — tells Google this is permanent and to transfer all PageRank
    return NextResponse.redirect(url, { status: 308 });
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

