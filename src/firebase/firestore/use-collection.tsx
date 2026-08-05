'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Query, 
  getDocs
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * خطاف جلب المجموعات المحصن ضد التحميل اللانهائي.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const lastQueryKey = useRef<string | null>(null);

  useEffect(() => {
    if (!query || typeof window === 'undefined') {
      if (!query) {
        setData([]);
        setLoading(false);
      }
      return;
    }

    const currentQueryKey = query.toString();
    if (lastQueryKey.current === currentQueryKey) return;

    let isMounted = true;
    lastQueryKey.current = currentQueryKey;

    const fetchData = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(query);
        if (!isMounted) return;

        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setData(items);
        setError(null);
      } catch (err: any) {
        if (!isMounted) return;
        
        console.error("Firestore Collection Fetch Failed:", err);
        
        if (err.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: 'collection_query',
            operation: 'list'
          }));
        }
        
        setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return { data, loading, error };
}
