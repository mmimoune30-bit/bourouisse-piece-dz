
"use client";

import React, { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, Save, LayoutGrid, Loader2, CheckCircle, RotateCcw } from "lucide-react";
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import { useFirestore, useCollection } from "@/firebase";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CategoryImageManagement() {
  const { firestore } = useFirestore();
  const [uploading, setUploading] = useState<string | null>(null);

  // جلب الصور الحالية من Firestore
  const { data: categoryData, loading: loadingData } = useCollection(
    firestore ? collection(firestore, "category_images") : null
  );

  const imagesMap = useMemo(() => {
    const map: Record<string, string> = {};
    categoryData?.forEach(item => {
      map[item.id] = item.imageUrl;
    });
    return map;
  }, [categoryData]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
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
      };
    });
  };

  const handleUpload = async (catId: string, file: File) => {
    if (!firestore) return;
    setUploading(catId);
    try {
      const base64 = await compressImage(file);
      const docId = catId.replace(/\s+/g, '_').replace(/&/g, 'and');
      await setDoc(doc(firestore, "category_images", docId), {
        name_en: catId,
        imageUrl: base64,
        updatedAt: serverTimestamp()
      }, { merge: true });
      toast({ title: "تم التحديث", description: "تم حفظ صورة التصنيف بنجاح." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل رفع الصورة." });
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
          <LayoutGrid size={32} className="text-secondary" /> إدارة صور التصنيفات
        </h1>
        <p className="text-muted-foreground mt-1">تخصيص الصور التي تظهر فوق كل صنف في الصفحة الرئيسية.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PART_CATEGORIES.map((cat) => {
          const docId = cat.en.replace(/\s+/g, '_').replace(/&/g, 'and');
          const currentImg = imagesMap[docId];
          const isUploading = uploading === cat.en;

          return (
            <Card key={cat.en} className="border-none shadow-sm overflow-hidden group hover:ring-2 ring-secondary transition-all">
              <div className="relative aspect-square bg-zinc-100 flex items-center justify-center">
                {currentImg ? (
                  <Image src={currentImg} alt={cat.ar} fill className="object-cover" />
                ) : (
                  <div className="text-zinc-300 flex flex-col items-center gap-2">
                    <ImagePlus size={48} className="opacity-20" />
                    <span className="text-[10px] font-bold">لا توجد صورة</span>
                  </div>
                )}
                
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <Loader2 className="animate-spin text-primary" size={32} />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 text-xs">
                     <ImagePlus size={14} /> {currentImg ? "تغيير الصورة" : "رفع صورة"}
                     <input 
                       type="file" 
                       className="hidden" 
                       accept="image/*" 
                       onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file) handleUpload(cat.en, file);
                       }} 
                     />
                   </Label>
                </div>
              </div>
              <CardContent className="p-4 bg-white text-center">
                <h4 className="font-black text-primary text-lg">{cat.ar}</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{cat.en}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
