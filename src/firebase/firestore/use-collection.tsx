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
    // التحقق من استقرار الاستعلام وجاهزية Firestore
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
    } catch (e: any) {
      if (isSubscribed) {
        setLoading(false);
      }
    }
  }, [query]);

  return { data, loading, error };
}
