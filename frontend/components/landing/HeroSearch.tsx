import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Search, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { JobType } from '../../types';

export interface HeroSearchProps {
  onSearch: (filters: { query: string; location: string; jobType: string }) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, location, jobType });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto glass-panel p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl border border-white/80"
    >
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2.5 items-center">
        {/* Job Title / Keyword */}
        <div className="sm:col-span-5 relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Role, skill, or company title..."
            className="w-full pl-11 pr-3 py-3 rounded-xl bg-transparent text-sm text-neutral placeholder:text-slate-400 focus:outline-none focus:bg-white/80 transition-all font-medium"
          />
        </div>

        {/* Location Divider / Field */}
        <div className="sm:col-span-4 relative flex items-center border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-2 sm:pt-0 sm:pl-2">
          <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 sm:left-5 pointer-events-none" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location or 'Remote'..."
            className="w-full pl-11 sm:pl-12 pr-3 py-3 rounded-xl bg-transparent text-sm text-neutral placeholder:text-slate-400 focus:outline-none focus:bg-white/80 transition-all font-medium"
          />
        </div>

        {/* Employment Type Selector */}
        <div className="sm:col-span-3 relative flex items-center">
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full py-3 px-3 rounded-xl bg-slate-50/80 text-xs font-semibold text-neutral-secondary border border-border/60 cursor-pointer focus:outline-none focus:border-primary transition-all appearance-none"
          >
            <option value="">Any Work Type</option>
            {Object.values(JobType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 text-slate-400">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Submit Action */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-secondary">
          <span className="font-semibold text-neutral">Popular Searches:</span>
          {['React', 'Product Designer', 'Full Stack', 'Remote', 'Contract'].map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => {
                setQuery(tag);
                onSearch({ query: tag, location, jobType });
              }}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-violet-50 hover:text-primary transition-colors text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full sm:w-auto px-6 py-2.5 shadow-md"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Search Jobs
        </Button>
      </div>
    </form>
  );
};
