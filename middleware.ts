// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Define public paths that don't require auth
  const publicPaths = ["/login", "/register", "/api/auth"];

  // Handle root "/" explicitly:
  if (pathname === "/") {
    if (token) {
      // Redirect based on user role in token
      if (token.role === "admin") {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
      }
      if (token.role === "customer") {
        const url = req.nextUrl.clone();
        url.pathname = "/browse";
        return NextResponse.redirect(url);
      }
      // Default fallback, stay on /
      return NextResponse.next();
    }
    // No token, allow access to "/"
    return NextResponse.next();
  }

  // Allow access to public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Protect these routes: redirect unauthenticated users to login
  const protectedMatchers = [
    "/dashboard",
    "/admin",
    "/orders",
    "/parts",
  ];
  if (
    protectedMatchers.some((protectedPath) => pathname.startsWith(protectedPath)) &&
    !token
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",                   // match root explicitly for redirect
    "/dashboard/:path*",
    "/admin/:path*",
    "/orders/:path*",
    "/parts/:path*",
  ],
};
