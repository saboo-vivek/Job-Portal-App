from qa_helpers import add_qa_item

def add_section_c(doc):
    # Q28
    add_qa_item(
        doc,
        q_num=28,
        question="Why did you choose Express.js 5 over NestJS, Fastify, or Express 4?",
        short_answer="Express.js 5 was chosen for its native support for rejected promises in async route handlers, unopinionated minimalist architecture, and battle-tested stability. It eliminates the need for external async error-wrapping utilities (like express-async-handler) while avoiding the heavy dependency bloat and steep abstraction curve of NestJS.",
        explanation="In Express 4, if an asynchronous route handler threw an error without being wrapped in a try/catch block or an async wrapper utility, the process encountered an unhandled promise rejection. Express 5 natively catches unhandled promise rejections in middleware and route handlers, forwarding them directly to the centralized error-handling middleware (app.use((err, req, res, next) => ...)). This dramatically simplifies controller logic while retaining high runtime performance.",
        code_example="""// Express 5 Native Async Rejection Handling
// No need for express-async-handler wrapper!
exports.getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ msg: "Job not found" });
  res.json(job);
};""",
        code_caption="backend/src/controllers/job.controller.js",
        follow_up="How does Fastify compare to Express 5 in terms of raw throughput, and why didn't you use it?",
        key_points=[
            "Express 5 natively catches rejected promises in async middleware.",
            "Eliminates express-async-handler wrapper boilerplate.",
            "Minimalist footprint avoids NestJS dependency overhead."
        ]
    )

    # Q29
    add_qa_item(
        doc,
        q_num=29,
        question="How does the Node.js event loop handle concurrent I/O-bound requests in your application?",
        short_answer="Node.js uses a single-threaded event loop backed by the libuv thread pool. When an I/O operation (like querying MongoDB or verifying a bcrypt hash) is requested, Node offloads the work to libuv or the OS kernel asynchronously, freeing the main thread to immediately process incoming HTTP requests from other clients.",
        explanation="When a client requests GET /api/job, Express receives the HTTP request and issues a non-blocking find() command to MongoDB via Mongoose. The database driver sends the query over a TCP socket and registers an event callback. While MongoDB executes the query, the Node event loop continues processing subsequent login or application requests. Once the database responds with BSON packets, libuv triggers the callback on the event loop, and Express serializes the JSON response back to the client.",
        code_example="""// Asynchronous Non-Blocking Execution
// Main thread is free during database query execution
const jobs = await Job.find(filter).lean();
res.json(jobs);""",
        code_caption="Non-blocking controller execution",
        follow_up="What kind of operations can block the Node.js main thread and degrade throughput?",
        key_points=[
            "Single-threaded event loop with non-blocking asynchronous I/O.",
            "Database queries offloaded to OS network sockets without blocking the thread.",
            "High concurrency for I/O-bound recruitment workloads."
        ]
    )

    # Q30
    add_qa_item(
        doc,
        q_num=30,
        question="What is the middleware execution order in Express, and why does it matter?",
        short_answer="Express executes middleware in the exact sequence in which they are registered via app.use(). If an early middleware sends a response or fails to call next(), downstream middlewares are never reached. This ordering is critical for security: headers, CORS, body parsing, and rate limiting must execute before route handlers and authentication checks.",
        explanation="In backend/src/app.js, Helmet executes first to set HTTP response security headers. CORS runs second to validate cross-origin requests. Body parsers (express.json()) run third so that downstream routers can read req.body. authRateLimiter runs on auth routes to block brute-force attempts before reaching expensive database queries. Finally, routes execute, followed by the 404 handler and the 4-argument centralized error handler.",
        code_example="""// Execution Chain in backend/src/app.js
1. app.use(helmet());               // HTTP Security Headers
2. app.use(cors({ origin: "*" })); // Cross-Origin Resource Sharing
3. app.use(express.json());         // Body Parser (populates req.body)
4. app.use("/api/auth", authRoutes);// Auth Routes (with authRateLimiter)
5. app.use(errorHandler);           // Centralized Error Catcher (err, req, res, next)""",
        code_caption="backend/src/app.js",
        follow_up="What happens if you place express.json() after the route handlers?",
        key_points=[
            "Middleware runs sequentially in registration order.",
            "Security and body parsing must precede routing and controller logic.",
            "Error handlers with 4 arguments must be registered at the very end."
        ]
    )

    # Q31
    add_qa_item(
        doc,
        q_num=31,
        question="How is centralized error handling structured in your Express application?",
        short_answer="Centralized error handling is implemented as a 4-argument middleware (err, req, res, next) positioned at the bottom of app.js. It catches all unhandled exceptions and rejected promises, logs them to the console, and returns a standardized JSON error response without leaking internal stack traces in production.",
        explanation="When any controller encounters an unhandled error or calls next(err), Express routes execution directly to the error-handling middleware. The handler inspects process.env.NODE_ENV: in development, it includes err.message and err.stack to assist debugging; in production, it suppresses internal details, returning a clean 'Internal server error' message to prevent information disclosure vulnerabilities.",
        code_example="""// backend/src/app.js
app.use((err, req, res, next) => {
  console.error("❌ Unhandled server error:", err);
  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";
  res.status(status).json({
    error: isProduction ? "Internal server error" : (err.message || "An unexpected error occurred"),
    ...(isProduction ? {} : { stack: err.stack }),
  });
});""",
        code_caption="backend/src/app.js",
        follow_up="How do you handle operational errors (e.g. 404 Not Found) versus programmer errors (e.g. TypeError)?",
        key_points=[
            "Identified by 4 arguments: (err, req, res, next).",
            "Environment-aware: omits stack traces in production to prevent data leakage.",
            "Returns uniform JSON error structures across all endpoints."
        ]
    )

    # Q32
    add_qa_item(
        doc,
        q_num=32,
        question="What is the difference between synchronous exceptions and unhandled promise rejections in Express 5?",
        short_answer="In synchronous code, exceptions thrown with throw new Error() are caught automatically by Express's internal try/catch. In asynchronous code (async/await), rejections were unhandled in Express 4 and would crash the Node process unless manually caught. In Express 5, async promise rejections are natively intercepted and forwarded to the error middleware.",
        explanation="Express 5 upgrades the router layer to inspect whether the return value of a middleware or route handler is a Promise. If the returned promise rejects, Express automatically catches the rejection and invokes next(rejectionReason). This major improvement eliminated the need for boilerplate try/catch blocks in every single controller function.",
        code_example="""// Express 5 Native Promise Rejection Handling
// If Job.find() rejects due to DB disconnect, Express 5 routes to error middleware automatically
exports.getJobs = async (req, res) => {
  const jobs = await Job.find().lean();
  res.json(jobs);
};""",
        code_caption="Express 5 Promise Handling",
        follow_up="Why should you still catch known operational errors (e.g. invalid password) explicitly with if checks?",
        key_points=[
            "Express 5 automatically handles rejected promises in async handlers.",
            "Eliminates silent crashes from unhandled promise rejections.",
            "Maintains high code clarity without repetitive try/catch wrapping."
        ]
    )

    # Q33
    add_qa_item(
        doc,
        q_num=33,
        question="How does CORS work, and how is it configured in Job Executive?",
        short_answer="CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web applications from making HTTP requests to a domain different from the one that served the web page. In Job Executive, the cors middleware handles incoming pre-flight OPTIONS requests and attaches Access-Control-Allow-* headers.",
        explanation="When the React app running on port 3000 attempts to send a POST request with an Authorization header to the API running on port 4000, the browser first issues an HTTP OPTIONS pre-flight request. The cors({ origin: '*' }) middleware immediately responds with a 204 No Content, confirming that the origin and headers are acceptable. For strict enterprise production deployments, origin: '*' is replaced with a whitelist of verified production domains.",
        code_example="""// backend/src/app.js
const cors = require("cors");
app.use(cors({ origin: "*" }));""",
        code_caption="backend/src/app.js",
        follow_up="What security risk exists when using origin: '*' with credentials (cookies)?",
        key_points=[
            "Manages browser cross-origin pre-flight OPTIONS requests.",
            "Configured via the cors middleware package.",
            "Permits seamless communication between React dev server and Express API."
        ]
    )

    # Q34
    add_qa_item(
        doc,
        q_num=34,
        question="Why is express-rate-limit applied specifically to auth routes instead of globally?",
        short_answer="express-rate-limit is applied to /api/auth routes (100 req/15 min) because authentication endpoints involve expensive cryptographic password hashing (bcrypt) and are prime targets for brute-force and credential-stuffing attacks. Applying aggressive rate limiting globally could inadvertently disrupt normal browsing of public job listings.",
        explanation="Bcrypt with 10 salt rounds intentionally consumes significant CPU cycles to deter offline hash cracking. If an attacker submits thousands of login requests per second, the server's CPU would become saturated, degrading performance for all legitimate users. The authRateLimiter throttles requests per IP address, returning a 429 Too Many Requests response once the quota is exceeded.",
        code_example="""// backend/src/routes/auth.routes.js
const rateLimit = require("express-rate-limit");

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { msg: "Too many authentication attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authRateLimiter);""",
        code_caption="backend/src/routes/auth.routes.js",
        follow_up="What are the limitations of memory-based rate limiting in a multi-instance cluster?",
        key_points=[
            "Protects CPU-heavy bcrypt operations against brute-force attacks.",
            "Enforces a sliding window of 100 requests per 15 minutes per IP.",
            "Leaves public job browsing unimpeded while securing credential gates."
        ]
    )

    # Q35
    add_qa_item(
        doc,
        q_num=35,
        question="What is the purpose of Helmet middleware, and which security headers does it set?",
        short_answer="Helmet is a security middleware that sets 14 HTTP response headers to protect Express applications against common web vulnerabilities like Cross-Site Scripting (XSS), clickjacking, MIME-sniffing, and insecure transport.",
        explanation="Without Helmet, Express headers advertise Server: Express, aiding attacker reconnaissance. Helmet removes this header and sets: 1. X-Frame-Options: SAMEORIGIN (prevents clickjacking by blocking embedding inside iframes). 2. X-Content-Type-Options: nosniff (prevents browsers from interpreting non-script files as JavaScript). 3. Strict-Transport-Security (HSTS, enforces HTTPS). 4. Content-Security-Policy (CSP, restricts allowed resource origins).",
        code_example="""// backend/src/app.js
const helmet = require("helmet");
app.use(helmet());""",
        code_caption="backend/src/app.js",
        follow_up="How does X-Frame-Options protect against clickjacking attacks?",
        key_points=[
            "Sets 14 secure HTTP response headers automatically.",
            "Removes the X-Powered-By: Express header.",
            "Defends against clickjacking, MIME-type confusion, and XSS."
        ]
    )

    # Q36
    add_qa_item(
        doc,
        q_num=36,
        question="How do you handle request body validation and payload size limits?",
        short_answer="Request body size is strictly capped at 1MB using express.json({ limit: '1mb' }). This prevents Denial of Service (DoS) attacks caused by malicious clients sending massive multi-megabyte JSON payloads to exhaust server memory.",
        explanation="If an attacker posts a 50MB JSON object to an Express server without limits, JSON.parse() blocks the single-threaded event loop and rapidly exhausts heap memory. By configuring express.json({ limit: '1mb' }), Express inspects the Content-Length header and stream bytes, terminating payloads exceeding 1MB with an immediate 413 Payload Too Large error before parsing occurs.",
        code_example="""// backend/src/app.js
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));""",
        code_caption="backend/src/app.js",
        follow_up="How do you validate the specific shape and types of fields inside req.body?",
        key_points=[
            "Body size capped at 1MB to prevent heap memory exhaustion DoS.",
            "Terminates oversized payloads with 413 Payload Too Large before parsing.",
            "Validates structural constraints at controller and Mongoose schema levels."
        ]
    )

    # Q37
    add_qa_item(
        doc,
        q_num=37,
        question="How is health monitoring implemented on the backend?",
        short_answer="Health monitoring is provided via dedicated GET /api and GET /api/health endpoints that return HTTP 200 with JSON status indicators. These endpoints allow container orchestrators (Docker, Kubernetes) and uptime monitors to verify service availability without database overhead.",
        explanation="Load balancers require lightweight liveness probes to decide whether to route traffic to an instance. Querying the database on every health check can overwhelm the DB during high traffic. A lightweight /api/health endpoint confirms that the Node process is responsive and accepting connections.",
        code_example="""// backend/src/app.js
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});""",
        code_caption="backend/src/app.js",
        follow_up="How would you implement a 'readiness probe' that verifies database connectivity in addition to process health?",
        key_points=[
            "GET /api/health returns { status: 'OK' } for liveness checking.",
            "Lightweight probe avoids unnecessary database load.",
            "Essential for container orchestration and uptime monitoring."
        ]
    )

    # Q38
    add_qa_item(
        doc,
        q_num=38,
        question="How does Swagger UI integration work in your backend architecture?",
        short_answer="Swagger UI is integrated via swagger-ui-express and swagger-jsdoc, hosted at /api-docs. It parses OpenAPI JSDoc annotations embedded above route definitions, generating an interactive documentation dashboard for testing endpoints directly in the browser.",
        explanation="Maintaining separate API documentation often leads to documentation drift as code evolves. By using JSDoc comment blocks directly above Express route handlers in routes/*.js, the swagger.js setup script dynamically compiles the OpenAPI 3.0 specification. Developers and external consumers can inspect request schemas, parameter constraints, and test authentication with JWT Bearer tokens directly at http://localhost:4000/api-docs.",
        code_example="""// backend/src/swagger.js
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

module.exports = function setupSwagger(app) {
  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};""",
        code_caption="backend/src/swagger.js",
        follow_up="What security precautions should you take regarding /api-docs in production?",
        key_points=[
            "Interactive OpenAPI 3.0 documentation served at /api-docs.",
            "Generated dynamically from JSDoc comments in route files.",
            "Allows live endpoint testing and contract verification."
        ]
    )

    # Q39
    add_qa_item(
        doc,
        q_num=39,
        question="What is the difference between PUT and PATCH in your API design?",
        short_answer="PUT represents full replacement or idempotent update of an entire resource, whereas PATCH represents partial modification of specific fields. In Job Executive, PUT is used for updating user profiles (/api/auth/me) and application statuses (/api/applications/status/:id) because the payload completely defines the target state.",
        explanation="When updating an application's status from 'applied' to 'interviewing', a PUT request to /api/applications/status/:id sends { status: 'interviewing' }. Because the route specifically manages the status attribute, applying PUT idempotently sets the resource state. For partial entity updates where unmentioned fields must be preserved, Mongoose's $set operator guarantees non-destructive updates.",
        code_example="""// PUT Update Example (backend/src/controllers/application.controller.js)
exports.updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const application = await Application.findByIdAndUpdate(
    req.params.applicationId,
    { status },
    { new: true, runValidators: true }
  );
  res.json({ msg: "Status updated successfully", application });
};""",
        code_caption="backend/src/controllers/application.controller.js",
        follow_up="What does the HTTP specification say about idempotency in PUT vs POST?",
        key_points=[
            "PUT is idempotent: repeating the request yields the identical system state.",
            "Used for profile updates and application stage progressions.",
            "Mongoose { runValidators: true } ensures enum constraints are enforced during updates."
        ]
    )

    # Q40
    add_qa_item(
        doc,
        q_num=40,
        question="How do you ensure graceful shutdown when the Node.js process receives SIGINT or SIGTERM?",
        short_answer="Graceful shutdown is achieved by listening for OS process signals (process.on('SIGTERM') and process.on('SIGINT')). The server stops accepting new connections via server.close(), allows active in-flight requests to complete, and cleanly closes the Mongoose database connection pool before exiting.",
        explanation="Abruptly terminating a Node.js process with process.exit(0) terminates active HTTP requests mid-flight, potentially corrupting database transactions and leaving TCP sockets hanging. Graceful shutdown closes the HTTP server first, then invokes await mongoose.disconnect(), ensuring that all open socket streams and write buffers are flushed cleanly.",
        code_example="""// Graceful Shutdown Pattern (backend/src/tests/backend.test.js & server.js)
const server = app.listen(PORT);

const handleShutdown = async () => {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);""",
        code_caption="Graceful Shutdown Implementation",
        follow_up="What happens if an in-flight request hangs indefinitely during graceful shutdown?",
        key_points=[
            "Intercepts SIGINT (Ctrl+C) and SIGTERM (container stop).",
            "server.close() finishes pending requests before shutting down.",
            "mongoose.disconnect() closes database connection pools cleanly."
        ]
    )

    # Q41
    add_qa_item(
        doc,
        q_num=41,
        question="How does your backend handle asynchronous errors without crashing the Node process?",
        short_answer="Asynchronous errors are intercepted through Express 5's native promise rejection forwarding and centralized try/catch blocks within controllers. Uncaught exceptions are intercepted by global process.on('unhandledRejection') and process.on('uncaughtException') handlers.",
        explanation="In older Node applications, an unhandled rejected promise would terminate the entire process, causing downtime for all active users. In Job Executive, Express 5 routes rejected promises from async controller methods directly into the centralized error handler, which responds with a 500 status code and keeps the server alive.",
        code_example="""// Global Process Safeguards
process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  // Optional: Gracefully restart instance
});""",
        code_caption="Process-level error listeners",
        follow_up="Why should you eventually restart a Node process if an uncaughtException occurs?",
        key_points=[
            "Express 5 prevents promise rejections from bubbling to the process level.",
            "Controllers catch expected errors and return descriptive 400/404 statuses.",
            "Process listeners log unexpected failures without abrupt crashes."
        ]
    )

    # Q42
    add_qa_item(
        doc,
        q_num=42,
        question="How are static assets and candidate resumes managed on the backend?",
        short_answer="Resumes are managed via public Google Drive links stored as strings in the resumeUrl field, rather than hosting multi-megabyte binary PDF files on the application server. This eliminates local file storage bottlenecks, virus scanning overhead, and bandwidth costs.",
        explanation="Uploading PDF files directly to Node.js servers creates disk space exhaustion risks, complicates horizontal scaling (files on one server aren't visible on another without shared NFS/EFS), and introduces security risks from malicious PDF exploits. Storing verified Google Drive links allows candidates to retain ownership of their document permissions while employers can preview resumes directly in their browser.",
        code_example="""// backend/src/models/user.model.js
resumeUrl: {
  type: String,
  default: "",
  trim: true,
},""",
        code_caption="backend/src/models/user.model.js",
        follow_up="How would you implement secure PDF uploads if an enterprise client required on-premise document storage?",
        key_points=[
            "Zero server disk storage overhead via Google Drive URL linking.",
            "Candidates control document permissions and revisions independently.",
            "Eliminates PDF exploit vectors and multi-instance file synchronization issues."
        ]
    )

    # Q43
    add_qa_item(
        doc,
        q_num=43,
        question="What is the purpose of separating server.js from app.js in your project structure?",
        short_answer="Separating server.js from app.js decouples Express application configuration (routes, middleware, error handling) from the HTTP network listener (app.listen(PORT)). This separation is essential for automated testing, allowing Supertest to test app directly without binding to a network port.",
        explanation="If app.listen() is defined inside app.js, importing app in test files binds to the network port, causing EADDRINUSE errors when running multiple test suites concurrently. By defining the Express app in app.js and the network listener in server.js, integration tests can import app directly and invoke supertest(app) over ephemeral in-memory socket streams.",
        code_example="""// backend/src/server.js
const app = require("./app");
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});""",
        code_caption="backend/src/server.js",
        follow_up="How does this separation simplify testing with tools like Supertest or Jest?",
        key_points=[
            "app.js configures middleware and routes without binding to a port.",
            "server.js binds to the network port for production execution.",
            "Enables isolated automated integration testing with Supertest."
        ]
    )
