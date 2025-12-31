import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip Supabase auth for now - just pass through
  // TODO: Re-enable once Supabase is configured
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
