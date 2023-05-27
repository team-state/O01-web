import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/api/image') {
    request.headers.set(
      'Authorization',
      `Bearer ${process.env.CLOUDFLARE_IMAGE_API_TOKEN}`,
    );
    return NextResponse.rewrite(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      { request: { headers: request.headers } },
    );
  }

  return NextResponse.next();
}
