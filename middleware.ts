import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { $fetchClient } from './lib/client';

const privateRoutes = ['/user/me', '/devices', '/settings'];
const authRoutes = ['/app/login', '/register'];
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;
  
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL('/app/login', request.url));
  }

  if (token) {
    const server = await $fetchClient.GET('/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if(server.data) {
      // Check admin route access
      if (isAdminRoute && server.data.user?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const response = NextResponse.next();
      console.log(server.data);
      const userInfo = Buffer.from(JSON.stringify(server.data)).toString('base64');
      response.headers.set('x-user-info', userInfo);
      return response;
    }

    // If no user data but trying to access admin
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // No token and trying to access admin route
  if (isAdminRoute) {
    return NextResponse.redirect(new URL('/app/login', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    /*
     * Match tất cả các request trừ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
