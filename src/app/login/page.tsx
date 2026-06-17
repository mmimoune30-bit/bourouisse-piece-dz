
"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Mail, Key, LogIn, Store, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Login
    setTimeout(() => {
      setLoading(false);
      toast({ title: "تم تسجيل الدخول", description: "مرحباً بك مجدداً في بورويس." });
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="border-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-primary text-white p-8 text-center relative">
               <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
                  <ShieldCheck size={32} />
               </div>
               <CardTitle className="text-3xl font-black">تسجيل الدخول</CardTitle>
               <CardDescription className="text-blue-100">ادخل إلى حسابك لمتابعة نشاطك</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
               <Tabs defaultValue="email" onValueChange={setLoginMethod} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-8 bg-zinc-100 p-1 h-12">
                    <TabsTrigger value="email" className="font-bold">البريد الإلكتروني</TabsTrigger>
                    <TabsTrigger value="id" className="font-bold">المعرف الرقمي ID</TabsTrigger>
                  </TabsList>
                  
                  <form onSubmit={handleLogin} className="space-y-6 text-right" dir="rtl">
                    <div className="space-y-2">
                      <Label className="font-bold">{loginMethod === 'email' ? 'البريد الإلكتروني' : 'معرف الحساب (Account ID)'}</Label>
                      <div className="relative">
                        <Input 
                          placeholder={loginMethod === 'email' ? 'email@example.com' : 'BR-S-XXXX'} 
                          className="h-14 pr-12 text-lg border-2 focus:border-secondary" 
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
                         <Link href="#" className="text-xs text-secondary font-black">نسيت كلمة المرور؟</Link>
                      </div>
                      <div className="relative">
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="h-14 pr-12 text-lg border-2 focus:border-secondary" 
                          required
                        />
                        <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      </div>
                    </div>

                    <Button className="w-full h-14 text-lg font-black gap-2 shadow-xl" disabled={loading}>
                       {loading ? "جاري التحقق..." : "دخول آمن"} <LogIn size={20} />
                    </Button>

                    <div className="pt-4 text-center">
                       <p className="text-sm text-muted-foreground mb-4">ليس لديك حساب؟</p>
                       <Link href="/join">
                          <Button variant="outline" className="w-full h-12 font-bold gap-2 border-2 border-zinc-200">
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
