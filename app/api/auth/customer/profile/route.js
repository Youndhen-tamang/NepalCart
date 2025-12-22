import { getAuthUser, requireCustomer } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getAuthUser();
    console.log("USER FROM TOKEN:", user);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    console.log("tis is rpifole ",user)
    if(!requireCustomer(user)){
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 } 
      );
    }
    console.log("testing ")
    const currentUser =  await User.findOne({
      _id:new mongoose.Types.ObjectId(user.id),
      email: user.email
    })

    return NextResponse.json({ success: true, currentUser });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    const user =  await getAuthUser();
    if(!user){
      return NextResponse.json({
        success:false,
        message:"User not found"
      },{status:401})
    }
    if(!requireCustomer(user)){
      return NextResponse.json({
         success:false,
         message:"Forbidden"
      },{status:400})
    }
    const currentuser =  await User.findOne({
      _id:new mongoose.Types.ObjectId(user.id),
      email:user.email,
    })
    if(!currentuser){
      return NextResponse.json({
        success:false,
        message:"Customer information missmatch"
      })
    }

    const body  =  await request.json();
    const allowedUpdates = [
      'name',
      'phone'
    ]

    const updates ={}

    for (const key of allowedUpdates){
      if(body[key] !== undefined){
        updates[key]= body[key]
      }
    }

    const updateUser = await User.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(user.id),
      email:user.email,
    },updates,{new:true})

    return NextResponse.json({
      success: true,
      message: "Profile successfully updated",
      updateUser,
    });

  } catch (error) {
    console.log("Edit user profile ERROR",error);
    return NextResponse.json({ success: false, message: "Internal server error" },
      { status: 500 })
  }
}
