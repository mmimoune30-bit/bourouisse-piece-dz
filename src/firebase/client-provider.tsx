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
  // هذا ضروري جداً لتجنب أخطاء Firestore Assertion الناتجة عن التهيئة المزدوجة.
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    try {
      // يتم التنفيذ فقط في المتصفح بعد الهيدريشن
      const firebase = initializeFirebase();
      
      if (firebase.app && firebase.firestore && firebase.auth) {
        setInstances({
          app: firebase.app,
          firestore: firebase.firestore,
          auth: firebase.auth,
        });
        initialized.current = true;
      }
    } catch (err) {
      console.error("Firebase Client Provider failed to initialize:", err);
    }
  }, []);

  // إذا لم تكتمل التهيئة بعد، نعرض الأبناء مع قيم فارغة لتجنب كسر الهيدريشن
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
