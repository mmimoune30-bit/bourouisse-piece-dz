'use client';

import React, { useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const app = useMemo(() => {
    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }, []);

  const db = useMemo(() => getFirestore(app), [app]);
  const auth = useMemo(() => getAuth(app), [app]);

  return (
    <FirebaseProvider firebaseApp={app} firestore={db} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
