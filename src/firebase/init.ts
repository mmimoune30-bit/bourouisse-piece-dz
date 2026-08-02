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
 * Fixes "INTERNAL ASSERTION FAILED (ID: ca9)" by strictly reusing existing instances
 * and avoiding re-initialization of the Virtual Engine.
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

  // 1. Check if we already have a fully initialized store in this browser session
  if (global.__FIREBASE_STORE__) {
    return global.__FIREBASE_STORE__;
  }

  try {
    // 2. Initialize or retrieve the Firebase App
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 3. Initialize Firestore with memory-only cache to avoid ca9 persistence conflicts
    let firestore: Firestore;
    
    // We use a specific flag to ensure initializeFirestore is ONLY called once per page load
    if (!global.__FIRESTORE_INITIALIZED__) {
      try {
        firestore = initializeFirestore(app, {
          localCache: memoryLocalCache(),
        });
        global.__FIRESTORE_INITIALIZED__ = true;
      } catch (e) {
        // If initializeFirestore fails (e.g. already initialized), fallback to getFirestore
        firestore = getFirestore(app);
      }
    } else {
      firestore = getFirestore(app);
    }

    // 4. Initialize Auth
    const auth = getAuth(app);

    const instances = { app, firestore, auth };
    
    // 5. Store globally to prevent Fast Refresh from breaking the engine state
    global.__FIREBASE_STORE__ = instances;

    return instances;
  } catch (error) {
    console.error("Firebase Initialization Critical Failure:", error);
    // Absolute fallback to prevent UI crash
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { app, firestore: getFirestore(app), auth: getAuth(app) };
  }
}
