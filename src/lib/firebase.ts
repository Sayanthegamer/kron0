import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const missingFirebaseEnvVars = Object.entries({
    VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
    VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
    VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
    VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
    VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
    VITE_FIREBASE_APP_ID: firebaseConfig.appId,
})
    .filter(([, value]) => !value)
    .map(([key]) => key);

// ✅ THROW ERROR IMMEDIATELY if env vars are missing
if (missingFirebaseEnvVars.length > 0) {
    const errorMessage = `[Firebase] Missing required environment variables: ${missingFirebaseEnvVars.join(', ')}. ` +
        `Make sure these are set in your Vercel environment variables or .env file.`;

    console.error(errorMessage);

    // ✅ Prevent app initialization by throwing
    throw new Error(errorMessage);
}

// ✅ Only initialize if all vars are present
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
