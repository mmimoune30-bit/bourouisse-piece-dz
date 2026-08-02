'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * Secure Client-side Firebase Provider.
 * Stabilizes references using a Singleton pattern to prevent internal assertion errors.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  
  // Use a ref to keep instances stable across re-renders
  const instances = useRef<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    if (!instances.current) {
      instances.current = initializeFirebase();
    }
    setIsReady(true);
  }, []);

  // Show a clean loading state until Firebase is stabilized in the browser
  if (!isReady || !instances.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white/50 font-black tracking-widest text-[8px] uppercase">
            Synchronizing Secure Environment...
          </span>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={instances.current.app} 
      firestore={instances.current.firestore} 
      auth={instances.current.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
