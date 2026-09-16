import {
  TrendingUp, Clock, IndianRupee, ArrowUpRight,
  Briefcase, Activity,
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { trainees, wageProgression, employmentRetentionTrend } from '@/data/mockData';

const retentionByCohort = [
  { cohort: 'Cohort 2025-A', month1: 100, month3: 95, month6: 88, month12: 72 },
  { cohort: 'Cohort 2025-B', month1: 100, month3: 92, month6: 80, month12: null },
  { cohort: 'Cohort 2025-C', month1: 100, month3: 90, month6: null, month12: null },
];

const progressionData = [
  { stage: 'Entry-level', count: 15, avgSalary: 18000 },
  { stage: 'Mid-level (6mo+)', count: 8, avgSalary: 22500 },
  { stage: 'Senior (12mo+)', count: 4, avgSalary: 28000 },
  { stage: 'Promoted', count: 2, avgSalary: 32000 },
];

export function RetentionProgression() {
  const retainedTrainees = trainees.filter((t) => t.isRetained);
  const droppedTrainees = trainees.filter((t) => t.employmentStatus === 'Placed' && !t.isRetained);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Retention & Progression</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Employment retention, salary growth, and career progression tracking</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500"><TrendingUp className="h-4 w-4" /> 6-Month Retention</div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">44%</p>
          <p className="text-xs text-gray-400">{retainedTrainees.length}/{trainees.filter((t) => t.employmentStatus === 'Placed').length} placed trainees</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500"><Clock className="h-4 w-4" /> Avg. Retention</div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">6.2<span className="text-lg text-gray-400">mo</span></p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500"><ArrowUpRight className="h-4 w-4" /> Wage Growth</div>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">+35%</p>
          <p className="text-xs text-gray-400">Month 1 → Month 12</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500"><Briefcase className="h-4 w-4" /> Promotions</div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">2</p>
          <p className="text-xs text-gray-400">of {retainedTrainees.length} retained</p>
        </Card>
      </div>

      {/* Retention trend */}
      <Card className="p-5">
        <SectionTitle title="Retention Trend Over Time" subtitle="Employment retention curve month by month" icon={<TrendingUp className="h-5 w-5" />} />
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={employmentRetentionTrend} margin={{ left: -10, right: 10 }}>
            <defs>
              <linearGradient id="retArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} unit="%" />
            <Tooltip />
            <Area type="monotone" dataKey="retention" stroke="#8b5cf6" strokeWidth={2} fill="url(#retArea)" name="Retention %" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Wage + Retention by cohort */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Wage Progression" subtitle="Average wage vs market median" icon={<IndianRupee className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={wageProgression} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              <Legend />
              <Line type="monotone" dataKey="wage" stroke="#3380fc" strokeWidth={2} name="Trainee Wage" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="market" stroke="#14b8a6" strokeWidth={2} strokeDasharray="5 5" name="Market Median" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Trainee wages remain ~8-12% below market median throughout the first year. Gap narrows with experience.
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Retention by Cohort" subtitle="Follow-up retention at key milestones" icon={<Clock className="h-5 w-5" />} />
          <div className="space-y-4">
            {retentionByCohort.map((c) => (
              <div key={c.cohort} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.cohort}</p>
                <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
                  <div><p className="text-gray-400">1mo</p><p className="font-bold text-gray-900 dark:text-white">{c.month1}%</p></div>
                  <div><p className="text-gray-400">3mo</p><p className="font-bold text-gray-900 dark:text-white">{c.month3}%</p></div>
                  <div><p className="text-gray-400">6mo</p><p className="font-bold text-gray-900 dark:text-white">{c.month6 ?? '—'}</p></div>
                  <div><p className="text-gray-400">12mo</p><p className="font-bold text-gray-900 dark:text-white">{c.month12 ?? '—'}</p></div>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-400">"—" means follow-up period not yet reached for this cohort.</p>
          </div>
        </Card>
      </div>

      {/* Progression */}
      <Card className="p-5">
        <SectionTitle title="Career Progression Distribution" subtitle="Where trainees are in their career journey" icon={<Activity className="h-5 w-5" />} />
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={progressionData} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="stage" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Trainees" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Retained vs Dropped */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Retained Trainees" subtitle="Still employed after 6+ months" icon={<TrendingUp className="h-5 w-5" />} />
          <div className="space-y-2">
            {retainedTrainees.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.jobRole} • {t.retentionMonths}mo</p>
                </div>
                <Badge color="emerald" size="sm">Retained</Badge>
              </div>
            ))}
            {retainedTrainees.length === 0 && <p className="text-sm text-gray-500">No retained trainees yet.</p>}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Retention Drop-offs" subtitle="Left employment before 6 months" icon={<Clock className="h-5 w-5" />} />
          <div className="space-y-2">
            {droppedTrainees.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">Lasted {t.retentionMonths}mo • {t.jobRole}</p>
                </div>
                <Badge color="rose" size="sm">Dropped</Badge>
              </div>
            ))}
            {droppedTrainees.length === 0 && <p className="text-sm text-gray-500">No drop-offs detected.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
