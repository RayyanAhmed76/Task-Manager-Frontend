# Team Task Manager 

Simple, clean Node.js + React stack implementing teams, memberships, and tasks with secure session auth.

## Quick Start (Beginners)

Follow these steps exactly on Windows.

### 0) Install tools

- Node.js (LTS): https://nodejs.org
- PostgreSQL: https://www.postgresql.org/download/

### 1) Project folders

You should see two folders at the project root:

- `backend/` (Node + Express API)
- `frontend/` (Vite + React UI)

### 2) Create PostgreSQL database (one-time)

Use pgAdmin GUI or run in PowerShell (adjust password prompt as needed):

```
psql -U postgres -c "CREATE DATABASE \"Task-Manager\";"
```

### 3) Backend environment file

Create `backend/.env` with:

```
PORT=3000
SESSION_SECRET=devsecret
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASS=YOUR_POSTGRES_PASSWORD
DB_NAME=Task-Manager
NODE_ENV=development
```

### 4) Install backend deps and set up DB

In PowerShell from the `backend/` folder:

```
npm install
npx knex migrate:latest
npx knex seed:run
```

### 5) Start backend (API)

From `backend/`:

```
npm run dev
```

Keep this window running (API at http://localhost:3000).

### 6) Install and run frontend

Open a new PowerShell window, go to `frontend/`:

```
npm install
npm run dev
```

Open the URL shown (usually http://localhost:5173). The Vite proxy forwards API calls to the backend.

### 7) Login with seed users

- alice@example.com / password123 (team owner)
- bob@example.com / password123 (member)

### 8) Common issues

- If `psql` is not recognized, use pgAdmin to create the DB or add PostgreSQL bin to PATH.
- Database connection errors: check `backend/.env` (user/password/port) and ensure PostgreSQL service is running.
- CORS errors: always run frontend with `npm run dev` so the Vite proxy is used.

---

## Tech

- Backend: Node.js, Express, Knex, PostgreSQL, express-session + connect-pg-simple, bcrypt, express-validator
- Frontend: React (Vite), TailwindCSS

## Backend Setup

1. Create `.env` in `Task-Manager-Backend/`:

```
PORT=3000
SESSION_SECRET=devsecret
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASS=
DB_NAME=Task-Manager
NODE_ENV=development
```

2. Install deps and run DB migrations + seeds:

```
npm install
npx knex migrate:latest
npx knex seed:run
```

3. Start backend:

```
npm run dev
```

Server runs on `http://localhost:3000`.

### API Overview

- Auth (`/auth`):
  - POST `/register` { name, email, password }
  - POST `/login` { email, password }
  - POST `/logout`
  - GET `/me`
- Teams (`/teams`, auth required):
  - GET `/` list teams for current user
  - POST `/` { name } create team and add current user as owner
  - POST `/:id/members` { user_id } add member (owner only)
  - DELETE `/:id` delete team (owner only)
- Tasks (`/tasks`, auth required):
  - GET `/?teamId=&assigneeId=` list tasks filtered by team or assignee in teams you belong to
  - POST `/` { title, description?, team_id, assigned_to?, due_date? }
  - PATCH `/:id` { title?, description?, assigned_to?, due_date?, status? }
  - DELETE `/:id`

Validation and membership checks are enforced.

## Frontend Setup

1. Go to `frontend/` and install:

```
cd frontend
npm install
```

2. Start frontend dev server:

```
npm run dev
```

Vite proxy forwards API requests to `http://localhost:3000` so no CORS changes needed. Keep backend running.

## Test Accounts (from seeds)

- alice@example.com / password123 (team owner)
- bob@example.com / password123 (member)

## Deploy

- Backend (Render):
  - Create PostgreSQL on Render
  - Set env vars from `.env`
  - Build: `npm install && npx knex migrate:latest && npx knex seed:run`
  - Start: `node src/index.js`
- Frontend (Netlify):
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
  - Use Netlify "Redirects/Proxies" or point frontend to backend URL (update `vite.config.js` or use absolute API base)
