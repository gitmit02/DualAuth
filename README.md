# DualAuth

A MERN stack authentication system built around a **two-token JWT flow** — a short-lived access token for API calls, and a long-lived refresh token (httpOnly cookie) that silently renews it, so the user is never randomly logged out mid-session.

Built for the MERN Stack Internship technical assessment.

## Live Links

- **Frontend:** [https://dual-auth-rust.vercel.app/](https://dual-auth-rust.vercel.app/login)
- **Backend:** [https://dualauth-hs45.onrender.com/](https://dualauth-hs45.onrender.com/)

<img width="652" height="707" alt="image" src="https://github.com/user-attachments/assets/9a7c5649-9198-402e-970e-f852a7b539ec" />
<img width="638" height="710" alt="image" src="https://github.com/user-attachments/assets/ca0d88e1-c77f-4b01-9ddc-eec7e233e6d3" />


## Features

- Signup, login, logout
- Access token (15 min) + refresh token (7 days, httpOnly cookie)
- Protected `/dashboard` route
- Automatic silent token refresh via an axios interceptor — no forced re-login when the access token expires
- Refresh tokens stored per-user in MongoDB, so logout only kills the current session, not every device

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas) |
| Auth | JSON Web Tokens (jsonwebtoken), bcryptjs |

## Project Structure

```
DualAuth/
├── backend/     -- Express API, JWT logic, MongoDB models
└── frontend/    -- React app (signup/login/dashboard)
```

Each folder has its own README with setup steps and a deeper explanation of how it works:
- [`backend/README.md`](./backend/README.md)
- [`frontend/README.md`](./frontend/README.md)

## Running Locally

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in MongoDB URI + JWT secrets
npm run dev

# Frontend (in a second terminal)
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000
npm run dev
```

## Architecture Notes

- **Access token** → returned in the login/signup response body, kept only in frontend memory (React state). Never stored in localStorage, so it isn't readable by an XSS payload.
- **Refresh token** → set as an `httpOnly`, `secure` cookie. JavaScript can never read it; only the browser sends it automatically on requests to the backend.
- **Silent refresh** → when an API call fails because the access token expired, the frontend's axios interceptor calls `/api/auth/refresh` once, gets a new access token, and retries the original call — invisible to the user.
- **Deployment:** frontend and backend are deployed separately (different domains), so CORS is configured with `credentials: true` and the cookie uses `sameSite: "none"` in production to allow the cross-domain cookie exchange.
