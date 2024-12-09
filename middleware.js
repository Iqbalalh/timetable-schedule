import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Define protected paths based on user roles
  const adminPaths = ['/dashboard'];
  const nonAdminPaths = ['/lecturer'];
  const apiPaths = ['/api'];
  const publicApiPaths = ['/api/auth'];
  const homePagePath = '/'; // Path for the home page

  // Check if the request is for a protected route (API or pages)
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  const isNonAdminPath = nonAdminPaths.some((path) => pathname.startsWith(path));
  const isApiPath = apiPaths.some((path) => pathname.startsWith(path));
  const isPublicApiPath = publicApiPaths.some((path) => pathname.startsWith(path));
  const isHomePage = pathname === homePagePath;

  // Get the token from the request (using next-auth JWT)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Handle home page redirection for logged-in users
  if (token && isHomePage) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow access to public API routes without authentication
  if (isPublicApiPath) {
    return NextResponse.next();
  }

  if (token) {
    const { role } = token;

    // Block non-admin users from accessing admin paths
    if (isAdminPath && role !== 'admin') {
      const forbiddenUrl = new URL('/403', req.url);
      return NextResponse.redirect(forbiddenUrl);
    }

    // Block admin users from accessing non-admin paths
    if (isNonAdminPath && role === 'admin') {
      const forbiddenUrl = new URL('/403', req.url);
      return NextResponse.redirect(forbiddenUrl);
    }

    // Allow API access only for logged-in users
    if (isApiPath) {
      return NextResponse.next();
    }

    // Continue to the requested route if the user has appropriate access
    return NextResponse.next();
  }

  // If no token is present and the request is for an API route
  if (isApiPath) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // If no token is present and the request is for a protected page route
  if (isAdminPath || isNonAdminPath) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Match both page routes and API routes
export const config = {
  matcher: ['/dashboard/:path*', '/lecturer/:path*', '/api/:path*', '/'],
};
