import { connectDB } from "@/lib/connectDB";
import { setTokenCookies } from "@/lib/cookies";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import User from "@/models/user.model";
import { NextResponse } from "next/server";


export async function POST(request){
try {
  await connectDB();

  const {email,code} = await  request.json();
  if(!email || !code ){
    return NextResponse.json({success:false,message:"Missing data"},{status:400})
  }
  const user =  await User.findOne({email});

  if(!user){
    return NextResponse.json({succes:false, message:"User not found"},{status:404})
  }

  if(user.isVerified){
    return NextResponse.json({succes:false, message:"User already verified"},{status:400})
  }
  if(user.verifyCode !== code){
    return NextResponse.json({succes:false, message:"Invalid code"},{status:400})
  }

  if(user.verifyCodeExpiry < new Date() ){
    return NextResponse.json({succes:false, message:"Code Expired"},{status:400})

  }

  user.isVerified = true;
  user.verifyCode =null;
  user.verifyCodeExpiry = null;
  await user.save();

  const payload={
    id:user._id.toString(),
    email:user.email,
    role:user.role
  }

  const accessToken = signAccessToken(payload);
  const refreshToken =  signRefreshToken({id:user._id.toString()})

  setTokenCookies({accessToken,refreshToken})

  return NextResponse.json({
    success: true,
    message: "Account verified successfully",
    redirectTo:'/'
  },{status:200});} catch (error) {
    console.log("Verificaton Failed",error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
}
}