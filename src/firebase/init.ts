'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache, 
  Firestore,
  clearIndexedDbPersistence
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Advanced Singleton Initialization for Firebase to fix ID: ca9.
 * Implements a strict cleanup and initialization pattern for stable HMR.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  const g = globalThis as any;

  // 1. Return stable instances if already initialized in this session
  if (g.__FIREBASE_STABLE_INSTANCES__) {
    return g.__FIREBASE_STABLE_INSTANCES__;
  }

  try {
    // 2. Setup Firebase App (Idempotent)
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 3. Clear persistence to avoid ca9 "Virtual Engine" conflicts
    // This is called asynchronously but will reset the DB state for this device.
    const tempDb = getFirestore(app);
    clearIndexedDbPersistence(tempDb).catch(() => {});

    // 4. Initialize Firestore with Memory Cache for maximum stability in development
    let firestore: Firestore;
    if (getApps().length > 1) {
       // If app was already there, don't try to initialize with settings again
       firestore = getFirestore(app);
    } else {
       try {
         firestore = initializeFirestore(app, {
           localCache: memoryLocalCache(),
         });
       } catch (e) {
         firestore = getFirestore(app);
       }
    }

    // 5. Handle Auth
    const auth = getAuth(app);

    const instances = { app, firestore, auth };
    
    // Store in global scope to survive HMR
    g.__FIREBASE_STABLE_INSTANCES__ = instances;

    return instances;
  } catch (error) {
    console.error("Firebase Initialization Critical Error:", error);
    // Emergency Fallback
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { 
      app, 
      firestore: getFirestore(app), 
      auth: getAuth(app) 
    };
  }
}
