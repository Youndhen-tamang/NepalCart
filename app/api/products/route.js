import { getAuthUser, requireSeller } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Product from "@/models/product.model";
import Store from "@/models/store.model";
import { NextResponse } from "next/server";


export async function POST(request) {
  
  try {
    await connectDB()
    const user = await  getAuthUser();
    console.log("THIS IS USER iN PRODUCT TSETING",user);
    if(!requireSeller(user)){
      return NextResponse.json({success:false,message:'unauthorized'},{status:401})
    }

    const body = await request.json();

    const product =  await Product.create({
      ...body,
      sellerId:user._id,
      storeId:user.storeId
    })
    await Store.findByIdAndUpdate(user.storeId,{
      $inc:{totalProducts:1}
    });
    return NextResponse.json({success:true,message:'Product created successfully',product},{status:201})
  } catch (error) {
    console.error("Product creation error:", error);

    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}