// @ts-nocheck
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Deixa passar: página de aguarde, arquivos (fotos, logos) e sistema
  if (
    pathname === '/aguarde' || 
    pathname.includes('.') || 
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // 2. Bloqueia o resto e joga para /aguarde
  const url = request.nextUrl.clone();
  url.pathname = '/aguarde';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Aplica em tudo exceto:
     * - api
     * - arquivos estáticos (_next/static, _next/image, favicon.ico, logo.png)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};