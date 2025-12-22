import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Cart from "@/models/cart.model";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const {
      mode,
      productId,
      quantity = 1,
      paymentMethod,
      shippingAddress,
    } = await request.json({});
    let orderItems = [];
    let totalAmount = 0;

    if (mode === "cart") {
      const cart = await Cart.findOne({
        userId: new mongoose.Types.ObjectId(user.id),
      });
      if (!cart || cart.items.length === 0) {
        return Response.json({ message: "Cart empty" }, { status: 400 });
      }
      for (const item of cart.items) {
        const product = await Product.findOne({
          _id: new mongoose.Types.ObjectId(productId),
        });
        if (!product || !product.isActive) {
          return Response.json(
            { message: `${item.productId} unavailable` },
            { status: 400 }
          );
        }
        if (product.stock < item.quantity) {
          return NextResponse.json({
            message: `${item.title} is out of stock`,
          });
        }
        orderItems.push({
          productId: new mongoose.Types.ObjectId(productId),
          storeId: product.storeId,
          price: item.price,
          qty: item.quantity,
        });

        totalAmount += item.price * item.quantity;
      }
    } else if (mode === "direct") {
      if (!productId)
        return NextResponse.json({
          success: false,
          message: "Product id is required",
        });
      const product = await Product.findOne({
        _id: new mongoose.Types.ObjectId(productId),
      });

      if (!product || !product.isActive)
        return NextResponse.json(
          { message: "Product Unavailable" },
          { status: 400 }
        );
      if (product.stock < quantity)
        return NextResponse.json(
          {
            message: product.stock > 0 ? "Not enough stock" : "Out of stock",
          },
          { status: 400 }
        );

        const price  =  product.discountPrice || product.price
        orderItems.push({
          productId: product._id,
          store: product.storeId,
          qty: quantity,
          price
        });
        totalAmount = price * quantity;
    }

    const order = await Order.create({
      userId:new mongoose.Types.ObjectId(user.id),
      orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus:"pending",
      orderStatus:"pending",
      shippingAddress
    })

    if(paymentMethod ==="COD"){
      for(const item of orderItems){
        await Product.findOneAndUpdate(item.productId,{
          $inc:{stock:-item.qty, soldCount:item.qty}
        });
      }
      await Order.findOneAndUpdate(order._id,{
        paymentStatus:"paid",
        orderStatus:"confirmed"
      })

      return NextResponse.json({success:true,message:"Order placed successfully (COD)",orderId:order._id},{status:200})
    }

    return NextResponse.json({
      success:true,
      message:"Order created, proceed to payment",
      amount: totalAmount,
      paymentMethod
    })


  } catch (error) {
    console.log(error)
    return Response.json({message:"Checkout failed"}, {status:500});
  }
}
