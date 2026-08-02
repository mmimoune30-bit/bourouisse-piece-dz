'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache, 
  persistentLocalCache,
  Firestore,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Robust Singleton initialization for Firebase services.
 * Specifically handles Next.js Fast Refresh to prevent "Unexpected state (ID: ca9)" errors
 * by storing instances in globalThis.
 */

interface FirebaseInstances {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export function initializeFirebase(): FirebaseInstances {
  // SSR Safety
  if (typeof window === 'undefined') {
    return {} as FirebaseInstances;
  }

  const global = globalThis as any;

  // 1. Check if we already have stable instances stored globally
  if (global.__FIREBASE_STORE__) {
    return global.__FIREBASE_STORE__;
  }

  try {
    // 2. Initialize or retrieve Firebase App
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 3. Initialize Firestore with absolute singleton logic
    let firestore: Firestore;
    
    // Try to get the existing instance first to avoid re-initialization conflicts
    try {
      firestore = getFirestore(app);
    } catch (e) {
      // If no instance exists, initialize with specific cache settings
      const isDev = process.env.NODE_ENV === 'development';
      firestore = initializeFirestore(app, {
        localCache: isDev ? memoryLocalCache() : persistentLocalCache({}),
        // Ensure experimentalForceLongPolling is NOT set here unless explicitly needed, 
        // as it can sometimes trigger internal engine issues.
      });
    }

    // 4. Initialize Auth
    const auth = getAuth(app);

    const instances = { app, firestore, auth };
    
    // Store globally to ensure absolute singleton behavior across Fast Refresh cycles
    global.__FIREBASE_STORE__ = instances;

    return instances;
  } catch (error) {
    console.error("Critical Firebase Initialization Failure:", error);
    // Extreme fallback to keep the app alive
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    return { app, firestore, auth };
  }
}
