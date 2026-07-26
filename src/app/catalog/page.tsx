"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VEHICLE_TYPES, BRAND_MODELS, YEARS, PART_CATEGORIES, FUEL_TYPES } from "@/lib/vehicle-data";
import { Filter, Search, RotateCcw, X, SlidersHorizontal } from "lucide-react";
import { Suspense, useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function CatalogContent() {
  const searchParams = useSearchParams();
  const { firestore } = useFirestore();
  const [lang, setLang] = useState<"ar" | "en">("ar");

  const [brand, setBrand] = useState<string>(searchParams.get("brand") || "");
  const [model, setModel] = useState<string>(searchParams.get("model") || "");
  const [year, setYear] = useState<string>(searchParams.get("year") || "");
  const [category, setCategory] = useState<string>(searchParams.get("category") || "");
  const [fuelType, setFuelType] = useState<string>(searchParams.get("fuelType") || "");
  const [textSearch, setTextSearch] = useState<string>(searchParams.get("query") || "");

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "listings"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: dbProducts, loading } = useCollection(productsQuery);

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang")?.toLowerCase() as "ar" | "en";
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    setTextSearch(searchParams.get("query") || "");
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    if (!dbProducts) return [];
    return dbProducts.filter(p => {
      const q = textSearch.toLowerCase();
      const matchesText = !textSearch || 
                          p.name?.toLowerCase().includes(q) || 
                          p.brand?.toLowerCase().includes(q) ||
                          p.model?.toLowerCase().includes(q) ||
                          p.description?.toLowerCase().includes(q);
      const matchesBrand = !brand || brand === "Any" || p.brand === brand;
      const matchesModel = !model || model === "Any" || p.model === model;
      const matchesYear = !year || year === "Any" || p.year === year;
      const matchesFuel = !fuelType || fuelType === "Any" || p.fuelType === fuelType;
      const matchesCategory = !category || category === "Any" || p.category === category;
      return matchesText && matchesBrand && matchesModel && matchesYear && matchesFuel && matchesCategory && p.status === 'Active';
    });
  }, [dbProducts, textSearch, brand, model, year, fuelType, category]);

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
    setFuelType("");
    setTextSearch("");
    window.history.pushState({}, "", "/catalog");
  };

  const FilterPanel = ({ isMobile = false }) => (
    <div className={cn("space-y-6 text-right", !isMobile && "sticky top-[180px]")} dir="rtl">
      {!isMobile && (
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="font-black text-xl text-primary">فلاتر متقدمة</h3>
          <Filter size={20} className="text-secondary" />
        </div>
      )}

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
        <Label className="font-black text-xs text-muted-foreground">نوع الطاقة</Label>
        <Select value={fuelType} onValueChange={setFuelType}>
          <SelectTrigger className="h-11 border-2"><SelectValue placeholder="الكل" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">كل الأنواع</SelectItem>
            {FUEL_TYPES.map(f => <SelectItem key={f.en} value={f.en}>{f[lang]}</SelectItem>)}
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
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[170px] md:pt-[190px] pb-12">
        <div className="container mx-auto px-4">
          
          <div className="mb-6 flex flex-col md:flex-row-reverse justify-between items-center gap-4">
            <div className="text-right w-full md:w-auto">
              <h1 className="text-2xl md:text-3xl font-black text-primary leading-tight">الكتالوج الشامل</h1>
              <p className="text-xs md:text-sm text-muted-foreground font-bold">تصفح وفلتر آلاف القطع المتوفرة حالياً.</p>
            </div>
            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3" dir="rtl">
              <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border shadow-sm flex items-center gap-2 md:gap-3 text-xs md:text-sm font-bold text-primary">
                <span className="text-secondary">النتائج:</span>
                <span className="opacity-70">{loading ? "..." : filteredProducts.length} قطعة</span>
              </div>
              
              {/* Mobile Filter Trigger */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" className="font-bold gap-2 h-10 md:h-12 rounded-xl">
                      <SlidersHorizontal size={18} /> تصفية
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle className="text-right font-black">خيارات البحث المتقدم</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8">
                      <FilterPanel isMobile={true} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <Card className="border-none shadow-xl">
                <CardContent className="p-6">
                   <FilterPanel />
                </CardContent>
              </Card>
            </aside>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                 {loading ? (
                   Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="h-80 bg-zinc-200 animate-pulse rounded-[24px] md:rounded-[32px]" />
                   ))
                 ) : filteredProducts.length > 0 ? (
                   filteredProducts.map((product) => (
                     <ProductCard 
                        key={product.id} 
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.images?.[0] || "https://picsum.photos/seed/placeholder/400/400"}
                        category={product.category}
                        seller={product.sellerName}
                        condition={product.condition === 'new' ? 'New' : 'Used'}
                        createdAt={product.createdAt}
                     />
                   ))
                 ) : (
                   <div className="col-span-full py-20 md:py-32 bg-white rounded-[32px] md:rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center text-zinc-400">
                      <Search size={48} md:size={64} className="opacity-10 mb-4" />
                      <p className="font-black text-base md:text-lg text-primary/40 px-6 text-center">لا توجد نتائج مطابقة لبحثك حالياً</p>
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