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
 * تم تحسين معالجة الأخطاء لمنع الوصول للخصائص الداخلية التي تسبب أخطاء Assertion.
 */
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
      },
      async (err) => {
        // نستخدم وصفاً نصياً بدلاً من محاولة جلب المسار من الخصائص الداخلية غير المستقرة
        const permError = new FirestorePermissionError({
          path: 'firestore_collection_query',
          operation: 'list'
        });
        errorEmitter.emit('permission-error', permError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
