"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search, Filter, SlidersHorizontal, ArrowUpDown, AlertTriangle, Car, Settings, Fuel } from "lucide-react";
import { Suspense, useMemo, useState } from "react";

const ALL_PRODUCTS = [
  { id: "p1", name: "كتلة محرك V8 دقيقة", price: 450000, image: PlaceHolderImages[0].imageUrl, category: "Moteur (المحرك)", seller: "EliteMotors DZ", condition: "New" as const, listingType: "part" },
  { id: "p2", name: "طقم فرامل سيراميك", price: 120000, image: PlaceHolderImages[1].imageUrl, category: "Carrosserie (الهيكل)", seller: "SpeedHub Algiers", condition: "New" as const, listingType: "part" },
  { id: "v1", name: "سيارة Renault Clio مصدومة", price: 850000, image: PlaceHolderImages[5].imageUrl, category: "مركبات خارج الخدمة", seller: "Salvage Parts", condition: "Damaged" as const, listingType: "accidented", brand: "Renault", fuelType: "Diesel", damagePercentage: 45 },
  { id: "v2", name: "VW Golf 7 للقطع", price: 1200000, image: PlaceHolderImages[4].imageUrl, category: "مركبات خارج الخدمة", seller: "GermanParts Dz", condition: "Damaged" as const, listingType: "for_parts", brand: "Volkswagen", fuelType: "Essence" },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [damageFilter, setDamageFilter] = useState<number>(100);

  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS;
    if (activeTab !== "all") {
      result = result.filter(p => p.listingType === activeTab);
    }
    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter(p => p.category === categoryFilter);
    }
    return result;
  }, [categoryFilter, activeTab]);

  const brands = ["Renault", "Peugeot", "Volkswagen", "Hyundai", "Dacia"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-6 mb-8">
            <h1 className="text-3xl font-black text-primary">الكتالوج الشامل</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full md:w-auto">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-white border">
                <TabsTrigger value="all" className="py-2 text-xs font-bold">الكل</TabsTrigger>
                <TabsTrigger value="part" className="py-2 text-xs font-bold">قطع منفردة</TabsTrigger>
                <TabsTrigger value="accidented" className="py-2 text-xs font-bold">مصدومة</TabsTrigger>
                <TabsTrigger value="for_parts" className="py-2 text-xs font-bold">للقطع</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col md:flex-row-reverse gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-72 space-y-6">
              <Card className="border-none shadow-sm sticky top-32">
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="font-bold text-lg">تصفية النتائج</h3>
                    <Filter size={18} className="text-secondary" />
                  </div>

                  {/* Vehicle Specific Filters */}
                  {(activeTab !== "part") && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="space-y-3">
                        <Label className="text-sm font-black flex items-center justify-end gap-2">
                          <Car size={16} /> الماركة
                        </Label>
                        <div className="grid grid-cols-1 gap-2">
                          {brands.map(b => (
                            <div key={b} className="flex items-center justify-end gap-2">
                              <Label className="text-xs cursor-pointer">{b}</Label>
                              <Checkbox />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t">
                        <Label className="text-sm font-black flex items-center justify-end gap-2">
                          <Fuel size={16} /> الوقود
                        </Label>
                        <div className="flex flex-wrap justify-end gap-2">
                          {["Essence", "Diesel", "GPL"].map(f => (
                            <Badge key={f} variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">{f}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <Label className="text-sm font-black flex items-center justify-end gap-2 text-destructive">
                          <AlertTriangle size={16} /> نسبة التحطم
                        </Label>
                        <Slider value={[damageFilter]} max={100} onValueChange={(v) => setDamageFilter(v[0])} />
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{damageFilter}%</span>
                          <span>0%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t">
                    <Label className="text-sm font-black">الولاية</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="كل الولايات" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">كل الولايات</SelectItem>
                        <SelectItem value="16">16 - الجزائر</SelectItem>
                        <SelectItem value="31">31 - وهران</SelectItem>
                        <SelectItem value="19">19 - سطيف</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full font-bold h-12">تطبيق الفلاتر</Button>
                </CardContent>
              </Card>
            </aside>

            {/* Main Products Grid */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row-reverse justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-border">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <span className="text-primary">{filteredProducts.length}</span> إعلان متاح
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input placeholder="بحث دقيق..." className="pr-10 h-11 text-right" dir="rtl" />
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed">
                  <Search size={48} className="text-muted-foreground mb-4 opacity-10" />
                  <h3 className="text-xl font-bold text-primary">لم نجد أي نتائج</h3>
                  <p className="text-muted-foreground text-sm">حاول تغيير الفلاتر أو نوع الإعلان.</p>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black">جاري التحميل...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: any, className?: string }) {
  return (
    <div className={`px-3 py-1 rounded-full border text-[10px] font-bold ${className}`}>
      {children}
    </div>
  );
}
