import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    orderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        price: Number,
        qty: Number,
      }
    ],

    totalAmount: Number,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "packed", "shipped", "delivered"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Khalti", "Stripe", "eSewa"],
      default: "COD",
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      district: String,
      zip: String,
      country: { type: String, default: "Nepal" },
    },

    trackingId: String,
    discountCode: String,
    shippingCost: Number,
    invoicePdfUrl: String,
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order; 