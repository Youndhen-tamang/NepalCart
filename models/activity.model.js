const activitySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  details: Object,
}, { timestamps: true });
