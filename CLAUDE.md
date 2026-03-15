# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.



## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

---

# Security Rules

## Never Do
- Never expose `SQUARE_ACCESS_TOKEN` or any secret env var in frontend HTML, JS, or console logs
- Never trust amounts or prices sent from the client — always recalculate server-side in `api/create-payment.js`
- Never commit `.env` files — only `.env.example` with placeholder values
- Never use `innerHTML` with user-supplied data — use `textContent` or sanitise first
- Never allow `*` as `ALLOWED_ORIGIN` in production — set it to the actual Vercel domain
- Never add `eval()`, `document.write()`, or dynamic `<script>` injection

## Always Do
- All payment logic lives in `api/` serverless functions only — never in the browser
- Validate and sanitise all user inputs (name, email, phone, notes) before using them
- Keep `vercel.json` security headers in place: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
- Use `rel="noopener noreferrer"` on all `target="_blank"` links
- Use `https://` URLs only — never `http://` for external resources

## Environment Variables
- Secret vars (prefixed with nothing special): `SQUARE_ACCESS_TOKEN` — server-side only, never in HTML
- Public vars safe for frontend: `SQUARE_APP_ID`, `SQUARE_LOCATION_ID`, `SQUARE_ENVIRONMENT`
- All env vars are set in Vercel dashboard → Settings → Environment Variables
- Local testing: copy `.env.example` to `.env` and fill in sandbox values (`.env` is gitignored)

## Price Catalogue (`api/create-payment.js`)
- The `PRICES` object is the single source of truth for all prices in cents (CAD)
- If a product is added to the site, its SKU and price MUST be added here before payments go live
- Current SKUs must match exactly what `cart.js` sends as `item.id`

---

# Testing Checklist

## Before Every Deploy
- [ ] Open checkout page — add items to cart, verify correct items and totals show
- [ ] Submit checkout form with missing fields — confirm validation errors appear
- [ ] Submit with invalid email — confirm error appears
- [ ] Test on mobile (375px) — nav hamburger works, cart items readable, form usable
- [ ] Test on desktop (1280px) — layout correct, no overlapping nav links

## Payment Testing (Sandbox)
- Use Square sandbox card: `4111 1111 1111 1111`, any future expiry, any CVV
- Confirm success state shows receipt URL
- Test declined card: `4000 0000 0000 0002` — confirm error message shown to user
- Check Vercel function logs for any Square API errors after a test payment

## Security Spot Checks
- Open browser DevTools → Network tab → confirm `SQUARE_ACCESS_TOKEN` never appears in any request or response
- Confirm `SQUARE_APP_ID` and `SQUARE_LOCATION_ID` are the only Square values visible in page source
- Check all external links have `rel="noopener noreferrer"`
- Confirm no sensitive data in `localStorage` or `sessionStorage`

## API Endpoint Tests
- `GET /api/square-config` → should return `{ appId, locationId, environment }` only
- `POST /api/create-payment` with empty body → should return 400 error, not 500
- `POST /api/create-payment` with a fake SKU → should return "Unknown item" error
- `POST /api/create-payment` with tampered low price → server should recalculate and charge correct amount