'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * Defensive Collection Hook.
 * Prevents "Unexpected state (ID: ca9)" by stabilizing listeners 
 * and ensuring clean unmounts.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Track active query to avoid multiple listeners for the same query object
  const activeQueryIdRef = useRef<string | null>(null);

  useEffect(() => {
    // SSR Check & Validation
    if (!query || typeof window === 'undefined') {
      if (!query) setLoading(false);
      return;
    }

    // Stabilize query identification
    const queryKey = query.toString();
    if (activeQueryIdRef.current === queryKey) return;

    let isMounted = true;
    activeQueryIdRef.current = queryKey;

    try {
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
        activeQueryIdRef.current = null;
        unsubscribe();
      };
    } catch (e: any) {
      if (isMounted) {
        setLoading(false);
        setError(e);
      }
    }
  }, [query]); // Query MUST be memoized (useMemo) in the parent component

  return { data, loading, error };
}
