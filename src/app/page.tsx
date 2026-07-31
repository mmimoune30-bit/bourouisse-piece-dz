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
  Camera,
  Search,
  Zap,
  ShoppingBag,
  Package
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, where, updateDoc, doc, increment, setDoc, orderBy, limit } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import { toast } from "@/hooks/use-toast";
import SiteLogo from "@/components/site-logo";

export default function Home() {
  const { firestore } = useFirestore();
  const { profile } = useUser();
  const [lang, setLang] = useState<"AR" | "EN">("AR");
  const [api, setApi] = useState<CarouselApi>();
  const [uploadingCat, setUploadingCat] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentCatRef = useRef<string>("");

  const isAdmin = profile && ["Super Admin", "Manager"].includes(profile.role);

  const categoriesMetaQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "categories_metadata");
  }, [firestore]);

  const featuredStoresQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "featured_stores");
  }, [firestore]);

  const featuredProductsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "featured_products");
  }, [firestore]);

  const allStoresQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), where("role", "==", "Seller"), where("status", "==", "Active"));
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

  const { data: categoriesMeta } = useCollection(categoriesMetaQuery);
  const { data: allCampaigns, loading: loadingCampaigns } = useCollection(featuredStoresQuery);
  const { data: featuredProducts, loading: loadingFeaturedProducts } = useCollection(featuredProductsQuery);
  const { data: allStores, loading: loadingStores } = useCollection(allStoresQuery);
  const { data: exploreListings, loading: loadingExplore } = useCollection(allListingsExploreQuery);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const exclusiveStores = useMemo(() => {
    return (allCampaigns || [])
      .filter(c => c.tier === "Exclusive" && c.status === "Active" && c.startDate <= today && c.endDate >= today)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }, [allCampaigns, today]);

  const featuredStores = useMemo(() => {
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
        {/* Hero Section - Unified Height 400px */}
        <section className="w-full px-0.5 mt-1">
          <div className="flex flex-col lg:flex-row-reverse gap-1.5" dir="rtl">
            {/* Exclusive Stores Slider */}
            <div className="lg:w-3/4 h-[320px] lg:h-[400px] bg-white rounded-xl shadow-sm overflow-hidden flex flex-col relative border border-primary/5">
              <div className="bg-primary/5 px-4 py-1.5 border-b flex items-center justify-between z-20 shrink-0">
                 <h2 className="font-black text-xs text-primary flex items-center gap-2">
                   <Crown size={14} className="text-secondary fill-secondary" /> متاجر حصرية
                 </h2>
                 <Link href="/catalog" className="text-[10px] font-bold text-secondary hover:underline flex items-center gap-1">تصفح الكل <ArrowLeft size={12} /></Link>
              </div>
              <div className="flex-grow relative overflow-hidden">
                {loadingCampaigns ? (
                  <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : exclusiveStores?.length > 0 ? (
                  <Carousel setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]} className="w-full h-full">
                    <CarouselContent className="h-full -ml-0">
                      {exclusiveStores.map((campaign, i) => (
                        <CarouselItem key={i} className="h-full pl-0">
                          <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} onClick={() => handleStoreClick(campaign.id)} className="w-full h-full flex items-center gap-4 px-6 md:px-12 hover:bg-zinc-50/30 transition-colors py-4">
                            <div className="w-28 h-28 md:w-56 md:h-56 rounded-2xl overflow-hidden relative border-2 border-zinc-100 shadow-sm shrink-0">
                               <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt={campaign.storeName} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col gap-2 text-right">
                               <Badge className="bg-secondary text-primary font-black text-[10px] w-fit mr-auto">👑 متجر حصري</Badge>
                               <h3 className="font-black text-2xl md:text-5xl text-primary line-clamp-1">{campaign.storeName}</h3>
                               <p className="text-sm md:text-lg text-muted-foreground font-bold flex items-center gap-1 justify-end"><MapPin size={18} className="text-secondary" /> {campaign.storeLocation}</p>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-bold italic text-xs">لا توجد إعلانات حصرية حالياً.</div>
                )}
              </div>
            </div>

            {/* Alternating Side Ads - Content Swapping Only */}
            <div className="lg:w-1/4 h-[320px] lg:h-[400px] relative rounded-xl overflow-hidden shadow-sm bg-zinc-900 border border-primary/5">
              {/* Static Background Image & Overlay for all slides */}
              <Image 
                src="https://picsum.photos/seed/auto-hero-real/1200/800" 
                alt="Ad Background" 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-black/65 z-0" />
              
              <Carousel 
                opts={{ loop: true }} 
                plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]} 
                className="w-full h-full relative z-10"
              >
                <CarouselContent className="h-full -ml-0">
                  {/* Slide 1: Seller Join */}
                  <CarouselItem key="side-ad-1" className="h-full pl-0">
                    <div className="p-6 text-center text-white flex flex-col items-center justify-center h-full w-full space-y-6">
                      <h3 className="text-xl md:text-2xl font-black leading-tight">اشترك معنا واعرض منتجاتك</h3>
                      <Link href="/seller/register" className="w-full">
                        <Button className="w-full h-14 bg-secondary text-primary font-black rounded-xl text-lg shadow-lg hover:bg-white transition-all">سجل كبائع</Button>
                      </Link>
                    </div>
                  </CarouselItem>

                  {/* Slide 2: Buyer Join */}
                  <CarouselItem key="side-ad-2" className="h-full pl-0">
                    <div className="p-6 text-center text-white flex flex-col items-center justify-center h-full w-full space-y-6">
                      <h3 className="text-xl md:text-2xl font-black leading-tight">سجل معنا و اشتري سلعتك بطريقة احترافية</h3>
                      <Link href="/buyer/register" className="w-full">
                        <Button className="w-full h-14 border-2 border-white text-white hover:bg-white hover:text-primary font-black rounded-xl text-lg shadow-lg transition-all">سجل كمشتري</Button>
                      </Link>
                    </div>
                  </CarouselItem>

                  {/* Slide 3: Logo Brand */}
                  <CarouselItem key="side-ad-3" className="h-full pl-0">
                    <div className="flex flex-col items-center justify-center h-full w-full p-8">
                        <SiteLogo brandClassName="text-white" subtextClassName="text-blue-100" />
                    </div>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Categories Section - Clean Text Buttons Only */}
        <section className="w-full px-0.5 py-4">
          <div className="flex flex-row-reverse justify-center items-center mb-4 px-2 border-b border-primary/5 pb-2">
             <h2 className="text-sm md:text-base font-black text-primary flex items-center gap-2">تصنيفات قطع الغيار <Tags size={16} className="text-secondary" /></h2>
          </div>
          <div className="flex flex-row-reverse justify-center gap-3 overflow-x-auto pb-4 no-scrollbar px-2" dir="rtl">
            {PART_CATEGORIES.map((cat, i) => (
              <div key={i} className="shrink-0">
                <Link href={`/catalog?category=${encodeURIComponent(cat.en)}`}>
                  <span className="font-black text-xs md:text-sm text-primary bg-white px-4 md:px-6 py-2.5 rounded-xl border-2 border-zinc-100 hover:border-secondary hover:text-secondary hover:shadow-md transition-all block text-center shadow-sm whitespace-nowrap">
                    {lang === 'AR' ? cat.ar : cat.en}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Stores Slider */}
        {featuredStores && featuredStores.length > 0 && (
          <section className="w-full px-0.5 py-2">
            <div className="flex items-center justify-between mb-2 px-2 flex-row-reverse">
              <h2 className="text-sm md:text-base font-black text-primary flex items-center gap-2"><Star size={16} className="text-blue-500 fill-blue-500" /> متاجر مميزة</h2>
            </div>
            <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
              <CarouselContent className="-ml-2" dir="rtl">
                {featuredStores.map((campaign, i) => (
                  <CarouselItem key={i} className="pl-2 basis-1/2 sm:basis-1/3 lg:basis-1/6">
                    <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} className="bg-white p-3 rounded-xl border hover:shadow-md transition-all block text-center space-y-1">
                       <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden relative border shadow-sm">
                         <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt={campaign.storeName} fill className="object-cover" />
                       </div>
                       <h4 className="font-black text-primary text-[9px] truncate">{campaign.storeName}</h4>
                       <Badge variant="outline" className="text-[7px] h-4 border-blue-200 text-blue-600">مميز</Badge>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
        )}

        {/* Explore Latest Parts */}
        <section className="w-full px-0.5 py-6">
          <div className="flex items-center justify-between mb-4 border-b-2 border-primary/10 pb-1 px-2 flex-row-reverse">
             <div className="text-right">
                <h2 className="text-lg md:text-xl font-black text-primary flex items-center justify-end gap-2">
                   أحدث قطع الغيار المضافة <Package size={20} className="text-secondary" />
                </h2>
                <p className="text-[10px] text-muted-foreground font-bold">تصفح القطع المتوفرة حالياً في كافة الولايات.</p>
             </div>
             <Link href="/catalog" className="text-[10px] font-bold text-secondary hover:underline">عرض كافة القطع</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-1" dir="rtl">
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
                  <p className="font-black text-xs">لا توجد قطع معروضة حالياً.</p>
               </div>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        {activeFeaturedProducts && activeFeaturedProducts.length > 0 && (
          <section className="w-full px-0.5 py-6 bg-zinc-900 text-white rounded-t-[32px] mt-6">
            <div className="container mx-auto px-2">
              <div className="flex items-center justify-between mb-6 flex-row-reverse">
                 <div className="text-right">
                    <h2 className="text-xl md:text-2xl font-black flex items-center justify-end gap-3 text-secondary">
                       منتجات ننصح بها <Zap className="fill-secondary animate-pulse" size={24} />
                    </h2>
                    <p className="text-[10px] text-zinc-400 font-bold">أفضل قطع الغيار المختارة يدوياً من طرف فريقنا.</p>
                 </div>
                 <Link href="/catalog">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-black h-10 px-6 rounded-xl gap-2">
                       تصفح الكتالوج <ShoppingBag size={16} />
                    </Button>
                 </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
                {activeFeaturedProducts.map((p) => (
                  <ProductCard 
                    key={p.id}
                    id={p.productId}
                    name={p.productName}
                    price={p.productPrice}
                    image={p.productImage}
                    seller={p.sellerName}
                    category="مميز"
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
