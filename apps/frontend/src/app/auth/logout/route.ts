import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete('jwt');

  return NextResponse.redirect(new URL('/', request.url));
}
