import {
  Building2, TrendingUp, FileCheck, Target, IndianRupee,
  Info, Users, BarChart3,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line,
} from 'recharts';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { providers } from '@/data/mockData';

const providerComparison = providers.map((p) => ({
  name: p.name.split(' ')[0],
  Placement: p.placementRate,
  Relevance: p.relevantEmploymentRate,
  Retention: p.retentionRate,
  Evidence: p.evidenceCoverage,
}));

const radarData = providers.map((p) => ({
  provider: p.name.split(' ').slice(0, 2).join(' '),
  Placement: p.placementRate,
  Relevance: p.relevantEmploymentRate,
  Retention: p.retentionRate,
  Evidence: p.evidenceCoverage,
  'Skill Relevance': p.skillRelevance,
}));

export function Providers() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Provider Analytics</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Multi-dimensional comparison — not a simplistic leaderboard</p>
      </div>

      {/* Important note */}
      <Card className="border-l-4 border-l-brand-400 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-brand-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Fair comparison matters.</p>
            <p className="text-gray-500 dark:text-gray-400">
              Providers differ in cohort size, sample size, follow-up coverage, and evidence quality. A provider with 100% follow-up coverage will show different numbers than one with 50% — not necessarily better outcomes. Always consider sample sizes alongside metrics.
            </p>
          </div>
        </div>
      </Card>

      {/* Provider cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {providers.map((p) => (
          <Card key={p.id} className="p-5 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{p.name}</h3>
                <p className="text-xs text-gray-500">{p.district} • {p.id}</p>
              </div>
              <Badge color="brand"><Users className="mr-1 h-3 w-3" />{p.traineesTotal} trainees</Badge>
            </div>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MetricBox label="Placement" value={p.placementRate} icon={<Target className="h-4 w-4" />} color="emerald" />
              <MetricBox label="Relevant Employment" value={p.relevantEmploymentRate} icon={<TrendingUp className="h-4 w-4" />} color="brand" />
              <MetricBox label="Retention" value={p.retentionRate} icon={<TrendingUp className="h-4 w-4" />} color="violet" />
              <MetricBox label="Evidence Coverage" value={p.evidenceCoverage} icon={<FileCheck className="h-4 w-4" />} color="accent" />
            </div>

            {/* Quality context */}
            <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Cohort Size</span>
                <span className="font-medium text-gray-900 dark:text-white">{p.cohortSize}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Sample Size (followed up)</span>
                <span className="font-medium text-gray-900 dark:text-white">{p.sampleSize}/{p.cohortSize}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Coverage Score</span>
                <span className="font-medium text-gray-900 dark:text-white">{p.coverageScore}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Evidence Quality</span>
                <div className="flex items-center gap-2">
                  <div className="w-20"><ProgressBar value={p.evidenceQuality} color={p.evidenceQuality > 70 ? 'emerald' : 'amber'} /></div>
                  <span className="font-medium text-gray-900 dark:text-white">{p.evidenceQuality}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Avg. Wage</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{p.avgWage.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Comparison chart */}
      <Card className="p-5">
        <SectionTitle title="Provider Comparison" subtitle="Key metrics across providers" icon={<BarChart3 className="h-5 w-5" />} />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={providerComparison} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} unit="%" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Placement" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Relevance" fill="#3380fc" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Retention" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Evidence" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Radar comparison */}
      <Card className="p-5">
        <SectionTitle title="Multi-Dimensional Comparison" subtitle="Radar view across all quality dimensions" icon={<Building2 className="h-5 w-5" />} />
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={[
            { metric: 'Placement', ...Object.fromEntries(providers.map((p) => [p.name.split(' ')[0], p.placementRate])) },
            { metric: 'Relevance', ...Object.fromEntries(providers.map((p) => [p.name.split(' ')[0], p.relevantEmploymentRate])) },
            { metric: 'Retention', ...Object.fromEntries(providers.map((p) => [p.name.split(' ')[0], p.retentionRate])) },
            { metric: 'Evidence', ...Object.fromEntries(providers.map((p) => [p.name.split(' ')[0], p.evidenceCoverage])) },
            { metric: 'Skill Relevance', ...Object.fromEntries(providers.map((p) => [p.name.split(' ')[0], p.skillRelevance])) },
          ]}>
            <PolarGrid stroke="#e5e7eb" className="dark:opacity-20" />
            <PolarAngleAxis dataKey="metric" stroke="#9ca3af" fontSize={12} />
            <PolarRadiusAxis stroke="#9ca3af" fontSize={10} angle={90} />
            {providers.map((p, i) => (
              <Radar
                key={p.id}
                name={p.name.split(' ')[0]}
                dataKey={p.name.split(' ')[0]}
                stroke={['#3380fc', '#14b8a6', '#8b5cf6', '#f59e0b'][i]}
                fill={['#3380fc', '#14b8a6', '#8b5cf6', '#f59e0b'][i]}
                fillOpacity={0.1}
              />
            ))}
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Wage comparison */}
      <Card className="p-5">
        <SectionTitle title="Wage Progression by Provider" subtitle="Average wage over time" icon={<IndianRupee className="h-5 w-5" />} />
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={[
            { month: 'M1', TechSkill: 20000, Digital: 16000, SkillBridge: 23000, FutureTech: 14000 },
            { month: 'M3', TechSkill: 21000, Digital: 17000, SkillBridge: 24000, FutureTech: 15000 },
            { month: 'M6', TechSkill: 22000, Digital: 18000, SkillBridge: 25000, FutureTech: 16000 },
            { month: 'M12', TechSkill: 25000, Digital: 20000, SkillBridge: 28000, FutureTech: 18000 },
          ]} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
            <Legend />
            <Line type="monotone" dataKey="TechSkill" stroke="#3380fc" strokeWidth={2} />
            <Line type="monotone" dataKey="Digital" stroke="#14b8a6" strokeWidth={2} />
            <Line type="monotone" dataKey="SkillBridge" stroke="#8b5cf6" strokeWidth={2} />
            <Line type="monotone" dataKey="FutureTech" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function MetricBox({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: 'emerald' | 'brand' | 'violet' | 'accent' }) {
  const colorClasses = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    brand: 'text-brand-600 dark:text-brand-400',
    violet: 'text-violet-600 dark:text-violet-400',
    accent: 'text-accent-600 dark:text-accent-400',
  };
  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">{icon} {label}</div>
      <p className={`mt-1 text-xl font-bold ${colorClasses[color]}`}>{value}%</p>
    </div>
  );
}
