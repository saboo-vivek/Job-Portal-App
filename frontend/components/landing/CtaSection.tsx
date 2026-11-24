import React from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface CtaSectionProps {
  onGetStarted: () => void;
  onPostJob: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onGetStarted, onPostJob }) => {
  return (
    <section className="py-24 bg-[#0B1020] relative overflow-hidden text-white">
      {/* Radial lighting mesh */}
      <div className="absolute inset-0 bg-radial-hero-dark pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#6C5CE7]/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-6">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">
            Join 10,000+ ambitious tech leaders
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Step Into the Next Chapter of Your Professional Journey
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Whether you are looking to accelerate your engineering career or source elite executive talent, Job Executive delivers transparent, high-velocity connections.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 shadow-glow-violet"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Explore Opportunities Free
          </Button>

          <Button
            variant="glass"
            size="lg"
            onClick={onPostJob}
            className="w-full sm:w-auto px-8 bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            Post a Job as Employer
          </Button>
        </div>
      </div>
    </section>
  );
};
