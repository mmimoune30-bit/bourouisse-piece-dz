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
 * الخطاف الدفاعي لجلب المجموعات.
 * يعالج تعارضات Virtual Engine عبر ضمان عدم تكرار المستمعين.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const activeQueryId = useRef<string | null>(null);

  useEffect(() => {
    if (!query || typeof window === 'undefined') {
      if (!query) {
        setData([]);
        setLoading(false);
      }
      return;
    }

    // استخدام وصف الاستعلام كبصمة فريدة للتحقق من التغيير
    const currentId = query.toString();
    if (activeQueryId.current === currentId) return;

    // تنظيف أي مستمع سابق فوراً قبل البدء بالجديد
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    let isMounted = true;
    activeQueryId.current = currentId;
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

      return () => {
        isMounted = false;
        activeQueryId.current = null;
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
  }, [query]);

  return { data, loading, error };
}
