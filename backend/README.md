# Job Executive - Backend

The REST API for Job Executive. It is built with Node.js, Express 5, MongoDB, and Mongoose. The API supports user authentication, job listings, applications, administration, community posts, and Gemini-powered resume enhancement.

## Requirements

- Node.js 18 or newer
- A MongoDB database, local or hosted
- A Gemini API key to use the AI resume endpoint

## Run locally

From the repository root:

```powershell
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=4000
JWT_SECRET=
GEMINI_API_KEY=your_gemini_api_key
ENABLE_DEMO_DATA=false
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

You can copy `.env.example` and replace its values. Keep `.env` out of Git. In development the backend always connects to `mongodb://127.0.0.1:27017/jobexecutive`; `MONGO_URI` is only used when `NODE_ENV=production`. Set `JWT_SECRET` to a long, random value. The AI endpoint requires `GEMINI_API_KEY`; other API features can be run without it. Production startup fails if the JWT secret is missing.

`CORS_ORIGINS` is a comma-separated list of allowed browser origins. Localhost origins are allowed automatically in development. In production, set this to your Vercel site origin, such as `https://your-site.vercel.app`.

Start the development server:

```powershell
npm run dev
```

The API listens on `http://localhost:4000`. Interactive Swagger documentation is available at `http://localhost:4000/api-docs`; the health endpoint is `http://localhost:4000/api/health`.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node.js |
| `npm test` | Run the backend tests with Node's built-in test runner |
| `npm run seed` | Seed demo users and job listings |

The tests exercise API behavior and expect a configured database with demo data. Use a separate test database, never a production database. To load demo data on server startup, set `ENABLE_DEMO_DATA=true`; the seed command can also be run explicitly. Only enable demo seeding where shared demo records are wanted.

## API overview

All API routes use the `/api` prefix.

| Prefix | Purpose |
| --- | --- |
| `/api/auth` | Registration, login, profiles, and company directory |
| `/api/job` | Public job search and employer job management |
| `/api/applications` | Applying, application history, and status updates |
| `/api/admin` | Admin-only user and job management |
| `/api/blogs` | Posts, reactions, and comments |
| `/api/ai` | Gemini resume enhancement |

Protected endpoints require a Bearer JWT. Role checks and ownership checks are performed by the API; do not rely on frontend visibility as access control. See Swagger for endpoint details and request schemas.

## Data and behavior

- Users have `SEEKER`, `EMPLOYER`, or `ADMIN` roles.
- Jobs reference the employer who created them.
- Applications reference a job and seeker and have `APPLIED`, `SHORTLISTED`, `HIRED`, or `REJECTED` status.
- A unique compound index prevents more than one application for the same seeker/job pair.
- Job search supports keyword, location, job type, work location type, experience level, and salary range filters.
- Demo records are marked and protected from selected destructive changes.

## Deployment

### Render backend

1. Create a Render Web Service from this Git repository and set its root directory to `backend`.
2. Use `npm install` as the build command and `npm start` as the start command.
3. Add these environment variables in Render:
   - `NODE_ENV=production`
   - `MONGO_URI` from your MongoDB Atlas database
   - `JWT_SECRET` set to a long, unique secret
   - `CORS_ORIGINS=https://your-site.vercel.app`
   - `GEMINI_API_KEY` if you want to enable resume enhancement
4. Deploy and copy the service URL. The API base URL is the service URL followed by `/api`.

Create a MongoDB Atlas database and database user, then put its connection URI in Render as `MONGO_URI`. Do not commit the URI or share it publicly. Configure Atlas network access for the Render service as narrowly as your hosting plan allows.

The backend directory also includes a Vercel serverless handler and `vercel.json`, but the recommended setup for this project is Render for the API.

### Vercel frontend

Import the same Git repository as a separate Vercel project and set its root directory to `frontend`. Use `npm run build` as the build command and `dist` as the output directory. Set `VITE_API_URL` to `https://your-api.onrender.com/api`, replacing the example with your Render URL, then deploy. If the Vercel domain changes, update `CORS_ORIGINS` in Render and redeploy the backend.

See the [frontend README](../frontend/README.md) for local frontend commands. Never put backend secrets in Vercel frontend environment variables.
