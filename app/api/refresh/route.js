import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import { setTokenCookies } from "@/lib/cookies";

export async function POST() {
  await connectDB();

  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token" },
      { status: 401 }
    );
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const payload = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    // Generate new tokens
    const newAccess = signAccessToken(payload);
    const newRefresh = signRefreshToken({ id: user._id.toString() });

    // Set cookies in App Router
    setTokenCookies({ accessToken: newAccess, refreshToken: newRefresh });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Refresh token error:", err);
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
