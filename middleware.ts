import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/studio")) {
    url.pathname = `/studio/[[...tool]]`;
    return NextResponse.rewrite(url);
  }

  // if (url.pathname.startsWith("/admin") && token?.role !== "admin") {
  //   url.pathname = "/unauthorized";
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/admin/:path*"],
};
