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
 * Strict Singleton initialization for Firebase.
 * Surmounts the "INTERNAL ASSERTION FAILED (ID: ca9)" error by ensuring 
 * settings are applied exactly once and instances are cached globally.
 */

interface FirebaseInstances {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export function initializeFirebase(): FirebaseInstances {
  if (typeof window === 'undefined') {
    return {} as FirebaseInstances;
  }

  const global = globalThis as any;

  // 1. Return cached instances if they exist (Survivability during HMR)
  if (global.__FIREBASE_STORE__) {
    return global.__FIREBASE_STORE__;
  }

  try {
    // 2. Init App
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 3. Init Firestore with strict settings
    let firestore: Firestore;
    const isDev = process.env.NODE_ENV === 'development';

    try {
      // In SDK 11, try to initialize once. If fails, fallback to getFirestore.
      firestore = initializeFirestore(app, {
        localCache: isDev ? memoryLocalCache() : persistentLocalCache({}),
      });
    } catch (e) {
      // Re-initialization occurred (likely HMR), recover the existing instance
      firestore = getFirestore(app);
    }

    // 4. Init Auth
    const auth = getAuth(app);

    const instances = { app, firestore, auth };
    
    // Store globally for Next.js Fast Refresh stability
    global.__FIREBASE_STORE__ = instances;

    return instances;
  } catch (error) {
    console.error("Firebase Boot Error:", error);
    // Absolute fallback
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { app, firestore: getFirestore(app), auth: getAuth(app) };
  }
}
