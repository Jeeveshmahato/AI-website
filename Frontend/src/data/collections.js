import { FiVideo, FiCode, FiBookOpen, FiTrendingUp, FiBriefcase, FiGift } from "react-icons/fi";

// Hand-picked stacks. `tools` are tool keys (slug, or slugified name); tools that
// aren't in the directory are skipped automatically, so this list is safe to edit.
const collections = [
  {
    slug: "content-creator",
    title: "Content Creator Stack",
    tagline: "Script, design, voice and edit, all with AI.",
    description:
      "Everything a solo creator needs to go from idea to published video: write scripts, design thumbnails, generate voiceovers and music, and edit like a pro.",
    icon: FiVideo,
    color: "from-rose-500 to-orange-500",
    tools: ["chatgpt", "canva-magic-studio", "descript", "elevenlabs", "runway", "suno"],
  },
  {
    slug: "developer",
    title: "Developer Toolkit",
    tagline: "Ship faster with AI pair programmers.",
    description:
      "AI editors, assistants and app builders that help you write, review and ship code faster, from quick prototypes to production codebases.",
    icon: FiCode,
    color: "from-sky-500 to-cyan-500",
    tools: ["cursor", "github-copilot", "claude", "replit", "lovable", "perplexity"],
  },
  {
    slug: "student",
    title: "Student Essentials",
    tagline: "Study smarter: research, notes and writing.",
    description:
      "Find and understand sources, turn readings into study guides, polish essays and build presentations. Mostly free or with generous free plans.",
    icon: FiBookOpen,
    color: "from-emerald-500 to-teal-500",
    tools: ["notebooklm", "perplexity", "elicit", "quillbot", "grammarly", "gamma"],
  },
  {
    slug: "marketing",
    title: "Marketing Engine",
    tagline: "On-brand copy, visuals and video at scale.",
    description:
      "Plan campaigns, write copy in your brand voice, produce graphics and avatar videos, and automate the busywork between tools.",
    icon: FiTrendingUp,
    color: "from-orange-500 to-amber-500",
    tools: ["jasper", "copy-ai", "canva-magic-studio", "ideogram", "synthesia", "zapier"],
  },
  {
    slug: "founder",
    title: "Startup Founder Kit",
    tagline: "Do the work of a team of ten.",
    description:
      "Draft strategy docs, build an MVP, pitch with polished decks, never miss meeting notes, and automate operations as you grow.",
    icon: FiBriefcase,
    color: "from-violet-500 to-purple-500",
    tools: ["claude", "lovable", "gamma", "notion-ai", "otter-ai", "zapier"],
  },
  {
    slug: "free-starter",
    title: "Best Free AI Tools",
    tagline: "Powerful AI without paying a cent.",
    description:
      "Start with these free and free-tier tools. They cover chat, research, images and translation, and are good enough for most everyday tasks.",
    icon: FiGift,
    color: "from-indigo-500 to-blue-500",
    tools: ["chatgpt", "claude", "gemini", "notebooklm", "stable-diffusion", "deepl"],
  },
];

export default collections;

export const getCollection = (slug) => collections.find((c) => c.slug === slug);
