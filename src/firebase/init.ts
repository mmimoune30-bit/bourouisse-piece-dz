'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp | undefined;
let firestore: Firestore | undefined;
let auth: Auth | undefined;

/**
 * تهيئة Firebase بشكل آمن ومستقر في ملف منفصل لكسر التبعيات الدائرية.
 */
export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    if (!firestore) {
      firestore = getFirestore(app);
    }
    if (!auth) {
      auth = getAuth(app);
    }
  }

  return { app, firestore, auth };
}
