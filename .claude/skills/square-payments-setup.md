---
name: square-payments-setup
description: Set up Square payments safely in a web app with client-side tokenization, server-side payment creation, sandbox/production separation, and launch checks
---

# Square Payments Setup Skill

You are helping implement Square payments securely and correctly.

## Goals
- Add Square in a way that keeps sensitive credentials server-side
- Use Square Sandbox for testing and Production for launch
- Use client-side payment collection with server-side payment creation
- Validate price, item, and order data on the server
- Keep callback URLs, domains, and environment variables organized
- Produce exact implementation steps for the app's stack

## Default architecture
Prefer the standard low-risk web pattern:

- Use Square Web Payments SDK in the browser to collect payment details
- Generate a payment token/source on the client
- Send that token to the server
- Create the payment on the server with the Square SDK or API
- Never store card data directly
- Never expose the Square access token to the browser

## Core rules
- Application ID may be used client-side when required by Square's frontend SDK
- Location ID may be used client-side if needed for the payment form
- Access token must stay server-side only
- Sandbox and Production credentials must never be mixed
- Payment amount, currency, and item details must be verified server-side
- A client-side success state alone is not enough to prove fulfillment is complete

## Environment variable plan
Typical variables:
- SQUARE_ACCESS_TOKEN
- NEXT_PUBLIC_SQUARE_APP_ID
- NEXT_PUBLIC_SQUARE_LOCATION_ID
- APP_BASE_URL
- SQUARE_ENVIRONMENT

If deployed on Vercel:
- Keep SQUARE_ACCESS_TOKEN server-side only
- Keep public values separate from secret values
- Use different values for preview/testing and production when needed
- Recheck allowed domains, redirects, and webhooks before launch

## Supported implementation patterns
Prefer one of these based on the app:

### Simple direct payment
- Use Web Payments SDK on the client
- Tokenize card/payment method in browser
- Send token + cart/order reference to server
- Server creates payment

### Order-based checkout
- Server creates or validates the order
- Server calculates final amount
- Client sends payment token
- Server creates payment against verified order data

### Seller-connected / multi-merchant flow
- Use Square OAuth only if the app must access other sellers' Square accounts
- If OAuth is used, handle token storage and refresh securely
- Do not add OAuth unless the product actually needs it

## Implementation workflow
1. Detect stack
   - Next.js app router / pages router
   - Express
   - Vite + backend
   - Other full-stack setup

2. Detect payment use case
   - One-time payment
   - Deposit
   - Event registration
   - Digital product
   - Physical goods
   - Donation

3. Set up client payment collection
   - Add Square Web Payments SDK
   - Render payment form
   - Tokenize payment method in browser
   - Send token and only minimal required data to server

4. Set up server payment creation
   - Use Square SDK/API server-side
   - Load access token from env vars
   - Validate amount, currency, product identifiers, and any discounts on the server
   - Use idempotency keys for payment creation where applicable
   - Return safe success/failure responses

5. Add order validation
   - Do not trust client-submitted totals
   - Recalculate or verify pricing server-side
   - Confirm currency and item IDs are valid
   - Prevent client-side tampering with amount

6. Add environment separation
   - Sandbox credentials only in test/dev
   - Production credentials only in live
   - Confirm production domain and environment settings before launch

7. Add launch checks
   - No secret token in client code
   - No sandbox credentials in production
   - No hardcoded credentials in repo
   - Error handling does not leak internals
   - Logging does not expose tokens or sensitive payment data

## Security review items
- No SQUARE_ACCESS_TOKEN in browser code
- No secret values committed to the repo
- No trusting payment amount from the client
- No mixing Sandbox and Production credentials
- Use idempotency to reduce duplicate charges
- Limit logs for payment data and user-sensitive details
- Review authorization on registration/order/fulfillment routes
- Ensure refunds/admin actions are protected server-side

## Output format
Return:
1. Recommended Square integration pattern
2. Required environment variables
3. Files/routes to create or modify
4. Server-side validation rules
5. Security pitfalls to avoid
6. Step-by-step sandbox test plan
7. Production launch checklist

## Guardrails
- Never print or invent real credentials
- Never suggest storing raw card data
- Never move the access token to client-side code
- If current code trusts client totals or exposes secrets, flag it immediately
- If the app looks like it needs OAuth, explain why before adding it
