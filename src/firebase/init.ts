'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache, 
  persistentLocalCache,
  Firestore
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Robust Singleton initialization to prevent Firestore "Unexpected state (ID: ca9)" error.
 * This error is caused by attempting to initialize Firestore multiple times with conflicting persistence settings,
 * which often happens during Next.js Fast Refresh / HMR.
 */
export function initializeFirebase() {
  // Ensure this only runs on the client side
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  // Use globalThis to store instances persistently across HMR cycles.
  const global = globalThis as any;

  if (global.__FIREBASE_STORE__) {
    return global.__FIREBASE_STORE__;
  }

  try {
    // 1. Initialize App (Idempotent check)
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 2. Initialize Firestore with memory cache in development
    let firestore: Firestore;
    
    try {
      const isDev = process.env.NODE_ENV === 'development';
      
      // Force memory cache in dev to stop ca9 errors (IndexedDB locking)
      firestore = initializeFirestore(app, {
        localCache: isDev ? memoryLocalCache() : persistentLocalCache({}),
      });
    } catch (e) {
      // Fallback: If initializeFirestore fails because it's already initialized,
      // get the existing instance to avoid assertion failures.
      firestore = getFirestore(app);
    }

    // 3. Initialize Auth
    const auth = getAuth(app);

    const instances = { app, firestore, auth };
    
    // Store globally to ensure absolute singleton behavior
    global.__FIREBASE_STORE__ = instances;

    return instances;
  } catch (error) {
    console.error("Critical Firebase Initialization Failure:", error);
    // Extreme fallback to keep the app alive
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    return { app, firestore, auth };
  }
}
