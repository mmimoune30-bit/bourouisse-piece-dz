
"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search, Filter, Car, Settings, Fuel, AlertTriangle, Layers, ShieldCheck } from "lucide-react";
import { Suspense, useMemo, useState, useEffect } from "react";

// --- Data Constants ---
const BRAND_MODELS: Record<string, string[]> = {
  "Renault": ["Clio", "Symbol", "Megane", "Scenic", "Kangoo", "Express", "Laguna", "Fluence", "19", "21", "Master", "Trafic"],
  "Dacia": ["Logan", "Sandero", "Duster", "Dokker", "Lodgy", "Solenza"],
  "Peugeot": ["206", "207", "208", "301", "307", "308", "406", "407", "Partner", "Expert", "Boxer", "508"],
  "Citroën": ["C3", "C4", "C5", "Berlingo", "Xsara", "Saxo", "Jumper", "Jumpy"],
  "Fiat": ["Punto", "Doblo", "Panda", "Tipo", "500", "Ducato", "Fiorino", "Palio", "Uno"],
  "Volkswagen": ["Golf 4", "Golf 5", "Golf 6", "Golf 7", "Polo", "Passat", "Tiguan", "Touran", "Caddy"],
  "Audi": ["A3", "A4", "A5", "A6", "Q3", "Q5", "Q7"],
  "BMW": ["Série 1", "Série 3", "Série 5", "X1", "X3", "X5", "X6"],
  "Mercedes-Benz": ["Classe A", "Classe C", "Classe E", "Sprinter", "Vito", "Classe S", "ML"],
  "Opel": ["Corsa", "Astra", "Vectra", "Zafira", "Insignia", "Meriva"],
  "Hyundai": ["Accent", "i10", "i20", "Tucson", "Santa Fe", "Atos", "i30", "Elantra", "H1"],
  "Kia": ["Picanto", "Rio", "Cerato", "Sportage", "Sorento", "K2700"],
  "Toyota": ["Yaris", "Corolla", "Hilux", "Rav4", "Land Cruiser", "Avensis"],
  "Nissan": ["Micra", "Sunny", "Qashqai", "Navara", "Patrol", "X-Trail"],
  "Suzuki": ["Swift", "Alto", "Vitara", "Jimny", "Celerio", "Dzire"],
  "Hyundai-Truck": ["HD35", "HD65", "HD72", "HD120"],
  "Isuzu": ["D-Max", "NPR", "NQR"],
  "Chery": ["QQ", "Tiggo", "Fulwin", "Arrizo"],
  "Geely": ["Emgrand", "GX3", "GC6"],
  "JAC": ["J3", "J5", "S3", "T6", "1040"],
  "DFSK": ["Glory", "Mini Truck", "K01", "V21"],
  "Lada": ["Niva", "Granta", "Vesta"]
};

const CATEGORY_DATA: Record<string, string[]> = {
  "Moteur (المحرك)": ["Moteur complet", "Culasse", "Injecteurs", "Turbo", "Pompe à eau", "Radiateur", "Alternateur", "Démarreur", "Kit d'embrayage", "Courroie"],
  "Carrosserie (الهيكل)": ["Capot", "Pare-chocs", "Ailes", "Phares", "Feux", "Portières", "Coffre", "Rétroviseurs", "Pare-brise"],
  "Suspension et Direction (التوازي و التوازن)": ["Amortisseurs", "Triangles", "Crémaillère", "Rotules", "Cardans", "Disques de frein", "Plaquettes"],
  "Électricité (الكهرباء)": ["Batterie", "ECU (Cerveau)", "Faisceau", "Boîte à fusibles", "Capteurs", "Commodo"],
  "Accessoires (الأكسيسوارات)": ["Autoradio", "Tapis", "Housses", "Camيرا de recul", "Climatisation"]
};

