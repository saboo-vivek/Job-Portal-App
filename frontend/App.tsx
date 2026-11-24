import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import SeekerDashboard from "./components/SeekerDashboard";
import CompanyDashboard from "./components/CompanyDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SignupPage from "./components/SignupPage";
import {
  JobSeeker,
  Employer,
  Admin,
  Job,
  Review,
  BlogPost,
  ReactionType,
  Comment,
} from "./types";
import * as api from "./services/apiService";
import { normalizeBlog } from "./services/apiService";

import BlogPage from "./components/BlogPage";
import { BriefcaseIcon, NewspaperIcon } from "./components/icons";
import { Toaster, showToast } from "./components/ui";
import { LandingPage } from "./components/landing/LandingPage";
import { Navbar } from "./components/landing/Navbar";
import { JobsExplorePage } from "./components/jobs/JobsExplorePage";
import { CompaniesPage } from "./components/companies/CompaniesPage";
import Modal from "./components/Modal";
import JobDetails from "./components/JobDetails";

type User = JobSeeker | Employer | Admin;
type UserRole = "SEEKER" | "EMPLOYER" | "ADMIN";
type ActiveView = "home" | "jobs" | "companies" | "blog" | "dashboard" | "login" | "signup";

const Notification = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-secondary text-white py-3 px-5 rounded-lg shadow-lg z-50 animate-fade-in-down flex items-center space-x-3">
      <span className="font-bold">Success!</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white font-bold text-2xl leading-none"
      >
        &times;
      </button>
      <style>{`
            @keyframes fade-in-down {
              0% { opacity: 0; transform: translateY(-20px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
          `}</style>
    </div>
  );
};

