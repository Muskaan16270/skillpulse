import { useState } from 'react';
import {
  Wrench, Plus, X, CheckCircle2, Clock, Circle,
  Target, TrendingUp, User, FileText, Briefcase,
  BookOpen, PhoneCall, ShieldCheck,
} from 'lucide-react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { interventions as initialInterventions, type Intervention, type EarlyWarning } from '@/data/mockData';

const statusConfig = {
  Proposed: { color: 'gray' as const, icon: <Circle className="h-4 w-4" /> },
  'In Progress': { color: 'amber' as const, icon: <Clock className="h-4 w-4" /> },
  Completed: { color: 'emerald' as const, icon: <CheckCircle2 className="h-4 w-4" /> },
};

const interventionTypeIcons: Record<string, React.ReactNode> = {
  'Recommend Additional Training': <BookOpen className="h-4 w-4" />,
  'Assisted Follow-up': <PhoneCall className="h-4 w-4" />,
  'Show Job Opportunities': <Briefcase className="h-4 w-4" />,
  'Request Evidence': <FileText className="h-4 w-4" />,
  'Workplace Mentorship': <ShieldCheck className="h-4 w-4" />,
  'Re-placement Support': <Briefcase className="h-4 w-4" />,
  'Curriculum Update': <BookOpen className="h-4 w-4" />,
  'Outcome Verification': <ShieldCheck className="h-4 w-4" />,
};

const interventionTypes = [
  'Recommend Additional Training',
  'Assisted Follow-up',
  'Show Job Opportunities',
  'Request Evidence',
  'Workplace Mentorship',
  'Re-placement Support',
  'Curriculum Update',
  'Outcome Verification',
];

interface InterventionsProps {
  pendingFromWarning?: EarlyWarning | null;
}

