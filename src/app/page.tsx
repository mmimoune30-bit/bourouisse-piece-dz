
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
  ShieldCheck, 
  Star, 
  Store, 
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
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, where, updateDoc, doc, increment, orderBy, limit } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import SiteLogo from "@/components/site-logo";
import { cn } from "@/lib/utils";

export default function Home() {
  const { firestore } = useFirestore();
  const { profile } = useUser();
  const [lang, setLang] = useState<"AR" | "EN">("AR");
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
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const handleStoreClick = (campaignId: string) => {
    if (firestore) updateDoc(doc(firestore, "featured_stores", campaignId), { "stats.clicks": increment(1) });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-zinc-50">
      <Navbar />

      <main className="flex-grow pt-[170px] md:pt-[190px]">
        {/* Hero Section - Reduced Height to 220px */}
        <section className="w-full px-0.5 mt-1">
          <div className={cn("flex flex-col lg:flex-row-reverse gap-1.5", lang === 'AR' ? "lg:flex-row-reverse" : "lg:flex-row")} dir={lang === 'AR' ? "rtl" : "ltr"}>
            
            {/* Exclusive Stores Slider */}
            <div className="lg:w-3/4 h-[180px] lg:h-[220px] bg-white rounded-xl shadow-sm overflow-hidden flex flex-col relative border border-black/5">
              <div className="bg-zinc-50 px-4 py-1 border-b flex items-center justify-between z-20 shrink-0">
                 <h2 className="font-black text-[10px] md:text-xs text-black flex items-center gap-2 uppercase">
                   <Crown size={12} className="text-secondary fill-secondary" /> {lang === 'AR' ? 'متاجر حصرية' : 'Exclusive Stores'}
                 </h2>
                 <Link href="/catalog" className="text-[9px] md:text-[10px] font-black text-black hover:underline flex items-center gap-1 uppercase">
                    {lang === 'AR' ? 'تصفح الكل' : 'View All'} <ArrowLeft size={10} className={lang === 'EN' ? 'rotate-180' : ''} />
                 </Link>
              </div>
              <div className="flex-grow relative overflow-hidden">
                {loadingCampaigns ? (
                  <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-black" /></div>
                ) : exclusiveStores?.length > 0 ? (
                  <Carousel setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]} className="w-full h-full">
                    <CarouselContent className="h-full -ml-0">
                      {exclusiveStores.map((campaign, i) => (
                        <CarouselItem key={`exclusive-${campaign.id}-${i}`} className="h-full pl-0">
                          <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} onClick={() => handleStoreClick(campaign.id)} className="w-full h-full flex items-center gap-4 px-6 md:px-12 hover:bg-zinc-50/30 transition-colors py-2">
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl overflow-hidden relative border-2 border-zinc-100 shadow-sm shrink-0">
                               <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt={campaign.storeName} fill className="object-cover" />
                            </div>
                            <div className={cn("flex flex-col gap-1", lang === 'AR' ? "text-right" : "text-left")}>
                               <Badge className="bg-secondary text-black font-black text-[8px] md:text-[10px] w-fit">👑 {lang === 'AR' ? 'حصري' : 'EXCLUSIVE'}</Badge>
                               <h3 className="font-black text-xl md:text-3xl text-black line-clamp-1 uppercase">{campaign.storeName}</h3>
                               <p className={cn("text-xs md:text-sm text-black font-bold flex items-center gap-1", lang === 'AR' ? "justify-end" : "justify-start")}>
                                  <MapPin size={14} className="text-secondary" /> {campaign.storeLocation}
                                </p>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-black italic text-xs">
                    {lang === 'AR' ? 'لا توجد إعلانات حصرية حالياً.' : 'No exclusive ads at the moment.'}
                  </div>
                )}
              </div>
            </div>

            {/* Side Ads Carousel - Fixed Background, Rotating Text */}
            <div className="lg:w-1/4 h-[180px] lg:h-[220px] relative rounded-xl overflow-hidden shadow-sm bg-zinc-900 border border-black/5">
              {/* Static Background */}
              <Image 
                src="https://picsum.photos/seed/auto-hero-real/1200/800" 
                alt="Ad Background" 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-black/65 z-0" />
              
              {/* Rotating Content Only */}
              <Carousel 
                opts={{ loop: true }} 
                plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]} 
                className="w-full h-full relative z-10"
              >
                <CarouselContent className="h-full -ml-0">
                  {/* Slide 1: Seller Join */}
                  <CarouselItem key="side-ad-seller" className="h-full pl-0">
                    <div className="p-4 text-center text-white flex flex-col items-center justify-center h-full w-full space-y-2">
                      <h3 className="text-xs md:text-sm font-black leading-tight uppercase">
                        {lang === 'AR' ? 'اشترك معنا واعرض منتجاتك' : 'Join Us & Showcase Your Products'}
                      </h3>
                      <Link href="/seller/register" className="w-full px-4">
                        <Button className="w-full h-9 bg-secondary text-black font-black rounded-lg text-[10px] shadow-lg hover:bg-white transition-all uppercase">
                           {lang === 'AR' ? 'سجل كبائع' : 'Register as Seller'}
                        </Button>
                      </Link>
                    </div>
                  </CarouselItem>

                  {/* Slide 2: Buyer Join */}
                  <CarouselItem key="side-ad-buyer" className="h-full pl-0">
                    <div className="p-4 text-center text-white flex flex-col items-center justify-center h-full w-full space-y-2">
                      <h3 className="text-xs md:text-sm font-black leading-tight uppercase">
                        {lang === 'AR' ? 'سجل معنا و اشتري بطريقة احترافية' : 'Join Us & Buy Professionally'}
                      </h3>
                      <Link href="/buyer/register" className="w-full px-4">
                        <Button variant="outline" className="w-full h-9 border-2 border-white text-white hover:bg-white hover:text-black font-black rounded-lg text-[10px] shadow-lg transition-all uppercase">
                           {lang === 'AR' ? 'سجل كمشتري' : 'Register as Buyer'}
                        </Button>
                      </Link>
                    </div>
                  </CarouselItem>

                  {/* Slide 3: Full Site Logo */}
                  <CarouselItem key="side-ad-logo" className="h-full pl-0">
                    <div className="flex flex-col items-center justify-center h-full w-full p-4">
                        <SiteLogo brandClassName="text-white text-xs md:text-sm" subtextClassName="text-blue-100 text-[8px]" showTagline={false} />
                    </div>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="w-full px-0.5 py-4">
          <div className="flex flex-row-reverse justify-center items-center mb-4 px-2 border-b border-black/5 pb-2">
             <h2 className="text-sm md:text-base font-black text-black flex items-center gap-2 uppercase">
                {lang === 'AR' ? 'تصنيفات قطع الغيار' : 'Part Categories'} <Tags size={16} className="text-secondary" />
             </h2>
          </div>
          <div className="flex flex-row-reverse justify-center gap-3 overflow-x-auto pb-4 no-scrollbar px-2" dir={lang === 'AR' ? "rtl" : "ltr"}>
            {PART_CATEGORIES.map((cat, i) => (
              <div key={i} className="shrink-0">
                <Link href={`/catalog?category=${encodeURIComponent(cat.en)}`}>
                  <span className="font-black text-xs md:text-sm text-black bg-white px-4 md:px-6 py-2.5 rounded-xl border-2 border-zinc-100 hover:border-secondary hover:text-secondary hover:shadow-md transition-all block text-center shadow-sm whitespace-nowrap uppercase">
                    {lang === 'AR' ? cat.ar : cat.en}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Stores Section - Repositioned Above Latest Parts */}
        <section className="w-full px-0.5 py-2">
          <div className={cn("flex items-center justify-between mb-2 px-2 border-b border-black/10 pb-1", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
            <div className={cn("text-right w-full flex items-center gap-2", lang === 'AR' ? "justify-end" : "justify-start")}>
              <h2 className="text-xs md:text-sm font-black text-black flex items-center gap-2 uppercase">
                {lang === 'AR' ? 'متاجر مميزة' : 'Featured Stores'} <Star size={14} className="text-black fill-black" />
              </h2>
            </div>
          </div>
          
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-2" dir={lang === 'AR' ? "rtl" : "ltr"}>
              {loadingCampaigns ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <CarouselItem key={i} className="pl-2 basis-1/3 sm:basis-1/4 lg:basis-1/8">
                    <div className="h-14 bg-zinc-200 animate-pulse rounded-lg" />
                  </CarouselItem>
                ))
              ) : featuredStoresList?.length > 0 ? (
                featuredStoresList.map((campaign, i) => (
                  <CarouselItem key={`featured-${campaign.id}-${i}`} className="pl-2 basis-1/3 sm:basis-1/4 lg:basis-1/8">
                    <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} className="bg-white p-2 rounded-lg border border-zinc-100 hover:border-black hover:shadow-sm transition-all block text-center space-y-1 group">
                       <div className="w-8 h-8 md:w-10 md:h-10 mx-auto rounded-md overflow-hidden relative border shadow-sm group-hover:scale-105 transition-transform">
                         <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt={campaign.storeName} fill className="object-cover" />
                       </div>
                       <h4 className="font-black text-black text-[8px] md:text-[9px] truncate uppercase">{campaign.storeName}</h4>
                    </Link>
                  </CarouselItem>
                ))
              ) : (
                <div className="col-span-full py-4 text-center text-zinc-400 font-black italic text-[10px] w-full">
                   {lang === 'AR' ? 'لا توجد متاجر مميزة حالياً.' : 'No featured stores at the moment.'}
                </div>
              )}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Explore Latest Parts Section */}
        <section className="w-full px-0.5 py-6">
          <div className={cn("flex items-center justify-between mb-4 border-b-2 border-black/10 pb-1 px-2", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
             <div className={cn("text-right", lang === 'EN' && "text-left")}>
                <h2 className="text-lg md:text-xl font-black text-black flex items-center gap-2 uppercase">
                   {lang === 'AR' ? 'أحدث قطع الغيار المضافة' : 'Latest Added Parts'} <Package size={20} className="text-black" />
                </h2>
                <p className="text-[10px] text-zinc-500 font-black uppercase">
                   {lang === 'AR' ? 'تصفح القطع المتوفرة حالياً في كافة الولايات.' : 'Browse parts currently available across all wilayas.'}
                </p>
             </div>
             <Link href="/catalog" className="text-[10px] font-black text-black hover:underline uppercase">
                {lang === 'AR' ? 'عرض كافة القطع' : 'View All Parts'}
             </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-1" dir={lang === 'AR' ? "rtl" : "ltr"}>
            {loadingExplore ? (
               Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-80 bg-zinc-200 animate-pulse rounded-[24px]" />)
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
               <div className="col-span-full py-10 bg-white rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-zinc-300">
                  <Search size={32} className="opacity-10 mb-2" />
                  <p className="font-black text-xs text-black">
                     {lang === 'AR' ? 'لا توجد قطع معروضة حالياً.' : 'No parts available at the moment.'}
                  </p>
               </div>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        {activeFeaturedProducts && activeFeaturedProducts.length > 0 && (
          <section className="w-full px-0.5 py-6 bg-zinc-900 text-white rounded-t-[32px] mt-6">
            <div className="container mx-auto px-2">
              <div className={cn("flex items-center justify-between mb-6", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                 <div className={cn("text-right", lang === 'EN' && "text-left")}>
                    <h2 className="text-xl md:text-2xl font-black flex items-center gap-3 text-secondary uppercase">
                       {lang === 'AR' ? 'منتجات ننصح بها' : 'Recommended Products'} <Zap className="fill-secondary animate-pulse" size={24} />
                    </h2>
                    <p className="text-[10px] text-zinc-400 font-black uppercase">
                       {lang === 'AR' ? 'أفضل قطع الغيار المختارة يدوياً من طرف فريقنا.' : 'Top quality parts handpicked by our team.'}
                    </p>
                 </div>
                 <Link href="/catalog">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-black h-10 px-6 rounded-xl gap-2 uppercase">
                       {lang === 'AR' ? 'تصفح الكتالوج' : 'Browse Catalog'} <ShoppingBag size={16} />
                    </Button>
                 </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" dir={lang === 'AR' ? "rtl" : "ltr"}>
                {activeFeaturedProducts.map((p) => (
                  <ProductCard 
                    key={p.id}
                    id={p.productId}
                    name={p.productName}
                    price={p.productPrice}
                    image={p.productImage}
                    seller={p.sellerName}
                    category={lang === 'AR' ? 'مميز' : 'Featured'}
                    condition="New"
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

