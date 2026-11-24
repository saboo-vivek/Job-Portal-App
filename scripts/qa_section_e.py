from qa_helpers import add_qa_item

def add_section_e(doc):
    # Q60
    add_qa_item(
        doc,
        q_num=60,
        question="What is the structure of a JSON Web Token (JWT), and what claims do you store in Job Executive?",
        short_answer="A JWT consists of three Base64URL-encoded parts separated by dots: Header, Payload, and Signature. In Job Executive, the payload stores minimal, non-sensitive identity claims: { id: user._id, role: user.role }, signed using HMAC-SHA256 (HS256) with a 7-day expiration time.",
        explanation="1. Header: { alg: 'HS256', typ: 'JWT' } defines the hashing algorithm. 2. Payload: contains registered claims (iat, exp) and custom claims (user._id, role). We deliberately omit sensitive information like emails, names, or passwords to keep token size compact and prevent data leakage if decoded client-side. 3. Signature: HMACSHA256(base64Url(header) + '.' + base64Url(payload), JWT_SECRET) ensures cryptographic integrity against client tampering.",
        code_example="""// backend/src/controllers/auth.controller.js
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);""",
        code_caption="backend/src/controllers/auth.controller.js",
        follow_up="Can a client read the payload of a JWT without possessing the secret key?",
        key_points=[
            "Header, Payload, Signature separated by dots.",
            "Payload stores minimal claims: user._id and role with 7-day TTL.",
            "Cryptographically signed with HMAC-SHA256 using JWT_SECRET."
        ]
    )

    # Q61
    add_qa_item(
        doc,
        q_num=61,
        question="Why did you choose stateless JWTs over server-side session cookies?",
        short_answer="Stateless JWTs allow backend servers to verify user authentication without querying a shared database or session store (e.g. Redis). This allows seamless horizontal scaling across multi-region server clusters, works natively with mobile apps and third-party APIs, and eliminates session replication overhead.",
        explanation="Session cookies require the server to store a session ID in memory or a database for every logged-in user. If traffic spikes to 50,000 active recruiters, the session store faces heavy read traffic. With stateless JWTs, verification happens locally in CPU memory on any server instance using the cryptographic secret key, drastically reducing database load.",
        code_example="""// Stateless Verification: No Database Session Lookup Needed
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Any server instance holding JWT_SECRET can verify this instantly""",
        code_caption="Stateless JWT Verification",
        follow_up="What is the primary drawback of stateless JWTs regarding immediate revocation?",
        key_points=[
            "Stateless verification reduces database session read traffic to zero.",
            "Enables horizontal scaling behind load balancers without sticky sessions.",
            "Native compatibility with mobile clients and cross-domain APIs."
        ]
    )

    # Q62
    add_qa_item(
        doc,
        q_num=62,
        question="How does the requireAuth middleware verify tokens and hydrate the user in Job Executive?",
        short_answer="requireAuth extracts the Bearer token from the HTTP Authorization header, verifies its cryptographic signature using jwt.verify(), and queries MongoDB for the user document (User.findById(decoded.id).select('-password')). The clean user object is attached to req.user for downstream controllers.",
        explanation="The middleware implements multi-stage defensive validation: 1. It verifies the header starts with 'Bearer '. 2. It executes jwt.verify; if the token expired or was modified, it catches the error and returns 401. 3. It checks whether the user still exists in MongoDB; if the account was deleted while the token was active, it halts with 401. 4. It attaches req.user without the password hash, ensuring downstream routes have immediate, secure access to candidate or recruiter data.",
        code_example="""// backend/src/middleware/auth.js
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User no longer exists" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid or expired" });
  }
};""",
        code_caption="backend/src/middleware/auth.js",
        follow_up="Why do we re-query the database in requireAuth instead of relying solely on the token payload?",
        key_points=[
            "Extracts and validates Bearer token format.",
            "jwt.verify guarantees token has not been tampered with.",
            "Re-validates user existence in DB and attaches req.user without password."
        ]
    )

    # Q63
    add_qa_item(
        doc,
        q_num=63,
        question="How does the authorize() middleware enforce Role-Based Access Control (RBAC)?",
        short_answer="authorize() is a higher-order middleware factory that takes permitted roles (e.g. authorize('EMPLOYER', 'ADMIN')) and returns a middleware function. It checks whether req.user.role exists in the permitted roles array; if not, it immediately halts execution with an HTTP 403 Forbidden response.",
        explanation="By chaining requireAuth and authorize(roles), route definitions remain clean and declarative. For example, router.post('/', requireAuth, authorize('EMPLOYER'), createJob) ensures that only authenticated users who hold the EMPLOYER role can execute createJob. If a candidate attempts to forge a request to create a job, authorize rejects the request before it reaches the controller.",
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
        follow_up="What is the HTTP semantic difference between 401 Unauthorized and 403 Forbidden?",
        key_points=[
            "Higher-order middleware accepts allowed role arrays.",
            "Validates req.user.role after requireAuth has hydrated identity.",
            "Returns 403 Forbidden if user lacks necessary permissions."
        ]
    )

    # Q64
    add_qa_item(
        doc,
        q_num=64,
        question="How does bcryptjs hash passwords, and why are 10 salt rounds optimal?",
        short_answer="bcryptjs implements the adaptive Blowfish-based password hashing algorithm, combining a cryptographically random salt with key-stretching iterations (2^10 = 1,024 rounds). 10 salt rounds provides strong security against brute-force and rainbow table attacks (~80-120ms compute time) without degrading login response times.",
        explanation="Unlike fast hash functions (MD5, SHA-256) which can be cracked at billions of guesses per second using GPUs, bcrypt is intentionally computationally expensive. It generates a unique salt per password, preventing pre-computed rainbow table lookups. 10 salt rounds represents the ideal production sweet spot: fast enough for legitimate users, but impossibly slow for offline dictionary attacks.",
        code_example="""// backend/src/controllers/auth.controller.js
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Password verification during login
const isMatch = await bcrypt.compare(password, user.password);""",
        code_caption="backend/src/controllers/auth.controller.js",
        follow_up="What would happen to your server if you increased bcrypt rounds from 10 to 18?",
        key_points=[
            "Unique cryptographic salt prevents rainbow table dictionary attacks.",
            "2^10 iterations provides optimal security vs latency balance (~100ms).",
            "Slows down offline GPU password cracking exponentially."
        ]
    )

    # Q65
    add_qa_item(
        doc,
        q_num=65,
        question="How does Job Executive protect against NoSQL injection attacks in MongoDB?",
        short_answer="NoSQL injection is prevented by using Mongoose schema validation with strict type casting, avoiding the use of dangerous $where JavaScript evaluation, and sanitizing input parameters. Mongoose automatically casts input values to schema types, neutralizing malicious query objects like { $ne: null }.",
        explanation="In raw MongoDB drivers, if a login endpoint accepts req.body.password as an object ({ $ne: '' }), the query db.users.find({ email, password: { $ne: '' } }) matches the user without a valid password. Mongoose schema definitions (password: { type: String, required: true }) automatically reject non-string objects or cast them safely, neutralizing query operator injection.",
        code_example="""// Mongoose Schema Auto-Casting (backend/src/models/user.model.js)
// If attacker sends { email: "admin@test.com", password: { "$ne": null } },
// Mongoose rejects the object because password must be a String.
password: { type: String, required: true, select: false }""",
        code_caption="Mongoose NoSQL Injection Defense",
        follow_up="How does express-mongo-sanitize provide an additional defense layer against $ operators?",
        key_points=[
            "Mongoose strict typing automatically rejects object injection in string fields.",
            "Avoids arbitrary JavaScript execution via $where.",
            "Sanitizes query parameters to prevent NoSQL operator abuse."
        ]
    )

    # Q66
    add_qa_item(
        doc,
        q_num=66,
        question="How do you prevent Cross-Site Scripting (XSS) attacks in the frontend?",
        short_answer="XSS is prevented by React's native JSX escaping, avoiding dangerouslySetInnerHTML for untrusted user inputs, and setting Content-Security-Policy headers via Helmet. React treats all string variables inside JSX as plain text, automatically encoding HTML characters (<, >, &, \") before rendering.",
        explanation="If a malicious candidate enters <script>stealTokens()</script> into their name or cover letter, React renders the characters literally as text nodes rather than executable DOM HTML. In the community blog, article content is parsed using controlled text renderers rather than raw innerHTML. On the backend, Helmet attaches Content-Security-Policy headers to restrict script execution origins.",
        code_example="""// Safe React Rendering: Automatically Escapes Malicious Strings
<div className="text-gray-900 font-bold">
  {job.title} {/* Encoded safely as plain text by React */}
</div>""",
        code_caption="React JSX Auto-Escaping",
        follow_up="In what scenario would React NOT protect you from XSS?",
        key_points=[
            "React JSX automatically escapes string variables before DOM injection.",
            "Avoids dangerouslySetInnerHTML on user-submitted content.",
            "Helmet Content-Security-Policy restricts external script execution."
        ]
    )

    # Q67
    add_qa_item(
        doc,
        q_num=67,
        question="What is Cross-Site Request Forgery (CSRF), and why are Bearer JWTs immune to standard CSRF?",
        short_answer="CSRF occurs when a malicious website tricks a user's browser into executing unwanted actions on a trusted site where the user is currently authenticated via auto-sent cookies. Because Job Executive sends JWTs explicitly in the Authorization: Bearer header via JavaScript rather than relying on ambient cookies, browsers never attach the token automatically on cross-site requests, making standard CSRF impossible.",
        explanation="In cookie-based auth, if a user visits evil.com, a hidden form submitting to jobportal.com/delete-account automatically includes the user's session cookie. With Bearer token authentication, third-party sites cannot access the token stored in localStorage due to the browser's Same-Origin Policy, and browsers will never attach custom Authorization headers to cross-origin form submissions.",
        code_example="""// Explicit Token Attachment (Cannot be triggered by ambient cross-site forms)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});""",
        code_caption="Explicit Header Injection",
        follow_up="What trade-off do you make by using localStorage instead of HttpOnly cookies?",
        key_points=[
            "Bearer tokens sent via headers are immune to ambient browser CSRF exploits.",
            "Browser Same-Origin Policy prevents third-party sites from reading localStorage.",
            "Cross-site form posts cannot attach custom Authorization headers."
        ]
    )

    # Q68
    add_qa_item(
        doc,
        q_num=68,
        question="How do you prevent user enumeration attacks during login and registration?",
        short_answer="User enumeration is prevented by returning generic, uniform error messages (e.g. 'Invalid credentials') regardless of whether the email does not exist or the password was incorrect. This prevents attackers from guessing valid registered email addresses by analyzing error differences.",
        explanation="If a login API returns 'User does not exist' for bad emails and 'Incorrect password' for existing emails, an attacker can automate queries to discover which emails belong to registered executives or recruiters. In auth.controller.js:login, both branches return HTTP 400 with the exact same msg: 'Invalid credentials'.",
        code_example="""// backend/src/controllers/auth.controller.js
const user = await User.findOne({ email }).select("+password");
if (!user) {
  return res.status(400).json({ msg: "Invalid credentials" }); // Identical message
}

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(400).json({ msg: "Invalid credentials" }); // Identical message
}""",
        code_caption="backend/src/controllers/auth.controller.js",
        follow_up="How do timing attacks allow attackers to enumerate users even with identical error messages?",
        key_points=[
            "Uniform 'Invalid credentials' message for missing user and invalid password.",
            "Prevents attackers from mapping registered corporate email directories.",
            "Coupled with rate limiting to block automated credential probing."
        ]
    )

    # Q69
    add_qa_item(
        doc,
        q_num=69,
        question="What is the protectDemoAccount middleware, and how does it prevent public vandalism?",
        short_answer="protectDemoAccount is a specialized security middleware that intercepts DELETE and PUT operations on user endpoints. If the targeted account's email matches any of the three public demo accounts (demo.seeker, demo.employer, demo.admin), the middleware halts the request and returns an HTTP 403 Forbidden response.",
        explanation="Because Job Executive is deployed publicly for portfolio demonstration, visitors must be able to log in as an administrator and test the user deletion or role modification features. However, if a visitor deletes the demo accounts or modifies their passwords, subsequent evaluators will be locked out. protectDemoAccount allows visitors to delete or edit custom accounts, but strictly shields the core demo accounts from alteration.",
        code_example="""// backend/src/middleware/auth.js
const DEMO_EMAILS = [
  "demo.seeker@jobexecutive.com",
  "demo.employer@jobexecutive.com",
  "demo.admin@jobexecutive.com",
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
        follow_up="How do you handle demo password changes if a user tries updating /api/auth/me while logged into a demo account?",
        key_points=[
            "Protects public demo accounts from tampering or deletion by visitors.",
            "Returns 403 Forbidden while allowing normal platform exploration.",
            "Guarantees that public evaluators always find the demo accounts functional."
        ]
    )

    # Q70
    add_qa_item(
        doc,
        q_num=70,
        question="How would you implement token blacklisting if a user logs out or is compromised?",
        short_answer="Token blacklisting can be implemented using Redis. When a user logs out or an account is compromised, the token's unique jti (JWT ID) or signature is added to a Redis blocklist with a TTL matching the token's remaining lifespan. The requireAuth middleware checks Redis before accepting the token.",
        explanation="Because stateless JWTs are valid until their exp timestamp, client-side logout (clearing localStorage) does not prevent the token from being used if it was intercepted. Storing blacklisted tokens in an in-memory Redis key-value store with an automated TTL ensures that revoked tokens are rejected in O(1) time without bloating persistent databases.",
        code_example="""// Conceptual Redis Blacklist in requireAuth
const isBlacklisted = await redisClient.get(`bl_${token}`);
if (isBlacklisted) {
  return res.status(401).json({ msg: "Token has been revoked" });
}""",
        code_caption="Redis Token Revocation Concept",
        follow_up="Why is Redis preferred over MongoDB for token revocation blacklists?",
        key_points=[
            "Redis stores revoked token IDs with TTL matching token expiration.",
            "O(1) in-memory check during requireAuth middleware execution.",
            "Enables immediate session termination without losing stateless scaling benefits."
        ]
    )

    # Q71
    add_qa_item(
        doc,
        q_num=71,
        question="What is the conceptual and practical difference between Authentication (AuthN) and Authorization (AuthZ)?",
        short_answer="Authentication (AuthN) verifies WHO a user is (identity verification, e.g. login with email/password to receive a JWT). Authorization (AuthZ) verifies WHAT that authenticated user is permitted to do (permissions and access control, e.g. checking whether the user holds the EMPLOYER role to post a job).",
        explanation="In Job Executive, AuthN is handled by auth.controller.js:login and requireAuth, which confirms the token is valid and loads the user identity. AuthZ is handled by authorize('EMPLOYER'), which inspects req.user.role to enforce resource permissions. A user can be successfully authenticated (AuthN passes) but still be forbidden from accessing admin routes (AuthZ fails with 403).",
        code_example="""// AuthN vs AuthZ in Route Registration (backend/src/routes/job.routes.js)
router.post(
  "/",
  requireAuth,           // AuthN: Verifies who you are (valid JWT)
  authorize("EMPLOYER"), // AuthZ: Verifies what you can do (must be an EMPLOYER)
  createJob
);""",
        code_caption="backend/src/routes/job.routes.js",
        follow_up="What HTTP status codes correspond to AuthN failures versus AuthZ failures?",
        key_points=[
            "AuthN (401 Unauthorized): Verifies user identity via credentials or token.",
            "AuthZ (403 Forbidden): Verifies user permissions and role privileges.",
            "Implemented as sequential, independent middleware stages."
        ]
    )

    # Q72
    add_qa_item(
        doc,
        q_num=72,
        question="How do you protect sensitive API keys (e.g. GEMINI_API_KEY, JWT_SECRET) in production?",
        short_answer="Sensitive secrets are injected exclusively via environment variables (process.env) provided by the deployment platform (e.g. Render, Railway, AWS Secrets Manager). The .env file is strictly listed in .gitignore, and placeholder examples (.env.example) are committed instead.",
        explanation="Hardcoding secrets in source code risks exposing API credentials publicly on GitHub. In Job Executive, .gitignore explicitly ignores .env and any local secret files. In production hosting environments, environment variables are securely stored in the cloud provider's encrypted secrets vault and injected into the Node.js process environment at runtime.",
        code_example="""// .gitignore entry
.env
.env.local
node_modules/""",
        code_caption=".gitignore configuration",
        follow_up="What automated tools can detect accidentally committed secrets in a Git repository?",
        key_points=[
            "Zero secrets hardcoded in source control.",
            ".gitignore prevents accidental commits of local .env files.",
            "Cloud secrets managers inject credentials securely at process startup."
        ]
    )

    # Q73
    add_qa_item(
        doc,
        q_num=73,
        question="Why should you never log passwords, authorization tokens, or private data in server logs?",
        short_answer="Logging passwords, tokens, or personal identifiable information (PII) exposes sensitive credentials to log management platforms, monitoring tools, and third-party observability services, violating data protection regulations (GDPR, SOC2) and turning server logs into prime targets for data breaches.",
        explanation="Log files are frequently aggregated in shared monitoring services (e.g. Datadog, CloudWatch, Logstash) where access permissions are less restrictive than database access. If a password or JWT token is printed with console.log(req.body), anyone with access to dashboard logs can impersonate users. In Job Executive, logging is restricted to request methods, endpoints, and error summaries without credential payloads.",
        code_example="""// Safe Logging Example (backend/src/app.js)
// Logs only method and URL, never headers or body payloads:
console.log(`Incoming request: ${req.method} ${req.originalUrl}`);""",
        code_caption="Sanitized Server Logging",
        follow_up="How can you sanitize request bodies before passing them to a logging library like Morgan or Winston?",
        key_points=[
            "Prevents credential leakage into log aggregators and monitoring dashboards.",
            "Ensures compliance with data privacy standards (GDPR, SOC2).",
            "Masks sensitive fields before emitting server-side logs."
        ]
    )

    # Q74
    add_qa_item(
        doc,
        q_num=74,
        question="How does the role change operation prevent privilege escalation by normal users?",
        short_answer="Role changes are restricted to the PUT /api/admin/users/:id/role endpoint, which is protected by both requireAuth and authorize('ADMIN'). Normal users cannot update their own role via the profile update route (/api/auth/me) because the profile controller ignores incoming role parameters.",
        explanation="Privilege escalation often happens when an attacker passes { role: 'ADMIN' } to a profile edit endpoint. In Job Executive, auth.controller.js:updateMe explicitly permits updates only to non-sensitive fields (name, phone, location, bio, skills, resumeUrl). The role field can only be updated by a verified Administrator through the dedicated admin controller.",
        code_example="""// Mass Assignment Defense in backend/src/controllers/auth.controller.js
// Only whitelisted fields are extracted from req.body; 'role' is ignored:
const { name, phone, location, bio, skills, resumeUrl } = req.body;
const updatedUser = await User.findByIdAndUpdate(
  req.user._id,
  { name, phone, location, bio, skills, resumeUrl },
  { new: true }
);""",
        code_caption="backend/src/controllers/auth.controller.js",
        follow_up="What is mass assignment vulnerability, and how did we prevent it here?",
        key_points=[
            "Profile update route strictly whitelists permitted fields, ignoring role.",
            "Role elevation endpoint requires verified ADMIN authorization.",
            "Eliminates privilege escalation vulnerabilities."
        ]
    )

    # Q75
    add_qa_item(
        doc,
        q_num=75,
        question="What are the security implications of using cors({ origin: '*' }) versus a domain whitelist in production?",
        short_answer="cors({ origin: '*' }) permits any website to make cross-origin API requests to the server. While acceptable for public exploratory APIs using Bearer headers, production enterprise deployments should use a domain whitelist (e.g. origin: ['https://jobexecutive.com']) to prevent unauthorized third-party sites from embedding or abusing backend endpoints.",
        explanation="When origin: '*' is set, any website can execute GET or POST requests against your API. While Bearer tokens prevent unauthorized data access, an attacker could potentially build phishing clones using your backend. Restricting origin to verified production domains in production mode ensures that only requests from the official web client are accepted by the browser.",
        code_example="""// Production Whitelist Pattern
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? ["https://jobexecutive.com"] 
  : "*";
app.use(cors({ origin: allowedOrigins }));""",
        code_caption="Environment-Aware CORS Whitelist",
        follow_up="Does CORS protect the backend from non-browser HTTP clients like curl or Postman?",
        key_points=[
            "origin: '*' enables rapid development and public testing.",
            "Production deployments should whitelist specific verified frontend domains.",
            "CORS is enforced by browsers, not standalone command-line tools."
        ]
    )
