"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Crown, 
  Loader2, 
  Tags, 
  Search,
  Zap,
  ShoppingBag,
  Package,
  LayoutGrid,
  ChevronRight
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, updateDoc, doc, increment, orderBy, limit } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import { cn } from "@/lib/utils";

const defaultCategoryImages: Record<string, string> = {
  'Engine': 'https://picsum.photos/seed/engine/150/150',
  'Gearbox': 'https://picsum.photos/seed/gearbox/150/150',
  'Body': 'https://picsum.photos/seed/bodywork/150/150',
  'Electrical': 'https://picsum.photos/seed/electrical/150/150',
  'Suspension': 'https://picsum.photos/seed/suspension/150/150',
  'Brakes': 'https://picsum.photos/seed/brakes/150/150',
  'Cooling': 'https://picsum.photos/seed/radiator/150/150',
  'Fuel': 'https://picsum.photos/seed/fuel/150/150',
  'Exhaust': 'https://picsum.photos/seed/exhaust/150/150',
  'Wheels & Tires': 'https://picsum.photos/seed/wheels/150/150',
  'Interior': 'https://picsum.photos/seed/interior/150/150',
  'Accessories': 'https://picsum.photos/seed/accessories/150/150',
  'Lighting': 'https://picsum.photos/seed/lighting/150/150'
};

