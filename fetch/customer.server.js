import mongoose from "mongoose";
import User from "@/models/user.model";

export const getCustomerdata = async (userId) => {
  const user= await User.findById(
   { _id:new mongoose.Types.ObjectId(userId)}
  ).select("name email phone").lean();
  console.log("get customer data",user)
  return user
};
