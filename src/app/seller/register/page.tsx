
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Store, ShieldCheck, Zap, ArrowRight, ImagePlus, MapPin, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", "09 - Blida", "16 - Alger", "31 - Oran"
];

export default function SellerRegister() {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const storeId = `BR-S-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({ variant: "destructive", title: "تنبيه", description: "يجب الموافقة على الشروط والأحكام أولاً." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "تم إنشاء الحساب", description: `معرف متجرك هو ${storeId}. يرجى تذكر هذا المعرف.` });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Side */}
            <div className="lg:col-span-1 space-y-6 text-right order-2 lg:order-1" dir="rtl">
              <h1 className="text-4xl font-black text-primary leading-tight">
                حول عملك إلى <span className="text-secondary">احترافي</span>
              </h1>
              <p className="text-muted-foreground font-bold">
                افتح متجرك الآن واحصل على معرف رقمي فوري يسهل عليك تسجيل الدخول وإدارة مبيعاتك.
              </p>
              
              <div className="p-6 bg-primary rounded-3xl text-white shadow-xl">
                 <h3 className="text-lg font-black mb-4 flex items-center justify-end gap-2 text-secondary">
                   <ShieldCheck /> مميزات متجر بورويس
                 </h3>
                 <ul className="space-y-4 text-sm font-bold">
                   <li className="flex items-center justify-end gap-2">تأكيد فوري للقطع <Zap size={14} className="text-secondary" /></li>
                   <li className="flex items-center justify-end gap-2">إحصائيات حية لمبيعاتك <Zap size={14} className="text-secondary" /></li>
                   <li className="flex items-center justify-end gap-2">دعم فني خاص بالبائعين <Zap size={14} className="text-secondary" /></li>
                 </ul>
              </div>

              <div className="p-6 border-2 border-dashed border-primary/20 rounded-3xl text-center">
                 <p className="text-xs font-black text-muted-foreground uppercase mb-2">سيتم توليد المعرف تلقائياً</p>
                 <div className="text-3xl font-black text-primary tracking-widest bg-zinc-100 p-4 rounded-xl border-2 border-white shadow-inner">
                    {storeId}
                 </div>
              </div>
            </div>

            {/* Form Side */}
            <Card className="lg:col-span-2 border-none shadow-2xl order-1 lg:order-2 bg-white">
              <CardHeader className="bg-destructive text-white p-8 text-right rounded-t-lg">
                <CardTitle className="text-3xl font-black flex items-center justify-end gap-3">
                  فتح متجر جديد <Store size={32} />
                </CardTitle>
                <CardDescription className="text-blue-100">يرجى ملء كافة البيانات بدقة لتوثيق المتجر</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">اسم المتجر</Label>
                      <Input placeholder="مثلاً: بوزيد لقطع الغيار" className="h-12 border-2" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">اسم صاحب المتجر</Label>
                      <Input placeholder="الاسم واللقب" className="h-12 border-2" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">رقم الهاتف</Label>
                      <Input placeholder="05/06/07..." className="h-12 border-2" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">رقم الواتساب</Label>
                      <Input placeholder="05/06/07..." className="h-12 border-2 border-green-100" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">البريد الإلكتروني</Label>
                      <Input type="email" placeholder="email@example.com" className="h-12 border-2" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">الولاية</Label>
                      <Select required>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                        <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">البلدية والعنوان</Label>
                      <Input placeholder="العنوان بالتفصيل" className="h-12 border-2" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">كلمة المرور</Label>
                      <Input type="password" placeholder="••••••••" className="h-12 border-2" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">تأكيد كلمة المرور</Label>
                      <Input type="password" placeholder="••••••••" className="h-12 border-2" required />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="font-bold">شعار المتجر (Logo)</Label>
                    <div className="border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-muted-foreground hover:bg-zinc-50 transition-all cursor-pointer group">
                       <ImagePlus size={48} className="mb-4 group-hover:scale-110 transition-transform" />
                       <span className="font-bold">اسحب أو انقر لرفع شعار متجرك</span>
                       <span className="text-[10px] mt-2 tracking-widest opacity-50 uppercase">PNG, JPG, SVG</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 py-2">
                    <Label htmlFor="terms-seller" className="text-sm font-bold cursor-pointer">
                      لقد قرأت <Link href="/privacy-policy" className="text-secondary underline">سياسة الخصوصية</Link> و <Link href="/terms-of-service" className="text-secondary underline">شروط الخدمة</Link> وأوافق عليهما.
                    </Label>
                    <Checkbox 
                      id="terms-seller" 
                      checked={agreed} 
                      onCheckedChange={(val) => setAgreed(!!val)} 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-16 text-xl font-black shadow-2xl rounded-2xl gap-3" 
                    disabled={loading || !agreed}
                  >
                    {loading ? "جاري إنشاء المتجر..." : "تسجيل وتفعيل المتجر"} <ArrowRight className="rotate-180" size={24} />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
