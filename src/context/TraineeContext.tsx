import { createContext, useContext, useState, type ReactNode } from 'react';
import { trainees, type Trainee, type FollowUp } from '@/data/mockData';

export interface OutcomeUpdate {
  employmentStatus: 'Placed' | 'Self-Employed' | 'Apprenticeship' | 'Unplaced';
  jobRole: string;
  industry: string;
  joiningDate: string;
  salaryRange: string;
  jobLocation: string;
  jobRelevance: 'High' | 'Moderate' | 'Low';
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

export function TraineeProvider({ traineeId, children }: { traineeId: string; children: ReactNode }) {
  const baseTrainee = trainees.find((t) => t.id === traineeId) || trainees[0];
  const [outcomeUpdate, setOutcomeUpdate] = useState<OutcomeUpdateRecord | null>(null);
  const [followUpUpdates, setFollowUpUpdates] = useState<Record<string, OutcomeUpdateRecord>>({});

  const mergedTrainee: Trainee = outcomeUpdate
    ? {
        ...baseTrainee,
        employmentStatus: outcomeUpdate.employmentStatus,
        jobRole: outcomeUpdate.employmentStatus === 'Unplaced' ? null : outcomeUpdate.jobRole || null,
        industry: outcomeUpdate.employmentStatus === 'Unplaced' ? null : outcomeUpdate.industry || null,
        jobLocation: outcomeUpdate.employmentStatus === 'Unplaced' ? null : outcomeUpdate.jobLocation || null,
        joiningDate: outcomeUpdate.employmentStatus === 'Unplaced' ? null : outcomeUpdate.joiningDate || null,
        salaryRange: outcomeUpdate.employmentStatus === 'Unplaced' ? null : outcomeUpdate.salaryRange || null,
        jobRelevance: outcomeUpdate.employmentStatus === 'Unplaced' ? null : outcomeUpdate.jobRelevance,
        evidence: 'Self-Reported',
      }
    : baseTrainee;

  const followUps: FollowUp[] = baseTrainee.followUps.map((f) => {
    const update = followUpUpdates[f.period];
    if (!update) return f;
    const isUnplaced = update.employmentStatus === 'Unplaced';
    return {
      ...f,
      responded: true,
      employed: !isUnplaced,
      salary: null,
      relevant: !isUnplaced && (update.jobRelevance === 'High' || update.jobRelevance === 'Moderate'),
      retained: !isUnplaced && f.days >= 180,
      livelihoodStatus: isUnplaced ? 'Seeking Work' : update.jobRelevance === 'High' ? 'Relevant Employment' : 'Employed (Low Relevance)',
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
