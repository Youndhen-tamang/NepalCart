import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";
const domain = process.env.COOKIE_DOMAIN || undefined;

export async function setTokenCookies({ accessToken, refreshToken }) {
  const cookieStore = await  cookies();

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
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    domain: domain
  });
}

export async function  clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set("access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0
  });

  cookieStore.set("refresh_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0
  });
}
