
"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search, Filter, Car, Settings, Layers, Calendar } from "lucide-react";
import { Suspense, useMemo, useState, useEffect } from "react";

const BRAND_MODELS: Record<string, string[]> = {
  "Renault": ["Clio I", "Clio II", "Clio III", "Clio IV", "Clio V", "Megane I", "Megane II", "Megane III", "Megane IV", "Megane E-Tech", "Symbol", "Kangoo", "Scenic", "Laguna", "Fluence", "Captur", "Kadjar", "Koleos"],
  "Peugeot": ["205", "206", "206+", "207", "208 I", "208 II", "306", "307", "308 I", "308 II", "308 III", "406", "407", "508 I", "508 II", "Partner", "Expert", "Boxer", "2008", "3008", "5008"],
  "Volkswagen": ["Golf I", "Golf II", "Golf III", "Golf IV", "Golf V", "Golf VI", "Golf VII", "Golf VIII", "Polo", "Passat", "Bora", "Jetta", "Tiguan", "Touareg", "T-Roc", "Caddy", "Transporter"],
  "Toyota": ["Corolla", "Yaris", "Camry", "Avensis", "Prius", "RAV4", "C-HR", "Hilux", "Prado", "Land Cruiser"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "Sprinter", "Vito"],
  "BMW": ["1 Series", "3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7"],
  "Audi": ["A1", "A3", "A4", "A6", "A8", "Q3", "Q5", "Q7"],
  "Hyundai": ["i10", "i20", "i30", "Accent", "Elantra", "Tucson", "Santa Fe", "Sonata"],
  "Kia": ["Picanto", "Rio", "Cerato", "Optima", "Sportage", "Sorento"],
  "Dacia": ["Logan", "Sandero", "Duster", "Dokker", "Lodgy"],
};

const YEARS = Array.from({ length: 2026 - 1980 }, (_, i) => (2025 - i).toString());

const CATEGORY_DATA: Record<string, string[]> = {
  "Moteur (المحرك)": ["Moteur complet", "Culasse", "Injecteurs", "Turbo", "Radiateur", "Filtre à huile"],
  "Carrosserie (الهيكل)": ["Capot", "Pare-chocs avant", "Pare-chocs arrière", "Ailes", "Phares", "Feux", "Portières", "Coffre"],
  "Suspension et Direction (التوازي و التوازن)": ["Amortisseurs", "Triangles", "Crémaillère", "Disques de frein"],
  "Électricité (الكهرباء)": ["Batterie", "ECU (Cerveau)", "Alternateur", "Démarreur", "Phares", "Feux"],
  "Accessoires (الأكسيسوارات)": ["Autoradio", "Tapis", "Housses"]
};

