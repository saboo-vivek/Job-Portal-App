import React from "react";
import { Job, Employer } from "../types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Star,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export interface JobCardProps {
  job: Job;
  employer: Employer;
  onApply: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
  isApplied: boolean;
  status?: string | null;
  onToggleSave?: (jobId: string) => void;
  isSaved?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  employer,
  onApply,
  onViewDetails,
  isApplied,
  status,
  onToggleSave,
  isSaved = false,
}) => {
  const jobId = job._id || job.id;
  const companyName = employer?.name || "Verified Employer";
  const companyLogo = employer?.logo || "https://via.placeholder.com/80";

  const avgRating =
    (employer?.reviews?.length ?? 0) > 0
      ? (
          employer!.reviews.reduce((acc, r) => acc + r.rating, 0) /
          employer!.reviews.length
        ).toFixed(1)
      : null;

  const getStatusBadge = () => {
    const s = (status || "").toUpperCase();
    if (s === "SHORTLISTED") {
      return (
        <Badge variant="warning" size="sm">
          ⭐ Shortlisted
        </Badge>
      );
    }
    if (s === "REJECTED") {
      return (
        <Badge variant="danger" size="sm">
          Rejected
        </Badge>
      );
    }
    if (s === "HIRED") {
      return (
        <Badge variant="success" size="sm">
          🎉 Hired
        </Badge>
      );
    }
    return (
      <Badge variant="violet" size="sm">
        ✓ Applied
      </Badge>
    );
  };

  return (
    <div className="group relative rounded-3xl border border-border/80 bg-white p-6 shadow-sm hover:shadow-card-hover hover:border-[#6C5CE7]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Top row: Company Avatar, Name, Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200/80 shadow-sm flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/80?text=" + companyName.charAt(0);
              }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider truncate max-w-[150px]">
                  {companyName}
                </span>
                {avgRating && (
                  <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{avgRating}</span>
                  </div>
                )}
              </div>
              <h3
                onClick={() => onViewDetails(jobId)}
                className="text-lg font-bold text-neutral tracking-tight hover:text-[#6C5CE7] transition-colors cursor-pointer line-clamp-1 mt-0.5"
              >
                {job.title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(jobId)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? "bg-[#6C5CE7]/10 text-[#6C5CE7] border-[#6C5CE7]/20"
                  : "bg-slate-50 text-slate-400 border-slate-200 hover:text-[#6C5CE7] hover:bg-violet-50"
              }`}
              title={isSaved ? "Saved" : "Save Job"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#6C5CE7]" : ""}`} />
            </button>
          )}
        </div>

        {/* Info Grid */}
        <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-neutral-secondary">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-neutral">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>
              ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} / yr
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span>{job.experienceLevel} Experience</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 mb-5">
          <Badge variant="cyan" size="sm">
            {job.jobType}
          </Badge>
          <Badge variant="default" size="sm">
            {job.locationType}
          </Badge>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          onClick={() => onViewDetails(jobId)}
          className="text-xs font-bold text-[#6C5CE7] hover:text-[#5B4BC4] flex items-center gap-1 transition-colors"
        >
          View Details
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        {isApplied ? (
          <div>{getStatusBadge()}</div>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onApply(jobId)}
            className="px-4 py-2 font-semibold shadow-sm"
          >
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
