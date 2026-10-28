import connectMongoose from "@/libs/mongoose";
import McpAuditLog from "@/models/McpAuditLog";

const MAX_INPUT_CHARS = 4000;

// Large inputs (base64 uploads, full quote bodies) are trimmed for storage
const summariseInput = (input) => {
  try {
    const text = JSON.stringify(input, (key, value) =>
      key === "base64" && typeof value === "string"
        ? `<${value.length} base64 chars>`
        : value,
    );
    return text.length > MAX_INPUT_CHARS
      ? `${text.slice(0, MAX_INPUT_CHARS)}…`
      : text;
  } catch {
    return "";
  }
};

/** Record an agent tool call. Never throws — auditing must not break tools. */
export async function recordAudit({ ctx, tool, readOnly, input, ...rest }) {
  try {
    await connectMongoose();
    await McpAuditLog.create({
      user: ctx.user.id,
      token: ctx.tokenId,
      clientName: ctx.clientName,
      tool,
      readOnly,
      input: summariseInput(input),
      ...rest,
    });
  } catch (error) {
    console.error("Failed to record MCP audit log:", error);
  }
}
