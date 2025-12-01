import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true,
  },
  slug:{
    type:String,
    required:true,
    unique:true,
  },
  parentCategoryId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    default:null,
  },
  image:String,
},{timestamps:true})

const Category = mongoose.models.Category || mongoose.model("Category",categorySchema)
export default Category;