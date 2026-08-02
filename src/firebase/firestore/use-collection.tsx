'use client';

import { useEffect, useState } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * خطاف مخصص للاستماع لمجموعات البيانات في Firestore.
 * مضاف إليه حماية لضمان عدم التنفيذ إلا في حال وجود استعلام صالح.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // حماية: إذا لم يكن هناك استعلام أو كنا على السيرفر، لا تفعل شيئاً
    if (!query) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        // التحقق من أخطاء الصلاحيات وإرسالها للمراقب المركزي
        if (err.code === 'permission-denied') {
          const permError = new FirestorePermissionError({
            path: 'firestore_collection',
            operation: 'list'
          });
          errorEmitter.emit('permission-error', permError);
        }
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
