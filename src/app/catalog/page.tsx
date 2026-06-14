
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Suspense, useMemo } from "react";

const ALL_PRODUCTS = [
  { id: "p1", name: "كتلة محرك V8 دقيقة", price: 450000, image: PlaceHolderImages[0].imageUrl, category: "قطع المحرك", seller: "EliteMotors DZ", condition: "New" as const },
  { id: "p2", name: "طقم فرامل سيراميك كربون", price: 120000, image: PlaceHolderImages[1].imageUrl, category: "الفرامل", seller: "SpeedHub Algiers", condition: "New" as const },
  { id: "p3", name: "إطارات الطرق الوعرة (طقم 4)", price: 85000, image: PlaceHolderImages[2].imageUrl, category: "الإطارات", seller: "DesertRoad Parts", condition: "New" as const },
  { id: "p4", name: "بطارية سيارة 12 فولت شديدة التحمل", price: 18500, image: PlaceHolderImages[3].imageUrl, category: "الكهرباء", seller: "Energy Dz", condition: "New" as const },
  { id: "p5", name: "شاحن توربيني GT20", price: 85000, image: PlaceHolderImages[5].imageUrl, category: "قطع المحرك", seller: "Turbo Dz", condition: "New" as const },
  { id: "p6", name: "ناقل حركة أوتوماتيكي", price: 150000, image: PlaceHolderImages[6].imageUrl, category: "ناقل الحركة", seller: "GearBox Master", condition: "Used" as const },
  { id: "p7", name: "أضواء LED أمامية", price: 18000, image: PlaceHolderImages[2].imageUrl, category: "الكهرباء", seller: "Light Dz", condition: "New" as const },
  { id: "p8", name: "مضخة وقود أصلية", price: 32000, image: PlaceHolderImages[0].imageUrl, category: "قطع المحرك", seller: "Fuel Parts", condition: "New" as const },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const filteredProducts = useMemo(() => {
    if (!categoryFilter) return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter(p => p.category === categoryFilter || categoryFilter === "all");
  }, [categoryFilter]);

  const categories = ["قطع المحرك", "ناقل الحركة", "الكهرباء", "الفرامل", "الإطارات"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 space-y-6">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="font-bold text-lg">تصفية النتائج</h3>
                    <Filter size={18} className="text-secondary" />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-black">الفئات</Label>
                    <div className="space-y-2">
                      {categories.map((cat, i) => (
                        <div key={i} className="flex items-center justify-end gap-2">
                          <Label htmlFor={`cat-${i}`} className="text-sm cursor-pointer">{cat}</Label>
                          <Checkbox id={`cat-${i}`} checked={categoryFilter === cat} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-sm font-black">الحالة</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-end gap-2">
                        <Label htmlFor="cond-new" className="text-sm cursor-pointer">جديد</Label>
                        <Checkbox id="cond-new" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Label htmlFor="cond-used" className="text-sm cursor-pointer">مستعمل</Label>
                        <Checkbox id="cond-used" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full font-bold">تطبيق الفلاتر</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary p-6 rounded-2xl text-white text-right space-y-4">
                <h4 className="font-bold text-sm text-secondary">إعلان ممول</h4>
                <p className="text-xs text-blue-100/70">احصل على قطع غيار أصلية بضمان يصل إلى سنة كاملة.</p>
                <Button variant="secondary" size="sm" className="w-full font-bold">اكتشف المزيد</Button>
              </div>
            </aside>

            {/* Main Products Grid */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row-reverse justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-border">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <span className="text-primary">{filteredProducts.length}</span> إعلان متاح
                  {categoryFilter && categoryFilter !== "all" && (
                    <span className="bg-secondary/20 text-primary px-3 py-1 rounded-full text-[10px] mr-2">
                      {categoryFilter}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-48 hidden sm:block">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input placeholder="ابحث في النتائج..." className="pr-10 h-10 text-right" dir="rtl" />
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 font-bold">
                    <ArrowUpDown size={14} /> ترتيب
                  </Button>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed">
                  <Search size={48} className="text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-xl font-bold text-primary">لا توجد نتائج مطابقة</h3>
                  <p className="text-muted-foreground">حاول تغيير الفلاتر أو البحث عن كلمة أخرى.</p>
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
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
