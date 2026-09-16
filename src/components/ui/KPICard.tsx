import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  numerator?: number;
  denominator?: number;
  color?: 'brand' | 'accent' | 'emerald' | 'amber' | 'rose' | 'violet';
}

const colorClasses = {
  brand: 'from-brand-500 to-brand-700',
  accent: 'from-accent-500 to-accent-700',
  emerald: 'from-emerald-500 to-emerald-700',
  amber: 'from-amber-500 to-amber-700',
  rose: 'from-rose-500 to-rose-700',
  violet: 'from-violet-500 to-violet-700',
};

const iconBgClasses = {
  brand: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
  accent: 'bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
};

export function KPICard({ title, value, unit, icon, trend, trendLabel, numerator, denominator, color = 'brand' }: KPICardProps) {
  return (
    <div className="card card-hover p-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
            {unit && <span className="ml-1 text-lg font-medium text-gray-400">{unit}</span>}
          </p>
          {numerator !== undefined && denominator !== undefined && (
            <p className="mt-1 text-xs text-gray-400">
              {numerator}/{denominator} trainees
            </p>
          )}
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              {trend > 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : trend < 0 ? (
                <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
              ) : (
                <Minus className="h-3.5 w-3.5 text-gray-400" />
              )}
              <span className={trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : trend < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'}>
                {trend > 0 ? '+' : ''}{trend}% {trendLabel}
              </span>
            </div>
          )}
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconBgClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
