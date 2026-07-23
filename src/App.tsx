import React, { Suspense, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { FocusProvider } from './context/FocusContext';
import { TimetableProvider } from './context/TimetableContext';
import { useTimetable } from './hooks/useTimetable';
import { TodoProvider } from './context/TodoContext';
import { ToastProvider } from './lib/toast';

import { EntryModal } from './components/EntryModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
// ✅ REMOVED: import { OnboardingTour } from './components/OnboardingTour';
import { StatsWidget } from './components/StatsWidget';
import { Dashboard } from './pages/Dashboard';
// ⚡ LAZY LOADED: import { FocusMode } from './pages/FocusMode';
// ⚡ LAZY LOADED: import { WeekView } from './components/WeekView';

const FocusMode = React.lazy(() => 
  import('./pages/FocusMode').then(m => ({ default: m.FocusMode }))
    .catch(err => { logError(err, 'Lazy import: FocusMode'); throw err; })
);

const WeekView = React.lazy(() => 
  import('./components/WeekView').then(m => ({ default: m.WeekView }))
    .catch(err => { logError(err, 'Lazy import: WeekView'); throw err; })
);
import { useNotifications } from './hooks/useNotifications';
import { logError } from './lib/errors';
import type { TimeTableEntry } from './types';

const fullscreenSpinner = (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

const LandingPage = React.lazy(() =>
  import('./pages/LandingPage')
    .then((module) => ({ default: module.LandingPage }))
    .catch((error) => {
      logError(error, 'Lazy import: LandingPage');
      throw error;
    })
);

const LoginPage = React.lazy(() =>
  import('./pages/LoginPage')
    .catch((error) => {
      logError(error, 'Lazy import: LoginPage');
      throw error;
    })
);

// ✅ Lazy load OnboardingTour - only loads for authenticated users
const OnboardingTour = React.lazy(() =>
  import('./components/OnboardingTour')
    .then((module) => ({ default: module.OnboardingTour }))
    .catch((error) => {
      logError(error, 'Lazy import: OnboardingTour');
      throw error;
    })
);

import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeTableEntry | null>(null);

  const { addEntry, updateEntry, deleteEntry } = useTimetable();

  useNotifications();

  const getActiveTab = (): 'dashboard' | 'week' | 'focus' | 'stats' => {
    switch (location.pathname) {
      case '/week': return 'week';
      case '/focus': return 'focus';
      case '/stats': return 'stats';
      default: return 'dashboard';
    }
  };

  const handleTabChange = (tab: 'dashboard' | 'week' | 'focus' | 'stats') => {
    const routes = {
      dashboard: '/',
      week: '/week',
      focus: '/focus',
      stats: '/stats',
    };
    navigate(routes[tab]);
  };

  const handleSave = (entry: TimeTableEntry | Omit<TimeTableEntry, 'id'>) => {
    if ('id' in entry) {
      updateEntry(entry);
    } else {
      addEntry(entry);
    }
  };

  const handleEditClick = (entry: TimeTableEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  return (
    <Layout activeTab={getActiveTab()} onTabChange={handleTabChange} onAddClick={handleAddClick}>
      <Suspense fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Dashboard onEntryClick={handleEditClick} onAddEntry={handleAddClick} />} />
          <Route path="/week" element={<WeekView onEntryClick={handleEditClick} />} />
          <Route path="/focus" element={<FocusMode />} />
          <Route path="/stats" element={
            <div className="pt-4 space-y-4">
              <StatsWidget />
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <EntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={deleteEntry}
        initialData={editingEntry}
      />
    </Layout>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);

  if (isLoading) {
    return fullscreenSpinner;
  }

  if (user) {
    return (
      <TimetableProvider>
        <FocusProvider>
          <TodoProvider>
            <AppContent />
            <Suspense fallback={null}>  {/* ✅ Suspense wrapper */}
              <OnboardingTour />
            </Suspense>
          </TodoProvider>
        </FocusProvider>
      </TimetableProvider>
    );
  }

  return (
    <Suspense fallback={fullscreenSpinner}>
      {showLanding ? (
        <LandingPage onGetStarted={() => setShowLanding(false)} />
      ) : (
        <LoginPage />
      )}
    </Suspense>
  );
};

function App() {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
      </ErrorBoundary>
    </ToastProvider>
  );
}

export default App;
