import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";


  export async function GET() {
    
    const user = getAuthUser();

    if(!user){
      return NextResponse.json({success:false,message:"Unauthorized"},{status:401})
    }
    return NextResponse.json({ user });

  }