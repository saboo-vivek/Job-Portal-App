import React from 'react';
import { Employer } from '../../types';
import { Building2 } from 'lucide-react';

export interface TrustedCompaniesProps {
  companies: Employer[];
}

export const TrustedCompanies: React.FC<TrustedCompaniesProps> = ({ companies }) => {
  // If we have actual registered companies, use their names and logos;
  // otherwise provide top technology innovators as representative partners.
  const displayCompanies =
    companies && companies.length > 0
      ? companies.slice(0, 8)
      : [
          { name: 'Linear', tag: 'Issue Tracking & Sprint' },
          { name: 'Stripe', tag: 'Financial Infrastructure' },
          { name: 'Vercel', tag: 'Cloud Platform & AI' },
          { name: 'Framer', tag: 'Interactive Design' },
          { name: 'Supabase', tag: 'Open Source Backend' },
          { name: 'GitHub', tag: 'Developer Platform' },
        ];

  return (
    <section className="py-12 border-y border-border/60 bg-white/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-secondary mb-6">
          Powering Hiring For Forward-Thinking Teams
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
          {displayCompanies.map((c: any, index) => (
            <div
              key={c.id || c.name || index}
              className="flex items-center gap-2.5 opacity-65 hover:opacity-100 transition-all duration-300 group cursor-default"
            >
              {c.logo ? (
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-neutral group-hover:bg-[#6C5CE7]/10 group-hover:text-[#6C5CE7] transition-colors">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="font-bold text-sm sm:text-base text-neutral tracking-tight">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
