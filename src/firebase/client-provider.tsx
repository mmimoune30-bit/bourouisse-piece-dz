'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { app, firestore, auth } = useMemo(() => {
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider 
      firebaseApp={app || null} 
      firestore={firestore || null} 
      auth={auth || null}
    >
      {children}
    </FirebaseProvider>
  );
}
