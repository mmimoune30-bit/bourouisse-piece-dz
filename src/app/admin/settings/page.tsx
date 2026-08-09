
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Save, Globe, Loader2, Trash2, Eye } from "lucide-react";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import SiteLogo from "@/components/site-logo";

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
    if (!firestore || !e.target.files?.[0] || !settingsRef) return;
    setUploading(true);
    try {
      const base64 = await compressImage(e.target.files[0]);
      await setDoc(settingsRef, { logoUrl: base64 }, { merge: true });
      toast({ title: "تم تحديث الشعار", description: "سيتم تطبيق الشعار الجديد فوراً لجميع المستخدمين." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل تحديث الشعار." });
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = async () => {
    if (!firestore || !settingsRef || !confirm("هل تريد العودة للشعار الافتراضي؟")) return;
    try {
      await updateDoc(settingsRef, { logoUrl: deleteField() });
      toast({ title: "تمت الاستعادة", description: "تمت العودة لاستخدام شعار النظام الافتراضي." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل حذف الشعار." });
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !settingsRef) return;
    const formData = new FormData(e.currentTarget);
    try {
      await setDoc(settingsRef, {
        platformName: formData.get("platformName"),
        supportEmail: formData.get("supportEmail"),
      }, { merge: true });
      toast({ title: "تم الحفظ", description: "تم تحديث الإعدادات العامة للمنصة." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل الحفظ." });
    }
  };

  if (loadingSettings) return <div className="flex items-center justify-center p-20 animate-pulse font-black">جاري تحميل إعدادات النظام...</div>;

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
          إعدادات النظام والشعار <Globe size={32} className="text-secondary" />
        </h1>
        <p className="text-muted-foreground mt-1">تخصيص المعالم البصرية والمعايير العالمية للمنصة.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logo Management Section */}
        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
          <CardHeader className="bg-primary text-white p-6">
            <CardTitle className="text-xl flex items-center justify-end gap-2 font-black">
               إدارة شعار المنصة <ImagePlus size={20} className="text-secondary" />
            </CardTitle>
            <CardDescription className="text-blue-100 text-right">تحكم في الشعار الرئيسي الذي يظهر في أعلى الموقع.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Dynamic Logo */}
                <div className="space-y-3">
                   <Label className="font-black text-xs text-muted-foreground block text-center uppercase">الشعار الحالي</Label>
                   <div className="relative aspect-video bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden group">
                      {settings?.logoUrl ? (
                        <Image src={settings.logoUrl} alt="Logo" width={200} height={80} className="object-contain max-h-[80%]" />
                      ) : (
                        <div className="text-center text-zinc-300">
                          <Eye size={32} className="mx-auto mb-1 opacity-20" />
                          <p className="text-[10px] font-bold">يتم استخدام الافتراضي</p>
                        </div>
                      )}
                      
                      {uploading && (
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                          <Loader2 className="animate-spin text-primary" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 px-4">
                         <Label className="cursor-pointer bg-white text-black h-10 px-4 rounded-full font-black text-xs flex items-center gap-2 hover:bg-secondary transition-all">
                           تغيير <ImagePlus size={14} />
                           <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                         </Label>
                         {settings?.logoUrl && (
                           <Button variant="destructive" size="icon" className="rounded-full h-10 w-10 shadow-lg" onClick={removeLogo}>
                              <Trash2 size={16} />
                           </Button>
                         )}
                      </div>
                   </div>
                </div>

                {/* System Default Comparison */}
                <div className="space-y-3">
                   <Label className="font-black text-xs text-muted-foreground block text-center uppercase">الشعار الافتراضي (نصي)</Label>
                   <div className="aspect-video bg-white rounded-2xl border-2 border-zinc-100 flex items-center justify-center overflow-hidden pointer-events-none opacity-50 grayscale">
                      <SiteLogo showTagline={false} className="scale-75" />
                   </div>
                </div>
             </div>

             <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <p className="text-[10px] text-amber-800 leading-relaxed font-bold text-center">
                  * يفضل استخدام شعار بخلفية شفافة (PNG) وبأبعاد عرضية (مثل 400x120 بكسل). سيقوم النظام بضغط الصورة تلقائياً لضمان سرعة التصفح.
                </p>
             </div>
          </CardContent>
        </Card>

        {/* General Settings Section */}
        <form onSubmit={handleSaveGeneral}>
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
            <CardHeader className="bg-zinc-50 border-b p-6">
              <CardTitle className="text-xl flex items-center justify-end gap-2 font-black text-primary">
                الإعدادات العامة <Globe size={20} className="text-secondary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="font-black">اسم المنصة الرسمي</Label>
                  <Input name="platformName" defaultValue={settings?.platformName || "Bourouisse Piece-Dz"} className="text-right h-12 border-2 rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label className="font-black">بريد الدعم الفني العام</Label>
                  <Input name="supportEmail" defaultValue={settings?.supportEmail || "support@bourouisse.com"} className="text-right h-12 border-2 rounded-xl" />
                </div>
                <div className="pt-4">
                   <Button type="submit" className="w-full h-14 font-black text-lg shadow-xl bg-primary text-white hover:bg-black transition-all">
                      حفظ إعدادات المنصة
                   </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
