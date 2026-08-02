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
 * خطاف مخصص للاستماع لمستند واحد في Firestore.
 */
export function useDoc(docRef: DocumentReference | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (!isSubscribed) return;
        setData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
        setLoading(false);
        setError(null);
      },
      async (err) => {
        if (!isSubscribed) return;
        
        if (err.code === 'permission-denied') {
          const permError = new FirestorePermissionError({
            path: docRef.path || 'firestore_doc_query',
            operation: 'get'
          });
          errorEmitter.emit('permission-error', permError);
        }
        
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [docRef]);

  return { data, loading, error };
}
