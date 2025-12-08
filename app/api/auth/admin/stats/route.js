import { getAuthUser, requireRole } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(){

  const user =  getAuthUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if(!requireRole(user,['admin'])) return NextResponse.json({success:false,message:"Forbidden"},{status:403})
    return NextResponse.json({ stats: "Secret admin data" });

}