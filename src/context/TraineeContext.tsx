import { createContext, useContext, useState, type ReactNode } from 'react';
import { trainees, type Trainee, type FollowUp } from '@/data/mockData';

export type OutcomeStatus =
  | 'Placed'
  | 'Self-Employed'
  | 'Apprenticeship'
  | 'Higher Education'
  | 'Further Training'
  | 'Looking for Work'
  | 'Not Currently Working';

export type VerificationStatus =
  | 'Self-Reported'
  | 'Evidence Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Needs Update';

export interface EvidenceDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  simulated: true;
}

export interface OutcomeUpdate {
  employmentStatus: OutcomeStatus;
  verificationStatus: VerificationStatus;
  evidenceDocuments: EvidenceDocument[];
  // Employment fields
  jobTitle?: string;
  employer?: string;
  joiningDate?: string;
  jobLocation?: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | '';
  salaryRange?: string;
  // Self-employment fields
  businessType?: string;
  startDate?: string;
  incomeRange?: string;
  // Apprenticeship fields
  organization?: string;
  role?: string;
  stipend?: string;
  apprenticeshipStatus?: 'Ongoing' | 'Completed' | 'Discontinued' | '';
  // Higher education / Further training fields
  courseName?: string;
  institutionName?: string;
  // Shared
  location?: string;
  jobRelevance?: 'High' | 'Moderate' | 'Low';
  // Legacy compatibility (used by FollowUpTimeline)
  jobRole?: string;
  industry?: string;
  salaryRangeLegacy?: string;
  jobLocationLegacy?: string;
}

export interface OutcomeUpdateRecord extends OutcomeUpdate {
  submittedAt: string;
}

interface TraineeContextValue {
  traineeId: string;
  trainee: Trainee;
  outcomeUpdate: OutcomeUpdateRecord | null;
  updateOutcome: (update: OutcomeUpdate) => void;
  updateVerificationStatus: (status: VerificationStatus) => void;
  uploadEvidence: (fileName: string, fileType: string) => void;
  followUpUpdates: Record<string, OutcomeUpdateRecord>;
  followUps: FollowUp[];
  updateFollowUp: (period: string, update: OutcomeUpdate) => void;
}

const TraineeContext = createContext<TraineeContextValue | null>(null);

function isEmployedType(status: OutcomeStatus): boolean {
  return status === 'Placed' || status === 'Self-Employed' || status === 'Apprenticeship';
}

function mapStatusToTrainee(status: OutcomeStatus): Trainee['employmentStatus'] {
  switch (status) {
    case 'Placed': return 'Placed';
    case 'Self-Employed': return 'Self-Employed';
    case 'Apprenticeship': return 'Apprenticeship';
    default: return 'Unplaced';
  }
}

function mapVerificationToEvidence(v: VerificationStatus): Trainee['evidence'] {
  switch (v) {
    case 'Verified': return 'Employer-Verified';
    case 'Evidence Submitted': return 'Evidence-Supported';
    case 'Under Review': return 'Under Review';
    default: return 'Self-Reported';
  }
}

export function TraineeProvider({ traineeId, children }: { traineeId: string; children: ReactNode }) {
  const baseTrainee = trainees.find((t) => t.id === traineeId) || trainees[0];
  const [outcomeUpdate, setOutcomeUpdate] = useState<OutcomeUpdateRecord | null>(null);
  const [followUpUpdates, setFollowUpUpdates] = useState<Record<string, OutcomeUpdateRecord>>({});

  const mergedTrainee: Trainee = outcomeUpdate
    ? {
        ...baseTrainee,
        employmentStatus: mapStatusToTrainee(outcomeUpdate.employmentStatus),
        jobRole: isEmployedType(outcomeUpdate.employmentStatus)
          ? (outcomeUpdate.jobTitle || outcomeUpdate.businessType || outcomeUpdate.role || null)
          : null,
        industry: isEmployedType(outcomeUpdate.employmentStatus)
          ? (outcomeUpdate.employer || outcomeUpdate.organization || outcomeUpdate.institutionName || null)
          : null,
        jobLocation: isEmployedType(outcomeUpdate.employmentStatus)
          ? (outcomeUpdate.jobLocation || outcomeUpdate.location || null)
          : null,
        joiningDate: isEmployedType(outcomeUpdate.employmentStatus)
          ? (outcomeUpdate.joiningDate || outcomeUpdate.startDate || null)
          : null,
        salaryRange: isEmployedType(outcomeUpdate.employmentStatus)
          ? (outcomeUpdate.salaryRange || outcomeUpdate.incomeRange || outcomeUpdate.stipend || null)
          : null,
        jobRelevance: isEmployedType(outcomeUpdate.employmentStatus)
          ? (outcomeUpdate.jobRelevance || null)
          : null,
        evidence: mapVerificationToEvidence(outcomeUpdate.verificationStatus),
      }
    : baseTrainee;

  const followUps: FollowUp[] = baseTrainee.followUps.map((f) => {
    const update = followUpUpdates[f.period];
    if (!update) return f;
    const employed = isEmployedType(update.employmentStatus);
    return {
      ...f,
      responded: true,
      employed,
      salary: null,
      relevant: employed && (update.jobRelevance === 'High' || update.jobRelevance === 'Moderate'),
      retained: employed && f.days >= 180,
      livelihoodStatus: employed ? (update.jobRelevance === 'High' ? 'Relevant Employment' : 'Employed (Low Relevance)') : 'Seeking Work',
      evidence: mapVerificationToEvidence(update.verificationStatus),
    };
  });

  const mergedWithFollowUps: Trainee = { ...mergedTrainee, followUps };

  const updateOutcome = (update: OutcomeUpdate) => {
    setOutcomeUpdate({ ...update, submittedAt: new Date().toLocaleString('en-IN') });
  };

  const updateVerificationStatus = (status: VerificationStatus) => {
    setOutcomeUpdate((prev) => prev ? { ...prev, verificationStatus: status } : prev);
  };

  const uploadEvidence = (fileName: string, fileType: string) => {
    setOutcomeUpdate((prev) => {
      if (!prev) return prev;
      const doc: EvidenceDocument = {
        id: `doc-${Date.now()}`,
        fileName,
        fileType,
        uploadedAt: new Date().toLocaleString('en-IN'),
        simulated: true,
      };
      const newStatus: VerificationStatus = prev.verificationStatus === 'Self-Reported' || prev.verificationStatus === 'Needs Update'
        ? 'Evidence Submitted'
        : prev.verificationStatus;
      return { ...prev, evidenceDocuments: [...prev.evidenceDocuments, doc], verificationStatus: newStatus };
    });
  };

  const updateFollowUp = (period: string, update: OutcomeUpdate) => {
    setFollowUpUpdates((prev) => ({ ...prev, [period]: { ...update, submittedAt: new Date().toLocaleString('en-IN') } }));
  };

  return (
    <TraineeContext.Provider value={{
      traineeId, trainee: mergedWithFollowUps, outcomeUpdate, updateOutcome,
      updateVerificationStatus, uploadEvidence,
      followUpUpdates, followUps, updateFollowUp,
    }}>
      {children}
    </TraineeContext.Provider>
  );
}

export function useTrainee(): TraineeContextValue {
  const ctx = useContext(TraineeContext);
  if (!ctx) throw new Error('useTrainee must be used within TraineeProvider');
  return ctx;
}
