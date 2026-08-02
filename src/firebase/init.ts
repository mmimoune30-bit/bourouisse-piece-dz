'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache,
  Firestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Robust Singleton initialization for Firebase.
 * Fixes "INTERNAL ASSERTION FAILED (ID: ca9)" by ensuring strict single initialization
 * of the Virtual Engine and consistent caching settings.
 */

interface FirebaseInstances {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export function initializeFirebase(): FirebaseInstances {
  if (typeof window === 'undefined') {
    return { app: null as any, firestore: null as any, auth: null as any };
  }

  const global = globalThis as any;

  // 1. Check if we already have a fully initialized instances in this session
  if (global.__FIREBASE_STORE__) {
    return global.__FIREBASE_STORE__;
  }

  try {
    // 2. Initialize or retrieve the Firebase App
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 3. Initialize Firestore
    // To prevent ID: ca9, we MUST NOT call initializeFirestore if it's already touched by getFirestore
    // or call it with inconsistent settings during HMR.
    let firestore: Firestore;
    
    try {
      // Use memory-only cache in development to avoid persistence locks causing ca9
      firestore = initializeFirestore(app, {
        localCache: memoryLocalCache(),
      });
    } catch (e) {
      // Fallback to getFirestore if initializeFirestore was already called
      firestore = getFirestore(app);
    }

    // 4. Initialize Auth
    const auth = getAuth(app);

    const instances = { app, firestore, auth };
    
    // 5. Store globally to prevent Fast Refresh from breaking the virtual engine state
    global.__FIREBASE_STORE__ = instances;

    return instances;
  } catch (error) {
    console.error("Firebase Initialization Critical Failure:", error);
    // Absolute fallback to prevent UI crash
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { app, firestore: getFirestore(app), auth: getAuth(app) };
  }
}
