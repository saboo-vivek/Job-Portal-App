import React, { useState, useMemo } from 'react';
import { Job, Employer, JobType, LocationType } from '../../types';
import JobCard from '../JobCard';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Bookmark,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface JobsExplorePageProps {
  jobs: Job[];
  companies: Employer[];
  onApply: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
  appliedJobIds?: string[];
  userRole?: string | null;
  initialFilters?: {
    query?: string;
    location?: string;
    jobType?: string;
  };
}

export const JobsExplorePage: React.FC<JobsExplorePageProps> = ({
  jobs,
  companies,
  onApply,
  onViewDetails,
  appliedJobIds = [],
  userRole,
  initialFilters,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(initialFilters?.query || '');
  const [locationQuery, setLocationQuery] = useState(initialFilters?.location || '');
  const [selectedJobType, setSelectedJobType] = useState<string>(initialFilters?.jobType || '');
  const [selectedLocationType, setSelectedLocationType] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [minSalary, setMinSalary] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'salary-desc' | 'salary-asc' | 'title'>('newest');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 9;

  // Toggle bookmark / saved job
  const handleToggleSave = (jobId: string) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  // Distinct experience levels from real jobs
  const experienceLevels = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.experienceLevel).filter(Boolean))),
    [jobs]
  );

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    const list = jobs.filter((job) => {
      const company = companies.find(
        (c) => c.id === job.companyId || (c as any)._id === job.companyId
      );
      const companyName = company?.name || '';
      const jobId = job._id || job.id;

      // Saved only toggle
      if (showSavedOnly && !savedJobIds.includes(jobId)) {
        return false;
      }

      // Keyword / Title match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = companyName.toLowerCase().includes(q);
        const matchesDesc = (job.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesDesc) return false;
      }

      // Location match
      if (locationQuery.trim()) {
        const l = locationQuery.toLowerCase();
        const matchesLoc = (job.location || '').toLowerCase().includes(l);
        const matchesLocType = (job.locationType || '').toLowerCase().includes(l);
        if (!matchesLoc && !matchesLocType) return false;
      }

      // Job Type filter
      if (selectedJobType && job.jobType !== selectedJobType) {
        return false;
      }

      // Location Type filter (On-site, Remote, Hybrid)
      if (selectedLocationType && job.locationType !== selectedLocationType) {
        return false;
      }

      // Experience Level filter
      if (selectedExperience && job.experienceLevel !== selectedExperience) {
        return false;
      }

      // Minimum Salary filter
      if (minSalary > 0 && (job.salaryMin || 0) < minSalary) {
        return false;
      }

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'salary-desc') return (b.salaryMax || 0) - (a.salaryMax || 0);
      if (sortBy === 'salary-asc') return (a.salaryMin || 0) - (b.salaryMin || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      // default: newest
      return 0;
    });
  }, [
    jobs,
    companies,
    searchQuery,
    locationQuery,
    selectedJobType,
    selectedLocationType,
    selectedExperience,
    minSalary,
    sortBy,
    showSavedOnly,
    savedJobIds,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(start, start + jobsPerPage);
  }, [filteredJobs, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedJobType('');
    setSelectedLocationType('');
    setSelectedExperience('');
    setMinSalary(0);
    setSortBy('newest');
    setShowSavedOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchQuery || locationQuery || selectedJobType || selectedLocationType || selectedExperience || minSalary > 0 || showSavedOnly);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Bar Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
        <div className="max-w-3xl mb-6">
          <Badge variant="violet" className="mb-2">
            Career Discovery
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral">
            Explore Opportunities
          </h1>
          <p className="mt-1 text-sm text-neutral-secondary">
            Search verified engineering, design, and leadership opportunities across high-velocity teams.
          </p>
        </div>

        {/* Search Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by role title, keywords, or company..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-white text-sm text-neutral placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all"
            />
          </div>

          <div className="md:col-span-4 relative">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Location, city, or Remote..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-white text-sm text-neutral placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`w-full py-3 px-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                showSavedOnly
                  ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                  : 'bg-white text-neutral-secondary border-border hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-white' : ''}`} />
              <span>Saved ({savedJobIds.length})</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="p-3 rounded-2xl border border-border bg-white text-neutral-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills / Advanced Controls */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Job Type Dropdown */}
            <select
              value={selectedJobType}
              onChange={(e) => {
                setSelectedJobType(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-3 rounded-xl border border-border bg-white text-xs font-semibold text-neutral-secondary focus:outline-none focus:border-primary"
            >
              <option value="">All Job Types</option>
              {Object.values(JobType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Location Type Dropdown */}
            <select
              value={selectedLocationType}
              onChange={(e) => {
                setSelectedLocationType(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-3 rounded-xl border border-border bg-white text-xs font-semibold text-neutral-secondary focus:outline-none focus:border-primary"
            >
              <option value="">All Workplaces (Remote/On-site)</option>
              {Object.values(LocationType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Experience Level Dropdown */}
            {experienceLevels.length > 0 && (
              <select
                value={selectedExperience}
                onChange={(e) => {
                  setSelectedExperience(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-1.5 px-3 rounded-xl border border-border bg-white text-xs font-semibold text-neutral-secondary focus:outline-none focus:border-primary"
              >
                <option value="">All Experience Levels</option>
                {experienceLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            )}

            {/* Salary Threshold Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-white text-xs text-neutral-secondary">
              <span className="font-semibold text-neutral">Min Salary:</span>
              <span>${minSalary.toLocaleString()}</span>
              <input
                type="range"
                min="0"
                max="250000"
                step="10000"
                value={minSalary}
                onChange={(e) => {
                  setMinSalary(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-20 h-1.5 accent-[#6C5CE7] cursor-pointer"
              />
            </div>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-neutral-secondary">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-neutral">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2.5 rounded-xl border border-border bg-white text-xs font-semibold text-neutral focus:outline-none focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="salary-desc">Highest Salary</option>
              <option value="salary-asc">Lowest Salary</option>
              <option value="title">Role Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-neutral">
          Showing <span className="text-[#6C5CE7] font-bold">{filteredJobs.length}</span> positions
          {hasActiveFilters && ' matching your criteria'}
        </p>

        {totalPages > 1 && (
          <p className="text-xs text-neutral-secondary">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Job Cards Grid */}
      {paginatedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedJobs.map((job) => {
            const company = companies.find(
              (c) => c.id === job.companyId || (c as any)._id === job.companyId
            ) || {
              id: job.companyId,
              name: 'Company',
              email: '',
              logo: 'https://via.placeholder.com/80',
              description: '',
              website: '',
              contactInfo: '',
              officeAddress: '',
              reviews: [],
              jobs: [],
            };
            const jobId = job._id || job.id;
            const isApplied = appliedJobIds.includes(jobId);
            const isSaved = savedJobIds.includes(jobId);

            return (
              <JobCard
                key={jobId}
                job={job}
                employer={company}
                onApply={onApply}
                onViewDetails={onViewDetails}
                isApplied={isApplied}
                onToggleSave={handleToggleSave}
                isSaved={isSaved}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="No Matching Positions"
          description="We couldn't find any positions matching your search filters. Try widening your criteria or clearing selected tags."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === i + 1
                    ? 'bg-[#6C5CE7] text-white shadow-sm'
                    : 'text-neutral-secondary hover:bg-slate-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
