from qa_helpers import add_qa_item

def add_section_d(doc):
    # Q44
    add_qa_item(
        doc,
        q_num=44,
        question="Why did you choose Mongoose 8 over the raw MongoDB native driver?",
        short_answer="Mongoose provides schema enforcement, type casting, lifecycle middleware hooks (e.g. pre-save password hashing), declarative validation, and reference population (.populate()). The raw driver requires manual validation and lacks schema guardrails, making large full-stack applications prone to data integrity drift.",
        explanation="While the native MongoDB driver offers marginally higher raw throughput, it treats documents as untyped JSON objects. Mongoose adds critical business safety: defining enums for roles (['SEEKER', 'EMPLOYER', 'ADMIN']), enforcing required fields, casting string IDs to ObjectIds, and defining compound indexes declaratively directly in code.",
        code_example="""// Schema Enforcement (backend/src/models/user.model.js)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ["SEEKER", "EMPLOYER", "ADMIN"], default: "SEEKER" },
  password: { type: String, required: true, select: false },
});""",
        code_caption="backend/src/models/user.model.js",
        follow_up="What performance penalty does Mongoose introduce compared to the raw native driver?",
        key_points=[
            "Schema enforcement and type validation directly in code.",
            "Declarative compound indexes and lifecycle hooks.",
            "Reference population simplifies multi-collection relationships."
        ]
    )

    # Q45
    add_qa_item(
        doc,
        q_num=45,
        question="What are compound indexes, and which specific compound indexes did you create in Job Executive?",
        short_answer="A compound index indexes multiple fields within a single database index structure, allowing MongoDB to satisfy queries that filter or sort on multiple criteria without in-memory sorting. In Job Executive, we created compound indexes on Job: { status: 1, createdAt: -1 } and { category: 1, status: 1 }, and on Application: { job: 1, seeker: 1 } (unique).",
        explanation="When a user filters jobs by category and expects results ordered newest-first, a single-field index on category requires MongoDB to perform an in-memory SORT stage for matching documents. A compound index on { category: 1, status: 1 } (or { status: 1, createdAt: -1 }) allows the B-tree index traversal to satisfy both filtering and sorting in a single operation, resulting in an index scan (IXSCAN) with zero memory sort buffer overhead.",
        code_example="""// Compound Indexes in backend/src/models/job.model.js
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ employer: 1, createdAt: -1 });

// Compound Unique Index in backend/src/models/application.model.js
applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });""",
        code_caption="Mongoose Compound Index Definitions",
        follow_up="Why does the order of fields in a compound index matter?",
        key_points=[
            "Indexes multiple fields in a single B-tree structure.",
            "Satisfies multi-criteria filtering and sorting without in-memory sort stages.",
            "Enforces unique constraints across multiple fields simultaneously."
        ]
    )

    # Q46
    add_qa_item(
        doc,
        q_num=46,
        question="What is the ESR (Equality, Sort, Range) rule, and how did you apply it to your schemas?",
        short_answer="The ESR rule is MongoDB's golden standard for compound index design: Equality fields come first, Sort fields second, and Range fields last. Applying this rule ensures the database engine narrows the candidate set via exact matches, orders them via the index tree, and then scans the minimal range without in-memory sorting.",
        explanation="In Job Executive's job search, users filter by status: 'Open' (Equality), sort by createdAt: -1 (Sort), and filter by salary range (Range). In our compound index { status: 1, createdAt: -1 }, MongoDB first matches all 'Open' jobs, immediately follows the index order for newest-first sorting, and filters salary ranges. If Sort were placed after Range, MongoDB would have to perform a blocking in-memory sort.",
        code_example="""// ESR Rule Application:
// E (Equality): status: "Open"
// S (Sort): createdAt: -1
// R (Range): minSalary / maxSalary
jobSchema.index({ status: 1, createdAt: -1 });""",
        code_caption="ESR Index Configuration",
        follow_up="What happens if a query uses two range filters simultaneously on different fields?",
        key_points=[
            "Equality fields placed first in compound index.",
            "Sort fields placed second to eliminate in-memory sorting.",
            "Range fields placed last to prevent premature index tree splitting."
        ]
    )

    # Q47
    add_qa_item(
        doc,
        q_num=47,
        question="What is Mongoose document hydration, and why did you use .lean() for read operations?",
        short_answer="Document hydration is the process where Mongoose transforms raw BSON objects from MongoDB into full Mongoose Document instances complete with getters, setters, virtuals, and change-tracking state. We use .lean() on read queries to bypass hydration, returning plain JavaScript objects for 5-8x lower memory usage and significantly faster execution.",
        explanation="When querying 50 jobs, hydrating each document creates dozens of internal closures, event emitters, and state proxies per document. If those documents are simply serialized to JSON and sent over HTTP, the hydration overhead is completely wasted compute. Appending .lean() tells Mongoose to skip class instantiation, yielding raw plain objects ready for instant JSON serialization.",
        code_example="""// backend/src/controllers/job.controller.js
const jobs = await Job.find(filter)
  .sort(sortOption)
  .populate("employer", "name company")
  .lean(); // Bypasses hydration for high-performance read throughput""",
        code_caption="backend/src/controllers/job.controller.js",
        follow_up="Can you call user.save() or access Mongoose virtual getters on a .lean() object?",
        key_points=[
            "Hydration wraps raw BSON data in heavy Mongoose Document classes.",
            ".lean() returns plain JavaScript objects directly from the MongoDB driver.",
            "Reduces memory allocation by 70-80% on read-heavy API responses."
        ]
    )

    # Q48
    add_qa_item(
        doc,
        q_num=48,
        question="What is the difference between embedding subdocuments and referencing via ObjectIds in MongoDB?",
        short_answer="Embedding stores child documents directly inside the parent document as an array or nested object, retrieved in a single read. Referencing stores child documents in a separate collection with an ObjectId foreign key, requiring a second query or .populate() to resolve.",
        explanation="Embedding is ideal for 1:Few relationships where child data is always accessed with the parent and has bounded growth (e.g. blog post comments or user reaction objects). Referencing is required for 1:Many or Many:Many relationships where data grows unboundedly or must be queried independently (e.g. thousands of job applications or user profiles).",
        code_example="""// Embedded Subdocuments (backend/src/models/blog.model.js)
comments: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
]""",
        code_caption="backend/src/models/blog.model.js",
        follow_up="What is MongoDB's 16MB document size limit, and how does it influence embedding decisions?",
        key_points=[
            "Embedding: 1:Few bounded relationships, single-query retrieval, atomic updates.",
            "Referencing: 1:Many unbounded relationships, independent collections, populated via ObjectIds.",
            "16MB BSON limit dictates when to split embedded arrays into separate collections."
        ]
    )

    # Q49
    add_qa_item(
        doc,
        q_num=49,
        question="Why did you embed blog comments as subdocuments while referencing job applications separately?",
        short_answer="Blog comments are embedded because they are strictly contextual to a single blog post and are always rendered alongside the article content. Job applications are referenced in a separate collection because applications represent an independent business entity with their own hiring workflow states (screening, interviewing, offered), queried independently by both seekers and employers.",
        explanation="If applications were embedded inside Job documents, an employer with 1,000 applicants would face document bloat. More critically, a seeker querying 'My Applications' would have to scan every job in the database to find their embedded submissions. Storing applications in a dedicated Application collection allows indexed queries on { seeker: 1 } and { employer: 1 } with maximum efficiency.",
        code_example="""// Separate Collection for Independent Querying (backend/src/models/application.model.js)
const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["applied", "screening", "interviewing", "offered", "rejected"] }
});""",
        code_caption="backend/src/models/application.model.js",
        follow_up="How do you delete all comments if a blog post is deleted?",
        key_points=[
            "Blog comments: tightly coupled to parent post, embedded for single-read speed.",
            "Applications: decoupled business workflow entity, queried independently by both parties.",
            "Prevents document bloat and enables bidirectional indexing."
        ]
    )

    # Q50
    add_qa_item(
        doc,
        q_num=50,
        question="How does Mongoose .populate() work under the hood? Does it perform a SQL JOIN?",
        short_answer="No, MongoDB does not support traditional SQL JOINs. Mongoose .populate() executes a second, separate $in query under the hood: it collects all referenced ObjectIds from the parent documents and dispatches a User.find({ _id: { $in: [ids] } }) query, merging the results in Node.js memory before returning.",
        explanation="When executing Application.find().populate('seeker'), Mongoose: 1. Queries the applications collection. 2. Extracts all seeker ObjectId values into an array. 3. Executes User.find({ _id: { $in: uniqueSeekerIds } }). 4. Maps matching user objects into the seeker field of each application in JavaScript memory. While efficient, uncontrolled population of deeply nested documents can degrade performance.",
        code_example="""// Under the Hood of .populate('seeker')
// Query 1: db.applications.find({ job: jobId })
// Query 2: db.users.find({ _id: { $in: [seekerId1, seekerId2, ...] } })
// Mongoose stitches them together in Node.js RAM before resolving the promise""",
        code_caption="Mongoose populate mechanics",
        follow_up="What is the difference between Mongoose .populate() and MongoDB's native $lookup aggregation stage?",
        key_points=[
            "Executes an internal secondary query using the $in operator.",
            "Stitches parent and child records together in Node.js process memory.",
            "Faster and simpler than multi-stage aggregations for standard references."
        ]
    )

    # Q51
    add_qa_item(
        doc,
        q_num=51,
        question="What is the N+1 query problem, and how did you prevent it in Job Executive?",
        short_answer="The N+1 query problem occurs when an application executes 1 initial query to fetch N parent records, and then issues N separate individual database queries in a loop to fetch related child data. In Job Executive, this is avoided by using batch .populate() or $in queries, resolving all relationships in exactly 2 database roundtrips.",
        explanation="If we looped over 20 applications and called await User.findById(app.seeker) inside the loop, the server would execute 1 + 20 = 21 database queries. By using Application.find().populate('seeker'), Mongoose batches all 20 seeker IDs into a single $in query, eliminating loop roundtrips and keeping network latency constant regardless of list size.",
        code_example="""// Anti-Pattern (N+1 Queries):
// for (const app of applications) { app.seeker = await User.findById(app.seeker); }

// Optimized Pattern in Job Executive (2 Queries Total):
const applications = await Application.find({ job: jobId })
  .populate("seeker", "name email phone photoUrl resumeUrl skills expectedSalary")
  .lean();""",
        code_caption="backend/src/controllers/application.controller.js",
        follow_up="How does MongoDB's $lookup stage compare for large-scale joins across millions of documents?",
        key_points=[
            "N+1 queries degrade performance linearly with list size.",
            "Mongoose .populate() batches references into a single $in query.",
            "Reduces database roundtrips to 2 queries regardless of record count."
        ]
    )

    # Q52
    add_qa_item(
        doc,
        q_num=52,
        question="How do you prevent duplicate job applications at the database level?",
        short_answer="Duplicate applications are prevented at the database level via a unique compound index on { job: 1, seeker: 1 } in the Application schema. At the application layer, the controller performs a pre-check via Application.findOne({ job, seeker }).",
        explanation="Application-level validation alone is vulnerable to race conditions: if a seeker rapidly double-clicks 'Apply', two concurrent HTTP requests might pass the findOne() check simultaneously before either has written to disk. The MongoDB unique compound index guarantees that the second insert operation throws an E11000 duplicate key error, ensuring data integrity at the database engine level.",
        code_example="""// backend/src/models/application.model.js
applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });

// Controller Check (backend/src/controllers/application.controller.js)
const existing = await Application.findOne({ job: jobId, seeker: seekerId });
if (existing) {
  return res.status(400).json({ msg: "You have already applied for this job" });
}""",
        code_caption="backend/src/models/application.model.js",
        follow_up="How does the backend catch and format MongoDB's E11000 duplicate key error for clients?",
        key_points=[
            "Unique compound index { job: 1, seeker: 1 } blocks concurrent duplicates.",
            "Protects against double-click race conditions at the database engine level.",
            "Controller pre-check returns a friendly 400 error message."
        ]
    )

    # Q53
    add_qa_item(
        doc,
        q_num=53,
        question="Why did you place select: false on the password field in the User schema?",
        short_answer="Setting select: false on the password field ensures that password hashes are automatically excluded by default from all User queries (e.g. User.find(), User.findById(), or .populate('user')). This eliminates the risk of accidentally exposing password hashes in JSON API responses.",
        explanation="In web applications, accidentally serializing password hashes to clients is a critical security vulnerability. By configuring select: false at the schema level, developers don't have to remember to append .select('-password') to every query across every controller. The password is only fetched in auth.controller.js:login using the explicit select('+password') qualifier.",
        code_example="""// backend/src/models/user.model.js
password: {
  type: String,
  required: true,
  select: false, // Suppresses hash by default in all queries
},

// Explicit inclusion ONLY when verifying credentials (auth.controller.js)
const user = await User.findOne({ email }).select("+password");""",
        code_caption="backend/src/models/user.model.js",
        follow_up="What happens if an admin fetches all users via User.find() without any select projection?",
        key_points=[
            "Guarantees password hashes are never serialized by accident.",
            "Applies globally across all queries and populate operations.",
            "Only overridden via explicit select('+password') during login."
        ]
    )

    # Q54
    add_qa_item(
        doc,
        q_num=54,
        question="How do Mongoose pre-save hooks work, and what pitfalls did you encounter with them?",
        short_answer="Pre-save hooks (schema.pre('save', fn)) execute middleware logic immediately before a document is written to MongoDB. A major pitfall occurs when saving documents where the password was not loaded into memory: calling user.save() can trigger the hook unintentionally or cause validation failures.",
        explanation="In our User schema, a pre-save hook automatically hashes passwords if modified (if (!this.isModified('password')) return next()). However, when an administrator updated a user's role using User.findById() followed by user.save(), the password field (being select: false) was absent, leading to unexpected validation issues. We resolved this by using User.findByIdAndUpdate() with $set, bypassing document-level save hooks entirely for non-password updates.",
        code_example="""// Pitfall Resolution in Admin Role Updates (backend/src/controllers/admin.controller.js)
// Using findByIdAndUpdate avoids triggering the pre('save') password hook:
const updatedUser = await User.findByIdAndUpdate(
  req.params.id,
  { $set: { role: newRole } },
  { new: true, runValidators: true }
).select("-password");""",
        code_caption="backend/src/controllers/admin.controller.js",
        follow_up="Why is this.isModified('password') essential inside a pre-save password hook?",
        key_points=[
            "pre('save') executes before document writes to MongoDB.",
            "this.isModified('password') prevents re-hashing an already hashed password.",
            "findByIdAndUpdate with $set safely bypasses hooks for partial non-password updates."
        ]
    )

    # Q55
    add_qa_item(
        doc,
        q_num=55,
        question="What is the difference between findByIdAndUpdate() and findById() followed by save()?",
        short_answer="findByIdAndUpdate() issues an atomic MongoDB findAndModify command directly to the database engine, bypassing Mongoose validation and document hooks unless explicitly enabled. findById() followed by save() fetches the full Mongoose document, applies updates in memory, and triggers all schema validation and pre/post save hooks.",
        explanation="findByIdAndUpdate is faster and ideal for partial atomic updates (e.g. changing an application status or user role) because it executes in a single database roundtrip. However, findById() followed by save() is required when business logic depends on Mongoose hooks—such as hashing a newly submitted password or updating complex virtual properties.",
        code_example="""// Direct Atomic Update (Fast, single roundtrip)
await User.findByIdAndUpdate(id, { $set: { role } }, { new: true });

// Document-Level Save (Executes pre/post hooks)
const user = await User.findById(id);
user.password = newPassword;
await user.save(); // Triggers pre('save') bcrypt hashing""",
        code_caption="Comparison of update methods",
        follow_up="Why is { runValidators: true } important when using findByIdAndUpdate?",
        key_points=[
            "findByIdAndUpdate is an atomic direct database operation (single roundtrip).",
            "findById + save fetches document into memory and executes schema lifecycle hooks.",
            "Choose findByIdAndUpdate for simple attribute changes and save for hook-dependent logic."
        ]
    )

    # Q56
    add_qa_item(
        doc,
        q_num=56,
        question="How does MongoDB handle schema migrations in production?",
        short_answer="Unlike relational databases that require blocking ALTER TABLE migrations, MongoDB is schema-less at the storage layer. Schema evolution is managed via Mongoose schema defaults, lazy migrations on document write, or background migration scripts using updateMany().",
        explanation="When we added new fields to the Job schema (e.g. workplaceType: 'Remote' | 'On-site' | 'Hybrid'), existing documents in MongoDB remained valid without running an ALTER TABLE script. Mongoose applies default values defined in the schema whenever older documents are loaded into memory. For large collections requiring backfilled indexes or fields, a background script executes db.collection.updateMany({ newField: { $exists: false } }, { $set: { newField: defaultValue } }).",
        code_example="""// Schema Defaulting (backend/src/models/job.model.js)
workplaceType: {
  type: String,
  enum: ["Remote", "On-site", "Hybrid"],
  default: "Remote", // Automatically applied to legacy documents
},""",
        code_caption="backend/src/models/job.model.js",
        follow_up="What precautions must you take when removing a field from a Mongoose schema?",
        key_points=[
            "No downtime ALTER TABLE migrations required in MongoDB.",
            "Mongoose schema default values gracefully backfill missing fields in memory.",
            "Background updateMany() scripts backfill persistent values safely."
        ]
    )

    # Q57
    add_qa_item(
        doc,
        q_num=57,
        question="How do you inspect and optimize slow queries in MongoDB?",
        short_answer="Slow queries are analyzed using MongoDB's explain('executionStats') method and the Database Profiler. Key metrics to inspect include totalDocsExamined versus nReturned, and verifying that the winning query plan is an IXSCAN (index scan) rather than a COLLSCAN (collection scan).",
        explanation="If a query searches 50,000 documents to return 20 results (totalDocsExamined: 50000, nReturned: 20), it indicates an unindexed query causing CPU spikes. An optimal query has totalDocsExamined equal to nReturned with executionStages.stage equal to 'IXSCAN'. In Job Executive, all primary explore and dashboard queries were verified using explain plans to ensure zero COLLSCAN stages.",
        code_example="""// Inspecting Query Performance in Mongo Shell
db.jobs.find({ status: "Open" })
  .sort({ createdAt: -1 })
  .explain("executionStats");
// Verify winningPlan.stage === 'IXSCAN' and totalDocsExamined === nReturned""",
        code_caption="MongoDB explain('executionStats')",
        follow_up="What does a stage: 'FETCH' indicate after an IXSCAN in an explain plan?",
        key_points=[
            "explain('executionStats') exposes execution stages and examined document counts.",
            "COLLSCAN indicates an unindexed table scan; IXSCAN indicates index usage.",
            "totalDocsExamined should closely match nReturned for optimal efficiency."
        ]
    )

    # Q58
    add_qa_item(
        doc,
        q_num=58,
        question="What is the difference between single-field indexing and compound indexing?",
        short_answer="A single-field index indexes values from a single key (e.g. email: 1). A compound index indexes multiple keys together in a specific hierarchy (e.g. { category: 1, status: 1 }). Compound indexes can satisfy queries that single-field indexes cannot optimize without index intersection.",
        explanation="If you have separate single-field indexes on category and status, MongoDB must either pick one index or attempt index intersection, which consumes additional CPU. A compound index on { category: 1, status: 1 } evaluates both constraints in a single B-tree traversal. Furthermore, a compound index can support queries on prefixes (e.g. querying just category), effectively serving the purpose of a single-field index on category as well.",
        code_example="""// Compound Index also covers prefix queries on category
jobSchema.index({ category: 1, status: 1 });
// Query 1: db.jobs.find({ category: "Engineering", status: "Open" }) -> Uses full index
// Query 2: db.jobs.find({ category: "Engineering" }) -> Uses index prefix""",
        code_caption="Compound Index Prefix Matching",
        follow_up="Can an index on { category: 1, status: 1 } satisfy a query that filters ONLY on status?",
        key_points=[
            "Single-field indexes index one attribute; compound indexes index multiple in order.",
            "Compound indexes support queries on any prefix of their indexed keys.",
            "Eliminates the CPU overhead of multi-index intersection."
        ]
    )

    # Q59
    add_qa_item(
        doc,
        q_num=59,
        question="How does MongoDB Atlas handle high availability and replica sets?",
        short_answer="MongoDB Atlas deploys replica sets across multiple availability zones consisting of a Primary node and multiple Secondary nodes. The Primary handles all write operations, while Secondaries replicate the oplog. If the Primary fails, an automated election promotes a Secondary to Primary in under 5 seconds with zero data loss.",
        explanation="Replica sets ensure 99.995% uptime for production recruitment systems. By configuring read preferences (e.g. readPreference: 'secondaryPreferred'), read-heavy queries like public job searches can be offloaded to Secondary nodes, reserving the Primary node's IOPS exclusively for candidate application submissions and profile updates.",
        code_example="""// MongoDB Connection with Replica Set in URI
MONGO_URI=mongodb+srv://cluster0.example.mongodb.net/job_executive?retryWrites=true&w=majority""",
        code_caption="Replica Set Connection String",
        follow_up="What is the difference between writeConcern: 'majority' and writeConcern: 1?",
        key_points=[
            "Replica sets provide automated failover in under 5 seconds.",
            "Data replicated across availability zones via MongoDB oplog.",
            "Read preferences allow distributing search queries across secondary replicas."
        ]
    )
