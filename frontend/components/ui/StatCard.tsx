import React from 'react';
import { cn } from './utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  className?: string;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  isPositive = true,
  subtitle,
  className,
  iconBg = 'bg-[#6C5CE7]/10 text-[#6C5CE7]',
}) => {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/80 bg-white p-6 shadow-sm',
        'hover:shadow-card-hover hover:border-[#6C5CE7]/30 hover:-translate-y-0.5 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-secondary">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-extrabold tracking-tight text-neutral">
              {value}
            </h4>
            {change && (
              <span
                className={cn(
                  'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full',
                  isPositive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                )}
              >
                {isPositive ? '+' : ''}
                {change}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-secondary">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
            iconBg
          )}
        >
          {icon}
        </div>
      </div>

      {/* Subtle bottom gradient accent bar on hover */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#6C5CE7]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};
