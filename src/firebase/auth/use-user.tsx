'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

/**
 * خطاف مخصص لإدارة حالة المستخدم مع حماية ضد أخطاء التهيئة والـ HMR.
 */
export function useUser() {
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التأكد من جاهزية الخدمات قبل بدء أي عملية
    if (!auth || !firestore) {
      return;
    }

    let isMounted = true;
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (!isMounted) return;
      setUser(u);
      
      if (u) {
        // الاستماع لتغييرات الملف الشخصي بوعي تام بـ Firestore Engine
        try {
          unsubscribeProfile = onSnapshot(doc(firestore, "users", u.uid), (snap) => {
            if (!isMounted) return;
            setProfile(snap.exists() ? snap.data() : null);
            setLoading(false);
          }, (error) => {
            if (!isMounted) return;
            console.warn("User Profile Sync Error:", error.message);
            setLoading(false);
          });
        } catch (e) {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [auth, firestore]);

  return { user, profile, loading };
}
