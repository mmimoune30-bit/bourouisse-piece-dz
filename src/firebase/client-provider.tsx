'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل (Client Provider).
 * يضمن تهيئة Firebase بعد تحميل المكون في المتصفح فقط لكسر التعارضات.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [instances, setInstances] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);
  
  // نستخدم ref للتأكد من أن التهيئة تتم مرة واحدة فقط حتى في حالة Strict Mode
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    // يتم التنفيذ فقط في المتصفح بعد الهيدريشن
    const firebase = initializeFirebase();
    setInstances({
      app: firebase.app || null,
      firestore: firebase.firestore || null,
      auth: firebase.auth || null,
    });
    
    initialized.current = true;
  }, []);

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
