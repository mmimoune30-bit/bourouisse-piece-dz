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
 * خطاف المزامنة اللحظية للمجموعات (Real-time Collection Sync).
 * يقوم بتحديث الواجهة فوراً عند تغير أي بيانات في Firestore.
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

    // إنشاء مستمع لحظي (Real-time Listener)
    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        console.error("Firestore Sync Error:", err);
        
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

    // تنظيف المستمع عند إلغاء تحميل المكون
    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
