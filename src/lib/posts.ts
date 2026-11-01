// Shared rules for grouping writing, used by the homepage and the /blog page.
const AGENT_TAGS = ["ai-agents", "ai-security", "agent-observability", "agent-infrastructure", "agent-evaluation", "llm-cost", "mcp"];

type PostLike = { data: { tags?: string[] } };

export const isAgentNote = (post: PostLike) => post.data.tags?.some((tag) => AGENT_TAGS.includes(tag)) ?? false;

export const isPersonal = (post: PostLike) =>
  post.data.tags?.includes("year-in-review") || post.data.tags?.includes("personal") || false;
