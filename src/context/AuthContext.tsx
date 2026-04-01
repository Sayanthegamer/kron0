import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getErrorMessage, logError } from '../lib/errors';
import { useToast } from '../hooks/useToast';
import { AuthContext } from './definitions/AuthContextDefinition';
import {
    emailSignInLimiter,
    emailSignUpLimiter,
    googleSignInLimiter
} from '../lib/rateLimiter';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { showError, showSuccess, showInfo } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastError, setLastError] = useState<string | null>(null);
    const [isSigningIn, setIsSigningIn] = useState(false);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            logError(new Error('Auth initialization timed out'), 'Auth State');
            setIsLoading(false);
        }, 10000);

        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                window.clearTimeout(timeoutId);
                setUser(user);
                setIsLoading(false);
            },
            (error) => {
                window.clearTimeout(timeoutId);

                const errorMessage = getErrorMessage(error);
                logError(error, 'Auth State');
                setLastError(errorMessage);
                showError('Authentication error', errorMessage);

                setUser(null);
                setIsLoading(false);
            }
        );

        return () => {
            window.clearTimeout(timeoutId);
            unsubscribe();
        };
    }, [showError]);

    const clearError = () => setLastError(null);

    const signInWithGoogle = async () => {
        // Rate-limit check
        const { allowed, waitSeconds } = googleSignInLimiter.check();
        if (!allowed) {
            const msg = `Too many attempts. Please wait ${waitSeconds}s before trying again.`;
            setLastError(msg);
            showError('Rate limited', msg);
            throw new Error(msg);
        }

        try {
            setIsSigningIn(true);
            setLastError(null);
            await signInWithPopup(auth, googleProvider);
            googleSignInLimiter.record(true);
            showSuccess('Welcome back!', 'Successfully signed in with Google');
        } catch (error) {
            googleSignInLimiter.record(false);
            const errorMessage = getErrorMessage(error);

            logError(error, 'Google Sign In');
            setLastError(errorMessage);
            showError('Sign in failed', errorMessage);

            throw error;
        } finally {
            setIsSigningIn(false);
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        // Rate-limit check
        const { allowed, waitSeconds } = emailSignInLimiter.check();
        if (!allowed) {
            const msg = `Too many sign-in attempts. Please wait ${waitSeconds}s.`;
            setLastError(msg);
            showError('Rate limited', msg);
            throw new Error(msg);
        }

        // Input sanity checks (Firebase validates too, but fail fast)
        if (!email.trim() || !password) {
            const msg = 'Email and password are required.';
            setLastError(msg);
            showError('Validation error', msg);
            throw new Error(msg);
        }

        try {
            setIsSigningIn(true);
            setLastError(null);
            await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
            emailSignInLimiter.record(true);
            showSuccess('Welcome back!', 'Successfully signed in');
        } catch (error) {
            emailSignInLimiter.record(false);
            const errorMessage = getErrorMessage(error);

            logError(error, 'Email Sign In');
            setLastError(errorMessage);
            showError('Sign in failed', errorMessage);

            // Show remaining attempts if still unlocked
            const remaining = emailSignInLimiter.getRemainingAttempts();
            if (remaining > 0 && remaining <= 2) {
                showInfo('Warning', `${remaining} sign-in attempt${remaining === 1 ? '' : 's'} remaining before lockout.`);
            }

            throw error;
        } finally {
            setIsSigningIn(false);
        }
    };

    const signUpWithEmail = async (email: string, password: string) => {
        // Rate-limit check — stricter for sign-up to prevent account farming
        const { allowed, waitSeconds } = emailSignUpLimiter.check();
        if (!allowed) {
            const msg = `Too many sign-up attempts. Please wait ${waitSeconds}s.`;
            setLastError(msg);
            showError('Rate limited', msg);
            throw new Error(msg);
        }

        // Password strength check (min 8 chars enforced in UI too)
        if (password.length < 8) {
            const msg = 'Password must be at least 8 characters.';
            setLastError(msg);
            showError('Weak password', msg);
            throw new Error(msg);
        }

        try {
            setIsSigningIn(true);
            setLastError(null);
            await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
            emailSignUpLimiter.record(true);
            showSuccess('Welcome!', 'Account created successfully');
        } catch (error) {
            emailSignUpLimiter.record(false);
            const errorMessage = getErrorMessage(error);

            logError(error, 'Email Sign Up');
            setLastError(errorMessage);
            showError('Sign up failed', errorMessage);

            throw error;
        } finally {
            setIsSigningIn(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            showSuccess('Goodbye!', 'Successfully signed out');
        } catch (error) {
            const errorMessage = getErrorMessage(error);

            logError(error, 'Logout');
            setLastError(errorMessage);
            showError('Logout failed', errorMessage);

            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            lastError,
            isSigningIn,
            signInWithGoogle,
            signInWithEmail,
            signUpWithEmail,
            logout,
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    );
};
