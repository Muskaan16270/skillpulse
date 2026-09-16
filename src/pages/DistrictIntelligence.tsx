import {
  MapPin, TrendingUp, AlertTriangle, Building2,
  GraduationCap, Briefcase,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { districtData } from '@/data/mockData';

const employmentChart = districtData.map((d) => ({
  district: d.district,
  trained: d.traineesTrained,
  placed: d.traineesPlaced,
  outcome: d.employmentOutcome,
}));

export function DistrictIntelligence() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">District Intelligence</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Training supply vs labour-market demand by district</p>
      </div>

      {/* Map placeholder + employment outcomes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Employment Outcome by District" subtitle="Placement % and trainee counts" icon={<Briefcase className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employmentChart} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="district" stroke="#9ca3af" fontSize={11} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="trained" fill="#3380fc" radius={[4, 4, 0, 0]} name="Trained" />
              <Bar dataKey="placed" fill="#10b981" radius={[4, 4, 0, 0]} name="Placed" />
              <Bar dataKey="outcome" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Outcome %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SectionTitle title="District Skill Demand" subtitle="High-demand skills across districts" icon={<TrendingUp className="h-5 w-5" />} />
          <div className="space-y-3">
            {districtData.map((d) => (
              <div key={d.district} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
                    <MapPin className="h-4 w-4 text-brand-500" /> {d.district}
                  </span>
                  <Badge color={d.employmentOutcome > 80 ? 'emerald' : d.employmentOutcome > 70 ? 'amber' : 'rose'} size="sm">
                    {d.employmentOutcome}% outcome
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {d.highDemandSkills.slice(0, 4).map((s) => (
                    <span key={s} className="rounded-md bg-brand-50 px-2 py-0.5 text-xs text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* District detail cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {districtData.map((d) => {
          const coverage = d.traineesTrained > 0 ? Math.round((d.traineesPlaced / d.traineesTrained) * 100) : 0;
          return (
            <Card key={d.district} className="p-5 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-brand-500" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{d.district}</h3>
                    <p className="text-xs text-gray-500">{d.state}</p>
                  </div>
                </div>
                {d.traineesTrained === 0 && <Badge color="amber" size="sm">No Training</Badge>}
              </div>

              {/* Supply vs Demand */}
              <div className="mt-4 space-y-3">
                <div>
                  <p className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase"><TrendingUp className="h-3 w-3" /> High-Demand Skills</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {d.highDemandSkills.map((s) => (
                      <span key={s} className="rounded-md bg-brand-100 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase"><GraduationCap className="h-3 w-3" /> Training Available</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {d.trainingAvailable.length > 0 ? d.trainingAvailable.map((s) => (
                      <span key={s} className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{s}</span>
                    )) : <span className="text-xs text-gray-400">No training programs</span>}
                  </div>
                </div>

                <div>
                  <p className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase"><AlertTriangle className="h-3 w-3" /> Skill Shortages</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {d.shortages.map((s) => (
                      <span key={s} className="rounded-md bg-rose-100 px-2 py-0.5 text-xs text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Trained</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{d.traineesTrained}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Placed</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{d.traineesPlaced}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Outcome</p>
                  <p className="text-lg font-bold text-brand-600 dark:text-brand-400">{d.employmentOutcome}%</p>
                </div>
              </div>

              {d.traineesTrained > 0 && (
                <div className="mt-3">
                  <ProgressBar value={coverage} color={coverage > 80 ? 'emerald' : 'amber'} />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Insight */}
      <Card className="p-5 border-l-4 border-l-accent-400">
        <div className="flex items-start gap-3">
          <Building2 className="h-5 w-5 shrink-0 text-accent-500" />
          <div className="text-sm">
            <h3 className="font-bold text-gray-900 dark:text-white">Key Insight: Training-Demand Mismatch</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Indore and Jaipur have significant demand for skills (Power BI, Python) but no training programs available.
              Pune and Bengaluru have better alignment but still lack Cloud (AWS) training despite 88% demand. Expanding training to underserved districts and adding high-demand modules could improve regional outcomes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
