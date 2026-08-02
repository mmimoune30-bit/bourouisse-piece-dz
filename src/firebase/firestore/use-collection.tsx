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
 * الخطاف الدفاعي المستقر لجلب المجموعات.
 * يعالج تعارضات Virtual Engine عبر التأكد من ثبات مراجع الاستعلام قبل بدء المستمع.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
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

    // 2. منع إعادة الاشتراك إذا لم يتغير الاستعلام (تثبيت المرجع)
    const currentQueryKey = query.toString();
    if (lastQueryKey.current === currentQueryKey) return;

    // 3. تنظيف أي مستمع نشط فوراً
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    let isMounted = true;
    lastQueryKey.current = currentQueryKey;
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
          
          setError(err);
          setLoading(false);
        }
      );

      unsubscribeRef.current = unsubscribe;

    } catch (e: any) {
      if (isMounted) {
        setLoading(false);
        setError(e);
      }
    }

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      lastQueryKey.current = null;
    };
  }, [query]);

  return { data, loading, error };
}
