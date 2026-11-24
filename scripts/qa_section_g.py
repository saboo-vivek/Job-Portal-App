from qa_helpers import add_qa_item

def add_section_g(doc):
    # Q89
    add_qa_item(
        doc,
        q_num=89,
        question="Scenario: A user reports that clicking 'Apply' returns a 400 Bad Request error. How do you diagnose and fix it?",
        short_answer="Check the backend response payload in the browser Network tab (err.response.data.msg). The two most common causes in Job Executive are: 1. Duplicate application ('You have already applied for this job'). 2. Closed job ('This job is no longer accepting applications'). If it's a duplicate, the UI should show 'Already Applied' instead of an active Apply button.",
        explanation="Step 1: Open Chrome DevTools Network tab, trigger the error, and inspect the response JSON.\nStep 2: If msg is 'You have already applied', check the frontend synchronization: App.tsx may not have hydrated the user's appliedJobs list or the job.applicants array.\nStep 3: If msg is 'Job not found', verify the jobId param in the URL.\nStep 4: Fix: In JobsExplorePage.tsx, disable the Apply button and change label to 'Applied' if job.applicants.includes(currentUser._id), preventing the user from triggering the duplicate request in the first place.",
        code_example="""// Frontend Preventive Check in JobsExplorePage.tsx
const hasApplied = job.applicants?.includes(currentUser?.id);

<button 
  disabled={hasApplied}
  className={hasApplied ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
>
  {hasApplied ? "Applied ✓" : "Apply Now"}
</button>""",
        code_caption="UI Preventive Disabled State",
        follow_up="How does optimistic UI updating improve the user experience right after clicking Apply?",
        key_points=[
            "Inspect DevTools Network tab response JSON for the exact backend error message.",
            "Verify duplicate check vs closed status check in application.controller.js.",
            "Implement frontend state disabling to prevent redundant user submissions."
        ]
    )

    # Q90
    add_qa_item(
        doc,
        q_num=90,
        question="Scenario: Database CPU spikes to 100% on the job explore feed. What is the root cause and remedy?",
        short_answer="The root cause is almost certainly unindexed collection scans (COLLSCAN) triggered by multi-attribute filtering (category, search, location) and sorting without an appropriate compound index. The remedy is to run explain('executionStats'), identify missing index keys, and add a compound index following the ESR rule.",
        explanation="When thousands of seekers browse jobs simultaneously, each query without an index scans every document in the jobs collection. Furthermore, sorting by createdAt: -1 forces MongoDB to load matching documents into RAM to sort them in-memory, exhausting database memory buffers. Solution: 1. Add compound index { status: 1, createdAt: -1 }. 2. Append .lean() to bypass Mongoose document hydration. 3. Enforce strict pagination limits (limit: 20) to prevent unbounded result sets.",
        code_example="""// Database Fix (backend/src/models/job.model.js)
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ category: 1, status: 1 });

// Query Tuning (backend/src/controllers/job.controller.js)
const jobs = await Job.find(filter)
  .sort({ createdAt: -1 })
  .limit(20)
  .lean(); // Massive CPU and memory relief""",
        code_caption="Compound Indexing and Lean Query Fix",
        follow_up="How does MongoDB's Database Profiler help identify slow queries in production?",
        key_points=[
            "100% DB CPU is typically caused by COLLSCAN and in-memory sort operations.",
            "Compound indexes on { status: 1, createdAt: -1 } eliminate in-memory sorting.",
            ".lean() eliminates Node.js heap exhaustion from Mongoose document hydration."
        ]
    )

    # Q91
    add_qa_item(
        doc,
        q_num=91,
        question="Scenario: An employer complains that applicant phone numbers and skills appear blank in their dashboard. How do you debug?",
        short_answer="This is a classic population projection issue. In application.controller.js:getApplicationsForJob, check the .populate('seeker') call. If it lacks explicit field selection, Mongoose uses the default User schema projection, which may exclude profile fields. The fix is to explicitly specify the populated projection: .populate('seeker', 'name email phone photoUrl resumeUrl skills expectedSalary').",
        explanation="When querying applications, Application.find({ job: jobId }) populates the seeker reference. If the User model or query defaults to minimal projections, newly added fields like phone, resumeUrl, and skills are stripped before returning. Inspect the controller: ensure .populate('seeker', 'name email phone photoUrl resumeUrl skills expectedSalary') is present and that .lean() does not strip Mongoose virtual getters.",
        code_example="""// Fixed Population Projection (backend/src/controllers/application.controller.js)
const applications = await Application.find({ job: jobId })
  .populate("seeker", "name email phone photoUrl resumeUrl skills expectedSalary")
  .lean();""",
        code_caption="backend/src/controllers/application.controller.js",
        follow_up="What happens if the seeker deleted their account after applying? How should the frontend handle null seekers?",
        key_points=[
            "Verify explicit field inclusion in .populate() string parameter.",
            "Ensure sensitive fields (password) remain excluded while business fields are populated.",
            "Verify frontend data normalization functions handle missing fields with defaults."
        ]
    )

    # Q92
    add_qa_item(
        doc,
        q_num=92,
        question="Scenario: An admin updates a user's role from SEEKER to EMPLOYER, and the user can no longer log in. What happened?",
        short_answer="The controller used User.findById() followed by user.save(). In user.model.js, the pre('save') hook re-hashed the password because the password was not selected (select: false), causing the hook to re-hash undefined or an empty string, corrupting the stored hash. The fix is to use User.findByIdAndUpdate() with $set.",
        explanation="When a document is loaded via findById(), the password field is omitted due to select: false. When user.save() was called, Mongoose's pre-save middleware evaluated the document. In some configurations, this triggered password re-validation and overwrote the valid bcrypt hash with a hash of undefined. Using User.findByIdAndUpdate(id, { $set: { role: newRole } }) bypasses document-level save hooks completely, executing a direct atomic MongoDB update that leaves the password untouched.",
        code_example="""// Fixed Role Update (backend/src/controllers/admin.controller.js)
const user = await User.findByIdAndUpdate(
  req.params.id,
  { $set: { role: newRole } }, // Atomic update: leaves password hash untouched!
  { new: true, runValidators: true }
).select("-password");""",
        code_caption="backend/src/controllers/admin.controller.js",
        follow_up="Why is findByIdAndUpdate preferred over user.save() when updating non-sensitive attributes?",
        key_points=[
            "user.save() triggers pre('save') hooks that can corrupt unselected password hashes.",
            "findByIdAndUpdate with $set executes a direct atomic update in MongoDB.",
            "Bypasses document lifecycle hooks safely for role updates."
        ]
    )

    # Q93
    add_qa_item(
        doc,
        q_num=93,
        question="Scenario: The Google Gemini API hits an external rate limit or returns a 503 error. How does your backend handle it?",
        short_answer="The backend wraps the Gemini API call in a try/catch block. If an external API error or timeout occurs, it catches the exception, logs the error details securely, and returns an HTTP 503 Service Unavailable or 500 status code with a user-friendly error message, preventing the Express server from crashing.",
        explanation="External AI services can experience transient outages or rate limits. In ai.controller.js, we enclose the ai.models.generateContent() call in a try/catch block. If Gemini fails, the catch block responds with { error: 'AI Resume service temporarily unavailable. Please try again in a few moments.' }. On the frontend, SeekerDashboard catches this response and displays an inline toast message without breaking the dashboard UI.",
        code_example="""// backend/src/controllers/ai.controller.js
try {
  const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
  res.json({ boostedText: response.text });
} catch (aiErr) {
  console.error("Gemini API Error:", aiErr.message);
  res.status(503).json({ error: "AI Resume service temporarily unavailable. Please try again later." });
}""",
        code_caption="backend/src/controllers/ai.controller.js",
        follow_up="How could you implement an exponential backoff retry mechanism for external API failures?",
        key_points=[
            "Enclose third-party API calls in explicit try/catch blocks.",
            "Return HTTP 503 Service Unavailable with friendly fallback messages.",
            "Prevents external service outages from crashing the Node.js process."
        ]
    )

    # Q94
    add_qa_item(
        doc,
        q_num=94,
        question="Scenario: The frontend is stuck on a blank white screen after deploying to Netlify or Vercel. What went wrong?",
        short_answer="The most common cause is a missing or mismatched environment variable (VITE_API_URL), causing API calls on mount to fail or throw unhandled exceptions. Another cause is a runtime JavaScript error in main.tsx before the component mounts (e.g. attempting to read properties of undefined on localStorage tokens).",
        explanation="When deploying a Vite app to Netlify/Vercel, environment variables must be defined in the platform's dashboard with the VITE_ prefix (e.g. VITE_API_URL=https://api.jobexecutive.com/api). If absent, axiosInstance may attempt to request http://localhost:4000/api in production, causing mixed-content (HTTPS to HTTP) blocks. Additionally, ensure the session restoration useEffect in App.tsx catches profile fetch errors cleanly without throwing unhandled exceptions.",
        code_example="""// Defensive Session Restoration in frontend/App.tsx
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;
  api.getUserProfile()
    .then((profile) => { if (profile?.user) setCurrentUser(profile.user); })
    .catch(() => { localStorage.removeItem("token"); }); // Clean recovery on error
}, []);""",
        code_caption="frontend/App.tsx",
        follow_up="How do React Error Boundaries prevent entire application crashes from rendering blank screens?",
        key_points=[
            "Verify VITE_ prefix on all frontend production environment variables.",
            "Prevent mixed-content browser blocks (calling HTTP endpoints from HTTPS domains).",
            "Enclose startup effects in defensive catch blocks to ensure graceful fallback."
        ]
    )

    # Q95
    add_qa_item(
        doc,
        q_num=95,
        question="Scenario: A malicious actor attempts a brute-force dictionary attack on the login endpoint. How does the system respond?",
        short_answer="The system throttles the attacker via express-rate-limit. After 100 requests within a 15-minute window from the same IP, the rate limiter intercepts subsequent requests at the gateway level, returning an HTTP 429 Too Many Requests status code before the request reaches bcrypt or MongoDB.",
        explanation="Bcrypt hashing is deliberately compute-intensive. Without rate limiting, 1,000 parallel login requests would consume 100% of the server's CPU. The authRateLimiter inspects the client's IP address. Once the quota is breached, it immediately returns { msg: 'Too many authentication attempts, please try again later' } with standard Retry-After HTTP headers, preserving server resources.",
        code_example="""// Rate Limiter Response (HTTP 429)
HTTP/1.1 429 Too Many Requests
Retry-After: 900
Content-Type: application/json

{ "msg": "Too many authentication attempts, please try again later" }""",
        code_caption="Rate Limiting Enforcement",
        follow_up="How can an attacker bypass IP-based rate limiting using distributed botnets, and how do you mitigate it?",
        key_points=[
            "Blocks brute-force attacks via sliding-window IP throttling (100 req/15 min).",
            "Returns HTTP 429 Too Many Requests before triggering expensive bcrypt operations.",
            "Includes Retry-After headers indicating when requests may resume."
        ]
    )

    # Q96
    add_qa_item(
        doc,
        q_num=96,
        question="Scenario: Two job seekers apply to the same vacancy at the exact same millisecond. Does a race condition occur?",
        short_answer="No, a race condition does not occur. MongoDB handles document writes atomically on a per-document basis. Both applications are created as independent documents in the Application collection, and the Job's applicants array is updated using the atomic $addToSet operator, guaranteeing that both seekers are registered without overwriting each other.",
        explanation="In MongoDB, write operations to a single document are atomic. In application.controller.js:applyToJob, we update the job using Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: seekerId } }). The $addToSet operator ensures that even if concurrent write streams arrive simultaneously, the database engine serializes array additions, preventing lost updates or array corruption.",
        code_example="""// Atomic Array Addition (backend/src/controllers/application.controller.js)
await Job.findByIdAndUpdate(jobId, { 
  $addToSet: { applicants: seekerId } // Thread-safe atomic operation
});""",
        code_caption="backend/src/controllers/application.controller.js",
        follow_up="What is the difference between $push and $addToSet in MongoDB?",
        key_points=[
            "Single-document write operations are atomic in MongoDB.",
            "$addToSet guarantees set uniqueness during concurrent array updates.",
            "Independent Application documents avoid document lock contention."
        ]
    )

    # Q97
    add_qa_item(
        doc,
        q_num=97,
        question="Scenario: A visitor tries to delete the demo admin account using Postman or curl. What happens?",
        short_answer="The request is intercepted by the protectDemoAccount middleware. The middleware inspects the target user's email against the protected demo list. Because demo.admin@jobexecutive.com is protected, the middleware immediately rejects the request with an HTTP 403 Forbidden response: 'Demo accounts are protected from modification or deletion'.",
        explanation="Even if the visitor obtains a valid JWT token by logging into the demo admin account, the protectDemoAccount middleware executes before admin.controller.js:deleteUser. The database delete operation (User.findByIdAndDelete) is never executed, preserving the account for future visitors.",
        code_example="""// HTTP Response to Postman Attack
HTTP/1.1 403 Forbidden
Content-Type: application/json

{ "msg": "Demo accounts are protected from modification or deletion" }""",
        code_caption="Demo Shield Response",
        follow_up="Can a visitor delete non-demo accounts that they registered themselves during testing?",
        key_points=[
            "protectDemoAccount intercepts DELETE and PUT requests before reaching controllers.",
            "Blocks deletion of demo.seeker, demo.employer, and demo.admin.",
            "Permits visitors to create, edit, and delete their own custom test users freely."
        ]
    )

    # Q98
    add_qa_item(
        doc,
        q_num=98,
        question="Scenario: Memory usage on the Node.js server continuously increases over 48 hours. How do you troubleshoot the memory leak?",
        short_answer="Troubleshoot using Node.js heap snapshots via the --inspect flag and Chrome DevTools Memory profiler. Common culprits in Express backends include unclosed event listeners, unbounded in-memory caches, and Mongoose document retention in global variables. Taking two heap snapshots 1 hour apart and comparing delta allocations identifies leaking object types.",
        explanation="Step 1: Start Node with node --inspect server.js and connect via chrome://inspect.\nStep 2: Take baseline Heap Snapshot 1.\nStep 3: Run load test simulating 500 job browse and application cycles.\nStep 4: Take Heap Snapshot 2 and select 'Comparison' view.\nStep 5: Inspect objects with high 'Delta' counts (e.g. Mongoose Documents, closures, or array caches).\nStep 6: Ensure read queries use .lean() to prevent Mongoose document wrappers from accumulating in heap memory.",
        code_example="""// Starting Node with Inspector for Memory Profiling
node --inspect=0.0.0.0:9229 src/server.js
// Inspect memory deltas and object retention in chrome://inspect""",
        code_caption="Node Inspector Invocation",
        follow_up="How does using .lean() on read queries directly reduce long-term heap fragmentation?",
        key_points=[
            "Capture heap snapshots using Chrome DevTools via node --inspect.",
            "Compare allocation deltas between baseline and load-tested snapshots.",
            "Verify that read operations use .lean() to avoid document hydration leaks."
        ]
    )

    # Q99
    add_qa_item(
        doc,
        q_num=99,
        question="Scenario: A user logs in successfully, but every subsequent API request returns 401 Unauthorized. Where is the bug?",
        short_answer="The bug is in token transmission or JWT secret mismatch: 1. The Axios interceptor is failing to retrieve or format the Authorization header (e.g. sending 'token' instead of 'Bearer <token>'). 2. Or the backend JWT_SECRET environment variable changed or differs between controllers.",
        explanation="In axiosInstance.ts, the request interceptor must prepend 'Bearer ' to the token string: config.headers.Authorization = `Bearer ${token}`. On the backend, requireAuth splits the header on a space (header.split(' ')[1]). If the prefix is missing, or if the server restarted with an automatically regenerated random secret key rather than a persistent process.env.JWT_SECRET, jwt.verify will reject every valid token as invalid.",
        code_example="""// Frontend Interceptor Verification (frontend/services/axiosInstance.ts)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Must match 'Bearer <token>'
  }
  return config;
});""",
        code_caption="frontend/services/axiosInstance.ts",
        follow_up="What happens if localStorage contains the literal string 'undefined' instead of a valid token?",
        key_points=[
            "Verify Bearer token formatting in Axios request interceptor.",
            "Confirm backend JWT_SECRET is static across server restarts.",
            "Check browser DevTools Network tab Request Headers to verify Authorization header presence."
        ]
    )

    # Q100
    add_qa_item(
        doc,
        q_num=100,
        question="Scenario: An employer edits a job posting, but their changes do not appear for other users exploring jobs. Why?",
        short_answer="Two possible causes: 1. The frontend jobs state was not re-fetched after the update. 2. Or the employer updated fields that conflict with the explore query filters (e.g. changing status from 'Open' to 'Draft', which causes getJobs to filter it out).",
        explanation="In App.tsx, when saveJob resolves, the frontend must either update the in-memory jobs array via setJobs(prev => prev.map(...)) or re-dispatch api.getJobs(). If the component only updates local modal state without updating the top-level jobs state, other views will continue rendering the stale cached job object until a full page reload occurs.",
        code_example="""// Proper Frontend State Update in App.tsx
const handleJobSaved = (updatedJob: Job) => {
  setJobs((prevJobs) => 
    prevJobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
  );
  showToast.success("Job updated successfully!");
};""",
        code_caption="State Reconciliation Pattern",
        follow_up="How would you implement Server-Sent Events (SSE) so all active browser clients see job updates in real time?",
        key_points=[
            "Ensure parent jobs state reconciles the updated entity.",
            "Verify updated job status remains 'Open' to satisfy explore filter constraints.",
            "Provide immediate optimistic UI feedback to the recruiter."
        ]
    )
