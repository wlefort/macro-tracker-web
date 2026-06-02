# macro-tracker-web

Web port of the MacroTrackerAPP — React 18 + Vite, deployed on Netlify.

## Stack
- React 18, Vite 5, React Router 6
- Recharts for graphs
- Anthropic SDK (`@anthropic-ai/sdk`) — Claude API via Netlify proxy function
- `@zxing/browser` — barcode scanning
- localStorage for persistence (no backend DB)

## Structure
- `src/` — one component per file
- `netlify/functions/` — Claude API proxy (keeps API key server-side)

## Dev
```bash
npm run dev    # local dev server
npm run build  # production build
```

## Deploy
Netlify — push to GitHub triggers deploy.
