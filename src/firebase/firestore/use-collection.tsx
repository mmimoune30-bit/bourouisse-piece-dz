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
 * الخطاف المطور لجلب المجموعات.
 * يعالج تعارضات ID: ca9 عبر ضمان عدم تكرار المستمعين على استعلامات غير مستقرة.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastQueryRef = useRef<string | null>(null);

  useEffect(() => {
    // التحقق من الجاهزية
    if (!query || typeof window === 'undefined') {
      if (!query) {
        setData([]);
        setLoading(false);
      }
      return;
    }

    const currentQueryKey = query.toString();
    
    // منع إعادة التشغيل إذا كان الاستعلام متطابقاً (حماية من الحلقات المفرغة)
    if (lastQueryRef.current === currentQueryKey) return;
    lastQueryRef.current = currentQueryKey;

    // تنظيف المستمع السابق
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    let isMounted = true;
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
          
          console.warn("Firestore sync warning:", err.message);
          setError(err);
          setLoading(false);
        }
      );

      unsubscribeRef.current = unsubscribe;

      return () => {
        isMounted = false;
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
