'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache,
  Firestore,
  terminate
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Robust Singleton initialization for Firebase.
 * Fixes "INTERNAL ASSERTION FAILED (ID: ca9)" by:
 * 1. Using memory-only cache to avoid IndexedDB lock contention in dev/studio environments.
 * 2. Ensuring initializeFirestore is only called once via global flag.
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

  // Preserve instances across Fast Refresh
  if (global.__FIREBASE_STORE__) {
    return global.__FIREBASE_STORE__;
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    let firestore: Firestore;
    if (global.__FIRESTORE_INITIALIZED__) {
      firestore = getFirestore(app);
    } else {
      try {
        // Use memoryLocalCache to prevent the "ca9" assertion failure which happens
        // when Fast Refresh tries to re-initialize Firestore with persistence.
        firestore = initializeFirestore(app, {
          localCache: memoryLocalCache(),
        });
        global.__FIRESTORE_INITIALIZED__ = true;
      } catch (e) {
        firestore = getFirestore(app);
        global.__FIRESTORE_INITIALIZED__ = true;
      }
    }

    const auth = getAuth(app);
    const instances = { app, firestore, auth };
    global.__FIREBASE_STORE__ = instances;

    return instances;
  } catch (error) {
    console.error("Firebase Initialization Critical Failure:", error);
    // Absolute fallback to prevent white screen
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { app, firestore: getFirestore(app), auth: getAuth(app) };
  }
}
