import { NextResponse } from "next/server";


export default async function verifyCode({email,code}) {

  try {
    const res = await fetch("/api/auth/verify",{
      method:"POST",
      body:JSON.stringify({email,code})
    })
    const data =  await res.json();
    return data
  } catch (error) {
      console.log("Verification failed",error)
      return NextResponse.json({success:false,message:error.message},{status:400})
  }

}