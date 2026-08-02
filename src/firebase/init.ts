'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, memoryLocalCache, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Advanced Singleton Initialization for Firebase.
 * Fixes INTERNAL ASSERTION FAILED (ID: ca9) by preventing double initialization 
 * of Firestore settings during Fast Refresh.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  const g = globalThis as any;

  // 1. Return existing instances if they are already stable in the global scope
  if (g.__FIREBASE_INSTANCES__) {
    return g.__FIREBASE_INSTANCES__;
  }

  try {
    // 2. Handle App initialization (Idempotent)
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 3. Handle Firestore initialization with explicit memory cache
    // This is critical to avoid IndexedDB lock conflicts during HMR
    let firestore: Firestore;
    if (getApps().length > 0) {
      // If app existed, try to get existing firestore
      try {
        firestore = getFirestore(app);
      } catch (e) {
        // Fallback for edge cases
        firestore = initializeFirestore(app, {
          localCache: memoryLocalCache(),
        });
      }
    } else {
      // First time initialization
      firestore = initializeFirestore(app, {
        localCache: memoryLocalCache(),
      });
    }

    // 4. Handle Auth
    const auth = getAuth(app);

    // 5. Store globally to ensure absolute singleton behavior
    const instances = { app, firestore, auth };
    g.__FIREBASE_INSTANCES__ = instances;

    return instances;
  } catch (error) {
    console.warn("Firebase Init Warning (Non-Fatal):", error);
    // Final emergency fallback
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { 
      app, 
      firestore: getFirestore(app), 
      auth: getAuth(app) 
    };
  }
}
