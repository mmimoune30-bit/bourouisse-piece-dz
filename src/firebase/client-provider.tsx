'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * Firebase Client Provider.
 * Ensures Firebase services are initialized exactly once and stable references
 * are provided to the component tree.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const instancesRef = useRef<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // Initialize once on component mount (client-side only)
    if (!instancesRef.current) {
      try {
        const instances = initializeFirebase();
        instancesRef.current = instances;
        setIsReady(true);
      } catch (error) {
        console.error("Firebase Boot Failure:", error);
        setIsReady(true);
      }
    } else {
      setIsReady(true);
    }
  }, []);

  // Show a branded loading state while core instances are being established
  if (!isReady || !instancesRef.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center space-y-2">
            <h2 className="text-white font-black tracking-widest text-lg uppercase">BOUROUISSE</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-widest animate-pulse">
              SYNCING WITH CLOUD...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={instancesRef.current.app} 
      firestore={instancesRef.current.firestore} 
      auth={instancesRef.current.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
