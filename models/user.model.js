import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "customer", "seller"],
    },
    addresses: [
      {
        fullName: String,
        phone: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String, default: "Nepal" },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    googleId: String,

    profileImage: String,

  },
  { timestamps: true }
);


userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,12);
  next()
})

userSchema.methods.comparePassword = function (plain){
  return bcrypt.compare(plain,this.password)
}

const User =  mongoose.models.User || mongoose.model("User",userSchema)
export default User;