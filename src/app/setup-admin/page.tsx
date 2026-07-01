
"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, UserPlus, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SetupAdminPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "خطأ", description: "كلمات المرور غير متطابقة." });
      return;
    }

    setLoading(true);

    try {
      // 1. إنشاء الحساب في Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. إنشاء مستند Firestore باستخدام الـ UID الحقيقي لضمان الربط الصحيح
      const profileData = {
        uid: user.uid,
        name: "Super Administrator",
        email: formData.email,
        role: "Super Admin",
        status: "Active",
        createdAt: serverTimestamp()
      };

      await setDoc(doc(firestore, "users", user.uid), profileData);

      toast({ title: "تم التأسيس بنجاح", description: "تم إنشاء حساب المدير الرئيسي وربطه بقاعدة البيانات." });
      setSuccess(true);
      
      // التوجيه التلقائي بعد ثانيتين
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);

    } catch (error: any) {
      console.error("SETUP ERROR:", error);
      toast({ 
        variant: "destructive", 
        title: "فشل التأسيس", 
        description: error.message || "حدث خطأ أثناء إنشاء الحساب." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-[235px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-2xl text-center p-12 rounded-[40px] bg-white">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-black text-primary mb-2">اكتمل الإعداد!</h1>
            <p className="text-muted-foreground font-bold mb-8">
              تم إنشاء حساب Super Admin بنجاح. يتم الآن توجيهك إلى لوحة التحكم...
            </p>
            <Loader2 className="animate-spin mx-auto text-primary" size={32} />
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="border-none shadow-2xl overflow-hidden rounded-[32px] bg-white">
            <CardHeader className="bg-zinc-900 text-white p-8 text-center">
               <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4 border border-white/20">
                  <ShieldAlert size={32} className="text-secondary" />
               </div>
               <CardTitle className="text-3xl font-black">تأسيس المدير الرئيسي</CardTitle>
               <CardDescription className="text-zinc-400">نظام التشغيل الأول (Bootstrap)</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
               <form onSubmit={handleCreateAdmin} className="space-y-6 text-right" dir="rtl">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-6">
                    <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                      ملاحظة: هذه الصفحة تستخدم لإنشاء أول حساب إدارة في النظام لضمان الربط السليم بين نظام الدخول وقاعدة البيانات.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">البريد الإلكتروني للإدارة</Label>
                    <Input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="admin@example.com" 
                      className="h-14 border-2 rounded-xl text-right" 
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold">كلمة المرور</Label>
                      <Input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••" 
                        className="h-14 border-2 rounded-xl text-right" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">تأكيد كلمة المرور</Label>
                      <Input 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        placeholder="••••••••" 
                        className="h-14 border-2 rounded-xl text-right" 
                        required 
                      />
                    </div>
                  </div>

                  <Button className="w-full h-16 text-xl font-black gap-3 shadow-xl rounded-xl bg-primary text-white hover:bg-secondary hover:text-primary transition-all" disabled={loading}>
                     {loading ? <Loader2 className="animate-spin" size={24} /> : <UserPlus size={24} />}
                     {loading ? "جاري الإنشاء..." : "إنشاء حساب المدير الرئيسي"}
                  </Button>

                  <div className="pt-4 text-center border-t">
                    <button type="button" onClick={() => router.push("/login")} className="text-sm font-bold text-primary hover:underline flex items-center justify-center gap-2 mx-auto">
                      <ArrowRight size={16} /> العودة لصفحة الدخول
                    </button>
                  </div>
               </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
