import {
  GraduationCap, TrendingUp, ArrowRight, Info,
  AlertTriangle, CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LabelList,
} from 'recharts';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { cohortComparisons } from '@/data/mockData';

export function NextCohortLearning() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Next-Cohort Learning</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Comparing previous cohort with next comparable cohort after interventions
        </p>
      </div>

      {/* Critical disclaimer */}
      <Card className="border-l-4 border-l-amber-400 p-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Observed improvement; causal impact not established.</p>
            <p className="text-gray-500 dark:text-gray-400">
              SkillPulse compares cohorts to observe changes, but cannot claim the intervention caused the improvement.
              Multiple factors (market conditions, cohort composition, timing) may contribute. This is correlation, not causation.
            </p>
          </div>
        </div>
      </Card>

      {/* Cohort comparisons */}
      <div className="space-y-6">
        {cohortComparisons.map((comp, i) => {
          const chartData = [
            { cohort: comp.previousCohort.replace('Cohort ', ''), value: comp.previousValue },
            { cohort: comp.nextCohort.replace('Cohort ', ''), value: comp.nextValue },
          ];
          const isPositive = comp.observedChange > 0;

          return (
            <Card key={i} className="p-5 animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{comp.metric}</h3>
                  <p className="text-xs text-gray-500">Intervention: {comp.intervention}</p>
                </div>
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${isPositive ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'}`}>
                  {isPositive ? <TrendingUp className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-rose-600" />}
                  <div>
                    <p className="text-xs text-gray-500">Observed Change</p>
                    <p className={`text-lg font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isPositive ? '+' : ''}{comp.observedChange}pp
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison chart */}
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} unit="%" />
                    <YAxis type="category" dataKey="cohort" stroke="#9ca3af" fontSize={12} width={80} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      <LabelList dataKey="value" position="right" formatter={(v) => `${v}%`} style={{ fontSize: 13, fontWeight: 600 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Before / After */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500">Previous Cohort</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{comp.previousValue}%</p>
                  <p className="text-xs text-gray-400">{comp.previousCohort}</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-brand-500" />
                  <div className="ml-2">
                    <p className="text-xs text-gray-500">Intervention</p>
                    <p className="text-xs font-medium text-brand-600 dark:text-brand-400">{comp.intervention}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-brand-50 p-3 dark:bg-brand-900/20">
                  <p className="text-xs text-gray-500">Next Cohort</p>
                  <p className="text-lg font-bold text-brand-600 dark:text-brand-400">{comp.nextValue}%</p>
                  <p className="text-xs text-gray-400">{comp.nextCohort}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Uncertainty section */}
      <Card className="p-5 border-l-4 border-l-amber-400">
        <SectionTitle title="Remaining Uncertainty" subtitle="Factors that may have influenced results" icon={<Info className="h-5 w-5" />} />
        <div className="space-y-3">
          {[
            'Market demand may have increased independently of the intervention.',
            'Cohort composition (education, prior skills) may differ between groups.',
            'Sample sizes are small — changes may not be statistically significant.',
            'Follow-up coverage differs between cohorts, affecting measurement.',
            'External economic factors (seasonal hiring, policy changes) not controlled for.',
          ].map((factor, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/20">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{factor}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* What we can and cannot say */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" /> What We Can Say
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> The next cohort showed an observed improvement of +11pp in relevant employment.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> The intervention (Power BI module) was implemented between the two cohorts.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Skill alignment improved from 64% to 78%, consistent with the curriculum change.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> The direction of change is positive and worth continuing.</li>
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" /> What We Cannot Say
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2"><span className="text-rose-500">•</span> The intervention caused the improvement.</li>
            <li className="flex items-start gap-2"><span className="text-rose-500">•</span> The improvement is statistically significant.</li>
            <li className="flex items-start gap-2"><span className="text-rose-500">•</span> The same intervention would produce the same result in another context.</li>
            <li className="flex items-start gap-2"><span className="text-rose-500">•</span> Other factors did not contribute to the observed change.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
