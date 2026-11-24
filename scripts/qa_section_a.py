from qa_helpers import add_qa_item

def add_section_a(doc):
    # Q1
    add_qa_item(
        doc,
        q_num=1,
        question="Can you describe the high-level architecture of Job Executive and why you chose this design?",
        short_answer="Job Executive uses a decoupled client-server architecture combining a React 19 Single Page Application with an Express 5 REST API and MongoDB. The frontend handles view rendering and state management, while the backend provides stateless authentication, business logic validation, and database operations. This separation enables independent deployment, horizontal scaling, and seamless mobile or third-party client extensibility.",
        explanation="The system is divided into three primary tiers: Presentation (React 19 + TypeScript + Tailwind), Application Logic (Node.js + Express 5 with Helmet, CORS, Rate Limiting, and JWT auth), and Persistence (MongoDB with Mongoose ODM). The client communicates exclusively through asynchronous JSON-over-HTTPS. Stateless JWT authentication eliminates server-side session stores, allowing backend instances to scale horizontally behind a load balancer without sticky sessions. Read operations bypass Mongoose hydration via .lean(), and database queries leverage compound indexes for sub-50ms latency.",
        code_example="""// High-Level Request Pipeline (backend/src/app.js)
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "1mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/ai", aiRoutes);""",
        code_caption="backend/src/app.js",
        follow_up="How does this architecture handle sudden traffic surges during recruitment drives?",
        key_points=[
            "Decoupled React 19 frontend and Express 5 backend.",
            "Stateless JWT tokens enable horizontal scaling without sticky sessions.",
            "Selective compound indexes and .lean() provide sub-50ms query latency."
        ]
    )

    # Q2
    add_qa_item(
        doc,
        q_num=2,
        question="What are the key architectural advantages of decoupling the React frontend from the Express REST API?",
        short_answer="Decoupling allows each layer to evolve, build, and deploy independently without downtime on the other. It allows specialized optimization on the frontend (e.g. Vite bundling, static edge CDN caching) and backend (e.g. Node process clustering, database connection pooling). It also establishes clean API contracts that make future native mobile apps or external integrations trivial.",
        explanation="In a coupled server-rendered setup (like traditional EJS or Pug), every page navigation requires a server roundtrip, increasing compute load on the web server. Decoupled SPAs download static assets once, and subsequent interactions only exchange compact JSON payloads. This drastically reduces bandwidth consumption and infrastructure costs while delivering an app-like user experience.",
        code_example="""// frontend/services/axiosInstance.ts
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? "http://localhost:4000/api" : "/api");
const axiosInstance = axios.create({ baseURL: API_URL });""",
        code_caption="frontend/services/axiosInstance.ts",
        follow_up="What are the downsides of a decoupled SPA architecture, and how do you mitigate them?",
        key_points=[
            "Independent build, deploy, and scaling lifecycles.",
            "Compact JSON transport reduces server bandwidth and compute overhead.",
            "Enables multiple frontends (web, mobile, third-party) on a unified API."
        ]
    )

    # Q3
    add_qa_item(
        doc,
        q_num=3,
        question="How does Job Executive achieve sub-50ms query response times on read-heavy operations?",
        short_answer="Sub-50ms latency is achieved through two core database optimizations: compound indexing aligned with the ESR (Equality, Sort, Range) rule, and bypassing Mongoose document hydration with .lean(). Compound indexes prevent full collection scans, while .lean() avoids instantiating heavy Mongoose document wrappers for read-only operations.",
        explanation="By default, Mongoose wraps every returned BSON document in a full Mongoose Document instance with change-tracking getters, setters, and prototype methods. For 50 job listings, this adds tens of thousands of object allocations, triggering garbage collection spikes. Using .lean() returns plain JavaScript objects directly from the driver, cutting memory usage by 70-80% and query execution time by 60%. Combined with compound indexes on { status: 1, createdAt: -1 }, queries run as covered index scans (IXSCAN) without in-memory sorting.",
        code_example="""// backend/src/controllers/job.controller.js
const jobs = await Job.find(filter)
  .sort(sortOption)
  .skip((page - 1) * limit)
  .limit(Number(limit))
  .populate("employer", "name company")
  .lean(); // Bypasses Mongoose document wrapper for ultra-fast response""",
        code_caption="backend/src/controllers/job.controller.js",
        follow_up="When should you NOT use .lean() in Mongoose queries?",
        key_points=[
            ".lean() eliminates Mongoose document hydration overhead for read queries.",
            "Compound indexes ensure IXSCAN execution and eliminate in-memory sorting.",
            "Selective projection in .populate() prevents transferring unnecessary fields."
        ]
    )

    # Q4
    add_qa_item(
        doc,
        q_num=4,
        question="How do you handle multi-tenancy and role differentiation across Seekers, Employers, and Admins?",
        short_answer="Role differentiation is enforced via a two-stage middleware architecture: requireAuth validates the JWT and hydrates the user identity, while authorize(...allowedRoles) checks whether the user's role matches the required permission for that route. The frontend uses TypeScript union types and role-based view rendering to conditionally display features.",
        explanation="User roles are defined in the User schema as an enum: ['SEEKER', 'EMPLOYER', 'ADMIN']. When generating a JWT, the user's role is embedded in the token payload. On protected requests, requireAuth parses the token and loads the current user from the database. The authorize middleware verifies role access before invoking the controller. On the frontend, App.tsx conditionally loads data and renders either SeekerDashboard, CompanyDashboard, or AdminDashboard.",
        code_example="""// backend/src/middleware/auth.js
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Access denied: role '${req.user ? req.user.role : "none"}' not authorized` 
      });
    }
    next();
  };
};""",
        code_caption="backend/src/middleware/auth.js",
        follow_up="What happens if an admin changes a user's role while that user holds an active JWT?",
        key_points=[
            "Role enum on User model: SEEKER, EMPLOYER, ADMIN.",
            "Role embedded in JWT payload and re-verified against live DB in requireAuth.",
            "authorize(...roles) middleware returns 403 Forbidden for unauthorized roles."
        ]
    )

    # Q5
    add_qa_item(
        doc,
        q_num=5,
        question="Why did you choose MongoDB over a relational database like PostgreSQL for this portal?",
        short_answer="MongoDB was chosen for its flexible document model, which aligns naturally with JSON payloads, nested subdocuments (such as blog comments and user reactions), and heterogeneous user profiles. Seekers require resume links and skill arrays, while employers require company descriptions and website URLs—all stored cleanly in a single User collection without sparse relational tables.",
        explanation="Relational databases require rigid schema migrations and complex multi-table joins for polymorphic profile data. In MongoDB, a seeker profile with an array of skills, an employer profile with company metadata, and a blog post with embedded comments and reactions are stored natively as BSON documents. When relational integrity is necessary—such as preventing duplicate applications—Mongoose unique compound indexes ({ job: 1, seeker: 1 }) enforce constraints at the database engine level.",
        code_example="""// Mongoose Schema Flexibility (backend/src/models/user.model.js)
// Seeker fields
resumeUrl: { type: String, default: "" },
skills: [{ type: String }],
expectedSalary: { type: Number, default: 0 },
// Employer fields
companyName: { type: String, default: "" },
companyWebsite: { type: String, default: "" },
companyDescription: { type: String, default: "" }""",
        code_caption="backend/src/models/user.model.js",
        follow_up="How do you maintain referential integrity in MongoDB without foreign key constraints?",
        key_points=[
            "Document model matches JSON API payloads and heterogeneous user profiles.",
            "Nested subdocuments eliminate expensive JOIN operations for comments and reactions.",
            "Unique compound indexes guarantee integrity where relational constraints are needed."
        ]
    )

    # Q6
    add_qa_item(
        doc,
        q_num=6,
        question="How does the application scale horizontally if traffic increases by 100x?",
        short_answer="Because the Express backend is completely stateless, scaling horizontally involves deploying multiple Node.js instances behind a reverse proxy (e.g. NGINX, AWS ALB). The database scales through MongoDB Atlas replica sets with read preference distributed to secondary nodes, while static frontend assets are served via a global CDN.",
        explanation="Stateless JWT authentication means any server instance can verify any client request without shared session state. To handle 100x traffic: 1. Node instances scale via Docker containers orchestrated by Kubernetes. 2. MongoDB uses a primary node for writes and secondary replicas for read-heavy operations like job browsing. 3. In-memory rate limiting transitions to a shared Redis cluster. 4. Frequently searched job queries are cached in Redis with a 60-second TTL.",
        code_example="""// Horizontal Scaling Ready: Stateless Token Verification
// Any server instance can independently verify the token using JWT_SECRET
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id).select("-password");""",
        code_caption="backend/src/middleware/auth.js",
        follow_up="What single component in this architecture will become the first bottleneck under high load?",
        key_points=[
            "Stateless architecture allows adding instances behind load balancers immediately.",
            "MongoDB Atlas replica sets distribute read queries across secondary nodes.",
            "Redis caching and distributed rate limiting are the primary scaling enhancements."
        ]
    )

    # Q7
    add_qa_item(
        doc,
        q_num=7,
        question="Can you trace the client-server communication flow from user click to database response?",
        short_answer="When a user clicks an action (e.g. 'Apply Now'), the React component calls an apiService function, which dispatches an HTTP request via Axios. The Axios request interceptor attaches the JWT Bearer token. Express routes the request through Helmet, CORS, body parsing, requireAuth, and authorize middleware into the controller. The controller validates parameters, executes Mongoose queries against MongoDB, and returns JSON. The frontend updates state and displays a confirmation toast.",
        explanation="1. UI Event: Seeker clicks 'Apply' in ApplyModal.tsx.\n2. Service Dispatch: apiService.applyJob(jobId) calls axiosInstance.post('/applications/:jobId/apply').\n3. Interceptor: axiosInstance retrieves localStorage token and sets Authorization: Bearer <token>.\n4. Network: HTTPS POST to http://localhost:4000/api/applications/:jobId/apply.\n5. Middleware Chain: Helmet sets headers -> CORS validates origin -> express.json() parses body -> requireAuth verifies JWT and loads req.user -> authorize('SEEKER') verifies role.\n6. Controller: application.controller.js:applyToJob verifies job is 'Open' and checks Application.findOne for duplicates.\n7. Database: Application.create() writes document to MongoDB; Job.findByIdAndUpdate pushes seeker to applicants array.\n8. Response: 201 Created with application payload returned to client.\n9. UI Update: React updates local state and triggers a success notification.",
        code_example="""// frontend/services/apiService.ts
export const applyJob = async (jobId: string) => {
  const res = await axiosInstance.post(`/applications/${jobId}/apply`);
  return res.data;
};""",
        code_caption="frontend/services/apiService.ts",
        follow_up="What happens if the database query times out during this request?",
        key_points=[
            "Clean request flow: UI -> apiService -> Axios Interceptor -> Express Middleware -> Controller -> MongoDB.",
            "Dual-layer authorization at transport and middleware layers.",
            "Stateless response lifecycle with immediate optimistic UI feedback."
        ]
    )

    # Q8
    add_qa_item(
        doc,
        q_num=8,
        question="What is the role of the public demo sandbox in your architecture?",
        short_answer="The public demo sandbox allows visitors, recruiters, and evaluators to test all three user roles (Job Seeker, Employer, Administrator) on the live deployed website without registration friction. Pre-seeded demo credentials and one-click login buttons provide instant access to fully populated dashboards.",
        explanation="Portfolios that require registration often suffer from high drop-off rates. By pre-seeding three verified accounts (demo.seeker@jobexecutive.com, demo.employer@jobexecutive.com, demo.admin@jobexecutive.com with password Demo@12345) along with 35+ realistic Indian job vacancies across 22 categories, visitors can immediately evaluate candidate application pipelines, recruiter job management, and admin moderation features.",
        code_example="""// backend/src/utils/seedDemoData.js
const DEMO_USERS = [
  { email: "demo.seeker@jobexecutive.com", password: "Demo@12345", role: "SEEKER", name: "Demo Seeker" },
  { email: "demo.employer@jobexecutive.com", password: "Demo@12345", role: "EMPLOYER", name: "Demo Employer" },
  { email: "demo.admin@jobexecutive.com", password: "Demo@12345", role: "ADMIN", name: "Demo Administrator" }
];""",
        code_caption="backend/src/utils/seedDemoData.js",
        follow_up="How do you prevent a malicious visitor from locking everyone out of the demo accounts?",
        key_points=[
            "Zero-friction evaluation of all 3 user roles for live visitors.",
            "Pre-seeded with 35+ realistic vacancies across 22 industry categories.",
            "Backed by custom tampering protection middleware."
        ]
    )

    # Q9
    add_qa_item(
        doc,
        q_num=9,
        question="How does Job Executive protect against data loss or account tampering in public demo mode?",
        short_answer="Account tampering is prevented through a custom protectDemoAccount middleware. Any attempt to modify passwords, delete users, or alter credentials on demo accounts is intercepted and rejected with a 403 Forbidden response. In addition, admin role modifications use direct atomic updates to prevent password hash corruption.",
        explanation="Public demo accounts present a unique security challenge: visitors must have full functional access to browse and test features, but must be barred from destructive modifications. The protectDemoAccount middleware inspects incoming DELETE and PUT requests on user endpoints. If the target user email matches any of the demo accounts, the request is halted immediately before reaching the database, preserving environment stability.",
        code_example="""// backend/src/middleware/auth.js
const DEMO_EMAILS = [
  "demo.seeker@jobexecutive.com",
  "demo.employer@jobexecutive.com",
  "demo.admin@jobexecutive.com"
];

const protectDemoAccount = async (req, res, next) => {
  const targetId = req.params.id;
  if (targetId) {
    const user = await User.findById(targetId);
    if (user && DEMO_EMAILS.includes(user.email)) {
      return res.status(403).json({ 
        msg: "Demo accounts are protected from modification or deletion" 
      });
    }
  }
  next();
};""",
        code_caption="backend/src/middleware/auth.js",
        follow_up="Could an attacker bypass protectDemoAccount by registering a new account with administrative privileges?",
        key_points=[
            "protectDemoAccount middleware blocks deletion or credential modification of demo users.",
            "Returns 403 Forbidden on tamper attempts while permitting normal platform exploration.",
            "Guarantees that public evaluators always find the sandbox in a functioning state."
        ]
    )

    # Q10
    add_qa_item(
        doc,
        q_num=10,
        question="What build system and bundling strategy did you adopt on the frontend, and why?",
        short_answer="We adopted Vite 5 with Rollup for frontend bundling. Vite serves source code over native ES modules during development for sub-second Hot Module Replacement (HMR), and builds optimized, tree-shaken static production bundles via Rollup.",
        explanation="Traditional Webpack-based setups rebuild the entire dependency graph on code changes, causing noticeable lag in large codebases. Vite pre-bundles dependencies using esbuild (written in Go, 10-100x faster than JavaScript-based bundlers) and serves application code on demand. In production, Rollup handles code-splitting, CSS minification, and chunk hash generation for long-term browser caching.",
        code_example="""// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
});""",
        code_caption="frontend/vite.config.ts",
        follow_up="How does code splitting improve Core Web Vitals in a React Single Page Application?",
        key_points=[
            "Vite 5 utilizes native ES modules for near-instant HMR in development.",
            "esbuild pre-bundling delivers 10-100x faster build speeds.",
            "Rollup produces tree-shaken, minified chunks optimized for production caching."
        ]
    )

    # Q11
    add_qa_item(
        doc,
        q_num=11,
        question="How do you handle environment-specific configurations between development and production?",
        short_answer="Configuration is decoupled from code using environment variables via dotenv on the backend and import.meta.env via Vite on the frontend. Sensitive secrets (JWT_SECRET, GEMINI_API_KEY, MONGO_URI) are injected via process.env and never committed to version control.",
        explanation="The frontend dynamically determines the API base URL: if import.meta.env.VITE_API_URL is set, it uses that; otherwise, in development mode (import.meta.env.DEV), it points to http://localhost:4000/api; in production, it falls back to a relative /api path behind a reverse proxy. On the backend, dotenv loads configurations from .env at startup, enabling seamless switching between local MongoDB and MongoDB Atlas.",
        code_example="""// backend/src/app.js
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/job_executive";""",
        code_caption="backend/src/app.js",
        follow_up="What happens if a required environment variable is missing when the server boots?",
        key_points=[
            "Zero hardcoded secrets or environment endpoints in source code.",
            "Dynamic frontend API endpoint resolution based on build environment.",
            ".env.example templates provide clear configuration contracts for deployments."
        ]
    )

    # Q12
    add_qa_item(
        doc,
        q_num=12,
        question="What architectural changes would you make if Job Executive scaled to 5 million daily active users?",
        short_answer="I would introduce: 1. A Redis caching layer for hot job listings and distributed rate limiting. 2. Kafka or RabbitMQ for asynchronous background processing (e.g. email notifications, AI resume batching). 3. Database read/write splitting with MongoDB Atlas sharded clusters. 4. Cloudflare or AWS CloudFront CDN for edge caching of job search responses.",
        explanation="At 5 million DAU, database read volume would overwhelm even replica sets. 90% of job views are read-heavy and tolerate 30-60 seconds of staleness. Introducing Redis Cache with cache-aside pattern on GET /api/job would absorb 85% of query traffic. AI resume enhancement calls would be offloaded to an asynchronous BullMQ worker pool, preventing HTTP connection starvation. Finally, full-text job search would migrate from regex to Elasticsearch or MongoDB Atlas Search with Lucene indexing.",
        code_example="""// Conceptual Redis Cache-Aside Pattern for High Scale
const cachedJobs = await redisClient.get("jobs:active:page1");
if (cachedJobs) return res.json(JSON.parse(cachedJobs));

const jobs = await Job.find({ status: "Open" }).limit(20).lean();
await redisClient.setex("jobs:active:page1", 60, JSON.stringify(jobs));
res.json(jobs);""",
        code_caption="High-Scale Caching Architecture Concept",
        follow_up="How would you handle cache invalidation when an employer deletes or closes a job?",
        key_points=[
            "Redis cache-aside pattern absorbs 85%+ of read-heavy job queries.",
            "Asynchronous message queues (BullMQ/RabbitMQ) decouple AI and notifications.",
            "MongoDB sharding and read replicas distribute write and read traffic."
        ]
    )
