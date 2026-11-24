import React from 'react';
import { Job, Employer, JobSeeker } from '../../types';
import { Navbar } from './Navbar';
import { Hero3D } from './Hero3D';
import { HeroSearch } from './HeroSearch';
import { TrustedCompanies } from './TrustedCompanies';
import { FeaturedJobs } from './FeaturedJobs';
import { JobCategories } from './JobCategories';
import { HowItWorks } from './HowItWorks';
import { PlatformStats } from './PlatformStats';
import { Testimonials } from './Testimonials';
import { CtaSection } from './CtaSection';
import { Footer } from './Footer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface LandingPageProps {
  currentUser: any;
  currentUserRole: string | null;
  jobs: Job[];
  companies: Employer[];
  seekers: JobSeeker[];
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
  onNavigateView: (view: 'home' | 'jobs' | 'companies' | 'blog' | 'dashboard') => void;
  onSearch: (filters: { query: string; location: string; jobType: string }) => void;
  onViewJob: (job: Job) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  currentUserRole,
  jobs,
  companies,
  seekers,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onNavigateView,
  onSearch,
  onViewJob,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-neutral overflow-x-hidden">
      {/* Top Floating Navbar */}
      <Navbar
        currentUser={currentUser}
        currentUserRole={currentUserRole}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onLogoutClick={onLogoutClick}
        onNavigateView={onNavigateView}
        currentView="home"
      />

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-24 overflow-hidden">
        {/* Subtle background radial ambient lights */}
        <div className="absolute top-0 inset-x-0 h-[600px] bg-radial-hero pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-[#6C5CE7]/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-40 left-10 w-96 h-96 rounded-full bg-[#38BDF8]/10 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-border shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span className="text-xs font-bold text-neutral">
                  Next-Gen Career Intelligence
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-cyan-100 text-[#0284C7]">
                  New
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral leading-[1.12]">
                Find the Opportunity That Moves Your{' '}
                <span className="text-gradient">Career Forward.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover meaningful opportunities, connect with leading companies and take the next step in your professional journey.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigateView('jobs')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="shadow-glow-violet px-7"
                >
                  Explore Opportunities
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigateView('companies')}
                  className="bg-white/80 px-7"
                >
                  View Companies
                </Button>
              </div>
            </div>

            {/* Right Column: 3D Interactive Scene */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <Hero3D />
            </div>
          </div>

          {/* Interactive Quick Search Bar */}
          <div className="mt-14 sm:mt-16">
            <HeroSearch onSearch={onSearch} />
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <TrustedCompanies companies={companies} />

      {/* Featured Jobs */}
      <FeaturedJobs
        jobs={jobs}
        companies={companies}
        onViewJob={onViewJob}
        onExploreAll={() => onNavigateView('jobs')}
      />

      {/* Popular Job Categories */}
      <JobCategories
        onSelectCategory={(kw) =>
          onSearch({ query: kw, location: '', jobType: '' })
        }
      />

      {/* How It Works */}
      <HowItWorks />

      {/* Platform Real Statistics */}
      <PlatformStats jobs={jobs} companies={companies} seekers={seekers} />

      {/* Testimonials */}
      <Testimonials companies={companies} />

      {/* Final Call to Action */}
      <CtaSection
        onGetStarted={() => onNavigateView('jobs')}
        onPostJob={onSignupClick}
      />

      {/* Footer */}
      <Footer onNavigateView={onNavigateView} />
    </div>
  );
};
