import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";
const domain = process.env.COOKIE_DOMAIN || undefined;

export function setTokenCookies({ accessToken, refreshToken }) {
  const cookieStore = cookies();

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
    domain: domain
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 60 * 60 * 24 * 7,
    domain: domain
  });
}

export function clearAuthCookies() {
  const cookieStore = cookies();

  cookieStore.set("access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0
  });

  cookieStore.set("refresh_token", "", {
    httpOnly: true,
    path: "/api/auth/refresh",
    maxAge: 0
  });
}
