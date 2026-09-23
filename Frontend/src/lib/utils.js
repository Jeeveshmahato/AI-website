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

export function toolPath(tool) {
  return `/tools/${tool.slug || tool._id}`;
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
