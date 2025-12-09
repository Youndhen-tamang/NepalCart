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

    if(user.role === 'seller' && user.stoerId){
      payload.stoerId = user.stoerId.toString();
    }

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: user._id.toString() });

    const userObj = user.toObject();
    delete userObj.password;

    // IMPORTANT: Create response first
    const res = NextResponse.json({
      success: true,
      user: userObj,
    });

    // Set cookies ON response
    setTokenCookies(res, { accessToken, refreshToken });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
