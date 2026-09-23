// Bundled copy of Backend/data/seedTools.js, shown when the API is unreachable so the
// directory is never empty. Regenerate after editing the seed list.
const fallbackTools = [
  {
    "name": "ChatGPT",
    "slug": "chatgpt",
    "category": "Chatbot",
    "price": "Freemium",
    "featured": true,
    "link": "https://chatgpt.com",
    "tagline": "OpenAI's general-purpose AI assistant",
    "tags": [
      "assistant",
      "gpt",
      "multimodal"
    ],
    "description": "Conversational AI assistant from OpenAI for writing, analysis, coding, brainstorming and image understanding, with voice mode and custom GPTs.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Claude",
    "slug": "claude",
    "category": "Chatbot",
    "price": "Freemium",
    "featured": true,
    "link": "https://claude.ai",
    "tagline": "Anthropic's thoughtful AI assistant for deep work",
    "tags": [
      "assistant",
      "writing",
      "coding"
    ],
    "description": "AI assistant from Anthropic known for careful reasoning, long-document analysis, strong coding help and natural writing. Supports file uploads, projects and artifacts.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Gemini",
    "slug": "gemini",
    "category": "Chatbot",
    "price": "Freemium",
    "link": "https://gemini.google.com",
    "tagline": "Google's multimodal AI assistant",
    "tags": [
      "assistant",
      "google",
      "multimodal"
    ],
    "description": "Google's AI assistant with deep integration into Gmail, Docs and Search, handling text, images and long context for research and everyday tasks.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Microsoft Copilot",
    "slug": "microsoft-copilot",
    "category": "Chatbot",
    "price": "Freemium",
    "link": "https://copilot.microsoft.com",
    "tagline": "AI companion across Windows and Microsoft 365",
    "tags": [
      "assistant",
      "microsoft",
      "office"
    ],
    "description": "Microsoft's AI assistant for web answers, content drafting and image creation, with paid tiers that work inside Word, Excel, Outlook and Teams.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Perplexity",
    "slug": "perplexity",
    "category": "Research",
    "price": "Freemium",
    "featured": true,
    "link": "https://www.perplexity.ai",
    "tagline": "Answer engine with cited sources",
    "tags": [
      "search",
      "citations",
      "research"
    ],
    "description": "AI-powered answer engine that searches the web in real time and returns concise answers with inline citations, plus deep-research reports.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "NotebookLM",
    "slug": "notebooklm",
    "category": "Research",
    "price": "Free",
    "link": "https://notebooklm.google.com",
    "tagline": "AI research notebook grounded in your sources",
    "tags": [
      "notes",
      "google",
      "podcast"
    ],
    "description": "Google's research assistant that answers questions grounded only in the documents you upload, and can turn them into audio overviews and study guides.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Elicit",
    "slug": "elicit",
    "category": "Research",
    "price": "Freemium",
    "link": "https://elicit.com",
    "tagline": "AI research assistant for academic papers",
    "tags": [
      "papers",
      "academic",
      "science"
    ],
    "description": "Searches and summarizes academic literature, extracts data from papers into tables and helps automate systematic reviews.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Midjourney",
    "slug": "midjourney",
    "category": "Image Generation",
    "price": "Paid",
    "featured": true,
    "link": "https://www.midjourney.com",
    "tagline": "Stunning, artistic AI image generation",
    "tags": [
      "art",
      "images",
      "creative"
    ],
    "description": "Leading AI image generator known for its distinctive, highly aesthetic output. Create illustrations, concept art and photoreal images from text prompts.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Adobe Firefly",
    "slug": "adobe-firefly",
    "category": "Image Generation",
    "price": "Freemium",
    "link": "https://firefly.adobe.com",
    "tagline": "Commercially safe generative imaging from Adobe",
    "tags": [
      "images",
      "adobe",
      "design"
    ],
    "description": "Adobe's generative AI for images, text effects and generative fill, trained on licensed content and integrated with Photoshop and Illustrator.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Ideogram",
    "slug": "ideogram",
    "category": "Image Generation",
    "price": "Freemium",
    "link": "https://ideogram.ai",
    "tagline": "Image generation that gets typography right",
    "tags": [
      "images",
      "typography",
      "logos"
    ],
    "description": "Text-to-image model that excels at rendering legible text inside images, great for posters, logos, thumbnails and social graphics.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Leonardo.Ai",
    "slug": "leonardo-ai",
    "category": "Image Generation",
    "price": "Freemium",
    "link": "https://leonardo.ai",
    "tagline": "Production-quality visual assets with AI",
    "tags": [
      "images",
      "game-assets",
      "creative"
    ],
    "description": "Generative platform for images and game assets with fine-tuned models, real-time canvas editing and consistent character generation.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Stable Diffusion",
    "slug": "stable-diffusion",
    "category": "Image Generation",
    "price": "Free",
    "link": "https://stability.ai",
    "tagline": "Open image-generation models by Stability AI",
    "tags": [
      "open-source",
      "images",
      "self-hosted"
    ],
    "description": "Open-weight text-to-image models you can run locally or via API, with a huge ecosystem of fine-tunes, LoRAs and community tools.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Runway",
    "slug": "runway",
    "category": "Video Generation",
    "price": "Freemium",
    "featured": true,
    "link": "https://runwayml.com",
    "tagline": "Generative video for filmmakers and creators",
    "tags": [
      "video",
      "film",
      "editing"
    ],
    "description": "AI video platform to generate, extend and edit video from text or images, with pro tools like motion brush and green-screen removal.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Pika",
    "slug": "pika",
    "category": "Video Generation",
    "price": "Freemium",
    "link": "https://pika.art",
    "tagline": "Playful text-to-video generation",
    "tags": [
      "video",
      "social",
      "effects"
    ],
    "description": "Turns text prompts and images into short, stylized video clips with creative effects, ideal for social content.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Synthesia",
    "slug": "synthesia",
    "category": "Video Generation",
    "price": "Freemium",
    "link": "https://www.synthesia.io",
    "tagline": "AI avatar videos in 140+ languages",
    "tags": [
      "avatars",
      "training",
      "business"
    ],
    "description": "Create professional presenter-led videos with realistic AI avatars and voices, no camera needed. Popular for training and internal comms.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Descript",
    "slug": "descript",
    "category": "Video Generation",
    "price": "Freemium",
    "link": "https://www.descript.com",
    "tagline": "Edit video and podcasts like a doc",
    "tags": [
      "editing",
      "podcast",
      "transcription"
    ],
    "description": "Edit audio and video by editing the transcript, remove filler words automatically and fix voice with AI overdub and studio sound.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "ElevenLabs",
    "slug": "elevenlabs",
    "category": "Audio & Voice",
    "price": "Freemium",
    "featured": true,
    "link": "https://elevenlabs.io",
    "tagline": "The most realistic AI voices",
    "tags": [
      "voice",
      "tts",
      "dubbing"
    ],
    "description": "Lifelike text-to-speech, voice cloning and AI dubbing in dozens of languages, used for audiobooks, videos, games and voice agents.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Suno",
    "slug": "suno",
    "category": "Audio & Voice",
    "price": "Freemium",
    "link": "https://suno.com",
    "tagline": "Make full songs from a text prompt",
    "tags": [
      "music",
      "songs",
      "creative"
    ],
    "description": "Generates complete songs, vocals, lyrics and instrumentation, from a simple description in any genre.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Otter.ai",
    "slug": "otter-ai",
    "category": "Productivity",
    "price": "Freemium",
    "link": "https://otter.ai",
    "tagline": "AI meeting notes and transcription",
    "tags": [
      "meetings",
      "transcription",
      "notes"
    ],
    "description": "Joins Zoom, Meet and Teams calls to transcribe in real time, summarize discussions and capture action items automatically.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Notion AI",
    "slug": "notion-ai",
    "category": "Productivity",
    "price": "Paid",
    "link": "https://www.notion.com/product/ai",
    "tagline": "AI built into your connected workspace",
    "tags": [
      "notes",
      "docs",
      "workspace"
    ],
    "description": "Write, summarize and search across your Notion workspace and connected apps, with AI meeting notes and autofill for databases.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Gamma",
    "slug": "gamma",
    "category": "Productivity",
    "price": "Freemium",
    "link": "https://gamma.app",
    "tagline": "Presentations and docs generated in seconds",
    "tags": [
      "slides",
      "presentations",
      "docs"
    ],
    "description": "Generate polished presentations, documents and web pages from a prompt or outline, then refine the design and content with AI.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Zapier",
    "slug": "zapier",
    "category": "Productivity",
    "price": "Freemium",
    "link": "https://zapier.com",
    "tagline": "Automate workflows across 7,000+ apps with AI",
    "tags": [
      "automation",
      "workflows",
      "agents"
    ],
    "description": "No-code automation platform to connect apps and build AI-powered workflows and agents that move data and take action for you.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "GitHub Copilot",
    "slug": "github-copilot",
    "category": "Code Assistance",
    "price": "Freemium",
    "link": "https://github.com/features/copilot",
    "tagline": "Your AI pair programmer",
    "tags": [
      "coding",
      "ide",
      "github"
    ],
    "description": "AI coding assistant in VS Code, JetBrains and GitHub that suggests code, answers questions in chat and can work on issues as an agent.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Cursor",
    "slug": "cursor",
    "category": "Code Assistance",
    "price": "Freemium",
    "featured": true,
    "link": "https://cursor.com",
    "tagline": "The AI-first code editor",
    "tags": [
      "coding",
      "editor",
      "agents"
    ],
    "description": "A VS Code-based editor with codebase-aware chat, multi-file edits and an autonomous agent mode for building and refactoring faster.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Replit",
    "slug": "replit",
    "category": "Code Assistance",
    "price": "Freemium",
    "link": "https://replit.com",
    "tagline": "Build and deploy apps with an AI agent",
    "tags": [
      "coding",
      "no-code",
      "deploy"
    ],
    "description": "Browser-based development environment where an AI agent can build, run and deploy full-stack apps from natural-language instructions.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Lovable",
    "slug": "lovable",
    "category": "Code Assistance",
    "price": "Freemium",
    "link": "https://lovable.dev",
    "tagline": "Build web apps by chatting with AI",
    "tags": [
      "no-code",
      "web-apps",
      "prototyping"
    ],
    "description": "Describe the app you want and Lovable generates a working full-stack web app you can iterate on, connect to a database and ship.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Grammarly",
    "slug": "grammarly",
    "category": "Writing Assistant",
    "price": "Freemium",
    "link": "https://www.grammarly.com",
    "tagline": "Write clearly and confidently everywhere",
    "tags": [
      "grammar",
      "editing",
      "tone"
    ],
    "description": "AI writing assistant that checks grammar, clarity and tone across email, docs and the web, with generative rewriting on demand.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "QuillBot",
    "slug": "quillbot",
    "category": "Writing Assistant",
    "price": "Freemium",
    "link": "https://quillbot.com",
    "tagline": "Paraphrase, summarize and polish text",
    "tags": [
      "paraphrasing",
      "summaries",
      "students"
    ],
    "description": "Paraphrasing and summarizing toolkit with grammar checking, citation generation and a translator, popular with students and writers.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Jasper",
    "slug": "jasper",
    "category": "Marketing",
    "price": "Paid",
    "link": "https://www.jasper.ai",
    "tagline": "AI content platform for marketing teams",
    "tags": [
      "copywriting",
      "brand-voice",
      "campaigns"
    ],
    "description": "Generates on-brand marketing copy, campaigns and content at scale using your brand voice, style guides and knowledge.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Copy.ai",
    "slug": "copy-ai",
    "category": "Marketing",
    "price": "Freemium",
    "link": "https://www.copy.ai",
    "tagline": "AI workflows for go-to-market teams",
    "tags": [
      "copywriting",
      "sales",
      "workflows"
    ],
    "description": "Automates sales and marketing workflows like prospecting emails, content repurposing and SEO briefs with AI.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Canva Magic Studio",
    "slug": "canva-magic-studio",
    "category": "Design",
    "price": "Freemium",
    "link": "https://www.canva.com/magic/",
    "tagline": "AI design tools inside Canva",
    "tags": [
      "design",
      "social",
      "templates"
    ],
    "description": "Canva's suite of AI features: generate designs, images and copy, magic-edit photos, resize for every platform and translate designs.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "Figma AI",
    "slug": "figma-ai",
    "category": "Design",
    "price": "Freemium",
    "link": "https://www.figma.com/ai/",
    "tagline": "AI features for product designers",
    "tags": [
      "ui",
      "prototyping",
      "design"
    ],
    "description": "AI features in Figma to generate UI drafts, rename layers, create prototypes and turn designs into working apps with Figma Make.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  },
  {
    "name": "DeepL",
    "slug": "deepl",
    "category": "Translation",
    "price": "Freemium",
    "link": "https://www.deepl.com",
    "tagline": "The world's most accurate translator",
    "tags": [
      "translation",
      "languages",
      "documents"
    ],
    "description": "Neural machine translation known for natural, nuanced results across 30+ languages, with document translation and a writing assistant.",
    "image": "",
    "upvotes": 0,
    "visits": 0
  }
];

export default fallbackTools;
