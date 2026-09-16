import { useState } from 'react';
import {
  X, FileText, CheckCircle2, AlertTriangle, Clock, Upload, ShieldCheck,
  ChevronRight, FileCheck,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import type { VerificationStatus } from '@/context/TraineeContext';

export interface EvidenceReviewData {
  traineeId: string;
  traineeName: string;
  employmentStatus: string;
  jobTitle?: string;
  employer?: string;
  salaryRange?: string;
  jobLocation?: string;
  joiningDate?: string;
  submittedAt: string;
  verificationStatus: VerificationStatus;
  evidenceDocuments: { id: string; fileName: string; fileType: string; uploadedAt: string }[];
  verifierNotes?: string;
  reviewedAt?: string;
}

const STATUS_FLOW: VerificationStatus[] = [
  'Self-Reported',
  'Evidence Submitted',
  'Under Review',
  'Verified',
  'Needs Update',
];

const statusConfig: Record<VerificationStatus, { color: 'gray' | 'brand' | 'amber' | 'emerald' | 'rose'; icon: React.ReactNode; desc: string }> = {
  'Self-Reported': { color: 'gray', icon: <FileText className="h-4 w-4" />, desc: 'Trainee has submitted their outcome without supporting documents.' },
  'Evidence Submitted': { color: 'brand', icon: <Upload className="h-4 w-4" />, desc: 'Trainee has uploaded evidence documents awaiting review.' },
  'Under Review': { color: 'amber', icon: <Clock className="h-4 w-4" />, desc: 'A verifier is currently reviewing the submitted evidence.' },
  'Verified': { color: 'emerald', icon: <CheckCircle2 className="h-4 w-4" />, desc: 'Outcome has been verified by an admin/verifier. A VERIFIED badge is now shown.' },
  'Needs Update': { color: 'rose', icon: <AlertTriangle className="h-4 w-4" />, desc: 'Verifier has requested the trainee to update or resubmit their outcome.' },
};

interface EvidenceReviewModalProps {
  open: boolean;
  onClose: () => void;
  data: EvidenceReviewData | null;
  onStatusChange: (traineeId: string, status: VerificationStatus, notes: string) => void;
}

export function EvidenceReviewModal({ open, onClose, data, onStatusChange }: EvidenceReviewModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | null>(null);
  const [notes, setNotes] = useState('');

  if (!open || !data) return null;

  const currentStatus = selectedStatus || data.verificationStatus;
  const currentNotes = notes !== '' ? notes : (data.verifierNotes || '');

  const handleSave = () => {
    onStatusChange(data.traineeId, currentStatus, currentNotes);
    onClose();
  };

  const handleClose = () => {
    setSelectedStatus(null);
    setNotes('');
    onClose();
  };

  const config = statusConfig[currentStatus];
  const currentIndex = STATUS_FLOW.indexOf(data.verificationStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
        <div onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Evidence Review</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Review outcome submission for <span className="font-medium text-gray-700 dark:text-gray-300">{data.traineeName}</span>
              </p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Outcome details */}
          <div className="mt-5 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Outcome Details</span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem label="Employment Status" value={data.employmentStatus} />
              {data.jobTitle && <DetailItem label="Job Title" value={data.jobTitle} />}
              {data.employer && <DetailItem label="Employer" value={data.employer} />}
              {data.salaryRange && <DetailItem label="Salary Range" value={data.salaryRange} />}
              {data.jobLocation && <DetailItem label="Location" value={data.jobLocation} />}
              {data.joiningDate && <DetailItem label="Joining Date" value={data.joiningDate} />}
              <DetailItem label="Submitted On" value={data.submittedAt} />
            </div>
          </div>

          {/* Current verification status with flow */}
          <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Verification Flow</span>
            </div>

            {/* Flow visualization */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {STATUS_FLOW.map((s, i) => {
                const isCurrent = data.verificationStatus === s;
                const isPast = i < currentIndex;
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      isCurrent ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                      : isPast ? 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-500'
                      : 'bg-gray-50 text-gray-400 dark:bg-gray-800/20 dark:text-gray-600'
                    }`}>
                      {isPast && <CheckCircle2 className="h-3 w-3" />}
                      {s}
                    </span>
                    {i < STATUS_FLOW.length - 1 && <ChevronRight className="h-3 w-3 text-gray-300 dark:text-gray-600" />}
                  </div>
                );
              })}
            </div>

            {/* Current status description */}
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              {config.icon}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{currentStatus}</span>
                  <Badge color={config.color} size="sm">{currentStatus === 'Verified' ? 'VERIFIED' : currentStatus === 'Self-Reported' ? 'SELF-REPORTED' : currentStatus}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{config.desc}</p>
              </div>
            </div>

            {data.reviewedAt && (
              <p className="mt-2 text-xs text-gray-400">Last reviewed: {data.reviewedAt}</p>
            )}
          </div>

          {/* Evidence documents */}
          <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Evidence Documents</span>
              </div>
              <span className="text-xs text-gray-400">{data.evidenceDocuments.length} file(s)</span>
            </div>

            {data.evidenceDocuments.length === 0 ? (
              <div className="mt-3 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800/50">
                <FileText className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-sm text-gray-400">No evidence documents submitted</p>
                <p className="text-xs text-gray-400">This outcome is self-reported only.</p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {data.evidenceDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800/50">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30">
                      <FileText className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{doc.fileName}</p>
                      <p className="text-xs text-gray-400">Uploaded: {doc.uploadedAt}</p>
                    </div>
                    <Badge color="brand" size="sm">{doc.fileType}</Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Existing verifier notes */}
            {data.verifierNotes && (
              <div className="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300">Previous verifier notes:</p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{data.verifierNotes}</p>
              </div>
            )}
          </div>

          {/* Verifier actions */}
          <div className="mt-4 rounded-lg border-2 border-dashed border-brand-200 p-4 dark:border-brand-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Verifier Actions</span>
            </div>

            {/* Status selector */}
            <div className="mt-3">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">Change verification status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.map((s) => {
                  const sc = statusConfig[s];
                  const isActive = currentStatus === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedStatus(s)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        isActive
                          ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-300'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                      }`}
                    >
                      {sc.icon} {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes field */}
            <div className="mt-3">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">Verifier notes (visible to trainee)</label>
              <textarea
                value={currentNotes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="e.g., Offer letter verified. Salary range matches employer confirmation. Approved."
              />
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Save Review
              </button>
            </div>
          </div>

          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            DEMO — Document verification is simulated. No real government or employer verification is performed. All changes are stored in-memory only.
          </p>
        </div>
      </Card>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
