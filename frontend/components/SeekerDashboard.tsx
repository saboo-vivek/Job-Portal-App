import React, { useState, useMemo, useEffect } from "react";
import { Job, Employer, JobSeeker, Review, JobType } from "../types";
import JobCard from "./JobCard";
import JobDetails from "./JobDetails";
import ResumeBooster from "./ResumeBooster";
import LeaveReviewForm from "./LeaveReviewForm";
import JobSeekerProfileEdit from "./JobSeekerProfileEdit";
import JobAlertsManager from "./JobAlertsManager";
import * as api from "../services/apiService";
import {
  Briefcase,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
  Sparkles,
  Bell,
  SlidersHorizontal,
  ExternalLink,
  Edit3,
  Calendar,
  Building2,
  UserCheck,
} from "lucide-react";
import {
  Button,
  Badge,
  Card,
  CardContent,
  Modal,
  StatCard,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
  showToast,
} from "./ui";

interface SeekerDashboardProps {
  seeker: JobSeeker;
  jobs: Job[];
  companies: Employer[];
  onAddReview: (companyId: string, review: Omit<Review, "id" | "date" | "authorId">) => void;
  onSaveProfile: (updatedSeeker: JobSeeker) => void;
  onJobApplied?: (jobId: string, seekerId: string) => void;
}

