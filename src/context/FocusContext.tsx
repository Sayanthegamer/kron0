import React, { createContext, useContext, useState, useEffect } from 'react';
import type { FocusSession } from '../types';

interface FocusContextType {
    isFocusMode: boolean;
    toggleFocusMode: () => void;
    timeLeft: number;
    isActive: boolean;
    toggleTimer: () => void;
    resetTimer: () => void;
    sessionHistory: FocusSession[];
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
    const [isActive, setIsActive] = useState(false);
    const [sessionHistory, setSessionHistory] = useState<FocusSession[]>(() => {
        const saved = localStorage.getItem('focus_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('focus_history', JSON.stringify(sessionHistory));
    }, [sessionHistory]);

    useEffect(() => {
        let interval: any;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Record session
            const newSession: FocusSession = {
                id: crypto.randomUUID(),
                startTime: Date.now(),
                duration: 25,
                completed: true
            };
            setSessionHistory(prev => [newSession, ...prev]);
            // Optional: Notification sound could go here
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleFocusMode = () => setIsFocusMode(prev => !prev);

    const toggleTimer = () => setIsActive(prev => !prev);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(FOCUS_DURATION);
    };

    return (
        <FocusContext.Provider value={{
            isFocusMode,
            toggleFocusMode,
            timeLeft,
            isActive,
            toggleTimer,
            resetTimer,
            sessionHistory
        }}>
            {children}
        </FocusContext.Provider>
    );
};

export const useFocus = () => {
    const context = useContext(FocusContext);
    if (context === undefined) {
        throw new Error('useFocus must be used within a FocusProvider');
    }
    return context;
};
