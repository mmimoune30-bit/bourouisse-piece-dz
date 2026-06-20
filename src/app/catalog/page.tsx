
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
import { Filter, ChevronRight, Search, RotateCcw } from "lucide-react";
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
  }, []);

  // Cascading Logic
  const availableBrands = useMemo(() => {
    const typeObj = VEHICLE_TYPES.find(t => t.id === vehicleType);
    return typeObj ? typeObj.brands : [];
  }, [vehicleType]);

  const availableModels = useMemo(() => {
    return brand ? BRAND_MODELS[brand] || [] : [];
  }, [brand]);

  // Mock Products - In real app, this would be a Firestore query
  const products = []; 

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
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4">
          
          <div className="mb-8 flex flex-col md:flex-row-reverse justify-between items-center gap-4">
            <div className="text-right">
              <h1 className="text-3xl font-black text-primary">
                {lang === 'ar' ? 'محرك البحث المتطور' : 'Advanced Search Engine'}
              </h1>
              <p className="text-muted-foreground font-bold">
                {lang === 'ar' ? 'اختر مواصفات مركبتك بدقة للوصول للقطع' : 'Select vehicle specs to find parts'}
              </p>
            </div>
            {vehicleType && (
              <div className="bg-white px-6 py-3 rounded-2xl border-2 border-primary/10 shadow-sm flex items-center gap-3 text-sm font-black text-primary" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <span className="text-secondary">{lang === 'ar' ? 'المسار المختار:' : 'Selected Path:'}</span>
                <span className="opacity-70">{getSelectionPath()}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row-reverse gap-8">
            {/* CASCADING FILTERS ASIDE */}
            <aside className="w-full lg:w-96 space-y-6">
              <Card className="border-none shadow-xl sticky top-[250px]">
                <CardContent className="p-6 space-y-6 text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="font-black text-xl text-primary">{lang === 'ar' ? 'تصفية النتائج' : 'Filters'}</h3>
                    <Filter size={20} className="text-secondary" />
                  </div>

                  {/* STEP 1: Vehicle Type */}
                  <div className="space-y-2">
                    <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">
                      {lang === 'ar' ? '1. نوع المركبة' : 'Step 1: Vehicle Type'}
                    </Label>
                    <Select value={vehicleType} onValueChange={(v) => { setVehicleType(v); setBrand(""); setModel(""); setYear(""); setCategory(""); }}>
                      <SelectTrigger className="h-12 border-2 border-primary/5 focus:border-secondary">
                        <SelectValue placeholder={lang === 'ar' ? 'اختر النوع' : 'Select Type'} />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLE_TYPES.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.label[lang]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* STEP 2: Brand */}
                  <div className="space-y-2">
                    <Label className={cn("font-black text-xs uppercase tracking-widest", !vehicleType ? "text-zinc-300" : "text-muted-foreground")}>
                      {lang === 'ar' ? '2. ماركة المركبة' : 'Step 2: Brand'}
                    </Label>
                    <Select disabled={!vehicleType} value={brand} onValueChange={(v) => { setBrand(v); setModel(""); setYear(""); setCategory(""); }}>
                      <SelectTrigger className="h-12 border-2 border-primary/5">
                        <SelectValue placeholder={lang === 'ar' ? 'اختر الماركة' : 'Select Brand'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        <SelectItem value="Other">{lang === 'ar' ? 'آخر +' : 'Other +'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* STEP 3: Model */}
                  <div className="space-y-2">
                    <Label className={cn("font-black text-xs uppercase tracking-widest", !brand ? "text-zinc-300" : "text-muted-foreground")}>
                      {lang === 'ar' ? '3. الموديل' : 'Step 3: Model'}
                    </Label>
                    <Select disabled={!brand} value={model} onValueChange={(v) => { setModel(v); setYear(""); setCategory(""); }}>
                      <SelectTrigger className="h-12 border-2 border-primary/5">
                        <SelectValue placeholder={lang === 'ar' ? 'اختر الموديل' : 'Select Model'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        <SelectItem value="Other">{lang === 'ar' ? 'آخر +' : 'Other +'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* STEP 4: Year */}
                  <div className="space-y-2">
                    <Label className={cn("font-black text-xs uppercase tracking-widest", !model ? "text-zinc-300" : "text-muted-foreground")}>
                      {lang === 'ar' ? '4. سنة الصنع' : 'Step 4: Year'}
                    </Label>
                    <Select disabled={!model} value={year} onValueChange={(v) => { setYear(v); setCategory(""); }}>
                      <SelectTrigger className="h-12 border-2 border-primary/5">
                        <SelectValue placeholder={lang === 'ar' ? 'اختر السنة' : 'Select Year'} />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* STEP 5: Category */}
                  <div className="space-y-2">
                    <Label className={cn("font-black text-xs uppercase tracking-widest", !year ? "text-zinc-300" : "text-muted-foreground")}>
                      {lang === 'ar' ? '5. فئة القطعة' : 'Step 5: Category'}
                    </Label>
                    <Select disabled={!year} value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-12 border-2 border-primary/5">
                        <SelectValue placeholder={lang === 'ar' ? 'اختر الفئة' : 'Select Category'} />
                      </SelectTrigger>
                      <SelectContent>
                        {PART_CATEGORIES.map(c => <SelectItem key={c.en} value={c.en}>{c[lang]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 font-black gap-2 mt-4 text-destructive border-destructive/20 hover:bg-destructive/5"
                    onClick={handleReset}
                  >
                    <RotateCcw size={16} /> {lang === 'ar' ? 'إعادة ضبط البحث' : 'Reset Search'}
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* RESULTS AREA */}
            <div className="flex-1 space-y-6">
              {!category ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border-4 border-dashed border-primary/5 text-center px-6">
                   <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                      <Search size={48} className="text-primary opacity-20" />
                   </div>
                   <h2 className="text-2xl font-black text-primary mb-2">
                     {lang === 'ar' ? 'ابدأ البحث الآن' : 'Start Searching Now'}
                   </h2>
                   <p className="text-muted-foreground font-bold max-w-sm">
                     {lang === 'ar' 
                      ? 'يرجى إكمال خطوات التصفية في الجانب الأيمن للوصول لقطع الغيار المتوافقة مع مركبتك.' 
                      : 'Please complete the filter steps on the right to find compatible parts for your vehicle.'}
                   </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {/* Results would be mapped here */}
                   <p className="col-span-full text-center py-20 font-black text-zinc-400">
                     {lang === 'ar' ? 'جاري جلب النتائج المتوافقة...' : 'Fetching matching results...'}
                   </p>
                </div>
              )}
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
