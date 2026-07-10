import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const crmViewSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    filters: { type: mongoose.Schema.Types.Mixed, default: {} },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);
crmViewSchema.plugin(toJSON);
crmViewSchema.index({ owner: 1, name: 1 }, { unique: true });
export default mongoose.models.CRMView ||
  mongoose.model("CRMView", crmViewSchema);
