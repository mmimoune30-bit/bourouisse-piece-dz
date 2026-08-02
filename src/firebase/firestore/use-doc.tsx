'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  DocumentReference, 
  onSnapshot, 
  DocumentSnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * الخطاف الدفاعي لجلب مستند واحد.
 * يحافظ على استقرار المستمعين لمنع أخطاء Assertion في بيئة Next.js.
 */
export function useDoc(docRef: DocumentReference | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const activePath = useRef<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!docRef || typeof window === 'undefined') {
      if (!docRef) {
        setData(null);
        setLoading(false);
      }
      return;
    }

    const path = docRef.path;
    if (activePath.current === path) return;

    // تنظيف المستمع السابق لمنع تعارض Virtual Engine
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    let isMounted = true;
    activePath.current = path;
    setLoading(true);

    try {
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot: DocumentSnapshot<DocumentData>) => {
          if (!isMounted) return;
          setData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
          setLoading(false);
          setError(null);
        },
        async (err) => {
          if (!isMounted) return;
          
          if (err.code === 'permission-denied') {
            const permError = new FirestorePermissionError({
              path: docRef.path || 'document',
              operation: 'get'
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
        activePath.current = null;
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
  }, [docRef]);

  return { data, loading, error };
}
