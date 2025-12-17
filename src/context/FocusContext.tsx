import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { FocusSession } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export type TimerMode = 'focus' | 'short' | 'long' | 'custom';

export const MODES: Record<TimerMode, { label: string; minutes: number; color: string }> = {
    focus: { label: 'Focus', minutes: 25, color: 'text-primary' },
    short: { label: 'Short Break', minutes: 5, color: 'text-teal-500' },
    long: { label: 'Long Break', minutes: 15, color: 'text-indigo-500' },
    custom: { label: 'Custom', minutes: 25, color: 'text-pink-500' }
};

interface FocusContextType {
    isFocusMode: boolean;
    toggleFocusMode: () => void;

    // Timer State
    mode: TimerMode;
    setMode: (mode: TimerMode) => void;
    timeLeft: number;
    isActive: boolean;
    toggleTimer: () => void;
    resetTimer: () => void;
    setCustomDuration: (minutes: number) => void;

    // History
    sessionHistory: FocusSession[];
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

const HISTORY_COLLECTION = 'focus_history';

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [isFocusMode, setIsFocusMode] = useState(false);

    // Timer State in Context (Global Persistence)
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [customMinutes, setCustomMinutes] = useState(25);

    // UseRef for audio to persist across renders/navigation
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [sessionHistory, setSessionHistory] = useState<FocusSession[]>([]);

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
    }, []);

    // Load history
    useEffect(() => {
        if (!user) return;
        const loadHistory = async () => {
            try {
                const q = query(collection(db, HISTORY_COLLECTION), where('userId', '==', user.uid), orderBy('startTime', 'desc'));
                const snapshot = await getDocs(q);
                setSessionHistory(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as FocusSession[]);
            } catch (error) {
                console.error('Error loading history:', error);
            }
        };
        loadHistory();
    }, [user]);

    // Timer Logic (Moved from FocusMode.tsx)
    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (audioRef.current) audioRef.current.play().catch(console.error);

            // Save Session if it was a real focus session
            if (user && (mode === 'focus' || mode === 'custom')) {
                const newSession: Omit<FocusSession, 'id'> & { userId: string } = {
                    startTime: Date.now(),
                    duration: mode === 'custom' ? customMinutes : MODES[mode].minutes,
                    completed: true,
                    userId: user.uid
                };
                addDoc(collection(db, HISTORY_COLLECTION), newSession)
                    .then(docRef => setSessionHistory(prev => [{ ...newSession, id: docRef.id }, ...prev]))
                    .catch(console.error);
            }
        }
        return () => clearInterval(interval);
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
            sessionHistory
        }}>
            {children}
        </FocusContext.Provider>
    );
};

export const useFocus = () => {
    const context = useContext(FocusContext);
    if (!context) throw new Error('useFocus must be used within a FocusProvider');
    return context;
};
