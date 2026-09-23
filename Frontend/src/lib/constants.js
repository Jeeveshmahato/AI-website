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
export const SITE_TAGLINE = "Discover the best AI tools for every task";

// Keep names in sync with Backend/config/constants.js
export const CATEGORIES = [
  { name: "Chatbot", icon: FiMessageSquare, blurb: "Assistants you can talk to", color: "from-indigo-500 to-blue-500" },
  { name: "Writing Assistant", icon: FiEdit3, blurb: "Draft, edit and polish text", color: "from-emerald-500 to-teal-500" },
  { name: "Image Generation", icon: FiImage, blurb: "Turn prompts into visuals", color: "from-fuchsia-500 to-pink-500" },
  { name: "Video Generation", icon: FiVideo, blurb: "Create and edit video with AI", color: "from-rose-500 to-orange-500" },
  { name: "Audio & Voice", icon: FiMic, blurb: "Voices, music and transcription", color: "from-amber-500 to-yellow-500" },
  { name: "Code Assistance", icon: FiCode, blurb: "Ship software faster", color: "from-sky-500 to-cyan-500" },
  { name: "Productivity", icon: FiZap, blurb: "Meetings, docs and automation", color: "from-violet-500 to-purple-500" },
  { name: "Research", icon: FiSearch, blurb: "Search, cite and summarize", color: "from-blue-500 to-indigo-500" },
  { name: "Design", icon: FiPenTool, blurb: "UI, graphics and branding", color: "from-pink-500 to-rose-500" },
  { name: "Marketing", icon: FiTrendingUp, blurb: "Copy, campaigns and SEO", color: "from-orange-500 to-amber-500" },
  { name: "Translation", icon: FiGlobe, blurb: "Break language barriers", color: "from-teal-500 to-emerald-500" },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const getCategory = (name) =>
  CATEGORIES.find((c) => c.name === name) ?? { name, icon: FiZap, blurb: "", color: "from-slate-500 to-slate-600" };

export const PRICING = ["Free", "Freemium", "Paid"];

export const PRICING_STYLES = {
  Free: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
  Freemium: "bg-sky-500/10 text-sky-300 ring-sky-500/30",
  Paid: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Most upvoted" },
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "A → Z" },
];
