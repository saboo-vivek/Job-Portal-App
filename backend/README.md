# 🧠 Job Executive — Enterprise Full-Stack Job Portal (Backend)

Backend service for **Job Executive** — an enterprise recruitment platform connecting talent and hiring organizations with role-based access control, real-time candidate pipelines, editorial community forums, and **Google Gemini AI resume optimization**.

---

## 🔑 Public Demonstration Accounts

The platform includes pre-seeded, safe demonstration credentials for public visitors and recruiters to explore the application without registering:

| Role | Email Address | Password | Privileges & Workspace |
|---|---|---|---|
| **Job Seeker** | `demo.seeker@jobexecutive.com` | `Demo@12345` | Candidate dashboard, 1-click apply, AI resume booster, application tracking |
| **Employer** | `demo.employer@jobexecutive.com` | `Demo@12345` | Organization workspace, 35+ seeded job postings, candidate review pipeline |
| **Administrator** | `demo.admin@jobexecutive.com` | `Demo@12345` | Root administration console, moderation, role oversight |

### 🛡️ Public Demo Safety & Security Controls
* **Immutable Shared Credentials**: Demo accounts are protected against email and password changes to ensure uninterrupted access for all public visitors.
* **Separation from Production Data**:
  * Demo administrators cannot delete real production users, modify real user roles, or delete real production jobs.
  * Demo employers can only manage jobs and candidate applications associated with their own vacancies.
  * Production administrator root credentials remain entirely private and separate from public demonstration accounts.

---

## 🛠️ Technology Stack & Architecture

* **Runtime**: Node.js (v18+ / v20 / v22 LTS)
* **Framework**: Express.js (`^5.1.0`)
* **Database**: MongoDB (Local or MongoDB Atlas) via Mongoose (`^8.19.2`)
* **Authentication**: JWT (`jsonwebtoken ^9.0.2`) with 7-day token expiration & `bcrypt` (`^6.0.0`)
* **AI Engine**: Google Gemini API (`@google/generative-ai` — `gemini-2.5-flash`)
* **Security**: `helmet` security headers, `express-rate-limit` (Auth & AI rate limiting), CORS
* **Testing**: Node.js Native Test Runner (`node:test` + `node:assert`)
* **API Documentation**: Interactive Swagger UI at `http://localhost:4000/api-docs`

---

## ⚙️ Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
JWT_SECRET=your_secure_jwt_secret_key
MONGO_URI=mongodb://127.0.0.1:27017/jobexecutive
GEMINI_API_KEY=your_google_gemini_api_key
ENABLE_DEMO_DATA=true
NODE_ENV=development
```

### Environment Variables Guide
* `PORT`: Port on which the Express server listens (default: `4000`).
* `JWT_SECRET`: Secret key used for signing and verifying JSON Web Tokens.
* `MONGO_URI`: MongoDB connection string (Local or MongoDB Atlas URI).
* `GEMINI_API_KEY`: API key for Google Gemini AI resume boosting.
* `ENABLE_DEMO_DATA`: Set to `true` to ensure demo accounts and 35+ realistic job vacancies are automatically verified/seeded on server boot. Set to `false` in strict production environments if seeding is not desired.

---

## 📦 Getting Started & Commands

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Safe Database Seeding
Seeds 3 public demo accounts and 35+ realistic job postings across 22 categories and major Indian tech hubs (Bengaluru, Hyderabad, Pune, Mumbai, Delhi NCR, Gurugram, etc.). Idempotent and safe to run multiple times:
```bash
npm run seed
```

### 3. Run Automated Test Suite
Executes the native test suite covering authentication, role verification, job discovery, search/filtering, demo safeguards, and bug regression:
```bash
npm test
```
*Current Status: 12 tests passing (0 failures, duration ~2.0s).*

### 4. Start Development Server
```bash
npm run dev
```

### 5. Start Production Server
```bash
npm start
```

---

## 🌐 API Reference Overview

Interactive documentation is available at `/api-docs`. Primary endpoints:

### Authentication & Users (`/api/auth`)
* `POST /api/auth/register` — Register seeker or employer account (Rate limited)
* `POST /api/auth/login` — Sign in and obtain JWT (Rate limited)
* `GET /api/auth/me` — Retrieve authenticated user profile (Excludes password hash)
* `PUT /api/auth/me` — Update profile details (Protected against demo credential tampering)
* `GET /api/auth/companies` — Public directory of hiring organizations

### Jobs (`/api/job`)
* `GET /api/job` — Public job feed with keyword (`q`), `location`, `jobType`, `locationType`, `experienceLevel`, and salary range filtering
* `GET /api/job/:id` — Single job details with populated employer metadata
* `GET /api/job/my/jobs` — Retrieve jobs posted by the logged-in employer
* `POST /api/job` — Post new vacancy (Employer only)
* `PUT /api/job/:id` — Update existing vacancy (Employer only)
* `DELETE /api/job/:id` — Remove job vacancy and cleanup candidate links (Employer only)

### Candidate Applications (`/api/applications`)
* `POST /api/applications/:id/apply` — Apply to a job vacancy (Seeker only; race-condition protected)
* `GET /api/applications/me` — View seeker's application tracker and status
* `GET /api/applications/:id/applications` — View candidate roster for a vacancy (Employer only; includes resume links and contact details)
* `PUT /api/applications/status/:id` — Update candidate status (`SHORTLISTED`, `HIRED`, `REJECTED`)

### Community Blog (`/api/blogs`)
* `GET /api/blogs` — Retrieve published articles and reviews
* `POST /api/blogs` — Create new post
* `POST /api/blogs/:id/react` — Add reaction (`like`, `love`, `dislike`)
* `DELETE /api/blogs/:id/react` — Remove reaction
* `POST /api/blogs/:id/comment` — Add discussion comment

### AI Services (`/api/ai`)
* `POST /api/ai/boost` — Gemini ATS resume enhancement (Rate limited to 20 req/15min)

### Platform Administration (`/api/admin`)
* `GET /api/admin/users` — Directory of all registered users
* `GET /api/admin/jobs` — Complete directory of all vacancies
* `DELETE /api/admin/users/:id` — Remove user and cascade cleanup
* `DELETE /api/admin/jobs/:id` — Moderate / remove job vacancy

---

## 🚀 Deployment Instructions

### Vercel Serverless Deployment
The repository includes a root `api/index.js` and `vercel.json`:
1. Connect the repository to Vercel.
2. In the Vercel Project Settings, set the Root Directory to `backend` (or deploy from repository root).
3. Configure Environment Variables in the Vercel Dashboard:
   * `MONGO_URI`
   * `JWT_SECRET`
   * `GEMINI_API_KEY`
   * `ENABLE_DEMO_DATA=true`
4. Deploy. Vercel routes `/api/(.*)` directly to `api/index.js`.

### Standard Cloud / VPS Deployment (Docker / AWS / Render / Railway)
1. Ensure Node.js 18+ and MongoDB are reachable.
2. Set environment variables.
3. Run `npm install --omit=dev`.
4. Run `npm run seed` to ensure demo data and base indexes are established.
5. Launch `npm start`.
