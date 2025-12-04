import { clearAuthCookies } from "@/lib/cookies";
import { NextResponse } from "next/server";


export async function POST() {
    try {
      await clearAuthCookies();
      return NextResponse.json({success:true,message:"Logged out successfully"},{status:200})
    } catch (error) {
      console.log("Logout Error",error)
      return NextResponse.json({success:false,message:"Internal Server error"},{status:500})
    }
}