import React, { useState, useMemo } from "react";
import { Job, Employer, JobSeeker } from "../types";
import {
  Briefcase,
  Building2,
  Users,
  PlusCircle,
  Trash2,
  Edit3,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Mail,
  MapPin,
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
import JobSeekerProfileEdit from "./JobSeekerProfileEdit";
import CompanyProfileEdit from "./CompanyProfileEdit";
import PostJobForm from "./PostJobForm";

interface AdminDashboardProps {
  jobs: Job[];
  employers: Employer[];
  seekers: JobSeeker[];
  onDelete: (
    type: "job" | "employer" | "seeker" | "blogPost",
    id: string
  ) => void;
  onSaveSeeker: (seeker: JobSeeker) => void;
  onSaveCompany: (employer: Employer) => void;
  onSaveJob: (
    job: Job | Omit<Job, "id" | "applicants" | "shortlisted" | "rejected">
  ) => void;
}

const emptySeeker: JobSeeker = {
  id: "",
  name: "",
  email: "",
  password: "password123",
  phone: "",
  photoUrl: "",
  skills: [],
  resumeUrl: "",
  expectedSalary: 0,
  appliedJobs: [],
  jobAlertsEnabled: false,
  jobAlertsPreferences: {
    keywords: [],
    jobTypes: [],
    locationTypes: [],
    minSalary: 0,
  },
};

const emptyCompany: Employer = {
  id: "",
  name: "",
  email: "",
  password: "password123",
  logo: "",
  description: "",
  website: "",
  contactInfo: "",
  officeAddress: "",
  reviews: [],
  jobs: [],
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  jobs,
  employers,
  seekers,
  onDelete,
  onSaveSeeker,
  onSaveCompany,
  onSaveJob,
}) => {
  const [modalState, setModalState] = useState<{
    type: "job" | "employer" | "seeker" | null;
    item: any | null;
    mode: "add" | "edit" | null;
  }>({ type: null, item: null, mode: null });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "job" | "employer" | "seeker" | "blogPost";
    id: string;
    name: string;
  } | null>(null);

  // Search Queries for each tab
  const [jobSearch, setJobSearch] = useState("");
  const [employerSearch, setEmployerSearch] = useState("");
  const [seekerSearch, setSeekerSearch] = useState("");

  const openModal = (
    type: "job" | "employer" | "seeker",
    mode: "add" | "edit",
    item: any = null
  ) => {
    let modalItem = item;
    if (mode === "add") {
      if (type === "seeker") modalItem = emptySeeker;
      if (type === "employer") modalItem = emptyCompany;
      if (type === "job") modalItem = null;
    }
    setModalState({ type, item: modalItem, mode });
  };

  const closeModal = () =>
    setModalState({ type: null, item: null, mode: null });

  const openDeleteConfirm = (
    type: "job" | "employer" | "seeker",
    item: Job | Employer | JobSeeker
  ) => {
    const id = (item as any)._id || item.id;
    const name =
      type === "job"
        ? (item as Job).title
        : (item as Employer | JobSeeker).name;
    setDeleteConfirm({ type, id, name });
  };

  const closeDeleteConfirm = () => setDeleteConfirm(null);

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.type, deleteConfirm.id);
      showToast.success(`Deleted ${deleteConfirm.name}`);
      closeDeleteConfirm();
    }
  };

  // Filtered lists
  const filteredJobs = useMemo(() => {
    const q = jobSearch.toLowerCase().trim();
    if (!q) return jobs;
    return jobs.filter((j) => {
      const emp = employers.find(
        (e) => e.id === j.companyId || (e as any)._id === j.companyId
      );
      return (
        j.title.toLowerCase().includes(q) ||
        (emp && emp.name.toLowerCase().includes(q)) ||
        j.location.toLowerCase().includes(q)
      );
    });
  }, [jobs, employers, jobSearch]);

  const filteredEmployers = useMemo(() => {
    const q = employerSearch.toLowerCase().trim();
    if (!q) return employers;
    return employers.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.website && e.website.toLowerCase().includes(q))
    );
  }, [employers, employerSearch]);

  const filteredSeekers = useMemo(() => {
    const q = seekerSearch.toLowerCase().trim();
    if (!q) return seekers;
    return seekers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.skills && s.skills.some((sk) => sk.toLowerCase().includes(q)))
    );
  }, [seekers, seekerSearch]);

  const renderModalContent = () => {
    const { type, item } = modalState;
    if (!type) return null;

    switch (type) {
      case "seeker":
        return (
          <JobSeekerProfileEdit
            seeker={item || emptySeeker}
            onSave={(updated) => {
              onSaveSeeker(updated);
              closeModal();
            }}
            onCancel={closeModal}
          />
        );
      case "employer":
        return (
          <CompanyProfileEdit
            employer={item || emptyCompany}
            onSave={(updated) => {
              onSaveCompany(updated);
              closeModal();
            }}
            onCancel={closeModal}
          />
        );
      case "job":
        return (
          <PostJobForm
            onSave={(jobData) => {
              onSaveJob(jobData);
              closeModal();
            }}
            onCancel={closeModal}
            jobToEdit={item}
            companies={employers}
            employers={employers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(108,92,231,0.25),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Platform Administration Console
                </h1>
                <Badge variant="secondary" className="bg-white/10 text-violet-200 border-white/10">
                  Root Admin
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Full platform oversight, role management, listing moderation, and ecosystem analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Positions"
          value={jobs.length}
          description="Live database postings"
          icon={<Briefcase className="w-5 h-5 text-primary" />}
        />
        <StatCard
          title="Active Employers"
          value={employers.length}
          description="Verified hiring organizations"
          icon={<Building2 className="w-5 h-5 text-cyan-600" />}
        />
        <StatCard
          title="Job Seekers"
          value={seekers.length}
          description="Registered candidate profiles"
          icon={<Users className="w-5 h-5 text-violet-600" />}
        />
        <StatCard
          title="Platform Status"
          value="Healthy"
          description="All systems nominal"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Tabs for Moderation */}
      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-full sm:w-auto grid grid-cols-3 sm:inline-flex border border-slate-200">
          <TabsTrigger value="jobs" className="text-xs sm:text-sm font-semibold">
            Manage Jobs ({jobs.length})
          </TabsTrigger>
          <TabsTrigger value="employers" className="text-xs sm:text-sm font-semibold">
            Manage Employers ({employers.length})
          </TabsTrigger>
          <TabsTrigger value="seekers" className="text-xs sm:text-sm font-semibold">
            Manage Seekers ({seekers.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Jobs Moderation */}
        <TabsContent value="jobs" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Search jobs by title, company, location..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button
              onClick={() => openModal("job", "add")}
              size="sm"
              className="gap-1.5 text-xs self-start sm:self-auto shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Add New Job
            </Button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-card">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 uppercase font-semibold text-slate-500">
                <tr>
                  <th className="py-3 px-4">Title & Organization</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Salary Range</th>
                  <th className="py-3 px-4">Applicants</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => {
                    const emp = employers.find(
                      (c) => c.id === job.companyId || (c as any)._id === job.companyId
                    );
                    const jobId = (job as any)._id || job.id;

                    return (
                      <tr key={jobId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900 text-sm">
                            {job.title}
                          </p>
                          <p className="text-slate-400">{emp?.name || "Unknown Organization"}</p>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {job.location}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" className="text-[10px]">
                            {job.jobType}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {job.applicants?.length || 0}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteConfirm("job", job)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No jobs found matching &ldquo;{jobSearch}&rdquo;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 2: Employers Moderation */}
        <TabsContent value="employers" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={employerSearch}
                onChange={(e) => setEmployerSearch(e.target.value)}
                placeholder="Search employers by name, email, website..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button
              onClick={() => openModal("employer", "add")}
              size="sm"
              className="gap-1.5 text-xs self-start sm:self-auto shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Add Employer
            </Button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-card">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 uppercase font-semibold text-slate-500">
                <tr>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4">Contact Email</th>
                  <th className="py-3 px-4">Headquarters</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployers.length > 0 ? (
                  filteredEmployers.map((emp) => {
                    const empId = (emp as any)._id || emp.id;
                    return (
                      <tr key={empId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                emp.logo ||
                                `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                                  emp.name
                                )}`
                              }
                              alt={emp.name}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 bg-white"
                            />
                            <p className="font-semibold text-slate-900 text-sm">
                              {emp.name}
                            </p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {emp.website ? (
                            <a
                              href={emp.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              {emp.website.replace(/^https?:\/\//, "")}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono">{emp.email || "—"}</td>
                        <td className="py-3.5 px-4 text-slate-700">
                          {emp.officeAddress || "Remote"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteConfirm("employer", emp)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No employers found matching &ldquo;{employerSearch}&rdquo;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 3: Seekers Moderation */}
        <TabsContent value="seekers" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={seekerSearch}
                onChange={(e) => setSeekerSearch(e.target.value)}
                placeholder="Search candidates by name, email, skills..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button
              onClick={() => openModal("seeker", "add")}
              size="sm"
              className="gap-1.5 text-xs self-start sm:self-auto shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Add Job Seeker
            </Button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-card">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 uppercase font-semibold text-slate-500">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Skills</th>
                  <th className="py-3 px-4">Expected Salary</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSeekers.length > 0 ? (
                  filteredSeekers.map((seeker) => {
                    const seekerId = (seeker as any)._id || seeker.id;
                    return (
                      <tr key={seekerId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                seeker.photoUrl ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                                  seeker.name || "candidate"
                                )}`
                              }
                              alt={seeker.name}
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 bg-slate-100"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">
                                {seeker.name}
                              </p>
                              <p className="text-slate-400">{seeker.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">{seeker.phone || "—"}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {seeker.skills && seeker.skills.length > 0 ? (
                              seeker.skills.slice(0, 3).map((sk) => (
                                <span
                                  key={sk}
                                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700"
                                >
                                  {sk}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400">None</span>
                            )}
                            {seeker.skills && seeker.skills.length > 3 && (
                              <span className="text-[10px] text-slate-400 self-center">
                                +{seeker.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                          {seeker.expectedSalary
                            ? `$${seeker.expectedSalary.toLocaleString()}/yr`
                            : "—"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteConfirm("seeker", seeker)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No candidates found matching &ldquo;{seekerSearch}&rdquo;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal for Add Item */}
      <Modal
        isOpen={!!modalState.mode}
        onClose={closeModal}
        title={`${modalState.mode === "edit" ? "Edit" : "Add New"} ${
          modalState.type === "job"
            ? "Job Position"
            : modalState.type === "employer"
            ? "Employer Organization"
            : "Candidate Profile"
        }`}
      >
        {renderModalContent()}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={closeDeleteConfirm}
        title="Confirm Deletion"
      >
        {deleteConfirm && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-100">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold">Permanent Deletion Notice</p>
                <p>
                  You are about to delete{" "}
                  <strong>&ldquo;{deleteConfirm.name}&rdquo;</strong>. This action is
                  irreversible and removes all associated records.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={closeDeleteConfirm}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default AdminDashboard;
