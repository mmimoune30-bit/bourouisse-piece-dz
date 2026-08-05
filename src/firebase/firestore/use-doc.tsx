'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  DocumentReference, 
  getDoc, 
  DocumentSnapshot 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * الخطاف الدفاعي لجلب مستند واحد بمهلة زمنية لمنع التعليق.
 */
export function useDoc(docRef: DocumentReference | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const activePath = useRef<string | null>(null);

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

    let isMounted = true;
    activePath.current = path;

    const fetchData = async () => {
      setLoading(true);

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );

      try {
        const snapshot = await Promise.race([
          getDoc(docRef),
          timeoutPromise
        ]) as DocumentSnapshot;
        
        if (!isMounted) return;

        if (snapshot && snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setData(null);
        }
        
        setError(null);
      } catch (err: any) {
        if (!isMounted) return;
        
        console.warn("Firestore Doc Guard Triggered:", err.message);
        
        if (err.code === 'permission-denied') {
          const permError = new FirestorePermissionError({
            path: docRef.path || 'document',
            operation: 'get'
          });
          errorEmitter.emit('permission-error', permError);
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
  }, [docRef]);

  return { data, loading, error };
}
