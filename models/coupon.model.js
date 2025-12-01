import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },

    discountPercent: Number,

    maxUsage: Number,

    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    validFrom: Date,
    validTo: Date,

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon",couponSchema)

export default Coupon;