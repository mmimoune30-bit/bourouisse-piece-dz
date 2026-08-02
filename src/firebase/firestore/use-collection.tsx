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
  
  // Track active query string to avoid multiple listeners for identical query logical state
  const activeQueryKeyRef = useRef<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // SSR Check & Validation
    if (!query || typeof window === 'undefined') {
      if (!query) {
        setData([]);
        setLoading(false);
      }
      return;
    }

    // Stabilize query identification to prevent redundant listeners during Fast Refresh
    const queryKey = query.toString();
    if (activeQueryKeyRef.current === queryKey) return;

    // Cleanup previous listener before starting new one
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    let isMounted = true;
    activeQueryKeyRef.current = queryKey;
    setLoading(true);

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
          
          console.warn("Firestore collection sync error:", err);
          setError(err);
          setLoading(false);
        }
      );

      unsubscribeRef.current = unsubscribe;

      return () => {
        isMounted = false;
        activeQueryKeyRef.current = null;
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
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
