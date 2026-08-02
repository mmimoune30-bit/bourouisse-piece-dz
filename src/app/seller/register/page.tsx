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
import { useState, useRef, useMemo, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { WILAYAS_DATA } from "@/lib/algeria-locations";
import { useAuth, useFirestore } from "@/firebase";
import { registerUser } from "@/services/auth-service";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SellerRegister() {
  const router = useRouter();
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [storeId, setStoreId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // CRITICAL: Defer ID generation and client checks to useEffect to prevent Hydration Mismatch
  useEffect(() => {
    setStoreId(`BR-S-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

  const communesList = useMemo(() => {
    return selectedWilaya ? WILAYAS_DATA[selectedWilaya] || [] : [];
  }, [selectedWilaya]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ variant: "destructive", title: "خطأ في الحجم", description: "يجب أن يكون حجم الصورة أقل من 10 ميجابايت." });
        return;
      }
      setLoading(true);
      try {
        const compressed = await compressImage(file);
        setLogoPreview(compressed);
      } catch (err) {
        toast({ variant: "destructive", title: "خطأ", description: "فشل معالجة الشعار." });
      } finally {
        setLoading(false);
      }
    }
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
      <main className="flex-grow pt-32 pb-6">
        <div className="container mx-auto px-4 max-w-5xl text-right" dir="rtl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h1 className="text-3xl md:text-4xl text-primary font-black leading-tight uppercase">
                حول عملك إلى <span className="text-secondary">احترافي</span>
              </h1>
              <p className="text-muted-foreground font-bold">افتح متجرك الآن واحصل على معرف رقمي فوري يسهل عليك إدارة مبيعاتك.</p>
              
              <div className="p-5 bg-primary rounded-2xl text-white shadow-xl">
                 <h3 className="text-lg mb-3 flex items-center gap-2 text-secondary justify-end font-black">
                   <ShieldCheck /> مميزات متجر بورويس
                 </h3>
                 <ul className="space-y-3 text-sm font-bold">
                   <li className="flex items-center justify-end gap-2">تأكيد فوري للقطع <Zap size={14} className="text-secondary" /></li>
                   <li className="flex items-center justify-end gap-2">إحصائيات حية لمبيعاتك <Zap size={14} className="text-secondary" /></li>
                   <li className="flex items-center justify-end gap-2">دعم فني خاص بالبائعين <Zap size={14} className="text-secondary" /></li>
                 </ul>
              </div>

              <div className="p-4 border-2 border-dashed border-primary/20 rounded-2xl text-center">
                 <p className="text-[10px] text-muted-foreground uppercase mb-1 font-black">معرفك الرقمي الجديد</p>
                 <div className="text-2xl font-black text-primary tracking-widest bg-zinc-100 p-3 rounded-lg border-2 border-white font-mono">
                    {storeId || '...'}
                 </div>
              </div>
            </div>

            <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary text-white p-6 text-right">
                <CardTitle className="text-2xl flex items-center justify-end gap-3 font-black">
                  فتح متجر جديد <Store size={28} />
                </CardTitle>
                <CardDescription className="text-blue-100 font-bold">يرجى ملء كافة البيانات بدقة لتوثيق المتجر</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-bold">اسم المتجر</Label>
                      <Input name="storeName" placeholder="مثلاً: بوزيد لقطع الغيار" className="h-11 border-2 rounded-xl" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">اسم صاحب المتجر</Label>
                      <Input name="ownerName" placeholder="الاسم واللقب" className="h-11 border-2 rounded-xl" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-bold">رقم الهاتف</Label>
                      <Input name="phone" placeholder="05/06/07..." className="h-11 border-2 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">WhatsApp</Label>
                      <Input name="whatsapp" placeholder="05/06/07..." className="h-11 border-2 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">البريد الإلكتروني</Label>
                      <Input name="email" type="email" placeholder="email@example.com" className="h-11 border-2 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-bold">الولاية</Label>
                      <Select name="wilaya" required onValueChange={setSelectedWilaya}>
                        <SelectTrigger className="h-11 border-2 rounded-xl"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>{Object.keys(WILAYAS_DATA).sort().map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">البلدية</Label>
                      <Select name="commune" required disabled={!selectedWilaya}>
                        <SelectTrigger className="h-11 border-2 rounded-xl"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>{communesList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-bold">كلمة المرور</Label>
                      <Input name="password" type="password" placeholder="••••••••" className="h-11 border-2 rounded-xl" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">تأكيد كلمة المرور</Label>
                      <Input name="confirmPassword" type="password" placeholder="••••••••" className="h-11 border-2 rounded-xl" required />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-bold">شعار المتجر (Logo)</Label>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
                    <div onClick={() => !loading && fileInputRef.current?.click()} className={cn(
                      "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-zinc-50 transition-all cursor-pointer group relative overflow-hidden min-h-[160px]",
                      loading && "opacity-50 cursor-not-allowed"
                    )}>
                       {loading ? <Loader2 className="animate-spin text-primary" size={32} /> : logoPreview ? (
                         <div className="relative w-full h-full flex items-center justify-center">
                           <Image src={logoPreview} alt="Preview" width={120} height={120} className="object-contain max-h-[140px] rounded-lg" />
                           <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 rounded-full h-7 w-7 shadow-lg" onClick={(e) => { e.stopPropagation(); setLogoPreview(null); }}><X size={14} /></Button>
                         </div>
                       ) : (
                         <>
                           <ImagePlus size={32} className="mb-2 group-hover:scale-110 transition-transform text-primary/40" />
                           <span className="text-primary font-bold">انقر لرفع شعار متجرك</span>
                         </>
                       )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-1 justify-end">
                    <Label htmlFor="terms-seller" className="text-xs cursor-pointer font-bold">أوافق على الشروط والأحكام وسياسة الخصوصية.</Label>
                    <Checkbox id="terms-seller" checked={agreed} onCheckedChange={(val) => setAgreed(!!val)} />
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg shadow-xl rounded-2xl gap-3 bg-primary text-white font-black" disabled={loading || !agreed}>
                    {loading ? <Loader2 className="animate-spin" /> : "تسجيل وتفعيل المتجر"}
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
