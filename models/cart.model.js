import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',unique:true},
items:[
  {
    productId:{type:mongoose.Schema.Types.ObjectId,
      ref:"Product"
    },
    quantity:{type:Number,default:1,required:true},
    price:{type:Number,required:true}
  }
],
total:{type:Number,default:0},
guestToken:String,
},{timestamps:true})

const Cart =  mongoose.models.Cart|| mongoose.model('Cart',cartSchema)
export default Cart


