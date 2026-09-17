import { useState } from 'react';
import {
  IdentityVerification,
} from '@/pages/IdentityVerification';
import {
  UnifiedProfileManager,
} from '@/pages/UnifiedProfileManager';
import { Card } from '@/components/ui';
import {
  ShieldCheck, BrainCircuit, Briefcase, ArrowRight,
} from 'lucide-react';
import type { VerifiedIdentity } from '@/lib/identity';

type Phase = 'intro' | 'verify' | 'profiles';

export function IdentityPortal() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [identity, setIdentity] = useState<VerifiedIdentity | null>(null);

  const handleVerified = (id: VerifiedIdentity) => {
    setIdentity(id);
    setPhase('profiles');
  };

  const handleReset = () => {
    setIdentity(null);
    setPhase('intro');
  };

  if (phase === 'verify') {
    return <IdentityVerification onVerified={handleVerified} />;
  }

  if (phase === 'profiles' && identity) {
    return <UnifiedProfileManager identity={identity} onReset={handleReset} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-brand-500 to-accent-500 p-8 text-white">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">Identity Verification & Unified Profile</h2>
              <p className="text-sm text-white/80">Securely verify your identity and build a unified skill profile</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Verify your identity using email/Gmail, mobile number with OTP, date of birth, and a mock
            Aadhaar check. After verification, you'll get a unique SkillPulse User ID and can create
            unified profiles with your qualifications. If you create multiple profiles, the system
            detects duplicates and offers to merge them into one unified profile used for AI Skill
            Gap Analysis and personalized job recommendations.
          </p>
          <button
            onClick={() => setPhase('verify')}
            className="mt-5 flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            <ShieldCheck className="h-5 w-5" /> Start Identity Verification
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </Card>

      {/* Feature cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-gray-900 dark:text-white">Multi-Factor Verification</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Email, mobile OTP, date of birth, and mock Aadhaar — your Aadhaar number is never stored.
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-gray-900 dark:text-white">Duplicate Detection</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            If you create another profile with different qualifications, we detect it and offer to merge.
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-gray-900 dark:text-white">AI-Powered Matching</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Your unified profile feeds into Skill Gap AI analysis and personalized job recommendations.
          </p>
        </Card>
      </div>

      {/* How it works */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">How It Works</h3>
        <div className="mt-4 space-y-3">
          {[
            { step: 1, title: 'Verify Identity', desc: 'Confirm your email, mobile via OTP, date of birth, and mock Aadhaar.' },
            { step: 2, title: 'Get SkillPulse ID', desc: 'Receive a unique user ID like SP-2026-XXXXX after verification.' },
            { step: 3, title: 'Create Profiles', desc: 'Add your education, skills, certifications, internships, and experience.' },
            { step: 4, title: 'Merge Duplicates', desc: 'If you create another profile, we detect it and combine everything into one.' },
            { step: 5, title: 'AI Analysis', desc: 'Your unified profile powers skill gap analysis and job recommendations.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
