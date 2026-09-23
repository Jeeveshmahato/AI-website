export function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Only allow http(s) links in hrefs; anything else (javascript:, data:) becomes "#".
export function safeUrl(url) {
  try {
    const parsed = new URL(String(url).trim());
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "#";
  } catch {
    return "#";
  }
}

export function isHttpUrl(value) {
  return safeUrl(value) !== "#";
}

export function faviconUrl(url, size = 128) {
  const domain = getDomain(url);
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}` : "";
}

export function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Stable identity shared by live, cached and offline-catalog records (which have no _id).
// Mirrors the backend's slug generation, so older records without a slug still match.
export function toolKey(tool) {
  return tool.slug || slugify(tool.name) || tool._id;
}

export function toolPath(tool) {
  return `/tools/${toolKey(tool)}`;
}

export function formatCount(n) {
  if (!n) return "0";
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

export function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export const isNew = (tool, days = 14) =>
  tool.createdAt && Date.now() - new Date(tool.createdAt).getTime() < days * 86_400_000;

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
