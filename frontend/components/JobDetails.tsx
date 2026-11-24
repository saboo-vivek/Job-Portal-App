import React, { useEffect } from "react";
import { Job, Employer } from "../types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Globe,
  Building,
  Mail,
  Star,
  CheckCircle2,
  Calendar,
  Share2,
  Bookmark,
  Sparkles,
} from "lucide-react";

export interface JobDetailsProps {
  job: Job;
  employer: Employer;
  onApply: (jobId: string) => void;
  isApplied: boolean;
  userRole: "SEEKER" | "EMPLOYER" | "ADMIN";
  onLeaveReview: (companyId: string) => void;
  similarJobs?: Job[];
  onViewSimilarJob?: (job: Job) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  employer,
  onApply,
  isApplied,
  userRole,
  onLeaveReview,
  similarJobs = [],
  onViewSimilarJob,
}) => {
  useEffect(() => {
    console.log("JobDetails loaded for:", job?.title);
  }, [job]);

  if (!job || !employer) {
    return (
      <div className="py-12 text-center text-neutral-secondary">
        Loading job details...
      </div>
    );
  }

  const jobId = job._id || job.id;
  const companyId = employer._id || employer.id;
  const companyLogo = employer.logo || "https://via.placeholder.com/100";

  const avgRating =
    (employer?.reviews?.length ?? 0) > 0
      ? (
          employer.reviews.reduce((acc, r) => acc + r.rating, 0) /
          employer.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="space-y-8 max-h-[80vh] overflow-y-auto pr-1">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-5 pb-6 border-b border-border">
        <div className="flex items-start gap-4">
          <img
            src={companyLogo}
            alt={`${employer.name} logo`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border border-slate-200/80 shadow-md flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/100?text=" + employer.name?.charAt(0);
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#6C5CE7] uppercase tracking-wider">
                {employer.name}
              </span>
              {avgRating && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{avgRating} ({employer.reviews?.length || 0})</span>
                </div>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral tracking-tight mt-1">
              {job.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <Badge variant="violet" size="sm">
                {job.jobType}
              </Badge>
              <Badge variant="cyan" size="sm">
                {job.locationType}
              </Badge>
              <Badge variant="default" size="sm">
                {job.experienceLevel} Level
              </Badge>
            </div>
          </div>
        </div>

        {/* Primary Apply Button */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2.5 w-full sm:w-auto">
          <Button
            size="lg"
            variant="primary"
            onClick={() => onApply(jobId)}
            disabled={isApplied}
            className={`w-full sm:w-auto font-bold px-7 ${
              isApplied
                ? "bg-slate-300 text-slate-600 cursor-not-allowed shadow-none"
                : "shadow-glow-violet"
            }`}
          >
            {isApplied ? "✓ Application Submitted" : "Apply Now"}
          </Button>

          {userRole === "SEEKER" && (
            <button
              onClick={() => onLeaveReview(companyId)}
              className="text-xs font-semibold text-neutral-secondary hover:text-[#6C5CE7] transition-colors underline"
            >
              Review this Employer
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-secondary font-medium">Estimated Salary</p>
            <p className="text-sm font-bold text-neutral">
              ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} / yr
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-[#0284C7] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-secondary font-medium">Location</p>
            <p className="text-sm font-bold text-neutral truncate max-w-[170px]">
              {job.location} ({job.locationType})
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-secondary font-medium">Seniority</p>
            <p className="text-sm font-bold text-neutral">
              {job.experienceLevel} Tier
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Description */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-neutral tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
          About This Role & Description
        </h3>
        <div className="p-6 rounded-3xl bg-white border border-border/80 shadow-sm text-sm text-neutral-secondary leading-relaxed whitespace-pre-wrap">
          {job.description}
        </div>
      </div>

      {/* Company Overview Card */}
      <div className="p-6 rounded-3xl bg-slate-50/80 border border-border/80 space-y-4">
        <h3 className="text-base font-bold text-neutral tracking-tight flex items-center gap-2">
          <Building className="w-4 h-4 text-indigo-600" />
          About {employer.name}
        </h3>

        {employer.description && (
          <p className="text-sm text-neutral-secondary leading-relaxed">
            {employer.description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-neutral-secondary">
          {employer.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <a
                href={
                  employer.website.startsWith("http")
                    ? employer.website
                    : `https://${employer.website}`
                }
                target="_blank"
                rel="noreferrer"
                className="text-[#6C5CE7] hover:underline truncate"
              >
                {employer.website}
              </a>
            </div>
          )}

          {employer.officeAddress && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{employer.officeAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-neutral-secondary">
          Job Reference ID: <span className="font-mono text-neutral">{jobId}</span>
        </span>

        <Button
          variant="primary"
          onClick={() => onApply(jobId)}
          disabled={isApplied}
          className={isApplied ? "bg-slate-300 text-slate-600" : ""}
        >
          {isApplied ? "Applied" : "Submit Application"}
        </Button>
      </div>
    </div>
  );
};

export default JobDetails;
