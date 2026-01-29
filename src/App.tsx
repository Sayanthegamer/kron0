import React, { Suspense, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { FocusProvider } from './context/FocusContext';
import { TimetableProvider, useTimetable } from './context/TimetableContext';
import { TodoProvider } from './context/TodoContext';
import { ToastProvider } from './context/ToastContext';

import { EntryModal } from './components/EntryModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { OnboardingTour } from './components/OnboardingTour';
import { StatsWidget } from './components/StatsWidget';
import { WeekView } from './components/WeekView';
import { Dashboard } from './pages/Dashboard';
import { FocusMode } from './pages/FocusMode';
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
    .then((module) => ({ default: module.LoginPage }))
    .catch((error) => {
      logError(error, 'Lazy import: LoginPage');
      throw error;
    })
);

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'week' | 'focus' | 'stats'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeTableEntry | null>(null);

  const { addEntry, updateEntry, deleteEntry } = useTimetable();

  useNotifications();

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
    <Layout activeTab={activeTab} onTabChange={setActiveTab} onAddClick={handleAddClick}>
      {activeTab === 'dashboard' && (
        <Dashboard onEntryClick={handleEditClick} onAddEntry={handleAddClick} />
      )}
      {activeTab === 'week' && <WeekView onEntryClick={handleEditClick} />}
      {activeTab === 'focus' && <FocusMode />}
      {activeTab === 'stats' && (
        <div className="pt-4 space-y-4">
          <StatsWidget />
        </div>
      )}

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
            <OnboardingTour />
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