export default function Home() {
  const { firestore } = useFirestore();
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");
  const [api, setApi] = useState<CarouselApi>();
  
  const { data: categoryImagesData } = useCollection(
    firestore ? collection(firestore, "category_images") : null
  );

  const categoryImagesMap = useMemo(() => {
    const map: Record<string, string> = {};
    categoryImagesData?.forEach(item => {
      map[item.name_en] = item.imageUrl;
    });
    return map;
  }, [categoryImagesData]);

  const featuredStoresQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "featured_stores");
  }, [firestore]);

  const featuredProductsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "featured_products");
  }, [firestore]);

  const allListingsExploreQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "listings"),
      where("status", "==", "Active"),
      orderBy("createdAt", "desc"),
      limit(12)
    );
  }, [firestore]);

  const { data: allCampaigns, loading: loadingCampaigns } = useCollection(featuredStoresQuery);
  const { data: featuredProducts } = useCollection(featuredProductsQuery);
  const { data: exploreListings, loading: loadingExplore } = useCollection(allListingsExploreQuery);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const exclusiveStores = useMemo(() => {
    return (allCampaigns || [])
      .filter(c => c.tier === "Exclusive" && c.status === "Active" && c.startDate <= today && c.endDate >= today)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }, [allCampaigns, today]);

  const activeFeaturedProducts = useMemo(() => {
    return (featuredProducts || [])
      .filter(p => p.startDate <= today && p.endDate >= today)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }, [featuredProducts, today]);

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const handleStoreClick = (campaignId: string) => {
    if (firestore) updateDoc(doc(firestore, "featured_stores", campaignId), { "stats.clicks": increment(1) });
  };

  const t = {
    exclusive: { AR: "متاجر حصرية", EN: "Exclusive Stores", FR: "Boutiques Exclusives" },
    featured: { AR: "منتجات مميزة", EN: "Featured Products", FR: "Produits Vedettes" },
    latest: { AR: "أحدث قطع الغيار المضافة", EN: "Latest Parts", FR: "Pièces Récentes" },
    recommended: { AR: "منتجات موصى بها", EN: "Recommended", FR: "Recommandés" },
    viewAll: { AR: "عرض الكل", EN: "View All", FR: "Voir Tout" },
    categories: { AR: "تصنيفات قطع الغيار", EN: "Categories", FR: "Catégories" }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-[190px] md:pt-[210px] pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Hero & Exclusive Section */}
          <section className="w-full">
            <div className={cn("flex flex-col lg:flex-row gap-4", lang === 'AR' ? "lg:flex-row-reverse" : "lg:flex-row")}>
              
              <div className="lg:w-3/4 h-[220px] md:h-[300px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
                <div 
                  dir={lang === 'AR' ? "rtl" : "ltr"}
                  className={cn("px-6 py-3 border-b flex items-center justify-between z-20 shrink-0 bg-white", lang === 'AR' ? "flex-row" : "flex-row-reverse")}
                >
                   <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                     <Crown size={20} className="text-secondary fill-secondary" /> {t.exclusive[lang]}
                   </h2>
                   <Link href="/catalog" className="text-sm font-semibold text-secondary hover:underline flex items-center gap-1 uppercase">
                     {t.viewAll[lang]} <ChevronRight size={14} className={lang === 'AR' ? 'rotate-180' : ''} />
                   </Link>
                </div>
                <div className="flex-grow relative">
                  {loadingCampaigns ? (
                    <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                  ) : exclusiveStores?.length > 0 ? (
                    <Carousel setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="h-full">
                      <CarouselContent className="h-full">
                        {exclusiveStores.map((campaign, i) => (
                          <CarouselItem key={i} className="h-full">
                            <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} onClick={() => handleStoreClick(campaign.id)} className="w-full h-full flex items-center gap-8 px-8 md:px-16 hover:bg-slate-50 transition-colors">
                              <div className="w-24 h-24 md:w-40 md:h-40 rounded-2xl overflow-hidden relative border-4 border-white shadow-lg shrink-0 group">
                                 <Image 
                                  src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} 
                                  alt="" 
                                  fill 
                                  className="object-cover transition-transform group-hover:scale-110" 
                                  sizes="(max-width: 768px) 100px, 200px"
                                  priority={i === 0}
                                 />
                              </div>
                              <div className={cn("flex flex-col gap-2", lang === 'AR' ? "text-right" : "text-left")}>
                                 <Badge className="bg-secondary text-primary text-[10px] w-fit font-black rounded-sm">👑 {lang === 'AR' ? 'متجر حصري' : 'EXCLUSIVE'}</Badge>
                                 <h3 className="text-2xl md:text-5xl font-black text-gray-900 line-clamp-1 uppercase leading-tight">{campaign.storeName}</h3>
                                 <p className="text-xs md:text-lg text-gray-500 flex items-center gap-1.5 font-medium"><MapPin size={18} className="text-secondary" /> {campaign.storeLocation}</p>
                              </div>
                            </Link>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm italic">لا توجد إعلانات حصرية حالياً.</div>
                  )}
                </div>
              </div>

              <div className="lg:w-1/4 h-[220px] md:h-[300px] relative rounded-xl overflow-hidden bg-gray-900 border border-gray-100 shadow-sm group">
                <Image 
                  src="https://picsum.photos/seed/auto-hero-promo/400/300" 
                  alt="" 
                  fill 
                  className="object-cover opacity-30 transition-opacity group-hover:opacity-40" 
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
                <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 6000 })]} className="h-full relative z-10">
                  <CarouselContent className="h-full">
                    <CarouselItem className="h-full flex flex-col items-center justify-center p-8 space-y-6 text-center">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-white uppercase leading-tight">حول عملك إلى احترافي</h3>
                          <p className="text-xs text-gray-300 font-medium">ابدأ البيع في أقل من 5 دقائق</p>
                        </div>
                        <Link href="/seller/register" className="w-full"><Button className="w-full h-12 bg-secondary text-primary font-bold rounded-xl uppercase shadow-lg">سجل كبائع</Button></Link>
                    </CarouselItem>
                    <CarouselItem className="h-full flex flex-col items-center justify-center p-8 space-y-6 text-center">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-white uppercase leading-tight">سجل واشترِ بطريقة احترافية</h3>
                          <p className="text-xs text-gray-300 font-medium">تواصل مباشر مع بائعي الـ 58 ولاية</p>
                        </div>
                        <Link href="/buyer/register" className="w-full"><Button variant="outline" className="w-full h-12 border-2 border-white/20 text-white font-bold rounded-xl uppercase hover:bg-white hover:text-black">سجل كمشتري</Button></Link>
                    </CarouselItem>
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="space-y-6">
            <div className={cn("flex items-center justify-between", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                {t.categories[lang]} <LayoutGrid size={24} className="text-secondary" />
              </h2>
            </div>
            <div className="flex flex-row justify-between gap-4 overflow-x-auto pb-4 no-scrollbar" dir={lang === 'AR' ? "rtl" : "ltr"}>
              {PART_CATEGORIES.map((cat, i) => {
                const categoryImage = categoryImagesMap[cat.en] || defaultCategoryImages[cat.en] || `https://picsum.photos/seed/cat-${i}/150/150`;
                return (
                  <div key={i} className="shrink-0 group">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border border-gray-100 shadow-sm relative bg-white pointer-events-none transition-transform group-hover:scale-105">
                        <Image 
                          src={categoryImage} 
                          alt={cat.ar} 
                          fill 
                          className="object-cover" 
                          sizes="150px"
                          loading="lazy"
                        />
                      </div>
                      <Link 
                        href={`/catalog?category=${cat.en}`}
                        className="text-sm sm:text-base font-semibold text-gray-800 hover:text-secondary transition-colors text-center uppercase tracking-tight"
                      >
                        {lang === 'AR' ? cat.ar : lang === 'EN' ? cat.en : cat.fr}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Featured Products Section */}
          <section className="space-y-6">
            <div className={cn("flex items-center justify-between", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                {t.featured[lang]} <Zap size={24} className="text-secondary fill-secondary" />
              </h2>
              <Link href="/catalog" className="text-sm font-semibold text-secondary hover:underline uppercase flex items-center gap-1">
                {t.viewAll[lang]} <ChevronRight size={14} className={lang === 'AR' ? 'rotate-180' : ''} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" dir={lang === 'AR' ? "rtl" : "ltr"}>
              {activeFeaturedProducts && activeFeaturedProducts.length > 0 ? (
                activeFeaturedProducts.slice(0, 12).map((p, i) => (
                  <ProductCard 
                    key={i}
                    id={p.productId} 
                    name={p.productName} 
                    price={p.productPrice} 
                    image={p.productImage} 
                    seller={p.sellerName} 
                    category={lang === 'AR' ? 'قطعة مميزة' : 'FEATURED'} 
                    condition="New" 
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-400 text-sm italic">لا توجد منتجات مميزة حالياً.</div>
              )}
            </div>
          </section>

          {/* Latest Listings Section */}
          <section className="space-y-6">
            <div className={cn("flex items-center justify-between", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                {t.latest[lang]} <Package size={24} className="text-secondary" />
              </h2>
              <Link href="/catalog" className="text-sm font-semibold text-secondary hover:underline uppercase flex items-center gap-1">
                {t.viewAll[lang]} <ChevronRight size={14} className={lang === 'AR' ? 'rotate-180' : ''} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" dir={lang === 'AR' ? "rtl" : "ltr"}>
              {loadingExplore ? (
                 Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-[4/5] bg-gray-200 rounded-xl animate-pulse" />)
              ) : exploreListings?.length > 0 ? (
                 exploreListings.map((product) => (
                   <ProductCard 
                      key={product.id} 
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.images?.[0] || `https://picsum.photos/seed/${product.id}/400/300`}
                      category={product.category}
                      seller={product.sellerName}
                      condition={product.condition === 'new' ? 'New' : 'Used'}
                      createdAt={product.createdAt}
                   />
                 ))
              ) : (
                 <div className="col-span-full py-16 text-center text-gray-400 text-sm italic uppercase">Aucune pièce disponible</div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
