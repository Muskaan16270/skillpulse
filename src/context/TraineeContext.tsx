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

export interface OutcomeUpdate {
  employmentStatus: OutcomeStatus;
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
        evidence: 'Self-Reported',
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
      evidence: 'Self-Reported' as const,
    };
  });

  const mergedWithFollowUps: Trainee = { ...mergedTrainee, followUps };

  const updateOutcome = (update: OutcomeUpdate) => {
    setOutcomeUpdate({ ...update, submittedAt: new Date().toLocaleString('en-IN') });
  };

  const updateFollowUp = (period: string, update: OutcomeUpdate) => {
    setFollowUpUpdates((prev) => ({ ...prev, [period]: { ...update, submittedAt: new Date().toLocaleString('en-IN') } }));
  };

  return (
    <TraineeContext.Provider value={{ traineeId, trainee: mergedWithFollowUps, outcomeUpdate, updateOutcome, followUpUpdates, followUps, updateFollowUp }}>
      {children}
    </TraineeContext.Provider>
  );
}

export function useTrainee(): TraineeContextValue {
  const ctx = useContext(TraineeContext);
  if (!ctx) throw new Error('useTrainee must be used within TraineeProvider');
  return ctx;
}
