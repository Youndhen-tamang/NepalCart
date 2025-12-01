import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

    provider: {
      type: String,
      enum: ["Stripe", "Khalti", "eSewa", "COD"],
    },

    transactionId: String,

    amount: Number,

    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);
 const Payment = mongoose.models.Payment || mongoose.model("Payment",paymentSchema);
export default Payment;
