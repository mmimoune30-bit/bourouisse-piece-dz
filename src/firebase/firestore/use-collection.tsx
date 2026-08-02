'use client';

import { useEffect, useState } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * خطاف مخصص للاستماع لمجموعات البيانات في Firestore.
 * يحتوي على فحص استقرار (Readiness Check) لمنع أخطاء التهيئة.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // لا نبدأ الاستماع إذا لم يتوفر الاستعلام أو لم تجهز Firestore
    if (!query) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    try {
      const unsubscribe = onSnapshot(
        query,
        (snapshot: QuerySnapshot<DocumentData>) => {
          if (!isSubscribed) return;
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          if (!isSubscribed) return;
          
          // معالجة صامتة ومنظمة لأخطاء الصلاحيات
          if (err.code === 'permission-denied') {
            const permError = new FirestorePermissionError({
              path: 'firestore_collection_query',
              operation: 'list'
            });
            errorEmitter.emit('permission-error', permError);
          } else {
            console.warn("Firestore Listener Warning:", err.message);
          }
          
          setError(err);
          setLoading(false);
        }
      );

      return () => {
        isSubscribed = false;
        unsubscribe();
      };
    } catch (e: any) {
      console.error("Hook Subscription Error:", e);
      setLoading(false);
    }
  }, [query]);

  return { data, loading, error };
}
