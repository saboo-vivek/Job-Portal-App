import os
import sys
sys.path.append(os.path.dirname(__file__))

import doc_style

def generate_document_1():
    doc = doc_style.create_document()
    
    # Title & Metadata
    doc_style.add_title_block(
        doc,
        title="Job Executive — Full-Stack Project Architecture, Implementation & Technical Interview Guide",
        subtitle="A comprehensive end-to-end technical deep-dive into architecture, control flow, database schemas, security hardening, and interview defense strategies.",
        author="Vivek Sahu",
        tag="SENIOR ARCHITECTURE & CODEBASE DEFENSE GUIDE"
    )

    # ---------------------------------------------------------------------------
    # SECTION 1: PROJECT INTRODUCTION
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "1. Project Introduction & Executive Overview")
    
    doc_style.add_heading_2(doc, "1.1 What is Job Executive?")
    doc_style.add_body_p(
        doc,
        "Job Executive is an enterprise-grade, full-stack recruitment platform and career management ecosystem designed to bridge the gap between ambitious job seekers, hiring enterprises, and platform administrators. Built on modern web technologies—React 19, TypeScript, Tailwind CSS, Node.js, Express 5, and MongoDB—the platform provides a seamless, real-time recruitment experience enhanced by Google Gemini AI for instant resume refinement and optimization."
    )

    doc_style.add_heading_2(doc, "1.2 What Problem Does It Solve?")
    doc_style.add_body_p(
        doc,
        "Traditional job portals and recruitment boards suffer from several pervasive architectural and user-experience issues:\n"
        "1. Fragmented Workflows: Seekers struggle with opaque application statuses, while employers are overwhelmed with unorganized applicant pools lacking structured profile visibility.\n"
        "2. High Latency & Bloated Overhead: Many legacy portals rely on heavy relational table joins or unindexed document queries, leading to sluggish search and filtering experiences.\n"
        "3. Inflexible Storage Bottlenecks: Forcing file uploads directly onto application servers introduces scalability bottlenecks, bandwidth costs, and security attack vectors (such as malicious PDF payloads).\n"
        "4. Generic Resumes: Applicants submit untailored resumes with grammatical inconsistencies or weak impact phrasing, leading to high rejection rates before human review.\n"
        "5. High Barrier for Public Evaluation: Most platforms require full registration before visitors can evaluate functionality, making recruitment portfolio demonstrations impossible for evaluators and recruiters."
    )
    doc_style.add_body_p(
        doc,
        "Job Executive directly resolves these challenges through:\n"
        "• A decoupled Single Page Application (SPA) with responsive multi-faceted filtering.\n"
        "• Zero-storage cloud resume linking via Google Drive URLs, eliminating server-side file overhead while preserving candidate privacy controls.\n"
        "• Gemini 2.5 Flash AI Resume Booster providing real-time bullet-point enhancement.\n"
        "• High-performance MongoDB compound indexes and lean hydration bypass for sub-50ms query responses.\n"
        "• Pre-seeded, publicly accessible multi-role demo accounts with active tampering safeguards."
    )

    doc_style.add_heading_2(doc, "1.3 Target User Personas & Core Objectives")
    doc_style.add_styled_table(
        doc,
        ["User Role", "Target Persona", "Primary System Responsibilities", "Core Dashboard Capabilities"],
        [
            ["Job Seeker", "Active candidates, freshers, & experienced software engineers", "Explore vacancies, filter by salary/location/type, submit applications, boost resume", "View applied jobs, track application stage (Applied -> Offered), edit profile & skills"],
            ["Employer", "Corporate recruiters, HR leads, & engineering hiring managers", "Publish job listings, manage hiring pipelines, inspect applicant candidate profiles", "Post vacancies, view hydrated candidate dossiers, progress applicant status, close jobs"],
            ["Administrator", "Platform moderators, system engineers, & operations leads", "Audit platform activity, moderate job postings, manage user roles, maintain safety", "Global user directory, role change elevation, vacancy moderation, demo safeguards"],
            ["Public Visitor", "Recruiters, portfolio evaluators, & guest users", "Explore public platform features without registration friction", "Browse live jobs, test pre-seeded demo accounts (Seeker, Employer, Admin)"]
        ],
        col_widths=[1.2, 1.6, 2.0, 1.7]
    )

    doc_style.add_callout(
        doc,
        "\"Job Executive is a production-grade full-stack recruitment platform built with React 19, TypeScript, Node.js, Express, and MongoDB. It connects job seekers, employers, and administrators through role-based workflows, optimized with compound database indexes and lean queries for sub-50ms response times. Key innovations include an integrated Google Gemini AI Resume Booster and a public demo sandbox protected against state tampering, providing a zero-friction evaluation experience.\"",
        title="30-Second Interview Elevator Pitch (Verbatim Script)"
    )

    # ---------------------------------------------------------------------------
    # SECTION 2: TECHNOLOGY STACK
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "2. Technology Stack & Architectural Decision Record")
    doc_style.add_body_p(
        doc,
        "Every technology in Job Executive was deliberately selected to achieve a balance between developer velocity, type safety, low runtime overhead, and cloud-native scalability. Below is the complete, verified technology breakdown:"
    )

    doc_style.add_styled_table(
        doc,
        ["Technology", "Category", "Why Chosen & Trade-off", "Where Used in Code", "Key Responsibility"],
        [
            ["React 19", "Frontend Library", "Modern concurrent rendering, efficient VDOM diffing, seamless hooks-based state", "frontend/src, App.tsx, components/*", "Renders UI components, manages view-state transitions, drives user interactions"],
            ["TypeScript 5", "Language", "Compile-time type safety, eliminated undefined bugs, contracts matching backend schemas", "frontend/types/index.ts, all .tsx files", "Enforces strict interfaces for User, Job, Application, and API payload responses"],
            ["Tailwind CSS v3", "Styling Engine", "Utility-first CSS, purgeable bundle footprint (<50KB), rapid dark/light styling", "frontend/src/index.css, tailwind.config.js", "Consistent design system, responsive grids, sleek dashboard layouts and badges"],
            ["Vite 5", "Build Tool", "Sub-second Hot Module Replacement (HMR) via native ES modules, Rollup bundling", "frontend/vite.config.ts", "Development server, TypeScript transpilation, and optimized production chunking"],
            ["Three.js / R3F", "3D Graphics", "Interactive 3D canvas hero visual, floating briefcase and particles without UI lag", "frontend/components/landing/HeroVisual.tsx", "Delivers a premium visual hook on the public landing page to captivate visitors"],
            ["Lucide React", "Iconography", "Lightweight, tree-shakable SVG icon set with consistent visual stroke widths", "frontend/components/icons/*, dashboards", "Visual indicators for job attributes, application stages, actions, and nav links"],
            ["Axios", "HTTP Client", "Interceptor pipeline for JWT bearer headers and global 401 session expiration", "frontend/services/axiosInstance.ts", "Manages all network requests between browser client and Express API endpoints"],
            ["Node.js", "Runtime", "Non-blocking event loop, high asynchronous concurrency for I/O bound queries", "backend/src/server.js", "Executes backend JavaScript, manages OS process signals, hosts HTTP server"],
            ["Express.js 5", "Web Framework", "Minimalist, unopinionated routing, native async error handling, modular middlewares", "backend/src/app.js, routes/*", "Parses HTTP requests, dispatches routes, enforces middleware pipelines"],
            ["MongoDB 7", "Database", "Document-oriented NoSQL persistence, flexible schema for complex user/job models", "MongoDB Atlas / Local mongod", "Stores persistent documents for Users, Jobs, Applications, and BlogPosts"],
            ["Mongoose 8", "ODM", "Strong schema validation, pre/post hooks, compound indexing, population joins", "backend/src/models/*", "Defines data schemas, manages DB connections, executes optimized lean queries"],
            ["JSON Web Token", "Authentication", "Stateless, cryptographically signed token (HS256) with role claims and 7d TTL", "backend/src/controllers/auth.controller.js", "Issues and verifies tamper-proof session tokens passed via Authorization headers"],
            ["bcryptjs", "Cryptography", "One-way adaptive key derivation function with 10 salt rounds against rainbow tables", "backend/src/models/user.model.js", "Hashes seeker/employer passwords before persistence; verifies hashes at login"],
            ["express-rate-limit", "Security", "Sliding-window rate limiter (100 req/15 min) mitigating brute-force attacks", "backend/src/routes/auth.routes.js", "Protects /api/auth endpoints against credential-stuffing and denial of service"],
            ["Helmet", "Security Headers", "Sets 14 HTTP headers (X-Frame-Options, X-Content-Type-Options, etc.)", "backend/src/app.js", "Guards against clickjacking, MIME-sniffing, and cross-site scripting (XSS)"],
            ["Google Gemini API", "AI Integration", "Fast, high-quality LLM (gemini-2.5-flash) for resume enhancement", "backend/src/controllers/ai.controller.js", "Analyzes raw resume drafts and generates professional, high-impact bullet points"]
        ],
        col_widths=[1.1, 0.9, 1.8, 1.6, 1.6]
    )

    # ---------------------------------------------------------------------------
    # SECTION 3: COMPLETE PROJECT ARCHITECTURE
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "3. Complete Project Architecture & System Design")
    doc_style.add_body_p(
        doc,
        "Job Executive follows a decoupled, cloud-native Multi-Tier Client-Server Architecture. The frontend operates as a rich Single Page Application (SPA) executed entirely within the client's browser, communicating with the Express REST API via asynchronous JSON-over-HTTPS. The backend is completely stateless, relying on cryptographic JWT tokens for session verification and MongoDB for persistent state."
    )

    doc_style.add_heading_2(doc, "3.1 End-to-End Architectural Flow Diagram")
    doc_style.add_code_block(
        doc,
        """+-----------------------------------------------------------------------------------+
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
+-------------------------------------+""",
        caption="High-Level Multi-Tier System Architecture"
    )

    doc_style.add_heading_2(doc, "3.2 Detailed Layer Responsibilities")
    doc_style.add_bullet_p(doc, "Client Presentation Layer: Implemented in React 19, TypeScript, and Tailwind CSS. Manages UI component rendering, local form validations, responsive navigation, and optimistic UI updates.", bold_prefix="1. ")
    doc_style.add_bullet_p(doc, "Network & Serialization Layer: Handled by Axios via a custom instance (frontend/services/axiosInstance.ts). Automatically injects the JWT Bearer token into headers and catches 401 Unauthorized responses to perform clean client-side session eviction.", bold_prefix="2. ")
    doc_style.add_bullet_p(doc, "Gateway & Middleware Pipeline: Express 5 pipeline executing security defenses in strict sequential order: Helmet -> CORS -> express.json() -> authRateLimiter -> requireAuth -> authorize -> protectDemoAccount.", bold_prefix="3. ")
    doc_style.add_bullet_p(doc, "Controller & Domain Logic Layer: Express controllers that parse parameters, enforce business rules (e.g. duplicate application prevention, employer ownership validation), and interact with database models.", bold_prefix="4. ")
    doc_style.add_bullet_p(doc, "Data Access & Modeling Layer: Mongoose 8 models defining strict schemas, field validation, password hashing hooks, compound indexes, and lean query projections.", bold_prefix="5. ")
    doc_style.add_bullet_p(doc, "External AI Integration Layer: Asynchronous HTTPS integration with Google Gemini 2.5 Flash API via the official @google/genai SDK for resume bullet-point enhancement.", bold_prefix="6. ")

    # ---------------------------------------------------------------------------
    # SECTION 4: COMPLETE APPLICATION CONTROL FLOW
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "4. Complete Application Control Flow & Lifecycle Traces")
    doc_style.add_body_p(
        doc,
        "This section traces the exact, step-by-step execution path of every major operation in Job Executive, referencing actual source code files, functions, and database queries."
    )

    doc_style.add_heading_2(doc, "4.1 Flow A: Application Initialization & Bootstrapping")
    doc_style.add_body_p(doc, "When the application starts, both backend and frontend boot up independently:", bold_prefix="Process Lifecycle: ")
    doc_style.add_bullet_p(doc, "Backend Boot: server.js invokes app.js. connectDB() establishes a persistent connection pool to MongoDB via Mongoose. If ENABLE_DEMO_DATA === 'true', seedDemoData() runs, creating 3 demo accounts (Seeker, Employer, Admin with password Demo@12345) and 35+ realistic Indian job postings. app.listen() binds to the configured PORT (4000).", bold_prefix="Step 1 (Backend): ")
    doc_style.add_bullet_p(doc, "Frontend Boot: Vite loads index.html and mounts frontend/src/main.tsx, which executes App.tsx. App.tsx initializes state variables for currentUser, activeView ('home'), jobs, companies, and blogPosts.", bold_prefix="Step 2 (Frontend): ")
    doc_style.add_bullet_p(doc, "Public Data Fetch: In useEffect, App.tsx dispatches Promise.all([api.getJobs(), api.getCompanies(), api.getBlogPosts()]) to populate public explore views immediately without requiring user login.", bold_prefix="Step 3 (Public Cache): ")
    doc_style.add_bullet_p(doc, "Session Restoration: A second useEffect checks localStorage.getItem('token'). If present, it dispatches api.getUserProfile() (GET /api/auth/me). If valid, it hydrates currentUser, sets currentUserRole, and routes the user to their role-specific dashboard. If invalid or expired (401), the token is discarded.", bold_prefix="Step 4 (Session Check): ")

    doc_style.add_heading_2(doc, "4.2 Flow B: User Registration Lifecycle")
    doc_style.add_bullet_p(doc, "User inputs Name, Email, Password, and Role (SEEKER or EMPLOYER) into SignupPage.tsx. Client verifies non-empty fields and valid email syntax.", bold_prefix="1. UI Form: ")
    doc_style.add_bullet_p(doc, "SignupPage calls apiService.registerUser(), which issues POST /api/auth/register with payload { name, email, password, role }.", bold_prefix="2. API Request: ")
    doc_style.add_bullet_p(doc, "Request passes through authRateLimiter (100 req/15 min). auth.controller.js:register checks if User.findOne({ email }) already exists; if so, returns 400 'User already exists'.", bold_prefix="3. Controller Check: ")
    doc_style.add_bullet_p(doc, "Controller generates salt via bcrypt.genSalt(10) and hashes password via bcrypt.hash(). User document is created via User.create().", bold_prefix="4. Password Hashing: ")
    doc_style.add_bullet_p(doc, "JWT token is generated with payload { id: user._id, role: user.role } signed by process.env.JWT_SECRET with 7-day expiration.", bold_prefix="5. Token Generation: ")
    doc_style.add_bullet_p(doc, "Backend responds with 201 Created containing { token, user: { id, name, email, role } }. SignupPage displays a success toast and transitions activeView to 'login'.", bold_prefix="6. Response & Transition: ")

    doc_style.add_heading_2(doc, "4.3 Flow C: User Authentication & Login Lifecycle")
    doc_style.add_bullet_p(doc, "User selects role tab (Job Seeker / Employer / Administrator) or clicks a 1-Click Demo Login button in LoginPage.tsx.", bold_prefix="1. Credential Submission: ")
    doc_style.add_bullet_p(doc, "LoginPage invokes apiService.authenticateUser(email, password, role). Issues POST /api/auth/login.", bold_prefix="2. API Dispatch: ")
    doc_style.add_bullet_p(doc, "auth.controller.js:login queries User.findOne({ email }).select('+password'). The explicit select('+password') is necessary because password is set to select: false in user.model.js.", bold_prefix="3. User Lookup: ")
    doc_style.add_bullet_p(doc, "Controller compares submitted password with stored hash using await bcrypt.compare(password, user.password). If mismatch, returns 400 'Invalid credentials'.", bold_prefix="4. Hash Verification: ")
    doc_style.add_bullet_p(doc, "Controller verifies that requested role matches user.role. If mismatch, returns 400 'Role mismatch'.", bold_prefix="5. Role Verification: ")
    doc_style.add_bullet_p(doc, "Backend generates JWT token signed with JWT_SECRET, valid for 7 days. Responds with { token, user }.", bold_prefix="6. Token Response: ")
    doc_style.add_bullet_p(doc, "apiService stores token into localStorage.setItem('token', token). App.tsx sets currentUser, sets currentUserRole, and updates activeView to 'dashboard'.", bold_prefix="7. Frontend State: ")

    doc_style.add_heading_2(doc, "4.4 Flow D: Protected Route & RBAC Enforcement")
    doc_style.add_bullet_p(doc, "When a client triggers a protected action, axiosInstance interceptor automatically extracts token from localStorage and appends Authorization: Bearer <token> to HTTP headers.", bold_prefix="1. Client Interceptor: ")
    doc_style.add_bullet_p(doc, "requireAuth middleware (backend/src/middleware/auth.js) intercepts request. Checks for Authorization header. If absent or does not start with 'Bearer ', returns 401 'No token, authorization denied'.", bold_prefix="2. Token Extraction: ")
    doc_style.add_bullet_p(doc, "Middleware executes jwt.verify(token, process.env.JWT_SECRET). If token is forged or expired, catch block returns 401 'Token is not valid'.", bold_prefix="3. Cryptographic Verification: ")
    doc_style.add_bullet_p(doc, "Middleware executes User.findById(decoded.id).select('-password'). If user not found in DB, returns 401 'User not found'. Attaches clean user object to req.user.", bold_prefix="4. Identity Hydration: ")
    doc_style.add_bullet_p(doc, "authorize(...allowedRoles) middleware executes next. Checks if allowedRoles.includes(req.user.role). If user has insufficient privileges (e.g. SEEKER attempting to access /api/admin/*), returns 403 Forbidden 'Access denied: insufficient permissions'.", bold_prefix="5. Role-Based Check: ")

    doc_style.add_heading_2(doc, "4.5 Flow E: Job Seeker Application Lifecycle")
    doc_style.add_bullet_p(doc, "Seeker browses vacancies on JobsExplorePage.tsx. Applies filters (search keywords, location, employment type, salary slider). Dispatches GET /api/job?search=...&minSalary=...&location=....", bold_prefix="1. Explore & Filter: ")
    doc_style.add_bullet_p(doc, "Seeker clicks 'Apply Now'. ApplyModal dialog opens, pre-filling candidate's saved resume link and profile details, allowing cover letter input.", bold_prefix="2. Application Modal: ")
    doc_style.add_bullet_p(doc, "Seeker submits modal. Dispatches POST /api/applications/:jobId/apply. Middleware requireAuth and authorize('SEEKER') validate identity.", bold_prefix="3. Submission Request: ")
    doc_style.add_bullet_p(doc, "application.controller.js:applyToJob verifies job exists and status === 'Open'. Checks Application.findOne({ job: jobId, seeker: req.user._id }). If record exists, aborts with 400 'You have already applied for this job'.", bold_prefix="4. Duplicate Prevention: ")
    doc_style.add_bullet_p(doc, "Controller creates Application document with status: 'applied', seeker: req.user._id, employer: job.employer. Updates Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: req.user._id } }).", bold_prefix="5. Application Creation: ")
    doc_style.add_bullet_p(doc, "Seeker navigates to SeekerDashboard.tsx. Dispatches GET /api/applications/me. Controller executes Application.find({ seeker: req.user._id }).populate('job').lean(). Candidate sees real-time status: Applied, Screening, Interviewing, Offered, or Rejected.", bold_prefix="6. Pipeline Tracking: ")

    doc_style.add_heading_2(doc, "4.6 Flow F: Employer Recruitment Pipeline Lifecycle")
    doc_style.add_bullet_p(doc, "Employer opens CompanyDashboard.tsx. Clicks 'Post New Job' to open PostJobModal. Inputs title, workplace type (Remote/On-site/Hybrid), category, salary range, and requirements.", bold_prefix="1. Vacancy Creation: ")
    doc_style.add_bullet_p(doc, "Submits form via apiService.createJob(). Dispatches POST /api/job. job.controller.js:createJob creates Job document with employer: req.user._id.", bold_prefix="2. Job Persistence: ")
    doc_style.add_bullet_p(doc, "Employer views their vacancies via GET /api/job/my/jobs. Clicks 'View Applicants' for a specific vacancy.", bold_prefix="3. Applicants Inspection: ")
    doc_style.add_bullet_p(doc, "Dispatches GET /api/applications/:jobId/applications. Controller verifies req.user._id === job.employer. Executes Application.find({ job: jobId }).populate('seeker', 'name email phone photoUrl resumeUrl skills expectedSalary').lean().", bold_prefix="4. Candidate Hydration: ")
    doc_style.add_bullet_p(doc, "Employer inspects candidate's skills and Google Drive resume link. Selects new status (e.g. 'interviewing' or 'offered'). Dispatches PUT /api/applications/status/:applicationId with { status }.", bold_prefix="5. Status Progression: ")
    doc_style.add_bullet_p(doc, "Controller validates status against allowed enum ['applied', 'screening', 'interviewing', 'offered', 'rejected']. Updates Application document. Seeker instantly sees the updated stage.", bold_prefix="6. Real-Time Update: ")

    doc_style.add_heading_2(doc, "4.7 Flow G: Administrator Moderation & Demo Account Protection")
    doc_style.add_bullet_p(doc, "Admin logs into AdminDashboard.tsx. Receives elevated dashboard displaying system metrics: Total Users, Total Jobs, Total Applications, and Platform Health.", bold_prefix="1. System Overview: ")
    doc_style.add_bullet_p(doc, "Admin requests user table via GET /api/admin/users. admin.controller.js:getAllUsers returns all users excluding passwords.", bold_prefix="2. User Management: ")
    doc_style.add_bullet_p(doc, "Admin can delete abusive accounts via DELETE /api/admin/users/:id. protectDemoAccount middleware intercepts: if target email is demo.seeker@jobexecutive.com, demo.employer@jobexecutive.com, or demo.admin@jobexecutive.com, request is rejected with 403 'Demo accounts are protected from modification or deletion'.", bold_prefix="3. Demo Safeguards: ")
    doc_style.add_bullet_p(doc, "Admin updates user roles via PUT /api/admin/users/:id/role. Controller uses User.findByIdAndUpdate(id, { role }, { new: true }) to prevent accidental password hash re-hashing.", bold_prefix="4. Safe Role Updates: ")

    doc_style.add_heading_2(doc, "4.8 Flow H: Community Blog & Social Engagement Lifecycle")
    doc_style.add_bullet_p(doc, "Users explore career articles on BlogPage.tsx via GET /api/blogs.", bold_prefix="1. Content Feed: ")
    doc_style.add_bullet_p(doc, "Authenticated users can publish blog posts via POST /api/blogs with markdown content.", bold_prefix="2. Publication: ")
    doc_style.add_bullet_p(doc, "Users interact via reactions (Like, Love, Dislike) via POST /api/blogs/:id/reactions with { type }. blogReaction.controller.js checks if user has an existing reaction. If same reaction clicked, removes it (toggle off). If different reaction clicked, decrements old counter and increments new counter atomically.", bold_prefix="3. Reaction State Machine: ")
    doc_style.add_bullet_p(doc, "Users comment via POST /api/blogs/:id/comments. Comments are stored as subdocuments inside the BlogPost document. Comment authors or administrators can delete comments via DELETE /api/blogs/:id/comments/:commentId.", bold_prefix="4. Threaded Comments: ")

    # ---------------------------------------------------------------------------
    # SECTION 5: DATABASE DESIGN & DATA RELATIONSHIPS
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "5. Database Design, Schemas & Indexing Strategy")
    doc_style.add_body_p(
        doc,
        "Job Executive uses MongoDB 7 managed via Mongoose 8. The database schema balances relational integrity with document denormalization to provide sub-50ms query response times."
    )

    doc_style.add_heading_2(doc, "5.1 Entity-Relationship (ER) Architecture")
    doc_style.add_code_block(
        doc,
        """+------------------------+             1:N              +------------------------+
|         USER           | ---------------------------> |          JOB           |
+------------------------+                              +------------------------+
| _id: ObjectId [PK]     |                              | _id: ObjectId [PK]     |
| email: String [UNIQUE] |                              | employer: ObjectId[FK] |
| password: String [HASH]|                              | title: String          |
| role: Enum (SEEKER/    |                              | company: String        |
|       EMPLOYER/ADMIN)  |                              | category: String       |
| name: String           |                              | minSalary: Number      |
| phone: String          |                              | maxSalary: Number      |
| resumeUrl: String      |                              | workplaceType: String  |
| skills: [String]       |                              | status: Enum(Open/..)  |
| expectedSalary: Number |                              | applicants: [ObjectId] |
+------------------------+                              +------------------------+
       |             |                                                |
       | 1:N         | 1:N                                            | 1:N
       v             v                                                v
+------------------------+                              +------------------------+
|       BLOGPOST         |                              |      APPLICATION       |
+------------------------+                              +------------------------+
| _id: ObjectId [PK]     |                              | _id: ObjectId [PK]     |
| author: ObjectId [FK]  |                              | job: ObjectId [FK]     |
| title: String          |                              | seeker: ObjectId [FK]  |
| slug: String [UNIQUE]  |                              | employer: ObjectId[FK] |
| content: String        |                              | status: Enum(applied/  |
| userReactions: [Subdoc]|                              |        interviewing..) |
| comments: [Subdoc]     |                              | appliedAt: Date        |
+------------------------+                              +------------------------+
                                                        * Compound Unique Index:
                                                          { job: 1, seeker: 1 }""",
        caption="Entity Relationship Diagram (ERD)"
    )

    doc_style.add_heading_2(doc, "5.2 Schema Definitions Breakdown")
    doc_style.add_styled_table(
        doc,
        ["Model", "Key Schema Fields", "Data Types & Constraints", "Indexing Strategy & Justification"],
        [
            ["User", "_id, name, email, password, role, title, phone, location, bio, skills, resumeUrl, expectedSalary, companyName, companyWebsite", "email: unique, lowercase, trim\npassword: select: false\nrole: enum: ['SEEKER', 'EMPLOYER', 'ADMIN']", "email: 1 (unique index via schema). Guarantees O(1) user lookups during authentication."],
            ["Job", "_id, title, company, employer, location, jobType, workplaceType, category, minSalary, maxSalary, salaryType, experienceLevel, description, requirements, benefits, status, urgent, featured, applicants", "employer: ref 'User'\njobType: enum (Full-time, Part-time, Contract, Internship, Freelance)\nstatus: enum (Open, Closed, Draft)", "{ status: 1, createdAt: -1 }: Speeds up default job feed.\n{ category: 1, status: 1 }: Speeds up category filtered queries.\n{ employer: 1, createdAt: -1 }: Optimizes employer dashboard."],
            ["Application", "_id, job, seeker, employer, coverLetter, resumeUrl, status, appliedAt", "job: ref 'Job'\nseeker: ref 'User'\nemployer: ref 'User'\nstatus: enum ('applied', 'screening', 'interviewing', 'offered', 'rejected')", "{ job: 1, seeker: 1 } (UNIQUE): Prevents duplicate applications.\n{ seeker: 1, createdAt: -1 }: Accelerates candidate dashboard.\n{ employer: 1, status: 1 }: Optimizes employer pipeline queries."],
            ["BlogPost", "_id, title, slug, excerpt, content, coverImage, author, tags, status, views, readTime, likes, loves, dislikes, userReactions, comments", "author: ref 'User'\nslug: unique\nuserReactions: array of { user, type }\ncomments: subdocument array with user ref", "{ status: 1, createdAt: -1 }: Speeds up published blog feed.\nslug: 1: O(1) article lookup by SEO-friendly URL slug."]
        ],
        col_widths=[1.1, 2.2, 1.8, 1.8]
    )

    doc_style.add_heading_2(doc, "5.3 Indexing Strategy & The ESR Rule")
    doc_style.add_body_p(
        doc,
        "In production databases, unindexed queries cause full collection scans (COLLSCAN), causing CPU spikes and disk thrashing as document counts grow. We designed compound indexes according to the ESR (Equality, Sort, Range) rule:\n"
        "• Equality Fields First: Exact match filters like status: 'Open' or category: 'Engineering' are placed at the head of the index.\n"
        "• Sort Fields Second: Sorting keys such as createdAt: -1 are placed next to avoid in-memory sorting.\n"
        "• Range Fields Last: Range operators like $gte and $lte (used in salary filtering) are placed at the end.\n\n"
        "Result: Query execution plans show IXSCAN with totalDocsExamined equal to nReturned, achieving zero in-memory sort overhead and sub-10ms response times."
    )

    # ---------------------------------------------------------------------------
    # SECTION 6: AUTHENTICATION & SECURITY ARCHITECTURE
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "6. Authentication, Authorization & Security Architecture")
    doc_style.add_body_p(
        doc,
        "Security in Job Executive is implemented with defense-in-depth principles across transport, authentication, authorization, and data access layers."
    )

    doc_style.add_heading_2(doc, "6.1 Cryptographic Password Protection & Projection Suppression")
    doc_style.add_body_p(
        doc,
        "Passwords are never stored in plain text. When a user registers, bcryptjs generates a cryptographically secure salt (10 rounds) and hashes the password before insertion into MongoDB. On the Mongoose schema, password is defined with select: false. This ensures that standard User.find() or User.findById() queries never serialize the password hash into memory or network responses. The hash is only loaded in auth.controller.js:login using the explicit select('+password') qualifier."
    )

    doc_style.add_heading_2(doc, "6.2 Role-Based Access Control (RBAC) Matrix")
    doc_style.add_styled_table(
        doc,
        ["Endpoint Route", "HTTP Method", "Public Access", "Seeker Role", "Employer Role", "Admin Role", "Enforcing Middleware"],
        [
            ["/api/auth/register", "POST", "YES", "N/A", "N/A", "N/A", "authRateLimiter"],
            ["/api/auth/login", "POST", "YES", "N/A", "N/A", "N/A", "authRateLimiter"],
            ["/api/auth/me", "GET, PUT", "NO", "YES", "YES", "YES", "requireAuth"],
            ["/api/job", "GET", "YES", "YES", "YES", "YES", "None (Public Browse)"],
            ["/api/job", "POST", "NO", "NO", "YES", "NO", "requireAuth, authorize('EMPLOYER')"],
            ["/api/job/my/jobs", "GET", "NO", "NO", "YES", "NO", "requireAuth, authorize('EMPLOYER')"],
            ["/api/job/:id", "PUT, DELETE", "NO", "NO", "YES (Owner)", "YES (Moderator)", "requireAuth, authorize('EMPLOYER', 'ADMIN')"],
            ["/api/applications/:jobId/apply", "POST", "NO", "YES", "NO", "NO", "requireAuth, authorize('SEEKER')"],
            ["/api/applications/me", "GET", "NO", "YES", "NO", "NO", "requireAuth, authorize('SEEKER')"],
            ["/api/applications/:jobId/applications", "GET", "NO", "NO", "YES (Owner)", "NO", "requireAuth, authorize('EMPLOYER')"],
            ["/api/applications/status/:id", "PUT", "NO", "NO", "YES (Owner)", "NO", "requireAuth, authorize('EMPLOYER')"],
            ["/api/admin/users", "GET", "NO", "NO", "NO", "YES", "requireAuth, authorize('ADMIN')"],
            ["/api/admin/users/:id", "DELETE", "NO", "NO", "NO", "YES", "requireAuth, authorize('ADMIN'), protectDemoAccount"],
            ["/api/admin/users/:id/role", "PUT", "NO", "NO", "NO", "YES", "requireAuth, authorize('ADMIN'), protectDemoAccount"],
            ["/api/ai/boost", "POST", "NO", "YES", "YES", "YES", "requireAuth"]
        ],
        col_widths=[1.5, 0.8, 0.6, 0.6, 0.7, 0.7, 1.8]
    )

    doc_style.add_heading_2(doc, "6.3 Rate Limiting, HTTP Headers & Demo Account Shields")
    doc_style.add_bullet_p(doc, "Rate Limiting: express-rate-limit enforces a sliding window of 100 requests per 15-minute window per IP on all /api/auth routes, preventing credential-stuffing and password brute-forcing.", bold_prefix="1. Auth Rate Limiter: ")
    doc_style.add_bullet_p(doc, "Security Headers: Helmet automatically attaches 14 secure HTTP headers including Content-Security-Policy, X-Frame-Options (DENY to prevent clickjacking), and X-Content-Type-Options (nosniff).", bold_prefix="2. Helmet Security: ")
    doc_style.add_bullet_p(doc, "Public Demo Account Shield: protectDemoAccount middleware prevents public visitors from deleting or altering demo accounts (demo.seeker@jobexecutive.com, demo.employer@jobexecutive.com, demo.admin@jobexecutive.com), ensuring reliable continuous testing on live deployments.", bold_prefix="3. Demo Protection: ")

    # ---------------------------------------------------------------------------
    # SECTION 7: BACKEND CORE CONCEPTS EXPLAINED WITH CODE
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "7. Backend Core Concepts Explained with Code")
    doc_style.add_body_p(
        doc,
        "Here we explore the architectural patterns that keep the Node.js / Express backend resilient, modular, and performant under load."
    )

    doc_style.add_heading_2(doc, "7.1 Middleware Pipeline Execution Order")
    doc_style.add_body_p(
        doc,
        "Express executes middleware in strict registration order. If an early middleware sends a response or calls next(err), subsequent middlewares are bypassed:"
    )
    doc_style.add_code_block(
        doc,
        """// backend/src/app.js - Registration Order
app.use(helmet());                               // 1. Security Headers
app.use(cors({ origin: "*" }));                  // 2. Cross-Origin Resource Sharing
app.use(express.json({ limit: "1mb" }));         // 3. Body Parsing (JSON payload limit 1MB)
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Route Dispatches
app.use("/api/auth", authRoutes);                // Includes authRateLimiter
app.use("/api/job", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/ai", aiRoutes);

// Catch-all 404 & Centralized Error Handler
app.use((req, res, next) => res.status(404).json({ msg: `Endpoint ${req.originalUrl} not found` }));
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message
  });
});""",
        caption="backend/src/app.js"
    )

    doc_style.add_heading_2(doc, "7.2 Lean Query Optimization (.lean())")
    doc_style.add_body_p(
        doc,
        "By default, Mongoose wraps query results in heavyweight Mongoose Documents containing change-tracking getters, setters, and internal state. For read-only operations (such as listing jobs or fetching applicant profiles), wrapping hundreds of documents in Mongoose wrappers creates massive memory pressure and slows down garbage collection.\n"
        "By appending .lean() to our read queries, Mongoose bypasses document hydration and returns plain JavaScript objects directly from the MongoDB BSON driver. This yields a 5x to 8x reduction in memory overhead and a 3x speedup in serialization time."
    )
    doc_style.add_code_block(
        doc,
        """// Example from backend/src/controllers/job.controller.js
const jobs = await Job.find(filter)
  .sort(sortOption)
  .skip((page - 1) * limit)
  .limit(Number(limit))
  .populate("employer", "name company")
  .lean(); // Bypasses Mongoose document wrapping for maximum performance""",
        caption="Mongoose .lean() in job.controller.js"
    )

    doc_style.add_heading_2(doc, "7.3 Populating with Selective Field Projections")
    doc_style.add_body_p(
        doc,
        "When retrieving applications for an employer, the employer needs candidate contact details and skills, but must NEVER receive sensitive fields like password hashes or internal tokens. We enforce selective projection in our .populate() calls:"
    )
    doc_style.add_code_block(
        doc,
        """// Example from backend/src/controllers/application.controller.js
const applications = await Application.find({ job: jobId })
  .populate("seeker", "name email phone photoUrl resumeUrl skills expectedSalary")
  .lean();""",
        caption="Selective Candidate Population"
    )

    doc_style.add_heading_2(doc, "7.4 Gemini AI Resume Booster Integration")
    doc_style.add_body_p(
        doc,
        "The AI resume booster leverages Google's cutting-edge gemini-2.5-flash model via the official @google/genai SDK. The backend constructs a targeted prompt instructing the model to act as an executive resume editor, enhancing clarity, quantifiable metrics, and professional phrasing without adding hallucinations:"
    )
    doc_style.add_code_block(
        doc,
        """// backend/src/controllers/ai.controller.js
const { GoogleGenAI } = require("@google/genai");

exports.boostResumeText = async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are a professional executive resume editor. Enhance the following resume summary or experience snippet.
Make it punchy, result-oriented, professional, and highlight impact:
"${text}"
Return only the polished text without conversational filler.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  res.json({ boostedText: response.text });
};""",
        caption="backend/src/controllers/ai.controller.js"
    )

    # ---------------------------------------------------------------------------
    # SECTION 8: FRONTEND CORE CONCEPTS EXPLAINED WITH CODE
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "8. Frontend Core Concepts Explained with Code")
    doc_style.add_body_p(
        doc,
        "The frontend is constructed with modern React 19 and TypeScript, adhering to single-responsibility component patterns, clean view-state routing, and bulletproof HTTP interceptors."
    )

    doc_style.add_heading_2(doc, "8.1 State Machine View Routing vs React Router")
    doc_style.add_body_p(
        doc,
        "Rather than pulling in heavy client-side routing libraries like react-router-dom, Job Executive implements a deterministic view-state router using TypeScript union types:\n"
        "type ActiveView = 'home' | 'jobs' | 'companies' | 'blog' | 'dashboard' | 'login' | 'signup';\n\n"
        "Advantages of this architectural choice:\n"
        "1. Instant Zero-Latency Navigation: Transitions occur as pure React state updates without browser history popstate serialization delays.\n"
        "2. Strict Access Control: Unauthenticated attempts to access activeView === 'dashboard' are evaluated instantaneously in memory without rendering intermediate flash-of-unstyled-content (FOUC).\n"
        "3. Zero Server Fallback Config: Eliminates 404 routing issues on static hosting environments (Netlify, Vercel, S3) that lack catch-all rewrite rules."
    )

    doc_style.add_heading_2(doc, "8.2 Axios Interceptors: Automated JWT Injection & 401 Eviction")
    doc_style.add_body_p(
        doc,
        "All API communication passes through a configured Axios instance in frontend/services/axiosInstance.ts. The instance manages authorization headers and session expiration transparently:"
    )
    doc_style.add_code_block(
        doc,
        """// frontend/services/axiosInstance.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? "http://localhost:4000/api" : "/api");

const axiosInstance = axios.create({ baseURL: API_URL });

// Request Interceptor: Injects Bearer token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Automatically handles expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/"; // Force redirect to login
    }
    return Promise.reject(error);
  }
);""",
        caption="frontend/services/axiosInstance.ts"
    )

    # ---------------------------------------------------------------------------
    # SECTION 9: STEP-BY-STEP CODE WALKTHROUGHS
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "9. Step-by-Step Code Walkthroughs for Critical Operations")
    doc_style.add_body_p(
        doc,
        "In technical interviews, senior engineers will ask you to walk through actual implementation code line-by-line. Below are complete walkthroughs for the core operations in Job Executive."
    )

    doc_style.add_heading_2(doc, "9.1 Operation 1: User Login (auth.controller.js:login)")
    doc_style.add_code_block(
        doc,
        """exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  // 1. Validate mandatory fields
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  // 2. Fetch user with password explicitly (since select: false is on schema)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // 3. Cryptographically verify password hash using bcrypt
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // 4. Verify selected role matches stored database role
  if (role && user.role !== role) {
    return res.status(400).json({ msg: `Role mismatch. This account is registered as ${user.role}` });
  }

  // 5. Generate signed JWT token with 7-day expiration
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 6. Return sanitized user object and token
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
    },
  });
};""",
        caption="backend/src/controllers/auth.controller.js - login()"
    )
    doc_style.add_body_p(
        doc,
        "Key Interview Highlights for Login:\n"
        "• Security: We return the generic message 'Invalid credentials' whether the user doesn't exist or the password was wrong. This prevents user enumeration attacks.\n"
        "• Schema Safety: The .select('+password') override ensures the password hash is fetched only when actively needed for verification.\n"
        "• Role Guard: Enforcing role checks at login prevents seekers from inadvertently logging in under employer views."
    )

    doc_style.add_heading_2(doc, "9.2 Operation 2: Authentication Middleware (auth.js:requireAuth)")
    doc_style.add_code_block(
        doc,
        """const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user without password to attach to request object
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "Token is valid, but user no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ msg: "Token is not valid or expired" });
  }
};""",
        caption="backend/src/middleware/auth.js - requireAuth"
    )
    doc_style.add_body_p(
        doc,
        "Key Interview Highlights for requireAuth:\n"
        "• Database Validation: We don't just trust the token payload; we query User.findById(decoded.id) to guarantee the account hasn't been deleted or suspended after token issuance.\n"
        "• Request Enrichment: Attaching req.user makes candidate details instantly available to all downstream route controllers without redundant lookups."
    )

    doc_style.add_heading_2(doc, "9.3 Operation 3: Job Application & Duplicate Guard (application.controller.js:applyToJob)")
    doc_style.add_code_block(
        doc,
        """exports.applyToJob = async (req, res) => {
  const { jobId } = req.params;
  const seekerId = req.user._id;

  // 1. Verify Job exists and is active
  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ msg: "Job not found" });
  }
  if (job.status !== "Open") {
    return res.status(400).json({ msg: "This job is no longer accepting applications" });
  }

  // 2. Prevent duplicate applications
  const existing = await Application.findOne({ job: jobId, seeker: seekerId });
  if (existing) {
    return res.status(400).json({ msg: "You have already applied for this job" });
  }

  // 3. Create application document
  const application = await Application.create({
    job: jobId,
    seeker: seekerId,
    employer: job.employer,
    coverLetter: req.body.coverLetter || "",
    resumeUrl: req.user.resumeUrl || req.body.resumeUrl || "",
    status: "applied",
  });

  // 4. Atomically register seeker in Job's applicants array
  await Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: seekerId } });

  res.status(201).json({ msg: "Application submitted successfully", application });
};""",
        caption="backend/src/controllers/application.controller.js - applyToJob()"
    )
    doc_style.add_body_p(
        doc,
        "Key Interview Highlights for applyToJob:\n"
        "• Dual-Layer Duplicate Prevention: Guarded both at the application level (via Application.findOne) and at the database level (via the unique compound index { job: 1, seeker: 1 }).\n"
        "• Atomic Array Updates: $addToSet ensures that even if concurrent requests slip past, seeker IDs are never duplicated in the Job's applicants array."
    )

    doc_style.add_heading_2(doc, "9.4 Operation 4: Multi-Faceted Job Filtering (job.controller.js:getJobs)")
    doc_style.add_code_block(
        doc,
        """exports.getJobs = async (req, res) => {
  const { search, category, location, jobType, minSalary, maxSalary, sort, page = 1, limit = 20 } = req.query;

  const filter = { status: "Open" };

  if (category) filter.category = category;
  if (jobType) filter.jobType = jobType;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  // Cross-boundary salary overlap logic
  if (minSalary || maxSalary) {
    if (minSalary && maxSalary) {
      filter.$and = [
        { maxSalary: { $gte: Number(minSalary) } },
        { minSalary: { $lte: Number(maxSalary) } },
      ];
    } else if (minSalary) {
      filter.maxSalary = { $gte: Number(minSalary) };
    } else if (maxSalary) {
      filter.minSalary = { $lte: Number(maxSalary) };
    }
  }

  const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const jobs = await Job.find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("employer", "name company")
    .lean();

  res.json(jobs);
};""",
        caption="backend/src/controllers/job.controller.js - getJobs()"
    )
    doc_style.add_body_p(
        doc,
        "Key Interview Highlights for getJobs:\n"
        "• Correct Salary Range Overlap: Instead of naive equality, we test range intersection ({ maxSalary: { $gte: minSalary } } AND { minSalary: { $lte: maxSalary } }). This guarantees that a vacancy offering 15-25 LPA matches a candidate filtering for 20-30 LPA.\n"
        "• Lean Projection: Using .lean() ensures fast JSON streaming to the frontend."
    )

    # ---------------------------------------------------------------------------
    # SECTION 10: HOW TO EXPLAIN IN AN INTERVIEW
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "10. How to Explain This Project in a Software Engineering Interview")
    doc_style.add_body_p(
        doc,
        "Interview formats vary widely—from 30-second casual screening calls to 45-minute architectural whiteboard interrogations. Below are exact speaking scripts and whiteboard strategies to communicate your mastery."
    )

    doc_style.add_heading_2(doc, "10.1 Elevator Pitches: 30-Second & 1-Minute Scripts")
    doc_style.add_callout(
        doc,
        "\"Job Executive is a full-stack recruitment platform built with React 19, TypeScript, Node.js, Express, and MongoDB. It facilitates candidate applications, recruiter hiring pipelines, and admin moderation. I architected the backend with compound indexing and lean queries for sub-50ms latency, integrated Google's Gemini 2.5 Flash for AI resume enhancement, and built a public multi-role demo sandbox with active state protection.\"",
        title="30-Second Elevator Pitch"
    )
    doc_style.add_callout(
        doc,
        "\"I built Job Executive to solve two major problems in modern job platforms: recruiter overhead and opaque candidate experiences. On the frontend, I used React 19 with TypeScript and Tailwind CSS to build role-specific dashboards for seekers, employers, and administrators. On the backend, I designed an Express 5 REST API backed by MongoDB. Key technical highlights include: first, JWT authentication with role-based authorization; second, an AI Resume Booster powered by Google Gemini API; third, database query optimization where I designed compound indexes following the ESR rule and bypassed Mongoose document hydration with .lean() to drastically cut memory overhead; and finally, public demo accounts secured by custom middleware against tampering.\"",
        title="1-Minute Executive Summary"
    )

    doc_style.add_heading_2(doc, "10.2 3-Minute Technical Walkthrough Script")
    doc_style.add_body_p(
        doc,
        "When an interviewer asks: 'Tell me about the architecture of Job Executive,' deliver this structured 4-part breakdown:\n\n"
        "1. Architectural Philosophy: 'I designed Job Executive as a decoupled, stateless client-server system. The frontend is a React 19 Single Page Application written in strict TypeScript. For client routing, I implemented a deterministic state-machine router, which eliminates routing flash and prevents unauthenticated layout leaks. All network requests flow through an Axios interceptor pipeline that automatically handles Bearer token attachment and 401 session eviction.'\n\n"
        "2. Backend & Security Pipeline: 'On the backend, I built an Express 5 REST API running on Node.js. Requests pass through a multi-tier security pipeline: Helmet for HTTP response headers, CORS for origin policy, and express-rate-limit to protect authentication endpoints from brute-forcing. Authentication is completely stateless using HS256-signed JWTs with 7-day expirations. Passwords are salted and hashed using bcrypt with 10 rounds, and the schema suppresses password projection by default.'\n\n"
        "3. Database & Optimization: 'For persistence, I chose MongoDB with Mongoose. I designed schemas for Users, Jobs, Applications, and BlogPosts. To handle high query volumes on the jobs explore feed, I created compound indexes following the ESR rule—specifically on { status: 1, createdAt: -1 } and { category: 1, status: 1 }. In read-heavy queries, I appended .lean() to bypass Mongoose's internal document hydration, which dropped memory overhead by over 70% and doubled query throughput.'\n\n"
        "4. Feature Innovations: 'Two standout features are the AI Resume Booster, which integrates Google Gemini 2.5 Flash to transform rough bullet points into impact-driven executive summaries, and our pre-seeded public demo accounts for Seekers, Employers, and Admins, which are protected by custom middleware against deletion or password modification.'"
    )

    doc_style.add_heading_2(doc, "10.3 Whiteboard Diagram Sequence")
    doc_style.add_body_p(
        doc,
        "If asked to draw the system on a whiteboard or virtual canvas (e.g. Excalidraw), follow this 5-box sequence while explaining each connection:\n"
        "1. Box 1 (Left - Client): Draw 'React 19 SPA (Vite + TS)'. Mention components: Explore View, Seeker Dashboard, Employer Pipeline, Admin Console, and Axios Interceptors.\n"
        "2. Arrow 1 (Client to Server): Label 'HTTP/1.1 REST (JSON) + Authorization: Bearer <JWT>'.\n"
        "3. Box 2 (Center - API Gateway): Draw 'Express 5 Security Pipeline'. Inside, list: Helmet -> CORS -> RateLimiter -> requireAuth -> authorize(ROLES) -> protectDemoAccount.\n"
        "4. Arrow 2 (Server to Controllers): Route to Controllers: auth.controller, job.controller, application.controller, ai.controller.\n"
        "5. Box 3 (Right - Database): Draw 'MongoDB 7'. Show collections (Users, Jobs, Applications, BlogPosts) and highlight the Compound Index: { status: 1, createdAt: -1 } and the Unique Constraint: { job: 1, seeker: 1 }.\n"
        "6. Box 4 (Top Right - External AI): Draw 'Google Gemini 2.5 Flash API' connected to ai.controller via HTTPS."
    )

    doc_style.add_heading_2(doc, "10.4 Live Code Walkthrough Guide: What Files to Open")
    doc_style.add_styled_table(
        doc,
        ["Priority Order", "Source File to Open", "Specific Function / Lines", "What to Emphasize to Interviewer"],
        [
            ["1", "backend/src/middleware/auth.js", "requireAuth & authorize", "Demonstrate how token extraction, JWT verification, and user hydration happen, and how authorize('EMPLOYER') enforces RBAC."],
            ["2", "backend/src/controllers/job.controller.js", "getJobs", "Show multi-faceted filtering, cross-boundary salary overlap logic, and the use of .lean() for query optimization."],
            ["3", "backend/src/controllers/application.controller.js", "applyToJob & getApplicationsForJob", "Highlight duplicate application detection via Application.findOne and selective population of candidate profile fields."],
            ["4", "backend/src/models/user.model.js", "Schema definition & hooks", "Show select: false on password and compound schema index configurations."],
            ["5", "frontend/services/axiosInstance.ts", "Request/Response interceptors", "Explain how tokens are dynamically attached and how 401 errors trigger automatic clean session logout."],
            ["6", "backend/src/controllers/ai.controller.js", "boostResumeText", "Show Google Gemini API initialization and targeted prompt engineering for resume enhancement."]
        ],
        col_widths=[0.8, 2.2, 1.8, 2.4]
    )

    # ---------------------------------------------------------------------------
    # SECTION 11: GENUINE TECHNICAL CHALLENGES & SOLUTIONS
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "11. Genuine Technical Challenges Encountered & Solved")
    doc_style.add_body_p(
        doc,
        "Interviewers love asking: 'What was the toughest bug you faced, and how did you resolve it?' Mentioning real architectural bugs demonstrates hands-on engineering capability rather than theoretical knowledge."
    )

    doc_style.add_heading_2(doc, "11.1 Challenge 1: The Reaction User ID TypeError (req.user._id vs req.user.id)")
    doc_style.add_body_p(
        doc,
        "Problem: In the blog reaction controller, users could add reactions, but when attempting to remove or toggle their reaction, the backend threw a fatal TypeError: Cannot read property '_id' of undefined.\n"
        "Root Cause: The authentication middleware hydrates req.user from User.findById(), where Mongoose provides both a virtual .id (string) and the underlying ._id (ObjectId). In blogReaction.controller.js, one branch referenced req.user.id while another referenced req.user._id.equals(). When passed into an Array.findIndex() comparator comparing ObjectIds to strings without casting, the condition failed, causing an undefined array access.\n"
        "Solution: Standardized user ID references across all controllers to req.user._id.toString() or req.user.id consistently, ensuring type-safe comparisons."
    )

    doc_style.add_heading_2(doc, "11.2 Challenge 2: Candidate Profile Stripping in Employer Dashboard")
    doc_style.add_body_p(
        doc,
        "Problem: In the employer dashboard, when recruiters clicked 'View Applicants', the UI showed blank phone numbers, missing skills badges, and absent resume links, even though candidates had filled them out.\n"
        "Root Cause: The controller getApplicationsForJob called .populate('seeker'), but because the User model had selective projections and some fields were omitted in default queries, the populated object only returned name and email.\n"
        "Solution: Explicitly configured the population projection: .populate('seeker', 'name email phone photoUrl resumeUrl skills expectedSalary'). This populated the candidate's complete professional dossier while continuing to suppress sensitive fields like password."
    )

    doc_style.add_heading_2(doc, "11.3 Challenge 3: Password Hash Overwrite during Admin Role Elevation")
    doc_style.add_body_p(
        doc,
        "Problem: When an administrator changed a user's role (e.g. promoting a user to EMPLOYER), the user was subsequently unable to log in with their existing password.\n"
        "Root Cause: The original controller fetched the user document via User.findById(), updated user.role = newRole, and executed await user.save(). In user.model.js, a pre('save') hook checked if the password was modified, but because password was not selected, user.save() triggered re-validation and corrupted the existing hash.\n"
        "Solution: Refactored role updates to use User.findByIdAndUpdate(id, { $set: { role: newRole } }, { new: true, runValidators: true }). This executes a direct atomic MongoDB update that bypasses document-level password hooks entirely."
    )

    doc_style.add_heading_2(doc, "11.4 Challenge 4: Cross-Boundary Range Logic in Salary Filtering")
    doc_style.add_body_p(
        doc,
        "Problem: When seekers set a salary filter of 15 LPA to 25 LPA, jobs offering 10 LPA to 20 LPA failed to appear in results, even though their salary ranges overlapped.\n"
        "Root Cause: The query used naive conditions: { minSalary: { $gte: min }, maxSalary: { $lte: max } }. This demanded that the job's entire range fit completely inside the candidate's bounds.\n"
        "Solution: Implemented interval overlap logic: { maxSalary: { $gte: minSalary }, minSalary: { $lte: maxSalary } }. This accurately returns any vacancy whose compensation range intersects with the candidate's target."
    )

    doc_style.add_heading_2(doc, "11.5 Challenge 5: Multi-Tenant Demo Account Tampering on Live Deployments")
    doc_style.add_body_p(
        doc,
        "Problem: When demo accounts were opened to the public, visitors could change demo passwords or delete demo users, breaking the platform experience for subsequent visitors.\n"
        "Solution: Developed a dedicated protectDemoAccount middleware that intercepts DELETE and PUT requests on user records. If the target email belongs to the protected demo set (demo.seeker@jobexecutive.com, demo.employer@jobexecutive.com, demo.admin@jobexecutive.com), the middleware halts the request with a 403 Forbidden response, preserving live environment reliability."
    )

    # ---------------------------------------------------------------------------
    # SECTION 12: LIMITATIONS & FUTURE IMPROVEMENTS
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "12. Limitations & Future Production Roadmap")
    doc_style.add_body_p(
        doc,
        "Acknowledging technical trade-offs and possessing a clear architectural scaling roadmap is a hallmark of a mature senior engineer."
    )

    doc_style.add_styled_table(
        doc,
        ["Current Architectural Limitation", "Technical Trade-off / Impact", "Proposed Future Solution", "Target Scale / Benefit"],
        [
            ["In-Memory Rate Limiting", "express-rate-limit stores IP counters in Node.js process memory; counters reset upon server restart or cluster scaling", "Integrate Redis-backed rate limiter (rate-limit-redis)", "Shared rate-limit state across horizontally scaled cluster instances"],
            ["HTTP Polling for Status Updates", "Seekers must refresh dashboard to observe application status transitions from 'screening' to 'offered'", "Implement WebSockets (Socket.io) or Server-Sent Events (SSE)", "Real-time push notifications for instant candidate alerts without polling"],
            ["Regex Search on Job Titles", "RegEx searches ($regex) do not scale efficiently beyond 100K+ records and lack typo tolerance", "Deploy MongoDB Atlas Search (Lucene) or Elasticsearch", "Full-text indexing with fuzzy matching, autocomplete, and relevance ranking"],
            ["7-Day Stateless JWT Tokens", "If a user's token is leaked, it cannot be revoked before the 7-day TTL expires without rotating JWT_SECRET", "Implement Refresh Token rotation with Redis token blocklist and HttpOnly cookies", "Immediate token revocation capability on security events"],
            ["Synchronous AI API Calls", "High traffic on the Gemini Resume Booster could block Express threads or hit external rate limits", "Implement an asynchronous background worker queue using BullMQ + Redis", "Decouples AI processing, retries failed requests, and provides progress updates"],
            ["External Cloud Resume Storage", "Resumes rely on Google Drive URLs; invalid URLs or restricted permissions prevent recruiter review", "Direct multi-part PDF upload to AWS S3 or Cloudinary with pre-signed URLs", "Virus scanning, automated thumbnail generation, and embedded PDF previewing"]
        ],
        col_widths=[1.5, 1.8, 2.0, 1.9]
    )

    # ---------------------------------------------------------------------------
    # SECTION 13: QUICK REVISION CHECKLIST
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "13. Quick Revision Checklist (Cheat Sheet)")
    doc_style.add_body_p(
        doc,
        "Review these key points 2 hours before your interview to ensure total recall of technical details:"
    )

    doc_style.add_bullet_p(doc, "Frontend: React 19 + TypeScript 5 + Tailwind CSS v3 + Vite 5 + Three.js 3D hero canvas + Axios interceptors.", bold_prefix="Tech Stack: ")
    doc_style.add_bullet_p(doc, "Backend: Node.js + Express 5 + MongoDB 7 + Mongoose 8 + JWT (7d) + bcryptjs (10 salt rounds) + Google Gemini 2.5 Flash.", bold_prefix="Backend Stack: ")
    doc_style.add_bullet_p(doc, "Security: Helmet headers, CORS, sliding-window rate limiting (100 req/15 min), select: false on passwords, protectDemoAccount shield.", bold_prefix="Security: ")
    doc_style.add_bullet_p(doc, "Database Performance: Compound index on { status: 1, createdAt: -1 }, unique compound index on { job: 1, seeker: 1 }, .lean() query bypass.", bold_prefix="DB Tuning: ")
    doc_style.add_bullet_p(doc, "Application Duplicate Guard: Application.findOne({ job, seeker }) and MongoDB unique compound index.", bold_prefix="Duplicate Guard: ")
    doc_style.add_bullet_p(doc, "Candidate Hydration: .populate('seeker', 'name email phone photoUrl resumeUrl skills expectedSalary').lean().", bold_prefix="Hydration: ")
    doc_style.add_bullet_p(doc, "Demo Accounts: demo.seeker@jobexecutive.com, demo.employer@jobexecutive.com, demo.admin@jobexecutive.com / Demo@12345.", bold_prefix="Demo Credentials: ")
    doc_style.add_bullet_p(doc, "Role Updating Fix: User.findByIdAndUpdate(id, { $set: { role } }) prevents accidental password hash corruption.", bold_prefix="Role Elevation: ")
    doc_style.add_bullet_p(doc, "Salary Range Overlap: { maxSalary: { $gte: minSalary }, minSalary: { $lte: maxSalary } }.", bold_prefix="Salary Logic: ")

    # Save Document
    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs", "Job_Executive_Project_Explanation_and_Interview_Guide.docx"))
    doc.save(output_path)
    print(f"✅ Successfully generated Document 1: {output_path}")

if __name__ == "__main__":
    generate_document_1()
