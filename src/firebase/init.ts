'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache, 
  persistentLocalCache,
  Firestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Robust Singleton initialization for Firebase.
 * Surmounts the "INTERNAL ASSERTION FAILED (ID: ca9)" error by:
 * 1. Using globalThis to cache instances across Fast Refresh (HMR).
 * 2. Forcing memoryLocalCache in development to avoid IndexedDB lock contention.
 * 3. Safely fallback to getFirestore if initializeFirestore was already called.
 */

interface FirebaseInstances {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export function initializeFirebase(): FirebaseInstances {
  // Ensure this only runs on the client
  if (typeof window === 'undefined') {
    return {} as FirebaseInstances;
  }

  const global = globalThis as any;

  // 1. Check for cached instances to preserve state during HMR
  if (global.__FIREBASE_STORE__) {
    return global.__FIREBASE_STORE__;
  }

  try {
    // 2. Initialize App
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 3. Initialize Firestore with specific cache settings for the environment
    let firestore: Firestore;
    const isDev = process.env.NODE_ENV === 'development';

    try {
      // In Dev, we MUST use memoryLocalCache to prevent the "ca9" assertion failure
      // which happens when multiple tabs or HMR try to grab the same IndexedDB lock.
      firestore = initializeFirestore(app, {
        localCache: isDev ? memoryLocalCache() : persistentLocalCache({}),
      });
    } catch (e) {
      // If Firestore was already initialized (e.g. by a another module during HMR)
      // retrieve the existing instance instead of crashing.
      firestore = getFirestore(app);
    }

    // 4. Initialize Auth
    const auth = getAuth(app);

    const instances = { app, firestore, auth };
    
    // Store in global scope for Next.js Fast Refresh stability
    global.__FIREBASE_STORE__ = instances;

    return instances;
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    // Absolute fallback attempt
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { app, firestore: getFirestore(app), auth: getAuth(app) };
  }
}
