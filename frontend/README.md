# Job Executive - Frontend

The React and TypeScript client for Job Executive, a job portal for job seekers, employers, and administrators. The frontend is built with Vite and Tailwind CSS and communicates with the Express API over HTTP.

![Job Executive application preview](photo-collage.png.png)

## Features

- Public job, company, and blog pages
- Job seeker profile, job applications, and application tracking
- Employer job management and applicant review
- Administrator views for managing users and jobs
- Gemini-powered resume enhancement through the backend API
- JWT attachment and 401 handling through a shared Axios instance

## Requirements

- Node.js 18 or newer
- The backend API running locally or deployed

## Run locally

From the repository root:

```powershell
cd frontend
npm install
```

By default, Vite uses `http://localhost:4000/api` for API calls during development. To use a different backend, create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:4000/api
```

Then start the development server:

```powershell
npm run dev
```

Vite serves the frontend at `http://localhost:3000`.

## Build

```powershell
npm run build
npm run preview
```

The production files are written to `dist/`. The project currently defines `dev`, `build`, and `preview` scripts; it does not define a frontend test or lint script.

## API configuration and secrets

When the frontend and backend are deployed on different domains, set `VITE_API_URL` to the backend API origin, ending in `/api`. This variable is included in the browser build, so it must not contain secrets.

Keep `GEMINI_API_KEY`, `JWT_SECRET`, and `MONGO_URI` on the backend only. **Do not set `GEMINI_API_KEY` in the frontend environment.** The current `vite.config.ts` maps Gemini environment values into client-side defines; remove those mappings before supplying any Gemini key to avoid exposing it in the built JavaScript.

See the [backend README](../backend/README.md) for API setup and deployment.