const SeekerDashboard: React.FC<SeekerDashboardProps> = ({
  seeker,
  jobs,
  companies,
  onAddReview,
  onSaveProfile,
  onJobApplied,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>(seeker.appliedJobs || []);
  const [applications, setApplications] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingCompany, setReviewingCompany] = useState<Employer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  // Load applications on mount
  useEffect(() => {
    const loadApps = async () => {
      try {
        const apps = await api.getMyApplications();
        if (apps && Array.isArray(apps)) {
          setApplications(apps);
          setAppliedJobs(apps.map((app) => app.jobId?._id || app.jobId));
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    };
    loadApps();
  }, []);

  // Compute profile completeness
  const profileCompletion = useMemo(() => {
    let score = 0;
    if (seeker.name && seeker.name.trim()) score += 20;
    if (seeker.email && seeker.email.trim()) score += 20;
    if (seeker.phone && seeker.phone.trim()) score += 20;
    if (seeker.skills && seeker.skills.length > 0) score += 20;
    if (seeker.resumeUrl && seeker.resumeUrl.trim()) score += 20;
    return score;
  }, [seeker]);

  // Handle Apply
  const handleApply = async (jobId: string) => {
    setAppliedJobs((prev) => [...prev, jobId]);
    try {
      await api.applyJob(jobId);
      const updatedApps = await api.getMyApplications();
      setApplications(updatedApps);
      const appliedIds = updatedApps.map((app: any) => app.jobId?._id || app.jobId);
      setAppliedJobs(appliedIds);
      onSaveProfile({ ...seeker, appliedJobs: appliedIds });
      onJobApplied?.(jobId, seeker._id || seeker.id);
      showToast.success("Application submitted successfully!");
    } catch (err: any) {
      console.error("Error applying to job:", err);
      setAppliedJobs((prev) => prev.filter((id) => id !== jobId));
      showToast.error(err.response?.data?.msg || "Failed to submit application");
    }
  };

  const handleLeaveReview = (companyId: string) => {
    const companyToReview = companies.find(
      (c) => c.id === companyId || c._id === companyId
    );
    if (companyToReview) {
      setSelectedJobId(null);
      setReviewingCompany(companyToReview);
      setIsReviewModalOpen(true);
    }
  };

  const handleSubmitReview = (review: Omit<Review, "id" | "date" | "authorId">) => {
    if (reviewingCompany) {
      onAddReview(reviewingCompany.id || reviewingCompany._id, {
        ...review,
        reviewerName: seeker.name || "Candidate",
      });
      setIsReviewModalOpen(false);
      setReviewingCompany(null);
    }
  };

  const handleSaveProfile = (updatedSeeker: JobSeeker) => {
    onSaveProfile(updatedSeeker);
    setIsEditModalOpen(false);
  };

  // Filtered Jobs for Discovery Tab
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const company = companies.find(
        (c) => c.id === job.companyId || c._id === job.companyId
      );
      if (!company) return false;

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        q === "" ||
        job.title.toLowerCase().includes(q) ||
        company.name.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);

      const matchesType = !selectedJobType || job.jobType === selectedJobType;
      const matchesExp = !selectedExperience || job.experienceLevel === selectedExperience;

      return matchesQuery && matchesType && matchesExp;
    });
  }, [jobs, companies, searchQuery, selectedJobType, selectedExperience]);

  const selectedJob = jobs.find((j) => (j._id || j.id) === selectedJobId);
  const selectedJobCompany = selectedJob
    ? companies.find((c) => c.id === selectedJob.companyId || c._id === selectedJob.companyId)
    : null;

  // Status Counts
  const pendingCount = applications.filter(
    (a) => !a.status || a.status === "APPLIED" || a.status === "PENDING"
  ).length;
  const shortlistedCount = applications.filter((a) => a.status === "SHORTLISTED").length;
  const hiredCount = applications.filter((a) => a.status === "HIRED").length;
  const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(108,92,231,0.25),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={
                  seeker.photoUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    seeker.name || "candidate"
                  )}`
                }
                alt={seeker.name || "Profile"}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/10 bg-slate-800 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Welcome back, {seeker.name || "Candidate"}!
                </h1>
                <Badge variant="secondary" className="bg-white/10 text-violet-200 border-white/10">
                  Job Seeker
                </Badge>
              </div>
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <span>{seeker.email}</span>
                {seeker.phone && (
                  <>
                    <span>•</span>
                    <span>{seeker.phone}</span>
                  </>
                )}
              </p>
              {seeker.skills && seeker.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {seeker.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/10 text-slate-200 border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                  {seeker.skills.length > 4 && (
                    <span className="text-[11px] text-slate-400 self-center">
                      +{seeker.skills.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Profile Strength & Edit Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="space-y-1 min-w-[140px]">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Profile Strength</span>
                <span className="text-violet-300 font-bold">{profileCompletion}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 text-xs shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={applications.length}
          description="Submitted job applications"
          icon={<Briefcase className="w-5 h-5 text-primary" />}
        />
        <StatCard
          title="In Review"
          value={pendingCount}
          description="Awaiting employer decision"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Shortlisted"
          value={shortlistedCount}
          description="Interview or stage passed"
          icon={<Award className="w-5 h-5 text-violet-600" />}
        />
        <StatCard
          title="Offers & Hires"
          value={hiredCount}
          description="Successful placements"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Segmented Dashboard Tabs */}
      <Tabs defaultValue="explore" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-full sm:w-auto grid grid-cols-4 sm:inline-flex border border-slate-200">
          <TabsTrigger value="explore" className="text-xs sm:text-sm font-semibold">
            Explore Jobs ({filteredJobs.length})
          </TabsTrigger>
          <TabsTrigger value="applications" className="text-xs sm:text-sm font-semibold">
            My Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="ai-assistant" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            AI Resume Booster
          </TabsTrigger>
          <TabsTrigger value="preferences" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-primary" />
            Job Alerts
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Explore Jobs */}
        <TabsContent value="explore" className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, company name, or location..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Employment Types</option>
                {Object.values(JobType).map((jt) => (
                  <option key={jt} value={jt}>
                    {jt}
                  </option>
                ))}
              </select>

              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Experience</option>
                <option value="Entry-Level">Entry-Level</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead / Staff">Lead / Staff</option>
                <option value="Executive">Executive</option>
              </select>

              {(searchQuery || selectedJobType || selectedExperience) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedJobType("");
                    setSelectedExperience("");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Job Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJobs.map((job) => {
                const company = companies.find(
                  (c) => c.id === job.companyId || c._id === job.companyId
                );
                if (!company) return null;
                const matchedApp = applications.find(
                  (a) => a.jobId?._id === job._id || a.jobId === job._id
                );

                return (
                  <JobCard
                    key={job._id || job.id}
                    job={job}
                    employer={company}
                    onApply={handleApply}
                    onViewDetails={(id) => setSelectedJobId(id)}
                    isApplied={appliedJobs.includes(job._id || job.id)}
                    status={matchedApp?.status || null}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No Matching Positions"
              description="No open jobs match your current filter parameters. Try broadening your keywords."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setSelectedJobType("");
                setSelectedExperience("");
              }}
            />
          )}
        </TabsContent>

        {/* Tab 2: My Applications */}
        <TabsContent value="applications">
          {applications.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-card">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="py-3.5 px-4">Position & Organization</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Workplace Type</th>
                      <th className="py-3.5 px-4">Application Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => {
                      const job = app.jobId || {};
                      const company = companies.find(
                        (c) => c.id === job.companyId || c._id === job.companyId
                      );

                      const statusColors: Record<string, string> = {
                        APPLIED: "bg-amber-50 text-amber-700 border-amber-200",
                        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
                        SHORTLISTED: "bg-violet-50 text-violet-700 border-violet-200",
                        HIRED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                        REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
                      };

                      const currentStatus = (app.status || "APPLIED").toUpperCase();

                      return (
                        <tr
                          key={app._id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  company?.logo ||
                                  `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                                    company?.name || "company"
                                  )}`
                                }
                                alt={company?.name || "Company"}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white"
                              />
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {job.title || "Job Opportunity"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {company?.name || "Leading Enterprise"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-xs font-medium text-slate-700">
                            {job.location || "Remote"}
                          </td>

                          <td className="py-4 px-4 text-xs">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                              {job.locationType || "Full-Time"}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                statusColors[currentStatus] ||
                                "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              {currentStatus}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {job._id && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedJobId(job._id)}
                                  className="text-xs h-8"
                                >
                                  View Job
                                </Button>
                              )}
                              {company && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLeaveReview(company.id || company._id)}
                                  className="text-xs h-8 text-primary hover:text-primary-focus"
                                >
                                  Review
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No Tracked Applications Yet"
              description="Browse open roles in the 'Explore Jobs' tab and apply directly with 1-click."
              actionLabel="Explore Available Roles"
              onAction={() => {}}
            />
          )}
        </TabsContent>

        {/* Tab 3: AI Resume Booster */}
        <TabsContent value="ai-assistant">
          <div className="max-w-2xl mx-auto">
            <ResumeBooster />
          </div>
        </TabsContent>

        {/* Tab 4: Preferences & Alerts */}
        <TabsContent value="preferences">
          <div className="max-w-2xl mx-auto">
            <JobAlertsManager seeker={seeker} onSave={onSaveProfile} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Job Details Modal */}
      {selectedJob && selectedJobCompany && (
        <Modal
          isOpen={!!selectedJobId}
          onClose={() => setSelectedJobId(null)}
          title={`Job Details - ${selectedJob.title}`}
        >
          <JobDetails
            job={selectedJob}
            employer={selectedJobCompany}
            onApply={handleApply}
            isApplied={appliedJobs.includes(selectedJob._id || selectedJob.id)}
            userRole="SEEKER"
            onLeaveReview={handleLeaveReview}
          />
        </Modal>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Candidate Profile"
      >
        <JobSeekerProfileEdit
          seeker={seeker}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Leave Review Modal */}
      {reviewingCompany && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setReviewingCompany(null);
          }}
          title={`Review ${reviewingCompany.name}`}
        >
          <LeaveReviewForm
            companyName={reviewingCompany.name}
            onSubmit={handleSubmitReview}
            onCancel={() => {
              setIsReviewModalOpen(false);
              setReviewingCompany(null);
            }}
          />
        </Modal>
      )}
    </main>
  );
};

export default SeekerDashboard;
