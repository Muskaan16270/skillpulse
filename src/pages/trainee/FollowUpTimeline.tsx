import { useState } from 'react';
import {
  Clock, CheckCircle2, AlertTriangle, Briefcase, TrendingUp,
  ArrowRight, Edit3, MapPin, Calendar, IndianRupee,
} from 'lucide-react';
import { Card, SectionTitle, Badge, EvidenceBadge } from '@/components/ui';
import { useTrainee, type OutcomeUpdate } from '@/context/TraineeContext';
import { UpdateOutcomeModal } from '@/pages/trainee/UpdateOutcomeModal';

export function FollowUpTimeline() {
  const { followUps, followUpUpdates } = useTrainee();
  const [modalPeriod, setModalPeriod] = useState<string | null>(null);

  const stages = ['30 Days', '90 Days', '180 Days', '12 Months'];
  const stageColors: Record<string, string> = {
    '30 Days': 'bg-brand-500',
    '90 Days': 'bg-accent-500',
    '180 Days': 'bg-emerald-500',
    '12 Months': 'bg-violet-500',
  };

  return (
    <Card className="p-5">
      <SectionTitle
        title="Follow-Up Timeline"
        subtitle="Track your employment journey across 30 / 90 / 180 days / 12 months"
        icon={<Clock className="h-5 w-5" />}
      />

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 sm:left-6" />

        <div className="space-y-6">
          {stages.map((stage) => {
            const fu = followUps.find((f) => f.period === stage);
            if (!fu) return null;
            const stageUpdate = followUpUpdates[stage];
            const isCompleted = fu.responded;
            const isPending = !fu.responded;

            return (
              <div key={stage} className="relative pl-12 sm:pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md sm:h-12 sm:w-12 ${stageColors[stage]}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6" />
                  ) : (
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6" />
                  )}
                </div>

                {/* Stage card */}
                <div className={`rounded-xl border p-4 transition-all ${isCompleted ? 'border-gray-200 dark:border-gray-700' : 'border-amber-200 dark:border-amber-800'}`}>
                  {/* Stage header */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">{stage}</h3>
                      {isCompleted ? (
                        <Badge color="emerald" size="sm"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>
                      ) : (
                        <Badge color="amber" size="sm"><AlertTriangle className="mr-1 h-3 w-3" /> Pending</Badge>
                      )}
                      {stageUpdate && (
                        <Badge color="brand" size="sm"><Edit3 className="mr-1 h-3 w-3" /> Self-Reported</Badge>
                      )}
                    </div>
                    <button
                      onClick={() => setModalPeriod(stage)}
                      className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Update Outcome
                    </button>
                  </div>

                  {stageUpdate && (
                    <p className="mt-2 text-xs text-gray-400">Last updated: {stageUpdate.submittedAt}</p>
                  )}

                  {/* Status grid */}
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Employment status */}
                    <StatusCell
                      icon={<Briefcase className="h-4 w-4" />}
                      label="Employment Status"
                      value={
                        stageUpdate
                          ? stageUpdate.employmentStatus === 'Unplaced'
                            ? 'Still Searching'
                            : stageUpdate.employmentStatus === 'Placed'
                            ? 'Employed'
                            : stageUpdate.employmentStatus === 'Self-Employed'
                            ? 'Self-Employed'
                            : 'Apprenticeship'
                          : fu.employed
                          ? fu.livelihoodStatus
                          : 'Not Employed'
                      }
                      positive={stageUpdate ? stageUpdate.employmentStatus !== 'Unplaced' : fu.employed}
                    />

                    {/* Relevant employment */}
                    <StatusCell
                      icon={<TrendingUp className="h-4 w-4" />}
                      label="Relevant Employment"
                      value={
                        stageUpdate
                          ? stageUpdate.employmentStatus === 'Unplaced'
                            ? 'N/A'
                            : stageUpdate.jobRelevance
                          : fu.relevant
                          ? 'Yes'
                          : fu.employed
                          ? 'Low Relevance'
                          : 'N/A'
                      }
                      positive={stageUpdate ? stageUpdate.jobRelevance === 'High' : fu.relevant}
                    />

                    {/* Retention status */}
                    <StatusCell
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      label="Retention Status"
                      value={
                        fu.retained || (stageUpdate && stageUpdate.employmentStatus !== 'Unplaced' && (stage === '180 Days' || stage === '12 Months'))
                          ? 'Retained'
                          : fu.employed || (stageUpdate && stageUpdate.employmentStatus !== 'Unplaced')
                          ? 'In Progress'
                          : 'N/A'
                      }
                      positive={fu.retained || (stageUpdate && stageUpdate.employmentStatus !== 'Unplaced' && (stage === '180 Days' || stage === '12 Months'))}
                    />

                    {/* Evidence */}
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Evidence Level</span>
                      </div>
                      <div className="mt-1.5"><EvidenceBadge state={stageUpdate ? 'Self-Reported' : fu.evidence} /></div>
                    </div>
                  </div>

                  {/* Detail row if there's a stage update */}
                  {stageUpdate && stageUpdate.employmentStatus !== 'Unplaced' && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800">
                      {stageUpdate.jobRole && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {stageUpdate.jobRole}</span>}
                      {stageUpdate.industry && <span>{stageUpdate.industry}</span>}
                      {stageUpdate.jobLocation && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {stageUpdate.jobLocation}</span>}
                      {stageUpdate.joiningDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {stageUpdate.joiningDate}</span>}
                      {stageUpdate.salaryRange && <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {stageUpdate.salaryRange}</span>}
                    </div>
                  )}

                  {/* Pending notice */}
                  {isPending && !stageUpdate && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/20">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        This follow-up hasn't been completed yet. Click "Update Outcome" to report your current status.
                      </p>
                    </div>
                  )}
                </div>

                {/* Arrow connector */}
                <div className="absolute left-3 top-12 hidden text-gray-300 dark:text-gray-600 sm:block sm:left-5">
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Follow-up responses are self-reported in this demo. Missing follow-up does not mean unemployed — it means we haven't heard back yet. All data resets on logout.
      </p>

      <UpdateOutcomeModal
        open={modalPeriod !== null}
        onClose={() => setModalPeriod(null)}
        periodLabel={modalPeriod || undefined}
      />
    </Card>
  );
}

function StatusCell({ icon, label, value, positive }: { icon: React.ReactNode; label: string; value: string; positive: boolean }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`mt-1.5 text-sm font-medium ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
    </div>
  );
}
