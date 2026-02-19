# Deploy to Railway (Production)

## Requirements

- Node.js 18+
- Environment variables (set in Railway dashboard or `railway.toml`):

```env
PORT=3000
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
SUPABASE_ANON_KEY=xxx
OPENAI_API_KEY=sk-xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_MODE=sandbox
APP_URL=https://your-app.railway.app
```

## Steps

1. Connect the repo to Railway.
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `npm start` (uses `node src/server.js` from `package.json`).
4. Add the env vars above.
5. Deploy. The app listens on `0.0.0.0` and uses `process.env.PORT`.

## Health check

- `GET /health` returns `{ ok: true, service: "shadi-ai-builder", paypal: true|false }`. Use this for Railway health checks.

## PayPal

- Top-ups use **stored** `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`. Set both for a live checkout; use `PAYPAL_MODE=live` in production when ready.
