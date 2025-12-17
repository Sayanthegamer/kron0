import React, { useState } from 'react';
import { TimetableProvider, useTimetable } from './context/TimetableContext';
import { FocusProvider } from './context/FocusContext';
import { TodoProvider } from './context/TodoContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { WeekView } from './components/WeekView';
import { EntryModal } from './components/EntryModal';
import type { TimeTableEntry } from './types';
import { FocusMode } from './pages/FocusMode';
import { useNotifications } from './hooks/useNotifications';
import { StatsWidget } from './components/StatsWidget';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'week' | 'focus' | 'stats'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeTableEntry | null>(null);

  const { addEntry, updateEntry, deleteEntry } = useTimetable();

  // Enable notifications
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
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onAddClick={handleAddClick}
    >
      {activeTab === 'dashboard' && <Dashboard onEntryClick={handleEditClick} />}
      {activeTab === 'week' && <WeekView onEntryClick={handleEditClick} />}
      {activeTab === 'focus' && <FocusMode />}
      {activeTab === 'stats' && (
        <div className="pt-4 space-y-4">
          <StatsWidget />
          {/* We can add history or more details here later */}
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

function App() {
  return (
    <TimetableProvider>
      <FocusProvider>
        <TodoProvider>
          <AppContent />
        </TodoProvider>
      </FocusProvider>
    </TimetableProvider>
  );
}

export default App;
