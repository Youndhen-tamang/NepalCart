import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    role: { type: String, enum: ["admin", "customer", "seller"], default: "customer" },
    addresses: [{ fullName: String, phone: String, city: String, state: String, zip: String, country: { type: String, default: "Nepal" } }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    googleId: String,
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    isVerified: Boolean,
    verifyCode: String,
    verifyCodeExpiry: Date,
    profileImage: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
