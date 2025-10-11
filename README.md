# Todo List API for a mobile app

Author: Marcos Filipe G. Capella (<https://linkedin.com/in/capella-marcosfilipe>)

This repository contains a simple REST API (Express + Sequelize) that backs a Todo List mobile application. The project is intentionally simple for university evaluation purposes. Authentication has been removed from `main`; it will be implemented on a separate branch.

## Features
- REST endpoints for Users, Messages and Tarefas (tasks)
- Sequelize ORM for PostgreSQL
- Configured to use `DATABASE_URL` (works with Neon, Supabase, Heroku, etc.)
- Ready to deploy on Vercel as serverless functions

## Repository layout

- `api/` - Express app and route handlers
	- `api/index.js` - main app entry (exports a serverless-compatible handler and also supports local server)
	- `api/models/` - Sequelize models (User, Message, Tarefa)
	- `api/routes/` - route modules (user, message, tarefa)
- `local-server.js` - small local server wrapper used by `npm start`
- `package.json` - scripts and dependencies

## Prerequisites
- Node.js 18+ (this repo was tested with Node 20+ and ESM enabled)
- A PostgreSQL database (Neon, Supabase, ElephantSQL, Heroku Postgres, etc.)

## Environment variables
Create a `.env` file in the project root or set these variables in your environment.

- `DATABASE_URL` - full connection string to your Postgres database (preferred)
- `POSTGRES_URL` - fallback connection string if `DATABASE_URL` is not set (legacy)
- `ERASE_DATABASE` - set to `true` to drop and re-create tables on startup (useful for testing/seeding)

Example `.env` (do NOT commit this file):

```
DATABASE_URL=postgres://user:password@host:5432/dbname
ERASE_DATABASE=false
```

## Run locally

1. Install dependencies:

```powershell
npm install
```

2. Start in development mode (auto-reload):

```powershell
npm run dev
```

3. Or run without watcher:

```powershell
npm start
```

The server will listen on `PORT` (default 3000). You can test endpoints like:

```powershell
curl http://localhost:3000/users
curl http://localhost:3000/messages
curl http://localhost:3000/tarefas
```

## Vercel deployment

1. Push this repository to GitHub (already done).
2. In the Vercel dashboard, create a new project and link the Git repo.
3. Add `DATABASE_URL` (and any other secrets) under Project Settings → Environment Variables.
4. Deploy. Vercel will detect the `api/` folder and use the exported handler from `api/index.js` for serverless functions.

Notes:
- The app uses Sequelize and runs `sequelize.sync()` on cold start. The handler exported by `api/index.js` awaits DB initialization before handling requests, so your DB must be reachable from Vercel.
- For Neon, ensure SSL is enabled in the connection string (Neon provides this automatically in `DATABASE_URL`).

## Testing

This project doesn't include automated tests yet. For quick manual checks use `curl` or Postman against the endpoints.

## Auth and future work

- Authentication was intentionally removed from `main` for the assignment. A separate branch will contain authentication (JWT) and session handling.
- Suggested follow-ups: add request validation, tests, and CI; implement rate-limiting and secure DB pooling for serverless.

## Troubleshooting
- If you see ESM module resolution errors, ensure `package.json` contains `"type": "module"` (it does) and that local imports include the `.js` extension.
- If Sequelize cannot connect on Vercel, verify `DATABASE_URL` and that your DB accepts connections from Vercel IP ranges (or use a managed DB provider that supports serverless connections).

## License

MIT

