import fallbackTools from "../data/fallbackTools";
import { slugify } from "./utils";

// Records created before tags/taglines existed come back from the API without them.
// Fill those blanks (only blanks) from the curated catalog, then from category defaults,
// so every tool has a useful "Good for" list. Pricing and descriptions are never
// overridden here: the database stays the source of truth for facts.
const CATALOG = new Map(fallbackTools.map((t) => [t.slug, t]));

const CATEGORY_USES = {
  Chatbot: ["answering questions", "brainstorming", "drafting"],
  "Writing Assistant": ["editing", "copywriting", "proofreading"],
  "Image Generation": ["illustrations", "concept art", "social graphics"],
  "Video Generation": ["short videos", "editing", "social content"],
  "Audio & Voice": ["voiceovers", "transcription", "music"],
  "Code Assistance": ["coding", "debugging", "prototyping"],
  Productivity: ["meetings", "notes", "automation"],
  Research: ["research", "summaries", "citations"],
  Design: ["ui design", "graphics", "branding"],
  Marketing: ["copywriting", "campaigns", "seo"],
  Translation: ["translation", "localization", "documents"],
};

// Placeholder-image services (the old site used via.placeholder.com, which is now dead and
// neither loads nor errors cleanly). Treat them as "no logo" so the real site icon is used.
const PLACEHOLDER_IMAGE = /(^|\.)(placeholder\.com|placehold\.co|placehold\.it|dummyimage\.com)\//i;

export function enrichTool(tool) {
  if (!tool) return tool;
  const hasTags = Array.isArray(tool.tags) && tool.tags.length > 0;
  const badImage = Boolean(tool.image) && PLACEHOLDER_IMAGE.test(tool.image.replace(/^https?:\/\//, ""));
  if (hasTags && tool.tagline && !badImage) return tool;
  const ref = CATALOG.get(tool.slug || slugify(tool.name));
  return {
    ...tool,
    image: badImage ? "" : tool.image,
    tagline: tool.tagline || ref?.tagline || "",
    tags: hasTags ? tool.tags : ref?.tags?.length ? ref.tags : CATEGORY_USES[tool.category] || [],
  };
}

export const enrichTools = (tools) => (Array.isArray(tools) ? tools.map(enrichTool) : tools);
