
'use client';

import { 
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, Firestore } from "firebase/firestore";
import { Auth } from "firebase/auth";

/**
 * @fileOverview خدمة إدارة هوية المستخدمين والأدوار.
 * تضمن هذه الخدمة مزامنة بيانات Firebase Auth مع Firestore باستخدام الـ UID كمعرف ثابت.
 */

export type UserRole = "Super Admin" | "Manager" | "Financial Officer" | "Customer Service" | "Seller" | "Customer";

export interface CreateUserOptions {
  name: string;
  email: string;
  role: UserRole;
  storeId?: string;
  customerId?: string;
}

/**
 * إنشاء حساب مستخدم جديد مع وثيقة Firestore مقابلة له (UID Mapping)
 */
export async function registerUser(auth: Auth, db: Firestore, options: CreateUserOptions, password: string) {
  // 1. إنشاء المستخدم في Firebase Authentication
  const { user } = await createUserWithEmailAndPassword(auth, options.email, password);
  
  // 2. تحضير بيانات الملف الشخصي
  const profile = {
    uid: user.uid,
    name: options.name,
    email: options.email,
    role: options.role,
    status: "Active",
    storeId: options.storeId || null,
    customerId: options.customerId || null,
    createdAt: serverTimestamp()
  };

  // 3. القاعدة الذهبية: استخدام الـ UID كاسم للمستند في Firestore
  await setDoc(doc(db, "users", user.uid), profile);
  
  return user;
}

/**
 * تسجيل الخروج
 */
export async function logoutUser(auth: Auth) {
  await signOut(auth);
}
