import type { TimeTableEntry, AppSettings } from './index';

export interface TimetableContextType {
    entries: TimeTableEntry[];
    settings: AppSettings;
    isLoading: boolean;
    isSaving: boolean;
    lastError: string | null;
    addEntry: (entry: Omit<TimeTableEntry, 'id'>) => Promise<void>;
    updateEntry: (entry: TimeTableEntry) => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
    updateSettings: (settings: Partial<AppSettings>) => void;
    clearError: () => void;
    retryLastOperation: () => void;
}
