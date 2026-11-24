import React, { useState, useEffect } from "react";
import { Employer, Job, JobSeeker } from "../types";
import CompanyProfileEdit from "./CompanyProfileEdit";
import PostJobForm from "./PostJobForm";
import * as api from "../services/apiService";
import {
  Briefcase,
  PlusCircle,
  Users,
  Building2,
  Globe,
  MapPin,
  Mail,
  Trash2,
  Edit3,
  ExternalLink,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  FileText,
  Search,
} from "lucide-react";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
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

interface CompanyDashboardProps {
  employer: Employer;
  jobs: Job[];
  seekers: JobSeeker[];
  onSaveProfile: (updatedCompany: Employer) => void;
  onSaveJob: (job: Omit<Job, "id" | "applicants" | "shortlisted" | "rejected">) => void;
  onDeleteJob?: (jobId: string) => void;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  employer,
  jobs,
  seekers,
  onSaveProfile,
  onSaveJob,
  onDeleteJob,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [viewingApplicantsForJob, setViewingApplicantsForJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [applicantFilterStatus, setApplicantFilterStatus] = useState<string>("ALL");

  // Handle Profile Save
  const handleSaveProfile = async (updatedCompany: Employer) => {
    try {
      await onSaveProfile(updatedCompany);
      showToast.success("Company profile updated successfully!");
      setIsEditModalOpen(false);
    } catch {
      showToast.error("Failed to update company profile");
    }
  };

  // Handle Job Creation or Edit
  const handleSaveJob = async (
    jobData: any
  ) => {
    try {
      if (jobToEdit) {
        // If editing
        const updated = await api.createJob(jobData);
        onSaveJob(updated);
        showToast.success("Job updated successfully!");
      } else {
        const newJob = await api.createJob(jobData);
        onSaveJob(newJob);
        showToast.success("New job posted successfully!");
      }
      setIsPostJobModalOpen(false);
      setJobToEdit(null);
    } catch (err: any) {
      showToast.error(err?.response?.data?.msg || "Failed to save job");
    }
  };

  // Handle Job Deletion
  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    const targetId = jobToDelete._id || jobToDelete.id;

    try {
      if (onDeleteJob) {
        await onDeleteJob(targetId);
      } else {
        await api.deleteJob(targetId);
      }
      showToast.success("Job posting deleted");
      setJobToDelete(null);
    } catch (err: any) {
      showToast.error(err?.response?.data?.msg || "Failed to delete job");
    }
  };

  // View Applicants for a Job
  const handleViewApplicants = async (job: Job) => {
    setIsLoadingApplicants(true);
    setViewingApplicantsForJob(job);
    try {
      const data = await api.getApplicants(job._id || job.id);
      setApplicants(data || []);
    } catch (err) {
      showToast.error("Failed to load applicants for this position");
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  // Update Applicant Status
  const handleUpdateStatus = async (applicationId: string, status: string) => {
    try {
      await api.updateApplicantStatus(applicationId, status);
      showToast.success(`Candidate status updated to ${status}`);
      // Refresh applicant list
      if (viewingApplicantsForJob) {
        const data = await api.getApplicants(
          viewingApplicantsForJob._id || viewingApplicantsForJob.id
        );
        setApplicants(data || []);
      }
    } catch {
      showToast.error("Failed to update candidate status");
    }
  };

  // Filter jobs belonging to this employer
  const companyJobs = jobs.filter(
    (job) =>
      job.companyId === employer.id ||
      job.companyId === employer._id ||
      (job as any).companyId?._id === employer._id
  );

  // Calculate aggregates
  const totalApplicantsCount = companyJobs.reduce(
    (acc, job) => acc + (job.applicants?.length || 0),
    0
  );

  if (!employer || !employer.name) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-slate-500">
        Loading organization workspace...
      </div>
    );
  }

