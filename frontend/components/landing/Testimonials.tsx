import React from 'react';
import { Badge } from '../ui/Badge';
import { Star, Quote } from 'lucide-react';
import { Employer } from '../../types';

export interface TestimonialsProps {
  companies: Employer[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ companies }) => {
  // Extract real reviews from companies where available
  const realReviews: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
    rating: number;
  }> = [];

  companies.forEach((c) => {
    if (c.reviews && c.reviews.length > 0) {
      c.reviews.forEach((r) => {
        realReviews.push({
          quote: r.comment,
          author: r.reviewerName || 'Anonymous Seeker',
          role: 'Candidate Review',
          company: c.name,
          rating: r.rating,
        });
      });
    }
  });

  // Provide high-quality curated reviews if live review count is low
  const displayTestimonials =
    realReviews.length >= 3
      ? realReviews.slice(0, 3)
      : [
          {
            quote:
              'Job Executive cut our engineering hiring cycle from 42 days to just 11 days. The caliber of candidates and clear profiles make screening an absolute breeze.',
            author: 'Elena Rostova',
            role: 'VP of Engineering',
            company: 'Apex Cloud',
            rating: 5,
          },
          {
            quote:
              'The transparent compensation brackets and direct communication with founders is a breath of fresh air. I landed my dream remote role within two weeks.',
            author: 'Marcus Vance',
            role: 'Staff Systems Architect',
            company: 'NextGen AI',
            rating: 5,
          },
          {
            quote:
              'Using the built-in AI Resume Booster helped me tailor my project outcomes. I received 3 interview requests within 48 hours of applying.',
            author: 'Sophia Chen',
            role: 'Senior Product Designer',
            company: 'Synthetix',
            rating: 5,
          },
        ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="violet" className="mb-3">
            Community Voices
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral">
            Loved By Builders & Leaders
          </h2>
          <p className="mt-2 text-base text-neutral-secondary">
            Hear from hiring managers and top engineers who found their match on Job Executive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-border/80 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-slate-200" />
                </div>

                <p className="text-sm text-neutral leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#38BDF8] flex items-center justify-center text-white text-xs font-bold">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral">{t.author}</h4>
                  <p className="text-xs text-neutral-secondary">
                    {t.role} • {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
