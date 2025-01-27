import { betterFetch } from '@better-fetch/fetch';
import type { Session } from 'better-auth/types';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  const isAuthRoute =
    pathname === '/account/sign-in' || pathname === '/account/sign-up';
  const isProtectedRoute = pathname === '/' || pathname === '/account/settings';

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/account/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/',
    '/account/settings',
    '/account/sign-in',
    '/account/sign-up',
  ],
};
