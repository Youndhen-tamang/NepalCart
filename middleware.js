import { verifyAccessToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;
  const publicRoutes = ["/login", "/register", "/verify"];
  console.log("Token in middleware:", token);
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      try {
        verifyAccessToken(token);
        return NextResponse.redirect(new URL("/", request.url));
      } catch (error) {}
    }
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/store") ||
    pathname.startsWith("/customer")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = verifyAccessToken(token);
      if (pathname.startsWith("/admin") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/customer", request.url));
      }
      if (pathname.startsWith("/store") && payload.role !== "seller") {
        return NextResponse.redirect(new URL("/customer", request.url));
      }

      if (pathname.startsWith("/customer") && payload.role !== "customer") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      
    } catch (error) {
      console.log("Error in MidleWare", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-code",
    "/admin/:path*",
    "/store/:path*",
    "/customer/:path*",
  ],
};

