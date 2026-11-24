from qa_helpers import add_qa_item

def add_section_h(doc):
    # Q101
    add_qa_item(
        doc,
        q_num=101,
        question="Write a Mongoose query to find all active jobs in 'Bengaluru' with salary between 15 and 30 LPA, sorted by newest.",
        short_answer="Below is the complete Mongoose query utilizing regex location matching, overlapping salary range logic, newest-first sorting, population, and .lean().",
        explanation="The query filters for status: 'Open', performs a case-insensitive regex search on location, checks interval overlap for compensation (maxSalary >= 1,500,000 AND minSalary <= 3,000,000), sorts by createdAt descending, and bypasses document hydration with .lean() for optimal throughput.",
        code_example="""const jobs = await Job.find({
  status: "Open",
  location: { $regex: "Bengaluru", $options: "i" },
  $and: [
    { maxSalary: { $gte: 1500000 } },
    { minSalary: { $lte: 3000000 } }
  ]
})
.sort({ createdAt: -1 })
.populate("employer", "name company")
.lean();""",
        code_caption="Mongoose Job Search Query",
        follow_up="What index should be added to MongoDB to ensure this query executes via IXSCAN without in-memory sorting?",
        key_points=[
            "Regex with $options: 'i' provides case-insensitive location matching.",
            "Interval overlap logic accurately filters salary brackets.",
            ".lean() eliminates document wrapper overhead."
        ]
    )

    # Q102
    add_qa_item(
        doc,
        q_num=102,
        question="Write an Express middleware function that logs HTTP method, path, status code, and response time in milliseconds.",
        short_answer="Below is a production-ready request timing middleware leveraging process.hrtime() and the response 'finish' event.",
        explanation="Express processes middleware before the response is sent. By capturing start time at request entry and listening to the res.on('finish') event, we calculate the exact delta in milliseconds after all headers and data have been flushed to the network socket.",
        code_example="""const requestLogger = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationInMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${durationInMs}ms)`);
  });

  next();
};

app.use(requestLogger);""",
        code_caption="Express Request Timing Middleware",
        follow_up="Why is process.hrtime() preferred over Date.now() for measuring execution latency?",
        key_points=[
            "Listens to res.on('finish') to measure full request lifecycle duration.",
            "process.hrtime() provides nanosecond-precision timing immune to clock drift.",
            "Logs method, URL, HTTP status code, and duration."
        ]
    )

    # Q103
    add_qa_item(
        doc,
        q_num=103,
        question="Write the exact code for an Axios response interceptor that catches 401 errors, clears the token, and redirects to login.",
        short_answer="Below is the exact implementation used in Job Executive's frontend/services/axiosInstance.ts.",
        explanation="The response interceptor accepts two callbacks: one for successful responses (which passes through untouched) and one for rejections. If error.response?.status === 401, it purges the expired JWT from localStorage and resets window.location.href to '/', forcing the user back to the login screen.",
        code_example="""import axios from "axios";

const axiosInstance = axios.create({ baseURL: "/api" });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;""",
        code_caption="frontend/services/axiosInstance.ts",
        follow_up="How could you enhance this to attempt a silent token refresh before redirecting to login?",
        key_points=[
            "Passes through successful responses without mutation.",
            "Catches 401 Unauthorized status globally across all API calls.",
            "Clears invalid tokens from localStorage and redirects to root."
        ]
    )

    # Q104
    add_qa_item(
        doc,
        q_num=104,
        question="Write a MongoDB aggregation pipeline to calculate the total number of jobs and average salary per job category.",
        short_answer="Below is the aggregation pipeline using $match, $group, and $sort stages.",
        explanation="Stage 1 filters for active jobs (status: 'Open'). Stage 2 groups documents by the category field, calculating totalJobs via $sum: 1 and averageSalary via $avg: '$maxSalary'. Stage 3 sorts the aggregated categories in descending order by job count.",
        code_example="""const stats = await Job.aggregate([
  { $match: { status: "Open" } },
  {
    $group: {
      _id: "$category",
      totalJobs: { $sum: 1 },
      avgMinSalary: { $avg: "$minSalary" },
      avgMaxSalary: { $avg: "$maxSalary" },
    },
  },
  { $sort: { totalJobs: -1 } },
]);""",
        code_caption="MongoDB Category Statistics Aggregation",
        follow_up="What index would optimize the initial $match stage of this aggregation pipeline?",
        key_points=[
            "$match filters documents before grouping, reducing pipeline workload.",
            "$group accumulates metrics ($sum, $avg) by category.",
            "$sort orders results by highest vacancy counts."
        ]
    )

    # Q105
    add_qa_item(
        doc,
        q_num=105,
        question="Write a TypeScript type definition for a generic API response wrapper that can hold any data payload.",
        short_answer="Below is a production-grade generic TypeScript interface supporting success flags, dynamic payloads, error messages, and pagination metadata.",
        explanation="Using a generic parameter <T> allows services to declare strict return types (e.g. ApiResponse<Job[]> or ApiResponse<User>) while maintaining uniform response structures across the entire frontend service layer.",
        code_example="""export interface ApiResponse<T = any> {
  success: boolean;
  msg?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Example usage in API service:
export const fetchJobs = async (): Promise<ApiResponse<Job[]>> => {
  const res = await axiosInstance.get("/job");
  return res.data;
};""",
        code_caption="Generic TypeScript API Response Interface",
        follow_up="Why is TypeScript's generic parameter <T = any> safer than using any directly?",
        key_points=[
            "Generic type parameter <T> enables strong type safety for arbitrary payloads.",
            "Standardizes success, error message, and metadata structures.",
            "Provides full autocomplete and compile-time verification in components."
        ]
    )

    # Q106
    add_qa_item(
        doc,
        q_num=106,
        question="Write a Mongoose pre-save hook that hashes a user's password only if the password field was modified.",
        short_answer="Below is the pre-save hook implementation using bcryptjs and this.isModified('password').",
        explanation="The hook checks this.isModified('password') first. If an existing user simply updates their profile name or skills, this.isModified('password') returns false, calling next() immediately to prevent re-hashing the existing hash. If the password was modified, it generates a 10-round salt, hashes the password, and proceeds.",
        code_example="""const bcrypt = require("bcryptjs");

userSchema.pre("save", async function (next) {
  // Only hash password if it has been modified or is new
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});""",
        code_caption="Mongoose Pre-Save Password Hashing Hook",
        follow_up="Why must traditional function() syntax be used instead of an arrow function in Mongoose hooks?",
        key_points=[
            "this.isModified('password') prevents accidental re-hashing.",
            "Traditional function syntax preserves Mongoose document context (this).",
            "Catches hashing errors and passes them to next(err) safely."
        ]
    )

    # Q107
    add_qa_item(
        doc,
        q_num=107,
        question="Write a controller function that atomically pushes a new comment into a blog post's comments array.",
        short_answer="Below is the controller function using Mongoose's findByIdAndUpdate with the atomic $push operator.",
        explanation="Using findByIdAndUpdate with $push performs an atomic database operation, avoiding race conditions that occur when fetching a document, mutating its array in JavaScript memory, and calling post.save().",
        code_example="""exports.addComment = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ msg: "Comment content is required" });

  const newComment = {
    user: req.user._id,
    name: req.user.name,
    content,
    createdAt: new Date(),
  };

  const updatedPost = await BlogPost.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: newComment } },
    { new: true, runValidators: true }
  ).populate("comments.user", "name photoUrl");

  if (!updatedPost) return res.status(404).json({ msg: "Blog post not found" });
  res.status(201).json(updatedPost);
};""",
        code_caption="Atomic Subdocument Array Insertion",
        follow_up="What is the advantage of using $push over post.comments.push() followed by post.save()?",
        key_points=[
            "Atomic $push operation prevents array overwrites under concurrent traffic.",
            "{ new: true } returns the updated document with the newly appended comment.",
            "Validates comment content before execution."
        ]
    )

    # Q108
    add_qa_item(
        doc,
        q_num=108,
        question="Write an Express middleware that validates that req.body contains a valid email and non-empty password.",
        short_answer="Below is a lightweight validation middleware verifying non-empty strings and valid email regex formatting.",
        explanation="Validating input at the middleware layer rejects malformed requests before they consume database or bcrypt compute cycles, returning an immediate 400 Bad Request response.",
        code_example="""const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ msg: "A valid email address is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ msg: "Please enter a valid email format" });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters" });
  }

  next();
};""",
        code_caption="Express Request Body Validation Middleware",
        follow_up="How does validator or express-validator simplify complex input validation rules?",
        key_points=[
            "Validates type, non-emptiness, and regex format before controllers execute.",
            "Returns early 400 Bad Request, saving database compute.",
            "Enforces minimum password length constraints."
        ]
    )

    # Q109
    add_qa_item(
        doc,
        q_num=109,
        question="Write a React custom hook (useDebounce) that debounces search input by 300ms before triggering an API call.",
        short_answer="Below is a custom useDebounce hook implementation leveraging useState and useEffect cleanup timers.",
        explanation="When a user types rapidly in a search input (e.g. 'Software Engineer'), firing an API request on every keystroke floods the backend with 17 separate requests. useDebounce resets an internal setTimeout on every keystroke, emitting the final value only after the user has stopped typing for 300ms.",
        code_example="""import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}""",
        code_caption="React useDebounce Custom Hook",
        follow_up="How does this cleanup timer pattern prevent memory leaks in React functional components?",
        key_points=[
            "Reduces network requests by 80-90% during live search typing.",
            "Cleanup function (clearTimeout) cancels pending timers on new keystrokes.",
            "Type-safe generic implementation works with strings, numbers, or filter objects."
        ]
    )

    # Q110
    add_qa_item(
        doc,
        q_num=110,
        question="Write a Mongoose query that populates a job's employer details while strictly excluding their password and private phone number.",
        short_answer="Below is the Mongoose query using explicit field selection inside the .populate() method.",
        explanation="To preserve candidate and recruiter privacy, passing a selective projection string ('name company companyLogo companyWebsite') ensures that private attributes like password, phone, or internal notes are never transferred from the database or serialized to the client.",
        code_example="""const job = await Job.findById(jobId)
  .populate({
    path: "employer",
    select: "name company companyLogo companyWebsite -_id",
  })
  .lean();

if (!job) return res.status(404).json({ msg: "Job not found" });
res.json(job);""",
        code_caption="Selective Population Query",
        follow_up="What does prepending a minus sign (-_id) do in a Mongoose projection string?",
        key_points=[
            "Explicit field projection prevents accidental exposure of sensitive recruiter data.",
            "path and select options provide fine-grained control over populated fields.",
            "Combined with .lean() for fast JSON response streaming."
        ]
    )
