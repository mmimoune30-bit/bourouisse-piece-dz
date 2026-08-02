'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * Safe Firebase Provider that guards against hydration errors and Firestore ca9 crashes.
 * Uses a global singleton pattern to maintain stable instances during Next.js Fast Refresh.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const instancesRef = useRef<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // Execution happens strictly on client-side after mount to ensure hydration safety
    try {
      const instances = initializeFirebase();
      instancesRef.current = instances;
      setIsReady(true);
    } catch (error) {
      console.error("Critical Client Provider Error:", error);
      setIsReady(true); // Ensure app doesn't hang in a black hole
    }
  }, []);

  // Prevent white screen - show a light, branded loading state while establishing secure core
  if (!isReady || !instancesRef.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white/40 font-black tracking-widest text-[8px] uppercase">
            BOUROUISSE - Establishing Secure Data Core...
          </span>
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
