import { AlertTriangle } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-amber-500/10 px-4 py-2 text-center">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
        DEMO MODE — Data shown is synthetic/simulated and does not represent official government statistics.
      </p>
    </div>
  );
}
