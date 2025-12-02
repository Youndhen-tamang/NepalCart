import { connectDB } from "@/lib/connectDB";
import { setTokenCookies } from "@/lib/cookies";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing credentials" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: "Wrong password" },
        { status: 401 }
      );
    }

    // Optional: check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your email first" },
        { status: 403 }
      );
    }

    const payload = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: user._id.toString() });

    setTokenCookies({ accessToken, refreshToken });

    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json({ success: true, user: userObj }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
