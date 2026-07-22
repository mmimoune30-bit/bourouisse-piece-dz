"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Mail, Phone, Lock, ArrowLeft, MapPin, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { WILAYAS_DATA } from "@/lib/algeria-locations";
import { useAuth, useFirestore } from "@/firebase";
import { registerUser } from "@/services/auth-service";
import { useRouter } from "next/navigation";

export default function BuyerRegister() {
  const router = useRouter();
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  
  const customerId = useMemo(() => `BR-C-${Math.floor(1000 + Math.random() * 9000)}`, []);

  const communesList = useMemo(() => {
    return selectedWilaya ? WILAYAS_DATA[selectedWilaya] || [] : [];
  }, [selectedWilaya]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) {
      toast({ variant: "destructive", title: "تنبيه", description: "يجب الموافقة على الشروط والأحكام أولاً." });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email && !phone) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى إدخال رقم الهاتف أو البريد الإلكتروني على الأقل." });
      return;
    }

    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "خطأ", description: "كلمات المرور غير متطابقة." });
      return;
    }

    if (!auth || !firestore) return;

    setLoading(true);
    try {
      await registerUser(auth, firestore, {
        name: formData.get("fullName") as string,
        email: email,
        phone: phone,
        role: "Customer",
        customerId: customerId,
        wilaya: selectedWilaya,
        commune: formData.get("commune") as string
      }, password);

      toast({ title: "تم التسجيل بنجاح", description: `معرفك الخاص هو ${customerId}. استخدمه للدخول مستقبلاً.` });
      router.push("/customer/dashboard");
    } catch (err: any) {
      toast({ variant: "destructive", title: "فشل التسجيل", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
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
                  <Input name="fullName" placeholder="أدخل اسمك بالكامل" className="h-14 text-lg border-2" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center justify-end gap-2"><Phone size={16} /> رقم الهاتف (اختياري)</Label>
                    <Input name="phone" placeholder="05/06/07..." className="h-14 text-lg border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center justify-end gap-2"><Mail size={16} /> البريد الإلكتروني (اختياري)</Label>
                    <Input name="email" type="email" placeholder="email@example.com" className="h-14 text-lg border-2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center justify-end gap-2"><MapPin size={16} /> الولاية</Label>
                    <Select required onValueChange={setSelectedWilaya}>
                      <SelectTrigger className="h-14 text-lg border-2"><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                      <SelectContent>
                        {Object.keys(WILAYAS_DATA).sort().map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">البلدية</Label>
                    <Select name="commune" required disabled={!selectedWilaya}>
                      <SelectTrigger className="h-14 text-lg border-2"><SelectValue placeholder="اختر البلدية" /></SelectTrigger>
                      <SelectContent>
                        {communesList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center justify-end gap-2"><Lock size={16} /> كلمة المرور</Label>
                    <Input name="password" type="password" placeholder="••••••••" className="h-14 text-lg border-2" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">تأكيد كلمة المرور</Label>
                    <Input name="confirmPassword" type="password" placeholder="••••••••" className="h-14 text-lg border-2" required />
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
                  {loading ? <Loader2 className="animate-spin" /> : "تأكيد التسجيل الآن"} <ArrowLeft size={24} />
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
