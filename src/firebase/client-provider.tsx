'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * Defensive Firebase Client Provider.
 * Prevents hydration crashes and ensures the Virtual Engine is only started once.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const instancesRef = useRef<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // Run initialization once on mount
    if (typeof window !== 'undefined' && !instancesRef.current) {
      try {
        const instances = initializeFirebase();
        instancesRef.current = instances;
        setIsReady(true);
      } catch (error) {
        console.error("Firebase Provider Initialization Error:", error);
        setIsReady(true); // Proceed to allow error boundaries to catch failures
      }
    } else {
      setIsReady(true);
    }
  }, []);

  // Branded fallback loader to avoid flickering and blank screens during init
  if (!isReady || !instancesRef.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-2">
            <h2 className="text-white font-black tracking-widest text-lg uppercase">BOUROUISSE</h2>
            <p className="text-white/30 text-[10px] uppercase tracking-widest animate-pulse font-bold">
              Secure Engine Initializing...
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
