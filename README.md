# AI Tools Hub

A hand-curated directory of AI tools: search, filter, compare, upvote and save tools, and submit new ones for review.

- **Frontend:** React 19, Vite, Tailwind CSS v4, framer-motion (`Frontend/`)
- **Backend:** Express 5, MongoDB/Mongoose (`Backend/`)
- **Hosting:** Render (blueprint in `render.yaml`); Vercel also supported

## Design system

Defined once in `Frontend/src/index.css` as semantic tokens (`canvas`, `surface`, `line`, `fg`, `fg-muted`, `accent`…) with light and dark values. The theme follows the OS, can be toggled, and is applied before first paint (no flash).

- Warm neutrals carry the UI. The single orange accent is reserved for the brand mark, selected states (upvoted, saved, comparing), the featured star and focus rings.
- Primary buttons are inverted neutrals, not accent-coloured.
- All text colours meet WCAG AA (≥ 4.5:1) in both themes. Contrast ratios are documented next to the tokens.
- Typeface: Geist / Geist Mono (numbers, counts, metadata).

## Features

| Area | What you get |
| --- | --- |
| Discovery | Relevance-ranked search (`/` or `Ctrl+K`), 11 categories, pricing filter (Free / Freemium / Paid), sort by featured, upvotes, trending, newest, A–Z. Filters live in the URL, so every search is shareable. |
| Tool pages | `/tools/:slug` with description, tags, pricing notes, share button, alternatives, and SoftwareApplication structured data for SEO. |
| Engagement | Upvotes, saved tools (`/saved`, stored in the browser), visit tracking that powers "Trending", "Tool of the day", "Continue exploring" (recently viewed). |
| Tool Finder | `/finder`: three questions (task, budget, priority) produce a ranked top 3 with plain-language reasons. Results live in the URL, so they can be shared. |
| Shareable shortlists | "Share list" on `/saved` copies a link (`/saved?tools=a,b,c`); recipients can "Save all" in one click. |
| Maker badge | Tool pages offer a "Listed on AI Tools Hub" badge (light/dark SVG) with copy-paste embed code that links back to the listing. |
| Admin editing | `/admin` → Edit fixes any listing's pricing, tags, tagline, links or description. |
| Compare | Pick up to 3 tools from any card; a floating tray follows you, and `/compare?tools=a,b,c` gives a shareable side-by-side table. |
| Curated stacks | `/stacks`: hand-picked toolkits (creator, developer, student, marketing, founder, free). Edit them in `Frontend/src/data/collections.js`. |
| Command palette | `Ctrl/⌘ + K` on any page: instant search across tools, categories and stacks, with keyboard navigation. |
| Submissions | Public form with live preview. Submissions are **pending** until approved in `/admin`. |
| Admin | `/admin`: approve, reject, feature and delete tools, and read contact messages. Sign in with the backend `API_KEY`. |
| Contact and newsletter | Working contact form and newsletter signup (stored in MongoDB), with honeypot spam protection. |
| Resilience | Content renders instantly (cached or bundled catalog) and live data syncs in the background, retrying with backoff and on tab focus or reconnect, so Render cold starts never show an empty or broken page. |

## Local development

```bash
# Backend
cd Backend
cp .env.example .env        # fill in MONGO_URI and API_KEY
npm install
npm run seed                # loads 33 curated tools + fills blank tags/taglines (idempotent, safe)
npm run seed -- --overwrite # also resets pricing/descriptions of catalog tools to data/seedTools.js
npm run dev                 # http://localhost:5000
npm test

# Frontend (second terminal)
cd Frontend
npm install
npm run dev                 # http://localhost:5173 (talks to localhost:5000 by default)
```

## Deploying on Render

