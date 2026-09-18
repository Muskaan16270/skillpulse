import { useState } from 'react';
import { Activity, LogIn, User, Lock, AlertTriangle, ArrowRight } from 'lucide-react';

interface TraineeLoginProps {
  onLogin: (traineeId: string) => void;
  onBackToAdmin?: () => void;
}

export function TraineeLogin({ onLogin, onBackToAdmin }: TraineeLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    onLogin('T001');
  };

  const handleDemoLogin = () => {
    onLogin('T001');
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-brand-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-brand-900/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SkillPulse</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Trainee Portal</p>
          </div>
        </div>

        {/* Demo banner */}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
            DEMO MODE — Synthetic data only. No real credentials required.
          </p>
        </div>

        {/* Login card */}
        <div className="card p-8 animate-slide-up">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email or Unified Trainee ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., SP-2025-00001"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter any password"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">{error}</p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Demo login */}
          <button
            onClick={handleDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-200 bg-brand-50 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-300 dark:hover:bg-brand-900/30"
          >
            <ArrowRight className="h-4 w-4" />
            Continue as Demo Trainee
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">
            Explore the trainee portal with a pre-loaded demo profile
          </p>
        </div>

        <p className="text-center text-xs text-gray-400">
          SkillPulse Trainee Portal — Prototype for SIH demonstration
        </p>
        {onBackToAdmin && (
          <div className="text-center">
            <button
              onClick={onBackToAdmin}
              className="text-xs font-medium text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Back to Admin Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