const ALL_PRODUCTS = [
  { id: "p1", name: "مصباح أمامي أيمن Clio 4", price: 8500, image: PlaceHolderImages[5].imageUrl, category: "Électricité (الكهرباء)", partType: "Phares", brand: "Renault", model: "Clio IV", year: "2015", condition: "New" as const, listingType: "part", seller: "Auto Pièces Chlef" },
  { id: "p2", name: "باب أمامي أيسر Clio 2", price: 25000, image: PlaceHolderImages[6].imageUrl, category: "Carrosserie (الهيكل)", partType: "Portières", brand: "Renault", model: "Clio II", year: "2003", condition: "Used" as const, listingType: "part", seller: "Auto Pièces Chlef" },
  { id: "p3", name: "رادياتور Peugeot 208", price: 12000, image: PlaceHolderImages[4].imageUrl, category: "Moteur (المحرك)", partType: "Radiateur", brand: "Peugeot", model: "208 I", year: "2014", condition: "New" as const, listingType: "part", seller: "Pièces Renault DZ" },
  { id: "p4", name: "صدام أمامي Golf 7", price: 18000, image: PlaceHolderImages[5].imageUrl, category: "Carrosserie (الهيكل)", partType: "Pare-chocs avant", brand: "Volkswagen", model: "Golf VII", year: "2016", condition: "Used" as const, listingType: "part", seller: "Pièces Renault DZ" },
  { id: "p6", name: "كتلة محرك BMW X5", price: 450000, image: PlaceHolderImages[0].imageUrl, category: "Moteur (المحرك)", partType: "Moteur complet", brand: "BMW", model: "X5", year: "2012", condition: "Used" as const, listingType: "part", seller: "EliteMotors DZ" },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get("brand") || "");
  const [manualBrand, setManualBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [manualModel, setManualModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [manualPart, setManualPart] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    if (brand) setSelectedBrand(brand);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  const modelsList = useMemo(() => selectedBrand && selectedBrand !== "Other" ? BRAND_MODELS[selectedBrand] || [] : [], [selectedBrand]);
  const partsList = useMemo(() => selectedCategory ? CATEGORY_DATA[selectedCategory] || [] : [], [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS;
    
    if (activeTab !== "all") result = result.filter(p => p.listingType === activeTab);
    
    // Brand filtering
    if (selectedBrand) {
      if (selectedBrand === "Other") {
        if (manualBrand) result = result.filter(p => p.brand.toLowerCase().includes(manualBrand.toLowerCase()));
      } else {
        result = result.filter(p => p.brand === selectedBrand);
      }
    }

    // Model filtering
    if (selectedModel && selectedModel !== "all") {
      if (selectedModel === "Other") {
        if (manualModel) result = result.filter(p => p.model.toLowerCase().includes(manualModel.toLowerCase()));
      } else {
        result = result.filter(p => p.model === selectedModel);
      }
    }

    if (selectedYear && selectedYear !== "all") result = result.filter(p => p.year === selectedYear);
    if (selectedCategory) result = result.filter(p => p.category.includes(selectedCategory));
    
    // Part filtering
    if (selectedPart && selectedPart !== "all") {
      if (selectedPart === "Other") {
        if (manualPart) result = result.filter(p => p.partType.toLowerCase().includes(manualPart.toLowerCase()));
      } else {
        result = result.filter(p => p.partType === selectedPart);
      }
    }

    if (selectedCondition && selectedCondition !== "all") result = result.filter(p => p.condition === selectedCondition);
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return result;
  }, [activeTab, selectedBrand, manualBrand, selectedModel, manualModel, selectedYear, selectedCategory, selectedPart, manualPart, selectedCondition, searchQuery]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-6 mb-8">
            <div className="text-right">
              <h1 className="text-4xl font-black text-primary">الكتالوج الشامل</h1>
              <p className="text-muted-foreground font-bold">تصفح البيانات التجريبية للمتاجر الموثوقة</p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full md:w-auto">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-white border-2 border-primary/10">
                <TabsTrigger value="all" className="py-2 text-xs font-black">الكل</TabsTrigger>
                <TabsTrigger value="part" className="py-2 text-xs font-black">قطع منفردة</TabsTrigger>
                <TabsTrigger value="accidented" className="py-2 text-xs font-black">مصدومة</TabsTrigger>
                <TabsTrigger value="for_parts" className="py-2 text-xs font-black">للقطع</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col md:flex-row-reverse gap-8">
            <aside className="w-full md:w-80 space-y-6">
              <Card className="border-none shadow-xl sticky top-[250px]">
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="font-black text-xl text-primary">محرك البحث الدقيق</h3>
                    <Filter size={20} className="text-secondary" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-black flex items-center justify-end gap-2">
                        <Car size={16} className="text-secondary" /> ماركة السيارة
                      </Label>
                      <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setSelectedModel(""); setManualBrand(""); }}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الماركة" /></SelectTrigger>
                        <SelectContent>
                          {Object.keys(BRAND_MODELS).sort().map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                          <SelectItem value="Other" className="font-black text-secondary italic">آخر (إضافة ماركة جديدة) +</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedBrand === "Other" && (
                        <Input 
                          placeholder="اكتب اسم الماركة..." 
                          className="mt-2 border-secondary h-11" 
                          value={manualBrand}
                          onChange={(e) => setManualBrand(e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-black">الموديل</Label>
                      <Select 
                        disabled={!selectedBrand} 
                        value={selectedModel} 
                        onValueChange={(v) => { setSelectedModel(v); setManualModel(""); }}
                      >
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الموديل" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">كل الموديلات</SelectItem>
                          {modelsList.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                          <SelectItem value="Other" className="font-black text-secondary italic">آخر (إضافة موديل جديد) +</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedModel === "Other" && (
                        <Input 
                          placeholder="اكتب اسم الموديل..." 
                          className="mt-2 border-secondary h-11" 
                          value={manualModel}
                          onChange={(e) => setManualModel(e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-black flex items-center justify-end gap-2">
                        <Calendar size={16} className="text-secondary" /> سنة الصنع
                      </Label>
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر السنة" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">كل السنوات</SelectItem>
                          {YEARS.map(y => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="h-px bg-border my-2" />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-black flex items-center justify-end gap-2">
                        <Layers size={16} className="text-secondary" /> فئة القطعة
                      </Label>
                      <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setSelectedPart(""); }}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                        <SelectContent>
                          {Object.keys(CATEGORY_DATA).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-black">نوع القطعة</Label>
                      <Select 
                        disabled={!selectedCategory} 
                        value={selectedPart} 
                        onValueChange={(v) => { setSelectedPart(v); setManualPart(""); }}
                      >
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر نوع القطعة" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">كل الأنواع</SelectItem>
                          {partsList.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                          <SelectItem value="Other" className="font-black text-secondary italic">آخر (إضافة نوع جديد) +</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedPart === "Other" && (
                        <Input 
                          placeholder="اكتب اسم القطعة..." 
                          className="mt-2 border-secondary h-11" 
                          value={manualPart}
                          onChange={(e) => setManualPart(e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-border my-2" />

                  <div className="space-y-2">
                    <Label className="text-sm font-black flex items-center justify-end gap-2 text-secondary">
                       حالة القطعة
                    </Label>
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الحالة" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="New">جديد (New)</SelectItem>
                        <SelectItem value="Used">مستعمل (Used)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full font-black h-12 text-destructive border-destructive/20 hover:bg-destructive/5"
                    onClick={() => {
                      setSelectedBrand("");
                      setManualBrand("");
                      setSelectedModel("");
                      setManualModel("");
                      setSelectedYear("");
                      setSelectedCategory("");
                      setSelectedPart("");
                      setManualPart("");
                      setSelectedCondition("");
                      setSearchQuery("");
                    }}
                  >
                    إعادة ضبط الفلاتر
                  </Button>
                </CardContent>
              </Card>
            </aside>

            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row-reverse justify-between items-center gap-4 bg-white p-4 rounded-3xl shadow-lg border-2 border-primary/5">
                <div className="flex items-center gap-2 text-sm font-black">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                    {filteredProducts.length}
                  </span> 
                  إعلان متاح
                </div>
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input 
                    placeholder="بحث في النتائج..." 
                    className="pr-12 h-12 text-right rounded-2xl border-2 focus:border-secondary transition-all" 
                    dir="rtl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border-4 border-dashed border-primary/5">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                    <Search size={48} className="text-muted-foreground opacity-20" />
                  </div>
                  <h3 className="text-2xl font-black text-primary mb-2">عذراً، لم نجد نتائج تطابق بحثك</h3>
                  <p className="text-muted-foreground font-bold">حاول تغيير ماركة السيارة أو سنة الصنع.</p>
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
