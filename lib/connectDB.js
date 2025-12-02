import mongoose from "mongoose";
import { NextResponse } from "next/server";

const URL = process.env.MONGODB_URL

if(!URL){
  return NextResponse.json({success:false,message:"Please Define MOGOUEL in .env"})
}

let cached = global.mongoose;

if(!cached) {
  cached = global.mongoose = {conn:null,promise:null}

}

export async function connectDB() {
  if(cached.conn) return cached.conn;
  if(!cached.promise){
    cached.promise = mongoose.connect(URL).then((mongoose)=>mongoose)
  }
  cached.conn = await cached.promise ;
  return cached.conn
}