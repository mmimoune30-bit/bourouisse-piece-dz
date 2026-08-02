
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImagePlus, Save, Globe, ShieldCheck, Loader2, X } from "lucide-react";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function AdminSettings() {
  const { firestore } = useFirestore();
  const settingsRef = firestore ? doc(firestore, "site_settings", "global") : null;
  const { data: settings, loading: loadingSettings } = useDoc(settingsRef);
  const [uploading, setUploading] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const canvasWidth = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
          const canvasHeight = img.height * (canvasWidth / img.width);
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          resolve(canvas.toDataURL('image/png', 0.9));
        };
      };
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!firestore || !e.target.files?.[0]) return;
    setUploading(true);
    try {
      const base64 = await compressImage(e.target.files[0]);
      await setDoc(settingsRef!, { logoUrl: base64 }, { merge: true });
      toast({ title: "تم التحديث", description: "تم تغيير شعار الموقع بنجاح." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل تحديث الشعار." });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;
    const formData = new FormData(e.currentTarget);
    try {
      await setDoc(settingsRef!, {
        platformName: formData.get("platformName"),
        supportEmail: formData.get("supportEmail"),
      }, { merge: true });
      toast({ title: "تم الحفظ", description: "تم تحديث الإعدادات العامة." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل الحفظ." });
    }
  };

  if (loadingSettings) return <div className="flex items-center justify-center p-20 animate-pulse font-black">جاري تحميل الإعدادات...</div>;

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-primary">إعدادات النظام والشعار</h1>
        <p className="text-muted-foreground">التحكم في المعالم البصرية والمعايير العالمية للمنصة.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6 border-none shadow-sm">
          <h3 className="font-black text-xl border-b pb-2 flex items-center justify-end gap-2">
            إعدادات الشعار <ImagePlus size={20} className="text-secondary" />
          </h3>
          <div className="space-y-4">
             <div className="relative group aspect-[3/1] bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center overflow-hidden">
                {settings?.logoUrl ? (
                  <Image src={settings.logoUrl} alt="Logo" width={300} height={100} className="object-contain max-h-[80%]" />
                ) : (
                  <span className="text-zinc-300 font-bold">لم يتم رفع شعار بعد</span>
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Label className="cursor-pointer bg-white text-black px-6 py-2 rounded-full font-black text-sm">
                     رفع شعار جديد
                     <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                   </Label>
                </div>
             </div>
             <p className="text-[10px] text-muted-foreground text-center">يفضل استخدام شعار بخلفية شفافة (PNG) وبأبعاد 400x120 بكسل.</p>
          </div>
        </Card>

        <form onSubmit={handleSaveGeneral}>
          <Card className="p-6 space-y-6 border-none shadow-sm">
            <h3 className="font-black text-xl border-b pb-2 flex items-center justify-end gap-2">
              الإعدادات العامة <Globe size={20} className="text-secondary" />
            </h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="font-bold">اسم المنصة</Label>
                <Input name="platformName" defaultValue={settings?.platformName || "Bourouisse Piece-Dz"} className="text-right h-12" />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold">بريد الدعم الفني</Label>
                <Input name="supportEmail" defaultValue={settings?.supportEmail || "support@bourouisse.com"} className="text-right h-12" />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 font-black shadow-lg">حفظ التغييرات</Button>
          </Card>
        </form>
      </div>
    </div>
  );
}
