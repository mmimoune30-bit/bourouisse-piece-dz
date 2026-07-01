
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
    if (!auth || !firestore) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      
      if (u) {
        // الاستماع لتغييرات الملف الشخصي في Firestore باستخدام الـ UID
        const unsubscribeProfile = onSnapshot(doc(firestore, "users", u.uid), (snap) => {
          if (snap.exists()) {
            setProfile(snap.data());
          } else {
            setProfile(null);
          }
          setLoading(false); // يتم إنهاء حالة التحميل فقط بعد الرد من Firestore
        }, (error) => {
          console.error("Error fetching user profile:", error);
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, firestore]);

  return { user, profile, loading };
}
