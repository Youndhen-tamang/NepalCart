import { clearAuthCookies } from "@/lib/cookies";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    clearAuthCookies(res); 
    return res;
  } catch (error) {
    console.log("Logout Error", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
