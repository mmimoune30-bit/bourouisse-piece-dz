"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Store, ShieldCheck, Zap, ArrowRight, ImagePlus, Lock, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { WILAYAS_DATA } from "@/lib/algeria-locations";
import { useAuth, useFirestore } from "@/firebase";
import { registerUser } from "@/services/auth-service";
import { useRouter } from "next/navigation";

export default function SellerRegister() {
  const router = useRouter();
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const storeId = useMemo(() => `BR-S-${Math.floor(1000 + Math.random() * 9000)}`, []);

  const communesList = useMemo(() => {
    return selectedWilaya ? WILAYAS_DATA[selectedWilaya] || [] : [];
  }, [selectedWilaya]);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: "destructive", title: "خطأ في الحجم", description: "يجب أن يكون حجم الصورة أقل من 2 ميجابايت." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
        name: formData.get("storeName") as string,
        email: email,
        phone: phone,
        role: "Seller",
        storeId: storeId,
        wilaya: selectedWilaya,
        commune: formData.get("commune") as string
      }, password);

      toast({ title: "تم إنشاء المتجر", description: `معرف متجرك هو ${storeId}. يمكنك استخدامه للدخول.` });
      router.push("/seller/dashboard");
    } catch (err: any) {
      toast({ variant: "destructive", title: "فشل التسجيل", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                 <p className="text-xs font-black text-muted-foreground uppercase mb-2">معرفك الرقمي الجديد</p>
                 <div className="text-3xl font-black text-primary tracking-widest bg-zinc-100 p-4 rounded-xl border-2 border-white shadow-inner">
                    {storeId}
                 </div>
              </div>
            </div>

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
                      <Input name="storeName" placeholder="مثلاً: بوزيد لقطع الغيار" className="h-12 border-2" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">اسم صاحب المتجر</Label>
                      <Input name="ownerName" placeholder="الاسم واللقب" className="h-12 border-2" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">رقم الهاتف (اختياري)</Label>
                      <Input name="phone" placeholder="05/06/07..." className="h-12 border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">رقم الواتساب</Label>
                      <Input name="whatsapp" placeholder="05/06/07..." className="h-12 border-2 border-green-100" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">البريد الإلكتروني (اختياري)</Label>
                      <Input name="email" type="email" placeholder="email@example.com" className="h-12 border-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">الولاية</Label>
                      <Select name="wilaya" required onValueChange={setSelectedWilaya}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                        <SelectContent>{Object.keys(WILAYAS_DATA).sort().map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">البلدية</Label>
                      <Select name="commune" required disabled={!selectedWilaya}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر البلدية" /></SelectTrigger>
                        <SelectContent>{communesList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">كلمة المرور</Label>
                      <Input name="password" type="password" placeholder="••••••••" className="h-12 border-2" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">تأكيد كلمة المرور</Label>
                      <Input name="confirmPassword" type="password" placeholder="••••••••" className="h-12 border-2" required />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="font-bold">شعار المتجر (Logo)</Label>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
                    <div onClick={handleLogoClick} className="border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-muted-foreground hover:bg-zinc-50 transition-all cursor-pointer group relative overflow-hidden min-h-[200px]">
                       {logoPreview ? (
                         <div className="relative w-full h-full flex items-center justify-center">
                           <Image src={logoPreview} alt="Store Logo Preview" width={150} height={150} className="object-contain max-h-[180px] rounded-xl" />
                           <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 rounded-full h-8 w-8 shadow-lg" onClick={removeLogo}><X size={16} /></Button>
                         </div>
                       ) : (
                         <>
                           <ImagePlus size={48} className="mb-4 group-hover:scale-110 transition-transform text-primary/40" />
                           <span className="font-bold text-primary">انقر لرفع شعار متجرك</span>
                           <span className="text-[10px] mt-2 tracking-widest opacity-50 uppercase">PNG, JPG (أقل من 2MB)</span>
                         </>
                       )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 py-2">
                    <Label htmlFor="terms-seller" className="text-sm font-bold cursor-pointer">أوافق على الشروط والأحكام وسياسة الخصوصية.</Label>
                    <Checkbox id="terms-seller" checked={agreed} onCheckedChange={(val) => setAgreed(!!val)} />
                  </div>

                  <Button type="submit" className="w-full h-16 text-xl font-black shadow-2xl rounded-2xl gap-3" disabled={loading || !agreed}>
                    {loading ? <Loader2 className="animate-spin" /> : <>تسجيل وتفعيل المتجر <ArrowRight className="rotate-180" /></>}
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
