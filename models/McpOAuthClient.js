import mongoose from "mongoose";

/**
 * McpOAuthClient Schema
 * OAuth clients (e.g. Claude, ChatGPT) registered through dynamic client
 * registration so they can connect to the admin MCP server.
 */
const mcpOAuthClientSchema = mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true },
    clientName: { type: String, trim: true, default: "AI connector" },
    redirectUris: { type: [String], default: [] },
    tokenEndpointAuthMethod: {
      type: String,
      enum: ["none", "client_secret_post", "client_secret_basic"],
      default: "none",
    },
    clientSecretHash: { type: String, default: null, select: false },
  },
  { timestamps: true },
);

export default mongoose.models.McpOAuthClient ||
  mongoose.model("McpOAuthClient", mcpOAuthClientSchema);
