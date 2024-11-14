// /Users/ayenmonasha/Desktop/celoptimaai/src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics only if `window` is available
let analytics;
if (typeof window !== 'undefined') {
  // Lazy load Firebase Analytics to prevent errors during SSR
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  }).catch((err) => {
    console.error('Failed to initialize Firebase Analytics:', err);
  });
}

export { app, db, analytics };
