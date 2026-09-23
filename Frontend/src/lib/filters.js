const STOPWORDS = new Set(["a", "an", "the", "for", "to", "of", "and", "or", "with", "ai", "tool", "tools", "app", "make", "i", "my", "want"]);

// Common task words mapped onto the vocabulary used in listings.
const SYNONYMS = {
  coding: "code", programming: "code", developer: "code", images: "image", picture: "image", photo: "image",
  art: "image", videos: "video", voice: "voice", speech: "voice", music: "music", song: "music",
  chat: "chatbot", assistant: "assistant", translate: "translation", slides: "slides", presentation: "slides",
  meeting: "meetings", notes: "notes", write: "writing", writer: "writing", essay: "writing", seo: "marketing",
};

export function tokenize(query) {
  return String(query)
    .toLowerCase()
    .split(/[^a-z0-9.+#]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t))
    .map((t) => SYNONYMS[t] || t);
}

// Weighted relevance: name > tags/category > tagline > description.
function score(tool, tokens) {
  const name = (tool.name || "").toLowerCase();
  const fields = [
    [name, 10],
    [(tool.tags || []).join(" "), 5],
    [(tool.category || "").toLowerCase(), 5],
    [(tool.tagline || "").toLowerCase(), 3],
    [(tool.description || "").toLowerCase(), 1],
  ];
  let total = 0;
  for (const token of tokens) {
    let best = 0;
    for (const [text, weight] of fields) {
      if (text.includes(token)) best = Math.max(best, weight);
    }
    if (!best) return 0; // every token must match somewhere
    total += best + (name.startsWith(token) ? 5 : 0);
  }
  return total;
}

const byDate = (t) => new Date(t.createdAt || 0).getTime();

const COMPARATORS = {
  featured: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.upvotes || 0) - (a.upvotes || 0) || a.name.localeCompare(b.name),
  popular: (a, b) => (b.upvotes || 0) - (a.upvotes || 0) || (b.visits || 0) - (a.visits || 0) || a.name.localeCompare(b.name),
  trending: (a, b) => (b.visits || 0) + (b.upvotes || 0) * 3 - ((a.visits || 0) + (a.upvotes || 0) * 3) || a.name.localeCompare(b.name),
  newest: (a, b) => byDate(b) - byDate(a) || a.name.localeCompare(b.name),
  name: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
};

export function sortTools(tools, sort = "featured") {
  return [...tools].sort(COMPARATORS[sort] || COMPARATORS.featured);
}

/**
 * Filters and sorts the full list client-side (the catalog is small enough to
 * load once), which makes every filter change instant.
 */
export function filterTools(tools, { q = "", category = "All", price = "All", sort = "featured", savedIds = null } = {}) {
  const tokens = tokenize(q);
  let result = tools.filter(
    (t) =>
      (category === "All" || t.category === category) &&
      (price === "All" || t.price === price) &&
      (!savedIds || savedIds.has(t._id || t.slug))
  );

  if (tokens.length) {
    const scored = result.map((t) => [t, score(t, tokens)]).filter(([, s]) => s > 0);
    // Relevance first when searching; the chosen sort breaks ties.
    const cmp = COMPARATORS[sort] || COMPARATORS.featured;
    scored.sort(([a, sa], [b, sb]) => sb - sa || cmp(a, b));
    return scored.map(([t]) => t);
  }
  return sortTools(result, sort);
}
