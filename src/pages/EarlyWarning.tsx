import { useState } from 'react';
import {
  AlertTriangle, BrainCircuit, Lightbulb, Info,
  ShieldAlert, TrendingDown, UserX, Briefcase,
  Clock, FileSearch, Wrench, X,
} from 'lucide-react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { allEarlyWarnings, type EarlyWarning } from '@/data/mockData';

const riskColors: Record<EarlyWarning['riskLevel'], 'emerald' | 'amber' | 'rose'> = {
  'Low Risk': 'emerald',
  'Medium Risk': 'amber',
  'Needs Attention': 'rose',
};

const riskBg: Record<EarlyWarning['riskLevel'], string> = {
  'Low Risk': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  'Medium Risk': 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  'Needs Attention': 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
};

const typeIcons: Record<string, React.ReactNode> = {
  'Non-Placement Risk': <TrendingDown className="h-5 w-5" />,
  'Low Follow-up Response': <Info className="h-5 w-5" />,
  'No Follow-up Response': <UserX className="h-5 w-5" />,
  'Low Job Relevance': <AlertTriangle className="h-5 w-5" />,
  'Skill Mismatch': <AlertTriangle className="h-5 w-5" />,
  'Retention Risk': <ShieldAlert className="h-5 w-5" />,
  'Low Retention': <Clock className="h-5 w-5" />,
  'Declining Retention': <ShieldAlert className="h-5 w-5" />,
  'Employment Loss': <Briefcase className="h-5 w-5" />,
  'Emerging Skill Gap': <BrainCircuit className="h-5 w-5" />,
  'Unusual Outcome': <AlertTriangle className="h-5 w-5" />,
  'Low Evidence Confidence': <FileSearch className="h-5 w-5" />,
  'Pending Verification': <FileSearch className="h-5 w-5" />,
};

const warningTypeLabels: Record<string, string> = {
  'No Follow-up Response': 'No Follow-up Response',
  'Low Retention': 'Low Retention',
  'Skill Mismatch': 'Skill Mismatch',
  'Pending Verification': 'Pending Verification',
  'Employment Loss': 'Employment Loss',
};

interface EarlyWarningProps {
  onCreateIntervention?: (warning: EarlyWarning) => void;
}

export function EarlyWarning({ onCreateIntervention }: EarlyWarningProps = {}) {
  const [riskFilter, setRiskFilter] = useState<string>('All');

  const warnings = allEarlyWarnings;
  const needsAttention = warnings.filter((w) => w.riskLevel === 'Needs Attention');
  const mediumRisk = warnings.filter((w) => w.riskLevel === 'Medium Risk');
  const lowRisk = warnings.filter((w) => w.riskLevel === 'Low Risk');
  const insufficient = warnings.filter((w) => w.insufficientEvidence);

  const filtered = riskFilter === 'All' ? warnings : warnings.filter((w) => w.riskLevel === riskFilter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Early Warning System</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">System indicators flagging risks before they become outcomes — decision support only</p>
      </div>

      {/* System indicator disclaimer */}
      <Card className="border-l-4 border-l-amber-400 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">SYSTEM INDICATORS — NOT PREDICTIONS</p>
            <p className="text-gray-500 dark:text-gray-400">
              These are system-generated indicators based on follow-up response patterns, employment status changes, and verification states. They are not predictions or guaranteed outcomes. Every indicator explains why it was flagged. Warnings should prompt human review, not automated action.
            </p>
          </div>
        </div>
      </Card>

      {/* Risk summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-gray-500">Total Indicators</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{warnings.length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-rose-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            <p className="text-xs text-gray-500">Needs Attention</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{needsAttention.length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-xs text-gray-500">Medium Risk</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{mediumRisk.length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-400">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-500" />
            <p className="text-xs text-gray-500">Low Risk</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{lowRisk.length}</p>
        </Card>
      </div>

      {/* Warning type breakdown */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {(Object.keys(warningTypeLabels)).map((type) => {
          const count = warnings.filter((w) => w.type === type).length;
          return (
            <Card key={type} className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  {typeIcons[type]}
                </div>
                <div>
                  <p className="text-xs text-gray-500">{warningTypeLabels[type]}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{count}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Risk filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Filter by risk:</span>
        {['All', 'Needs Attention', 'Medium Risk', 'Low Risk'].map((r) => (
          <button
            key={r}
            onClick={() => setRiskFilter(r)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
              riskFilter === r
                ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Warnings list */}
      <div className="space-y-4">
        {filtered.map((warning) => (
          <Card key={warning.id} className={`p-5 animate-slide-up border-l-4 ${
            warning.riskLevel === 'Needs Attention' ? 'border-l-rose-400'
            : warning.riskLevel === 'Medium Risk' ? 'border-l-amber-400'
            : 'border-l-emerald-400'
          }`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {/* Risk indicator */}
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${riskBg[warning.riskLevel]}`}>
                {typeIcons[warning.type] || <AlertTriangle className="h-5 w-5" />}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{warning.type}</h3>
                  <Badge color={riskColors[warning.riskLevel]}>{warning.riskLevel}</Badge>
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
                  <span className="text-xs text-gray-500">Indicator Confidence:</span>
                  <div className="w-24"><ProgressBar value={warning.confidence} color={warning.confidence > 75 ? 'emerald' : warning.confidence > 50 ? 'amber' : 'rose'} /></div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{warning.confidence}%</span>
                </div>

                {/* Recommendation */}
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-brand-50 p-3 dark:bg-brand-900/20">
                  <Lightbulb className="h-4 w-4 shrink-0 text-brand-500" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-brand-600 uppercase">Recommended Action</p>
                    <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">{warning.recommendation}</p>
                  </div>
                </div>

                {/* Suggested intervention type + Create button */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Suggested intervention:</span>
                    <Badge color="brand" size="sm">{warning.interventionType || 'Review Required'}</Badge>
                  </div>
                  {onCreateIntervention && (
                    <button
                      onClick={() => onCreateIntervention(warning)}
                      className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-brand-700"
                    >
                      <Wrench className="h-3.5 w-3.5" /> Create Intervention
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-8 text-center">
            <Info className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="mt-2 text-sm text-gray-400">No indicators for this risk level.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
