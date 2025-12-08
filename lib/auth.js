import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token =  cookieStore.get("access_token")?.value;
  console.log("Server token:", token);

  if (!token) return null;

  try {
    return verifyAccessToken(token); 
  } catch {
    return null;
  }
}

export function requireRole(user, allowedRoles = []) {
  return user && allowedRoles.includes(user.role);
}
 