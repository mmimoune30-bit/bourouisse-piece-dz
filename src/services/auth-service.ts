'use client';

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/firebase/config";

/**
 * @fileOverview خدمة إدارة هوية المستخدمين والأدوار في المنصة.
 * تشمل: تسجيل الدخول، إنشاء الحساب، وتعيين الأدوار (Admin, Seller, Customer).
 */

export type Role = "admin" | "seller" | "customer";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: Role;
  createdAt: any;
}

/**
 * جلب بيانات دور المستخدم من Firestore
 */
export async function getUserRole(uid: string): Promise<Role | null> {
  if (!firestore) return null;
  try {
    const userDoc = await getDoc(doc(firestore, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().role as Role;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

/**
 * تسجيل الخروج من المنصة
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    localStorage.removeItem("user_role");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}
