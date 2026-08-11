'use client';

import { useEffect, useState } from 'react';
import { 
  Query, 
  onSnapshot,
  QuerySnapshot,
  FirestoreError
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * خطاف المزامنة اللحظية للمجموعات (Safe Real-time Collection Sync).
 * تم تحسينه لمنع Re-render loops عبر فحص استقرار البيانات.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot) => {
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // تحديث الحالة فقط إذا كان طول المصفوفة أو المحتوى قد تغير
        setData(prev => {
          if (JSON.stringify(prev) === JSON.stringify(fetchedItems)) return prev;
          return fetchedItems;
        });
        
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        console.error("Firestore Collection Sync Error:", err);
        if (err.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: 'collection_query',
            operation: 'list'
          }));
        }
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]); // المزامنة تعتمد على ثبات مرجع الـ query من الخارج (يجب استخدام useMemo)

  return { data, loading, error };
}
