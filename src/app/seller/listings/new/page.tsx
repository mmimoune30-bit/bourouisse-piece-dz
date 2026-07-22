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
import { Send, ImagePlus, Car, Settings, Tags, AlertCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NewListing() {
  const router = useRouter();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [loading, setLoading] = useState(false);

  // Selection State
  const [vehicleType, setVehicleType] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang")?.toLowerCase() as "ar" | "en";
    if (savedLang) setLang(savedLang);
  }, []);

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

  const handlePostListing = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "تم النشر بنجاح!", description: "إعلانك الآن متاح للمراجعة والظهور للمشترين." });
      router.push("/seller/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
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
                  <Label className="font-black text-sm">نوع المركبة (اختياري)</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger className="h-14 border-2 focus:border-secondary">
                      <SelectValue placeholder="اختر نوع المركبة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">أي نوع</SelectItem>
                      {VEHICLE_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.label[lang]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-black text-sm">ماركة المركبة</Label>
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger className="h-14 border-2 focus:border-secondary">
                      <SelectValue placeholder="اختر الماركة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">أي ماركة</SelectItem>
                      {availableBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-black text-sm">الموديل</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="h-14 border-2 focus:border-secondary">
                      <SelectValue placeholder="اختر الموديل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">أي موديل</SelectItem>
                      {availableModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-black text-sm">سنة الصنع</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="h-14 border-2 focus:border-secondary">
                      <SelectValue placeholder="اختر السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">أي سنة</SelectItem>
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
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-14 border-2"><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">أي فئة</SelectItem>
                      {PART_CATEGORIES.map(c => <SelectItem key={c.en} value={c.en}>{c[lang]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-black">اسم القطعة</Label>
                  <Input placeholder="مثلاً: محرك كامل، مصباح خلفي..." className="h-14 border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black">السعر (دج)</Label>
                  <Input type="number" placeholder="0.00" className="h-14 border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black">الحالة</Label>
                  <Select defaultValue="used">
                    <SelectTrigger className="h-14 border-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">جديد (New)</SelectItem>
                      <SelectItem value="used">مستعمل (Used)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="font-black">الصور</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="aspect-square rounded-3xl border-4 border-dashed border-zinc-100 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 transition-all group">
                     <ImagePlus size={32} className="text-zinc-300 group-hover:text-primary transition-colors" />
                     <span className="text-[10px] font-black text-zinc-400 mt-2">إضافة صور</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4">
             <Button 
              className="flex-1 h-20 text-2xl font-black rounded-[24px] shadow-2xl gap-3"
              disabled={loading}
              onClick={handlePostListing}
             >
               {loading ? "جاري النشر..." : <>نشر الإعلان الآن <Send size={24} /></>}
             </Button>
             <Button 
              variant="outline" 
              className="h-20 px-10 text-lg font-black rounded-[24px] border-2 border-zinc-200"
              onClick={() => router.back()}
             >
               إلغاء
             </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}