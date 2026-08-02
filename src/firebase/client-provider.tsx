'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * Enhanced Firebase Client Provider.
 * Guarantees that Firebase services are initialized exactly once and only on the client.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const instancesRef = useRef<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // Execution happens strictly on client-side after mount to ensure hydration and singleton safety
    if (!instancesRef.current) {
      try {
        const instances = initializeFirebase();
        if (instances.app) {
          instancesRef.current = instances;
          setIsReady(true);
        }
      } catch (error) {
        console.error("Firebase Client Provider failed to boot:", error);
        // We still set ready to allow standard error handling to take over
        setIsReady(true);
      }
    } else {
      setIsReady(true);
    }
  }, []);

  // Show a branded, stable loading state while core is booting
  if (!isReady || !instancesRef.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center space-y-2">
            <h2 className="text-white font-black tracking-widest text-lg uppercase">BOUROUISSE</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-widest animate-pulse">
              Establishing Secure Connection...
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
