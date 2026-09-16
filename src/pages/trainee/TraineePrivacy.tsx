import {
  ShieldCheck, UserCheck, UserX, Eye, Download, AlertTriangle,
  Lock, Info,
} from 'lucide-react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { trainees, kpis } from '@/data/mockData';

export function TraineePrivacy({ traineeId }: { traineeId: string }) {
  const trainee = trainees.find((t) => t.id === traineeId) || trainees[0];

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

      {/* Consent management */}
      <Card className="p-5">
        <SectionTitle title="Consent Management" subtitle="Control who can see your data" icon={<UserCheck className="h-5 w-5" />} />
        <div className="space-y-3">
          <ConsentRow label="Employment data sharing with providers" status="Granted" enabled />
          <ConsentRow label="Skill profile visibility to employers" status="Granted" enabled />
          <ConsentRow label="Aggregated/anonymized analytics" status="Granted" enabled />
          <ConsentRow label="Longitudinal follow-up contact" status="Granted" enabled />
          <ConsentRow label="Cross-provider data visibility" status="Denied" />
          <ConsentRow label="Third-party sharing" status="Withdrawn" />
        </div>
        <div className="mt-4 flex gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700">
            <UserCheck className="h-4 w-4" /> Grant All
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-gray-700 dark:hover:bg-rose-900/20">
            <UserX className="h-4 w-4" /> Withdraw All
          </button>
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

function ConsentRow({ label, status, enabled }: { label: string; status: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${enabled ? 'text-emerald-600 dark:text-emerald-400' : status === 'Withdrawn' ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'}`}>
          {status}
        </span>
        <div className={`relative h-5 w-9 rounded-full transition ${enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${enabled ? 'left-4' : 'left-0.5'}`} />
        </div>
      </div>
    </div>
  );
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
