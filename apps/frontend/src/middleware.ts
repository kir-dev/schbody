import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getRoleFromJwt } from './lib/utils';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const jwt = request.cookies.get('jwt');
  const role = getRoleFromJwt(jwt?.value);
  if (
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/applications') ||
    request.nextUrl.pathname.startsWith('/application-form')
  ) {
    if (role === 'UNAUTHORIZED') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/periods')) {
    if (role === 'BODY_MEMBER' || role === 'BODY_ADMIN') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/profile', '/application-form', '/periods', '/applications'],
};
