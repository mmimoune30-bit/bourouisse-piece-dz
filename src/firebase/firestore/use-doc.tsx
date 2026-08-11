'use client';

import { useEffect, useState } from 'react';
import { 
  DocumentReference, 
  onSnapshot,
  DocumentSnapshot,
  FirestoreError 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * خطاف المزامنة اللحظية لمستند واحد (Safe Real-time Document Sync).
 * تم تحسينه لمنع الحلقات اللانهائية عبر الاعتماد على المسار النصي.
 */
export function useDoc(docRef: DocumentReference | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  // استخدام المسار النصي كمرجع للاعتمادات لتجنب تكرار الكائنات
  const path = docRef?.path;

  useEffect(() => {
    if (!docRef || !path) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          const fetchedData = { id: snapshot.id, ...snapshot.data() };
          
          // تحديث الحالة فقط إذا تغيرت البيانات فعلياً
          setData((prev: any) => {
            if (JSON.stringify(prev) === JSON.stringify(fetchedData)) return prev;
            return fetchedData;
          });
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        console.error("Firestore Doc Sync Error:", err);
        if (err.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: path,
            operation: 'get'
          }));
        }
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]); // الاعتماد على السلسلة النصية للمسار

  return { data, loading, error };
}
