# 🧠 Job Executive — Enterprise Full-Stack Job Portal & Recruitment Ecosystem

<p align="center">
  <a href="https://daily-apply.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-brightgreen?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
  <a href="#-public-demo-accounts--zero-friction-exploration">
    <img src="https://img.shields.io/badge/👤_Demo_Accounts-Try_All_Roles-blue?style=for-the-badge" alt="Demo Accounts">
  </a>
</p>

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express-5.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS v3](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Job Executive** is an enterprise-grade full-stack recruitment platform connecting ambitious job seekers, hiring enterprises, and platform moderators. Built with **React 19**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express 5**, and **MongoDB**, the platform features sub-50ms queries via compound indexes, zero-storage cloud resume linking, real-time hiring pipelines, and **Google Gemini 2.5 Flash AI** for instant resume bullet-point enhancement.

---
**Live Link** https://daily-apply.vercel.app/

## 🌟 Public Demo Accounts — Zero Friction Exploration

Visitors can immediately explore all role-based dashboards on the live platform without registration:

| User Role | Pre-Seeded Email | Password | Primary Capabilities to Test |
|:---|:---|:---|:---|
| 👷 **Job Seeker** | `demo.seeker@jobexecutive.com` | `Demo@12345` | Browse 35+ jobs, multi-filter, submit applications, test Gemini AI Resume Booster |
| 🏢 **Employer** | `demo.employer@jobexecutive.com` | `Demo@12345` | Post vacancies, manage active listings, review candidate dossiers, update applicant stages |
| 👑 **Administrator** | `demo.admin@jobexecutive.com` | `Demo@12345` | Platform health stats, global user moderation, role updates, vacancy moderation |

> 🛡️ **Active State Protection**: All demo accounts are guarded by custom `protectDemoAccount` middleware. Public visitors cannot delete demo accounts or alter their passwords, guaranteeing continuous stability for all evaluators.

---

## 🚀 Key Features by Persona

### 👷 For Job Seekers
* **Multi-Faceted Job Search**: Filter across 35+ vacancies by search keyword, 22+ industry categories, job type (Full-time, Part-time, Contract, Internship, Freelance), location, and dynamic salary range slider.
* **Smart Application Pipeline**: One-click apply with cloud Google Drive resume linking, cover letter submission, and automated duplicate prevention.
* **Real-Time Application Tracking**: Track hiring stages in real time: `Applied` ➔ `Screening` ➔ `Interviewing` ➔ `Offered` ➔ `Rejected`.
* **🤖 Google Gemini AI Resume Booster**: Paste raw resume bullet points to instantly receive executive-ready, metric-driven phrasing powered by `gemini-2.5-flash`.
* **Profile Management**: Maintain professional title, skills tags, expected salary, and bio.

### 🏢 For Employers & Recruiters
* **Job Vacancy Management**: Post vacancies with customizable workplace types (`Remote`, `Hybrid`, `On-site`), salary brackets (LPA), experience levels, and requirements.
* **Complete Candidate Dossier**: View applicants with populated professional profiles (contact phone, skills badges, expected compensation, and Google Drive resume link).
* **Recruitment Pipeline Progression**: Transition candidate stages with instant status updates visible to applicants.
* **Company Profile Branding**: Maintain verified company name, website link, description, and logo.

### 👑 For System Administrators
* **Global Platform Metrics**: Real-time KPI aggregation of total registered users, active jobs, and total applications submitted.
* **User Management & Role Elevation**: Promote candidates to recruiters or admins using safe `$set` atomic operators that preserve password integrity.
* **Job Content Moderation**: Audit and delete inappropriate or spam job postings.
* **Demo Account Shields**: Automated middleware preventing vandalism of public demonstration accounts.

### 🌐 For Public Visitors & Community
* **Interactive 3D Hero Visual**: GPU-accelerated 3D floating briefcase canvas built with Three.js and `@react-three/fiber`.
* **Community Career Blog**: Read industry articles, filter by tags, participate in discussions with threaded comments, and interact via Like, Love, and Dislike reactions.
* **Companies Directory**: Explore hiring companies and active job openings without logging in.

---

## 🏗️ System Architecture

```
+-----------------------------------------------------------------------------------+
|                           CLIENT TIER (React 19 + TypeScript)                     |
|                                                                                   |
|  [3D Hero Canvas]   [Jobs Explore View]   [Dashboards]   [Modal Dialogs]          |
|         |                   |                   |               |                 |
|         +-------------------+-------------------+---------------+                 |
|                                     |                                             |
|                              [App.tsx State]                                      |
|                                     |                                             |
|                             [apiService.ts]                                       |
|                                     |                                             |
|                         [axiosInstance Interceptor]                               |
|                     (Attaches Authorization: Bearer <JWT>)                        |
+-------------------------------------+---------------------------------------------+
                                      | HTTP REST / JSON
                                      v
+-----------------------------------------------------------------------------------+
|                         GATEWAY & SECURITY MIDDLEWARE TIER                        |
|                                                                                   |
|   [Helmet Headers]  --->  [CORS (*)]  --->  [Body Parser (1MB)]  --->  [RateLimit]|
+-------------------------------------+---------------------------------------------+
                                      |
                                      v
+-----------------------------------------------------------------------------------+
|                          ROUTING & AUTHORIZATION TIER                             |
|                                                                                   |
|   /api/auth         /api/job          /api/applications    /api/admin   /api/blogs|
|        |                 |                    |                 |            |    |
|   [authRoutes]      [jobRoutes]       [applicationRoutes]  [adminRoutes]     |    |
|        |                 |                    |                 |            |    |
|        +---------> [requireAuth] ------------>+                 |            |    |
|                          |                                      |            |    |
|                   [authorize(ROLES)] <--------------------------+            |    |
|                          |                                                   |    |
|                 [protectDemoAccount]                                         |    |
+--------------------------+---------------------------------------------------+----+
                           |
                           v
+-----------------------------------------------------------------------------------+
|                       CONTROLLERS & BUSINESS LOGIC TIER                           |
|                                                                                   |
|  [auth.controller]   [job.controller]   [application.ctrl]   [admin.ctrl]  [ai.ctrl]
+--------------------------+---------------------------------------------+----------+
                           |                                             |
                           v                                             v
+-------------------------------------+   +-----------------------------------------+
|     DATA PERSISTENCE TIER (MongoDB) |   |    EXTERNAL CLOUD SERVICES              |
|                                     |   |                                         |
|  User Collection (Unique Indexes)   |   |  Google Gemini 2.5 Flash API            |
|  Job Collection (Compound Indexes)  |   |  (Resume Enhancement Engine)            |
|  Application Collection (Unique Cpd)|   +-----------------------------------------+
|  BlogPost Collection (Subdocuments) |
+-------------------------------------+
```

---

## 🛠️ Technology Stack Breakdown

| Technology | Category | Role in Job Executive |
|:---|:---|:---|
| **React 19** | Frontend Framework | Declarative UI, state machine view transitions, responsive dashboards |
| **TypeScript 5** | Language | Strict compile-time type safety across API contracts and UI props |
| **Tailwind CSS v3** | Styling Engine | Modern utility-first design system, responsive breakpoints, sleek modals |
| **Vite 5** | Build Tool | Sub-second HMR development server, optimized Rollup production bundling |
| **Three.js / R3F** | 3D Graphics | Interactive 3D hero canvas with rotating briefcase and floating particles |
| **Lucide React** | Iconography | Modern, consistent SVG iconography across dashboards and forms |
| **Axios** | HTTP Client | Centralized request interceptor for JWT injection and 401 response handling |
| **Node.js 20+** | Runtime | Asynchronous, event-driven runtime hosting the backend REST API |
| **Express 5** | Web Framework | Native promise rejection routing, modular controllers, security middleware |
| **MongoDB 7** | Database | Scalable document persistence for users, jobs, applications, and blogs |
| **Mongoose 8** | ODM | Schema validation, pre-save hooks, compound indexing, `.lean()` query bypass |
| **JSON Web Token** | Authentication | Stateless HS256 tokens with 7-day expiration passed via Bearer headers |
| **bcryptjs** | Password Security | 10-round cryptographic salting and hashing; schema projection suppression |
| **express-rate-limit** | API Security | Sliding-window rate limiter (100 req/15 min) shielding authentication routes |
| **Helmet** | HTTP Security | Sets 14 security headers (CSP, X-Frame-Options, X-Content-Type-Options) |
| **Google Gemini API** | AI Integration | Official `@google/genai` SDK executing `gemini-2.5-flash` resume enhancement |
| **Swagger UI** | Documentation | Interactive OpenAPI 3.0 specification available at `/api-docs` |

---

## 📁 Repository Directory Structure

```
job-executive-fullstack/
├── backend/                        # Express 5 REST API & MongoDB Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Mongoose MongoDB connection pool
│   │   ├── controllers/            # Business logic controllers
│   │   │   ├── admin.controller.js
│   │   │   ├── ai.controller.js    # Google Gemini 2.5 Flash integration
│   │   │   ├── application.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── blog.controller.js
│   │   │   ├── blogComment.controller.js
│   │   │   ├── blogReaction.controller.js
│   │   │   └── job.controller.js
│   │   ├── middleware/
│   │   │   └── auth.js             # requireAuth, authorize, protectDemoAccount
│   │   ├── models/                 # Mongoose schemas & compound indexes
│   │   │   ├── application.model.js
│   │   │   ├── blog.model.js
│   │   │   ├── job.model.js
│   │   │   └── user.model.js
│   │   ├── routes/                 # Express route definitions
│   │   ├── tests/
│   │   │   └── backend.test.js     # 12 automated integration tests (node:test)
│   │   ├── utils/
│   │   │   └── seedDemoData.js     # 3 demo accounts & 35+ Indian tech jobs
│   │   ├── app.js                  # Express app & middleware configuration
│   │   ├── server.js               # HTTP server listener
│   │   └── swagger.js              # Swagger OpenAPI documentation setup
│   ├── .env.example                # Backend environment configuration template
│   └── package.json
│
├── frontend/                       # React 19 + TypeScript + Vite SPA
│   ├── components/                 # Component hierarchy
│   │   ├── companies/              # Companies explore page
│   │   ├── icons/                  # Lucide React icons
│   │   ├── jobs/                   # Jobs explore page & multi-filter controls
│   │   ├── landing/                # Landing page & Three.js 3D Hero canvas
│   │   ├── ui/                     # Reusable UI primitives (Toaster, Badges)
│   │   ├── AdminDashboard.tsx      # System administrator dashboard
│   │   ├── BlogPage.tsx            # Community blog & reaction system
│   │   ├── CompanyDashboard.tsx    # Recruiter applicant review & pipeline
│   │   ├── JobDetails.tsx          # Job detail view modal
│   │   ├── LoginPage.tsx           # Multi-role login & 1-click demo buttons
│   │   ├── Modal.tsx               # Reusable dialog wrapper
│   │   ├── SeekerDashboard.tsx     # Candidate applications & AI resume booster
│   │   └── SignupPage.tsx          # User registration form
│   ├── services/
│   │   ├── apiService.ts           # Typed API service methods & normalizers
│   │   └── axiosInstance.ts        # Axios interceptors (JWT injection & 401 eviction)
│   ├── types/
│   │   └── index.ts                # TypeScript domain models (User, Job, etc.)
│   ├── App.tsx                     # State-machine view router & app root
│   ├── index.html
│   ├── tailwind.config.js          # Tailwind CSS v3 design tokens
│   └── vite.config.ts
│
├── PROJECT_EXPLANATION.txt         # 5-10 minute interview walkthrough
├── INTERVIEW_QUESTIONS.txt         # 65 project interview questions and answers
└── README.md                       # Repository master documentation
```

---

## ⚡ Getting Started & Local Installation

### Prerequisites
* **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
* **npm**: `v9.0.0` or higher
* **MongoDB**: Local MongoDB instance (`mongod`) running on port `27017` or a **MongoDB Atlas** cluster URI

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/job-executive.git
cd job-executive
```

---

### 2️⃣ Backend Setup & Execution
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Local development uses MongoDB at 127.0.0.1:27017/jobexecutive
# Add your optional GEMINI_API_KEY; set production MONGO_URI in Render only

# Optionally seed demo accounts and jobs
npm run seed

# Run automated integration tests (12 tests)
npm test

# Start backend development server
npm run dev
# -> Server running on http://localhost:4000
# -> Swagger API Docs available at http://localhost:4000/api-docs
```

---

### 3️⃣ Frontend Setup & Execution
```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
# -> Client running on http://localhost:3000
```

---

## 🔐 Environment Variables Specification

### Backend Configuration (`backend/.env`)

| Variable | Required | Default / Example Value | Description |
|:---|:---:|:---|:---|
| `PORT` | Optional | `4000` | Port for the Express backend server |
| `MONGO_URI` | Production only | Set in Render | MongoDB Atlas URI; development always uses local MongoDB |
| `JWT_SECRET` | **Required** | Generate a long random value | Secret key for signing and verifying JWTs |
| `NODE_ENV` | Optional | `development` | Environment mode (`development` or `production`) |
| `ENABLE_DEMO_DATA` | Optional | `false` | When `true`, automatically seeds demo users and jobs |
| `GEMINI_API_KEY` | Optional | Set privately | Google Gemini API key for AI Resume Booster feature |
| `CORS_ORIGINS` | Optional | Local Vite origins | Comma-separated list of allowed frontend origins |

### Frontend Configuration (`frontend/.env`)

| Variable | Required | Default / Example Value | Description |
|:---|:---:|:---|:---|
| `VITE_API_URL` | Optional in development | `http://localhost:4000/api` | Set to the deployed Render API URL in Vercel |

---

## 📍 Complete REST API Reference

All protected endpoints require an `Authorization: Bearer <token>` header.

### 🔑 Authentication Routes (`/api/auth`)
| Method | Endpoint | Access Level | Description |
|:---|:---|:---:|:---|
| `POST` | `/api/auth/register` | Public | Register a new user (`SEEKER` or `EMPLOYER`) |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and receive 7-day JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve profile of the currently logged-in user |
| `PUT` | `/api/auth/me` | Authenticated | Update user profile, skills, bio, or resume Google Drive URL |
| `GET` | `/api/auth/companies` | Public | Retrieve list of verified employers for companies explore view |
| `POST` | `/api/auth/companies/:id/reviews` | Seeker Only | Submit a company review and rating |

### 💼 Job Management Routes (`/api/job`)
| Method | Endpoint | Access Level | Description |
|:---|:---|:---:|:---|
| `GET` | `/api/job` | Public | Search and multi-filter jobs (category, salary, type, location) |
| `GET` | `/api/job/:id` | Public | Retrieve full details for a specific vacancy |
| `POST` | `/api/job` | Employer Only | Publish a new job vacancy |
| `GET` | `/api/job/my/jobs` | Employer Only | Retrieve all vacancies posted by the logged-in employer |
| `PUT` | `/api/job/:id` | Employer (Owner) | Update an existing job vacancy |
| `DELETE` | `/api/job/:id` | Employer / Admin | Remove a job vacancy |

### 📄 Job Application Pipeline Routes (`/api/applications`)
| Method | Endpoint | Access Level | Description |
|:---|:---|:---:|:---|
| `POST` | `/api/applications/:jobId/apply` | Seeker Only | Submit an application with resume link and cover letter |
| `GET` | `/api/applications/me` | Seeker Only | Retrieve all job applications submitted by the candidate |
| `GET` | `/api/applications/:jobId/applications` | Employer (Owner) | Retrieve all candidate dossiers for a specific job |
| `PUT` | `/api/applications/status/:applicationId` | Employer (Owner) | Progress applicant stage (`applied` ➔ `interviewing` ➔ `offered`) |

### 👑 Administrator Routes (`/api/admin`)
| Method | Endpoint | Access Level | Description |
|:---|:---|:---:|:---|
| `GET` | `/api/admin/users` | Admin Only | Retrieve all platform users (excluding password hashes) |
| `GET` | `/api/admin/jobs` | Admin Only | Retrieve all platform jobs for moderation |
| `GET` | `/api/admin/seekers` | Admin Only | Retrieve all registered job seekers |
| `DELETE` | `/api/admin/users/:id` | Admin Only | Delete a user (guarded by `protectDemoAccount`) |
| `DELETE` | `/api/admin/jobs/:id` | Admin Only | Delete an inappropriate job vacancy |
| `PUT` | `/api/admin/users/:id/role` | Admin Only | Update user role (guarded by `protectDemoAccount`) |

### 📰 Community Blog Routes (`/api/blogs`)
| Method | Endpoint | Access Level | Description |
|:---|:---|:---:|:---|
| `GET` | `/api/blogs` | Public | Retrieve published career articles and discussions |
| `GET` | `/api/blogs/:id` | Public | Retrieve a specific article with threaded comments |
| `POST` | `/api/blogs` | Authenticated | Publish a new blog post |
| `PUT` | `/api/blogs/:id` | Author / Admin | Update blog post content |
| `DELETE` | `/api/blogs/:id` | Author / Admin | Remove a blog post |
| `POST` | `/api/blogs/:id/reactions` | Authenticated | Toggle or switch reactions (`like`, `love`, `dislike`) |
| `POST` | `/api/blogs/:id/comments` | Authenticated | Add a comment to an article |
| `DELETE` | `/api/blogs/:id/comments/:commentId` | Author / Admin | Remove a comment from an article |

### 🤖 AI Integration Routes (`/api/ai`)
| Method | Endpoint | Access Level | Description |
|:---|:---|:---:|:---|
| `POST` | `/api/ai/boost` | Authenticated | Enhance resume draft using Google Gemini 2.5 Flash |

---

## 🧪 Automated Testing Suite

The backend includes a native integration test suite (`backend/src/tests/backend.test.js`) executed with Node's built-in test runner (`node:test`) and Supertest:

```bash
cd backend
npm test
```

### Verified Test Assertions (12/12 Passing)
* ✅ **Test 1**: Health check endpoint returns `200 OK` (`{ status: "OK" }`).
* ✅ **Test 2**: Auth rate limiter attaches standard `ratelimit-limit` response headers.
* ✅ **Test 3**: All 3 public demo accounts (`SEEKER`, `EMPLOYER`, `ADMIN`) successfully log in and receive valid 7-day JWTs.
* ✅ **Test 4**: Role Authorization: `SEEKER` token attempting to access `/api/admin/users` is correctly rejected with `403 Forbidden`.
* ✅ **Test 5**: Seeker profile retrieval returns candidate details while excluding password hashes.
* ✅ **Test 6**: Job search returns active vacancies and verifies query filtering logic.
* ✅ **Test 7**: Admin job listing returns all system vacancies.
* ✅ **Test 8**: Employer can retrieve applicant lists for their posted vacancies.
* ✅ **Test 9**: Seeker can apply to a job vacancy.
* ✅ **Test 10**: Duplicate application prevention: Second application to the same vacancy is rejected with `400 Bad Request`.
* ✅ **Test 11**: Seeker dashboard reflects application in `applied` status.
* ✅ **Test 12**: Public demo protection: Attempting to delete the demo admin account via `/api/admin/users/:id` is rejected with `403 Forbidden`.

---

## 📚 Interview Preparation

* [PROJECT_EXPLANATION.txt](PROJECT_EXPLANATION.txt) - A spoken 5-10 minute project walkthrough.
* [INTERVIEW_QUESTIONS.txt](INTERVIEW_QUESTIONS.txt) - 65 project-specific interviewer questions with concise sample answers.

---

## 🚀 Production Deployment Guide

### MongoDB Atlas
1. Create an Atlas database and database user.
2. Add the Atlas connection URI as `MONGO_URI` in Render. Keep it private.
3. Configure Atlas network access for Render as narrowly as your hosting plan allows.

### Backend on Render
1. Create a Web Service from this repository and set its root directory to `backend`.
2. Use `npm install` as the build command and `npm start` as the start command.
3. Set `NODE_ENV=production`, `MONGO_URI`, a strong `JWT_SECRET`, and `CORS_ORIGINS=https://your-site.vercel.app`.
4. Add `GEMINI_API_KEY` if using the resume feature. Set `ENABLE_DEMO_DATA=true` only if you want public demo records.
5. Deploy and copy the Render service URL. Render provides the `PORT` environment variable.

### Frontend on Vercel
1. Import the same repository as a separate Vercel project and set its root directory to `frontend`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. The production API URL is currently configured as `https://job-portal-app-qc6i.onrender.com/api` in `frontend/.env.production`. Update it if the Render service URL changes.
4. Deploy. If the Vercel domain changes, update `CORS_ORIGINS` in Render and redeploy the backend.

Development keeps the frontend pointed at `http://localhost:4000/api`. The Vercel frontend variable is public browser configuration; never put backend secrets in frontend environment variables.

---

## 👨‍💻 Author & Engineering Ownership

**Vivek Sahu**  
*Full-Stack Software Engineer*  
GitHub: [@yourusername](https://github.com/yourusername)  


---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
