import AiAgentsClient from "./components/AiAgentsClient";

export const metadata = { title: "AI agents | Admin" };

/**
 * Admin AI Agents Page
 * Connect Claude, ChatGPT and other AI assistants to the dashboard via MCP,
 * manage their access and review what they've done.
 */
export default function AdminAiAgentsPage() {
  return <AiAgentsClient />;
}
