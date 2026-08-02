'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase الآمن ضد أخطاء Hydration والانهيار المفاجئ.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const instancesRef = useRef<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // التنفيذ يتم حصرياً في جهة العميل بعد الـ Mount
    try {
      instancesRef.current = initializeFirebase();
      setIsReady(true);
    } catch (error) {
      console.error("Critical Provider Fail:", error);
      // نضمن عدم بقاء التطبيق معلقاً حتى لو فشلت التهيئة
      setIsReady(true);
    }
  }, []);

  // منع ظهور الشاشة البيضاء - عرض حالة تحميل خفيفة بدلاً من الانهيار
  if (!isReady || !instancesRef.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white/40 font-black tracking-widest text-[8px] uppercase">
            Synchronizing Secure Core...
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
