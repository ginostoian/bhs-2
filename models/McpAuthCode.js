import mongoose from "mongoose";

/**
 * McpAuthCode Schema
 * Short-lived OAuth authorization codes (PKCE) issued when an admin approves
 * an AI connector. Expired codes are removed by a TTL index.
 */
const mcpAuthCodeSchema = mongoose.Schema(
  {
    codeHash: { type: String, required: true, unique: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "McpOAuthClient",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    redirectUri: { type: String, required: true },
    codeChallenge: { type: String, required: true },
    scopes: { type: [String], default: ["read", "write"] },
    resource: { type: String, default: null },
    usedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

mcpAuthCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.McpAuthCode ||
  mongoose.model("McpAuthCode", mcpAuthCodeSchema);
