import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Define paths based on user roles
  const adminPaths = ['/dashboard'];
  const nonAdminPaths = ['/lecturer'];

  // Check if the request is for a protected route
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  const isNonAdminPath = nonAdminPaths.some((path) => pathname.startsWith(path));

  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    const { userRole } = token;

    // Block non-admin users from accessing admin paths
    if (isAdminPath && userRole !== 'admin') {
      const forbiddenUrl = new URL('/403', req.url);
      return NextResponse.redirect(forbiddenUrl);
    }

    // Block admin users from accessing non-admin paths
    if (isNonAdminPath && userRole === 'admin') {
      const forbiddenUrl = new URL('/403', req.url);
      return NextResponse.redirect(forbiddenUrl);
    }

    // Continue to the requested route if the user has appropriate access
    return NextResponse.next();
  }

  // If no token is present and the request is for a protected route
  if (isAdminPath || isNonAdminPath) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/lecturer/:path*'],
};
