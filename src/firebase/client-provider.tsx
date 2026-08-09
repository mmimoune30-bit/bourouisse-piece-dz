'use client';

import React, { useState, useEffect } from 'react';
import { app, db, auth } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود خدمات Firebase الدفاعي.
 * يعتمد الآن مباشرة على Singleton من ملف init.ts لضمان الاستقرار المطلق.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ننتظر فقط التأكد من أننا في بيئة المتصفح لضمان استقرار الاتصال
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-2">
            <h2 className="text-white font-black tracking-widest text-xl uppercase">BOUROUISSE</h2>
            <p className="text-white/30 text-[10px] uppercase tracking-widest animate-pulse font-bold">
              Loading Stable Engine...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={app} 
      firestore={db} 
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
