
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
import { WILAYAS_DATA } from "@/lib/algeria-locations";
import { Send, CheckCircle2, ImagePlus, Car, Settings, Tags, MapPin, AlertCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NewListing() {
  const router = useRouter();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [loading, setLoading] = useState(false);

  // Cascading Selection State
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
    const typeObj = VEHICLE_TYPES.find(t => t.id === vehicleType);
    return typeObj ? typeObj.brands : [];
  }, [vehicleType]);

  const availableModels = useMemo(() => {
    return brand ? BRAND_MODELS[brand] || [] : [];
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
      <main className="flex-grow container mx-auto px-4 pt-[235px] pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-right" dir="rtl">
            <h1 className="text-4xl font-black text-primary mb-2">إضافة قطعة غيار جديدة</h1>
            <p className="text-muted-foreground font-bold">اتبع الخطوات المتسلسلة لضمان دقة معلومات الإعلان.</p>
          </div>

          {/* STEPPER / SELECTION CARD */}
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
            <CardHeader className="bg-primary text-white p-6">
              <CardTitle className="text-xl flex items-center justify-end gap-3">
                1. مواصفات المركبة المتوافقة <Car className="text-secondary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8 text-right" dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Vehicle Type */}
                <div className="space-y-2">
                  <Label className="font-black text-sm">نوع المركبة (إلزامي أولاً)</Label>
                  <Select value={vehicleType} onValueChange={(v) => { setVehicleType(v); setBrand(""); setModel(""); setYear(""); setCategory(""); }}>
                    <SelectTrigger className="h-14 border-2 focus:border-secondary">
                      <SelectValue placeholder="اختر نوع المركبة" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.label[lang]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Brand */}
                <div className="space-y-2">
                  <Label className={cn("font-black text-sm", !vehicleType && "opacity-30")}>ماركة المركبة</Label>
                  <Select disabled={!vehicleType} value={brand} onValueChange={(v) => { setBrand(v); setModel(""); setYear(""); setCategory(""); }}>
                    <SelectTrigger className="h-14 border-2 focus:border-secondary">
                      <SelectValue placeholder="اختر الماركة" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Model */}
                <div className="space-y-2">
                  <Label className={cn("font-black text-sm", !brand && "opacity-30")}>الموديل</Label>
                  <Select disabled={!brand} value={model} onValueChange={(v) => { setModel(v); setYear(""); setCategory(""); }}>
                    <SelectTrigger className="h-14 border-2 focus:border-secondary">
                      <SelectValue placeholder="اختر الموديل" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Year */}
                <div className="space-y-2">
                  <Label className={cn("font-black text-sm", !model && "opacity-30")}>سنة الصنع</Label>
                  <Select disabled={!model} value={year} onValueChange={(v) => { setYear(v); setCategory(""); }}>
                    <SelectTrigger className="h-14 border-2 focus:border-secondary">
                      <SelectValue placeholder="اختر السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selection Summary Breadcrumb */}
              {vehicleType && (
                <div className="bg-secondary/10 p-4 rounded-2xl border-2 border-dashed border-secondary/30 flex items-center justify-between">
                   <div className="flex items-center gap-2 font-black text-primary">
                     <CheckCircle2 className="text-green-600" size={20} />
                     <span>{lang === 'ar' ? 'المواصفات المختارة:' : 'Selected Specs:'}</span>
                   </div>
                   <div className="text-sm font-bold text-primary/70">
                     {[VEHICLE_TYPES.find(t=>t.id===vehicleType)?.label[lang], brand, model, year].filter(Boolean).join(" > ")}
                   </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PART DETAILS CARD */}
          <Card className={cn("border-none shadow-xl rounded-[32px] overflow-hidden transition-all", !year && "opacity-30 pointer-events-none")}>
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
                      {PART_CATEGORIES.map(c => <SelectItem key={c.en} value={c.en}>{c[lang]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-black">اسم القطعة</Label>
                  <Input placeholder="مثلاً: محرك كامل، مصباح خلفي..." className="h-14 border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black">رقم القطعة (Part Number) - اختياري</Label>
                  <Input placeholder="مثلاً: 03L130277J" className="h-14 border-2 font-mono" />
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
                <div className="space-y-2">
                  <Label className="font-black">السعر (دج)</Label>
                  <Input type="number" placeholder="0.00" className="h-14 border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black">الكمية المتاحة</Label>
                  <Input type="number" defaultValue="1" className="h-14 border-2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-black">وصف إضافي</Label>
                <Textarea placeholder="أضف أي تفاصيل أخرى عن حالة القطعة أو الضمان..." className="min-h-[120px] border-2" />
              </div>

              <div className="space-y-4">
                <Label className="font-black">الصور (حتى 10 صور)</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="aspect-square rounded-3xl border-4 border-dashed border-zinc-100 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 transition-all group">
                     <ImagePlus size={32} className="text-zinc-300 group-hover:text-primary transition-colors" />
                     <span className="text-[10px] font-black text-zinc-400 mt-2">إضافة صور</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FINAL SUBMIT */}
          <div className="flex flex-col md:flex-row gap-4">
             <Button 
              className="flex-1 h-20 text-2xl font-black rounded-[24px] shadow-2xl gap-3"
              disabled={loading || !category}
              onClick={handlePostListing}
             >
               {loading ? "جاري المعالجة..." : <>نشر الإعلان الآن <Send size={24} /></>}
             </Button>
             <Button 
              variant="outline" 
              className="h-20 px-10 text-lg font-black rounded-[24px] border-2 border-zinc-200"
              onClick={() => router.back()}
             >
               إلغاء
             </Button>
          </div>

          {!year && (
            <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-100 flex items-start gap-4" dir="rtl">
               <AlertCircle className="text-amber-600 shrink-0 mt-1" />
               <div className="text-right">
                  <h4 className="font-black text-amber-900">تنبيه النظام</h4>
                  <p className="text-sm text-amber-800 font-bold leading-relaxed">
                    يجب عليك إكمال مواصفات المركبة (النوع > الماركة > الموديل > السنة) أولاً لتتمكن من إدخال بيانات القطعة ونشر الإعلان. هذا يضمن وصول إعلانك للأشخاص المناسبين.
                  </p>
               </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
