import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge Middleware: Handles domain canonicalization & legacy route redirects
 * intercepts both encoded and decoded Arabic URLs instantly at the edge
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // 1. Redirect old Vercel domain to custom domain
  if (host.includes('raqmana.vercel.app')) {
    const url = request.nextUrl.clone();
    url.host = 'www.raqmanadz.com';
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url, { status: 308 });
  }

  const pathname = request.nextUrl.pathname;
  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {}

  // 2. Redirect legacy sitemap link
  if (pathname === '/sitemap') {
    const url = request.nextUrl.clone();
    url.pathname = '/sitemap.xml';
    return NextResponse.redirect(url, { status: 308 });
  }

  // 3. Redirect legacy /jobs routes to /categories/mosbakat-toudif
  if (decodedPath.startsWith('/jobs')) {
    const url = request.nextUrl.clone();
    url.pathname = '/categories/mosbakat-toudif';
    return NextResponse.redirect(url, { status: 308 });
  }

  // 4. Redirect legacy service slugs from jobs refactoring
  if (decodedPath.startsWith('/services/')) {
    const slug = decodedPath.replace('/services/', '');
    if (slug.includes('سيرة') || slug.toLowerCase().includes('cv')) {
      const url = request.nextUrl.clone();
      url.pathname = '/cv-builder';
      return NextResponse.redirect(url, { status: 308 });
    }
    if (slug.includes('مسابق') || slug.includes('توظيف') || slug.includes('سوناطراك') || slug.includes('anem') || slug.includes('wassit')) {
      const url = request.nextUrl.clone();
      url.pathname = '/categories/mosbakat-toudif';
      return NextResponse.redirect(url, { status: 308 });
    }
    if (slug.includes('استمارة') || slug.includes('طلب-خطي')) {
      const url = request.nextUrl.clone();
      url.pathname = '/document-assistant';
      return NextResponse.redirect(url, { status: 308 });
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
