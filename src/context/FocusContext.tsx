import React, { useState, useEffect } from 'react';
import { type FocusSession, type TimerMode } from '../types';
import { MODES } from '../constants';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getErrorMessage, logError, retryWithBackoff, isRetriableError } from '../lib/errors';
import { FocusContext } from './definitions/FocusContextDefinition';
import { listenToUserCollection } from '../lib/firestore';

const HISTORY_COLLECTION = 'focus_history';

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { showSuccess, showError, showInfo } = useToast();
    const [isFocusMode, setIsFocusMode] = useState(false);

    // Timer State in Context (Global Persistence)
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [customMinutes, setCustomMinutes] = useState(25);

    const [sessionHistory, setSessionHistory] = useState<FocusSession[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);
    const [lastFailedOperation, setLastFailedOperation] = useState<(() => Promise<void>) | null>(null);
    const [lastCompletedSession, setLastCompletedSession] = useState<FocusSession | null>(null);

    // NO Audio element needed using Web Audio API

    // Play Beep Function
    const playBeep = () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime); // 440Hz beep

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error('Audio play failed', e);
        }
    };

    // Load history with real-time updates
    useEffect(() => {
        if (!user) {
            setSessionHistory([]);
            setLastError(null);
            return;
        }

        let isMounted = true;

        const unsubscribe = listenToUserCollection<FocusSession>({
            collectionName: HISTORY_COLLECTION,
            userId: user.uid,
            mapFn: (raw) => raw as FocusSession,
            constraints: [orderBy('startTime', 'desc')],
            onData: (items) => {
                if (!isMounted) return;
                setSessionHistory(items);
                setLastError(null);
            },
            onError: (message) => {
                if (!isMounted) return;
                setLastError(message);
                showError('Failed to load focus history', message);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const clearError = () => setLastError(null);

    const retryLastOperation = () => {
        if (lastFailedOperation) {
            lastFailedOperation();
            setLastFailedOperation(null);
        }
    };

    // Save session with error handling and retry logic
    const saveSession = async (sessionData: Omit<FocusSession, 'id'> & { userId: string }) => {
        const operation = async () => {
            setIsSaving(true);
            showInfo('Saving session...', 'Recording your focus time');
            
            try {
                const docRef = await addDoc(collection(db, HISTORY_COLLECTION), sessionData);
                const newSession = { ...sessionData, id: docRef.id };
                setSessionHistory(prev => [newSession, ...prev]);
                setLastCompletedSession(newSession);
                showSuccess('Session saved', 'Your focus session has been recorded');
                setLastError(null);
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                logError(error, 'Save Focus Session');
                setLastError(errorMessage);
                showError('Failed to save session', errorMessage);
                
                // Store operation for retry if it's retriable
                if (isRetriableError(error)) {
                    setLastFailedOperation(() => () => saveSession(sessionData));
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

    // Timer Logic (Moved from FocusMode.tsx)
    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);

            // Play Beep
            playBeep();

            // Save Session if it was a real focus session
            if (user && (mode === 'focus' || mode === 'custom')) {
                const durationMinutes = mode === 'custom' ? customMinutes : MODES[mode].minutes;
                const newSession: Omit<FocusSession, 'id'> & { userId: string } = {
                    startTime: Date.now() - (durationMinutes * 60 * 1000), // Backdate to actual start
                    duration: durationMinutes,
                    completed: true,
                    userId: user.uid
                };
                saveSession(newSession);
            }
        }
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, timeLeft, user, mode, customMinutes]);

    const toggleTimer = () => setIsActive(prev => !prev);

    const resetTimer = () => {
        setIsActive(false);
        const mins = mode === 'custom' ? customMinutes : MODES[mode].minutes;
        setTimeLeft(mins * 60);
    };

    const handleSetMode = (newMode: TimerMode) => {
        setMode(newMode);
        setIsActive(false);
        const mins = newMode === 'custom' ? customMinutes : MODES[newMode].minutes;
        setTimeLeft(mins * 60);
    };

    const setCustomDuration = (minutes: number) => {
        setCustomMinutes(minutes);
        if (mode === 'custom') {
            setIsActive(false);
            setTimeLeft(minutes * 60);
        }
    };

    const toggleFocusMode = () => setIsFocusMode(prev => !prev);

    return (
        <FocusContext.Provider value={{
            isFocusMode,
            toggleFocusMode,
            mode,
            setMode: handleSetMode,
            timeLeft,
            isActive,
            toggleTimer,
            resetTimer,
            setCustomDuration,
            customMinutes, // Exposed
            sessionHistory,
            isSaving,
            lastError,
            clearError,
            retryLastOperation,
            lastCompletedSession
        }}>
            {children}
        </FocusContext.Provider>
    );
};

