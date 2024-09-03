import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  // Define the paths that require authentication
  const protectedPaths = ['/dashboard', '/dashboard-lecturer'];
  const { pathname } = req.nextUrl;

  // Check if the request is for a protected route
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedRoute) {
    // Get the token from the request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If there's no token, redirect to the login page
    if (!token) {
      const loginUrl = new URL('/', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue to the requested route if authenticated or not a protected route
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard-lecturer/:path*'],
};
