import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { UserCheck, Search, Sparkles, Building2, Users, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'employers'>('candidates');

  const candidateSteps = [
    {
      step: '01',
      title: 'Craft & Boost Your Profile',
      desc: 'Set up your resume, upload your work, and use our Gemini AI Resume Booster to refine bullet points for ATS match.',
      icon: <Sparkles className="w-6 h-6 text-[#6C5CE7]" />,
    },
    {
      step: '02',
      title: 'Filter Verified Openings',
      desc: 'Explore transparent compensation ranges, tech stacks, and team culture reviews directly from verified employees.',
      icon: <Search className="w-6 h-6 text-cyan-600" />,
    },
    {
      step: '03',
      title: '1-Click Direct Application',
      desc: 'Submit your profile straight to hiring managers with live status tracking: Applied, Shortlisted, or Hired.',
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
    },
  ];

  const employerSteps = [
    {
      step: '01',
      title: 'Create Your Workspace',
      desc: 'Publish comprehensive company profiles with your branding, headquarters, website, and transparent team insights.',
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
    },
    {
      step: '02',
      title: 'Publish Role Requisitions',
      desc: 'Post detailed opportunities with compensation brackets, experience levels, and on-site / remote options.',
      icon: <CheckCircle2 className="w-6 h-6 text-[#6C5CE7]" />,
    },
    {
      step: '03',
      title: 'Review & Shortlist Top Talent',
      desc: 'Manage candidate applications in real-time, view verified resumes, and advance candidates with zero friction.',
      icon: <Users className="w-6 h-6 text-cyan-600" />,
    },
  ];

  const currentSteps = activeTab === 'candidates' ? candidateSteps : employerSteps;

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="cyan" className="mb-3">
            Simple Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral">
            How Job Executive Works
          </h2>
          <p className="mt-2 text-base text-neutral-secondary">
            A frictionless platform built for high-caliber professionals and fast-moving teams.
          </p>

          {/* Toggle Tab */}
          <div className="mt-8 inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200/80">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === 'candidates'
                  ? 'bg-white text-[#6C5CE7] shadow-sm'
                  : 'text-neutral-secondary hover:text-neutral'
              }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setActiveTab('employers')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === 'employers'
                  ? 'bg-white text-[#6C5CE7] shadow-sm'
                  : 'text-neutral-secondary hover:text-neutral'
              }`}
            >
              For Employers
            </button>
          </div>
        </div>

        {/* 3 Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {currentSteps.map((s, idx) => (
            <div
              key={s.step}
              className="relative p-8 rounded-3xl border border-border/80 bg-slate-50/50 hover:bg-white hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-extrabold text-slate-200 group-hover:text-[#6C5CE7]/30 transition-colors font-mono">
                  {s.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center justify-center">
                  {s.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-neutral mb-2 group-hover:text-[#6C5CE7] transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-neutral-secondary leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
