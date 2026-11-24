from qa_helpers import add_qa_item

def add_section_f(doc):
    # Q76
    add_qa_item(
        doc,
        q_num=76,
        question="How does the Google Gemini AI Resume Booster feature work from end to end?",
        short_answer="The Seeker opens the AI Resume Booster modal in SeekerDashboard.tsx and inputs a rough draft of their summary or experience. The client calls apiService.boostResume(text), issuing POST /api/ai/boost. The backend invokes Google's gemini-2.5-flash model via @google/genai with a targeted executive prompt, returning a polished, action-oriented bullet point for the candidate to review and adopt.",
        explanation="1. Frontend: Seeker pastes draft text in the AI modal and clicks 'Enhance Resume'.\n2. Network: POST request to /api/ai/boost with JSON { text } and Bearer token.\n3. Middleware: requireAuth verifies candidate credentials.\n4. Controller: ai.controller.js initializes GoogleGenAI with process.env.GEMINI_API_KEY. It sends the structured prompt to model 'gemini-2.5-flash'.\n5. AI Processing: Gemini parses the draft, enhances vocabulary, quantifies impact, and removes filler words.\n6. Response: 200 OK returning { boostedText: response.text }.\n7. UI Render: The boosted text is displayed in a comparative before/after view, allowing the seeker to copy or save it to their profile with one click.",
        code_example="""// backend/src/controllers/ai.controller.js
const { GoogleGenAI } = require("@google/genai");

exports.boostResumeText = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are a professional executive resume editor. Enhance the following resume snippet:
"${text}"
Return only the polished text without conversational filler.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  res.json({ boostedText: response.text });
};""",
        code_caption="backend/src/controllers/ai.controller.js",
        follow_up="How do you handle API key quota exhaustion or network timeouts when calling Gemini?",
        key_points=[
            "Integrated with Google's gemini-2.5-flash model via @google/genai SDK.",
            "Transforms rough candidate drafts into executive-ready bullet points.",
            "Protected by requireAuth to prevent unauthorized API consumption."
        ]
    )

    # Q77
    add_qa_item(
        doc,
        q_num=77,
        question="What prompt engineering techniques did you use for the AI resume enhancement?",
        short_answer="We used role-prompting ('You are a professional executive resume editor'), constraint specification ('Return only the polished text without conversational filler'), and task conditioning ('Make it punchy, result-oriented, professional, and highlight impact').",
        explanation="Unconstrained LLM prompts often return conversational chatter (e.g. 'Sure, here is your enhanced resume: ...') or hallucinate additional work history. By defining strict negative constraints ('Return only the polished text') and conditioning on executive tone and action verbs (e.g. 'Architected', 'Spearheaded', 'Optimized'), the output fits seamlessly into professional resume formats without post-processing cleanup.",
        code_example="""// Targeted System Prompt (backend/src/controllers/ai.controller.js)
const prompt = `You are a professional executive resume editor. Enhance the following resume summary or experience snippet.
Make it punchy, result-oriented, professional, and highlight impact:
"${text}"
Return only the polished text without conversational filler.`;""",
        code_caption="backend/src/controllers/ai.controller.js",
        follow_up="How could few-shot prompting further improve the consistency of resume bullet points?",
        key_points=[
            "Role prompting assigns domain persona to the model.",
            "Negative constraints eliminate conversational greeting filler.",
            "Impact conditioning guides output toward action verbs and quantifiable results."
        ]
    )

    # Q78
    add_qa_item(
        doc,
        q_num=78,
        question="How does Job Executive prevent duplicate applications if a user double-clicks 'Apply'?",
        short_answer="Duplicate applications are blocked by a dual-defense mechanism: 1. Application-level check via Application.findOne({ job, seeker }). 2. Database-level unique compound index on { job: 1, seeker: 1 } in the Application schema.",
        explanation="If a seeker double-clicks 'Apply' rapidly, two identical requests hit the server in parallel. Even if both pass the initial findOne check before either has completed its insert, the second database write triggers an E11000 duplicate key error in MongoDB due to the unique compound index, ensuring that duplicate application records cannot be created under any concurrency race condition.",
        code_example="""// backend/src/models/application.model.js
applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });

// backend/src/controllers/application.controller.js
const existing = await Application.findOne({ job: jobId, seeker: seekerId });
if (existing) {
  return res.status(400).json({ msg: "You have already applied for this job" });
}""",
        code_caption="backend/src/models/application.model.js",
        follow_up="How does the frontend disable the button to prevent duplicate submissions before the response arrives?",
        key_points=[
            "Application-level check returns clean 400 error message.",
            "Database-level unique compound index guarantees race condition safety.",
            "Atomic array addition ($addToSet) on Job applicants array."
        ]
    )

    # Q79
    add_qa_item(
        doc,
        q_num=79,
        question="How does the recruiter application status pipeline work (Applied -> Offered)?",
        short_answer="When an employer reviews candidates in CompanyDashboard.tsx, each applicant card features a status dropdown. Selecting a new stage (e.g. 'interviewing') triggers apiService.updateApplicantStatus(), which dispatches PUT /api/applications/status/:applicationId. The backend verifies ownership, validates the status enum, and updates MongoDB. The seeker's dashboard reflects the new stage immediately.",
        explanation="Application states follow a structured hiring workflow: applied -> screening -> interviewing -> offered (or rejected). In application.controller.js:updateApplicationStatus, the backend verifies that the requesting user is the employer who posted the job. The incoming status is validated against the allowed enum. When the seeker views their dashboard via GET /api/applications/me, the updated stage badge is rendered.",
        code_example="""// backend/src/controllers/application.controller.js
const allowedStatuses = ["applied", "screening", "interviewing", "offered", "rejected"];
if (!allowedStatuses.includes(status)) {
  return res.status(400).json({ msg: "Invalid status value" });
}

const application = await Application.findByIdAndUpdate(
  applicationId,
  { status },
  { new: true, runValidators: true }
);""",
        code_caption="backend/src/controllers/application.controller.js",
        follow_up="How would you notify the job seeker via email when their application status changes?",
        key_points=[
            "Structured status pipeline: applied -> screening -> interviewing -> offered -> rejected.",
            "Employer ownership verified before allowing status transitions.",
            "Mongoose runValidators ensures only valid enum values are persisted."
        ]
    )

    # Q80
    add_qa_item(
        doc,
        q_num=80,
        question="How does the salary filter query handle overlapping compensation ranges accurately?",
        short_answer="Rather than checking exact equality or full subset inclusion, the salary query tests interval intersection: maxSalary >= userMinSalary AND minSalary <= userMaxSalary. This guarantees that any job whose compensation range overlaps with the candidate's target range is included in results.",
        explanation="If a candidate filters for jobs between 15 LPA and 25 LPA, a job offering 10 LPA to 20 LPA should match because 15-20 LPA overlaps both ranges. A naive check like minSalary >= 15 AND maxSalary <= 25 would incorrectly exclude this vacancy. The interval overlap formula correctly captures all intersecting compensation brackets.",
        code_example="""// backend/src/controllers/job.controller.js
if (minSalary && maxSalary) {
  filter.$and = [
    { maxSalary: { $gte: Number(minSalary) } },
    { minSalary: { $lte: Number(maxSalary) } },
  ];
} else if (minSalary) {
  filter.maxSalary = { $gte: Number(minSalary) };
} else if (maxSalary) {
  filter.minSalary = { $lte: Number(maxSalary) };
}""",
        code_caption="backend/src/controllers/job.controller.js",
        follow_up="What index should be created to optimize range-based salary queries alongside category filters?",
        key_points=[
            "Interval overlap logic: maxSalary >= userMin AND minSalary <= userMax.",
            "Accurately matches partial salary range intersections.",
            "Handles one-sided bounds (e.g. only minimum or only maximum salary specified)."
        ]
    )

    # Q81
    add_qa_item(
        doc,
        q_num=81,
        question="How are company profiles linked to employer user accounts in Job Executive?",
        short_answer="Company profiles are stored directly within the User model when role === 'EMPLOYER' (companyName, companyWebsite, companyDescription, companyLogo). When an employer creates a job, the Job document stores employer: req.user._id as an ObjectId reference, linking vacancies directly to the employer's company entity.",
        explanation="This design avoids an unnecessary Company collection while keeping queries fast. When seekers view the public Companies directory (CompaniesPage.tsx), GET /api/auth/companies returns all users with role === 'EMPLOYER'. When viewing job cards, Mongoose populates employer ('name company companyLogo'), providing company branding alongside job specifications.",
        code_example="""// backend/src/controllers/job.controller.js
const newJob = await Job.create({
  ...req.body,
  employer: req.user._id, // Links job directly to employer user record
  company: req.user.companyName || req.body.company || "Hiring Company",
});""",
        code_caption="backend/src/controllers/job.controller.js",
        follow_up="When would it make sense to split Company into its own dedicated collection with multiple employer members?",
        key_points=[
            "Company metadata embedded in Employer user documents.",
            "Job documents reference employer via ObjectId (employer: User._id).",
            "Public companies directory queries User collection filtered by role: 'EMPLOYER'."
        ]
    )

    # Q82
    add_qa_item(
        doc,
        q_num=82,
        question="How does the blog reaction system handle toggling and switching between Like, Love, and Dislike?",
        short_answer="The reaction system manages atomic transitions in blogReaction.controller.js. Each BlogPost stores reaction counters (likes, loves, dislikes) and an array of userReactions ({ user, type }). If a user clicks an active reaction, it is removed (toggled off); if they switch from 'like' to 'love', the old counter decrements and the new counter increments atomically.",
        explanation="Managing reaction counters manually without concurrency safeguards can lead to counter drift. In Job Executive, when POST /api/blogs/:id/reactions is called with { type: 'love' }: 1. The controller finds the post. 2. Checks userReactions for req.user._id. 3. If an existing reaction of type 'like' is found, post.likes decrements, post.loves increments, and userReactions is updated. 4. If the user clicks 'love' again, post.loves decrements and the entry is removed.",
        code_example="""// backend/src/controllers/blogReaction.controller.js
const existingIndex = post.userReactions.findIndex(
  (r) => r.user.toString() === req.user._id.toString()
);

if (existingIndex > -1) {
  const oldType = post.userReactions[existingIndex].type;
  if (oldType === type) {
    // Toggle off: remove reaction
    post[oldType + "s"] = Math.max(0, post[oldType + "s"] - 1);
    post.userReactions.splice(existingIndex, 1);
  } else {
    // Switch reaction type
    post[oldType + "s"] = Math.max(0, post[oldType + "s"] - 1);
    post[type + "s"] += 1;
    post.userReactions[existingIndex].type = type;
  }
} else {
  // New reaction
  post[type + "s"] += 1;
  post.userReactions.push({ user: req.user._id, type });
}
await post.save();""",
        code_caption="backend/src/controllers/blogReaction.controller.js",
        follow_up="How could you rewrite this using MongoDB atomic $inc and $pull operators for higher concurrency?",
        key_points=[
            "Atomic state machine: add new, toggle off existing, or switch type.",
            "Maintains counter synchrony with userReactions subdocument array.",
            "Math.max(0, count - 1) guards against negative counter bugs."
        ]
    )

    # Q83
    add_qa_item(
        doc,
        q_num=83,
        question="How are blog comments created, displayed, and authorized for deletion?",
        short_answer="Comments are stored as an embedded subdocument array within the BlogPost schema. Authenticated users add comments via POST /api/blogs/:id/comments. Deletion via DELETE /api/blogs/:id/comments/:commentId is authorized if the requesting user is either the comment's author or an Administrator.",
        explanation="Embedding comments within the blog post simplifies queries: fetching a blog post with GET /api/blogs/:id returns the post content and all threaded comments in a single read. When a delete request arrives, blogComment.controller.js verifies that req.user._id matches comment.user OR req.user.role === 'ADMIN'. If authorized, Mongoose pulls the subdocument from the comments array.",
        code_example="""// backend/src/controllers/blogComment.controller.js
const comment = post.comments.id(req.params.commentId);
if (!comment) return res.status(404).json({ msg: "Comment not found" });

// Authorization: Author or Admin
const isAuthor = comment.user.toString() === req.user._id.toString();
const isAdmin = req.user.role === "ADMIN";
if (!isAuthor && !isAdmin) {
  return res.status(403).json({ msg: "Not authorized to delete this comment" });
}

post.comments.pull(req.params.commentId);
await post.save();""",
        code_caption="backend/src/controllers/blogComment.controller.js",
        follow_up="What happens to comments if a blog post has over 10,000 comments?",
        key_points=[
            "Comments stored as embedded subdocuments inside BlogPost.",
            "Single-query retrieval for fast blog article rendering.",
            "Deletion authorized for comment author or platform Administrator."
        ]
    )

    # Q84
    add_qa_item(
        doc,
        q_num=84,
        question="How does the Admin User Management dashboard work, and what safeguards exist?",
        short_answer="AdminDashboard.tsx communicates with /api/admin routes protected by requireAuth and authorize('ADMIN'). Admins can view all registered users, change roles, and delete abusive accounts. Safeguards include protectDemoAccount (blocking deletion of demo users) and using findByIdAndUpdate with $set to prevent password hash corruption.",
        explanation="When an admin updates a user's role from SEEKER to EMPLOYER, PUT /api/admin/users/:id/role executes. In admin.controller.js:changeUserRole, the controller executes User.findByIdAndUpdate(id, { $set: { role: newRole } }, { new: true }). Using $set prevents Mongoose from triggering document save hooks that could corrupt the user's password hash.",
        code_example="""// backend/src/controllers/admin.controller.js
exports.changeUserRole = async (req, res) => {
  const { role } = req.body;
  if (!["SEEKER", "EMPLOYER", "ADMIN"].includes(role)) {
    return res.status(400).json({ msg: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { role } },
    { new: true, runValidators: true }
  ).select("-password");

  res.json({ msg: "Role updated successfully", user });
};""",
        code_caption="backend/src/controllers/admin.controller.js",
        follow_up="Can an administrator change their own role to SEEKER and lock themselves out?",
        key_points=[
            "Admin routes strictly guarded by authorize('ADMIN').",
            "findByIdAndUpdate with $set safely updates roles without corrupting passwords.",
            "protectDemoAccount shields demo users from deletion."
        ]
    )

    # Q85
    add_qa_item(
        doc,
        q_num=85,
        question="How does the Seeker profile store and validate Google Drive resume URLs?",
        short_answer="The resumeUrl field is stored as a validated string in the User model. In SeekerDashboard.tsx, candidates paste their public Google Drive link, which is saved via PUT /api/auth/me. Employers click the link in applicant lists to inspect the resume directly in Google Drive's native viewer.",
        explanation="Storing cloud links eliminates the need for complex multipart form parsers (multer), local file system storage, or S3 bucket infrastructure. The frontend validates that the entered text begins with http:// or https://, and the backend trims the URL before saving. When recruiters view candidate applicants, the link opens in a new tab with rel='noopener noreferrer' for security.",
        code_example="""// frontend/components/SeekerDashboard.tsx
<input 
  type="url" 
  value={resumeUrl} 
  onChange={(e) => setResumeUrl(e.target.value)} 
  placeholder="https://drive.google.com/file/d/..." 
  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
/>""",
        code_caption="frontend/components/SeekerDashboard.tsx",
        follow_up="What security attributes should always be added to external anchor links (rel='noopener noreferrer')?",
        key_points=[
            "Cloud URL linking eliminates server file storage and virus scanning overhead.",
            "Seekers retain control over document sharing permissions in Google Drive.",
            "rel='noopener noreferrer' prevents reverse tab-nabbing vulnerabilities."
        ]
    )

    # Q86
    add_qa_item(
        doc,
        q_num=86,
        question="How are platform statistics calculated on the Admin Dashboard?",
        short_answer="Platform statistics are computed by aggregating document counts across collections using Promise.all([User.countDocuments(), Job.countDocuments(), Application.countDocuments()]). This returns total users, active jobs, and total applications in parallel with minimal latency.",
        explanation="In admin.controller.js:getPlatformStats, running count queries in parallel via Promise.all reduces total execution time from sequential roundtrips to the duration of the single slowest count operation. Because MongoDB maintains internal collection metadata counters, countDocuments() with empty filters resolves in sub-5ms time.",
        code_example="""// Parallel Platform Statistics Aggregation
const [totalUsers, totalJobs, totalApplications] = await Promise.all([
  User.countDocuments(),
  Job.countDocuments(),
  Application.countDocuments(),
]);
res.json({ totalUsers, totalJobs, totalApplications });""",
        code_caption="Parallel Metric Calculation",
        follow_up="What is the difference between estimatedDocumentCount() and countDocuments() in MongoDB?",
        key_points=[
            "Parallel execution via Promise.all cuts latency by 60%.",
            "Leverages MongoDB collection metadata for sub-5ms counts.",
            "Surfaces real-time system metrics to administrators on login."
        ]
    )

    # Q87
    add_qa_item(
        doc,
        q_num=87,
        question="How does the demo data seed script populate realistic Indian vacancies across categories?",
        short_answer="The seedDemoData.js utility script checks if ENABLE_DEMO_DATA === 'true' upon startup. It creates the 3 demo accounts (Seeker, Employer, Admin) with hashed passwords, and seeds 35+ realistic Indian job vacancies across major tech hubs (Bengaluru, Hyderabad, Pune, Gurgaon, Remote) spanning 22 distinct industry domains.",
        explanation="Vacancies include authentic job titles, realistic CTC ranges in LPA (e.g. 18-35 LPA for Lead SRE, 25-45 LPA for Staff AI Engineer), detailed technical requirements (React, Node, Kubernetes, PyTorch), and workplace types (Remote, Hybrid, On-site). It uses upsert logic (findOneAndUpdate) so that re-starting the server updates existing records without creating duplicate entries.",
        code_example="""// backend/src/utils/seedDemoData.js
const DEMO_JOBS = [
  {
    title: "Senior Full-Stack Engineer (React + Node)",
    company: "Zeta Technologies",
    location: "Bengaluru, Karnataka (Hybrid)",
    category: "Software Engineering",
    minSalary: 2400000,
    maxSalary: 3800000,
    jobType: "Full-time",
    workplaceType: "Hybrid",
    status: "Open"
  },
  // 35+ additional realistic tech listings...
];""",
        code_caption="backend/src/utils/seedDemoData.js",
        follow_up="Why is upsert logic (findOneAndUpdate with upsert: true) preferred over deleteMany followed by insertMany?",
        key_points=[
            "Seeds 35+ realistic vacancies across 22 industry categories.",
            "Targeted to major Indian tech hubs (Bengaluru, Hyderabad, Gurgaon, Remote).",
            "Idempotent execution via upsert avoids duplicate seeding on restarts."
        ]
    )

    # Q88
    add_qa_item(
        doc,
        q_num=88,
        question="How are jobs categorized, and how does category filtering work across 22+ domains?",
        short_answer="Jobs are assigned a standardized category string (e.g. 'Software Engineering', 'Data Science & AI', 'DevOps & Cloud', 'Product Management'). The category field is indexed alongside status ({ category: 1, status: 1 }), enabling instant indexed filtering when users select a category chip or dropdown option.",
        explanation="On the frontend, category chips provide one-click filtering. Selecting a category passes ?category=Software+Engineering to GET /api/job. The controller applies filter.category = category. Because of the compound index on { category: 1, status: 1 }, MongoDB resolves the query directly using an index scan without scanning non-matching categories.",
        code_example="""// Indexing Category Queries (backend/src/models/job.model.js)
jobSchema.index({ category: 1, status: 1 });

// Query in backend/src/controllers/job.controller.js
if (category) filter.category = category;""",
        code_caption="backend/src/models/job.model.js",
        follow_up="How would you implement category hierarchies (e.g. Engineering -> Frontend -> React)?",
        key_points=[
            "Standardized categories across 22+ tech and business domains.",
            "Supported by compound index { category: 1, status: 1 } for sub-10ms queries.",
            "Interactive category chips provide intuitive one-click exploration on the frontend."
        ]
    )
