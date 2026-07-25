'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase بشكل آمن ومستقر.
 * نستخدم الكائن العالمي 'window' في بيئة التطوير لضمان عدم إعادة تهيئة 
 * Firestore بشكل متكرر عند تحديث الكود (HMR)، مما يمنع أخطاء Assertion.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') return {};

  const g = window as any;

  if (!g.__FIREBASE_APP__) {
    g.__FIREBASE_APP__ = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }

  if (!g.__FIREBASE_FIRESTORE__) {
    g.__FIREBASE_FIRESTORE__ = getFirestore(g.__FIREBASE_APP__);
  }

  if (!g.__FIREBASE_AUTH__) {
    g.__FIREBASE_AUTH__ = getAuth(g.__FIREBASE_APP__);
  }

  return { 
    app: g.__FIREBASE_APP__, 
    firestore: g.__FIREBASE_FIRESTORE__, 
    auth: g.__FIREBASE_AUTH__ 
  };
}
