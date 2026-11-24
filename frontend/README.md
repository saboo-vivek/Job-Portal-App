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

Vite uses `http://localhost:4000/api` by default in development. To use a different backend, copy `.env.example` to `.env.local` and set:

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

When the frontend and backend are deployed on different domains, set `VITE_API_URL` in Vercel to the Render API URL, ending in `/api`, for example `https://your-api.onrender.com/api`. Vite embeds this value at build time, so redeploy after changing it. The variable is public configuration and must not contain secrets.

Keep `GEMINI_API_KEY`, `JWT_SECRET`, and `MONGO_URI` on the backend only. The Vite configuration does not expose backend environment variables to the browser.

See the [backend README](../backend/README.md) for API setup and deployment.
