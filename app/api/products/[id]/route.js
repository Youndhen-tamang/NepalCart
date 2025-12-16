import { getAuthUser, requireSeller } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Product from "@/models/product.model";
import Store from "@/models/store.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";



export async function PATCH(request,context) {
  try {
    await connectDB();
    const user =  await getAuthUser();
    const {id} = await context.params;
    console.log("this is suer ",user)
    if(!requireSeller(user)){
      return NextResponse.json({success:false,message:"Unauthorized"},
        {status:401}
      );
    }
    console.log("product id",id)
    console.log("STORE CHECK DATA:", {
      storeId: user.storeId,
      userId: user.id,
    });
    
    const store  =  await Store.findOne({
      _id: new mongoose.Types.ObjectId(user.storeId),
      owner: new mongoose.Types.ObjectId(user.id)
    })
    console.log("STORE found", 
      store
    );
    
    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store ownership mismatch" },
        { status: 403 }
      );
    }
    const body = await request.json();

    const allowedUpdates = [
      "title",
      "description",
      "price",
      "discountPrice",
      "images",
      "categoryId",
      "slug",
      "stock",
      "status",
    ]
    const updates={};

    for(const key of allowedUpdates){
      if(body[key]!== undefined){
        updates[key] = body[key];
      }
    }

    const product = await Product.findOneAndUpdate({
      _id:new mongoose.Types.ObjectId(id),
      sellerId:new mongoose.Types.ObjectId(user.id),
      storeId:new mongoose.Types.ObjectId(user.storeId)
    },updates,{new:true});
    if(!product){
      return NextResponse.json({
        success:false,
        message:"Product not found or access denied"
      },{status:400})
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("EDIT PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(context) {
  try {
    await connectDB();
    const user =  await getAuthUser();
    const {id} = await context.params;
    if(!requireSeller(user)){
      return NextResponse.json({
        success:false,
        message:"Unauthorized"
      },{status:401})
    }

    const store =  await Store.findOne({
      _id:new mongoose.Types.ObjectId(user.storeId),
      owner: new mongoose.Types.ObjectId(user.id)
    })
    if(!store){
      return NextResponse.json({
        success:false,
        message:"Store ownership mismatch"
      },{status:400})
    }

    const product =  await Product.findOneAndDelete({
      sellerId: new mongoose.Types.ObjectId(user.id),
      storeId: new mongoose.Types.ObjectId(user.storeId),
      _id: new mongoose.Types.ObjectId(id),
    })

    if(!product){
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    await Store.findByIdAndUpdate(user.storeId,{
      $inc:{totalProducts: -1},
    })

    return NextResponse.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}



