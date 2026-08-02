'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل (Client Provider).
 * يضمن تهيئة مستقرة لمرة واحدة فقط ومعالجة حالة الانتظار بشكل صحيح.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [instances, setInstances] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);
  
  const initialized = useRef(false);

  useEffect(() => {
    // نمنع التهيئة المزدوجة حتى في وضع React Strict Mode
    if (initialized.current) return;
    
    const firebase = initializeFirebase();
    
    if (firebase.app && firebase.firestore && firebase.auth) {
      setInstances({
        app: firebase.app,
        firestore: firebase.firestore,
        auth: firebase.auth,
      });
      initialized.current = true;
    }
  }, []);

  // تمرير القيم للـ Provider (تكون null في أول رندرة فقط قبل الـ useEffect)
  return (
    <FirebaseProvider 
      firebaseApp={instances?.app || null} 
      firestore={instances?.firestore || null} 
      auth={instances?.auth || null}
    >
      {children}
    </FirebaseProvider>
  );
}
