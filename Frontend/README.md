# AI Tools Hub: Frontend

React 19 + Vite + Tailwind CSS v4. See the [root README](../README.md) for setup and deployment.

```bash
npm install
npm run dev      # http://localhost:5173 (API defaults to http://localhost:5000)
npm run lint
npm run build    # needs VITE_BASEURL in production, see .env.example
```

Structure:

- `src/pages/`: route components (lazy-loaded except Home)
- `src/Components/`: shared UI (Navbar, Footer, ToolCard, ToolLogo, Seo, Toast, …)
- `src/lib/`: API client, shared tools store, search/sort, saved/upvote state
- `src/data/fallbackTools.js`: offline catalog, generated from `Backend/data/seedTools.js`
