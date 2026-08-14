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
import { getDirection, getStoredLanguage, sellerRegisterDictionary, type AppLanguage } from "@/lib/i18n";

export default function SellerRegister() {
  const router = useRouter();
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [storeId, setStoreId] = useState("");
  const [lang, setLang] = useState<AppLanguage>("AR");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = sellerRegisterDictionary[lang];
  const dir = getDirection(lang);

  useEffect(() => {
    const syncLanguage = () => setLang(getStoredLanguage());
    syncLanguage();
    window.addEventListener("languageChange", syncLanguage);
    return () => window.removeEventListener("languageChange", syncLanguage);
  }, []);

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
        toast({ variant: "destructive", title: t.toast.fileSizeErrorTitle, description: t.toast.fileSizeErrorDescription });
        return;
      }
      setLoading(true);
      try {
        const compressed = await compressImage(file);
        setLogoPreview(compressed);
      } catch (err) {
        toast({ variant: "destructive", title: t.toast.fileProcessErrorTitle, description: t.toast.fileProcessErrorDescription });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) {
      toast({ variant: "destructive", title: t.toast.termsTitle, description: t.toast.termsDescription });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email && !phone) {
      toast({ variant: "destructive", title: t.toast.formMissingTitle, description: t.toast.formMissingDescription });
      return;
    }

    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: t.toast.passwordMismatchTitle, description: t.toast.passwordMismatchDescription });
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

      toast({ title: t.toast.successTitle, description: `${t.toast.successDescription} ${storeId}.` });
      router.push("/seller/dashboard");
    } catch (err: any) {
      toast({ variant: "destructive", title: t.toast.failureTitle, description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={dir}>
      <Navbar />
      <main className="flex-grow pt-4 pb-6">
        <div className={cn("container mx-auto px-4 max-w-5xl", lang === "AR" ? "text-right" : "text-left")} dir={dir}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h1 className="text-3xl md:text-4xl text-primary font-black leading-tight uppercase">
                {t.headingStart} <span className="text-secondary">{t.headingAccent}</span>
              </h1>
              <p className="text-muted-foreground font-bold">{t.subtitle}</p>

              <div className="p-5 bg-primary rounded-2xl text-white shadow-xl">
                 <h3 className={cn("text-lg mb-3 flex items-center gap-2 text-secondary font-black", lang === "AR" ? "justify-end" : "justify-start")}>
                   <ShieldCheck /> {t.featureTitle}
                 </h3>
                 <ul className={cn("space-y-3 text-sm font-bold", lang === "AR" ? "text-right" : "text-left")}>
                   {t.featureItems.map((text, index) => (
                     <li key={text} className={cn("flex items-center gap-2", lang === "AR" ? "justify-end" : "justify-start")}>
                       <Zap size={14} className="text-secondary" />
                       <span>{text}</span>
                     </li>
                   ))}
                 </ul>
              </div>

              <div className="p-4 border-2 border-dashed border-primary/20 rounded-2xl text-center">
                 <p className="text-[10px] text-muted-foreground uppercase mb-1 font-black">{t.storeId}</p>
                 <div className="text-2xl font-black text-primary tracking-widest bg-zinc-100 p-3 rounded-lg border-2 border-white font-mono">
                    {storeId || '...'}
                 </div>
              </div>
            </div>

            <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
              <CardHeader className={cn("bg-primary text-white p-6", lang === "AR" ? "text-right" : "text-left")}>
                <CardTitle className={cn("text-2xl flex items-center gap-3 font-black", lang === "AR" ? "justify-end" : "justify-start")}>
                  {t.cardHeader} <Store size={28} />
                </CardTitle>
                <CardDescription className="text-blue-100 font-bold">{t.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4" dir={dir}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-bold">{t.storeName}</Label>
                      <Input name="storeName" placeholder={t.placeholders.storeName} className="h-11 border-2 rounded-xl" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">{t.ownerName}</Label>
                      <Input name="ownerName" placeholder={t.placeholders.ownerName} className="h-11 border-2 rounded-xl" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-bold">{t.phone}</Label>
                      <Input name="phone" placeholder={t.placeholders.phone} className="h-11 border-2 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">{t.whatsapp}</Label>
                      <Input name="whatsapp" placeholder={t.placeholders.whatsapp} className="h-11 border-2 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">{t.email}</Label>
                      <Input name="email" type="email" placeholder={t.placeholders.email} className="h-11 border-2 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-bold">{t.wilaya}</Label>
                      <Select name="wilaya" required onValueChange={setSelectedWilaya}>
                        <SelectTrigger className="h-11 border-2 rounded-xl"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>{Object.keys(WILAYAS_DATA).sort().map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">{t.commune}</Label>
                      <Select name="commune" required disabled={!selectedWilaya}>
                        <SelectTrigger className="h-11 border-2 rounded-xl"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>{communesList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-bold">{t.password}</Label>
                      <Input name="password" type="password" placeholder={t.placeholders.password} className="h-11 border-2 rounded-xl" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">{t.confirmPassword}</Label>
                      <Input name="confirmPassword" type="password" placeholder={t.placeholders.password} className="h-11 border-2 rounded-xl" required />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-bold">{t.logoLabel}</Label>
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
                           <span className="text-primary font-bold">{t.logoPlaceholder}</span>
                         </>
                       )}
                    </div>
                  </div>

                  <div className={cn("flex items-center gap-2 py-1", lang === "AR" ? "justify-end" : "justify-start")}>
                    <Label htmlFor="terms-seller" className="text-xs cursor-pointer font-bold">{t.legalText}</Label>
                    <Checkbox id="terms-seller" checked={agreed} onCheckedChange={(val) => setAgreed(!!val)} />
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg shadow-xl rounded-2xl gap-3 bg-primary text-white font-black" disabled={loading || !agreed}>
                    {loading ? <Loader2 className="animate-spin" /> : t.registerButton}
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