1. **Rotate the MongoDB password first** (see Security below).
2. In MongoDB Atlas → Network Access, allow `0.0.0.0/0`. Render has no fixed outbound IP, so without this every DB request times out.
3. Backend service settings: Root Directory `Backend`, Build `npm ci --omit=dev`, Start `npm start`, Health Check Path `/health`.
4. Backend environment variables:

   | Key | Value |
   | --- | --- |
   | `MONGO_URI` | Atlas connection string |
   | `API_KEY` | long random string (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `CLIENT_URL` | `https://ai-website-frontend.onrender.com` (exact origin, no trailing slash; comma-separate extras) |
   | `NODE_ENV` | `production` |

5. Frontend static site: Root Directory `Frontend`, Build `npm ci && npm run build`, Publish `dist`, env `VITE_BASEURL=https://ai-website-backend-yhbg.onrender.com`, plus a rewrite rule `/*` → `/index.html`.
   `VITE_BASEURL` is read at **build time**, so redeploy the frontend after changing it.
6. Load the starter catalog once: in the backend service's Shell, run `npm run seed`.
7. Check `https://<backend>/health`. It reports DB status, missing env vars, and the allowed CORS origins.

`render.yaml` describes both services as a Blueprint, which you can use for fresh deploys.

### Vercel (alternative)

Deploy `Backend/` as its own project: `api/index.js` exports the Express app and `vercel.json` routes every path to it. The DB connection is cached across invocations. Deploy `Frontend/` as a Vite project with `VITE_BASEURL` set. `CLIENT_URL` supports wildcards for preview deployments, e.g. `https://ai-website-*.vercel.app`.

## Troubleshooting

**CORS error / "Failed to fetch" while the API returns 200.**
The response is missing `Access-Control-Allow-Origin`, which means the request's `Origin` isn't allowed. `https://ai-website-frontend.onrender.com` is always allowed (see `Backend/config/env.js`); any other origin (custom domain, Vercel) must be in `CLIENT_URL`. Open `/health` and compare `corsOrigins` with the site's address bar, character for character (`https`, `www`, trailing slash). The backend log prints `[cors] Blocked origin "..."`, and the browser console explains the likely cause too.

**"Refused to apply style… MIME type ('text/html')" / "Failed to load module script" right after a deploy.**
The browser loaded a cached `index.html` from the previous deploy. It points at hashed build files that the new deploy deleted, and the SPA rewrite answers with HTML. The app recovers automatically (one cache-busting reload; see `Frontend/index.html` and `src/lib/staleDeploy.js`). To stop it happening, in Render → static site → **Headers**, add `/*` `Cache-Control: no-cache` and `/assets/*` `Cache-Control: public, max-age=31536000, immutable`. Verify with `curl -I https://<site>/` (expect `no-cache`) and `curl -I https://<site>/assets/<file>.js` (expect `immutable`).

**Tools page says "Showing our offline catalog".** The frontend couldn't reach the API after several background retries. Check `VITE_BASEURL` (then redeploy the frontend), `/health`, and the CORS note above.

**`/health` says `db: unreachable`.** Check the Atlas IP allowlist and `MONGO_URI`.

**First load is slow.** Render's free tier sleeps after inactivity (~30–50 s cold start). The frontend retries automatically and shows cached data meanwhile.

## API

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/aitools?q=&category=&price=&featured=true&sort=&limit=` | public |
| GET | `/api/aitools/stats` | public |
| GET | `/api/aitools/:idOrSlug` | public |
| POST/DELETE | `/api/aitools/:id/upvote`, POST `/api/aitools/:id/visit` | public, rate limited |
| POST | `/api/submissions`, `/api/contact`, `/api/newsletter` | public, rate limited |
| POST / PATCH / DELETE | `/api/aitools[/:id]` | `X-API-Key` |
| GET | `/api/admin/summary`, `/api/admin/tools?status=`, `/api/admin/messages` | `X-API-Key` |

## Security

- Never commit `.env` files. Only `.env.example` belongs in git.
- A MongoDB password was previously committed (`Frontend/render.yaml`, and `Backend/.env` in history). Removing the file doesn't remove it from git history, so **rotate that database user's password** in Atlas.
