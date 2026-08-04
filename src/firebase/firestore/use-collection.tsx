'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Query, 
  getDocs, 
  QuerySnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * الخطاف الدفاعي المستقر لجلب المجموعات لمرة واحدة.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const lastQueryKey = useRef<string | null>(null);

  useEffect(() => {
    // 1. التحقق من جاهزية الاستعلام وبيئة المتصفح
    if (!query || typeof window === 'undefined') {
      if (!query) {
        setData([]);
        setLoading(false);
      }
      return;
    }

    // 2. منع إعادة الجلب إذا لم يتغير الاستعلام
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
        setLoading(false);
        setError(null);
      } catch (err: any) {
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
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return { data, loading, error };
}
