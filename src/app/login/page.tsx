"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Mail, Key, LogIn, User, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, limit, setDoc, serverTimestamp } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    setLoading(true);
    
    try {
      let finalEmail = emailOrId.trim();

      if (loginMethod === "id") {
        const usersRef = collection(firestore, "users");
        const qStore = query(usersRef, where("storeId", "==", finalEmail), limit(1));
        const qCustomer = query(usersRef, where("customerId", "==", finalEmail), limit(1));
        
        const [storeSnap, customerSnap] = await Promise.all([
          getDocs(qStore),
          getDocs(qCustomer)
        ]);

        let foundUserDoc = null;
        if (!storeSnap.empty) foundUserDoc = storeSnap.docs[0];
        else if (!customerSnap.empty) foundUserDoc = customerSnap.docs[0];

        if (!foundUserDoc) {
          throw new Error("عذراً، المعرف الرقمي الذي أدخلته غير موجود.");
        }
        finalEmail = foundUserDoc.data().email;
      }

      const userCredential = await signInWithEmailAndPassword(auth, finalEmail, password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, "users", user.uid);
      let userDoc = await getDoc(userDocRef);
      
      // التأسيس التلقائي للمدير الرئيسي
      if (!userDoc.exists() && user.email === "mmimoune30@gmail.com") {
        const adminProfile = {
          uid: user.uid,
          name: "Super Administrator",
          email: user.email,
          role: "Super Admin",
          status: "Active",
          createdAt: serverTimestamp()
        };
        await setDoc(userDocRef, adminProfile);
        userDoc = await getDoc(userDocRef);
      }

      if (!userDoc.exists()) {
        throw new Error("لم يتم العثور على ملفك الشخصي. يرجى مراجعة الإدارة.");
      }

      const profile = userDoc.data();
      if (profile?.status === "Blocked") {
        throw new Error("هذا الحساب محظور.");
      }

      const role = profile?.role;
      const adminRoles = ["Super Admin", "Manager", "Financial Officer", "Customer Service"];
      
      toast({ title: "تم الدخول بنجاح", description: `مرحباً ${profile.name || ''}.` });

      if (adminRoles.includes(role)) {
        router.push("/admin/dashboard");
      } else if (role === "Seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/customer/dashboard");
      }

    } catch (error: any) {
      console.error("LOGIN ERROR", error);
      let errorMessage = error.message;
      if (error.code === "auth/invalid-credential") {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      }
      toast({ variant: "destructive", title: "خطأ في الدخول", description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="border-none shadow-2xl overflow-hidden rounded-[32px] bg-white">
            <CardHeader className="bg-primary text-white p-8 text-center">
               <ShieldCheck className="mx-auto w-16 h-16 bg-white/20 rounded-2xl p-3 mb-4" />
               <CardTitle className="text-3xl font-black">بوابة الدخول</CardTitle>
               <CardDescription className="text-blue-100">سجل دخولك لإدارة حسابك</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
               <Tabs defaultValue="email" onValueChange={setLoginMethod} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-8 bg-zinc-100 p-1 h-12 rounded-xl">
                    <TabsTrigger value="email" className="font-bold">البريد</TabsTrigger>
                    <TabsTrigger value="id" className="font-bold">المعرف</TabsTrigger>
                  </TabsList>
                  
                  <form onSubmit={handleLogin} className="space-y-6 text-right" dir="rtl">
                    <div className="space-y-2">
                      <Label className="font-bold">{loginMethod === 'email' ? 'البريد الإلكتروني' : 'معرف الحساب (BR-ID)'}</Label>
                      <Input 
                        value={emailOrId}
                        onChange={(e) => setEmailOrId(e.target.value)}
                        placeholder={loginMethod === 'email' ? 'email@example.com' : 'مثلاً: BR-S-1001'} 
                        className="h-14 border-2 rounded-xl text-right" 
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold">كلمة المرور</Label>
                      <Input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="h-14 border-2 rounded-xl text-right" 
                        required
                      />
                    </div>

                    <Button className="w-full h-14 text-lg font-black gap-2 shadow-xl rounded-xl bg-primary" disabled={loading}>
                       {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
                       {loading ? "جاري التحقق..." : "دخول آمن"}
                    </Button>

                    <div className="pt-4 text-center">
                       <Link href="/join">
                          <Button variant="outline" className="w-full h-12 font-bold gap-2 border-2 rounded-xl">
                             إنشاء حساب جديد <ArrowLeft size={18} />
                          </Button>
                       </Link>
                    </div>
                  </form>
               </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
