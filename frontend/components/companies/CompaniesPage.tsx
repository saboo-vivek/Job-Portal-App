import React, { useState, useMemo } from 'react';
import { Employer, Job } from '../../types';
import {
  Building2,
  Search,
  MapPin,
  Globe,
  Briefcase,
  Star,
  ExternalLink,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Badge, Button, EmptyState } from '../ui';

interface CompaniesPageProps {
  companies: Employer[];
  jobs: Job[];
  onSelectCompany: (company: Employer) => void;
  onExploreJobsForCompany: (companyName: string) => void;
}

export const CompaniesPage: React.FC<CompaniesPageProps> = ({
  companies,
  jobs,
  onSelectCompany,
  onExploreJobsForCompany,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.officeAddress && c.officeAddress.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [companies, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-12 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(108,92,231,0.25),transparent_50%)]" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <Badge variant="secondary" className="bg-white/10 text-cyan-200 border-white/10">
            Hiring Organizations
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Discover Top Tech Companies & Leading Employers
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Explore company culture, headquarters, verified employee ratings, and open positions across top hiring partners.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search company by name, location, or keywords..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Company Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => {
            const companyId = (company as any)._id || company.id;
            const companyJobs = jobs.filter(
              (j) => j.companyId === companyId || j.companyId === company.id
            );
            const reviewsCount = company.reviews?.length || 0;
            const avgRating =
              reviewsCount > 0
                ? (
                    company.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
                    reviewsCount
                  ).toFixed(1)
                : null;

            return (
              <div
                key={companyId}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <img
                      src={
                        company.logo ||
                        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                          company.name
                        )}`
                      }
                      alt={company.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200/80 bg-white shadow-2xs group-hover:scale-105 transition-transform"
                    />
                    {avgRating && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {avgRating} ({reviewsCount})
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {company.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {company.description ||
                      'Pioneering innovative products and fostering world-class engineering teams.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {company.officeAddress || 'Global / Remote'}
                    </span>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                    {companyJobs.length} {companyJobs.length === 1 ? 'Open Role' : 'Open Roles'}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExploreJobsForCompany(company.name)}
                    className="text-xs h-8 group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    View Positions <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Companies Found"
          description="No hiring partners matched your search query. Try searching by another keyword."
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      )}
    </div>
  );
};

export default CompaniesPage;
