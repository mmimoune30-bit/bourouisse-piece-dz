'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  DocumentReference, 
  getDoc, 
  DocumentData 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * الخطاف الدفاعي لجلب مستند واحد لمرة واحدة.
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
      try {
        const snapshot = await getDoc(docRef);
        
        if (!isMounted) return;

        setData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
        setLoading(false);
        setError(null);
      } catch (err: any) {
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
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [docRef]);

  return { data, loading, error };
}
