import { useState } from 'react';
import {
  User, GraduationCap, Award, Briefcase, MapPin,
  Calendar, IndianRupee, BadgeCheck, AlertTriangle,
  CheckCircle2, Edit3, Phone, Mail, Building,
} from 'lucide-react';
import { Card, SectionTitle, Badge, EvidenceBadge } from '@/components/ui';
import { useTrainee } from '@/context/TraineeContext';
import { UpdateOutcomeModal } from '@/pages/trainee/UpdateOutcomeModal';
import { trainingStatusColors } from '@/data/mockData';

export function TraineeProfile({ traineeId }: { traineeId: string }) {
  const { trainee, outcomeUpdate } = useTrainee();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your personal, training, and employment details</p>
      </div>

      {/* Header card */}
      <Card className="p-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl font-bold text-white">
              {trainee.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{trainee.name}</h3>
              <p className="text-sm text-gray-500">{trainee.unifiedId}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                <Badge color="brand">{trainee.cohort}</Badge>
                <Badge color={trainee.employmentStatus === 'Placed' ? 'emerald' : trainee.employmentStatus === 'Self-Employed' ? 'amber' : trainee.employmentStatus === 'Apprenticeship' ? 'violet' : 'rose'}>
                  {trainee.employmentStatus}
                </Badge>
                {trainee.warnings.length > 0 && <Badge color="amber"><AlertTriangle className="mr-1 h-3 w-3" />{trainee.warnings.length} alerts</Badge>}
                {outcomeUpdate && <Badge color="brand"><CheckCircle2 className="mr-1 h-3 w-3" /> Self-Reported Update</Badge>}
              </div>
              {outcomeUpdate && (
                <p className="mt-1 text-xs text-gray-400">Last updated: {outcomeUpdate.submittedAt}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-xs text-gray-500">Skill Readiness Index</p>
              <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{trainee.skillReadinessScore}<span className="text-lg text-gray-400">/100</span></p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Prototype Indicator</p>
            </div>
            <button
              onClick={() => setShowUpdateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              <Edit3 className="h-4 w-4" /> Update My Outcome
            </button>
          </div>
        </div>
      </Card>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal */}
        <Card className="p-5">
          <SectionTitle title="Personal & Education" icon={<User className="h-5 w-5" />} />
          <dl className="space-y-3 text-sm">
            <DetailRow label="Trainee ID" value={trainee.unifiedId} icon={<BadgeCheck className="h-4 w-4" />} />
            <DetailRow label="Date of Birth" value={trainee.dateOfBirth} icon={<Calendar className="h-4 w-4" />} />
            <DetailRow label="Gender" value={trainee.gender} />
            <DetailRow label="Phone" value={trainee.phone} icon={<Phone className="h-4 w-4" />} />
            <DetailRow label="Email" value={trainee.email} icon={<Mail className="h-4 w-4" />} />
            <DetailRow label="District" value={`${trainee.district}, ${trainee.state}`} icon={<MapPin className="h-4 w-4" />} />
            <DetailRow label="Education" value={trainee.education} icon={<GraduationCap className="h-4 w-4" />} />
            <DetailRow label="Institution" value={trainee.institution} icon={<Building className="h-4 w-4" />} />
          </dl>
        </Card>

        {/* Training & Certification */}
        <Card className="p-5">
          <SectionTitle title="Training & Certification" icon={<Award className="h-5 w-5" />} />
          <dl className="space-y-3 text-sm">
            <DetailRow label="Programme" value={trainee.cohort} />
            <DetailRow label="Course" value={trainee.courseName} />
            <DetailRow label="Training Provider" value={trainee.providerName} />
            <DetailRow label="Training Centre" value={trainee.trainingCentre} icon={<Building className="h-4 w-4" />} />
            <DetailRow label="Start Date" value={trainee.startDate} icon={<Calendar className="h-4 w-4" />} />
            <DetailRow label="Completion Date" value={trainee.completionDate} icon={<Calendar className="h-4 w-4" />} />
            <DetailRow label="Certification" value={trainee.certification} />
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Training Status</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${trainingStatusColors[trainee.trainingStatus]}`}>
                {trainee.trainingStatus}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Certified</span>
              <Badge color={trainee.certified ? 'emerald' : 'amber'}>{trainee.certified ? 'Yes' : 'Pending'}</Badge>
            </div>
          </dl>
        </Card>

        {/* Employment */}
        <Card className="p-5">
          <SectionTitle title="Employment" icon={<Briefcase className="h-5 w-5" />} />
          <dl className="space-y-3 text-sm">
            <DetailRow label="Status" value={trainee.employmentStatus} />
            <DetailRow label="Job Role" value={trainee.jobRole || '—'} />
            <DetailRow label="Industry" value={trainee.industry || '—'} />
            <DetailRow label="Job Location" value={trainee.jobLocation || '—'} icon={<MapPin className="h-4 w-4" />} />
            <DetailRow label="Joining Date" value={trainee.joiningDate || '—'} icon={<Calendar className="h-4 w-4" />} />
            <DetailRow label="Salary Range" value={trainee.salaryRange || '—'} icon={<IndianRupee className="h-4 w-4" />} />
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Job Relevance</span>
              {trainee.jobRelevance ? <Badge color={trainee.jobRelevance === 'High' ? 'emerald' : trainee.jobRelevance === 'Moderate' ? 'amber' : 'rose'}>{trainee.jobRelevance}</Badge> : <span className="text-gray-400">—</span>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Retention</span>
              <span className="font-medium text-gray-900 dark:text-white">{trainee.isRetained ? `${trainee.retentionMonths} months` : 'Pending'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Evidence</span>
              <EvidenceBadge state={trainee.evidence} />
            </div>
          </dl>
        </Card>

        {/* Skills */}
        <Card className="p-5">
          <SectionTitle title="Verified Skills" icon={<BadgeCheck className="h-5 w-5" />} />
          <div className="flex flex-wrap gap-2">
            {trainee.skills.map((s) => (
              <div key={s} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                <BadgeCheck className="h-4 w-4 text-brand-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{s}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Data notice */}
      <Card className="border-l-4 border-l-amber-400 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Your data is synthetic demo data.</p>
            <p className="text-gray-500 dark:text-gray-400">
              This is a prototype. No real Aadhaar, phone numbers, or personal documents are stored. All data shown here is simulated for demonstration purposes.
            </p>
          </div>
        </div>
      </Card>

      <UpdateOutcomeModal open={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
    </div>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">
        {icon && <span className="text-gray-400">{icon}</span>}
        {value}
      </span>
    </div>
  );
}
