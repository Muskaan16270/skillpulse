import {
  Stethoscope, TrendingDown, AlertTriangle, Lightbulb,
  ChevronRight, Activity, Target, Info, ShieldCheck,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList,
} from 'recharts';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { outcomeFunnel, kpis } from '@/data/mockData';

const leakageReasons = [
  { stage: 'Certified → Placed', leakage: 9, reasons: ['Lack of vacancies in district', 'Interview readiness gap', 'Location constraints', 'No suitable job match'] },
  { stage: 'Placed → Relevant', leakage: 25, reasons: ['Skill mismatch (training vs job role)', 'Salary mismatch (accepted lower-relevance jobs)', 'Industry mismatch', 'Low wage offered'] },
  { stage: 'Relevant → Retained', leakage: 13, reasons: ['Workplace adjustment issues', 'Salary below market median', 'Limited career progression', 'Location issue'] },
  { stage: 'Retained → Evidence-Supported', leakage: 6, reasons: ['Low follow-up response rate', 'Missing employer verification', 'Document collection gaps', 'Incomplete follow-up'] },
];

const evidenceConfidence = [
  { stage: 'Training Completed', confidence: 95, label: 'High — provider records' },
  { stage: 'Outcome Reported', confidence: 62, label: 'Medium — mix of self-report and evidence' },
  { stage: 'Evidence Supported', confidence: 78, label: 'High — document-verified' },
  { stage: 'Relevant Employment', confidence: 70, label: 'Medium-High — role match verified' },
  { stage: 'Retained', confidence: 55, label: 'Medium — relies on follow-up response' },
  { stage: 'Progression', confidence: 40, label: 'Low — limited 12-month data' },
];

const funnelChartData = outcomeFunnel.map((s) => ({
  stage: s.stage,
  percentage: s.value,
  count: s.count,
}));

export function OutcomeAutopsy() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Outcome Autopsy</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Breaking placement % into quality layers — identifying where value leaked
        </p>
      </div>

      {/* Provenance label */}
      <div className="flex items-center gap-2">
        <Badge color="amber">SYNTHETIC DEMO</Badge>
        <span className="text-xs text-gray-400">Funnel data computed from 30 simulated trainee records</span>
      </div>

      {/* Key insight banner */}
      <Card className="border-l-4 border-l-rose-400 p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <Activity className="h-6 w-6 shrink-0 text-rose-500" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Autopsy Summary</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">82%</span> initial placement looks strong, but drops to{' '}
              <span className="font-semibold text-amber-600">57%</span> relevant employment and{' '}
              <span className="font-semibold text-rose-600">44%</span> 6-month retention.
              The biggest leak is <span className="font-semibold">between placement and relevant employment (25pp)</span> —
              trainees get jobs, but many are not relevant to their training.
            </p>
          </div>
        </div>
      </Card>

      {/* Missing follow-up note */}
      <Card className="border-l-4 border-l-brand-400 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Missing follow-up does NOT mean unemployed.</p>
            <p className="text-gray-500 dark:text-gray-400">
              Follow-up coverage: {kpis.followUpCoverage}% of trainees responded to all follow-ups. Trainees with no follow-up response are classified as "Unknown" — never assumed unemployed. Metrics below show numerator/denominator for transparency.
            </p>
          </div>
        </div>
      </Card>

      {/* Funnel chart */}
      <Card className="p-5">
        <SectionTitle title="Outcome Funnel" subtitle="Training → Outcome → Evidence → Relevance → Retention → Progression" icon={<Stethoscope className="h-5 w-5" />} />
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={funnelChartData} margin={{ left: -10, right: 20, top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="stage" stroke="#9ca3af" fontSize={11} angle={-15} textAnchor="end" height={70} />
            <YAxis stroke="#9ca3af" fontSize={12} unit="%" />
            <Tooltip formatter={(v) => [`${v}%`, 'Percentage']} />
            <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
              {funnelChartData.map((_, i) => (
                <Bar key={i} dataKey="percentage" />
              ))}
              <LabelList dataKey="percentage" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 12, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Evidence confidence per stage */}
      <Card className="p-5">
        <SectionTitle title="Evidence Confidence by Stage" subtitle="How confident are we in each metric?" icon={<Info className="h-5 w-5" />} />
        <div className="space-y-3">
          {evidenceConfidence.map((ec) => (
            <div key={ec.stage} className="flex items-center gap-4">
              <span className="w-48 shrink-0 text-sm text-gray-700 dark:text-gray-300">{ec.stage}</span>
              <div className="flex-1"><ProgressBar value={ec.confidence} color={ec.confidence > 75 ? 'emerald' : ec.confidence > 55 ? 'amber' : 'rose'} /></div>
              <span className="w-12 text-right text-sm font-bold text-gray-900 dark:text-white">{ec.confidence}%</span>
              <span className="hidden w-48 shrink-0 text-xs text-gray-400 sm:block">{ec.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Leakage analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {leakageReasons.map((leak, i) => (
          <Card key={i} className="p-5 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-rose-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{leak.stage}</h3>
              </div>
              <Badge color="rose" size="sm">-{leak.leakage}pp</Badge>
            </div>
            <div className="mt-3">
              <ProgressBar value={leak.leakage} max={30} color="rose" showLabel />
            </div>
            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Possible reasons:</p>
              {leak.reasons.map((r) => (
                <div key={r} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{r}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Value chain */}
      <Card className="p-5">
        <SectionTitle title="Outcome Value Chain" subtitle="From raw placement to quality outcome — with numerator/denominator" icon={<Target className="h-5 w-5" />} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {outcomeFunnel.map((stage, i) => (
            <div key={stage.stage} className="relative">
              <div className={`rounded-lg p-4 text-center ${i === 0 ? 'bg-brand-50 dark:bg-brand-900/20' : i >= 4 ? 'bg-rose-50 dark:bg-rose-900/20' : i >= 3 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stage.value}%</p>
                <p className="mt-1 text-xs text-gray-500">{stage.stage}</p>
                <p className="text-xs text-gray-400">n={stage.count}/{outcomeFunnel[0].count}</p>
              </div>
              {i < outcomeFunnel.length - 1 && (
                <ChevronRight className="absolute -right-2 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-gray-300 lg:block" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendation */}
      <Card className="p-5 border-l-4 border-l-brand-400">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 shrink-0 text-brand-500" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Key Finding</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              The primary value leak is not placement — it's <strong>relevance and retention</strong>. 82% get jobs, but only 57% get jobs relevant to their training. This suggests curriculum-market misalignment rather than employability failure. Addressing skill gaps (Cloud, Power BI) and improving interview readiness could recover 10-15pp of relevant employment.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
