---
name: frontend-design
description: Design frontend components and layouts following brand guidelines, responsive principles, and anti-generic guardrails
allowed-tools: Read, Glob, Grep, Bash
---

# Frontend Design Skill

## First Steps (Always)
1. Check `brand_assets/` for logos, color guides, style guides, or images — use them instead of placeholders
2. If a reference image is provided, match it exactly — do not improve or add to the design
3. Start the dev server: `node serve.mjs` (serves at http://localhost:3000)

## Output Defaults
- Single `index.html` file, all styles inline
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Derive from a custom brand color.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating).

## Screenshot Workflow
- Always screenshot from localhost: `node screenshot.mjs http://localhost:3000`
- Screenshots save to `./temporary screenshots/screenshot-N.png`
- After screenshotting, read the PNG with the Read tool and analyze it visually
- Do at least 2 comparison rounds against reference — stop only when no visible differences remain

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it exactly
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
