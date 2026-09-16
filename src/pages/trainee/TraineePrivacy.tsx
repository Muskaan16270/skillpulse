import { useState } from 'react';
import {
  ShieldCheck, UserCheck, UserX, Eye, Download, AlertTriangle,
  Lock, Info, CheckCircle2, Clock, XCircle, History,
} from 'lucide-react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { trainees, kpis, consentCategories, type ConsentState, type ConsentCategoryType } from '@/data/mockData';

export function TraineePrivacy({ traineeId }: { traineeId: string }) {
  const trainee = trainees.find((t) => t.id === traineeId) || trainees[0];

  // Initialize consent state from the trainee's consent records
  const initialStates = consentCategories.map((cat) => {
    const record = trainee.consentRecords.find((r) => r.type === cat.type);
    return record?.status || 'Pending';
  });
  const [consentStates, setConsentStates] = useState<ConsentState[]>(initialStates);
  const [history, setHistory] = useState<{ type: ConsentCategoryType; status: ConsentState; date: string }[]>(
    trainee.consentRecords.map((r) => ({ type: r.type, status: r.status, date: r.date }))
  );

  const giveConsent = (index: number, type: ConsentCategoryType) => {
    const newStates = [...consentStates];
    newStates[index] = 'Given';
    setConsentStates(newStates);
    setHistory((prev) => [{ type, status: 'Given', date: new Date().toLocaleDateString('en-IN') }, ...prev]);
  };

  const withdrawConsent = (index: number, type: ConsentCategoryType) => {
    const newStates = [...consentStates];
    newStates[index] = 'Withdrawn';
    setConsentStates(newStates);
    setHistory((prev) => [{ type, status: 'Withdrawn', date: new Date().toLocaleDateString('en-IN') }, ...prev]);
  };

  const givenCount = consentStates.filter((s) => s === 'Given').length;
  const pendingCount = consentStates.filter((s) => s === 'Pending').length;
  const withdrawnCount = consentStates.filter((s) => s === 'Withdrawn').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Consent & Privacy</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your data sharing preferences and view your privacy rights</p>
      </div>

      {/* Key principle */}
      <Card className="border-l-4 border-l-brand-400 p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-brand-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Your data belongs to you.</p>
            <p className="text-gray-500 dark:text-gray-400">
              You can view, export, or withdraw consent for your data at any time. No real Aadhaar, phone numbers, or personal documents are stored in this prototype.
            </p>
          </div>
        </div>
      </Card>

      {/* Consent summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Consents Given</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{givenCount}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-300" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-300" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Withdrawn</p>
              <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{withdrawnCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-rose-300" />
          </div>
        </Card>
      </div>

      {/* Consent management */}
      <Card className="p-5">
        <SectionTitle title="Consent Management" subtitle="Control who can see your data — review each category before giving consent" icon={<UserCheck className="h-5 w-5" />} />
        <div className="space-y-4">
          {consentCategories.map((cat, i) => {
            const state = consentStates[i];
            return (
              <div key={cat.type} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.type}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{cat.description}</p>
                    <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                      {cat.purpose}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <ConsentBadge state={state} />
                    {state === 'Given' ? (
                      <button
                        onClick={() => withdrawConsent(i, cat.type)}
                        disabled={!cat.canWithdraw}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          cat.canWithdraw
                            ? 'border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20'
                            : 'border border-gray-200 text-gray-400 dark:border-gray-700'
                        }`}
                      >
                        <UserX className="h-3.5 w-3.5" /> Withdraw
                      </button>
                    ) : (
                      <button
                        onClick={() => giveConsent(i, cat.type)}
                        className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700"
                      >
                        <UserCheck className="h-3.5 w-3.5" /> Give Consent
                      </button>
                    )}
                  </div>
                </div>
                {!cat.canWithdraw && state === 'Given' && (
                  <p className="mt-2 text-xs text-gray-400">This consent is required for core programme functionality and cannot be withdrawn.</p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Consent History */}
      <Card className="p-5">
        <SectionTitle title="Consent History" subtitle="Record of all consent actions taken" icon={<History className="h-5 w-5" />} />
        <div className="space-y-2">
          {history.map((record, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 dark:border-gray-800">
              <div className="flex items-center gap-3">
                {record.status === 'Given' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : record.status === 'Withdrawn' ? (
                  <XCircle className="h-4 w-4 text-rose-500" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{record.type}</p>
                  <p className="text-xs text-gray-400">{record.date}</p>
                </div>
              </div>
              <ConsentBadge state={record.status} />
            </div>
          ))}
        </div>
      </Card>

      {/* Data minimization */}
      <Card className="p-5">
        <SectionTitle title="Data Minimization" subtitle="Only necessary data is collected" icon={<Lock className="h-5 w-5" />} />
        <div className="space-y-3">
          <DataMinRow label="Name & Unified ID" status="Collected" reason="Identity verification" />
          <DataMinRow label="Education & Skills" status="Collected" reason="Skill matching" />
          <DataMinRow label="Employment status" status="Collected" reason="Outcome tracking" />
          <DataMinRow label="Salary range" status="Collected" reason="Wage progression" />
          <DataMinRow label="Aadhaar" status="Not Collected" reason="Not required for prototype" />
          <DataMinRow label="Phone number" status="Anonymized" reason="Follow-up only" />
          <DataMinRow label="Bank details" status="Not Collected" reason="Not required" />
          <DataMinRow label="Personal documents" status="Not Stored" reason="Only evidence metadata" />
        </div>
      </Card>

      {/* Your data summary */}
      <Card className="p-5">
        <SectionTitle title="Your Data Summary" subtitle="What we have on file for you" icon={<Eye className="h-5 w-5" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Your Unified ID</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{trainee.unifiedId}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Follow-up Coverage</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{kpis.followUpCoverage}%</p>
            <div className="mt-2"><ProgressBar value={kpis.followUpCoverage} color={kpis.followUpCoverage > 80 ? 'emerald' : 'amber'} /></div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Data Anonymized for Public</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</p>
            <p className="text-xs text-gray-400">Your identity is protected</p>
          </div>
        </div>
      </Card>

      {/* Your rights */}
      <Card className="p-5">
        <SectionTitle title="Your Data Rights" icon={<ShieldCheck className="h-5 w-5" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RightCard icon={<Eye className="h-5 w-5" />} title="Right to View" desc="You can view all data held about you at any time." />
          <RightCard icon={<Download className="h-5 w-5" />} title="Right to Export" desc="You can download your Skill Passport data." />
          <RightCard icon={<UserX className="h-5 w-5" />} title="Right to Withdraw Consent" desc="You can withdraw consent for data sharing at any time." />
          <RightCard icon={<AlertTriangle className="h-5 w-5" />} title="Right to Dispute" desc="You can dispute employment or evidence records." />
        </div>
      </Card>

      {/* Data notice */}
      <Card className="border-l-4 border-l-amber-400 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Synthetic Demo Data</p>
            <p className="text-gray-500 dark:text-gray-400">
              All data shown here is simulated. No real personal information is stored or processed. This prototype is for demonstration purposes only.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ConsentBadge({ state }: { state: ConsentState }) {
  if (state === 'Given') return <Badge color="emerald" size="sm"><CheckCircle2 className="mr-1 h-3 w-3" /> Consent Given</Badge>;
  if (state === 'Withdrawn') return <Badge color="rose" size="sm"><XCircle className="mr-1 h-3 w-3" /> Withdrawn</Badge>;
  return <Badge color="amber" size="sm"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
}

function DataMinRow({ label, status, reason }: { label: string; status: string; reason: string }) {
  const color = status === 'Collected' ? 'amber' : status === 'Anonymized' ? 'brand' : 'emerald';
  return (
    <div className="flex items-center justify-between text-sm">
      <div>
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <p className="text-xs text-gray-400">{reason}</p>
      </div>
      <Badge color={color as 'amber' | 'brand' | 'emerald'} size="sm">{status}</Badge>
    </div>
  );
}

function RightCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
