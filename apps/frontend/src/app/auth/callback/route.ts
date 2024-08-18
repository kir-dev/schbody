import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const jwt = request.nextUrl.searchParams.get('jwt');

  if (!jwt) {
    return new Response('Missing jwt query parameter', { status: 400 });
  }

  cookies().set('jwt', jwt, { path: '/' });

  return NextResponse.redirect(new URL('/', request.url));
}
