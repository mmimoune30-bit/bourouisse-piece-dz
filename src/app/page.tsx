
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
  Package
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

  const featuredStoresList = useMemo(() => {
    return (allCampaigns || [])
      .filter(c => c.tier === "Featured" && c.status === "Active" && c.startDate <= today && c.endDate >= today)
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
    featured: { AR: "متاجر مميزة", EN: "Featured Stores", FR: "Boutiques Vedettes" },
    latest: { AR: "أحدث قطع الغيار المضافة", EN: "Latest Parts", FR: "Pièces Récentes" },
    recommended: { AR: "منتجات موصى بها", EN: "Recommended", FR: "Recommandés" },
    viewAll: { AR: "عرض الكل", EN: "View All", FR: "Voir Tout" },
    browseCatalog: { AR: "تصفح الكتالوج", EN: "Browse Catalog", FR: "Parcourir" },
    noAds: { AR: "لا توجد إعلانات حصرية حالياً.", EN: "No ads.", FR: "Aucune pub." },
    noFeatured: { AR: "لا توجد متاجر مميزة حالياً.", EN: "No featured.", FR: "Aucune boutique." },
    sellerAd: { AR: "سجل متجرك الآن", EN: "Register your store", FR: "Ouvrez votre boutique" },
    buyerAd: { AR: "سجل معنا و اشتري سلعتك بطريقة احترافية", EN: "Buy professionally with us", FR: "Achetez avec professionnalisme" },
    regSeller: { AR: "سجل كبائع", EN: "Seller Register", FR: "Vendeur" },
    regBuyer: { AR: "سجل كمشتري", EN: "Buyer Register", FR: "Acheteur" },
    categories: { AR: "تصنيفات قطع الغيار", EN: "Categories", FR: "Catégories" }
  };

  const titleFont = lang === 'AR' ? 'font-black' : 'font-medium';
  const buttonFont = lang === 'AR' ? 'font-black' : 'font-medium';
  const normalFont = lang === 'AR' ? 'font-bold' : 'font-normal';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-[175px] md:pt-[175px]">
        {/* Compact Hero Section */}
        <section className="w-full px-1 mt-1">
          <div className={cn("flex flex-col lg:flex-row gap-1", lang === 'AR' ? "lg:flex-row-reverse" : "lg:flex-row")} dir={lang === 'AR' ? "rtl" : "ltr"}>
            
            <div className="lg:w-3/4 h-[180px] md:h-[220px] bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative border">
              <div 
                dir={lang === 'AR' ? "rtl" : "ltr"}
                className={cn("bg-zinc-100 px-3 py-1.5 border-b flex items-center justify-between z-20 shrink-0", lang === 'AR' ? "flex-row" : "flex-row-reverse")}
              >
                 <h2 className={cn("text-sm md:text-base text-black flex items-center gap-1.5 uppercase", titleFont)}>
                   <Crown size={16} className="text-secondary fill-secondary" /> {t.exclusive[lang]}
                 </h2>
                 <Link href="/catalog" className={cn("text-sm md:text-base text-black hover:underline uppercase", titleFont)}>{t.viewAll[lang]}</Link>
              </div>
              <div className="flex-grow relative overflow-hidden">
                {loadingCampaigns ? (
                  <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : exclusiveStores?.length > 0 ? (
                  <Carousel setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="h-full">
                    <CarouselContent className="h-full">
                      {exclusiveStores.map((campaign, i) => (
                        <CarouselItem key={i} className="h-full">
                          <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} onClick={() => handleStoreClick(campaign.id)} className="w-full h-full flex items-center gap-4 px-4 md:px-8 hover:bg-zinc-50/50 transition-colors">
                            <div className="w-16 h-16 md:w-28 md:h-28 rounded-xl overflow-hidden relative border shadow-sm shrink-0">
                               <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt="" fill className="object-cover" />
                            </div>
                            <div className={cn("flex flex-col gap-1", lang === 'AR' ? "text-right" : "text-left")}>
                               <Badge className={cn("bg-secondary text-black text-[8px] md:text-[10px] w-fit", titleFont)}>👑 {lang === 'AR' ? 'حصري' : 'EXCL'}</Badge>
                               <h3 className={cn("text-xl md:text-3xl text-black line-clamp-1 uppercase leading-tight", titleFont)}>{campaign.storeName}</h3>
                               <p className={cn("text-[10px] md:text-sm text-black flex items-center gap-1", normalFont)}><MapPin size={12} className="text-secondary" /> {campaign.storeLocation}</p>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <div className={cn("absolute inset-0 flex items-center justify-center text-zinc-400 text-[10px] italic", titleFont)}>{t.noAds[lang]}</div>
                )}
              </div>
            </div>

            <div className="lg:w-1/4 h-[180px] md:h-[220px] relative rounded-lg overflow-hidden bg-zinc-900 border">
              <Image src="https://picsum.photos/seed/auto-hero-compact/1200/800" alt="" fill className="object-cover opacity-40" />
              <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="h-full relative z-10">
                <CarouselContent className="h-full">
                  <CarouselItem className="h-full flex flex-col items-center justify-center p-4 space-y-2 text-center">
                      <h3 className={cn("text-xs md:text-sm text-white uppercase leading-tight", titleFont)}>{t.sellerAd[lang]}</h3>
                      <Link href="/seller/register" className="w-full"><Button className={cn("w-full h-10 bg-secondary text-black text-[10px] md:text-xs rounded-md uppercase", buttonFont)}>{t.regSeller[lang]}</Button></Link>
                  </CarouselItem>
                  <CarouselItem className="h-full flex flex-col items-center justify-center p-4 space-y-2 text-center">
                      <h3 className={cn("text-[10px] md:text-xs text-white uppercase leading-tight", titleFont)}>{t.buyerAd[lang]}</h3>
                      <Link href="/buyer/register" className="w-full"><Button variant="outline" className={cn("w-full h-10 border-white text-white text-[10px] md:text-xs rounded-md uppercase", buttonFont)}>{t.regBuyer[lang]}</Button></Link>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="px-1 py-1">
          <div 
            dir={lang === 'AR' ? "rtl" : "ltr"}
            className="bg-zinc-100 px-3 py-1.5 flex items-center mb-1.5 border-b border-black/5"
          >
             <h2 className={cn("text-sm md:text-base text-black flex items-center gap-1.5 uppercase", titleFont)}>
                {t.categories[lang]} <Tags size={18} className="text-secondary" />
             </h2>
          </div>
          <div className="flex flex-row justify-center gap-1.5 overflow-x-auto pb-1 no-scrollbar" dir={lang === 'AR' ? "rtl" : "ltr"}>
            {PART_CATEGORIES.map((cat, i) => (
              <Link key={i} href={`/catalog?category=${encodeURIComponent(cat.en)}`} className="shrink-0">
                <span className={cn("text-xs md:text-sm text-black bg-white px-3 py-1.5 rounded-lg border hover:border-secondary transition-all block shadow-sm uppercase whitespace-nowrap", titleFont)}>
                  {lang === 'AR' ? cat.ar : lang === 'EN' ? cat.en : cat.fr}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Stores Section */}
        <section className="px-1 py-1">
          <div 
            dir={lang === 'AR' ? "rtl" : "ltr"}
            className={cn("bg-zinc-100 px-3 py-1.5 flex items-center justify-between mb-1 border-b border-black/5", lang === 'AR' ? "flex-row" : "flex-row-reverse")}
          >
              <h2 className={cn("text-sm md:text-base text-black flex items-center gap-1 uppercase", titleFont)}>
                {t.featured[lang]} <Star size={16} className="fill-black" />
              </h2>
              <Link href="/catalog" className={cn("text-sm md:text-base text-black hover:underline uppercase", titleFont)}>{t.viewAll[lang]}</Link>
          </div>
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-1" dir={lang === 'AR' ? "rtl" : "ltr"}>
              {loadingCampaigns ? (
                Array.from({ length: 8 }).map((_, i) => <CarouselItem key={i} className="pl-1 basis-1/5 sm:basis-1/8 lg:basis-1/12"><div className="h-10 bg-zinc-100 rounded-lg animate-pulse" /></CarouselItem>)
              ) : featuredStoresList?.length > 0 ? (
                featuredStoresList.map((campaign, i) => (
                  <CarouselItem key={i} className="pl-1 basis-1/4 sm:basis-1/6 lg:basis-1/10 xl:basis-[8%]">
                    <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} className="bg-white p-1 rounded-md border hover:border-black transition-all block text-center space-y-0.5">
                       <div className="w-10 h-10 mx-auto rounded-sm overflow-hidden relative border shadow-xs">
                         <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt="" fill className="object-cover" />
                       </div>
                       <h4 className={cn("text-black text-[8px] truncate uppercase", titleFont)}>{campaign.storeName}</h4>
                    </Link>
                  </CarouselItem>
                ))
              ) : (
                <div className={cn("py-2 text-center text-zinc-400 text-[10px] italic w-full", titleFont)}>{t.noFeatured[lang]}</div>
              )}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Latest Parts Grid */}
        <section className="px-1 py-1">
          <div 
            dir={lang === 'AR' ? "rtl" : "ltr"}
            className={cn("bg-zinc-100 px-3 py-1.5 flex items-center justify-between mb-2 border-b-2 border-black/10", lang === 'AR' ? "flex-row" : "flex-row-reverse")}
          >
             <h2 className={cn("text-sm md:text-base text-black flex items-center gap-1.5 uppercase", titleFont)}>
                {t.latest[lang]} <Package size={20} />
             </h2>
             <Link href="/catalog" className={cn("text-sm md:text-base text-black hover:underline uppercase", titleFont)}>{t.viewAll[lang]}</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2" dir={lang === 'AR' ? "rtl" : "ltr"}>
            {loadingExplore ? (
               Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-60 bg-zinc-100 rounded-xl animate-pulse" />)
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
               <div className={cn("col-span-full py-8 text-center text-zinc-400 text-xs italic uppercase", titleFont)}>Aucune pièce disponible</div>
            )}
          </div>
        </section>

        {/* Featured Products Section - Dark */}
        {activeFeaturedProducts && activeFeaturedProducts.length > 0 && (
          <section className="w-full px-1 py-3 bg-zinc-900 text-white rounded-t-2xl mt-4">
            <div 
              dir={lang === 'AR' ? "rtl" : "ltr"}
              className={cn("flex items-center justify-between mb-3 border-b border-white/10 pb-1 px-1", lang === 'AR' ? "flex-row" : "flex-row-reverse")}
            >
                <h2 className={cn("text-sm md:text-lg flex items-center gap-2 text-secondary uppercase", titleFont)}>
                   {t.recommended[lang]} <Zap size={18} fill="currentColor" />
                </h2>
                <Link href="/catalog"><Button variant="outline" size="sm" className={cn("h-8 border-white/20 text-white text-sm rounded-md uppercase", buttonFont)}>{t.viewAll[lang]}</Button></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2" dir={lang === 'AR' ? "rtl" : "ltr"}>
              {activeFeaturedProducts.map((p) => (
                <ProductCard key={p.id} id={p.productId} name={p.productName} price={p.productPrice} image={p.productImage} seller={p.sellerName} category={lang === 'AR' ? 'مميز' : 'Featured'} condition="New" />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
