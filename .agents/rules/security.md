# Security

## OTP & Auth
- Generate OTPs using cryptographically secure randomness (never `Math.random`), with a short TTL (recommended 5 minutes) and a limited number of failed attempts (recommended max 5) before requiring a new OTP.
- The hardcoded username (`admin`) and the hardcoded OTP-recipient email are an accepted business requirement — only these two values may be hardcoded, no other secret may be.
- After OTP verification: sign the session as a JWT with a strong secret (from env), store it in an `httpOnly`, `secure`, `sameSite=strict` cookie. Never store tokens in `localStorage`/`sessionStorage`.

## Secrets
- All secrets (DB connection string, Resend/Brevo API key, JWT secret) are read from environment variables (`.env.local`) only — never commit a `.env*` file containing real values to git.
- Never log OTPs, JWTs, or any secret to the console/logs in production.

## Input & Data
- Validate all client input with a schema (recommended: `zod`) at the API layer before processing/querying the DB.
- Query the DB through Prisma (already parameterized) — never build raw SQL by concatenating user input.
- Never expose DB error details/stack traces in the client response — return a generic message, log details server-side.

## Network
- Rate-limit the OTP-send and OTP-verify endpoints to prevent brute-force/spam (by IP or by username).
- CORS should only allow the app's own origin, never `*`.
