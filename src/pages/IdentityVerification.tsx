import { useState, useRef } from 'react';
import {
  ShieldCheck, Mail, Phone, Calendar, CreditCard, CheckCircle2,
  ArrowRight, ArrowLeft, KeyRound, User, Loader2, Info,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import {
  generateSkillPulseId,
  type VerifiedIdentity,
} from '@/lib/identity';

type Step = 'email' | 'mobile' | 'dob' | 'aadhaar' | 'complete';
type VerificationStatus = 'idle' | 'sending_otp' | 'otp_sent' | 'verifying' | 'verified' | 'error';

export function IdentityVerification({
  onVerified,
}: {
  onVerified: (identity: VerifiedIdentity) => void;
}) {
  const [step, setStep] = useState<Step>('email');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<VerificationStatus>('idle');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneStatus, setPhoneStatus] = useState<VerificationStatus>('idle');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [dob, setDob] = useState('');
  const [dobStatus, setDobStatus] = useState<VerificationStatus>('idle');
  const [aadhaarConsent, setAadhaarConsent] = useState(false);
  const [aadhaarStatus, setAadhaarStatus] = useState<VerificationStatus>('idle');
  const [error, setError] = useState('');
  const [existingIdentity, setExistingIdentity] = useState<VerifiedIdentity | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const steps: { key: Step; label: string; icon: typeof Mail }[] = [
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'mobile', label: 'Mobile + OTP', icon: Phone },
    { key: 'dob', label: 'Date of Birth', icon: Calendar },
    { key: 'aadhaar', label: 'Aadhaar', icon: CreditCard },
    { key: 'complete', label: 'Complete', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleEmailVerify = async () => {
    if (!fullName.trim() || !email.trim()) {
      setError('Please enter your full name and email.');
      return;
    }
    setError('');
    setEmailStatus('verifying');

    try {
      const { data } = await supabase
        .from('verified_identities')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (data) {
        setExistingIdentity(data as VerifiedIdentity);
      }

      await new Promise((r) => setTimeout(r, 800));
      setEmailStatus('verified');
      setTimeout(() => setStep('mobile'), 500);
    } catch {
      setError('Could not verify email. Please try again.');
      setEmailStatus('error');
    }
  };

  const sendOtp = () => {
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid mobile number (at least 10 digits).');
      return;
    }
    setError('');
    setPhoneStatus('sending_otp');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setTimeout(() => {
      setPhoneStatus('otp_sent');
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setError('');
    setPhoneStatus('verifying');
    setTimeout(() => {
      if (entered === generatedOtp) {
        setPhoneStatus('verified');
        setTimeout(() => setStep('dob'), 500);
      } else {
        setError('Incorrect OTP. For this demo, the code is shown above the input fields.');
        setPhoneStatus('error');
      }
    }, 800);
  };

  const handleDobVerify = () => {
    if (!dob) {
      setError('Please select your date of birth.');
      return;
    }
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 15) {
      setError('You must be at least 15 years old.');
      return;
    }
    setError('');
    setDobStatus('verifying');
    setTimeout(() => {
      setDobStatus('verified');
      setTimeout(() => setStep('aadhaar'), 500);
    }, 600);
  };

  const handleAadhaarVerify = async () => {
    if (!aadhaarConsent) {
      setError('Please provide consent to proceed with mock Aadhaar verification.');
      return;
    }
    setError('');
    setAadhaarStatus('verifying');
    await new Promise((r) => setTimeout(r, 1200));

    const skillpulseId = generateSkillPulseId();
    const reference = `AAD-REF-${Date.now().toString(36).toUpperCase()}`;

    try {
      if (existingIdentity) {
        setAadhaarStatus('verified');
        setTimeout(() => {
          setStep('complete');
          onVerified(existingIdentity);
        }, 600);
        return;
      }

      const { data, error: insertError } = await supabase
        .from('verified_identities')
        .insert({
          skillpulse_id: skillpulseId,
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          date_of_birth: dob,
          aadhaar_verified: true,
          aadhaar_reference: reference,
          full_name: fullName.trim(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setAadhaarStatus('verified');
      setTimeout(() => {
        setStep('complete');
        onVerified(data as VerifiedIdentity);
      }, 600);
    } catch {
      setError('Could not complete verification. Please try again.');
      setAadhaarStatus('error');
    }
  };

  const goBack = () => {
    setError('');
    if (step === 'mobile') setStep('email');
    else if (step === 'dob') setStep('mobile');
    else if (step === 'aadhaar') setStep('dob');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Identity Verification</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Verify your identity to generate a unique SkillPulse User ID
        </p>
      </div>

      {existingIdentity && step !== 'complete' && (
        <Card className="border-l-4 border-l-amber-400 p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 shrink-0 text-amber-500" />
            <div className="text-sm">
              <p className="font-semibold text-gray-900 dark:text-white">Existing identity found</p>
              <p className="text-gray-500 dark:text-gray-400">
                An account with this email already exists (ID: {existingIdentity.skillpulse_id}).
                Completing verification will link to this identity. You can then create a new profile
                or merge with existing ones.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Step indicator */}
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isDone = i < currentStepIndex;
          const isCurrent = i === currentStepIndex;
          return (
            <div key={s.key} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                    isDone
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isCurrent
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`text-[10px] font-medium ${isCurrent ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-1 h-0.5 w-6 sm:w-10 ${isDone ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 dark:bg-rose-900/20">
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        </div>
      )}

      {/* Step 1: Email */}
      {step === 'email' && (
        <Card className="p-6 animate-fade-in">
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-brand-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Email / Gmail Verification</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={handleEmailVerify}
              disabled={emailStatus === 'verifying'}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {emailStatus === 'verifying' ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
              ) : emailStatus === 'verified' ? (
                <><CheckCircle2 className="h-4 w-4" /> Verified</>
              ) : (
                <>Continue <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </Card>
      )}

      {/* Step 2: Mobile + OTP */}
      {step === 'mobile' && (
        <Card className="p-6 animate-fade-in">
          <div className="mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-brand-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Mobile Number Verification</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  disabled={phoneStatus === 'otp_sent' || phoneStatus === 'verified'}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-brand-400 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {phoneStatus !== 'otp_sent' && phoneStatus !== 'verified' && (
              <button
                onClick={sendOtp}
                disabled={phoneStatus === 'sending_otp'}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {phoneStatus === 'sending_otp' ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending OTP…</>
                ) : (
                  <><KeyRound className="h-4 w-4" /> Send OTP</>
                )}
              </button>
            )}

            {(phoneStatus === 'otp_sent' || phoneStatus === 'verifying' || phoneStatus === 'error') && (
              <div className="animate-fade-in space-y-3">
                <div className="rounded-lg bg-brand-50 px-4 py-2 dark:bg-brand-900/20">
                  <p className="text-xs text-brand-600 dark:text-brand-400">
                    Demo OTP: <span className="font-mono text-base font-bold">{generatedOtp}</span>
                  </p>
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter 6-digit OTP</label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      disabled={phoneStatus === 'verified'}
                      className="h-12 w-12 rounded-lg border border-gray-200 bg-white text-center text-lg font-bold text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  ))}
                </div>
                <button
                  onClick={verifyOtp}
                  disabled={phoneStatus === 'verifying' || phoneStatus === 'verified'}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
                >
                  {phoneStatus === 'verifying' ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
                  ) : phoneStatus === 'verified' ? (
                    <><CheckCircle2 className="h-4 w-4" /> Verified</>
                  ) : (
                    <>Verify OTP <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            )}

            {phoneStatus !== 'verified' && (
              <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Step 3: DOB */}
      {step === 'dob' && (
        <Card className="p-6 animate-fade-in">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Date of Birth Verification</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={handleDobVerify}
              disabled={dobStatus === 'verifying'}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {dobStatus === 'verifying' ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
              ) : dobStatus === 'verified' ? (
                <><CheckCircle2 className="h-4 w-4" /> Verified</>
              ) : (
                <>Continue <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
            <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </Card>
      )}

      {/* Step 4: Aadhaar (mock) */}
      {step === 'aadhaar' && (
        <Card className="p-6 animate-fade-in">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Aadhaar Verification (Mock)</h3>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  This is a prototype mock verification. Your Aadhaar number is <strong>never</strong> stored
                  or transmitted. Only a verification flag and an opaque reference token are saved.
                </p>
              </div>
            </div>
            <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <input
                type="checkbox"
                checked={aadhaarConsent}
                onChange={(e) => setAadhaarConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I consent to mock Aadhaar verification. I understand no Aadhaar number is stored and
                this is for prototype demonstration only.
              </span>
            </label>
            <button
              onClick={handleAadhaarVerify}
              disabled={!aadhaarConsent || aadhaarStatus === 'verifying'}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {aadhaarStatus === 'verifying' ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
              ) : aadhaarStatus === 'verified' ? (
                <><CheckCircle2 className="h-4 w-4" /> Verified</>
              ) : (
                <>Complete Verification <ShieldCheck className="h-4 w-4" /></>
              )}
            </button>
            <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </Card>
      )}

      {/* Step 5: Complete */}
      {step === 'complete' && (
        <Card className="p-8 animate-fade-in text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Identity Verified!</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your SkillPulse User ID has been generated.
          </p>
        </Card>
      )}

      <div className="flex items-center justify-center gap-2">
        <Badge color="amber">PROTOTYPE</Badge>
        <Badge color="gray">MOCK VERIFICATION</Badge>
      </div>
    </div>
  );
}
