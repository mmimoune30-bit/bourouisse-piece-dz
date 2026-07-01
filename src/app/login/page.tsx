
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
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from "firebase/firestore";

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

      // إذا كان تسجيل الدخول بالمعرف الرقمي، نبحث عن الإيميل المرتبط به
      if (loginMethod === "id") {
        const usersRef = collection(firestore, "users");
        
        // البحث عن المعرف في حقل storeId أو customerId
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
          throw new Error("عذراً، المعرف الرقمي الذي أدخلته غير موجود في النظام.");
        }

        finalEmail = foundUserDoc.data().email;
      }

      // تسجيل الدخول عبر Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, finalEmail, password);
      const user = userCredential.user;

      // جلب ملف المستخدم للتوجيه
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let profile;

      if (!userDoc.exists()) {
        // حالة استثنائية للإصلاح الذاتي للمسؤول
        const isAdmin = finalEmail === "mmimoune30@gmail.com"; 
        profile = {
          uid: user.uid,
          name: user.displayName || finalEmail.split('@')[0],
          email: finalEmail,
          role: isAdmin ? "Super Admin" : "Customer",
          status: "Active",
          createdAt: serverTimestamp()
        };
        await setDoc(userDocRef, profile);
      } else {
        profile = userDoc.data();
      }

      // التوجيه بناءً على الدور
      const role = profile.role;
      const adminRoles = ["Super Admin", "Manager", "Financial Officer", "Customer Service"];
      
      if (adminRoles.includes(role)) {
        toast({ title: "تم الدخول كمسؤول", description: `مرحباً بك مجدداً، ${profile.name}.` });
        router.push("/admin/dashboard");
      } else if (role === "Seller") {
        toast({ title: "تم الدخول للمتجر", description: `مرحباً بك في لوحة تحكم متجرك.` });
        router.push("/seller/dashboard");
      } else {
        toast({ title: "تم الدخول بنجاح", description: `مرحباً بك في بورويس بـيـس.` });
        router.push("/customer/dashboard");
      }

    } catch (error: any) {
      console.error("FULL LOGIN ERROR", error);
      alert(JSON.stringify({
        code: error.code,
        message: error.message
      }, null, 2));

      let errorMessage = "فشل تسجيل الدخول. يرجى التأكد من البيانات.";
      
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({ 
        variant: "destructive", 
        title: "خطأ في الدخول", 
        description: errorMessage 
      });
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
               <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
                  <ShieldCheck size={32} />
               </div>
               <CardTitle className="text-3xl font-black">تسجيل الدخول</CardTitle>
               <CardDescription className="text-blue-100">ادخل إلى حسابك لمتابعة نشاطك</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
               <Tabs defaultValue="email" onValueChange={setLoginMethod} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-8 bg-zinc-100 p-1 h-12 rounded-xl">
                    <TabsTrigger value="email" className="font-bold rounded-lg">البريد الإلكتروني</TabsTrigger>
                    <TabsTrigger value="id" className="font-bold rounded-lg">المعرف الرقمي ID</TabsTrigger>
                  </TabsList>
                  
                  <form onSubmit={handleLogin} className="space-y-6 text-right" dir="rtl">
                    <div className="space-y-2">
                      <Label className="font-bold">{loginMethod === 'email' ? 'البريد الإلكتروني' : 'معرف الحساب (Account ID)'}</Label>
                      <div className="relative">
                        <Input 
                          type="text"
                          value={emailOrId}
                          onChange={(e) => setEmailOrId(e.target.value)}
                          placeholder={loginMethod === 'email' ? 'email@example.com' : 'مثلاً: BR-S-1234'} 
                          className="h-14 pr-12 text-lg border-2 focus:border-secondary rounded-xl text-right" 
                          required
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {loginMethod === 'email' ? <Mail size={20} /> : <User size={20} />}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center flex-row-reverse">
                         <Label className="font-bold">كلمة المرور</Label>
                         <Link href="#" className="text-xs text-secondary font-black hover:underline">نسيت كلمة المرور؟</Link>
                      </div>
                      <div className="relative">
                        <Input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="h-14 pr-12 text-lg border-2 focus:border-secondary rounded-xl text-right" 
                          required
                        />
                        <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      </div>
                    </div>

                    <Button className="w-full h-14 text-lg font-black gap-2 shadow-xl rounded-xl bg-primary text-white hover:bg-secondary hover:text-primary transition-all" disabled={loading}>
                       {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                       {loading ? "جاري التحقق..." : "دخول آمن"}
                    </Button>

                    <div className="pt-4 text-center">
                       <p className="text-sm text-muted-foreground mb-4">ليس لديك حساب؟</p>
                       <Link href="/join">
                          <Button variant="outline" className="w-full h-12 font-bold gap-2 border-2 border-zinc-200 rounded-xl">
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
