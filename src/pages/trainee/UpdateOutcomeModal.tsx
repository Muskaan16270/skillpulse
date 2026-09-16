import { useState } from 'react';
import { X, Briefcase, MapPin, Calendar, IndianRupee, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui';
import { useTrainee, type OutcomeUpdate } from '@/context/TraineeContext';

interface UpdateOutcomeModalProps {
  open: boolean;
  onClose: () => void;
  periodLabel?: string;
}

export function UpdateOutcomeModal({ open, onClose, periodLabel }: UpdateOutcomeModalProps) {
  const { updateOutcome, updateFollowUp } = useTrainee();
  const [status, setStatus] = useState<OutcomeUpdate['employmentStatus']>('Placed');
  const [jobRole, setJobRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobRelevance, setJobRelevance] = useState<OutcomeUpdate['jobRelevance']>('High');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const isUnplaced = status === 'Unplaced';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!isUnplaced) {
      if (!jobRole.trim()) errs.push('Job role is required');
      if (!industry.trim()) errs.push('Industry is required');
      if (!joiningDate) errs.push('Joining date is required');
      if (!salaryRange.trim()) errs.push('Salary range is required');
      if (!jobLocation.trim()) errs.push('Location is required');
    }
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    const record = { employmentStatus: status, jobRole, industry, joiningDate, salaryRange, jobLocation, jobRelevance };
    if (periodLabel) {
      updateFollowUp(periodLabel, record);
    } else {
      updateOutcome(record);
    }
    setErrors([]);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrors([]);
    onClose();
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
        <Card className="max-w-md p-8" >
          <div className="flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">Outcome Updated Successfully</h3>
            {periodLabel && (
              <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">{periodLabel} Follow-Up</p>
            )}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your employment outcome has been submitted as <span className="font-semibold text-gray-900 dark:text-white">Self-Reported</span>. It will appear on your {periodLabel ? 'timeline' : 'profile and dashboard'} immediately.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Your employer can verify this later. Until then, the evidence level shows "Self-Reported."
            </p>
            <button
              onClick={handleClose}
              className="mt-6 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              View Updated Outcome
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
      <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" >
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update My Outcome{periodLabel ? ` — ${periodLabel}` : ''}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Report your current employment status{periodLabel ? ' for this follow-up stage' : ''}</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Status */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Status</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {([
                  { value: 'Placed', label: 'Employed' },
                  { value: 'Self-Employed', label: 'Self-Employed' },
                  { value: 'Apprenticeship', label: 'Apprenticeship' },
                  { value: 'Unplaced', label: 'Still Searching' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setStatus(opt.value); setErrors([]); }}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      status === opt.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-300'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {isUnplaced ? (
              <div className="rounded-lg bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Your status will be recorded as "Still Searching." No employment details are required — you can update this when you find a role.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Job Role</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={jobRole}
                        onChange={(e) => { setJobRole(e.target.value); setErrors([]); }}
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder="e.g., Junior Data Analyst"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Industry</label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => { setIndustry(e.target.value); setErrors([]); }}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., IT Services"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Joining Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={joiningDate}
                        onChange={(e) => { setJoiningDate(e.target.value); setErrors([]); }}
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Salary Range</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={salaryRange}
                        onChange={(e) => { setSalaryRange(e.target.value); setErrors([]); }}
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder="e.g., ₹12,000 - ₹18,000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={jobLocation}
                      onChange={(e) => { setJobLocation(e.target.value); setErrors([]); }}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., Pune, Maharashtra"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Training Relevance</label>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <select
                      value={jobRelevance}
                      onChange={(e) => setJobRelevance(e.target.value as OutcomeUpdate['jobRelevance'])}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="High">High — Directly matches my training</option>
                      <option value="Moderate">Moderate — Partially related to my training</option>
                      <option value="Low">Low — Unrelated to my training</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {errors.length > 0 && (
              <div className="rounded-lg bg-rose-50 px-4 py-3 dark:bg-rose-900/20">
                <ul className="space-y-1 text-sm text-rose-600 dark:text-rose-400">
                  {errors.map((err) => <li key={err}>{err}</li>)}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Submit Update
              </button>
            </div>
          </form>

          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            DEMO DATA — This update is stored in-memory only and resets when you log out. No real data is sent anywhere.
          </p>
        </div>
      </Card>
    </div>
  );
}
