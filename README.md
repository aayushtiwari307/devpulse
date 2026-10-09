# DevPulse

Real-time GitHub activity dashboard. Log in with GitHub, point a webhook at the app, and every push, pull request, issue and star on your repos shows up in a live feed and in charts, with no polling and no page refresh.

> Not currently hosted. It runs locally in a few minutes, see [Run locally](#run-locally).

<!-- demo: add docs/demo.gif and embed it here -->

## Features

- GitHub OAuth login (Passport.js) with server-side sessions stored in MongoDB
- Webhook ingestion with HMAC-SHA256 signature verification (constant-time comparison)
- Live feed over Socket.io: each user joins a private room, so events reach only their owner
- Dashboard: commit activity by day, PR velocity, events-by-type breakdown, live event feed

## Architecture

    GitHub (push / PR / issue / star)
            |  webhook POST /webhook/github
            v
    Express  --> verify HMAC-SHA256 signature
             --> save event to MongoDB
             --> emit to the owner's Socket.io room
                          |
                          v  WebSocket
    React (Vite) dashboard  <---- REST + session cookie ----> /api/events, /api/events/stats

## Design decisions

- **Webhooks over polling:** events arrive the moment they happen, with no wasted API calls or rate-limit pressure.
- **Signature verification:** the raw request body is HMAC-SHA256 signed with the webhook secret and compared to the `X-Hub-Signature-256` header using `crypto.timingSafeEqual`.
- **Sessions over JWT:** the OAuth authorization-code flow is server-side, so a session cookie is simpler and revocable.
- **Socket.io rooms:** one room per GitHub user id, so a webhook event is emitted only to the right browser tabs.
- **No Redis or pub/sub:** the webhook handler emits straight to the owner's Socket.io room. That is correct for a single server instance; running several instances would need a shared layer (for example the Socket.io Redis adapter) so every instance can reach every client.

## Tech stack

- Frontend: React, Vite, React Router, Context API, Axios, Socket.io client, Recharts
- Backend: Node.js, Express, Passport (GitHub OAuth), express-session + connect-mongo, Socket.io
- Data: MongoDB Atlas (Mongoose)

## Project structure

    backend/    Express API, OAuth, webhook receiver, Socket.io
    frontend/   React dashboard

## Run locally

Prerequisites: Node.js 18+, a free MongoDB Atlas cluster, and [ngrok](https://ngrok.com) (so GitHub can reach your machine).

**1. Install**

    git clone https://github.com/aayushtiwari307/devpulse.git
    cd devpulse/backend && npm install
    cd ../frontend && npm install

**2. Create a GitHub OAuth App** at github.com/settings/developers with:

- Homepage URL: `http://localhost:5173`
- Authorization callback URL: `http://localhost:5000/auth/github/callback`

**3. Configure the backend.** Copy `backend/.env.example` to `backend/.env` and fill it in:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | From your OAuth App |
| `GITHUB_CALLBACK_URL` | `http://localhost:5000/auth/github/callback` |
| `SESSION_SECRET` | Long random string |
| `WEBHOOK_SECRET` | Any random string; reused when you create the webhook |
| `PORT` | `5000` |
| `CLIENT_URL` | `http://localhost:5173` |
| `NODE_ENV` | `development` (use `production` only when hosting frontend and backend on different domains: it enables secure, cross-site cookies) |

**4. Configure the frontend.** Create `frontend/.env`:

    VITE_API_URL=http://localhost:5000

**5. Start both servers** (two terminals):

    cd backend && npm run dev
    cd frontend && npm run dev

Open `http://localhost:5173` and sign in with GitHub.

**6. Send live events.** Expose the backend with `ngrok http 5000`, then in any repo you own go to Settings > Webhooks > Add webhook:

- Payload URL: `https://<your-ngrok-host>/webhook/github`
- Content type: `application/json`
- Secret: the same value as `WEBHOOK_SECRET`
- Events: pushes, pull requests, issues, stars

Push a commit and it appears in the live feed. The free ngrok URL changes on every restart, so update the webhook's Payload URL when it does.

## Security notes

- `.env` files are gitignored. Never commit them.
- Webhook requests without a valid signature are rejected.
