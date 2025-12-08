import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    message: String,

    reply: String,

    status: {
      type: String,
      enum: ["open", "answered", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const Support = mongoose.models.Support || mongoose.model("Support",supportSchema);

export default Support


