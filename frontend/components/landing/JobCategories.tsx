import React from 'react';
import { Badge } from '../ui/Badge';
import {
  Code,
  Layout,
  TrendingUp,
  BrainCircuit,
  Headphones,
  ShieldCheck,
  Building,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

export interface JobCategoriesProps {
  onSelectCategory: (categoryKeyword: string) => void;
}

export const JobCategories: React.FC<JobCategoriesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      title: 'Engineering & Architecture',
      keyword: 'Engineer',
      count: '140+ roles',
      icon: <Code className="w-6 h-6 text-[#6C5CE7]" />,
      bg: 'bg-[#6C5CE7]/10',
    },
    {
      title: 'Product & Visual Design',
      keyword: 'Designer',
      count: '85+ roles',
      icon: <Layout className="w-6 h-6 text-cyan-600" />,
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'Data Science & Applied AI',
      keyword: 'Data',
      count: '60+ roles',
      icon: <BrainCircuit className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Growth & Digital Marketing',
      keyword: 'Marketing',
      count: '45+ roles',
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Executive & Operations',
      keyword: 'Manager',
      count: '30+ roles',
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'Customer Experience & Success',
      keyword: 'Support',
      count: '25+ roles',
      icon: <Headphones className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <section className="py-20 bg-slate-50/70 border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="indigo" className="mb-3">
            Career Tracks
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral">
            Popular Job Categories
          </h2>
          <p className="mt-2 text-base text-neutral-secondary">
            Explore curated career pathways with high salary ceilings and vetted team cultures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              onClick={() => onSelectCategory(cat.keyword)}
              className="group p-6 rounded-3xl bg-white border border-border/80 shadow-sm hover:shadow-card-hover hover:border-[#6C5CE7]/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-neutral-secondary">
                  {cat.count}
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-neutral group-hover:text-[#6C5CE7] transition-colors">
                  {cat.title}
                </h3>
                <div className="mt-2 flex items-center text-xs font-semibold text-[#6C5CE7] gap-1 opacity-80 group-hover:opacity-100">
                  <span>Browse track</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
