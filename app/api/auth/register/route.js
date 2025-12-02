import { connectDB } from "@/lib/connectDB";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  await connectDB();

  try {
    const { name, email, password, phone, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    if (!role || !["customer", "seller"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    let user = await User.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); 

    if (user) {
      if (user.isVerified) {
        return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
      } else {
        user.password = password; 
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = expiryDate;
        user.role = role;
        user = await user.save(); 
      }
    } else {
      user = new User({ name, email, password, phone, role, verifyCode, verifyCodeExpiry: expiryDate, isVerified: false });
      user = await user.save(); 
    }

    await sendEmail({
      to: email,
      subject: "Verify your account",
      text: `Your verification code is: ${verifyCode}`,
      html: `<p>Your verification code is: <b>${verifyCode}</b></p>`,
    });

    return NextResponse.json({ success: true, message: "User registered successfully. Verification email sent." }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
