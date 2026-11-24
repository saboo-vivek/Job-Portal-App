from qa_helpers import add_qa_item

def add_section_i(doc):
    # Q111
    add_qa_item(
        doc,
        q_num=111,
        question="What was your personal motivation for building Job Executive?",
        short_answer="I built Job Executive to bridge the gap between opaque candidate experiences and fragmented recruiter hiring pipelines. As a software developer, I experienced the frustration of submitting resumes into black holes without status visibility, while hiring managers struggled with disorganized applicant pools. I wanted to engineer an integrated, high-performance ecosystem with sub-50ms search latency, role-specific workflows, and an integrated AI Resume Booster to empower candidates.",
        explanation="Beyond solving a real problem, Job Executive served as my crucible for mastering full-stack software architecture: writing type-safe React 19 frontends, engineering stateless Express APIs with layered security (Helmet, CORS, rate limiting), tuning MongoDB compound indexes with .lean() hydration bypass, and integrating external LLM APIs (Google Gemini). It reflects my dedication to building production-grade software that is fast, resilient, and user-centric.",
        code_example=None,
        follow_up="What was the most rewarding feature to see working end-to-end?",
        key_points=[
            "Motivated by real-world friction in candidate application tracking.",
            "Demonstrates mastery across the entire modern full-stack web ecosystem.",
            "Balances clean user experience with hardened backend engineering."
        ]
    )

    # Q112
    add_qa_item(
        doc,
        q_num=112,
        question="What was the single most difficult technical challenge you encountered, and what did you learn from it?",
        short_answer="The most nuanced challenge was the password hash corruption bug during admin role changes. When an administrator updated a user's role using user.save(), Mongoose's pre-save password hook triggered on the unselected password field, overwriting the valid bcrypt hash. I resolved it by replacing user.save() with User.findByIdAndUpdate() using an atomic $set operator, learning the critical difference between document-level lifecycle hooks and direct atomic database updates.",
        explanation="This bug was insidious because it produced no syntax or runtime errors; the role update returned HTTP 200, but the user was subsequently locked out upon their next login attempt. Debugging this reinforced the importance of understanding the exact mechanics of ODM lifecycle hooks versus atomic database commands. It taught me to always use direct database update operators ($set, $addToSet) for non-sensitive attribute mutations.",
        code_example="""// The Architectural Fix (backend/src/controllers/admin.controller.js)
const user = await User.findByIdAndUpdate(
  req.params.id,
  { $set: { role: newRole } }, // Direct atomic update: leaves password intact
  { new: true, runValidators: true }
).select("-password");""",
        code_caption="backend/src/controllers/admin.controller.js",
        follow_up="How did you verify that this fix didn't introduce regressions in other parts of user management?",
        key_points=[
            "Discovered subtle password corruption caused by Mongoose pre-save hook triggers.",
            "Learned the deep architectural distinction between document hooks and atomic operators.",
            "Adopted findByIdAndUpdate with $set to guarantee non-destructive updates."
        ]
    )

    # Q113
    add_qa_item(
        doc,
        q_num=113,
        question="How did you prioritize which features to build first versus what to defer?",
        short_answer="I prioritized features using a core-value dependency hierarchy: first, bulletproof authentication and RBAC; second, essential recruitment workflows (job posting, multi-faceted search, application submission); third, pipeline management (employer applicant review and status progression); and finally, value-add enhancements (Gemini AI Resume Booster, 3D Hero canvas, and public demo sandboxes).",
        explanation="Attempting to build AI features or 3D graphics before having reliable authentication or clean data models leads to fragile architectures. By focusing on the core transactional path first—ensuring a seeker can find a job, apply, and have an employer review their dossier with sub-50ms latency—I established a solid foundation. Once the core pipeline was battle-tested and covered by integration tests, I layered on high-impact visual and AI enhancements.",
        code_example=None,
        follow_up="How do you handle scope creep when building a large full-stack application?",
        key_points=[
            "Prioritized core transactional workflows before visual or AI enhancements.",
            "Iterative delivery: Data models -> Security -> Core APIs -> Dashboards -> AI polish.",
            "Avoided premature optimization by establishing verified baseline functionality first."
        ]
    )

    # Q114
    add_qa_item(
        doc,
        q_num=114,
        question="If you had an extra month to work on Job Executive, what architectural upgrades would you implement?",
        short_answer="I would implement four key upgrades: 1. A Redis caching layer for hot job listings and distributed rate limiting. 2. Real-time push notifications using WebSockets (Socket.io) for instant application status updates. 3. Elasticsearch or MongoDB Atlas Search for full-text fuzzy matching with typo tolerance. 4. Refresh token rotation with HttpOnly cookies for enterprise-grade session security.",
        explanation="While the current architecture handles hundreds of concurrent users with sub-50ms latency, these additions would make it enterprise-scale: Redis would offload 85% of read queries from MongoDB, WebSockets would eliminate the need for seekers to manually refresh dashboards to see recruiter stage updates, and fuzzy search would handle candidate typos seamlessly.",
        code_example=None,
        follow_up="Which of these four upgrades would deliver the highest immediate business value?",
        key_points=[
            "Redis cache-aside for high-concurrency read offloading.",
            "WebSocket/SSE for real-time candidate stage notifications.",
            "Elasticsearch/Atlas Search for fuzzy typo-tolerant full-text search.",
            "HttpOnly refresh token rotation for hardened session management."
        ]
    )

    # Q115
    add_qa_item(
        doc,
        q_num=115,
        question="How did you ensure code quality, consistency, and maintainability across the full stack?",
        short_answer="Code quality was maintained through strict TypeScript interfaces across the frontend, modular MVC architecture on the backend, defensive input sanitization, centralized error handling, and comprehensive automated integration testing covering all 12 core API workflows.",
        explanation="On the frontend, types/index.ts defines domain models shared across all components, preventing shape mismatches. On the backend, routes, controllers, and models maintain strict separation of concerns: routes declare middleware chains, controllers enforce business rules, and models define schema validation. Automated integration tests (backend/src/tests/backend.test.js) run on every commit, verifying authentication, rate limiting, role guards, and application pipelines.",
        code_example="""// Automated Integration Test Command
npm test
// Executes 12/12 automated integration tests covering health, auth, RBAC, and pipelines""",
        code_caption="Automated Verification Suite",
        follow_up="How would you set up a CI/CD pipeline with GitHub Actions for this repository?",
        key_points=[
            "Strict TypeScript domain interfaces eliminate runtime shape mismatch bugs.",
            "Decoupled MVC architecture with clean middleware chains.",
            "12/12 automated integration tests guarantee regression prevention."
        ]
    )

    # Q116
    add_qa_item(
        doc,
        q_num=116,
        question="How do you approach testing in this project? Describe your automated test suite.",
        short_answer="I implemented an automated integration test suite in backend/src/tests/backend.test.js using Node.js's native test runner (node:test) and assert. The suite executes 12 end-to-end integration tests verifying health checks, rate limiting, demo user authentication, job filtering, role authorization, demo account shields, and the full application lifecycle.",
        explanation="Testing covers both happy paths and security boundary conditions: 1. Health check returns 200 OK. 2. Auth rate limiter headers are verified. 3. Seeker, Employer, and Admin demo accounts authenticate and receive valid JWTs. 4. Seeker attempts to access /api/admin/users and correctly receives 403 Forbidden. 5. Public visitor attempts to delete the demo admin account and receives 403 Forbidden. 6. Seeker applies to a job, prevents duplicate application, and verifies the employer can retrieve the populated candidate dossier.",
        code_example="""// Automated Test Suite Excerpt (backend/src/tests/backend.test.js)
test("4. Role Authorization: SEEKER cannot access /api/admin/users (403)", async () => {
  const res = await request(app)
    .get("/api/admin/users")
    .set("Authorization", `Bearer ${seekerToken}`);
  assert.strictEqual(res.status, 403);
});""",
        code_caption="backend/src/tests/backend.test.js",
        follow_up="Why did you choose Node's native test runner over Jest or Mocha?",
        key_points=[
            "12 automated integration tests covering all critical security and business paths.",
            "Tests happy paths and security boundary conditions (RBAC, duplicate guards).",
            "Zero extra testing dependencies using Node's built-in node:test module."
        ]
    )

    # Q117
    add_qa_item(
        doc,
        q_num=117,
        question="How would you onboard a new junior developer to this codebase in their first week?",
        short_answer="I would guide them through a structured 4-step onboarding plan: 1. Review the system architecture and data model diagrams in Job_Executive_Project_Explanation_and_Interview_Guide.docx. 2. Set up the local environment using npm run dev and inspect the pre-seeded demo accounts. 3. Walk through the automated integration tests to understand expected API behaviors. 4. Assign a small, self-contained feature—such as adding a 'bookmark job' toggle—to build confidence across frontend and backend layers.",
        explanation="A structured onboarding process builds autonomy quickly. By having comprehensive documentation and working demo accounts ready on day one, the junior engineer avoids days of setup friction. Walking through the test suite demonstrates the exact request/response contracts for every endpoint. Pairing on their first pull request reinforces code style, TypeScript conventions, and Mongoose query best practices.",
        code_example=None,
        follow_up="What documentation or tooling would you provide to help them troubleshoot local errors independently?",
        key_points=[
            "Provide comprehensive architectural documentation and ER diagrams upfront.",
            "Leverage pre-seeded demo accounts for instant zero-setup exploration.",
            "Use automated tests as living documentation of API contracts.",
            "Assign a bounded starter task to practice end-to-end pull request workflows."
        ]
    )

    # Q118
    add_qa_item(
        doc,
        q_num=118,
        question="Describe a trade-off where you chose engineering simplicity over theoretical perfection.",
        short_answer="I chose to store candidate resume links as verified Google Drive URLs rather than implementing a full multipart file upload service with S3 bucket storage and antivirus scanning. This decision saved hundreds of lines of complex file parsing and cloud infrastructure boilerplate while empowering candidates to maintain control over their document permissions.",
        explanation="In theoretical discussions, candidates are often expected to implement direct binary file uploads with AWS S3, CloudFront pre-signed URLs, and ClamAV scanning. However, for our recruitment portal's scope, hosting files directly introduces significant operational overhead, costs, and security risks. By supporting Google Drive links, recruiters get instant browser previews, seekers update their resumes without re-uploading, and the backend remains completely stateless and lightweight.",
        code_example=None,
        follow_up="Under what conditions would business requirements force you to replace Google Drive links with direct PDF storage?",
        key_points=[
            "Chose Google Drive URL linking over heavy S3 multipart upload infrastructure.",
            "Eliminated server file storage bottlenecks and PDF exploit vectors.",
            "Focused engineering effort on core recruitment workflows and AI integration."
        ]
    )

    # Q119
    add_qa_item(
        doc,
        q_num=119,
        question="How did you handle user feedback or UX friction points during development?",
        short_answer="I continuously tested the platform from the perspective of each user persona, identifying three major friction points: 1. Slow job search rendering. 2. Blank candidate details in employer reviews. 3. Redundant applicant submissions. I eliminated these friction points by adding compound indexes with .lean(), selectively populating complete candidate dossiers, and rendering disabled 'Applied' button states.",
        explanation="Empathy for the end-user is what transforms raw code into a valuable product. When I noticed that searching jobs created visual stutter, I profiled database queries and applied compound indexes. When I realized employers couldn't see candidate phone numbers or skills, I updated the population query. When seekers could accidentally apply twice, I added the database compound unique index and immediate visual button disabling.",
        code_example=None,
        follow_up="How do you gather quantitative user behavior data to identify UX friction in production?",
        key_points=[
            "Actively tested application through each persona's operational lens.",
            "Resolved search lag with compound indexes and .lean() hydration bypass.",
            "Enriched candidate profile visibility for recruiters and prevented duplicate submissions."
        ]
    )

    # Q120
    add_qa_item(
        doc,
        q_num=120,
        question="Why should our engineering team hire you based on the work you delivered in Job Executive?",
        short_answer="You should hire me because Job Executive demonstrates that I am a full-stack engineer who builds complete, production-grade systems—not just isolated UI components or boilerplate CRUD APIs. I understand performance optimization (compound indexing, .lean()), defense-in-depth security (Helmet, rate limiting, RBAC, tampering shields), clean architecture (TypeScript, state machines, interceptors), and modern AI integration. I write self-documenting, maintainable code backed by automated testing, and I take complete ownership of software from initial architecture to production deployment.",
        explanation="In Job Executive, every single design decision was deliberate. I didn't just write queries; I optimized them with explain plans according to the ESR rule. I didn't just store passwords; I salted them with bcrypt and suppressed them at the schema level. I built a system that is fast (sub-50ms), resilient (automated tests, graceful shutdown), intelligent (Gemini AI), and accessible (public demo mode). I bring this same level of architectural rigour, technical curiosity, and product ownership to your engineering team.",
        code_example=None,
        follow_up="How quickly can you adapt to our company's internal technology stack and deployment workflows?",
        key_points=[
            "Demonstrated end-to-end full-stack engineering capability across React, Node, and MongoDB.",
            "Proven mastery of database performance optimization, security hardening, and AI integration.",
            "Strong product ownership, self-directed problem solving, and commitment to automated testing."
        ]
    )
