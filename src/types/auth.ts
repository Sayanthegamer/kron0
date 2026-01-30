import type { User } from 'firebase/auth';

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    lastError: string | null;
    isSigningIn: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}
