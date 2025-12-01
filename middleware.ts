import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ADMIN_ROUTES = ['/admin-s4u-dashboard', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const acceptHeader = request.headers.get('accept') || '';
  const isPageRequest = acceptHeader.includes('text/html');

  if (!isPageRequest) {
    return NextResponse.next();
  }

  // Allow admin dashboard + login (and any nested routes under them)
  const isAdminRoute = ADMIN_ROUTES.some((prefix) => pathname.startsWith(prefix));
  if (isAdminRoute) {
    return NextResponse.next();
  }

  // Everything else (storefront pages) should redirect to the admin login
  const url = request.nextUrl.clone();
  url.pathname = '/admin';
  return NextResponse.redirect(url);
}

// Run middleware only for page routes (skip /api, /_next, assets, etc.)
export const config = {
  matcher: [
    '/((?!api/|_next/|_proxy/|_vercel/|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
