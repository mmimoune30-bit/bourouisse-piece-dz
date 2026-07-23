
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VEHICLE_TYPES, BRAND_MODELS, YEARS, PART_CATEGORIES } from "@/lib/vehicle-data";
import { Send, ImagePlus, Car, Settings, Tags, AlertCircle, X, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import Image from "next/image";

export default function NewListing() {
  const router = useRouter();
  const { firestore } = useFirestore();
  const { user, profile } = useUser();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [vehicleType, setVehicleType] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [condition, setCondition] = useState<string>("used");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang")?.toLowerCase() as "ar" | "en";
    if (savedLang) setLang(savedLang);
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const availableBrands = useMemo(() => {
    if (!vehicleType || vehicleType === "Any") {
      const allBrands = new Set<string>();
      VEHICLE_TYPES.forEach(t => t.brands.forEach(b => allBrands.add(b)));
      return Array.from(allBrands).sort();
    }
    const typeObj = VEHICLE_TYPES.find(t => t.id === vehicleType);
    return typeObj ? typeObj.brands : [];
  }, [vehicleType]);

  const availableModels = useMemo(() => {
    return brand && brand !== "Any" ? BRAND_MODELS[brand] || [] : [];
  }, [brand]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setLoading(true);
      try {
        const processedImages: string[] = [];
        for (const file of Array.from(files)) {
          if (file.size > 10 * 1024 * 1024) {
            toast({ variant: "destructive", title: "حجم كبير جداً", description: `الصورة ${file.name} تتجاوز 10 ميجابايت.` });
            continue;
          }
          const compressed = await compressImage(file);
          processedImages.push(compressed);
        }
        setImages(prev => [...prev, ...processedImages]);
      } catch (err) {
        toast({ variant: "destructive", title: "خطأ", description: "فشل معالجة بعض الصور." });
      } finally {
        setLoading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePostListing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !user) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const listingData = {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      category,
      vehicleType,
      brand,
      model,
      year,
      condition,
      description: formData.get("description") as string,
      images,
      sellerId: user.uid,
      sellerName: profile?.name || "Unknown Store",
      status: "Active",
      createdAt: serverTimestamp()
    };

    addDoc(collection(firestore, "listings"), listingData)
      .then(() => {
        setLoading(false);
        toast({ title: "تم النشر بنجاح!", description: "إعلانك الآن متاح للمشترين في الكتالوج." });
        router.push("/seller/listings");
      })
      .catch(async (error) => {
        setLoading(false);
        const permissionError = new FirestorePermissionError({
          path: "listings",
          operation: "create",
          requestResourceData: listingData
        });
        errorEmitter.emit("permission-error", permissionError);
      });
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <form onSubmit={handlePostListing} className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-right" dir="rtl">
            <h1 className="text-4xl font-black text-primary mb-2">إضافة قطعة غيار جديدة</h1>
            <p className="text-muted-foreground font-bold">يرجى إدخال أكبر قدر ممكن من المعلومات لضمان جودة الإعلان.</p>
          </div>

          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
            <CardHeader className="bg-primary text-white p-6">
              <CardTitle className="text-xl flex items-center justify-end gap-3">
                1. مواصفات المركبة <Car className="text-secondary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8 text-right" dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="font-black text-sm">نوع المركبة</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType} required>
                    <SelectTrigger className="h-14 border-2"><SelectValue placeholder="اختر نوع المركبة" /></SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.label[lang]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-black text-sm">ماركة المركبة</Label>
                  <Select value={brand} onValueChange={setBrand} required>
                    <SelectTrigger className="h-14 border-2"><SelectValue placeholder="اختر الماركة" /></SelectTrigger>
                    <SelectContent>
                      {availableBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-black text-sm">الموديل</Label>
                  <Select value={model} onValueChange={setModel} required>
                    <SelectTrigger className="h-14 border-2"><SelectValue placeholder="اختر الموديل" /></SelectTrigger>
                    <SelectContent>
                      {availableModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-black text-sm">سنة الصنع</Label>
                  <Select value={year} onValueChange={setYear} required>
                    <SelectTrigger className="h-14 border-2"><SelectValue placeholder="اختر السنة" /></SelectTrigger>
                    <SelectContent>
                      {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
            <CardHeader className="bg-secondary text-primary p-6">
              <CardTitle className="text-xl flex items-center justify-end gap-3">
                2. معلومات القطعة <Settings />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8 text-right" dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="font-black">تصنيف القطعة</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="h-14 border-2"><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                    <SelectContent>
                      {PART_CATEGORIES.map(c => <SelectItem key={c.en} value={c.en}>{c[lang]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-black">اسم القطعة</Label>
                  <Input name="name" placeholder="مثلاً: محرك كامل، مصباح خلفي..." className="h-14 border-2" required />
                </div>
                <div className="space-y-2">
                  <Label className="font-black">السعر (دج)</Label>
                  <Input name="price" type="number" placeholder="0.00" className="h-14 border-2" required />
                </div>
                <div className="space-y-2">
                  <Label className="font-black">الحالة</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger className="h-14 border-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">جديد (New)</SelectItem>
                      <SelectItem value="used">مستعمل (Used)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-black">وصف إضافي</Label>
                <Textarea name="description" placeholder="اكتب تفاصيل إضافية عن حالة القطعة، الضمان، أو الشحن..." className="min-h-[120px] border-2" />
              </div>

              <div className="space-y-4">
                <Label className="font-black">الصور (يمكنك إضافة عدة صور، بحد أقصى 10MB للصورة)</Label>
                <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-zinc-100 group">
                      <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div 
                    onClick={() => !loading && fileInputRef.current?.click()}
                    className={cn(
                      "aspect-square rounded-2xl border-4 border-dashed border-zinc-100 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 transition-all group",
                      loading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                     {loading ? <Loader2 className="animate-spin text-primary" size={32} /> : (
                       <>
                         <ImagePlus size={32} className="text-zinc-300 group-hover:text-primary transition-colors" />
                         <span className="text-[10px] font-black text-zinc-400 mt-2">إضافة صور</span>
                       </>
                     )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4">
             <Button 
              type="submit"
              className="flex-1 h-20 text-2xl font-black rounded-[24px] shadow-2xl gap-3"
              disabled={loading || images.length === 0}
             >
               {loading ? <Loader2 className="animate-spin" size={24} /> : <>نشر الإعلان الآن <Send size={24} /></>}
             </Button>
             <Button 
              type="button"
              variant="outline" 
              className="h-20 px-10 text-lg font-black rounded-[24px] border-2 border-zinc-200"
              onClick={() => router.back()}
             >
               إلغاء
             </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
