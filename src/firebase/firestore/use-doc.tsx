'use client';

import { useEffect, useState } from 'react';
import { 
  DocumentReference, 
  onSnapshot, 
  DocumentSnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * Safe Document Hook that guards against internal Firestore errors (ID: ca9)
 */
export function useDoc(docRef: DocumentReference | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 1. Safety Check: Ensure ref exists and we are in client environment
    if (!docRef || typeof window === 'undefined') {
      if (!docRef) setLoading(false);
      return;
    }

    let isMounted = true;

    try {
      // 2. Attach real-time listener
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
          
          // 3. Handle Permission Errors
          if (err.code === 'permission-denied') {
            const permError = new FirestorePermissionError({
              path: docRef.path || 'document_reference',
              operation: 'get'
            });
            errorEmitter.emit('permission-error', permError);
          }
          
          setError(err);
          setLoading(false);
        }
      );

      return () => {
        isMounted = false;
        unsubscribe();
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
