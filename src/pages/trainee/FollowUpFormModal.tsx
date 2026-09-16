import { useState } from 'react';
import {
  X, Briefcase, MapPin, IndianRupee, CheckCircle2, AlertTriangle,
  TrendingUp, GraduationCap, MessageSquare, Send,
} from 'lucide-react';
import { Card } from '@/components/ui';
import { useTrainee, type OutcomeUpdate } from '@/context/TraineeContext';
import type { FollowUpFormResponse } from '@/data/mockData';

interface FollowUpFormModalProps {
  open: boolean;
  onClose: () => void;
  periodLabel?: string;
}

export function FollowUpFormModal({ open, onClose, periodLabel }: FollowUpFormModalProps) {
  const { updateFollowUp, updateOutcome } = useTrainee();
  const [currentStatus, setCurrentStatus] = useState<FollowUpFormResponse['currentStatus']>('Employed');
  const [occupation, setOccupation] = useState('');
  const [employer, setEmployer] = useState('');
  const [location, setLocation] = useState('');
  const [wageRange, setWageRange] = useState('');
  const [usingSkills, setUsingSkills] = useState<'yes' | 'no' | 'partial'>('yes');
  const [needsTraining, setNeedsTraining] = useState<'yes' | 'no'>('no');
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const isNotWorking = currentStatus === 'Not currently working' || currentStatus === 'Looking for work';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!isNotWorking && !occupation.trim()) errs.push('Occupation is required');
    if (!isNotWorking && !location.trim()) errs.push('Location is required');
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const formResponse: FollowUpFormResponse = {
      currentStatus,
      occupation: isNotWorking ? '' : occupation,
      employer: isNotWorking ? '' : employer,
      location,
      wageRange: isNotWorking ? '' : wageRange,
      usingSkills: usingSkills === 'yes',
      needsTraining: needsTraining === 'yes',
      comments,
    };

    // Map to OutcomeUpdate for context
    const mappedStatus: OutcomeUpdate['employmentStatus'] =
      currentStatus === 'Employed' || currentStatus === 'Self-employed' ? (currentStatus === 'Self-employed' ? 'Self-Employed' : 'Placed')
      : currentStatus === 'Apprentice' ? 'Apprenticeship'
      : 'Unplaced';

    const outcomeRecord: OutcomeUpdate = {
      employmentStatus: mappedStatus,
      jobRole: occupation,
      industry: employer,
      joiningDate: '',
      salaryRange: wageRange,
      jobLocation: location,
      jobRelevance: usingSkills === 'yes' ? 'High' : usingSkills === 'partial' ? 'Moderate' : 'Low',
    };

    if (periodLabel) {
      updateFollowUp(periodLabel, outcomeRecord);
    } else {
      updateOutcome(outcomeRecord);
    }

    setErrors([]);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrors([]);
    setCurrentStatus('Employed');
    setOccupation('');
    setEmployer('');
    setLocation('');
    setWageRange('');
    setUsingSkills('yes');
    setNeedsTraining('no');
    setComments('');
    onClose();
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
        <Card className="max-w-md p-8">
          <div className="flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">Follow-Up Submitted</h3>
            {periodLabel && (
              <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">{periodLabel} Follow-Up</p>
            )}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your follow-up response has been recorded as <span className="font-semibold text-gray-900 dark:text-white">Self-Reported</span>.
              It will appear on your timeline immediately.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              No real WhatsApp/SMS/email was sent. This is a simulated follow-up for demonstration.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              View Updated Timeline
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
      <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Follow-Up Form{periodLabel ? ` — ${periodLabel}` : ''}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tell us about your current employment status and how your training is helping you
              </p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Current Status */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Status</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {([
                  { value: 'Employed', label: 'Employed' },
                  { value: 'Self-employed', label: 'Self-Employed' },
                  { value: 'Apprentice', label: 'Apprentice' },
                  { value: 'Studying', label: 'Studying' },
                  { value: 'Looking for work', label: 'Looking for work' },
                  { value: 'Not currently working', label: 'Not Working' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setCurrentStatus(opt.value); setErrors([]); }}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      currentStatus === opt.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-300'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {!isNotWorking && (
              <>
                {/* Occupation */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Occupation / Job Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => { setOccupation(e.target.value); setErrors([]); }}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., Junior Data Analyst"
                    />
                  </div>
                </div>

                {/* Employer */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Employer / Business Name</label>
                  <input
                    type="text"
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., TCS, Self-owned tailoring shop"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => { setLocation(e.target.value); setErrors([]); }}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., Pune, Maharashtra"
                    />
                  </div>
                </div>

                {/* Wage Range */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Income / Wage Range (monthly)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={wageRange}
                      onChange={(e) => setWageRange(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., ₹12,000 – ₹18,000"
                    />
                  </div>
                </div>

                {/* Using Skills */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Are you using the skills from your training?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: 'yes', label: 'Yes, directly' },
                      { value: 'partial', label: 'Partially' },
                      { value: 'no', label: 'No' },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setUsingSkills(opt.value)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                          usingSkills === opt.value
                            ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-300'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Needs Training */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Do you need additional training or upskilling?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'yes', label: 'Yes, I need more training' },
                  { value: 'no', label: "No, I'm comfortable" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNeedsTraining(opt.value)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      needsTraining === opt.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-300'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Comments (optional)</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Any additional information about your current situation..."
                />
              </div>
            </div>

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
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                <Send className="h-4 w-4" /> Submit Follow-Up
              </button>
            </div>
          </form>

          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            DEMO DATA — This form is stored in-memory only. No real WhatsApp/SMS/email is sent. Data resets on logout.
          </p>
        </div>
      </Card>
    </div>
  );
}
