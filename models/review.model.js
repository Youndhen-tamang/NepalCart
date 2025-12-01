import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    rating: { type: Number, required: true },
    comment: String,
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model(Review,reviewSchema);
export default Review;
