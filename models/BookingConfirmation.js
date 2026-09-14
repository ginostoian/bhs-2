import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    _id: String,
    startTime: Date,
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
    source: { type: String, default: "cal-webhook" },
  },
  { timestamps: true },
);
export default mongoose.models.BookingConfirmation ||
  mongoose.model("BookingConfirmation", schema);
