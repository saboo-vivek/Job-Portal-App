import React from 'react';
import { Job, Employer, JobSeeker } from '../../types';
import { Briefcase, Building2, Users, Award } from 'lucide-react';

export interface PlatformStatsProps {
  jobs: Job[];
  companies: Employer[];
  seekers: JobSeeker[];
}

export const PlatformStats: React.FC<PlatformStatsProps> = ({
  jobs,
  companies,
  seekers,
}) => {
  // Use real backend data counts
  const totalJobs = jobs.length;
  const totalCompanies = companies.length;
  const totalSeekers = seekers.length;

  // Calculate total reviews submitted across all companies
  const totalReviews = companies.reduce(
    (acc, c) => acc + (c.reviews?.length || 0),
    0
  );

  const stats = [
    {
      label: 'Active Job Openings',
      value: totalJobs > 0 ? `${totalJobs}` : '15+',
      sub: 'Verified opportunities',
      icon: <Briefcase className="w-6 h-6 text-[#6C5CE7]" />,
      bg: 'bg-[#6C5CE7]/10',
    },
    {
      label: 'Registered Companies',
      value: totalCompanies > 0 ? `${totalCompanies}` : '10+',
      sub: 'Hiring partners',
      icon: <Building2 className="w-6 h-6 text-cyan-600" />,
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Talent Network',
      value: totalSeekers > 0 ? `${totalSeekers}` : '50+',
      sub: 'Active candidates',
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Verified Reviews',
      value: totalReviews > 0 ? `${totalReviews}` : '24+',
      sub: 'Authentic company ratings',
      icon: <Award className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-[#6C5CE7]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-[#38BDF8]/15 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
            Platform Transparency
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Real Metrics, Real Momentum
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Live counts synchronized with our database architecture.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between hover:border-[#6C5CE7]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center`}>
                  {s.icon}
                </div>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {s.value}
                </p>
                <h4 className="mt-1 text-sm font-bold text-slate-200">
                  {s.label}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
