# Frontend — Signup / Login / Dashboard + Silent Refresh

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev
```

## Required environment variable (.env)

| Variable | What it is |
|---|---|
| `VITE_API_URL` | Base URL of your backend (e.g. `http://localhost:5000` locally, or your Render URL in production) |

## File overview

- **`src/services/api.js`** — the important one. A single axios instance that:
  1. Attaches the in-memory access token to every request automatically (request interceptor)
  2. Watches every response. If a request fails with 401/403 (access token expired), it calls `/api/auth/refresh` **once**, gets a new access token, and **replays the original failed request** — the user never notices or gets logged out. If multiple requests fail at the same moment, they're queued so only one refresh call is made, not one per request.
  3. If the refresh call itself fails (refresh token expired/invalid too), it redirects to `/login` — that's the only time the user is forced to log in again.

- **`src/context/AuthContext.jsx`** — holds `user` state and exposes `signup`, `login`, `logout`. On app load, it tries a silent refresh so a returning user (with a still-valid refresh cookie) lands straight on the dashboard instead of the login page.

- **`src/context/ProtectedRoute.jsx`** — wraps `/dashboard`; redirects to `/login` if not authenticated.

- **`src/pages/`** — Signup, Login, Dashboard. Dashboard calls `GET /api/auth/dashboard` on mount; this is what proves the whole access-token → refresh cycle works.

## Why the access token is stored in memory, not localStorage

If it were in localStorage and the site had any XSS vulnerability, an attacker's script could read it directly. Keeping it only in a JS variable (`services/api.js`) means it's gone the moment the tab is closed/refreshed — which is exactly why `AuthContext` does a silent refresh on load, to get a fresh one back using the httpOnly refresh cookie the browser still has.

## Talking point for your interview

Be ready to explain the interceptor's queueing logic (`isRefreshing` / `pendingQueue`): without it, if 3 API calls fail at once because the access token just expired, you'd fire 3 separate `/refresh` calls. The queue makes sure only the first one refreshes, and the other two just wait for that result and reuse it.
