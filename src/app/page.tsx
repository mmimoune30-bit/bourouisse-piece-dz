
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
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Store
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, limit, orderBy } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import { cn } from "@/lib/utils";

export default function Home() {
  const { firestore } = useFirestore();
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");
  const scrollRef = useRef<HTMLDivElement>(null);

  // استعلامات لحظية
  const categoryImagesQuery = useMemo(() => firestore ? query(collection(firestore, "category_images"), limit(30)) : null, [firestore]);
  const featuredStoresQuery = useMemo(() => firestore ? query(collection(firestore, "featured_stores"), limit(10)) : null, [firestore]);
  const bannersQuery = useMemo(() => firestore ? query(collection(firestore, "banners"), limit(10)) : null, [firestore]);
  const featuredProductsQuery = useMemo(() => firestore ? query(collection(firestore, "featured_products"), limit(12)) : null, [firestore]);
  const latestListingsQuery = useMemo(() => firestore ? query(collection(firestore, "listings"), orderBy("createdAt", "desc"), limit(12)) : null, [firestore]);

  const { data: categoryData = [], loading: loadingCats } = useCollection(categoryImagesQuery);
  const { data: storeCampaigns = [], loading: loadingStores } = useCollection(featuredStoresQuery);
  const { data: siteBanners = [], loading: loadingBanners } = useCollection(bannersQuery);
  const { data: featuredProducts = [], loading: loadingFeatured } = useCollection(featuredProductsQuery);
  const { data: latestListings = [], loading: loadingLatest } = useCollection(latestListingsQuery);

  const categoryImagesMap = useMemo(() => {
    const map: Record<string, string> = {};
    categoryData.forEach(item => { 
      const key = item.name_en || item.id;
      if (key && item.imageUrl) {
        map[key] = item.imageUrl;
      }
    });
    return map;
  }, [categoryData]);

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const handleScroll = (dir: 'prev' | 'next') => {
    if (scrollRef.current) {
      const amt = 250 * (lang === 'AR' ? -1 : 1);
      scrollRef.current.scrollBy({ left: dir === 'next' ? amt : -amt, behavior: 'smooth' });
    }
  };

  const t = {
    exclusive: { AR: "متاجر حصرية وعروض", EN: "Exclusive & Ads", FR: "Exclusivités & Pubs" },
    featured: { AR: "منتجات مميزة", EN: "Featured Products", FR: "Produits Vedettes" },
    latest: { AR: "أحدث المعروضات", EN: "Latest Listings", FR: "Dernières Offres" },
    categories: { AR: "تصنيفات قطع الغيار", EN: "Categories", FR: "Catégories" },
    viewAll: { AR: "عرض الكل", EN: "View All", FR: "Voir Tout" }
  };

  const heroItems = useMemo(() => {
    const items: any[] = [];
    storeCampaigns.filter(s => s.tier === 'Exclusive').forEach(s => items.push({ type: 'store', data: s }));
    siteBanners.forEach(b => items.push({ type: 'banner', data: b }));

    if (items.length === 0 && !loadingStores && !loadingBanners) {
      items.push({
        type: 'banner',
        data: {
          link: "/catalog",
          ar: { title: "أكبر تجمع لقطع الغيار في الجزائر", description: "ابحث عن أي قطعة لسيارتك بكل سهولة وتواصل مع البائع مباشرة.", button: "ابدأ البحث الآن" },
          en: { title: "Largest Spare Parts Hub in Algeria", description: "Find any part for your vehicle easily and connect with sellers.", button: "Start Searching" }
        }
      });
    }
    return items;
  }, [storeCampaigns, siteBanners, loadingStores, loadingBanners]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Hero Slider Section - Dynamic & Fixed Autoplay */}
          <section className="w-full mt-12 md:mt-16 pt-6">
            <div className={cn("flex flex-col lg:flex-row gap-4", lang === 'AR' ? "lg:flex-row-reverse" : "lg:flex-row")}>
              <div className="w-full lg:w-3/4 h-[300px] md:h-[400px] bg-white rounded-[32px] shadow-xl border overflow-hidden relative flex flex-col">
                <div className="px-8 py-4 border-b flex items-center justify-between z-10 bg-white/90 backdrop-blur-sm">
                   <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                     <Crown size={24} className="text-secondary" /> {t.exclusive[lang]}
                   </h2>
                   <Link href="/catalog" className="text-xs font-black text-secondary hover:underline uppercase tracking-widest">{t.viewAll[lang]}</Link>
                </div>
                <div className="flex-grow relative bg-zinc-50">
                   {loadingStores || loadingBanners ? (
                     <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>
                   ) : heroItems.length > 0 ? (
                     <Carousel 
                        key={`hero-${heroItems.length}`} // إجبار المكون على إعادة التهيئة عند وصول البيانات
                        opts={{ loop: true }} 
                        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]} 
                        className="h-full"
                     >
                        <CarouselContent className="h-full">
                          {heroItems.map((item, i) => (
                            <CarouselItem key={i} className="h-full">
                               {item.type === 'store' ? (
                                <Link href={`/catalog?query=${encodeURIComponent(item.data.storeName)}`} className="w-full h-full flex items-center gap-4 sm:gap-8 px-4 sm:px-8 md:px-12 group">
                                  <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-56 md:h-56 rounded-2xl sm:rounded-[40px] overflow-hidden relative border-4 sm:border-8 border-white shadow-2xl shrink-0 transition-transform group-hover:scale-105">
                                       <Image src={item.data.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${item.data.storeName}`} alt="" fill className="object-cover" priority={i === 0} sizes="300px" />
                                    </div>
                                    <div className={cn("flex flex-col gap-2", lang === 'AR' ? "text-right" : "text-left")}>
                                       <Badge className="bg-secondary text-primary font-black mb-1 w-fit uppercase px-4 py-1">KING STORE</Badge>
                                       <h3 className="text-xl sm:text-3xl md:text-6xl font-black text-primary uppercase line-clamp-2 tracking-tighter">{item.data.storeName}</h3>
                                       <p className="text-sm sm:text-lg md:text-2xl text-zinc-500 font-bold flex items-center gap-2"><MapPin size={18} className="text-secondary" /> {item.data.storeLocation}</p>
                                    </div>
                                 </Link>
                               ) : (
                                 <div className="relative w-full h-full group">
                                    {typeof item.data.image === 'string' && item.data.image.trim() ? (
                                      <Image src={item.data.image} alt="" fill className="object-cover" priority={i === 0} />
                                    ) : (
                                      <div className="absolute inset-0 bg-primary" aria-hidden="true" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50" />
                                    <div className={cn("absolute inset-0 z-10 flex flex-col justify-center px-5 sm:px-10 md:px-16 max-w-2xl gap-3 sm:gap-4", lang === 'AR' ? "text-right items-end ml-auto" : "text-left items-start mr-auto")} dir={lang === 'AR' ? "rtl" : "ltr"}>
                                      <h3 className="text-xl sm:text-3xl md:text-5xl font-black text-white leading-tight">{lang === 'AR' ? item.data.ar?.title : item.data.en?.title}</h3>
                                      <p className="text-sm sm:text-lg md:text-xl text-zinc-200 font-bold line-clamp-2">{lang === 'AR' ? item.data.ar?.description : item.data.en?.description}</p>
                                       <div className="flex flex-wrap gap-3">
                                         <Link href={item.data.link || "/catalog"}>
                                           <Button className="bg-secondary text-primary font-black h-14 px-10 rounded-2xl text-lg shadow-xl hover:bg-white transition-all uppercase">
                                              {lang === 'AR' ? item.data.ar?.button : item.data.en?.button}
                                           </Button>
                                         </Link>
                                         <Link href="/stores">
                                           <Button variant="outline" className="border-2 border-white/80 bg-white/10 text-white hover:bg-white hover:text-primary font-black h-14 px-6 rounded-2xl text-lg shadow-xl uppercase backdrop-blur-sm">
                                             <Store size={18} className="ml-2" />
                                             {lang === 'AR' ? 'قائمة المتاجر المعتمدة' : 'Approved Stores'}
                                           </Button>
                                         </Link>
                                       </div>
                                    </div>
                                 </div>
                               )}
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                     </Carousel>
                   ) : null}
                </div>
              </div>

              {/* Side Promo Slider */}
              <div className="w-full lg:w-1/4 h-[300px] md:h-[400px] relative rounded-[32px] overflow-hidden bg-zinc-900 shadow-none group border border-slate-200">
                <Carousel 
                  opts={{ loop: true }} 
                  plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]} 
                  className="h-full"
                >
                  <CarouselContent className="h-full">
                    <CarouselItem className="h-full">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-primary opacity-90 transition-transform duration-1000 group-hover:scale-105" aria-hidden="true" />
                        <div className="absolute inset-0 z-10 p-8 flex flex-col justify-center items-center text-center space-y-6">
                           <div className="space-y-2">
                              <Sparkles className="text-secondary mb-2 mx-auto" size={32} />
                              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">كن بائعاً محترفاً</h3>
                              <p className="text-sm text-zinc-300 font-bold leading-relaxed">افتح متجرك الآن ووصل لآلاف الزبائن</p>
                           </div>
                           <Link href="/seller/register" className="w-full"><Button className="w-full h-14 bg-secondary text-primary font-black rounded-2xl uppercase shadow-2xl hover:bg-white transition-all text-lg">ابدأ مجاناً</Button></Link>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem className="h-full">
                      <div className="relative w-full h-full bg-blue-900/40">
                         <div className="absolute inset-0 z-10 p-8 flex flex-col justify-center items-center text-center space-y-6">
                            <div className="space-y-2">
                               <Zap className="text-secondary mb-2 mx-auto" size={32} />
                               <h3 className="text-2xl font-black text-white uppercase">بحث ذكي</h3>
                               <p className="text-xs text-blue-100 font-bold">ابحث بوصف القطعة وسنجدها لك</p>
                            </div>
                            <Link href="/catalog" className="w-full"><Button variant="outline" className="w-full h-12 border-2 border-secondary text-secondary font-black rounded-xl hover:bg-secondary hover:text-primary">جرب البحث المتقدم</Button></Link>
                         </div>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </section>

          {/* Categories Carousel Section */}
          <section className="space-y-8">
            <div className={cn("flex items-center justify-between", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
               <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter">
                 {t.categories[lang]} <LayoutGrid size={32} className="text-secondary" />
               </h2>
               <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-2 bg-white shadow-sm hover:bg-zinc-50" onClick={() => handleScroll('prev')}><ChevronRight size={24} className={lang !== 'AR' ? 'rotate-180' : ''} /></Button>
                  <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-2 bg-white shadow-sm hover:bg-zinc-50" onClick={() => handleScroll('next')}><ChevronLeft size={24} className={lang !== 'AR' ? 'rotate-180' : ''} /></Button>
               </div>
            </div>
            
            {loadingCats ? (
              <div className="flex gap-8 overflow-hidden py-4">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="w-40 h-40 rounded-full bg-zinc-200 animate-pulse shrink-0" />)}
              </div>
            ) : (
              <div ref={scrollRef} className="flex gap-10 overflow-x-auto pb-6 no-scrollbar scroll-smooth" dir={lang === 'AR' ? "rtl" : "ltr"}>
                 {PART_CATEGORIES.map((cat, i) => {
                   const img = categoryImagesMap[cat.en] || "";
                   return (
                     <div key={i} className="shrink-0 flex flex-col items-center gap-4 group">
                        <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl relative bg-white pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:ring-4 ring-secondary">
                           {img ? <Image src={img} alt="" fill className="object-cover" sizes="200px" /> : <Tags className="absolute inset-0 m-auto text-zinc-300" size={42} />}
                        </div>
                        <Link 
                          href={`/catalog?category=${cat.en}`} 
                          className="text-primary hover:text-secondary text-base md:text-lg font-black transition-all uppercase text-center px-2 tracking-tight"
                        >
                          {lang === 'AR' ? cat.ar : cat.en}
                        </Link>
                     </div>
                   );
                 })}
              </div>
            )}
          </section>

          {/* Featured Products Section */}
          <section className="space-y-8">
            <div className={cn("flex items-center justify-between", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
               <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter">
                 <Zap size={32} className="text-secondary fill-secondary" /> {t.featured[lang]}
               </h2>
               <Link href="/catalog" className="text-xs font-black text-secondary hover:underline uppercase tracking-widest">{t.viewAll[lang]}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" dir={lang === 'AR' ? "rtl" : "ltr"}>
               {loadingFeatured ? (
                 Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-square bg-white rounded-[24px] animate-pulse border shadow-sm" />)
               ) : featuredProducts.length > 0 ? (
                 featuredProducts.map((p, i) => (
                   <ProductCard key={i} id={p.productId || p.id} name={p.productName || p.name} price={p.productPrice || p.price} image={p.productImage || (p.images?.[0])} seller={p.sellerName} category={lang === 'AR' ? 'قطعة مميزة' : 'FEATURED'} condition="New" />
                 ))
               ) : (
                 <div className="col-span-full py-16 text-center text-muted-foreground italic font-black text-xl bg-white rounded-[32px] border-2 border-dashed">لا توجد منتجات مميزة متاحة حالياً</div>
               )}
            </div>
          </section>

          {/* Latest Listings Section */}
          <section className="space-y-8">
            <div className={cn("flex items-center justify-between", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
               <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter">
                 <Package size={32} className="text-secondary" /> {t.latest[lang]}
               </h2>
               <Link href="/catalog" className="text-xs font-black text-secondary hover:underline uppercase tracking-widest">{t.viewAll[lang]}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" dir={lang === 'AR' ? "rtl" : "ltr"}>
               {loadingLatest ? (
                 Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square bg-white rounded-[24px] animate-pulse border shadow-sm" />)
               ) : latestListings.length > 0 ? (
                 latestListings.map((p) => (
                   <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.images?.[0]} seller={p.sellerName} category={p.category} condition={p.condition === 'new' ? 'New' : 'Used'} createdAt={p.createdAt} />
                 ))
               ) : (
                 <div className="col-span-full py-16 text-center text-muted-foreground italic font-black text-xl bg-white rounded-[32px] border-2 border-dashed">لا توجد معروضات حديثة حالياً</div>
               )}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
