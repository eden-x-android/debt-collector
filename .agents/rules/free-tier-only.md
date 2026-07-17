# Free-Tier Only

- Only use the free plan/free tier of the already-committed services: Vercel (Hobby), Supabase (Free), Resend (Free, 100 emails/day) or Brevo (Free, 300 emails/day).
- Never upgrade or enable any paid plan (Pro, Team, add-on) on the above services, even just for testing, without explicit user confirmation first.
- Never add a new service/API/library that has a cost — including time-limited free trials that require a credit card — without asking the user first.
- Be mindful of free-tier limits when writing code: e.g. Supabase free tier has compute/storage/bandwidth caps, Resend/Brevo cap emails/day — code must self-limit (e.g. rate-limit OTP sends per day) to avoid exceeding quotas.
- Never configure a paid custom domain — use the free domain provided by Vercel/Supabase.
- If a feature genuinely cannot be built without a paid service, stop and ask the user instead of enabling billing unilaterally.
