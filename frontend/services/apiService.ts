import axiosInstance from "./axiosInstance";
import {
  JobSeeker,
  Employer,
  Admin,
  Job,
  Review,
  BlogPost,
  ReactionType,
  Comment,
} from "../types";
/* ================= GEMINI ================= */
export const boostResume=async(text: string) => {
  const res = await axiosInstance.post("/ai/boost", { text });
  return res.data.boostedText;
};


/* ================= AUTH ================= */

export const authenticateUser = async (
  email: string,
  password: string,
  role: string
) => {
  console.log("Authenticating user with role:", email, role);
  const res = await axiosInstance.post("/auth/login", {
    email,
    password,
    role,
  });
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const logout = async () => {
  localStorage.removeItem("token");
  return Promise.resolve();
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const res = await axiosInstance.post("/auth/register", {
    name,
    email,
    password,
    role: role.toUpperCase(),
  });
  return res.data;
};

export const getUserProfile = async () => {
  const res = await axiosInstance.get("/auth/me");
  const user = res.data.user;
  if (!user) return res.data;
  if (user.role === "SEEKER") return { user: normalizeSeeker(user) };
  if (user.role === "EMPLOYER") return { user: normalizeEmployer(user) };
  return res.data;
};

/* ================= JOBS ================= */

export const getJobs = async () => {
  const res = await axiosInstance.get("/job");
  return Array.isArray(res.data) ? res.data.map(normalizeJob) : [];
};

/* ================= SEEKER ================= */

export const getSeekers = async () => {
  const res = await axiosInstance.get("/admin/seekers");
  return Array.isArray(res.data) ? res.data.map(normalizeSeeker) : [];
};

export const saveSeeker = async (seeker: any) => {
  const res = await axiosInstance.put("/auth/me", {
    ...seeker,
    resumeUrl: seeker.resumeUrl, // Google Drive link
  });

  return normalizeSeeker(res.data.user);
};



export const applyJob = async (jobId: string) => {
  const res = await axiosInstance.post(`/applications/${jobId}/apply`);
  return res.data;
};

export const getMyApplications = async () => {
  const res = await axiosInstance.get("/applications/me");
  return res.data;
};

export const addReview = async (companyId: string, review: any) => {
  const res = await axiosInstance.post(
    `/auth/companies/${companyId}/reviews`,
    review
  );
  return normalizeEmployer(res.data);
};

/* ================= COMPANY ================= */

export const getCompanies = async () => {
  const res = await axiosInstance.get("/auth/companies");
  return Array.isArray(res.data) ? res.data.map(normalizeEmployer) : [];
};

export const createJob = async (jobData: any) => {
  const res = await axiosInstance.post("/job", jobData);
  return normalizeJob(res.data);
};

export const deleteJob = async (jobId: string) => {
  const res = await axiosInstance.delete(`/job/${jobId}`);
  return res.data;
};

export const saveJob = async (job: any) => {
  const jobId = job._id || job.id;
  if (jobId) {
    const res = await axiosInstance.put(`/job/${jobId}`, job);
    return normalizeJob(res.data);
  }
  return createJob(job);
};

export const saveCompany = async (employer: any) => {
  const res = await axiosInstance.put("/auth/me", employer);
  return normalizeEmployer(res.data.user);
};

export const getMyJobs = async () => {
  const res = await axiosInstance.get("/job/my/jobs");
  return Array.isArray(res.data) ? res.data.map(normalizeJob) : [];
};

export const getApplicants = async (jobId: string) => {
  const res = await axiosInstance.get(`/applications/${jobId}/applications`);
  return res.data;
};

export const updateApplicantStatus = async (
  applicationId: string,
  status: string
) => {
  const res = await axiosInstance.put(`/applications/status/${applicationId}`, {
    status,
  });
  return res.data;
};

/* ================= ADMIN ================= */

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

export const getAllJobs = async () => {
  const res = await axiosInstance.get("/admin/jobs");
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axiosInstance.delete(`/admin/users/${id}`);
  return res.data;
};

export const adminDeleteJob = async (jobId: string) => {
  const res = await axiosInstance.delete(`/admin/jobs/${jobId}`);
  return res.data;
};

export const deleteEntity = async (type: string, id: string) => {
  if (type === "job") return adminDeleteJob(id);
  if (type === "seeker" || type === "employer") return deleteUser(id);
  if (type === "blogPost") return deleteBlogPost(id);
  return false;
};

/* ================= BLOG (REAL API) ================= */

/* ================= BLOG ================= */

export const getBlogPosts = async () => {
  const res = await axiosInstance.get("/blogs");
  return Array.isArray(res.data) ? res.data.map(normalizeBlog) : [];
};

export const addBlogPost = async (content: string) => {
  const res = await axiosInstance.post("/blogs", { content });
  return res.data;
};


export const updateBlogPost = async (postId: string, content: string) => {
  const res = await axiosInstance.put(`/blogs/${postId}`, { content });
  return res.data;
};

export const deleteBlogPost = async (postId: string) => {
  const res = await axiosInstance.delete(`/blogs/${postId}`);
  return res.data;
};

export const addOrUpdateReaction = async (
  postId: string,
  type: "like" | "love" | "dislike"
) => {
  const res = await axiosInstance.post(
    `/blogs/${postId}/react`,
    { type }
  );
  return res.data;
};

export const addComment = async (postId: string, content: string) => {
  const res = await axiosInstance.post(`/blogs/${postId}/comment`, { content });
  return res.data;
};


export const updateComment = async (
  postId: string,
  commentId: string,
  content: string
) => {
  const res = await axiosInstance.put(
    `/blogs/${postId}/comment/${commentId}`,
    { content }
  );
  return res.data;
};

export const deleteComment = async (postId: string, commentId: string) => {
  const res = await axiosInstance.delete(
    `/blogs/${postId}/comment/${commentId}`
  );
  return res.data;
};
export const normalizeBlog = (blog: any): BlogPost => ({
  id: blog._id?.toString() || blog.id,
  authorId: blog.authorId,
  authorName: blog.authorName,
  authorRole: blog.authorRole,
  authorPhotoUrl: blog.authorPhotoUrl,
  content: blog.content,
  timestamp: blog.createdAt,
  reactions: (blog.reactions || []).map((r: any) => ({
    userId: r.userId,
    type: r.type,
  })),
  comments: (blog.comments || []).map((c: any) => ({
    id: c._id,
    authorId: c.authorId,
    authorName: c.authorName,
    authorPhotoUrl: c.authorPhotoUrl,
    content: c.content,
    timestamp: c.createdAt,
  })),
});

export const normalizeJob = (job: any): Job => ({
  ...job,
  id: job._id?.toString() || job.id,
  companyId:
    job.employerId?._id?.toString() ||
    job.employerId?.toString() ||
    job.companyId,
  applicants: (job.applicants || []).map((item: any) =>
    item._id?.toString() || item.toString()
  ),
  shortlisted: (job.shortlisted || []).map((item: any) =>
    item._id?.toString() || item.toString()
  ),
  rejected: (job.rejected || []).map((item: any) =>
    item._id?.toString() || item.toString()
  ),
});

export const normalizeSeeker = (seeker: any): JobSeeker => ({
  ...seeker,
  id: seeker._id?.toString() || seeker.id,
  appliedJobs: (seeker.appliedJobs || []).map((item: any) =>
    item._id?.toString() || item.toString()
  ),
});

export const normalizeEmployer = (employer: any): Employer => ({
  ...employer,
  id: employer._id?.toString() || employer.id,
  jobs: (employer.jobs || []).map((item: any) =>
    item._id?.toString() || item.toString()
  ),
});
