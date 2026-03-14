---
name: web-security-review
description: Audit a web app for practical security risks before launch, especially for Vercel-hosted apps and modern JS frameworks
---

# Web Security Review Skill

You are performing a practical application security review for a modern web app.

## Goals
- Find high-impact, likely security issues
- Prioritize fixes that reduce real risk before launch
- Focus on web app, auth, API, secret handling, headers, and deployment safety
- Give actionable remediation, not vague theory

## Review priorities
Prioritize in this order:
1. Secret exposure
2. Auth/session flaws
3. Payment and webhook mistakes
4. Broken authorization
5. Input validation and injection risks
6. XSS / unsafe rendering
7. CSRF where relevant
8. Security headers and browser protections
9. Abuse controls such as rate limiting
10. Logging/privacy issues

## Checklist

### Secrets
- Look for API keys, tokens, private keys, webhook secrets, DB URLs
- Check .env examples and config files for accidental real secrets
- Check whether public/browser env vars expose sensitive values
- Ensure secrets live in environment variables, not source code

### Auth and sessions
- Review login, signup, password reset, magic links, OAuth callbacks
- Check authorization on server routes, not just UI checks
- Confirm user-specific data access is enforced server-side
- Check cookie/session configuration where applicable

### Input and output handling
- Review forms, query params, headers, JSON bodies
- Check for unsafe HTML rendering or dangerouslySetInnerHTML
- Check server-side validation, schema validation, and output encoding
- Flag SQL/command/template injection patterns when applicable

### API and server routes
- Review mutation endpoints first
- Confirm auth checks happen before sensitive actions
- Confirm error messages do not leak internals
- Confirm methods, body size, and allowed origins are intentional

### Security headers
- Recommend CSP
- Recommend testing with Report-Only first if CSP is not mature
- Check for sensible use of:
  - Content-Security-Policy
  - X-Frame-Options or frame-ancestors via CSP
  - Referrer-Policy
  - Permissions-Policy
  - X-Content-Type-Options

### Payment-specific checks
- Confirm card data is not handled directly by the app unless absolutely required
- Confirm checkout/session creation occurs server-side
- Confirm webhook signature verification exists
- Confirm payment success is not trusted from client redirect alone
- Confirm fulfillment depends on verified server-side payment state

### Abuse controls
- Rate limiting on login, signup, password reset, contact forms, coupon endpoints, and payment-related endpoints
- Basic bot/abuse defenses on public write endpoints
- Alert on missing anti-automation controls where obvious abuse is possible

### Privacy and logging
- Do not log secrets, raw tokens, card details, or excessive personal data
- Avoid leaking stack traces to end users
- Ensure analytics/debugging do not capture sensitive input fields

## Severity labels
Use:
- Critical
- High
- Medium
- Low
- Info

## Output format
Return:
1. Executive summary
2. Findings by severity
3. Fixes in priority order
4. "Ship / Don't ship yet" recommendation
5. Exact code or config changes when possible

## Guardrails
- Focus on issues supported by actual code/config evidence
- Mark uncertainty clearly if a risk depends on unseen infrastructure
- Prefer practical, developer-friendly fixes
- Do not recommend weakening security for convenience
