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

// Mock Data for live filtering demonstration
const MOCK_CATALOG_PRODUCTS = [
  { id: "p1", name: "مصباح أمامي أيمن Clio 4", price: 8500, image: "https://picsum.photos/seed/p1/400/400", category: "إضاءة", seller: "Auto Pièces Chlef", condition: "New" as const, brand: "Renault", model: "Clio IV", year: "2018" },
  { id: "p2", name: "محرك كامل 1.5 dCi", price: 450000, image: "https://picsum.photos/seed/p2/400/400", category: "المحرك", seller: "Bourouisse Parts", condition: "Used" as const, brand: "Renault", model: "Megane", year: "2015" },
  { id: "p3", name: "رادياتور Peugeot 208", price: 12000, image: "https://picsum.photos/seed/p3/400/400", category: "التبريد", seller: "Pièces Renault DZ", condition: "New" as const, brand: "Peugeot", model: "208", year: "2019" },
  { id: "p4", name: "علبة سرعة VW Golf 7", price: 65000, image: "https://picsum.photos/seed/p4/400/400", category: "علبة السرعة", seller: "EliteMotors DZ", condition: "Used" as const, brand: "Volkswagen", model: "Golf", year: "2017" },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<"ar" | "en">("ar");

  // Selection States
  const [brand, setBrand] = useState<string>(searchParams.get("brand") || "");
  const [model, setModel] = useState<string>(searchParams.get("model") || "");
  const [year, setYear] = useState<string>(searchParams.get("year") || "");
  const [category, setCategory] = useState<string>(searchParams.get("category") || "");
  const [textSearch, setTextSearch] = useState<string>(searchParams.get("query") || "");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang")?.toLowerCase() as "ar" | "en";
    if (savedLang) setLang(savedLang);
  }, []);

  // Sync local textSearch state with searchParams (for Navbar AI Search Box)
  useEffect(() => {
    setTextSearch(searchParams.get("query") || "");
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  // Real-time Filtering Logic
  const filteredProducts = useMemo(() => {
    return MOCK_CATALOG_PRODUCTS.filter(p => {
      const q = textSearch.toLowerCase();
      const matchesText = !textSearch || 
                          p.name.toLowerCase().includes(q) || 
                          p.brand.toLowerCase().includes(q) ||
                          p.model.toLowerCase().includes(q);
      const matchesBrand = !brand || brand === "Any" || p.brand === brand;
      const matchesModel = !model || model === "Any" || p.model === model;
      const matchesYear = !year || year === "Any" || p.year === year;
      const matchesCategory = !category || category === "Any" || p.category.includes(category) || category.includes(p.category);
      return matchesText && matchesBrand && matchesModel && matchesYear && matchesCategory;
    });
  }, [textSearch, brand, model, year, category]);

  const availableBrands = useMemo(() => {
    const allBrands = new Set<string>();
    VEHICLE_TYPES.forEach(t => t.brands.forEach(b => allBrands.add(b)));
    return Array.from(allBrands).sort();
  }, []);

  const availableModels = useMemo(() => {
    return brand && brand !== "Any" ? BRAND_MODELS[brand] || [] : [];
  }, [brand]);

  const handleReset = () => {
    setBrand("");
    setModel("");
    setYear("");
    setCategory("");
    setTextSearch("");
    window.history.pushState({}, "", "/catalog");
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[295px] pb-12">
        <div className="container mx-auto px-4">
          
          <div className="mb-8 flex flex-col md:flex-row-reverse justify-between items-center gap-4">
            <div className="text-right">
              <h1 className="text-3xl font-black text-primary">الكتالوج الشامل</h1>
              <p className="text-muted-foreground font-bold">تصفح وفلتر آلاف القطع المتوفرة حالياً.</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border shadow-sm flex items-center gap-3 text-sm font-bold text-primary" dir="rtl">
              <span className="text-secondary">نتائج الفلترة:</span>
              <span className="opacity-70">{filteredProducts.length} قطعة مطابقة</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Advanced Filters Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <Card className="border-none shadow-xl sticky top-[300px]">
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="font-black text-xl text-primary">فلاتر متقدمة</h3>
                    <Filter size={20} className="text-secondary" />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-black text-xs text-muted-foreground">الماركة</Label>
                    <Select value={brand} onValueChange={setBrand}>
                      <SelectTrigger className="h-11 border-2"><SelectValue placeholder="الكل" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">كل الماركات</SelectItem>
                        {availableBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-black text-xs text-muted-foreground">الموديل</Label>
                    <Select value={model} onValueChange={setModel} disabled={!brand || brand === "Any"}>
                      <SelectTrigger className="h-11 border-2"><SelectValue placeholder="الكل" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">كل الموديلات</SelectItem>
                        {availableModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-black text-xs text-muted-foreground">سنة الصنع</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="h-11 border-2"><SelectValue placeholder="الكل" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">كل السنوات</SelectItem>
                        {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-black text-xs text-muted-foreground">تصنيف القطعة</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-11 border-2"><SelectValue placeholder="الكل" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">كل الفئات</SelectItem>
                        {PART_CATEGORIES.map(c => <SelectItem key={c.en} value={c.en}>{c[lang]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" className="w-full h-11 font-black gap-2 mt-4" onClick={handleReset}>
                    <RotateCcw size={16} /> إعادة ضبط الفلاتر
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredProducts.length > 0 ? (
                   filteredProducts.map((product) => (
                     <ProductCard key={product.id} {...product} />
                   ))
                 ) : (
                   <div className="col-span-full py-32 bg-white rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center text-zinc-400">
                      <Search size={64} className="opacity-10 mb-4" />
                      <p className="font-black text-lg text-primary/40">لا توجد نتائج مطابقة لبحثك حالياً</p>
                      <Button variant="link" onClick={handleReset} className="mt-2 font-bold text-secondary">إظهار كافة القطع</Button>
                   </div>
                 )}
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