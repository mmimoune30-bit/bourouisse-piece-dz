'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

export function useUser() {
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // تأمين: الخروج بصمت إذا لم تكن الخدمات جاهزة
    if (!auth || !firestore || typeof window === 'undefined') {
      return;
    }

    let isMounted = true;
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (!isMounted) return;
      setUser(u);
      
      if (u) {
        try {
          unsubscribeProfile = onSnapshot(doc(firestore, "users", u.uid), (snap) => {
            if (!isMounted) return;
            setProfile(snap.exists() ? snap.data() : null);
            setLoading(false);
          }, (error) => {
            if (isMounted) setLoading(false);
          });
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
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [auth, firestore]);

  return { user, profile, loading };
}
