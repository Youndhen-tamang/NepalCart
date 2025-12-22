import { getAuthUser, requireCustomer } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Cart from "@/models/cart.model";
import Product from "@/models/product.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    await connectDB();
    const user  = await getAuthUser();
    if(!user){
      return NextResponse.json({
        success:false,message:"User not found"
      });
    }
    console.log("Add to cart testing1",requireCustomer(user.role))

  if(!requireCustomer(user)){
    return NextResponse.json({
      success:false,message:"Unauthorized"
    });
  }
  console.log("Add to cart testing2")
  const {productId,quantity =1} = await request.json();

  if(!mongoose.Types.ObjectId.isValid(productId)){
    return Response.json(
      { message: "Invalid product ID" },
      { status: 400 }
    );
  }

  const product =  await Product.findById(productId);
  if (!product || !product.isActive) {
    return Response.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  if(product.stock<quantity){
    return Response.json(
      { message: "Not enough stock" },
      { status: 400 }
    );
  }

  let cart =await Cart.findOne({userId:new mongoose.Types.ObjectId(user.id)});

  if(!cart){
    cart = new Cart({
      userId:new mongoose.Types.ObjectId(user.id),
      items:[],
      total:0
    })
  }

  const itemIndex =  cart.items.findIndex(
    (items)=>items.productId.toString() === productId
  )

  const price =  product.discountPrice || product.price

    if(itemIndex >-1){
      cart.items[itemIndex].quantity +=  quantity;
    }else{
      cart.items.push({
        productId: product._id,
        quantity,
        price
      })
    }

    cart.total = cart.items.reduce(
      (sum,item) => sum + item.quantity * item.price,
      0
    )

    await cart.save();

    return Response.json({
      success:true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { 
        success:false,
        message: "Something went wrong" },
      { status: 500 }
    );
  }
}