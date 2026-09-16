import {
  Target, Briefcase, TrendingUp, FileCheck, ShoppingBag,
  Wrench, Award, IndianRupee, Clock, Info,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { KPICard } from '@/components/ui/KPICard';
import { Card, SectionTitle, Badge, EvidenceBadge, ProgressBar } from '@/components/ui';
import { kpis, trainees } from '@/data/mockData';

const evidencePieData = [
  { name: 'Self-Reported', value: trainees.filter((t) => t.evidence === 'Self-Reported').length, color: '#9ca3af' },
  { name: 'Evidence-Supported', value: trainees.filter((t) => t.evidence === 'Evidence-Supported').length, color: '#3380fc' },
  { name: 'Employer-Verified', value: trainees.filter((t) => t.evidence === 'Employer-Verified').length, color: '#10b981' },
  { name: 'Under Review', value: trainees.filter((t) => t.evidence === 'Under Review').length, color: '#f59e0b' },
];

const employmentBreakdown = [
  { type: 'Placed (Relevant)', count: trainees.filter((t) => t.jobRelevance === 'High' || t.jobRelevance === 'Moderate').length, color: '#10b981' },
  { type: 'Placed (Low Relevance)', count: trainees.filter((t) => t.employmentStatus === 'Placed' && t.jobRelevance === 'Low').length, color: '#f59e0b' },
  { type: 'Self-Employed', count: trainees.filter((t) => t.isSelfEmployed).length, color: '#8b5cf6' },
  { type: 'Apprenticeship', count: trainees.filter((t) => t.isApprenticeship).length, color: '#f43f5e' },
  { type: 'Unplaced', count: trainees.filter((t) => t.employmentStatus === 'Unplaced').length, color: '#ef4444' },
];

export function Outcomes() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Outcomes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Employment outcomes with evidence states and follow-up coverage</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Placed" value={kpis.traineesPlaced} icon={<Briefcase className="h-5 w-5" />} numerator={kpis.traineesPlaced} denominator={kpis.totalTrainees} color="emerald" />
        <KPICard title="Self-Employed" value={kpis.traineesSelfEmployed} icon={<ShoppingBag className="h-5 w-5" />} numerator={kpis.traineesSelfEmployed} denominator={kpis.totalTrainees} color="amber" />
        <KPICard title="Apprenticeship" value={kpis.traineesApprenticeship} icon={<Wrench className="h-5 w-5" />} numerator={kpis.traineesApprenticeship} denominator={kpis.totalTrainees} color="violet" />
        <KPICard title="Relevant Employment" value={kpis.relevantEmploymentRate} unit="%" icon={<Target className="h-5 w-5" />} numerator={kpis.traineesRelevant} denominator={kpis.totalTrainees} color="brand" />
      </div>

      {/* Important note */}
      <Card className="border-l-4 border-l-brand-400 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-brand-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Missing follow-up ≠ unemployed.</p>
            <p className="text-gray-500 dark:text-gray-400">
              Follow-up coverage: {kpis.followUpCoverage}% of trainees responded to all follow-ups. Metrics below show numerator/denominator for transparency.
              Trainees with no follow-up response are classified as "Unknown" — not "Unplaced."
            </p>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Employment Breakdown" icon={<Briefcase className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={employmentBreakdown} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={2}>
                {employmentBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Evidence States" subtitle="Verification breakdown" icon={<FileCheck className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={evidencePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={2}>
                {evidencePieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {evidencePieData.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: e.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{e.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{e.value} trainees</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Outcome table */}
      <Card className="overflow-hidden">
        <div className="p-5 pb-0">
          <SectionTitle title="Trainee Outcomes Detail" subtitle="All trainees with evidence and follow-up status" icon={<Target className="h-5 w-5" />} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Trainee</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Salary</th>
                <th className="px-4 py-3 font-medium">Relevance</th>
                <th className="px-4 py-3 font-medium">Retention</th>
                <th className="px-4 py-3 font-medium">Evidence</th>
                <th className="px-4 py-3 font-medium">Follow-ups</th>
              </tr>
            </thead>
            <tbody>
              {trainees.map((t) => {
                const responded = t.followUps.filter((f) => f.responded).length;
                return (
                  <tr key={t.id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{t.name}</td>
                    <td className="px-4 py-3">
                      <Badge color={t.employmentStatus === 'Placed' ? 'emerald' : t.employmentStatus === 'Self-Employed' ? 'amber' : t.employmentStatus === 'Apprenticeship' ? 'violet' : 'rose'}>
                        {t.employmentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.salary ? `₹${t.salary.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="px-4 py-3">
                      {t.jobRelevance ? <Badge color={t.jobRelevance === 'High' ? 'emerald' : t.jobRelevance === 'Moderate' ? 'amber' : 'rose'} size="sm">{t.jobRelevance}</Badge> : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.isRetained ? `${t.retentionMonths}mo` : 'Pending'}</td>
                    <td className="px-4 py-3"><EvidenceBadge state={t.evidence} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{responded}/4</span>
                        <div className="w-16"><ProgressBar value={responded} max={4} color={responded === 4 ? 'emerald' : responded >= 2 ? 'amber' : 'rose'} /></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
