import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },

    discountPercent: Number,

    maxUsage: Number,

    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    validFrom: Date,
    validTo: Date,
    usedCount:{type:Number,default:0},
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon",couponSchema)

export default Coupon;