import {
  FiMessageSquare,
  FiEdit3,
  FiImage,
  FiVideo,
  FiMic,
  FiCode,
  FiZap,
  FiSearch,
  FiPenTool,
  FiTrendingUp,
  FiGlobe,
} from "react-icons/fi";

export const SITE_NAME = "AI Tools Hub";
export const SITE_TAGLINE = "The curated directory of AI tools";

// Keep names in sync with Backend/config/constants.js
export const CATEGORIES = [
  { name: "Chatbot", short: "Chatbots", icon: FiMessageSquare, blurb: "General-purpose assistants" },
  { name: "Writing Assistant", short: "Writing", icon: FiEdit3, blurb: "Draft, edit and polish text" },
  { name: "Image Generation", short: "Images", icon: FiImage, blurb: "Create and edit visuals" },
  { name: "Video Generation", short: "Video", icon: FiVideo, blurb: "Generate and edit video" },
  { name: "Audio & Voice", short: "Audio", icon: FiMic, blurb: "Voice, music, transcription" },
  { name: "Code Assistance", short: "Coding", icon: FiCode, blurb: "Write and ship software" },
  { name: "Productivity", short: "Productivity", icon: FiZap, blurb: "Meetings, docs, automation" },
  { name: "Research", short: "Research", icon: FiSearch, blurb: "Search, cite, summarize" },
  { name: "Design", short: "Design", icon: FiPenTool, blurb: "UI, graphics, branding" },
  { name: "Marketing", short: "Marketing", icon: FiTrendingUp, blurb: "Copy, campaigns, SEO" },
  { name: "Translation", short: "Translation", icon: FiGlobe, blurb: "Translate text and docs" },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const getCategory = (name) =>
  CATEGORIES.find((c) => c.name === name) ?? { name, short: name, icon: FiZap, blurb: "" };

export const PRICING = ["Free", "Freemium", "Paid"];

// Quiet status dots. Paid is neutral so nothing competes with the brand accent.
export const PRICING_DOT = {
  Free: "bg-emerald-500",
  Freemium: "bg-sky-500",
  Paid: "bg-fg-subtle",
};

export const PRICING_NOTES = {
  Free: "Completely free to use.",
  Freemium: "Free plan available, with paid upgrades for more usage or features.",
  Paid: "Requires a paid plan. Check the website for trials.",
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Most upvoted" },
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "A–Z" },
];
