import mongoose from "mongoose";

/**
 * McpToken Schema
 * Credentials that let AI agents (Claude, ChatGPT, …) use the admin MCP server.
 * Covers personal access tokens created in the admin UI as well as the
 * access/refresh tokens issued through the OAuth flow. Only a SHA-256 hash of
 * each token is stored.
 */
const mcpTokenSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    kind: {
      type: String,
      enum: ["personal", "oauth_access", "oauth_refresh"],
      required: true,
    },
    tokenHash: { type: String, required: true, unique: true, select: false },
    // First characters of the token so admins can recognise it in the UI
    prefix: { type: String, default: "" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    scopes: { type: [String], default: ["read", "write"] },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "McpOAuthClient",
      default: null,
    },
    // Groups an OAuth grant's access + refresh tokens so they revoke together
    grantId: { type: String, default: null, index: true },
    expiresAt: { type: Date, default: null },
    lastUsedAt: { type: Date, default: null },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.models.McpToken ||
  mongoose.model("McpToken", mcpTokenSchema);
