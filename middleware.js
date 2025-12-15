import { verifyAccessToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/register", "/verify"];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      try {
        verifyAccessToken(token);
        return NextResponse.redirect(new URL("/", request.url));
      } catch {}
    }
    return NextResponse.next();
  }

  const protectedPrefixes = ["/admin", "/store", "/customer", "/create-store"];
  if (!protectedPrefixes.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/customer", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/store")) {
    // Let the server-side layout decide whether the seller has a store.
    if (payload.role !== "seller") {
      return NextResponse.redirect(new URL("/customer", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/create-store")) {
    // Only sellers can access create-store. Whether they already
    // have a store is validated in the page itself using the DB.
    if (payload.role !== "seller") {
      return NextResponse.redirect(new URL("/customer", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/customer")) {
    if (payload.role !== "customer") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
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
    "/create-store",
  ],
};
