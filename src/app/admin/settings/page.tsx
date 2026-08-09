
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Save, Globe, Loader2, Trash2, Eye, UploadCloud } from "lucide-react";
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
      toast({ title: "تم تحديث الشعار بنجاح ✅", description: "سيظهر الشعار الجديد الآن في أعلى الموقع لجميع الزوار." });
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
        <p className="text-muted-foreground mt-1">تخصيص الهوية البصرية والمعايير العالمية للمنصة.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logo Management Section */}
        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="bg-primary text-white p-6">
            <CardTitle className="text-xl flex items-center justify-end gap-2 font-black">
               إدارة شعار الموقع الرئيسي <ImagePlus size={20} className="text-secondary" />
            </CardTitle>
            <CardDescription className="text-blue-100 text-right">ارفع شعار متجرك هنا ليظهر في شريط التنقل العلوي.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
             <div className="flex flex-col items-center justify-center gap-6">
                
                {/* Visual Preview Area */}
                <div className="w-full space-y-3">
                   <Label className="font-black text-xs text-muted-foreground block text-center uppercase">معاينة الشعار المطبق حالياً</Label>
                   <div className="relative w-full h-40 bg-zinc-50 rounded-[24px] border-4 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden">
                      {settings?.logoUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                           <Image src={settings.logoUrl} alt="Logo" width={300} height={120} className="object-contain max-h-full" />
                        </div>
                      ) : (
                        <div className="text-center text-zinc-300">
                          <Eye size={48} className="mx-auto mb-2 opacity-20" />
                          <p className="font-bold text-sm">لا يوجد شعار مخصص (يستخدم النص الافتراضي)</p>
                        </div>
                      )}
                      
                      {uploading && (
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                          <div className="flex flex-col items-center gap-2">
                             <Loader2 className="animate-spin text-primary" size={32} />
                             <span className="font-black text-xs text-primary">جاري الرفع...</span>
                          </div>
                        </div>
                      )}
                   </div>
                </div>

                {/* Explicit Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                   <div className="relative">
                      <input 
                        type="file" 
                        id="logo-upload" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                        disabled={uploading} 
                      />
                      <Label 
                        htmlFor="logo-upload" 
                        className="flex items-center justify-center gap-3 h-14 bg-secondary text-primary font-black rounded-2xl cursor-pointer hover:bg-yellow-400 transition-all shadow-lg active:scale-95"
                      >
                         <UploadCloud size={24} /> رفع صورة شعار جديدة
                      </Label>
                   </div>
                   
                   {settings?.logoUrl && (
                     <Button 
                       variant="outline" 
                       className="h-14 border-2 border-destructive text-destructive font-black rounded-2xl hover:bg-destructive hover:text-white transition-all gap-2"
                       onClick={removeLogo}
                     >
                        <Trash2 size={20} /> حذف الشعار والعودة للافتراضي
                     </Button>
                   )}
                </div>
             </div>

             <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-100">
                <h4 className="font-black text-amber-900 text-sm mb-1">💡 ملاحظة تقنية:</h4>
                <p className="text-[11px] text-amber-800 leading-relaxed font-bold">
                  يفضل رفع الشعار بصيغة **PNG بخلفية شفافة**. سيقوم النظام تلقائياً بضغط الصورة وتحسين أبعادها لتناسب الهيدر العلوي دون التأثير على سرعة الموقع.
                </p>
             </div>
          </CardContent>
        </Card>

        {/* General Settings Section */}
        <form onSubmit={handleSaveGeneral}>
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="bg-zinc-50 border-b p-6">
              <CardTitle className="text-xl flex items-center justify-end gap-2 font-black text-primary">
                الإعدادات العامة للمنصة <Globe size={20} className="text-secondary" />
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
