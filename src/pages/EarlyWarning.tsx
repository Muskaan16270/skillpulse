import {
  AlertTriangle, BrainCircuit, Lightbulb, Info,
  ShieldAlert, TrendingDown,
} from 'lucide-react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { earlyWarnings } from '@/data/mockData';

const severityColors = {
  High: 'rose' as const,
  Medium: 'amber' as const,
  Low: 'gray' as const,
};

const typeIcons: Record<string, React.ReactNode> = {
  'Non-Placement Risk': <TrendingDown className="h-5 w-5" />,
  'Low Follow-up Response': <Info className="h-5 w-5" />,
  'Low Job Relevance': <AlertTriangle className="h-5 w-5" />,
  'Retention Risk': <ShieldAlert className="h-5 w-5" />,
  'Emerging Skill Gap': <BrainCircuit className="h-5 w-5" />,
};

export function EarlyWarning() {
  const highSeverity = earlyWarnings.filter((w) => w.severity === 'High');
  const mediumSeverity = earlyWarnings.filter((w) => w.severity === 'Medium');
  const lowSeverity = earlyWarnings.filter((w) => w.severity === 'Low');
  const insufficient = earlyWarnings.filter((w) => w.insufficientEvidence);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Early Warning AI</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Flagging risks before they become outcomes — decision support only</p>
      </div>

      {/* AI disclaimer */}
      <Card className="border-l-4 border-l-amber-400 p-4">
        <div className="flex items-start gap-3">
          <BrainCircuit className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">AI is decision support only.</p>
            <p className="text-gray-500 dark:text-gray-400">
              Every warning explains "Why was this flagged?" The AI can return "Insufficient evidence" when data is too sparse for a confident assessment. Warnings should prompt human review, not automated action.
            </p>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-gray-500">Total Warnings</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{earlyWarnings.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500">High Severity</p>
          <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{highSeverity.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500">Medium Severity</p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{mediumSeverity.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500">Insufficient Evidence</p>
          <p className="mt-1 text-2xl font-bold text-gray-600 dark:text-gray-400">{insufficient.length}</p>
        </Card>
      </div>

      {/* Warnings list */}
      <div className="space-y-4">
        {earlyWarnings.map((warning) => (
          <Card key={warning.id} className="p-5 animate-slide-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {/* Severity indicator */}
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                warning.severity === 'High' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' :
                warning.severity === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' :
                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {typeIcons[warning.type]}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{warning.type}</h3>
                  <Badge color={severityColors[warning.severity]}>{warning.severity}</Badge>
                  <Badge color="gray" size="sm">{warning.id}</Badge>
                  {warning.insufficientEvidence && <Badge color="amber" size="sm">Insufficient Evidence</Badge>}
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Trainee: <span className="font-medium text-gray-900 dark:text-white">{warning.traineeName}</span> ({warning.traineeId})
                </p>

                {/* Why flagged */}
                <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Why was this flagged?</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{warning.reason}</p>
                </div>

                {/* Confidence */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-gray-500">AI Confidence:</span>
                  <div className="w-24"><ProgressBar value={warning.confidence} color={warning.confidence > 75 ? 'emerald' : warning.confidence > 50 ? 'amber' : 'rose'} /></div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{warning.confidence}%</span>
                </div>

                {/* Recommendation */}
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-brand-50 p-3 dark:bg-brand-900/20">
                  <Lightbulb className="h-4 w-4 shrink-0 text-brand-500" />
                  <div>
                    <p className="text-xs font-semibold text-brand-600 uppercase">Recommendation</p>
                    <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">{warning.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
