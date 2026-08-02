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
 * Safe Collection Hook that guards against internal Firestore errors (ID: ca9)
 * by ensuring initialization is complete before attaching listeners.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 1. Safety Check: Don't run on server or without a valid query object
    if (!query || typeof window === 'undefined') {
      if (!query) setLoading(false);
      return;
    }

    let isMounted = true;

    try {
      // 2. Attach real-time listener
      const unsubscribe = onSnapshot(
        query,
        (snapshot: QuerySnapshot<DocumentData>) => {
          if (!isMounted) return;
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(items);
          setLoading(false);
          setError(null);
        },
        async (err) => {
          if (!isMounted) return;
          
          // 3. Handle Permission Errors via the specialized architecture
          if (err.code === 'permission-denied') {
            const permError = new FirestorePermissionError({
              path: 'collection_query',
              operation: 'list'
            });
            errorEmitter.emit('permission-error', permError);
          }
          
          setError(err);
          setLoading(false);
        }
      );

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (e: any) {
      if (isMounted) {
        setLoading(false);
        setError(e);
      }
    }
  }, [query]);

  return { data, loading, error };
}
