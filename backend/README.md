# Backend — Two-Token JWT Authentication

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in real values
npm run dev             # requires nodemon (in devDependencies)
# or
npm start
```

## Required environment variables (.env)

| Variable | What it is |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `ACCESS_TOKEN_SECRET` | Random secret used to sign access tokens |
| `REFRESH_TOKEN_SECRET` | A **different** random secret used to sign refresh tokens |
| `CLIENT_URL` | Your frontend's URL (for CORS) |
| `PORT` | Port to run the server on (default 5000) |

Generate strong secrets quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## How the auth flow works

1. **Signup / Login** — password is hashed with bcrypt before saving. On success, server creates:
   - An **access token** (15 min expiry) → sent back in the JSON response body
   - A **refresh token** (7 day expiry) → sent as an **httpOnly cookie** (not readable by JS)
   - The refresh token is also stored (hashed only in the sense that it's a JWT) in the user's `refreshTokens` array in MongoDB, so the server can invalidate it later

2. **Accessing the dashboard** — frontend sends `Authorization: Bearer <accessToken>` header. Middleware verifies it and attaches `req.userId`.

3. **When the access token expires** (after 15 min) — the protected route returns 403. Frontend calls `POST /api/auth/refresh` (cookie is sent automatically by the browser). Server checks the refresh token is valid AND still exists in the DB, then issues a new access token. User never has to log in again mid-session.

4. **Logout** — removes just that one refresh token from the DB and clears the cookie. Other devices/sessions stay logged in.

## API Endpoints

| Method | Route | Body | Protected? |
|---|---|---|---|
| POST | `/api/auth/signup` | `{ name, email, password }` | No |
| POST | `/api/auth/login` | `{ email, password }` | No |
| POST | `/api/auth/refresh` | (uses cookie) | No (cookie-gated) |
| POST | `/api/auth/logout` | (uses cookie) | No |
| GET | `/api/auth/dashboard` | — | Yes (needs access token) |

## Why this architecture

- **Access token in response body → stored in frontend memory (React state), never localStorage.** If it leaks via XSS, it's only valid 15 minutes.
- **Refresh token in httpOnly cookie.** JavaScript can never read it, so it's immune to XSS token theft. It can only be sent by the browser automatically.
- **Refresh tokens stored in DB per-user (array).** Lets you support multiple devices and revoke a single session on logout instead of nuking every login the user has.
