import { useState } from 'react';
import {
  X, Briefcase, MapPin, Calendar, IndianRupee, TrendingUp,
  CheckCircle2, AlertTriangle, Building2, GraduationCap, User,
} from 'lucide-react';
import { Card } from '@/components/ui';
import { useTrainee, type OutcomeUpdate, type OutcomeStatus } from '@/context/TraineeContext';

interface UpdateOutcomeModalProps {
  open: boolean;
  onClose: () => void;
  periodLabel?: string;
}

const STATUS_OPTIONS: { value: OutcomeStatus; label: string }[] = [
  { value: 'Placed', label: 'Employed' },
  { value: 'Self-Employed', label: 'Self-Employed' },
  { value: 'Apprenticeship', label: 'Apprentice' },
  { value: 'Higher Education', label: 'Higher Education' },
  { value: 'Further Training', label: 'Further Training' },
  { value: 'Looking for Work', label: 'Looking for Work' },
  { value: 'Not Currently Working', label: 'Not Working' },
];

export function UpdateOutcomeModal({ open, onClose, periodLabel }: UpdateOutcomeModalProps) {
  const { updateOutcome, updateFollowUp } = useTrainee();
  const [status, setStatus] = useState<OutcomeStatus>('Placed');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Employment fields
  const [jobTitle, setJobTitle] = useState('');
  const [employer, setEmployer] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [employmentType, setEmploymentType] = useState<NonNullable<OutcomeUpdate['employmentType']>>('Full-time');
  const [salaryRange, setSalaryRange] = useState('');

  // Self-employment fields
  const [businessType, setBusinessType] = useState('');
  const [selfStartDate, setSelfStartDate] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [selfLocation, setSelfLocation] = useState('');

  // Apprenticeship fields
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [apprenticeStartDate, setApprenticeStartDate] = useState('');
  const [stipend, setStipend] = useState('');
  const [apprenticeStatus, setApprenticeStatus] = useState<NonNullable<OutcomeUpdate['apprenticeshipStatus']>>('Ongoing');

  // Higher education / Further training fields
  const [courseName, setCourseName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [eduLocation, setEduLocation] = useState('');

  // Shared
  const [jobRelevance, setJobRelevance] = useState<NonNullable<OutcomeUpdate['jobRelevance']>>('High');

  if (!open) return null;

  const needsNoDetails = status === 'Looking for Work' || status === 'Not Currently Working';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];

    if (status === 'Placed') {
      if (!jobTitle.trim()) errs.push('Job title is required');
      if (!employer.trim()) errs.push('Employer is required');
      if (!joiningDate) errs.push('Joining date is required');
      if (!jobLocation.trim()) errs.push('Location is required');
      if (!salaryRange.trim()) errs.push('Salary range is required');
    } else if (status === 'Self-Employed') {
      if (!businessType.trim()) errs.push('Work/business type is required');
      if (!selfStartDate) errs.push('Start date is required');
      if (!incomeRange.trim()) errs.push('Income range is required');
      if (!selfLocation.trim()) errs.push('Location is required');
    } else if (status === 'Apprenticeship') {
      if (!organization.trim()) errs.push('Organization is required');
      if (!role.trim()) errs.push('Role is required');
      if (!apprenticeStartDate) errs.push('Start date is required');
      if (!stipend.trim()) errs.push('Stipend is required');
    } else if (status === 'Higher Education' || status === 'Further Training') {
      if (!courseName.trim()) errs.push('Course/programme name is required');
      if (!institutionName.trim()) errs.push('Institution is required');
    }

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const record: OutcomeUpdate = {
      employmentStatus: status,
      jobRelevance,
      // Legacy compat
      jobRole: jobTitle || businessType || role || courseName || '',
      industry: employer || organization || institutionName || '',
      salaryRangeLegacy: salaryRange || incomeRange || stipend || '',
      jobLocationLegacy: jobLocation || selfLocation || eduLocation || '',
    };

    if (status === 'Placed') {
      record.jobTitle = jobTitle;
      record.employer = employer;
      record.joiningDate = joiningDate;
      record.jobLocation = jobLocation;
      record.employmentType = employmentType;
      record.salaryRange = salaryRange;
    } else if (status === 'Self-Employed') {
      record.businessType = businessType;
      record.startDate = selfStartDate;
      record.incomeRange = incomeRange;
      record.location = selfLocation;
    } else if (status === 'Apprenticeship') {
      record.organization = organization;
      record.role = role;
      record.startDate = apprenticeStartDate;
      record.stipend = stipend;
      record.apprenticeshipStatus = apprenticeStatus;
    } else if (status === 'Higher Education' || status === 'Further Training') {
      record.courseName = courseName;
      record.institutionName = institutionName;
      record.location = eduLocation;
    }

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
        <Card className="max-w-md p-8">
          <div className="flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">Outcome Updated Successfully</h3>
            {periodLabel && (
              <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">{periodLabel} Follow-Up</p>
            )}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your outcome has been submitted as <span className="font-semibold text-gray-900 dark:text-white">Self-Reported</span>. It will appear on your {periodLabel ? 'timeline' : 'profile and dashboard'} immediately.
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
      <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update My Outcome{periodLabel ? ` — ${periodLabel}` : ''}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Report your current status{periodLabel ? ' for this follow-up stage' : ''}</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Status Selection */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Status</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {STATUS_OPTIONS.map((opt) => (
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

            {/* EMPLOYED fields */}
            {status === 'Placed' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Job Title" required>
                    <InputWithIcon icon={<Briefcase className="h-4 w-4" />} value={jobTitle} onChange={setJobTitle} placeholder="e.g., Junior Data Analyst" />
                  </Field>
                  <Field label="Employer" required>
                    <InputWithIcon icon={<Building2 className="h-4 w-4" />} value={employer} onChange={setEmployer} placeholder="e.g., TCS" />
                  </Field>
                  <Field label="Joining Date" required>
                    <InputWithIcon icon={<Calendar className="h-4 w-4" />} type="date" value={joiningDate} onChange={setJoiningDate} />
                  </Field>
                  <Field label="Employment Type">
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value as NonNullable<OutcomeUpdate['employmentType']>)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </Field>
                </div>
                <Field label="Location" required>
                  <InputWithIcon icon={<MapPin className="h-4 w-4" />} value={jobLocation} onChange={setJobLocation} placeholder="e.g., Pune, Maharashtra" />
                </Field>
                <Field label="Salary / Wage Range (monthly)" required>
                  <InputWithIcon icon={<IndianRupee className="h-4 w-4" />} value={salaryRange} onChange={setSalaryRange} placeholder="e.g., ₹12,000 - ₹18,000" />
                </Field>
                <Field label="Training Relevance">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <select
                      value={jobRelevance}
                      onChange={(e) => setJobRelevance(e.target.value as NonNullable<OutcomeUpdate['jobRelevance']>)}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="High">High — Directly matches my training</option>
                      <option value="Moderate">Moderate — Partially related to my training</option>
                      <option value="Low">Low — Unrelated to my training</option>
                    </select>
                  </div>
                </Field>
              </div>
            )}

            {/* SELF-EMPLOYED fields */}
            {status === 'Self-Employed' && (
              <div className="space-y-4">
                <Field label="Work / Business Type" required>
                  <InputWithIcon icon={<Briefcase className="h-4 w-4" />} value={businessType} onChange={setBusinessType} placeholder="e.g., Tailoring shop, Mobile repair" />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Start Date" required>
                    <InputWithIcon icon={<Calendar className="h-4 w-4" />} type="date" value={selfStartDate} onChange={setSelfStartDate} />
                  </Field>
                  <Field label="Income Range (monthly)" required>
                    <InputWithIcon icon={<IndianRupee className="h-4 w-4" />} value={incomeRange} onChange={setIncomeRange} placeholder="e.g., ₹8,000 - ₹15,000" />
                  </Field>
                </div>
                <Field label="Location" required>
                  <InputWithIcon icon={<MapPin className="h-4 w-4" />} value={selfLocation} onChange={setSelfLocation} placeholder="e.g., Pune, Maharashtra" />
                </Field>
                <Field label="Training Relevance">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <select
                      value={jobRelevance}
                      onChange={(e) => setJobRelevance(e.target.value as NonNullable<OutcomeUpdate['jobRelevance']>)}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="High">High — Directly matches my training</option>
                      <option value="Moderate">Moderate — Partially related to my training</option>
                      <option value="Low">Low — Unrelated to my training</option>
                    </select>
                  </div>
                </Field>
              </div>
            )}

            {/* APPRENTICESHIP fields */}
            {status === 'Apprenticeship' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Organization" required>
                    <InputWithIcon icon={<Building2 className="h-4 w-4" />} value={organization} onChange={setOrganization} placeholder="e.g., Maruti Suzuki" />
                  </Field>
                  <Field label="Role" required>
                    <InputWithIcon icon={<User className="h-4 w-4" />} value={role} onChange={setRole} placeholder="e.g., Apprentice Technician" />
                  </Field>
                  <Field label="Start Date" required>
                    <InputWithIcon icon={<Calendar className="h-4 w-4" />} type="date" value={apprenticeStartDate} onChange={setApprenticeStartDate} />
                  </Field>
                  <Field label="Stipend (monthly)" required>
                    <InputWithIcon icon={<IndianRupee className="h-4 w-4" />} value={stipend} onChange={setStipend} placeholder="e.g., ₹5,000" />
                  </Field>
                </div>
                <Field label="Apprenticeship Status">
                  <select
                    value={apprenticeStatus}
                    onChange={(e) => setApprenticeStatus(e.target.value as NonNullable<OutcomeUpdate['apprenticeshipStatus']>)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </Field>
                <Field label="Training Relevance">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <select
                      value={jobRelevance}
                      onChange={(e) => setJobRelevance(e.target.value as NonNullable<OutcomeUpdate['jobRelevance']>)}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="High">High — Directly matches my training</option>
                      <option value="Moderate">Moderate — Partially related to my training</option>
                      <option value="Low">Low — Unrelated to my training</option>
                    </select>
                  </div>
                </Field>
              </div>
            )}

            {/* HIGHER EDUCATION / FURTHER TRAINING fields */}
            {(status === 'Higher Education' || status === 'Further Training') && (
              <div className="space-y-4">
                <Field label={status === 'Higher Education' ? 'Degree / Programme' : 'Training Programme'} required>
                  <InputWithIcon icon={<GraduationCap className="h-4 w-4" />} value={courseName} onChange={setCourseName} placeholder={status === 'Higher Education' ? 'e.g., B.Tech Computer Science' : 'e.g., Advanced Python Certification'} />
                </Field>
                <Field label="Institution" required>
                  <InputWithIcon icon={<Building2 className="h-4 w-4" />} value={institutionName} onChange={setInstitutionName} placeholder="e.g., IIT Mumbai" />
                </Field>
                <Field label="Location">
                  <InputWithIcon icon={<MapPin className="h-4 w-4" />} value={eduLocation} onChange={setEduLocation} placeholder="e.g., Mumbai, Maharashtra" />
                </Field>
              </div>
            )}

            {/* LOOKING FOR WORK / NOT WORKING */}
            {needsNoDetails && (
              <div className="rounded-lg bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {status === 'Looking for Work'
                      ? 'Your status will be recorded as "Looking for Work." No employment details are required — you can update this when you find a role.'
                      : 'Your status will be recorded as "Not Currently Working." You can update this when your situation changes.'}
                  </p>
                </div>
              </div>
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

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}{required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function InputWithIcon({
  icon, value, onChange, placeholder, type = 'text',
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        placeholder={placeholder}
      />
    </div>
  );
}
