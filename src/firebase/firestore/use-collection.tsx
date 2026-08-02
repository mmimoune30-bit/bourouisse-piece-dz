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
 * مضاف إليه حماية لمنع العمليات على الـ VE الميت أثناء HMR.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    // نستخدم متغير محلي للتحقق من استمرار الـ Mount لمنع تحديث الحالة على مكون ملغى
    let isSubscribed = true;

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
        if (err.code === 'permission-denied') {
          const permError = new FirestorePermissionError({
            path: 'firestore_collection',
            operation: 'list'
          });
          errorEmitter.emit('permission-error', permError);
        }
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [query]);

  return { data, loading, error };
}
