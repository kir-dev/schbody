import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  cookies().delete('jwt');

  return NextResponse.redirect(new URL('/', request.url));
}
