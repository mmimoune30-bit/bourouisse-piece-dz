'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

/**
 * خطاف إدارة هوية المستخدم وملفه الشخصي لمرة واحدة.
 */
export function useUser() {
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !firestore || typeof window === 'undefined') {
      return;
    }

    let isMounted = true;

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      if (!isMounted) return;
      setUser(u);
      
      if (u) {
        try {
          // جلب الملف الشخصي لمرة واحدة بدلاً من onSnapshot
          const userDoc = await getDoc(doc(firestore, "users", u.uid));
          if (!isMounted) return;
          setProfile(userDoc.exists() ? userDoc.data() : null);
          setLoading(false);
        } catch (e) {
          if (isMounted) setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeAuth();
    };
  }, [auth, firestore]);

  return { user, profile, loading };
}
