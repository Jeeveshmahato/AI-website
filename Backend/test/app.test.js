// Runs without a database: covers routing, CORS, auth and validation, all of
// which respond before any MongoDB access.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.MONGO_URI = "";
process.env.API_KEY = "test-key";
process.env.CLIENT_URL = "https://site.example,https://preview-*.vercel.app";

const { default: app } = await import("../app.js");

let server;
let base;

before(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

const post = (path, body, headers = {}) =>
  fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

test("GET / describes the API", async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, "ok");
});

test("GET /health reports a missing database instead of crashing", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.db, "not_configured");
  assert.ok(body.missingEnv.includes("MONGO_URI"));
});

test("GET /api/aitools returns 503 JSON when the database is unavailable", async () => {
  const res = await fetch(`${base}/api/aitools`);
  assert.equal(res.status, 503);
  assert.match((await res.json()).error, /MONGO_URI/);
});

test("unknown routes return JSON 404", async () => {
  const res = await fetch(`${base}/nope`);
  assert.equal(res.status, 404);
  assert.ok((await res.json()).error);
});

test("CORS allows configured and wildcard origins", async () => {
  for (const origin of ["https://site.example", "https://preview-abc123.vercel.app"]) {
    const res = await fetch(`${base}/`, { headers: { Origin: origin } });
    assert.equal(res.headers.get("access-control-allow-origin"), origin);
  }
});

test("CORS always allows the production frontend, even if CLIENT_URL is stale", async () => {
  const origin = "https://ai-website-frontend.onrender.com";
  const res = await fetch(`${base}/`, { headers: { Origin: origin } });
  assert.equal(res.headers.get("access-control-allow-origin"), origin);
});

test("CORS rejects unknown origins without a 500", async () => {
  const res = await fetch(`${base}/`, { headers: { Origin: "https://evil.example" } });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("access-control-allow-origin"), null);
});

test("admin create requires an API key", async () => {
  assert.equal((await post("/api/aitools", {})).status, 401);
  assert.equal((await post("/api/aitools", {}, { "X-API-Key": "wrong" })).status, 403);
});

test("admin routes require an API key", async () => {
  const res = await fetch(`${base}/api/admin/summary`);
  assert.equal(res.status, 401);
});

test("public submission validates fields", async () => {
  const res = await post("/api/submissions", { name: "X", link: "not-a-url", category: "Nope", price: "Free" });
  assert.equal(res.status, 400);
  const { details } = await res.json();
  const fields = details.map((d) => d.field);
  for (const f of ["name", "link", "category", "description"]) assert.ok(fields.includes(f), `expected ${f} error`);
});

test("honeypot silently accepts bot submissions", async () => {
  const res = await post("/api/contact", { website: "http://spam.example" });
  assert.equal(res.status, 201);
});

test("contact form validates email", async () => {
  const res = await post("/api/contact", { name: "Ann", email: "bad", message: "Hello there, friend" });
  assert.equal(res.status, 400);
});

test("malformed JSON returns 400", async () => {
  const res = await post("/api/newsletter", "{bad json");
  assert.equal(res.status, 400);
});
