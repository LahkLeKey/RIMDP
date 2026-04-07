# RIMDP

RIMDP (Repair Intelligence & Maintenance Decision Platform) is a full-stack app for tracking equipment, logging failures, managing repairs, and viewing maintenance analytics.

This repository is a **monorepo**, which means frontend, backend, and shared code live in one project.

## What’s in this project?

- `apps/web`: React + Vite frontend
- `apps/api`: Fastify + Prisma backend API
- `packages/shared`: shared TypeScript/Zod types used by both apps

## How the app works (high level)

1. You open the web app in your browser.
2. You sign in to get a JWT token.
3. The web app calls the API using that token.
4. The API reads/writes data in PostgreSQL.

## Prerequisites

Install these tools first:

- Node.js 20+ (or current LTS)
- `pnpm`
- Docker Desktop (for PostgreSQL)

## 5-Minute Quickstart

If you want the fastest path to running the app, copy/paste these commands from the project root:

```bash
pnpm install
docker compose up -d
node scripts/first-run-db-init.mjs
pnpm dev
```

Then open:

- Web app: http://localhost:5173
- API docs: http://localhost:4000/docs

Sign in with:

- Username: `admin`
- Password: `admin123`

## Getting started (first time)

From the project root:

1. Install dependencies

	```bash
	pnpm install
	```

2. Start PostgreSQL in Docker

	```bash
	docker compose up -d
	```

3. Initialize database schema + seed data

	```bash
	node scripts/first-run-db-init.mjs
	```

4. Start API and Web apps

	```bash
	pnpm dev
	```

## Open the app

- Web app: http://localhost:5173
- API: http://localhost:4000
- API docs (Swagger): http://localhost:4000/docs

Default login:

- Username: `admin`
- Password: `admin123`

## VS Code F5 launch (recommended)

If you are using VS Code and Docker Desktop is running, you can launch everything with one profile:

1. Open the **Run and Debug** panel.
2. Select **RIMDP: Full Stack (Docker + API + Web)**.
3. Press **F5**.

This profile will:

- Start Docker services (PostgreSQL)
- Run DB init/migrations/conditional seed task
- Start API debug session
- Start Web dev server
- Open the app in a browser debug session

## Common commands

Run from repo root:

- Start dev mode: `pnpm dev`
- Build everything: `pnpm build`
- Typecheck: `pnpm typecheck`
- Run tests: `pnpm test`
- Run tests with coverage: `pnpm test:coverage`

## Database notes

- The DB init script runs migrations and performs conditional seeding.
- If tables are empty, seed data is inserted automatically.
- If data already exists, seeding is skipped.

## Optional: run frontend in Docker

```bash
docker compose --profile web up -d web
```

Then open: http://localhost:5173

Stop it with:

```bash
docker compose --profile web down
```

## Troubleshooting

- If API says port 4000 is in use, stop the other process using that port and restart.
- If login works but UI looks stale, hard refresh the browser once after pulling new changes.
- If DB-related errors appear, rerun:

  ```bash
  node scripts/first-run-db-init.mjs
  ```
