import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  storeId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Store"
  },
  sellerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
title:{
  type:String,
  required:true,
},
slug:{
  type:String,
  required:true,
  unique:true,
},
description:{
  type:String,
  required:true,
},
price:{
  type:Number,
  required:true,
},
categoryId:{type:mongoose.Schema.Types.ObjectId,
  ref:"Category",
},
brand:String,
discountPrice:Number,
stock:{type:Number,default:0},
images: [String],

sku: String,

ratings: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }
],

tags: [String],

sizes: [String],
colors: [String],

variants: [
  {
    size: String,
    color: String,
    stock: Number,
    price: Number,
  }
],

soldCount: { type: Number, default: 0 },

isFeatured: { type: Boolean, default: false },

seoTitle: String,
seoDescription: String,
},
{
timestamps:true
})

const Product = mongoose.models.Product || mongoose.model("Product",productSchema);
export default Product ;
