// Keep in sync with Frontend/src/lib/constants.js
export const CATEGORIES = [
  "Chatbot",
  "Writing Assistant",
  "Image Generation",
  "Video Generation",
  "Audio & Voice",
  "Code Assistance",
  "Productivity",
  "Research",
  "Design",
  "Marketing",
  "Translation",
];

export const PRICING = ["Free", "Freemium", "Paid"];

export const TOOL_STATUS = ["pending", "approved", "rejected"];

// Documents created before moderation existed have no `status` field;
// treat them as approved.
export const PUBLIC_TOOL_FILTER = { status: { $nin: ["pending", "rejected"] } };
