"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VEHICLE_TYPES, BRAND_MODELS, YEARS, PART_CATEGORIES, FUEL_TYPES, type Translation } from "@/lib/vehicle-data";
import { Filter, Search, RotateCcw, SlidersHorizontal, Loader2 } from "lucide-react";
import { Suspense, useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, where, limit } from "firebase/firestore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function CatalogContent() {
  const searchParams = useSearchParams();
  const { firestore } = useFirestore();
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");

  const [brand, setBrand] = useState<string>(searchParams.get("brand") || "");
  const [model, setModel] = useState<string>(searchParams.get("model") || "");
  const [year, setYear] = useState<string>(searchParams.get("year") || "");
  const [category, setCategory] = useState<string>(searchParams.get("category") || "");
  const [fuelType, setFuelType] = useState<string>(searchParams.get("fuelType") || "");
  const [textSearch, setTextSearch] = useState<string>(searchParams.get("query") || "");

  // استعلام الكتالوج بحد أقصى 40 منتج لضمان السرعة
  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "listings"), 
      where("status", "==", "Active"),
      orderBy("createdAt", "desc"),
      limit(40)
    );
  }, [firestore]);

  const { data: dbProducts, loading } = useCollection(productsQuery);

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!dbProducts) return [];
    return dbProducts.filter(p => {
      const q = textSearch.toLowerCase();
      const matchesText = !textSearch || p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.model?.toLowerCase().includes(q);
      const matchesBrand = !brand || brand === "Any" || p.brand === brand;
      const matchesModel = !model || model === "Any" || p.model === model;
      const matchesYear = !year || year === "Any" || p.year === year;
      const matchesFuel = !fuelType || fuelType === "Any" || p.fuelType === fuelType;
      const matchesCategory = !category || category === "Any" || p.category === category;
      return matchesText && matchesBrand && matchesModel && matchesYear && matchesFuel && matchesCategory;
    });
  }, [dbProducts, textSearch, brand, model, year, fuelType, category]);

  const availableBrands = useMemo(() => {
    const allBrands = new Set<string>();
    VEHICLE_TYPES.forEach(t => t.brands.forEach(b => allBrands.add(b)));
    return Array.from(allBrands).sort();
  }, []);

  const availableModels = useMemo(() => brand && brand !== "Any" ? BRAND_MODELS[brand] || [] : [], [brand]);

  const handleReset = () => {
    setBrand(""); setModel(""); setYear(""); setCategory(""); setFuelType(""); setTextSearch("");
    window.history.pushState({}, "", "/catalog");
  };

  const t = {
    filters: { AR: "فلاتر متقدمة", EN: "Filters", FR: "Filtres" },
    brand: { AR: "الماركة", EN: "Brand", FR: "Marque" },
    model: { AR: "الموديل", EN: "Model", FR: "Modèle" },
    year: { AR: "سنة الصنع", EN: "Year", FR: "Année" },
    fuel: { AR: "نوع الطاقة", EN: "Fuel Type", FR: "Énergie" },
    category: { AR: "تصنيف القطعة", EN: "Category", FR: "Catégorie" },
    reset: { AR: "مسح الفلاتر", EN: "Reset", FR: "Effacer" },
    title: { AR: "الكتالوج الشامل", EN: "Catalog", FR: "Catalogue" },
    subtitle: { AR: "تصفح وفلتر آلاف القطع المتوفرة حالياً.", EN: "Browse and filter thousands of parts.", FR: "Parcurir et filtrer des milliers de pièces." },
    results: { AR: "النتائج:", EN: "Results:", FR: "Résultats:" },
    allBrands: { AR: "الماركات", EN: "All Brands", FR: "Marques" },
  };

  const titleFont = lang === 'AR' ? 'font-black' : 'font-medium';
  const labelFont = lang === 'AR' ? 'font-black' : 'font-medium';
  const buttonFont = lang === 'AR' ? 'font-black' : 'font-medium';

  const FilterPanel = ({ isMobile = false }) => (
    <div className={cn("space-y-4 text-right", !isMobile && "sticky top-[220px]")} dir={lang === 'AR' ? "rtl" : "ltr"}>
      {!isMobile && (
        <div className={cn("flex items-center justify-between border-b pb-2", lang === 'AR' ? "flex-row" : "flex-row-reverse")}>
          <Filter size={18} className="text-secondary" />
          <h3 className={cn("text-lg text-black", titleFont)}>{t.filters[lang]}</h3>
        </div>
      )}
      <div className={cn("space-y-1.5", lang === 'AR' ? "text-right" : "text-left")}>
        <Label className={cn("text-sm text-black uppercase", labelFont)}>{t.brand[lang]}</Label>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger className={cn("h-10 border-2 text-black text-sm", labelFont)}><SelectValue placeholder={t.allBrands[lang]} /></SelectTrigger>
          <SelectContent>{availableBrands.map(b => <SelectItem key={b} value={b} className="text-xs">{b}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className={cn("space-y-1.5", lang === 'AR' ? "text-right" : "text-left")}>
        <Label className={cn("text-sm text-black uppercase", labelFont)}>{t.model[lang]}</Label>
        <Select value={model} onValueChange={setModel} disabled={!brand}>
          <SelectTrigger className={cn("h-10 border-2 text-black text-sm", labelFont)}><SelectValue placeholder="-" /></SelectTrigger>
          <SelectContent>{availableModels.map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className={cn("space-y-1.5", lang === 'AR' ? "text-right" : "text-left")}>
        <Label className={cn("text-sm text-black uppercase", labelFont)}>{t.year[lang]}</Label>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className={cn("h-10 border-2 text-black text-sm", labelFont)}><SelectValue placeholder="-" /></SelectTrigger>
          <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className={cn("space-y-1.5", lang === 'AR' ? "text-right" : "text-left")}>
        <Label className={cn("text-sm text-black uppercase", labelFont)}>{t.fuel[lang]}</Label>
        <Select value={fuelType} onValueChange={setFuelType}>
          <SelectTrigger className={cn("h-10 border-2 text-black text-sm", labelFont)}><SelectValue placeholder="-" /></SelectTrigger>
          <SelectContent>{FUEL_TYPES.map(f => <SelectItem key={f.en} value={f.en} className="text-xs">{f[lang.toLowerCase() as keyof Translation]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className={cn("space-y-1.5", lang === 'AR' ? "text-right" : "text-left")}>
        <Label className={cn("text-sm text-black uppercase", labelFont)}>{t.category[lang]}</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className={cn("h-10 border-2 text-black text-sm", labelFont)}><SelectValue placeholder="-" /></SelectTrigger>
          <SelectContent>{PART_CATEGORIES.map(c => <SelectItem key={c.en} value={c.en} className="text-xs">{c[lang.toLowerCase() as keyof Translation]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Button className={cn("w-full h-12 gap-1.5 border-none text-sm uppercase mt-2 bg-[#9B2C2C] text-white hover:bg-red-900 shadow-md", buttonFont)} onClick={handleReset}>
        <RotateCcw size={16} /> {t.reset[lang]}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[190px] md:pt-[210px] pb-6">
        <div className="container mx-auto px-2">
          <div className={cn("mb-3 flex flex-col md:flex-row justify-between items-start gap-2", lang === 'AR' ? "md:flex-row-reverse" : "md:flex-row")}>
            <div className={cn("w-full md:w-auto", lang === 'AR' ? "text-right" : "text-left")}>
              <h1 className={cn("text-xl md:text-2xl text-black uppercase", titleFont)}>{t.title[lang]}</h1>
              <p className={cn("text-sm text-muted-foreground", labelFont)}>{t.subtitle[lang]}</p>
            </div>
            <div className={cn("w-full md:w-auto flex items-center justify-between gap-2", lang === 'AR' ? "flex-row-reverse" : "flex-row")} dir={lang === 'AR' ? "rtl" : "ltr"}>
              <div className={cn("bg-white px-3 py-1.5 rounded-lg border shadow-xs flex items-center gap-2 text-xs text-black", labelFont)}>
                <span className="text-secondary">{t.results[lang]}</span>
                <span className="opacity-70">{loading ? "..." : filteredProducts.length}</span>
              </div>
              <div className="lg:hidden">
                <Sheet><SheetTrigger asChild><Button variant="secondary" className={cn("gap-1.5 h-8 rounded-lg text-[10px] uppercase", buttonFont)}><SlidersHorizontal size={14} /> {t.filters[lang]}</Button></SheetTrigger>
                  <SheetContent side={lang === 'AR' ? "right" : "left"} className="w-[280px] p-4">
                    <SheetHeader><SheetTitle className={cn("uppercase text-sm", titleFont, lang === 'AR' ? "text-right" : "text-left")}>{t.filters[lang]}</SheetTitle></SheetHeader>
                    <div className="mt-4"><FilterPanel isMobile={true} /></div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <aside className="hidden lg:block lg:col-span-1"><Card className="border shadow-sm"><CardContent className="p-3"><FilterPanel /></CardContent></Card></aside>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                 {loading ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-60 bg-zinc-100 animate-pulse rounded-lg" />)
                 : filteredProducts.length > 0 ? filteredProducts.map((product) => (
                     <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} image={product.images?.[0] || "https://picsum.photos/seed/placeholder/400/400"} category={product.category} seller={product.sellerName} condition={product.condition === 'new' ? 'New' : 'Used'} createdAt={product.createdAt} />
                   )) : (
                   <div className="col-span-full py-16 bg-white rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-zinc-300">
                      <Search size={32} className="opacity-10 mb-2" />
                      <p className={cn("text-xs text-black uppercase", titleFont)}>No results</p>
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
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-xl animate-pulse">Loading...</div>}><CatalogContent /></Suspense>;
}
