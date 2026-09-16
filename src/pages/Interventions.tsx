import { useState } from 'react';
import {
  Wrench, Plus, X, CheckCircle2, Clock, Circle,
  Target, TrendingUp,
} from 'lucide-react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { interventions as initialInterventions, type Intervention } from '@/data/mockData';

const statusConfig = {
  Proposed: { color: 'gray' as const, icon: <Circle className="h-4 w-4" /> },
  'In Progress': { color: 'amber' as const, icon: <Clock className="h-4 w-4" /> },
  Completed: { color: 'emerald' as const, icon: <CheckCircle2 className="h-4 w-4" /> },
};

export function Interventions() {
  const [interventions, setInterventions] = useState<Intervention[]>(initialInterventions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    problem: '',
    diagnosis: '',
    action: '',
    owner: '',
    targetMetric: '',
    baseline: '',
    target: '',
    cohortApplied: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIntervention: Intervention = {
      id: `INT-${String(interventions.length + 1).padStart(3, '0')}`,
      problem: form.problem,
      diagnosis: form.diagnosis,
      action: form.action,
      owner: form.owner,
      targetMetric: form.targetMetric,
      baseline: Number(form.baseline),
      target: Number(form.target),
      status: 'Proposed',
      date: new Date().toISOString().split('T')[0],
      cohortApplied: form.cohortApplied,
      linkedCohort: null,
    };
    setInterventions([...interventions, newIntervention]);
    setForm({ problem: '', diagnosis: '', action: '', owner: '', targetMetric: '', baseline: '', target: '', cohortApplied: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Intervention Memory</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track problems, actions, and targets — connect to next-cohort learning</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'New Intervention'}
        </button>
      </div>

      {/* New intervention form */}
      {showForm && (
        <Card className="p-5 animate-slide-up">
          <SectionTitle title="Create Intervention" subtitle="Define problem, action, owner, and target metric" icon={<Wrench className="h-5 w-5" />} />
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Problem" required>
              <input type="text" required value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} className={inputClass} placeholder="e.g., Low relevant employment (57%)" />
            </FormField>
            <FormField label="Diagnosis" required>
              <input type="text" required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} className={inputClass} placeholder="e.g., Curriculum lacks Cloud and Power BI modules" />
            </FormField>
            <FormField label="Proposed Action" required>
              <input type="text" required value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} className={inputClass} placeholder="e.g., Add Power BI practical module" />
            </FormField>
            <FormField label="Owner" required>
              <input type="text" required value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className={inputClass} placeholder="e.g., Training Provider" />
            </FormField>
            <FormField label="Target Metric" required>
              <input type="text" required value={form.targetMetric} onChange={(e) => setForm({ ...form, targetMetric: e.target.value })} className={inputClass} placeholder="e.g., Relevant Employment Rate" />
            </FormField>
            <FormField label="Baseline (%)" required>
              <input type="number" required value={form.baseline} onChange={(e) => setForm({ ...form, baseline: e.target.value })} className={inputClass} placeholder="57" />
            </FormField>
            <FormField label="Target (%)" required>
              <input type="number" required value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className={inputClass} placeholder="70" />
            </FormField>
            <FormField label="Cohort Applied To" required>
              <input type="text" required value={form.cohortApplied} onChange={(e) => setForm({ ...form, cohortApplied: e.target.value })} className={inputClass} placeholder="e.g., Cohort 2025-C" />
            </FormField>
            <div className="sm:col-span-2">
              <button type="submit" className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700">
                Create Intervention
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Intervention cards */}
      <div className="space-y-4">
        {interventions.map((int) => {
          const progress = int.status === 'Completed' ? 100 : int.status === 'In Progress' ? 50 : 0;
          const improvement = int.status === 'Completed' ? 11 : 0;
          return (
            <Card key={int.id} className="p-5 animate-slide-up">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                {/* Left: problem + action */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">{int.id}</span>
                    <Badge color={statusConfig[int.status].color}>
                      <span className="flex items-center gap-1">{statusConfig[int.status].icon} {int.status}</span>
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Problem</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{int.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Diagnosis</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{int.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Proposed Action</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{int.action}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div><span className="text-gray-500">Owner:</span> <span className="font-medium text-gray-900 dark:text-white">{int.owner}</span></div>
                    <div><span className="text-gray-500">Cohort:</span> <span className="font-medium text-gray-900 dark:text-white">{int.cohortApplied}</span></div>
                    <div><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-900 dark:text-white">{int.date}</span></div>
                  </div>
                </div>

                {/* Right: metric tracking */}
                <div className="lg:w-72 space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <Target className="h-4 w-4 text-brand-500" />
                    {int.targetMetric}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Baseline</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{int.baseline}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Target</p>
                      <p className="text-lg font-bold text-brand-600 dark:text-brand-400">{int.target}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Progress</p>
                      <p className={`text-lg font-bold ${improvement > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                        {improvement > 0 ? `+${improvement}` : '—'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <ProgressBar value={progress} color={int.status === 'Completed' ? 'emerald' : int.status === 'In Progress' ? 'amber' : 'gray'} />
                  </div>
                  {int.linkedCohort && (
                    <div className="flex items-center gap-2 rounded-md bg-brand-50 px-3 py-2 dark:bg-brand-900/20">
                      <TrendingUp className="h-4 w-4 text-brand-500" />
                      <span className="text-xs text-brand-700 dark:text-brand-300">
                        Linked to {int.linkedCohort} for comparison
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Example */}
      <Card className="p-5 border-l-4 border-l-accent-400">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Example Intervention</h3>
        <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Problem</p>
            <p className="font-medium text-gray-900 dark:text-white">Low relevant employment</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Action</p>
            <p className="font-medium text-gray-900 dark:text-white">Add Power BI practical module</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Baseline → Target</p>
            <p className="font-medium text-gray-900 dark:text-white">57% → 70%</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <p className="text-xs text-gray-500">Next Cohort Result</p>
            <p className="font-medium text-emerald-600 dark:text-emerald-400">68% (+11pp observed)</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white';

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}
