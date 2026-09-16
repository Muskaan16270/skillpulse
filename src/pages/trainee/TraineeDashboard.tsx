import { useState } from 'react';
import {
  Award, Briefcase, TrendingUp, Clock, FileCheck,
  CheckCircle2, XCircle, AlertTriangle, BadgeCheck,
  GraduationCap, MapPin, IndianRupee, Calendar, Edit3,
  User, ShieldCheck, History, Share2, Building2,
  Upload, FileText,
} from 'lucide-react';
import { Card, SectionTitle, Badge, EvidenceBadge, ProgressBar } from '@/components/ui';
import { KPICard } from '@/components/ui/KPICard';
import { useTrainee, type VerificationStatus } from '@/context/TraineeContext';
import { UpdateOutcomeModal } from '@/pages/trainee/UpdateOutcomeModal';
import { FollowUpTimeline } from '@/pages/trainee/FollowUpTimeline';
import { trainingStatusColors } from '@/data/mockData';
import type { TraineePageKey } from '@/components/TraineeSidebar';

export function TraineeDashboard({ traineeId, onNavigate }: { traineeId: string; onNavigate?: (page: TraineePageKey) => void }) {
  const { trainee, outcomeUpdate, updateVerificationStatus, uploadEvidence } = useTrainee();
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

  const givenConsents = trainee.consentRecords.filter((c) => c.status === 'Given').length;
  const totalConsents = trainee.consentRecords.length;
  const consentRate = Math.round((givenConsents / totalConsents) * 100);

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

      {/* Quick Actions */}
      <Card className="p-5">
        <SectionTitle title="Quick Actions" subtitle="Jump to common tasks" icon={<Share2 className="h-5 w-5" />} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <QuickAction icon={<User className="h-5 w-5" />} label="View Profile" onClick={() => onNavigate?.('profile')} />
          <QuickAction icon={<GraduationCap className="h-5 w-5" />} label="View Training" onClick={() => onNavigate?.('profile')} />
          <QuickAction icon={<ShieldCheck className="h-5 w-5" />} label="Give / Manage Consent" onClick={() => onNavigate?.('privacy')} />
          <QuickAction icon={<Edit3 className="h-5 w-5" />} label="Submit Follow-up" onClick={() => setShowUpdateModal(true)} />
          <QuickAction icon={<History className="h-5 w-5" />} label="Follow-up History" onClick={() => onNavigate?.('dashboard')} />
          <QuickAction icon={<Briefcase className="h-5 w-5" />} label="Update Outcome" onClick={() => setShowUpdateModal(true)} />
        </div>
      </Card>

      {/* Training Status & Consent Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Training Status" icon={<GraduationCap className="h-5 w-5" />} />
          <div className="flex items-center justify-between">
            <div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${trainingStatusColors[trainee.trainingStatus]}`}>
                {trainee.trainingStatus}
              </span>
              <p className="mt-2 text-sm text-gray-500">{trainee.courseName}</p>
              <p className="text-xs text-gray-400">{trainee.providerName} • {trainee.trainingCentre}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Certificate</p>
              <Badge color={trainee.certified ? 'emerald' : 'amber'}>{trainee.certified ? 'Certified' : 'Pending'}</Badge>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Consent Status" icon={<ShieldCheck className="h-5 w-5" />} />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{givenConsents}/{totalConsents}</p>
              <p className="text-xs text-gray-500">Consents given</p>
            </div>
            <div className="flex-1 ml-4">
              <ProgressBar value={consentRate} color={consentRate >= 80 ? 'emerald' : consentRate >= 50 ? 'amber' : 'rose'} showLabel />
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('privacy')}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Manage consent settings
          </button>
        </Card>
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

      {/* My Current Outcome (self-reported) */}
      {outcomeUpdate && (
        <Card className={`border-l-4 p-5 ${
          outcomeUpdate.verificationStatus === 'Verified' ? 'border-l-emerald-400'
          : outcomeUpdate.verificationStatus === 'Evidence Submitted' ? 'border-l-brand-400'
          : outcomeUpdate.verificationStatus === 'Under Review' ? 'border-l-amber-400'
          : outcomeUpdate.verificationStatus === 'Needs Update' ? 'border-l-rose-400'
          : 'border-l-gray-300'
        }`}>
          <div className="flex items-start justify-between">
            <SectionTitle title="My Self-Reported Outcome" subtitle={`Submitted on ${outcomeUpdate.submittedAt}`} icon={<CheckCircle2 className="h-5 w-5" />} />
            <VerificationBadge status={outcomeUpdate.verificationStatus} />
          </div>
          <div className="mb-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              outcomeUpdate.employmentStatus === 'Placed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              : outcomeUpdate.employmentStatus === 'Self-Employed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              : outcomeUpdate.employmentStatus === 'Apprenticeship' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
              : outcomeUpdate.employmentStatus === 'Higher Education' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
              : outcomeUpdate.employmentStatus === 'Further Training' ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
            }`}>
              {outcomeUpdate.employmentStatus}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {outcomeUpdate.jobTitle && <DetailRow label="Job Title" value={outcomeUpdate.jobTitle} icon={<Briefcase className="h-4 w-4" />} />}
            {outcomeUpdate.employer && <DetailRow label="Employer" value={outcomeUpdate.employer} icon={<Building2 className="h-4 w-4" />} />}
            {outcomeUpdate.employmentType && <DetailRow label="Employment Type" value={outcomeUpdate.employmentType} />}
            {outcomeUpdate.joiningDate && <DetailRow label="Joining Date" value={outcomeUpdate.joiningDate} icon={<Calendar className="h-4 w-4" />} />}
            {outcomeUpdate.jobLocation && <DetailRow label="Location" value={outcomeUpdate.jobLocation} icon={<MapPin className="h-4 w-4" />} />}
            {outcomeUpdate.salaryRange && <DetailRow label="Salary Range" value={outcomeUpdate.salaryRange} icon={<IndianRupee className="h-4 w-4" />} />}
            {outcomeUpdate.businessType && <DetailRow label="Business Type" value={outcomeUpdate.businessType} icon={<Briefcase className="h-4 w-4" />} />}
            {outcomeUpdate.startDate && <DetailRow label="Start Date" value={outcomeUpdate.startDate} icon={<Calendar className="h-4 w-4" />} />}
            {outcomeUpdate.incomeRange && <DetailRow label="Income Range" value={outcomeUpdate.incomeRange} icon={<IndianRupee className="h-4 w-4" />} />}
            {outcomeUpdate.organization && <DetailRow label="Organization" value={outcomeUpdate.organization} icon={<Building2 className="h-4 w-4" />} />}
            {outcomeUpdate.role && <DetailRow label="Role" value={outcomeUpdate.role} icon={<Briefcase className="h-4 w-4" />} />}
            {outcomeUpdate.stipend && <DetailRow label="Stipend" value={outcomeUpdate.stipend} icon={<IndianRupee className="h-4 w-4" />} />}
            {outcomeUpdate.apprenticeshipStatus && <DetailRow label="Apprenticeship Status" value={outcomeUpdate.apprenticeshipStatus} />}
            {outcomeUpdate.courseName && <DetailRow label="Programme" value={outcomeUpdate.courseName} icon={<GraduationCap className="h-4 w-4" />} />}
            {outcomeUpdate.institutionName && <DetailRow label="Institution" value={outcomeUpdate.institutionName} icon={<Building2 className="h-4 w-4" />} />}
            {outcomeUpdate.location && <DetailRow label="Location" value={outcomeUpdate.location} icon={<MapPin className="h-4 w-4" />} />}
            {outcomeUpdate.jobRelevance && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Training Relevance</span>
                <Badge color={outcomeUpdate.jobRelevance === 'High' ? 'emerald' : outcomeUpdate.jobRelevance === 'Moderate' ? 'amber' : 'rose'} size="sm">{outcomeUpdate.jobRelevance}</Badge>
              </div>
            )}
          </div>

          {/* Verification & Evidence Section */}
          <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Verification Status</span>
              </div>
              <VerificationBadge status={outcomeUpdate.verificationStatus} />
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>Submitted: {outcomeUpdate.submittedAt}</span>
              <span>Evidence: {outcomeUpdate.evidenceDocuments.length > 0 ? `${outcomeUpdate.evidenceDocuments.length} document(s)` : 'None submitted'}</span>
            </div>

            {/* Evidence documents list */}
            {outcomeUpdate.evidenceDocuments.length > 0 && (
              <div className="mt-3 space-y-2">
                {outcomeUpdate.evidenceDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{doc.fileName}</span>
                    <span className="ml-auto text-xs text-gray-400">{doc.fileType}</span>
                    <span className="text-xs text-gray-400">{doc.uploadedAt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Upload evidence button */}
            {outcomeUpdate.verificationStatus !== 'Verified' && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => uploadEvidence(`evidence_doc_${Date.now()}.pdf`, 'PDF')}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-brand-300 px-4 py-2 text-sm text-brand-600 transition hover:bg-brand-50 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/20"
                >
                  <Upload className="h-4 w-4" /> Upload Evidence (Simulated)
                </button>
                {outcomeUpdate.verificationStatus === 'Needs Update' && (
                  <span className="text-xs text-rose-600 dark:text-rose-400">Action required: please update your outcome</span>
                )}
              </div>
            )}

            {/* Self-reported vs verified distinction */}
            <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${
              outcomeUpdate.verificationStatus === 'Verified'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                : outcomeUpdate.verificationStatus === 'Self-Reported'
                ? 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
            }`}>
              {outcomeUpdate.verificationStatus === 'Verified'
                ? 'VERIFIED — This outcome has been verified by an administrator/verifier.'
                : outcomeUpdate.verificationStatus === 'Self-Reported'
                ? 'SELF-REPORTED — This outcome has not been verified. Data shown above is self-reported by the trainee.'
                : outcomeUpdate.verificationStatus === 'Evidence Submitted'
                ? 'EVIDENCE SUBMITTED — Documents have been submitted and are awaiting review.'
                : outcomeUpdate.verificationStatus === 'Under Review'
                ? 'UNDER REVIEW — A verifier is currently reviewing this outcome.'
                : 'NEEDS UPDATE — A verifier has requested an update. Please edit and resubmit your outcome.'}
            </div>
          </div>
        </Card>
      )}

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

function VerificationBadge({ status }: { status: VerificationStatus }) {
  const config: Record<VerificationStatus, { bg: string; text: string; icon: React.ReactNode }> = {
    'Self-Reported': { bg: 'bg-gray-100 dark:bg-gray-800/50', text: 'text-gray-600 dark:text-gray-400', icon: <FileText className="h-3.5 w-3.5" /> },
    'Evidence Submitted': { bg: 'bg-brand-100 dark:bg-brand-900/30', text: 'text-brand-700 dark:text-brand-300', icon: <Upload className="h-3.5 w-3.5" /> },
    'Under Review': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', icon: <Clock className="h-3.5 w-3.5" /> },
    'Verified': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    'Needs Update': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text}`}>
      {c.icon} {status}
    </span>
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

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-3 text-center transition hover:border-brand-300 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-700 dark:hover:bg-brand-900/20"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">{icon}</span>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  );
}
