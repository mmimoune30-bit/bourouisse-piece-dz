'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

/**
 * خطاف مخصص لإدارة حالة المستخدم الحالية.
 * يقوم بجلب بيانات المصادقة (Auth) وبيانات الملف الشخصي (Firestore) بشكل متزامن.
 */
export function useUser() {
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // لا نغير حالة التحميل إذا لم تتوفر خدمات Firebase بعد
    if (!auth || !firestore) {
      return;
    }

    let isMounted = true;

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (!isMounted) return;
      setUser(u);
      
      if (u) {
        // الاستماع لتغييرات الملف الشخصي في Firestore
        const unsubscribeProfile = onSnapshot(doc(firestore, "users", u.uid), (snap) => {
          if (!isMounted) return;
          if (snap.exists()) {
            setProfile(snap.data());
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, (error) => {
          if (!isMounted) return;
          console.warn("Profile Listener Error:", error.message);
          setLoading(false);
        });

        return () => unsubscribeProfile();
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
