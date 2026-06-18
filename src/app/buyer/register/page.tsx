
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Mail, Phone, Lock, ArrowLeft, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", "09 - Blida", "16 - Alger", "31 - Oran"
];

export default function BuyerRegister() {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const customerId = `BR-C-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({ variant: "destructive", title: "تنبيه", description: "يجب الموافقة على الشروط والأحكام أولاً." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "تم التسجيل بنجاح", description: `معرفك الخاص هو ${customerId}. استخدمه للدخول مستقبلاً.` });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-none shadow-2xl overflow-hidden rounded-[40px] bg-white">
            <CardHeader className="text-center space-y-2 bg-primary text-white py-10">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-[20px] flex items-center justify-center backdrop-blur-md mb-2">
                <UserPlus size={32} />
              </div>
              <CardTitle className="text-3xl font-black">حساب مشتري جديد</CardTitle>
              <CardDescription className="text-blue-100">انضم إلينا كعميل للوصول لكافة البائعين وحفظ مفضلاتك</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-6 text-right" dir="rtl">
              <div className="bg-zinc-50 p-4 rounded-2xl border-2 border-primary/10 flex items-center justify-between">
                 <span className="text-xs font-black text-muted-foreground">رقم العميل التلقائي:</span>
                 <span className="text-lg font-black text-primary font-mono">{customerId}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold flex items-center justify-end gap-2"><User size={16} /> الاسم الكامل</Label>
                  <Input placeholder="أدخل اسمك بالكامل" className="h-14 text-lg border-2" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center justify-end gap-2"><Phone size={16} /> رقم الهاتف</Label>
                    <Input placeholder="05/06/07..." className="h-14 text-lg border-2" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center justify-end gap-2"><Mail size={16} /> البريد الإلكتروني</Label>
                    <Input type="email" placeholder="email@example.com" className="h-14 text-lg border-2" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center justify-end gap-2"><MapPin size={16} /> الولاية</Label>
                    <Select required>
                      <SelectTrigger className="h-14 text-lg border-2"><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                      <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">البلدية</Label>
                    <Input placeholder="اسم البلدية" className="h-14 text-lg border-2" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center justify-end gap-2"><Lock size={16} /> كلمة المرور</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 text-lg border-2" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">تأكيد كلمة المرور</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 text-lg border-2" required />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 py-2">
                  <Label htmlFor="terms" className="text-sm font-bold cursor-pointer">
                    لقد قرأت <Link href="/privacy-policy" className="text-secondary underline">سياسة الخصوصية</Link> و <Link href="/terms-of-service" className="text-secondary underline">شروط الخدمة</Link> وأوافق عليهما.
                  </Label>
                  <Checkbox 
                    id="terms" 
                    checked={agreed} 
                    onCheckedChange={(val) => setAgreed(!!val)} 
                  />
                </div>

                <Button 
                  className="w-full h-16 text-xl font-black gap-3 shadow-xl rounded-2xl" 
                  disabled={loading || !agreed}
                >
                  {loading ? "جاري إنشاء الحساب..." : "تأكيد التسجيل الآن"} <ArrowLeft size={24} />
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  لديك حساب؟ <Link href="/login" className="text-secondary font-black underline">دخول</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
