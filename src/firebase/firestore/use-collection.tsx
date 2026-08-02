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
 * خطاف الاستماع للمجموعات - نسخة الحماية القصوى.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // التأكد من توفر الاستعلام واستقرار نسخة Firestore
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
          
          // معالجة منظمة لأخطاء الصلاحيات
          if (err.code === 'permission-denied') {
            const permError = new FirestorePermissionError({
              path: 'firestore_collection_sync',
              operation: 'list'
            });
            errorEmitter.emit('permission-error', permError);
          } else if (err.code !== 'cancelled') {
            console.warn("Firestore Real-time Sync Warning:", err.message);
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
      if (isSubscribed) {
        setError(e);
        setLoading(false);
      }
    }
  }, [query]);

  return { data, loading, error };
}
