import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const missingFirebaseEnvVars = Object.entries({
    VITE_FIREBASE_API_KEY: envConfig.apiKey,
    VITE_FIREBASE_AUTH_DOMAIN: envConfig.authDomain,
    VITE_FIREBASE_PROJECT_ID: envConfig.projectId,
    VITE_FIREBASE_STORAGE_BUCKET: envConfig.storageBucket,
    VITE_FIREBASE_MESSAGING_SENDER_ID: envConfig.messagingSenderId,
    VITE_FIREBASE_APP_ID: envConfig.appId,
})
    .filter(([, value]) => !value)
    .map(([key]) => key);

const isConfigValid = missingFirebaseEnvVars.length === 0;

if (!isConfigValid) {
    console.warn(
        `[Firebase] Missing required environment variables: ${missingFirebaseEnvVars.join(', ')}. ` +
        `Running with fallback demo configuration. Set these in your .env file for real Firebase connection.`
    );
}

const firebaseConfig = isConfigValid ? envConfig : {
    apiKey: envConfig.apiKey || 'demo-api-key',
    authDomain: envConfig.authDomain || 'demo-app.firebaseapp.com',
    projectId: envConfig.projectId || 'demo-app',
    storageBucket: envConfig.storageBucket || 'demo-app.appspot.com',
    messagingSenderId: envConfig.messagingSenderId || '123456789012',
    appId: envConfig.appId || '1:123456789012:web:demo',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
