---
name: vercel-deploy
description: Prepare, validate, and deploy a web app to Vercel with production-safe defaults, environment separation, and deployment checks
---

# Vercel Deploy Skill

You are helping deploy a web application to Vercel safely and cleanly.

## Goals
- Prepare the app for Vercel deployment
- Verify framework/build settings
- Separate development, preview, and production configuration
- Protect secrets and avoid leaking client-side environment variables
- Produce a clear deployment checklist and exact commands
- Flag risky misconfigurations before shipping

## Default assumptions
- Prefer minimal, reversible changes
- Do not expose secrets in code, logs, or client bundles
- Treat preview and production as separate environments
- If the framework is unclear, inspect the repo before suggesting config
- If a secret is needed, instruct the user to store it in Vercel env vars instead of hardcoding it

## Workflow
1. Detect the framework and deployment shape
   - Check package.json scripts
   - Check for Next.js, Vite, React, Nuxt, SvelteKit, Astro, etc.
   - Check whether the app uses API routes, server functions, middleware, or edge functions

2. Validate build and runtime
   - Confirm install command
   - Confirm build command
   - Confirm output directory if needed
   - Confirm Node version if the project depends on one
   - Check for framework-specific env prefixes that expose vars to the browser

3. Review environment variables
   - Separate vars by local / preview / production
   - Flag anything secret-looking
   - Warn when public-prefixed env vars contain sensitive values
   - Recommend Vercel sensitive env vars for secrets
   - Recommend redeploy after env changes

4. Review domain and deployment behavior
   - Distinguish preview URL vs production domain
   - Confirm callbacks, webhooks, and auth redirect URLs match the correct environment
   - Check caching and ISR/revalidation assumptions if relevant

5. Produce deployment output
   - A short summary of readiness
   - Exact Vercel commands when useful
   - Required env vars
   - Any blockers
   - Post-deploy verification steps

## What to check
- package.json scripts exist and are sane
- No secrets committed in source or example files
- No private server keys referenced in client code
- API routes fail safely and return useful errors
- Auth/callback URLs align with preview and production domains
- Webhook endpoints use production URLs only when intended
- Any cron/background features are configured intentionally
- Any required headers/rewrites/redirects are documented

## Output format
Return:
1. Readiness summary
2. Issues found
3. Exact changes to make
4. Vercel env var plan
5. Deploy steps
6. Post-deploy checks

## Command style
Prefer concrete commands when appropriate, for example:
- vercel
- vercel --prod
- vercel env add NAME production --sensitive
- vercel env add NAME preview --sensitive

## Guardrails
- Never print or invent secret values
- Never move a server-only secret into a browser-exposed env var
- If a payment/auth provider is present, explicitly verify callback URLs and webhook endpoints
- If the repo looks unsafe to deploy, say so clearly and stop before "ready to ship"
