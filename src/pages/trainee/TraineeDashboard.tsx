import { useState } from 'react';
import {
  Award, Briefcase, TrendingUp, Clock, FileCheck,
  CheckCircle2, XCircle, AlertTriangle, BadgeCheck,
  GraduationCap, MapPin, IndianRupee, Calendar, Edit3,
} from 'lucide-react';
import { Card, SectionTitle, Badge, EvidenceBadge, ProgressBar } from '@/components/ui';
import { KPICard } from '@/components/ui/KPICard';
import { useTrainee } from '@/context/TraineeContext';
import { UpdateOutcomeModal } from '@/pages/trainee/UpdateOutcomeModal';
import { FollowUpTimeline } from '@/pages/trainee/FollowUpTimeline';

export function TraineeDashboard({ traineeId }: { traineeId: string }) {
  const { trainee, outcomeUpdate } = useTrainee();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const placementStatus = trainee.employmentStatus === 'Placed'
    ? { label: 'Placed', color: 'emerald' as const }
    : trainee.employmentStatus === 'Self-Employed'
    ? { label: 'Self-Employed', color: 'amber' as const }
    : trainee.employmentStatus === 'Apprenticeship'
    ? { label: 'Apprenticeship', color: 'violet' as const }
    : { label: 'Seeking Employment', color: 'rose' as const };

  const respondedCount = trainee.followUps.filter((f) => f.responded).length;
  const completedFollowUps = trainee.followUps.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {trainee.name}</p>
        </div>
        <div className="flex items-center gap-3">
          {outcomeUpdate && (
            <Badge color="emerald" size="sm"><CheckCircle2 className="mr-1 h-3 w-3" /> Outcome Self-Reported</Badge>
          )}
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            <Edit3 className="h-4 w-4" /> Update My Outcome
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Employment Status"
          value={placementStatus.label}
          icon={<Briefcase className="h-5 w-5" />}
          color={placementStatus.color}
        />
        <KPICard
          title="Skill Readiness Index"
          value={trainee.skillReadinessScore}
          unit="/100"
          icon={<TrendingUp className="h-5 w-5" />}
          color="brand"
        />
        <KPICard
          title="Evidence Level"
          value={trainee.evidence === 'Employer-Verified' ? 'Verified' : trainee.evidence === 'Evidence-Supported' ? 'Supported' : trainee.evidence === 'Under Review' ? 'Pending' : 'Self-Reported'}
          icon={<FileCheck className="h-5 w-5" />}
          color={trainee.evidence === 'Employer-Verified' ? 'emerald' : trainee.evidence === 'Evidence-Supported' ? 'brand' : 'amber'}
        />
        <KPICard
          title="Follow-ups Responded"
          value={`${respondedCount}/${completedFollowUps}`}
          icon={<Clock className="h-5 w-5" />}
          color={respondedCount >= 3 ? 'emerald' : 'amber'}
        />
      </div>

      {/* Training & Certification */}
      <Card className="p-5">
        <SectionTitle title="Training & Certifications" subtitle="Your training history and certification status" icon={<Award className="h-5 w-5" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{trainee.courseName}</span>
              <Badge color={trainee.certified ? 'emerald' : 'amber'} size="sm">{trainee.certified ? 'Certified' : 'Pending'}</Badge>
            </div>
            <p className="mt-2 text-xs text-gray-500">{trainee.providerName}</p>
            <p className="text-xs text-gray-400">{trainee.cohort}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{trainee.certification}</span>
              <Badge color={trainee.certified ? 'emerald' : 'amber'} size="sm">{trainee.certified ? 'Completed' : 'Pending'}</Badge>
            </div>
            <p className="mt-2 text-xs text-gray-500">Certification date: {trainee.certified ? '2025-04-20' : 'Pending'}</p>
            <p className="text-xs text-gray-400">Evidence: <EvidenceBadge state={trainee.certified ? 'Employer-Verified' : 'Under Review'} /></p>
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-5">
        <SectionTitle title="My Skills" subtitle="Skills acquired through training" icon={<TrendingUp className="h-5 w-5" />} />
        <div className="flex flex-wrap gap-2">
          {trainee.skills.map((skill) => (
            <div key={skill} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
              <BadgeCheck className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{skill}</span>
              <Badge color="emerald" size="sm">Verified</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Employment Status & Relevant Employment */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Employment Status" icon={<Briefcase className="h-5 w-5" />} />
          <dl className="space-y-3 text-sm">
            <DetailRow label="Status" value={trainee.employmentStatus} />
            <DetailRow label="Job Role" value={trainee.jobRole || 'Not yet placed'} icon={<Briefcase className="h-4 w-4" />} />
            <DetailRow label="Industry" value={trainee.industry || '—'} />
            <DetailRow label="Location" value={trainee.jobLocation || '—'} icon={<MapPin className="h-4 w-4" />} />
            <DetailRow label="Joining Date" value={trainee.joiningDate || '—'} icon={<Calendar className="h-4 w-4" />} />
            <DetailRow label="Salary Range" value={trainee.salaryRange || '—'} icon={<IndianRupee className="h-4 w-4" />} />
          </dl>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Relevant Employment" subtitle="How relevant is your job to your training?" icon={<TrendingUp className="h-5 w-5" />} />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Job Relevance</span>
              {trainee.jobRelevance ? (
                <Badge color={trainee.jobRelevance === 'High' ? 'emerald' : trainee.jobRelevance === 'Moderate' ? 'amber' : 'rose'}>
                  {trainee.jobRelevance}
                </Badge>
              ) : <span className="text-gray-400">Not applicable</span>}
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-500">Skill Match Rate</p>
              <ProgressBar value={trainee.skillReadinessScore} color={trainee.skillReadinessScore > 70 ? 'emerald' : 'amber'} showLabel />
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-500">Retention</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {trainee.isRetained ? `${trainee.retentionMonths} months` : 'Pending'}
                </span>
                {trainee.isRetained ? (
                  <Badge color="emerald" size="sm"><CheckCircle2 className="mr-1 h-3 w-3" /> Retained</Badge>
                ) : (
                  <Badge color="amber" size="sm"><Clock className="mr-1 h-3 w-3" /> In Progress</Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Evidence/Verification Status */}
      <Card className="p-5">
        <SectionTitle title="Evidence & Verification" subtitle="Current verification status of your outcome" icon={<FileCheck className="h-5 w-5" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800/50">
            <FileCheck className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Current Evidence</p>
            <div className="mt-1 flex justify-center"><EvidenceBadge state={trainee.evidence} /></div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800/50">
            {trainee.evidence === 'Employer-Verified' || trainee.evidence === 'Evidence-Supported' ? (
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
            ) : (
              <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" />
            )}
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Verification</p>
            <p className="mt-1 text-xs text-gray-500">
              {trainee.evidence === 'Employer-Verified' ? 'Employer verified (SIMULATED)' : trainee.evidence === 'Evidence-Supported' ? 'Documents provided' : 'Verification pending'}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800/50">
            <BadgeCheck className="mx-auto h-8 w-8 text-brand-500" />
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Skill Passport</p>
            <p className="mt-1 text-xs text-gray-500">Active — {trainee.unifiedId}</p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          DEMO DATA — Employer verification shown here is simulated for prototype demonstration only.
        </p>
      </Card>

      {/* Follow-Up Timeline */}
      <FollowUpTimeline />

      {/* Retention & Progression */}
      <Card className="p-5">
        <SectionTitle title="Retention & Progression" subtitle="Your employment stability and career growth" icon={<TrendingUp className="h-5 w-5" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Retention Duration</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{trainee.isRetained ? `${trainee.retentionMonths} mo` : 'Pending'}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Current Salary</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{trainee.salary ? `₹${trainee.salary.toLocaleString('en-IN')}` : '—'}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Progression</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{trainee.isRetained ? 'Monitoring' : '—'}</p>
          </div>
        </div>
      </Card>

      {/* Skill Readiness Breakdown */}
      <Card className="p-5">
        <SectionTitle title="Skill Readiness Index Breakdown" subtitle="How your readiness score is calculated — transparent factors" icon={<TrendingUp className="h-5 w-5" />} />
        <div className="space-y-3">
          {trainee.skillReadinessBreakdown.map((factor) => (
            <div key={factor.factor}>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{factor.factor}</span>
                  <span className="ml-2 text-xs text-gray-400">({factor.weight}% weight)</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{factor.score}/100</span>
              </div>
              <div className="mt-1"><ProgressBar value={factor.score} color={factor.score > 70 ? 'emerald' : factor.score > 50 ? 'amber' : 'rose'} /></div>
              <p className="mt-0.5 text-xs text-gray-400">{factor.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">Prototype Indicator — Not an Official Government Score</p>
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
