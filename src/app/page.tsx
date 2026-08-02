
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
  LayoutGrid
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, updateDoc, doc, increment, orderBy, limit } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import { cn } from "@/lib/utils";

export default function Home() {
  const { firestore } = useFirestore();
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");
  const [api, setApi] = useState<CarouselApi>();
  
  // جلب الصور المخصصة للتصنيفات
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
    latest: { AR: "أحدث قطع الغيار المضافة", EN: "Latest Parts", FR: "Pièces الرécentes" },
    recommended: { AR: "منتجات موصى بها", EN: "Recommended", FR: "Recommandés" },
    viewAll: { AR: "عرض الكل", EN: "View All", FR: "Voir Tout" },
    browseCatalog: { AR: "تصفح الكتالوج", EN: "Browse Catalog", FR: "Parcourir" },
    noAds: { AR: "لا توجد إعلانات حصرية حالياً.", EN: "No ads.", FR: "Aucune pub." },
    noFeatured: { AR: "لا توجد منتجات مميزة حالياً.", EN: "No featured products.", FR: "Aucun produit vedette." },
    sellerAd: { AR: "حول عملك إلى احترافي", EN: "Register your store", FR: "Ouvrez votre boutique" },
    buyerAd: { AR: "سجل واشترِ بطريقة احترافية", EN: "Buy professionally with us", FR: "Achetez avec professionnalisme" },
    regSeller: { AR: "سجل كبائع", EN: "Seller Register", FR: "Vendeur" },
    regBuyer: { AR: "سجل كمشتري", EN: "Buyer Register", FR: "Acheteur" },
    categories: { AR: "تصنيفات قطع الغيار", EN: "Categories", FR: "Catégories" }
  };

  const titleFont = lang === 'AR' ? 'font-black' : 'font-black';
  const buttonFont = lang === 'AR' ? 'font-black' : 'font-bold';
  const normalFont = lang === 'AR' ? 'font-bold' : 'font-medium';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-[190px] md:pt-[210px]">
        {/* Compact Hero Section */}
        <section className="w-full px-1 mt-1">
          <div className={cn("flex flex-col lg:flex-row gap-1", lang === 'AR' ? "lg:flex-row-reverse" : "lg:flex-row")} dir={lang === 'AR' ? "rtl" : "ltr"}>
            
            <div className="lg:w-3/4 h-[180px] md:h-[240px] bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative border-2 border-primary/5">
              <div 
                dir={lang === 'AR' ? "rtl" : "ltr"}
                className={cn("bg-zinc-100/80 px-4 py-2 border-b flex items-center justify-between z-20 shrink-0 backdrop-blur-sm", lang === 'AR' ? "flex-row" : "flex-row-reverse")}
              >
                 <h2 className={cn("text-xs md:text-sm text-primary flex items-center gap-2 uppercase tracking-tight", titleFont)}>
                   <Crown size={14} className="text-secondary fill-secondary" /> {t.exclusive[lang]}
                 </h2>
                 <Link href="/catalog" className={cn("text-[10px] md:text-xs text-primary hover:text-secondary transition-colors uppercase", titleFont)}>{t.viewAll[lang]}</Link>
              </div>
              <div className="flex-grow relative overflow-hidden">
                {loadingCampaigns ? (
                  <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : exclusiveStores?.length > 0 ? (
                  <Carousel setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="h-full">
                    <CarouselContent className="h-full">
                      {exclusiveStores.map((campaign, i) => (
                        <CarouselItem key={i} className="h-full">
                          <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} onClick={() => handleStoreClick(campaign.id)} className="w-full h-full flex items-center gap-6 px-6 md:px-12 hover:bg-zinc-50/50 transition-colors">
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl overflow-hidden relative border-4 border-white shadow-xl shrink-0 group">
                               <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt="" fill className="object-cover transition-transform group-hover:scale-110" />
                            </div>
                            <div className={cn("flex flex-col gap-1.5", lang === 'AR' ? "text-right" : "text-left")}>
                               <Badge className={cn("bg-secondary text-primary text-[8px] md:text-[9px] w-fit font-black rounded-sm")}>👑 {lang === 'AR' ? 'متجر حصري' : 'EXCLUSIVE STORE'}</Badge>
                               <h3 className={cn("text-xl md:text-4xl text-primary line-clamp-1 uppercase leading-tight", titleFont)}>{campaign.storeName}</h3>
                               <p className={cn("text-[10px] md:text-sm text-zinc-600 flex items-center gap-1.5", normalFont)}><MapPin size={14} className="text-secondary" /> {campaign.storeLocation}</p>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <div className={cn("absolute inset-0 flex items-center justify-center text-zinc-400 text-xs italic", normalFont)}>{t.noAds[lang]}</div>
                )}
              </div>
            </div>

            <div className="lg:w-1/4 h-[180px] md:h-[240px] relative rounded-lg overflow-hidden bg-zinc-950 border-2 border-primary/5 group">
              <Image src="https://picsum.photos/seed/auto-hero-premium/1200/800" alt="" fill className="object-cover opacity-30 transition-opacity group-hover:opacity-40" />
              <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 6000 })]} className="h-full relative z-10">
                <CarouselContent className="h-full">
                  <CarouselItem className="h-full flex flex-col items-center justify-center p-6 space-y-4 text-center">
                      <div className="space-y-1">
                        <h3 className={cn("text-sm md:text-base text-white uppercase leading-tight", titleFont)}>{t.sellerAd[lang]}</h3>
                        <p className="text-[10px] text-zinc-400 font-medium">ابدأ البيع في أقل من 5 دقائق</p>
                      </div>
                      <Link href="/seller/register" className="w-full"><Button className={cn("w-full h-11 bg-secondary text-primary text-xs rounded-xl uppercase shadow-lg shadow-secondary/10", buttonFont)}>{t.regSeller[lang]}</Button></Link>
                  </CarouselItem>
                  <CarouselItem className="h-full flex flex-col items-center justify-center p-6 space-y-4 text-center">
                      <div className="space-y-1">
                        <h3 className={cn("text-sm md:text-base text-white uppercase leading-tight", titleFont)}>{t.buyerAd[lang]}</h3>
                        <p className="text-[10px] text-zinc-400 font-medium">تواصل مباشر مع بائعي الـ 58 ولاية</p>
                      </div>
                      <Link href="/buyer/register" className="w-full"><Button variant="outline" className={cn("w-full h-11 border-2 border-white/20 text-white text-xs rounded-xl uppercase hover:bg-white hover:text-black", buttonFont)}>{t.regBuyer[lang]}</Button></Link>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Categories Section (Enhanced Grid Layout) */}
        <section className="px-1 py-1">
          <div 
            dir={lang === 'AR' ? "rtl" : "ltr"}
            className="bg-zinc-100/50 px-4 py-2 flex items-center mb-2 border-b border-zinc-200"
          >
             <h2 className={cn("text-xs md:text-sm text-primary flex items-center gap-2 uppercase tracking-tight", titleFont)}>
                {t.categories[lang]} <LayoutGrid size={16} className="text-secondary" />
             </h2>
          </div>
          <div className="flex flex-row justify-center gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar" dir={lang === 'AR' ? "rtl" : "ltr"}>
            {PART_CATEGORIES.map((cat, i) => {
              const categoryImage = categoryImagesMap[cat.en] || `https://picsum.photos/seed/cat-${i}/200/200`;
              return (
                <Link key={i} href={`/catalog?category=${encodeURIComponent(cat.en)}`} className="shrink-0 group">
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-[28px] overflow-hidden border-2 border-white shadow-md group-hover:border-secondary group-hover:shadow-xl transition-all duration-300 relative bg-white">
                      <Image src={categoryImage} alt={cat.ar} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </div>
                    <span className={cn("text-[11px] md:text-sm text-zinc-800 uppercase tracking-tight text-center max-w-[90px] leading-tight px-1", titleFont)}>
                      {lang === 'AR' ? cat.ar : lang === 'EN' ? cat.en : cat.fr}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Products Section (Prominent Slider) */}
        <section className="px-1 py-1">
          <div 
            dir={lang === 'AR' ? "rtl" : "ltr"}
            className={cn("bg-zinc-100/50 px-4 py-2 flex items-center justify-between mb-2 border-b border-zinc-200", lang === 'AR' ? "flex-row" : "flex-row-reverse")}
          >
              <h2 className={cn("text-xs md:text-sm text-primary flex items-center gap-2 uppercase tracking-tight", titleFont)}>
                {t.featured[lang]} <Zap size={16} className="text-secondary fill-secondary" />
              </h2>
              <Link href="/catalog" className={cn("text-[10px] md:text-xs text-primary hover:text-secondary uppercase", titleFont)}>{t.viewAll[lang]}</Link>
          </div>
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-2" dir={lang === 'AR' ? "rtl" : "ltr"}>
              {activeFeaturedProducts && activeFeaturedProducts.length > 0 ? (
                activeFeaturedProducts.map((p, i) => (
                  <CarouselItem key={i} className="pl-2 basis-1/2 sm:basis-1/3 lg:basis-1/5 xl:basis-[18%]">
                    <ProductCard 
                      id={p.productId} 
                      name={p.productName} 
                      price={p.productPrice} 
                      image={p.productImage} 
                      seller={p.sellerName} 
                      category={lang === 'AR' ? 'قطعة مميزة' : 'FEATURED PART'} 
                      condition="New" 
                    />
                  </CarouselItem>
                ))
              ) : (
                <div className={cn("py-12 text-center text-zinc-400 text-xs italic w-full", normalFont)}>{t.noFeatured[lang]}</div>
              )}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Latest Parts Grid (High Density) */}
        <section className="px-1 py-2 mt-4 bg-white/40">
          <div 
            dir={lang === 'AR' ? "rtl" : "ltr"}
            className={cn("bg-primary px-5 py-3 flex items-center justify-between mb-3 rounded-xl shadow-lg", lang === 'AR' ? "flex-row" : "flex-row-reverse")}
          >
             <h2 className={cn("text-sm md:text-base text-secondary flex items-center gap-3 uppercase tracking-wider", titleFont)}>
                <Package size={20} className="text-secondary" /> {t.latest[lang]}
             </h2>
             <Link href="/catalog" className={cn("text-[11px] md:text-xs text-white hover:text-secondary transition-colors uppercase", titleFont)}>{t.viewAll[lang]}</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3" dir={lang === 'AR' ? "rtl" : "ltr"}>
            {loadingExplore ? (
               Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-zinc-100 rounded-2xl animate-pulse" />)
            ) : exploreListings?.length > 0 ? (
               exploreListings.map((product) => (
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
               <div className={cn("col-span-full py-16 text-center text-zinc-400 text-sm italic uppercase", normalFont)}>Aucune pièce disponible</div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
