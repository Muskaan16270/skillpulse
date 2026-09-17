import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { Sidebar, type PageKey } from '@/components/Sidebar';
import { DemoBanner } from '@/components/DemoBanner';
import { Overview } from '@/pages/Overview';
import { Trainees } from '@/pages/Trainees';
import { Outcomes } from '@/pages/Outcomes';
import { OutcomeAutopsy } from '@/pages/OutcomeAutopsy';
import { SkillGapAI } from '@/pages/SkillGapAI';
import { RetentionProgression } from '@/pages/RetentionProgression';
import { EarlyWarning } from '@/pages/EarlyWarning';
import { Interventions } from '@/pages/Interventions';
import { NextCohortLearning } from '@/pages/NextCohortLearning';
import { Providers } from '@/pages/Providers';
import { DistrictIntelligence } from '@/pages/DistrictIntelligence';
import { SkillPassport } from '@/pages/SkillPassport';
import { PrivacyConsent } from '@/pages/PrivacyConsent';
import { TrainingData } from '@/pages/TrainingData';
import { FollowUps } from '@/pages/FollowUps';
import { IdentityPortal } from '@/pages/IdentityPortal';
import { TraineeLogin } from '@/pages/trainee/TraineeLogin';
import { TraineeSidebar, type TraineePageKey } from '@/components/TraineeSidebar';
import { TraineeProvider } from '@/context/TraineeContext';
import { TraineeDashboard } from '@/pages/trainee/TraineeDashboard';
import { TraineeProfile } from '@/pages/trainee/TraineeProfile';
import { TraineePrivacy } from '@/pages/trainee/TraineePrivacy';
import { trainees, type EarlyWarning as EarlyWarningType } from '@/data/mockData';

type Mode = 'admin' | 'trainee';

function App() {
  const [mode, setMode] = useState<Mode>('admin');
  const [currentPage, setCurrentPage] = useState<PageKey>('overview');
  const [traineePage, setTraineePage] = useState<TraineePageKey>('dashboard');
  const [traineeId, setTraineeId] = useState<string | null>(null);
  const [pendingWarning, setPendingWarning] = useState<EarlyWarningType | null>(null);

  const handleTraineeLogin = (id: string) => {
    setTraineeId(id);
    setTraineePage('dashboard');
    setMode('trainee');
  };

  const handleTraineeLogout = () => {
    setTraineeId(null);
    setTraineePage('dashboard');
    setMode('admin');
  };

  // --- Trainee mode ---
  if (mode === 'trainee') {
    if (!traineeId) {
      return (
        <ThemeProvider>
          <TraineeLogin onLogin={handleTraineeLogin} />
        </ThemeProvider>
      );
    }

    const trainee = trainees.find((t) => t.id === traineeId) || trainees[0];

    const renderTraineePage = () => {
      switch (traineePage) {
        case 'dashboard': return <TraineeDashboard traineeId={traineeId} onNavigate={setTraineePage} />;
        case 'profile': return <TraineeProfile traineeId={traineeId} />;
        case 'passport': return <SkillPassport />;
        case 'privacy': return <TraineePrivacy traineeId={traineeId} />;
        default: return <TraineeDashboard traineeId={traineeId} onNavigate={setTraineePage} />;
      }
    };

    return (
      <ThemeProvider>
        <TraineeProvider traineeId={traineeId}>
          <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
            <TraineeSidebar
              currentPage={traineePage}
              onNavigate={setTraineePage}
              onLogout={handleTraineeLogout}
              traineeName={trainee.name}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
              <DemoBanner />
              <main className="flex-1 overflow-y-auto p-4 pt-16 lg:p-6 lg:pt-6">
                <div className="mx-auto max-w-7xl animate-fade-in">
                  {renderTraineePage()}
                </div>
              </main>
            </div>
          </div>
        </TraineeProvider>
      </ThemeProvider>
    );
  }

  // --- Admin mode ---
  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <Overview onNavigate={setCurrentPage} />;
      case 'trainees': return <Trainees />;
      case 'trainingdata': return <TrainingData />;
      case 'outcomes': return <Outcomes />;
      case 'autopsy': return <OutcomeAutopsy />;
      case 'skillgap': return <SkillGapAI />;
      case 'retention': return <RetentionProgression />;
      case 'earlywarning': return <EarlyWarning onCreateIntervention={(w) => { setPendingWarning(w); setCurrentPage('interventions'); }} />;
      case 'interventions': return <Interventions pendingFromWarning={pendingWarning} />;
      case 'nextcohort': return <NextCohortLearning />;
      case 'providers': return <Providers />;
      case 'district': return <DistrictIntelligence />;
      case 'passport': return <SkillPassport />;
      case 'privacy': return <PrivacyConsent />;
      case 'followups': return <FollowUps />;
      case 'identity': return <IdentityPortal />;
      default: return <Overview onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DemoBanner />
          <main className="flex-1 overflow-y-auto p-4 pt-16 lg:p-6 lg:pt-6">
            <div className="mx-auto max-w-7xl animate-fade-in">
              {renderPage()}
              {/* Trainee portal access */}
              <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
                <button
                  onClick={() => { setTraineeId(null); setMode('trainee'); }}
                  className="flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-300 dark:hover:bg-brand-900/30"
                >
                  Trainee Portal Login →
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
