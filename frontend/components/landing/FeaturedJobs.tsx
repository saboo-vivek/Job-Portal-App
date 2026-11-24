import React from 'react';
import { Job, Employer } from '../../types';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MapPin, DollarSign, Briefcase, ArrowUpRight, Star } from 'lucide-react';

export interface FeaturedJobsProps {
  jobs: Job[];
  companies: Employer[];
  onViewJob: (job: Job) => void;
  onExploreAll: () => void;
}

export const FeaturedJobs: React.FC<FeaturedJobsProps> = ({
  jobs,
  companies,
  onViewJob,
  onExploreAll,
}) => {
  // Grab up to 6 featured jobs from the real backend list
  const featuredJobs = jobs.slice(0, 6);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge variant="violet" className="mb-3">
              Direct Openings
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral">
              Featured Opportunities
            </h2>
            <p className="mt-2 text-base text-neutral-secondary max-w-xl">
              Hand-picked high-impact roles from verified engineering, design, and executive teams.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={onExploreAll}
            className="mt-4 md:mt-0 self-start md:self-auto"
            rightIcon={<ArrowUpRight className="w-4 h-4" />}
          >
            Explore All ({jobs.length})
          </Button>
        </div>

        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => {
              const company = companies.find(
                (c) => c.id === job.companyId || (c as any)._id === job.companyId
              );
              const companyName = company?.name || 'Verified Partner';
              const companyLogo = company?.logo || 'https://via.placeholder.com/60';
              const avgRating =
                (company?.reviews?.length ?? 0) > 0
                  ? (
                      company!.reviews.reduce((acc, r) => acc + r.rating, 0) /
                      company!.reviews.length
                    ).toFixed(1)
                  : null;

              return (
                <SpotlightCard
                  key={job.id || (job as any)._id}
                  className="p-6 flex flex-col justify-between hover:border-[#6C5CE7]/40 shadow-sm hover:shadow-card-hover group cursor-pointer"
                  onClick={() => onViewJob(job)}
                >
                  <div>
                    {/* Header: Company Logo, Name & Review rating */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={companyLogo}
                          alt={companyName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200/80 shadow-sm"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-secondary uppercase tracking-wider">
                            {companyName}
                          </p>
                          <h3 className="text-lg font-bold text-neutral tracking-tight line-clamp-1 group-hover:text-[#6C5CE7] transition-colors">
                            {job.title}
                          </h3>
                        </div>
                      </div>

                      {avgRating && (
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{avgRating}</span>
                        </div>
                      )}
                    </div>

                    {/* Meta info: Location, Salary, Level */}
                    <div className="space-y-2 py-2 border-y border-slate-100/80 text-xs text-neutral-secondary">
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
                        <span>{job.experienceLevel} Level</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="pt-4 mt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="cyan" size="sm">
                        {job.jobType}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {job.locationType}
                      </Badge>
                    </div>

                    <span className="text-xs font-bold text-[#6C5CE7] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Details
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/60 rounded-3xl border border-dashed border-border">
            <p className="text-neutral-secondary font-medium">
              No jobs currently listed. Post the first opportunity!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