const App: React.FC = () => {
  // Data State
  const [seekers, setSeekers] = useState<JobSeeker[]>([]);
  const [companies, setCompanies] = useState<Employer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // UI State
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [notification, setNotification] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedLandingJob, setSelectedLandingJob] = useState<Job | null>(null);
  const [searchFilters, setSearchFilters] = useState<{ query?: string; location?: string; jobType?: string }>({});

  // Load public data on mount
  useEffect(() => {
    const loadPublic = async () => {
      try {
        const [jobsData, companiesData, blogData] = await Promise.all([
          api.getJobs(),
          api.getCompanies(),
          api.getBlogPosts(),
        ]);
        if (jobsData) setJobs(jobsData);
        if (companiesData) setCompanies(companiesData);
        if (blogData) setBlogPosts(blogData);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    };
    loadPublic();
  }, []);

  // Initial data load
  // ✅ Restore session if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const restoreUser = async () => {
      try {
        const profile = await api.getUserProfile();
        if (profile?.user) {
          setCurrentUser(profile.user);
          setCurrentUserRole(profile.user.role);
          setActiveView("dashboard");
        }
      } catch {
        localStorage.removeItem("token");
      }
    };

    restoreUser();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      // 🧹 Reset all data on logout
      setSeekers([]);
      setCompanies([]);
      setJobs([]);
      setBlogPosts([]);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);

      try {
        const role = currentUserRole;
        const promises: Promise<any>[] = [];
        const handlers: Record<string, (data: any) => void> = {};

        // 🌐 Shared for all roles
        promises.push(api.getBlogPosts());
        handlers.blog = setBlogPosts;

        // 💼 Everyone can see jobs (default)
        promises.push(api.getJobs());
        handlers.jobs = setJobs;

        // 👑 Admin-only data
        if (role === "ADMIN") {
          promises.push(api.getSeekers());
          promises.push(api.getCompanies());
          handlers.seekers = setSeekers;
          handlers.companies = setCompanies;
        }

        // 🏢 Employer — load only their own jobs
        if (role === "EMPLOYER") {
          promises[1] = api.getMyJobs ? api.getMyJobs() : api.getJobs();
        }

        // 👷 Seeker — needs company info to view job listings
        if (role === "SEEKER") {
          promises.push(api.getCompanies());
          handlers.companies = setCompanies;
        }

        // 🔄 Run everything in parallel
        const results = await Promise.all(promises);

        // 🧩 Apply results in order
        let i = 0;
        if (handlers.blog) handlers.blog(results[i++]); // blogs
        if (handlers.jobs) handlers.jobs(results[i++]); // jobs

        if (role === "ADMIN") {
          if (handlers.seekers) handlers.seekers(results[i++]);
          if (handlers.companies) handlers.companies(results[i++]);
        }

        if (role === "SEEKER" && handlers.companies) {
          handlers.companies(results[i++]);
        }
      } catch (err) {
        console.error("⚠️ Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser, currentUserRole]);

  const handleLogin = async (
    email: string,
    password: string,
    role: UserRole
  ) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      // Step 1: Authenticate and store token

      await api.authenticateUser(email, password, role);

      // Step 2: Get user profile from backend
      const userProfile = await api.getUserProfile();
      console.log(userProfile, userProfile.user, userProfile.user.role);

      if (userProfile && userProfile.user) {
        setCurrentUser(userProfile.user);
        setCurrentUserRole(userProfile.user.role); // role from backend
        setActiveView("dashboard");
        showToast.success(`Welcome back, ${userProfile.user.name || "User"}!`);
      } else {
        throw new Error("Invalid credentials or role.");
      }
    } catch (error: any) {
      setAuthError(error.response?.data?.msg || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout(); // clears token in service

    // ✅ Clear in React state
    setCurrentUser(null);
    setCurrentUserRole(null);

    // ✅ Clear token (safety)
    localStorage.removeItem("token");

    // ✅ Navigate cleanly to landing page
    setActiveView("home");
    showToast.info("Signed out successfully.");
  };

  const handleRegister = async (name: string, email: string, password: string, role: any) => {
    try {
      await api.registerUser(name, email, password, role);
      showToast.success("Account created successfully! Please sign in.");
      setActiveView("login");
    } catch (err: any) {
      setAuthError(err.response?.data?.msg || "Signup failed");
    }
  };

  const handleJobApplied = (jobId: string, seekerId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId
          ? {
              ...job,
              applicants: [...(job.applicants || []), seekerId],
            }
          : job
      )
    );
  };

  const handleSaveSeekerProfile = async (updatedSeeker: JobSeeker) => {
    try {
      const savedSeeker = await api.saveSeeker(updatedSeeker);

      // ✅ Update current user immediately
      setCurrentUser((prev) => ({ ...prev, ...savedSeeker }));

      // ✅ Update seekers list if applicable
      setSeekers((prev) =>
        prev.map((s) =>
          s.id === savedSeeker._id || s.id === savedSeeker.id ? savedSeeker : s
        )
      );

      alert("✅ Profile updated successfully!");
    } catch (err: any) {
      console.error("❌ Failed to update seeker profile:", err);
      alert(err?.response?.data?.msg || "Failed to update profile");
    }
  };
  const handleSaveCompanyProfile = async (updatedCompany: Employer) => {
    try {
      const savedCompany = await api.saveCompany(updatedCompany);

      // ✅ Update current user immediately
      setCurrentUser((prev) => ({ ...prev, ...savedCompany }));

      // ✅ Update companies list if applicable
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === savedCompany._id || c.id === savedCompany.id
            ? savedCompany
            : c
        )
      );

      alert("✅ Profile updated successfully!");
    } catch (err: any) {
      console.error("❌ Failed to update company profile:", err);
      alert(err?.response?.data?.msg || "Failed to update profile");
    }
  };

  const handleAddReview = async (
    companyId: string,
    review: Omit<Review, "id" | "date">
  ) => {
    const updatedCompany = await api.addReview(companyId, review);
    setCompanies(
      companies.map((c) => (c.id === companyId ? updatedCompany : c))
    );

    // Automatically create a blog post from the review
    if (currentUser && currentUserRole === "SEEKER") {
      const seeker = currentUser as JobSeeker;
      const employer = companies.find((c) => c.id === companyId);
      if (employer) {
        const content = `New review for ${
          employer.name
        }!\n\nI gave them a ${"★".repeat(review.rating)}${"☆".repeat(
          5 - review.rating
        )} rating.\n\nMy thoughts: "${review.comment}"`;

        const newPostData: Omit<
          BlogPost,
          "id" | "timestamp" | "reactions" | "comments"
        > = {
          authorId: seeker.id,
          authorName: seeker.name,
          authorRole: "SEEKER",
          authorPhotoUrl: seeker.photoUrl,
          content,
        };
        const savedPost = await api.addBlogPost(newPostData);
        setBlogPosts((prev) => [savedPost, ...prev]);

        // Show notification
        setNotification(
          `Your review for ${employer.name} is now live on the blog!`
        );
      }
    }
  };

  const handleCompanySaveJob = (newJob: Job) => {
    // Just update the jobs state with the new job or replace updated job
    setJobs((prev) => {
      const targetId = (newJob as any)._id || newJob.id;
      const exists = prev.some((j) => ((j as any)._id || j.id) === targetId);
      if (exists) {
        return prev.map((j) => (((j as any)._id || j.id) === targetId ? newJob : j));
      }
      return [newJob, ...prev];
    });

    setNotification("Job saved successfully!");
  };

  const handleAdminDelete = async (
    type: "job" | "employer" | "seeker" | "blogPost",
    id: string
  ) => {
    if (await api.deleteEntity(type, id)) {
      if (type === "job") setJobs((prev) => prev.filter((j) => ((j as any)._id || j.id) !== id));
      if (type === "seeker") setSeekers((prev) => prev.filter((s) => ((s as any)._id || s.id) !== id));
      if (type === "employer") {
        setCompanies((prev) => prev.filter((c) => ((c as any)._id || c.id) !== id));
        // Also remove jobs associated with that employer
        setJobs((prev) => prev.filter((j) => j.companyId !== id));
      }
      if (type === "blogPost")
        setBlogPosts((prev) => prev.filter((p) => ((p as any)._id || p.id) !== id));
    }
  };

  const handleAdminSaveSeeker = async (seeker: JobSeeker) => {
    const savedSeeker = await api.saveSeeker(seeker);
    if (seekers.some((s) => s.id === savedSeeker.id)) {
      setSeekers(
        seekers.map((s) => (s.id === savedSeeker.id ? savedSeeker : s))
      );
    } else {
      setSeekers([...seekers, savedSeeker]);
    }
  };

  const handleAdminSaveCompany = async (employer: Employer) => {
    const savedCompany = await api.saveCompany(employer);
    if (companies.some((c) => c.id === savedCompany.id)) {
      setCompanies(
        companies.map((c) => (c.id === savedCompany.id ? savedCompany : c))
      );
    } else {
      setCompanies([...companies, savedCompany]);
    }
  };

  const handleAdminSaveJob = async (
    job: Job | Omit<Job, "id" | "applicants" | "shortlisted" | "rejected">
  ) => {
    const savedJob = await api.saveJob(job);
    if (jobs.some((j) => j.id === savedJob.id)) {
      setJobs(jobs.map((j) => (j.id === savedJob.id ? savedJob : j)));
    } else {
      setJobs([savedJob, ...jobs]);
    }
  };

  const handleAddBlogPost = async (content: string) => {
    const savedPost = await api.addBlogPost(content);
    setBlogPosts((prev) => [normalizeBlog(savedPost), ...prev]);
  };

  const handleUpdateBlogPost = async (postId: string, content: string) => {
    const updatedPost = await api.updateBlogPost(postId, content);
    setBlogPosts((posts) =>
      posts.map((p) => (p.id === postId ? normalizeBlog(updatedPost) : p))
    );
  };

  const handleDeleteBlogPost = async (postId: string) => {
    if (await api.deleteEntity("blogPost", postId)) {
      setBlogPosts((posts) => posts.filter((p) => p.id !== postId));
    }
  };

  const handlePostReaction = async (
    postId: string,
    reactionType: ReactionType
  ) => {
    const reactions = await api.addOrUpdateReaction(postId, reactionType);

    setBlogPosts((posts) =>
      posts.map((p) => (p.id === postId ? { ...p, reactions } : p))
    );
  };

  const handleAddComment = async (postId: string, content: string) => {
    const comments = await api.addComment(postId, content);

    setBlogPosts((posts) =>
      posts.map((p) => (p.id === postId ? { ...p, comments } : p))
    );
  };

  const handleUpdateComment = async (
  postId: string,
  commentId: string,
  content: string
) => {
  const res = await api.updateComment(postId, commentId, content);
  const updatedComment = res.comment;

  setBlogPosts((posts) =>
    posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.map((c) =>
              c.id === commentId ? { ...c, ...updatedComment } : c
            ),
          }
        : post
    )
  );
};


  const handleDeleteComment = async (
  postId: string,
  commentId: string
) => {
  await api.deleteComment(postId, commentId);

  setBlogPosts((posts) =>
    posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.filter((c) => c.id !== commentId),
          }
        : post
    )
  );
};


  if (isLoading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-primary">
        Loading Job Executive...
      </div>
    );
  }

  if (activeView === "login") {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Toaster />
        <Navbar
          currentUser={currentUser}
          currentUserRole={currentUserRole}
          onLoginClick={() => setActiveView("login")}
          onSignupClick={() => setActiveView("signup")}
          onLogoutClick={handleLogout}
          onNavigateView={(view) => setActiveView(view)}
          currentView="login"
        />
        <div className="pt-24 pb-12 flex flex-col items-center justify-center">
          <LoginPage
            onLogin={handleLogin}
            error={authError}
            onSwitchToSignup={() => setActiveView("signup")}
          />
        </div>
      </div>
    );
  }

  if (activeView === "signup") {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Toaster />
        <Navbar
          currentUser={currentUser}
          currentUserRole={currentUserRole}
          onLoginClick={() => setActiveView("login")}
          onSignupClick={() => setActiveView("signup")}
          onLogoutClick={handleLogout}
          onNavigateView={(view) => setActiveView(view)}
          currentView="signup"
        />
        <div className="pt-24 pb-12 flex flex-col items-center justify-center">
          <SignupPage
            onRegister={handleRegister}
            error={authError}
            onSwitchToLogin={() => setActiveView("login")}
          />
        </div>
      </div>
    );
  }

  if (activeView === "home" || (!currentUser && activeView !== "blog")) {
    return (
      <>
        <Toaster />
        <LandingPage
          currentUser={currentUser}
          currentUserRole={currentUserRole}
          jobs={jobs}
          companies={companies}
          seekers={seekers}
          onLoginClick={() => setActiveView("login")}
          onSignupClick={() => setActiveView("signup")}
          onLogoutClick={handleLogout}
          onNavigateView={(view) => {
            if (view === "dashboard") {
              if (currentUser) setActiveView("dashboard");
              else setActiveView("login");
            } else {
              setActiveView(view);
            }
          }}
          onSearch={(filters) => {
            setSearchFilters(filters);
            setActiveView("jobs");
          }}
          onViewJob={(job) => setSelectedLandingJob(job)}
        />

        {/* Selected Job Details Modal from Landing Page */}
        {selectedLandingJob && (
          <Modal
            isOpen={!!selectedLandingJob}
            onClose={() => setSelectedLandingJob(null)}
            title={`Job Details - ${selectedLandingJob.title}`}
          >
            <JobDetails
              job={selectedLandingJob}
              employer={
                companies.find(
                  (c) =>
                    c.id === selectedLandingJob.companyId ||
                    (c as any)._id === selectedLandingJob.companyId
                ) || {
                  id: selectedLandingJob.companyId,
                  name: "Company",
                  email: "",
                  logo: "https://via.placeholder.com/100",
                  description: "",
                  website: "",
                  contactInfo: "",
                  officeAddress: "",
                  reviews: [],
                  jobs: [],
                }
              }
              onApply={async (jobId) => {
                if (currentUser && currentUserRole === "SEEKER") {
                  try {
                    await api.applyJob(jobId);
                    handleJobApplied(jobId, currentUser.id);
                    showToast.success("Application submitted successfully!");
                    setSelectedLandingJob(null);
                  } catch (err: any) {
                    showToast.error(err.response?.data?.msg || "Failed to apply");
                  }
                } else {
                  showToast.info("Please sign in as a Job Seeker to apply.");
                  setSelectedLandingJob(null);
                  setActiveView("login");
                }
              }}
              isApplied={
                currentUserRole === "SEEKER" &&
                ((currentUser as JobSeeker)?.appliedJobs || []).includes(
                  selectedLandingJob.id || (selectedLandingJob as any)._id
                )
              }
              userRole={currentUserRole || "SEEKER"}
              onLeaveReview={(companyId) => {
                if (currentUser && currentUserRole === "SEEKER") {
                  setActiveView("dashboard");
                } else {
                  showToast.info("Please sign in to leave a review.");
                  setActiveView("login");
                }
              }}
            />
          </Modal>
        )}
      </>
    );
  }

  const renderDashboard = () => {
    switch (currentUserRole) {
      case "SEEKER":
        return (
          <SeekerDashboard
            seeker={currentUser as JobSeeker}
            jobs={jobs}
            companies={companies}
            onAddReview={handleAddReview}
            onSaveProfile={handleSaveSeekerProfile}
            onJobApplied={handleJobApplied}
          />
        );
      case "EMPLOYER":
        return (
          <CompanyDashboard
            employer={currentUser as Employer}
            jobs={jobs}
            seekers={seekers}
            onSaveProfile={handleSaveCompanyProfile}
            onSaveJob={handleCompanySaveJob}
            onDeleteJob={async (jobId) => {
              await api.deleteJob(jobId);
              setJobs((prev) => prev.filter((j) => ((j as any)._id || j.id) !== jobId));
            }}
          />
        );
      case "ADMIN":
        return (
          <AdminDashboard
            jobs={jobs}
            employers={companies}
            seekers={seekers}
            onDelete={handleAdminDelete}
            onSaveSeeker={handleAdminSaveSeeker}
            onSaveCompany={handleAdminSaveCompany}
            onSaveJob={handleAdminSaveJob}
          />
        );
      default:
        return <LoginPage onLogin={handleLogin} error={authError} />;
    }
  };

  let currentUserName = "ADMIN";
  let currentUserPhoto = `https://i.pravatar.cc/150?u=admin`;
  if (currentUserRole === "SEEKER") {
    currentUserName = (currentUser as JobSeeker).name;
    currentUserPhoto = (currentUser as JobSeeker).photoUrl;
  } else if (currentUserRole === "EMPLOYER") {
    currentUserName = (currentUser as Employer).name;
    currentUserPhoto = (currentUser as Employer).logo;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Toaster />
      <Navbar
        currentUser={currentUser}
        currentUserRole={currentUserRole}
        onLoginClick={() => setActiveView("login")}
        onSignupClick={() => setActiveView("signup")}
        onLogoutClick={handleLogout}
        onNavigateView={(view) => setActiveView(view)}
        currentView={activeView}
      />

      <div className="pt-20">
        {notification && (
          <Notification
            message={notification}
            onClose={() => setNotification(null)}
          />
        )}

        {activeView === "dashboard" ? (
          renderDashboard()
        ) : activeView === "jobs" ? (
          <JobsExplorePage
            jobs={jobs}
            companies={companies}
            onApply={async (jobId) => {
              if (currentUser && currentUserRole === "SEEKER") {
                try {
                  await api.applyJob(jobId);
                  handleJobApplied(jobId, currentUser.id);
                  showToast.success("Application submitted successfully!");
                } catch (err: any) {
                  showToast.error(err.response?.data?.msg || "Failed to apply");
                }
              } else {
                showToast.info("Please sign in as a Job Seeker to apply.");
                setActiveView("login");
              }
            }}
            onViewDetails={(jobId) => {
              const j = jobs.find((item) => (item._id || item.id) === jobId);
              if (j) setSelectedLandingJob(j);
            }}
            appliedJobIds={
              currentUserRole === "SEEKER"
                ? ((currentUser as JobSeeker)?.appliedJobs || [])
                : []
            }
            userRole={currentUserRole}
            initialFilters={searchFilters}
          />
        ) : activeView === "companies" ? (
          <CompaniesPage
            companies={companies}
            jobs={jobs}
            onSelectCompany={(company) => {
              setSearchFilters({ query: company.name });
              setActiveView("jobs");
            }}
            onExploreJobsForCompany={(companyName) => {
              setSearchFilters({ query: companyName });
              setActiveView("jobs");
            }}
          />
        ) : (
          <BlogPage
            posts={blogPosts}
            onAddPost={handleAddBlogPost}
            onUpdatePost={handleUpdateBlogPost}
            onDeletePost={handleDeleteBlogPost}
            onPostReaction={handlePostReaction}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            currentUserId={currentUser?.id || ""}
            currentUserRole={currentUserRole || "SEEKER"}
            currentUserName={currentUserName}
            currentUserPhoto={currentUserPhoto}
          />
        )}

        {/* Global Selected Job Details Modal */}
        {selectedLandingJob && (
          <Modal
            isOpen={!!selectedLandingJob}
            onClose={() => setSelectedLandingJob(null)}
            title={`Job Details - ${selectedLandingJob.title}`}
          >
            <JobDetails
              job={selectedLandingJob}
              employer={
                companies.find(
                  (c) =>
                    c.id === selectedLandingJob.companyId ||
                    (c as any)._id === selectedLandingJob.companyId
                ) || {
                  id: selectedLandingJob.companyId,
                  name: "Company",
                  email: "",
                  logo: "https://via.placeholder.com/100",
                  description: "",
                  website: "",
                  contactInfo: "",
                  officeAddress: "",
                  reviews: [],
                  jobs: [],
                }
              }
              onApply={async (jobId) => {
                if (currentUser && currentUserRole === "SEEKER") {
                  try {
                    await api.applyJob(jobId);
                    handleJobApplied(jobId, currentUser.id);
                    showToast.success("Application submitted successfully!");
                    setSelectedLandingJob(null);
                  } catch (err: any) {
                    showToast.error(err.response?.data?.msg || "Failed to apply");
                  }
                } else {
                  showToast.info("Please sign in as a Job Seeker to apply.");
                  setSelectedLandingJob(null);
                  setActiveView("login");
                }
              }}
              isApplied={
                currentUserRole === "SEEKER" &&
                ((currentUser as JobSeeker)?.appliedJobs || []).includes(
                  selectedLandingJob.id || (selectedLandingJob as any)._id
                )
              }
              userRole={currentUserRole || "SEEKER"}
              onLeaveReview={(companyId) => {
                if (currentUser && currentUserRole === "SEEKER") {
                  setActiveView("dashboard");
                } else {
                  showToast.info("Please sign in to leave a review.");
                  setActiveView("login");
                }
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

const NavButton = ({
  isActive,
  onClick,
  children,
  icon,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }`}
    aria-current={isActive ? "page" : undefined}
  >
    {icon}
    {children}
  </button>
);

export default App;
