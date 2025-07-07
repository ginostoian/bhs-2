import mongoose from "mongoose";

const emailErrorSchema = new mongoose.Schema({
  error: { type: String, required: true },
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const emailStatsSchema = new mongoose.Schema(
  {
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    errors: [emailErrorSchema],
  },
  {
    timestamps: true,
  },
);

// Ensure we only have one stats document
emailStatsSchema.statics.getOrCreate = async function () {
  let stats = await this.findOne();
  if (!stats) {
    stats = new this();
    await stats.save();
  }
  return stats;
};

const EmailStats =
  mongoose.models.EmailStats || mongoose.model("EmailStats", emailStatsSchema);

export default EmailStats;
