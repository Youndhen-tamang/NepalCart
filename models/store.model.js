import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  name: String,
  username: { type: String, unique: true }, // @greatstack
  description: String,

  email: String,
  phone: String,
  address: String,
  bannerImage: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  totalProducts: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },

}, { timestamps: true });

const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);
export default  Store;