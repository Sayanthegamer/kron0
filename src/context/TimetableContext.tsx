import React, { useState, useEffect } from 'react';
import type { TimeTableEntry, AppSettings } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getErrorMessage, logError, retryWithBackoff, isRetriableError } from '../lib/errors';
import { createContext } from 'react';
import type { TimetableContextType } from '../types';

export const TimetableContext = createContext<TimetableContextType | undefined>(undefined);
import { listenToUserCollection } from '../lib/firestore';

const ENTRIES_COLLECTION = 'entries';
const SETTINGS_KEY = 'timetable_settings';

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { showSuccess, showError, showInfo } = useToast();
    const [entries, setEntries] = useState<TimeTableEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);
    const [lastFailedOperation, setLastFailedOperation] = useState<(() => Promise<void>) | null>(null);

    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            if (!saved) return { theme: 'dark', notificationsEnabled: true };
            const parsed = JSON.parse(saved);
            // Validate each field explicitly — never trust raw localStorage
            return {
                theme: 'dark', // always dark — user preference is locked
                notificationsEnabled: typeof parsed.notificationsEnabled === 'boolean'
                    ? parsed.notificationsEnabled
                    : true,
            };
        } catch {
            return { theme: 'dark', notificationsEnabled: true };
        }
    });

    // Load entries from Firestore scoped to current user with real-time updates
    useEffect(() => {
        if (!user) {
            setEntries([]);
            setIsLoading(false);
            return;
        }

        let isMounted = true;  // ✅ Prevent state updates after unmount
        let hasLoaded = false;

        setIsLoading(true);  // ✅ Explicitly set loading true
        setLastError(null);

        const unsubscribe = listenToUserCollection<TimeTableEntry>({
            collectionName: ENTRIES_COLLECTION,
            userId: user.uid,
            mapFn: (raw) => raw as TimeTableEntry,
            onData: (items) => {
                if (!isMounted) return;
                setEntries(items);
                setLastError(null);
                if (!hasLoaded) {
                    setIsLoading(false);
                    hasLoaded = true;
                }
            },
            onError: (message) => {
                if (!isMounted) return;
                setLastError(message);
                showError('Failed to load schedule', message);
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [user, showError]);  // ✅ Added showError to dependency array

    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    }, [settings]);

    const clearError = () => setLastError(null);

    const retryLastOperation = () => {
        if (lastFailedOperation) {
            lastFailedOperation();
            setLastFailedOperation(null);
        }
    };

    const addEntry = async (entry: Omit<TimeTableEntry, 'id'>) => {
        if (!user) return;
        
        const operation = async () => {
            setIsSaving(true);
            showInfo('Saving...', 'Adding new class to your schedule');
            
            try {
                const entryWithUser = { ...entry, userId: user.uid };
                const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), entryWithUser);
                const newEntry = { ...entry, id: docRef.id };
                setEntries(prev => [...prev, newEntry]);
                showSuccess('Class added', 'Successfully added to your schedule');
                setLastError(null);
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                logError(error, 'Add Entry');
                setLastError(errorMessage);
                showError('Failed to save class', errorMessage);
                
                // Store operation for retry if it's retriable
                if (isRetriableError(error)) {
                    setLastFailedOperation(() => () => addEntry(entry));
                }
                throw error;
            } finally {
                setIsSaving(false);
            }
        };

        // Use retry logic for Firestore operations
        try {
            await retryWithBackoff(operation, 3, 1000);
        } catch {
            // Error already handled in operation
        }
    };

    const updateEntry = async (updatedEntry: TimeTableEntry) => {
        const operation = async () => {
            setIsSaving(true);
            showInfo('Updating...', 'Saving changes to your class');
            
            try {
                const { id, ...data } = updatedEntry;
                await updateDoc(doc(db, ENTRIES_COLLECTION, id), data);
                setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
                showSuccess('Class updated', 'Changes saved successfully');
                setLastError(null);
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                logError(error, 'Update Entry');
                setLastError(errorMessage);
                showError('Failed to update class', errorMessage);
                
                // Store operation for retry if it's retriable
                if (isRetriableError(error)) {
                    setLastFailedOperation(() => () => updateEntry(updatedEntry));
                }
                throw error;
            } finally {
                setIsSaving(false);
            }
        };

        try {
            await retryWithBackoff(operation, 3, 1000);
        } catch {
            // Error already handled in operation
        }
    };

    const deleteEntry = async (id: string) => {
        const operation = async () => {
            setIsSaving(true);
            showInfo('Deleting...', 'Removing class from your schedule');
            
            try {
                await deleteDoc(doc(db, ENTRIES_COLLECTION, id));
                setEntries(prev => prev.filter(e => e.id !== id));
                showSuccess('Class deleted', 'Successfully removed from your schedule');
                setLastError(null);
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                logError(error, 'Delete Entry');
                setLastError(errorMessage);
                showError('Failed to delete class', errorMessage);
                
                // Store operation for retry if it's retriable
                if (isRetriableError(error)) {
                    setLastFailedOperation(() => () => deleteEntry(id));
                }
                throw error;
            } finally {
                setIsSaving(false);
            }
        };

        try {
            await retryWithBackoff(operation, 3, 1000);
        } catch {
            // Error already handled in operation
        }
    };

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <TimetableContext.Provider value={{ 
            entries, 
            settings, 
            isLoading, 
            isSaving,
            lastError,
            addEntry, 
            updateEntry, 
            deleteEntry, 
            updateSettings,
            clearError,
            retryLastOperation
        }}>
            {children}
        </TimetableContext.Provider>
    );
};