export function Interventions({ pendingFromWarning }: InterventionsProps = {}) {
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
    interventionType: '',
    assignedPerson: '',
    traineeId: '',
    traineeName: '',
    linkedWarningId: '',
  });

  // Pre-fill from warning when navigated from EarlyWarning page
  useState(() => {
    if (pendingFromWarning) {
      setForm({
        problem: pendingFromWarning.type,
        diagnosis: pendingFromWarning.reason,
        action: pendingFromWarning.recommendation,
        owner: '',
        targetMetric: '',
        baseline: '',
        target: '',
        cohortApplied: '',
        interventionType: pendingFromWarning.interventionType || '',
        assignedPerson: '',
        traineeId: pendingFromWarning.traineeId,
        traineeName: pendingFromWarning.traineeName,
        linkedWarningId: pendingFromWarning.id,
      });
      setShowForm(true);
    }
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
      baseline: Number(form.baseline) || 0,
      target: Number(form.target) || 0,
      status: 'Proposed',
      date: new Date().toISOString().split('T')[0],
      cohortApplied: form.cohortApplied || 'Individual Trainee',
      linkedCohort: null,
      interventionType: form.interventionType,
      assignedPerson: form.assignedPerson,
      traineeId: form.traineeId || undefined,
      traineeName: form.traineeName || undefined,
      linkedWarningId: form.linkedWarningId || undefined,
    };
    setInterventions([newIntervention, ...interventions]);
    setForm({ problem: '', diagnosis: '', action: '', owner: '', targetMetric: '', baseline: '', target: '', cohortApplied: '', interventionType: '', assignedPerson: '', traineeId: '', traineeName: '', linkedWarningId: '' });
    setShowForm(false);
  };

  const handleStatusChange = (id: string, status: Intervention['status']) => {
    setInterventions(interventions.map((int) => int.id === id ? { ...int, status } : int));
  };

  const handleResultChange = (id: string, result: string) => {
    setInterventions(interventions.map((int) => int.id === id ? { ...int, result } : int));
  };

  // Summary stats
  const inProgress = interventions.filter((i) => i.status === 'In Progress');
  const completed = interventions.filter((i) => i.status === 'Completed');
  const proposed = interventions.filter((i) => i.status === 'Proposed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interventions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage interventions linked to early warnings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'New Intervention'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-gray-400" />
            <p className="text-xs text-gray-500">Proposed</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{proposed.length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <p className="text-xs text-gray-500">In Progress</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{inProgress.length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completed.length}</p>
        </Card>
      </div>

      {/* New intervention form */}
      {showForm && (
        <Card className="p-5 animate-slide-up border-l-4 border-l-brand-400">
          <SectionTitle title="Create Intervention" subtitle="Define the problem, action, owner, and tracking details" icon={<Wrench className="h-5 w-5" />} />
          {form.linkedWarningId && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 dark:bg-brand-900/20">
              <ShieldCheck className="h-4 w-4 text-brand-500" />
              <span className="text-xs text-brand-700 dark:text-brand-300">
                Linked to warning {form.linkedWarningId} for trainee {form.traineeName}
              </span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Intervention Type" required>
              <select required value={form.interventionType} onChange={(e) => setForm({ ...form, interventionType: e.target.value })} className={inputClass}>
                <option value="">Select type…</option>
                {interventionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Problem" required>
              <input type="text" required value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} className={inputClass} placeholder="e.g., No follow-up response" />
            </FormField>
            <FormField label="Diagnosis" required>
              <input type="text" required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} className={inputClass} placeholder="e.g., Trainee has not responded to 2 follow-ups" />
            </FormField>
            <FormField label="Proposed Action" required>
              <input type="text" required value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} className={inputClass} placeholder="e.g., Initiate assisted follow-up via field staff" />
            </FormField>
            <FormField label="Assigned Person" required>
              <input type="text" required value={form.assignedPerson} onChange={(e) => setForm({ ...form, assignedPerson: e.target.value })} className={inputClass} placeholder="e.g., Sneha Joshi (Field Coordinator)" />
            </FormField>
            <FormField label="Owner / Provider" required>
              <input type="text" required value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className={inputClass} placeholder="e.g., TechSkill Academy" />
            </FormField>
            <FormField label="Target Metric" required>
              <input type="text" required value={form.targetMetric} onChange={(e) => setForm({ ...form, targetMetric: e.target.value })} className={inputClass} placeholder="e.g., Follow-up Response Rate" />
            </FormField>
            <FormField label="Baseline (%)" required>
              <input type="number" required value={form.baseline} onChange={(e) => setForm({ ...form, baseline: e.target.value })} className={inputClass} placeholder="50" />
            </FormField>
            <FormField label="Target (%)" required>
              <input type="number" required value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className={inputClass} placeholder="85" />
            </FormField>
            <FormField label="Cohort / Trainee">
              <input type="text" value={form.cohortApplied} onChange={(e) => setForm({ ...form, cohortApplied: e.target.value })} className={inputClass} placeholder="e.g., Cohort 2025-C or trainee name" />
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">{int.id}</span>
                    <Badge color={statusConfig[int.status].color}>
                      <span className="flex items-center gap-1">{statusConfig[int.status].icon} {int.status}</span>
                    </Badge>
                    {int.interventionType && (
                      <Badge color="brand" size="sm">
                        <span className="flex items-center gap-1">
                          {interventionTypeIcons[int.interventionType] || <Wrench className="h-3 w-3" />}
                          {int.interventionType}
                        </span>
                      </Badge>
                    )}
                    {int.linkedWarningId && (
                      <Badge color="amber" size="sm">From: {int.linkedWarningId}</Badge>
                    )}
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

                  {/* Tracking details */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div><span className="text-gray-500">Owner:</span> <span className="font-medium text-gray-900 dark:text-white">{int.owner}</span></div>
                    <div><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-900 dark:text-white">{int.date}</span></div>
                    {int.assignedPerson && (
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-500">Assigned:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{int.assignedPerson}</span>
                      </div>
                    )}
                    {int.traineeName && (
                      <div><span className="text-gray-500">Trainee:</span> <span className="font-medium text-gray-900 dark:text-white">{int.traineeName}</span></div>
                    )}
                    <div><span className="text-gray-500">Cohort:</span> <span className="font-medium text-gray-900 dark:text-white">{int.cohortApplied}</span></div>
                  </div>

                  {/* Result tracking */}
                  {int.result && (
                    <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                      <p className="text-xs font-semibold text-emerald-600 uppercase">Result</p>
                      <p className="mt-0.5 text-sm text-emerald-700 dark:text-emerald-300">{int.result}</p>
                    </div>
                  )}

                  {/* Status + result controls */}
                  <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Status:</span>
                      <select
                        value={int.status}
                        onChange={(e) => handleStatusChange(int.id, e.target.value as Intervention['status'])}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        <option value="Proposed">Proposed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      defaultValue={int.result || ''}
                      onBlur={(e) => handleResultChange(int.id, e.target.value)}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      placeholder="Add result notes…"
                    />
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
