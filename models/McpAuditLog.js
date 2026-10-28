import mongoose from "mongoose";

/**
 * McpAuditLog Schema
 * One entry per tool call an AI agent makes through the admin MCP server.
 */
const mcpAuditLogSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    token: { type: mongoose.Schema.Types.ObjectId, ref: "McpToken" },
    clientName: { type: String, default: "" },
    tool: { type: String, required: true },
    readOnly: { type: Boolean, default: true },
    // Underlying API request, when the tool called one
    method: { type: String, default: null },
    path: { type: String, default: null },
    input: { type: String, default: "" },
    status: { type: Number, default: null },
    ok: { type: Boolean, default: true },
    error: { type: String, default: null },
    durationMs: { type: Number, default: 0 },
  },
  { timestamps: true },
);

mcpAuditLogSchema.index({ createdAt: -1 });

export default mongoose.models.McpAuditLog ||
  mongoose.model("McpAuditLog", mcpAuditLogSchema);
