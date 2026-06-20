
"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VEHICLE_TYPES, BRAND_MODELS, YEARS, PART_CATEGORIES } from "@/lib/vehicle-data";
import { Filter, Search, RotateCcw } from "lucide-react";
import { Suspense, useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function CatalogContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<"ar" | "en">("ar");

  // Selection States
  const [vehicleType, setVehicleType] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang")?.toLowerCase() as "ar" | "en";
    if (savedLang) setLang(savedLang);
    
    // Auto-fill from query if exists
    const qCat = searchParams.get("category");
    if (qCat) setCategory(qCat);
  }, [searchParams]);

  // Available Data based on context (Optional filters allow selecting all brands if no type selected)
  const availableBrands = useMemo(() => {
    if (!vehicleType) {
      // If no type selected, show all unique brands across all types
      const allBrands = new Set<string>();
      VEHICLE_TYPES.forEach(t => t.brands.forEach(b => allBrands.add(b)));
      return Array.from(allBrands).sort();
    }
    const typeObj = VEHICLE_TYPES.find(t => t.id === vehicleType);
    return typeObj ? typeObj.brands : [];
  }, [vehicleType]);

  const availableModels = useMemo(() => {
    return brand ? BRAND_MODELS[brand] || [] : [];
  }, [brand]);

  const handleReset = () => {
    setVehicleType("");
    setBrand("");
    setModel("");
    setYear("");
    setCategory("");
  };

  const getSelectionPath = () => {
    const typeLabel = VEHICLE_TYPES.find(t => t.id === vehicleType)?.label[lang];
    const parts = [typeLabel, brand, model, year, category].filter(Boolean);
    return parts.join(" > ");
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[290px] pb-12">
        <div className="container mx-auto px-4">
          
          <div className="mb-8 flex flex-col md:flex-row-reverse justify-between items-center gap-4">
            <div className="text-right">
              <h1 className="text-3xl font-black text-primary">
                {lang === 'ar' ? 'نتائج البحث والفلترة' : 'Search Results & Filtering'}
              </h1>
              <p className="text-muted-foreground font-bold">
                {lang === 'ar' ? 'استخدم القوائم الجانبية لتخصيص بحثك' : 'Use side filters to customize your search'}
              </p>
            </div>
            {(vehicleType || brand || category) && (
              <div className="bg-white px-6 py-3 rounded-2xl border-2 border-primary/10 shadow-sm flex items-center gap-3 text-sm font-black text-primary" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <span className="text-secondary">{lang === 'ar' ? 'المسار المختار:' : 'Selected Path:'}</span>
                <span className="opacity-70">{getSelectionPath()}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row-reverse gap-8">
            {/* OPTIONAL FILTERS ASIDE */}
            <aside className="w-full lg:w-96 space-y-6">
              <Card className="border-none shadow-xl sticky top-[300px]">
                <CardContent className="p-6 space-y-6 text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="font-black text-xl text-primary">{lang === 'ar' ? 'تصفية اختيارية' : 'Filters'}</h3>
                    <Filter size={20} className="text-secondary" />
                  </div>

                  {/* Vehicle Type */}
                  <div className="space-y-2">
                    <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">
                      {lang === 'ar' ? 'نوع المركبة' : 'Vehicle Type'}
                    </Label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger className="h-12 border-2 border-primary/5 focus:border-secondary">
                        <SelectValue placeholder={lang === 'ar' ? 'الكل' : 'Any Type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">{lang === 'ar' ? 'أي نوع' : 'Any Type'}</SelectItem>
                        {VEHICLE_TYPES.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.label[lang]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Brand */}
                  <div className="space-y-2">
                    <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">
                      {lang === 'ar' ? 'الماركة' : 'Brand'}
                    </Label>
                    <Select value={brand} onValueChange={setBrand}>
                      <SelectTrigger className="h-12 border-2 border-primary/5">
                        <SelectValue placeholder={lang === 'ar' ? 'الكل' : 'Any Brand'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">{lang === 'ar' ? 'أي ماركة' : 'Any Brand'}</SelectItem>
                        {availableBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">
                      {lang === 'ar' ? 'الموديل' : 'Model'}
                    </Label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger className="h-12 border-2 border-primary/5">
                        <SelectValue placeholder={lang === 'ar' ? 'الكل' : 'Any Model'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">{lang === 'ar' ? 'أي موديل' : 'Any Model'}</SelectItem>
                        {availableModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">
                      {lang === 'ar' ? 'سنة الصنع' : 'Year'}
                    </Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="h-12 border-2 border-primary/5">
                        <SelectValue placeholder={lang === 'ar' ? 'أي سنة' : 'Any Year'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">{lang === 'ar' ? 'أي سنة' : 'Any Year'}</SelectItem>
                        {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">
                      {lang === 'ar' ? 'فئة القطعة' : 'Category'}
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-12 border-2 border-primary/5">
                        <SelectValue placeholder={lang === 'ar' ? 'أي فئة' : 'Any Category'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">{lang === 'ar' ? 'أي فئة' : 'Any Category'}</SelectItem>
                        {PART_CATEGORIES.map(c => <SelectItem key={c.en} value={c.en}>{c[lang]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 font-black gap-2 mt-4 text-destructive border-destructive/20 hover:bg-destructive/5"
                    onClick={handleReset}
                  >
                    <RotateCcw size={16} /> {lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* RESULTS AREA */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* This would be real data mapping */}
                 <div className="col-span-full py-20 bg-white rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center text-zinc-400">
                    <Search size={48} className="opacity-20 mb-4" />
                    <p className="font-black">لا توجد نتائج مطابقة حالياً لخيارات البحث المختارة.</p>
                    <Button variant="link" onClick={handleReset} className="mt-2 font-bold text-secondary">إعادة تعيين البحث</Button>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-2xl animate-pulse">جاري التحميل...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