const ALL_PRODUCTS = [
  { id: "p1", name: "كتلة محرك V8 BMW", price: 450000, image: PlaceHolderImages[0].imageUrl, category: "Moteur (المحرك)", partType: "Moteur complet", brand: "BMW", model: "X5", condition: "New" as const, listingType: "part", seller: "EliteMotors DZ" },
  { id: "p2", name: "طقم فرامل سيراميك", price: 120000, image: PlaceHolderImages[1].imageUrl, category: "Suspension et Direction (التوازي و التوازن)", partType: "Plaquettes", brand: "Audi", model: "A4", condition: "New" as const, listingType: "part", seller: "SpeedHub Algiers" },
  { id: "p3", name: "شاحن توربيني Mercedes", price: 280000, image: PlaceHolderImages[5].imageUrl, category: "Moteur (المحرك)", partType: "Turbo", brand: "Mercedes-Benz", model: "Classe C", condition: "Used" as const, listingType: "part", seller: "BenzParts Algiers" },
  { id: "v1", name: "Clio 4 للقطع", price: 850000, image: PlaceHolderImages[6].imageUrl, category: "مركبات خارج الخدمة", partType: "للقطع", brand: "Renault", model: "Clio", condition: "Damaged" as const, listingType: "accidented", seller: "Salvage Parts" },
  { id: "p4", name: "كمبيوتر محرك Hyundai Accent", price: 35000, image: PlaceHolderImages[0].imageUrl, category: "Électricité (الكهرباء)", partType: "ECU (Cerveau)", brand: "Hyundai", model: "Accent", condition: "Used" as const, listingType: "part", seller: "AutoElectro DZ" },
  { id: "p5", name: "مضخة بنزين Renault Symbol", price: 12000, image: PlaceHolderImages[4].imageUrl, category: "Moteur (المحرك)", partType: "Injecteurs", brand: "Renault", model: "Symbol", condition: "New" as const, listingType: "part", seller: "PiecePro Alger" },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  
  // States for hierarchical filters
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get("brand") || "");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  
  const [activeTab, setActiveTab] = useState<string>("all");
  const [damageFilter, setDamageFilter] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");

  // Update brand/category if URL changes
  useEffect(() => {
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    if (brand) setSelectedBrand(brand);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  const modelsList = useMemo(() => selectedBrand ? BRAND_MODELS[selectedBrand] || [] : [], [selectedBrand]);
  const partsList = useMemo(() => selectedCategory ? CATEGORY_DATA[selectedCategory] || [] : [], [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS;
    
    if (activeTab !== "all") result = result.filter(p => p.listingType === activeTab);
    if (selectedBrand) result = result.filter(p => p.brand === selectedBrand);
    if (selectedModel && selectedModel !== "all") result = result.filter(p => p.model === selectedModel);
    if (selectedCategory) result = result.filter(p => p.category.includes(selectedCategory));
    if (selectedPart && selectedPart !== "all") result = result.filter(p => p.partType === selectedPart);
    if (selectedCondition && selectedCondition !== "all") result = result.filter(p => p.condition === selectedCondition);
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return result;
  }, [activeTab, selectedBrand, selectedModel, selectedCategory, selectedPart, selectedCondition, searchQuery]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-6 mb-8">
            <div className="text-right">
              <h1 className="text-4xl font-black text-primary">الكتالوج الشامل</h1>
              <p className="text-muted-foreground font-bold">ابحث عن قطع الغيار بدقة متناهية</p>
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
            {/* Sidebar Filters */}
            <aside className="w-full md:w-80 space-y-6">
              <Card className="border-none shadow-xl sticky top-[250px]">
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="font-black text-xl text-primary">محرك البحث الدقيق</h3>
                    <Filter size={20} className="text-secondary" />
                  </div>

                  {/* Hierarchical Filter 1: Brand -> Model */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-black flex items-center justify-end gap-2">
                        <Car size={16} className="text-secondary" /> ماركة السيارة
                      </Label>
                      <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setSelectedModel(""); }}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الماركة" /></SelectTrigger>
                        <SelectContent>
                          {Object.keys(BRAND_MODELS).sort().map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-black">الموديل</Label>
                      <Select 
                        disabled={!selectedBrand} 
                        value={selectedModel} 
                        onValueChange={setSelectedModel}
                      >
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الموديل" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">كل الموديلات</SelectItem>
                          {modelsList.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="h-px bg-border my-2" />

                  {/* Hierarchical Filter 2: Category -> Part Type */}
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
                        onValueChange={setSelectedPart}
                      >
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر نوع القطعة" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">كل الأنواع</SelectItem>
                          {partsList.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="h-px bg-border my-2" />

                  {/* Filter 3: Condition */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black flex items-center justify-end gap-2">
                      <ShieldCheck size={16} className="text-secondary" /> حالة القطعة
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

                  <div className="space-y-4">
                    <Label className="text-sm font-black flex items-center justify-end gap-2">
                      <Fuel size={16} className="text-secondary" /> الوقود
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Essence", "Diesel", "GPL", "Hybride"].map(f => (
                        <Button key={f} variant="outline" size="sm" className="text-[10px] font-bold h-8">{f}</Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-sm font-black flex items-center justify-end gap-2 text-destructive">
                      <AlertTriangle size={16} /> نسبة التحطم (للمصدومة)
                    </Label>
                    <Slider value={[damageFilter]} max={100} onValueChange={(v) => setDamageFilter(v[0])} />
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                      <span>{damageFilter}%</span>
                      <span>0%</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full font-black h-12 text-destructive border-destructive/20 hover:bg-destructive/5"
                    onClick={() => {
                      setSelectedBrand("");
                      setSelectedModel("");
                      setSelectedCategory("");
                      setSelectedPart("");
                      setSelectedCondition("");
                    }}
                  >
                    إعادة ضبط الفلاتر
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Main Products Grid */}
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
                  <p className="text-muted-foreground font-bold">حاول تخفيف الفلاتر أو تغيير ماركة السيارة.</p>
                  <Button className="mt-8 font-black rounded-full px-10 h-12" onClick={() => {
                    setSelectedBrand("");
                    setSelectedModel("");
                    setSelectedCategory("");
                    setSelectedPart("");
                    setSelectedCondition("");
                    setSearchQuery("");
                  }}>عرض كافة الإعلانات</Button>
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
