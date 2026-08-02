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
 * Defensive Document Hook.
 */
export function useDoc(docRef: DocumentReference | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const activeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!docRef || typeof window === 'undefined') {
      if (!docRef) setLoading(false);
      return;
    }

    const path = docRef.path;
    if (activeRef.current === path) return;

    let isMounted = true;
    activeRef.current = path;

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
        activeRef.current = null;
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