  // Filter applicants by status
  const displayedApplicants =
    applicantFilterStatus === "ALL"
      ? applicants
      : applicants.filter((a) => (a.status || "APPLIED") === applicantFilterStatus);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Employer Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(108,92,231,0.25),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={
                employer.logo ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                  employer.name
                )}`
              }
              alt={employer.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/10 bg-white shadow-lg"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {employer.name}
                </h1>
                <Badge variant="secondary" className="bg-white/10 text-violet-200 border-white/10">
                  Employer
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                {employer.website && (
                  <a
                    href={employer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {employer.website.replace(/^https?:\/\//, "")}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {employer.officeAddress && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {employer.officeAddress}
                  </span>
                )}
                {employer.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {employer.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </Button>
            <Button
              onClick={() => {
                setJobToEdit(null);
                setIsPostJobModalOpen(true);
              }}
              className="bg-primary hover:bg-primary-focus text-white text-xs gap-1.5 shadow-lg shadow-violet-500/25"
            >
              <PlusCircle className="w-4 h-4" />
              Post New Job
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Postings"
          value={companyJobs.length}
          description="Live open listings"
          icon={<Briefcase className="w-5 h-5 text-primary" />}
        />
        <StatCard
          title="Total Candidates"
          value={totalApplicantsCount}
          description="Across all postings"
          icon={<Users className="w-5 h-5 text-cyan-600" />}
        />
        <StatCard
          title="Reviews Received"
          value={employer.reviews?.length || 0}
          description="Public talent feedback"
          icon={<Star className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Recruitment Speed"
          value="98%"
          description="Candidate response rate"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Main Content: Postings List & Candidate Tracker */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Manage Job Postings ({companyJobs.length})
            </h2>
            <p className="text-xs text-slate-500">
              Review active opportunities, track candidate submissions, or create new listings.
            </p>
          </div>
          <Button
            onClick={() => {
              setJobToEdit(null);
              setIsPostJobModalOpen(true);
            }}
            size="sm"
            className="self-start sm:self-auto gap-1.5 text-xs"
          >
            <PlusCircle className="w-4 h-4" /> Post Another Position
          </Button>
        </div>

        {companyJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {companyJobs.map((job) => {
              const jobId = job._id || job.id;
              const applicantCount = job.applicants?.length || 0;

              return (
                <div
                  key={jobId}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                      <Badge variant="outline" className="text-xs font-semibold">
                        {job.jobType}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {job.locationType}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span>
                        ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k / yr
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-primary">
                        {job.experienceLevel}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Applicant Badge */}
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplicants(job)}
                      className="text-xs font-semibold gap-1.5 h-9"
                    >
                      <Users className="w-3.5 h-3.5 text-primary" />
                      View Applicants ({applicantCount})
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setJobToEdit(job);
                        setIsPostJobModalOpen(true);
                      }}
                      className="text-xs h-9 text-slate-600 hover:text-slate-900"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setJobToDelete(job)}
                      className="text-xs h-9 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Active Job Postings"
            description="You haven't posted any jobs yet. Create your first opening to attract high-caliber candidates."
            actionLabel="Post Your First Job"
            onAction={() => {
              setJobToEdit(null);
              setIsPostJobModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Edit Organization Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Organization Profile"
      >
        <CompanyProfileEdit
          employer={employer}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Post or Edit Job Modal */}
      <Modal
        isOpen={isPostJobModalOpen}
        onClose={() => {
          setIsPostJobModalOpen(false);
          setJobToEdit(null);
        }}
        title={jobToEdit ? `Edit Job - ${jobToEdit.title}` : "Post a New Opportunity"}
      >
        <PostJobForm
          companyId={employer.id || employer._id}
          jobToEdit={jobToEdit}
          onSave={handleSaveJob}
          onCancel={() => {
            setIsPostJobModalOpen(false);
            setJobToEdit(null);
          }}
        />
      </Modal>

      {/* Applicants Management Modal */}
      {viewingApplicantsForJob && (
        <Modal
          isOpen={!!viewingApplicantsForJob}
          onClose={() => setViewingApplicantsForJob(null)}
          title={`Applicants for ${viewingApplicantsForJob.title}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            {/* Status Filter Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {applicants.length} Total Candidate Submissions
              </span>
              <div className="flex gap-1.5">
                {["ALL", "APPLIED", "SHORTLISTED", "HIRED", "REJECTED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setApplicantFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      applicantFilterStatus === st
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {isLoadingApplicants ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Loading applicant records...
              </div>
            ) : displayedApplicants.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {displayedApplicants.map((app) => {
                  const seeker = app.seekerId || {};
                  const currentStatus = (app.status || "APPLIED").toUpperCase();

                  const statusBadges: Record<string, string> = {
                    APPLIED: "bg-amber-50 text-amber-700 border-amber-200",
                    SHORTLISTED: "bg-violet-50 text-violet-700 border-violet-200",
                    HIRED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
                  };

                  return (
                    <div
                      key={app._id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={
                            seeker.photoUrl ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                              seeker.name || "applicant"
                            )}`
                          }
                          alt={seeker.name || "Candidate"}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 bg-slate-100"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">
                              {seeker.name || "Anonymous Candidate"}
                            </h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                statusBadges[currentStatus] ||
                                "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              {currentStatus}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{seeker.email}</p>
                          {seeker.phone && (
                            <p className="text-xs text-slate-400">{seeker.phone}</p>
                          )}

                          {/* Resume Link */}
                          {seeker.resumeUrl ? (
                            <a
                              href={seeker.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View Submitted Resume
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic mt-1 block">
                              No resume attached
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app._id, "SHORTLISTED")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 transition-colors"
                        >
                          <Star className="w-3 h-3 text-violet-600" />
                          Shortlist
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app._id, "HIRED")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Hire
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app._id, "REJECTED")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                        >
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No applicants found under the &quot;{applicantFilterStatus}&quot; status filter.
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Job Confirmation Modal */}
      <Modal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        title="Confirm Job Removal"
      >
        {jobToDelete && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to permanently remove the position{" "}
              <strong className="text-slate-900">&ldquo;{jobToDelete.title}&rdquo;</strong>?
              This will remove all associated candidate links.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setJobToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteJob}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete Position
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default CompanyDashboard;
