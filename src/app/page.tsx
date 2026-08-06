
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
  ChevronLeft
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, limit, orderBy, getDocs } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import { cn } from "@/lib/utils";

export default function Home() {
  const { firestore } = useFirestore();
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");
  const scrollRef = useRef<HTMLDivElement>(null);

  // استعلامات لحظية فائقة السرعة مع المزامنة
  const categoryImagesQuery = useMemo(() => firestore ? query(collection(firestore, "category_images"), limit(30)) : null, [firestore]);
  const featuredStoresQuery = useMemo(() => firestore ? query(collection(firestore, "featured_stores"), limit(10)) : null, [firestore]);
  const featuredProductsQuery = useMemo(() => firestore ? query(collection(firestore, "featured_products"), limit(12)) : null, [firestore]);
  const latestListingsQuery = useMemo(() => firestore ? query(collection(firestore, "listings"), orderBy("createdAt", "desc"), limit(12)) : null, [firestore]);

  const { data: categoryData = [], loading: loadingCats } = useCollection(categoryImagesQuery);
  const { data: storeCampaigns = [], loading: loadingStores } = useCollection(featuredStoresQuery);
  const { data: featuredProducts = [], loading: loadingFeatured } = useCollection(featuredProductsQuery);
  const { data: latestListings = [], loading: loadingLatest } = useCollection(latestListingsQuery);

  // نظام تشخيصي للتأكد من وصول البيانات في الكونسول
  useEffect(() => {
    if (categoryData.length > 0) {
      console.log(`✅ Home: Loaded ${categoryData.length} category images from Firestore.`);
    }
  }, [categoryData]);

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
    const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
    if (savedLang) setLang(savedLang);
    const handler = () => setLang(localStorage.getItem("app_lang") as any || "AR");
    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  const handleScroll = (dir: 'prev' | 'next') => {
    if (scrollRef.current) {
      const amt = 250 * (lang === 'AR' ? -1 : 1);
      scrollRef.current.scrollBy({ left: dir === 'next' ? amt : -amt, behavior: 'smooth' });
    }
  };

  const t = {
    exclusive: { AR: "متاجر حصرية", EN: "Exclusive Stores", FR: "Boutiques Exclusives" },
    featured: { AR: "منتجات مميزة", EN: "Featured Products", FR: "Produits Vedettes" },
    latest: { AR: "أحدث المعروضات", EN: "Latest Listings", FR: "Dernières Offres" },
    categories: { AR: "تصنيفات قطع الغيار", EN: "Categories", FR: "Catégories" },
    viewAll: { AR: "عرض الكل", EN: "View All", FR: "Voir Tout" }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-[190px] md:pt-[210px] pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Hero Slider Section */}
          <section className="w-full">
            <div className={cn("flex flex-col lg:flex-row gap-4", lang === 'AR' ? "lg:flex-row-reverse" : "lg:flex-row")}>
              <div className="lg:w-3/4 h-[220px] md:h-[320px] bg-white rounded-2xl shadow-sm border overflow-hidden relative flex flex-col">
                <div className="px-6 py-4 border-b flex items-center justify-between z-10 bg-white/90 backdrop-blur-sm">
                   <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 uppercase">
                     <Crown size={20} className="text-secondary" /> {t.exclusive[lang]}
                   </h2>
                   <Link href="/catalog" className="text-xs font-bold text-secondary hover:underline uppercase">{t.viewAll[lang]}</Link>
                </div>
                <div className="flex-grow relative bg-zinc-50">
                   {loadingStores ? (
                     <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                   ) : storeCampaigns.length > 0 ? (
                     <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="h-full">
                        <CarouselContent className="h-full">
                          {storeCampaigns.filter(s => s.tier === 'Exclusive').map((s, i) => (
                            <CarouselItem key={i} className="h-full">
                               <Link href={`/catalog?query=${encodeURIComponent(s.storeName)}`} className="w-full h-full flex items-center gap-6 px-10">
                                  <div className="w-24 h-24 md:w-44 md:h-44 rounded-3xl overflow-hidden relative border-4 border-white shadow-xl shrink-0">
                                     <Image src={s.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${s.storeName}`} alt="" fill className="object-cover" priority={i === 0} sizes="200px" />
                                  </div>
                                  <div className={cn("flex flex-col gap-1", lang === 'AR' ? "text-right" : "text-left")}>
                                     <Badge className="bg-secondary text-primary font-bold mb-1 w-fit">KING STORE</Badge>
                                     <h3 className="text-2xl md:text-5xl font-black text-primary uppercase line-clamp-1">{s.storeName}</h3>
                                     <p className="text-sm md:text-lg text-zinc-500 font-bold flex items-center gap-1.5"><MapPin size={18} className="text-secondary" /> {s.storeLocation}</p>
                                  </div>
                               </Link>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                     </Carousel>
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-bold italic">لا توجد متاجر حصرية متاحة حالياً</div>
                   )}
                </div>
              </div>

              <div className="lg:w-1/4 h-[220px] md:h-[320px] relative rounded-2xl overflow-hidden bg-zinc-900 shadow-xl group">
                <Image 
                  src="https://picsum.photos/seed/promo-dz/400/400" 
                  alt="" 
                  fill 
                  className="object-cover opacity-40 transition-transform group-hover:scale-110" 
                  sizes="400px"
                  priority={true}
                />
                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-center items-center text-center space-y-6">
                   <div className="space-y-1">
                      <h3 className="text-xl font-black text-white uppercase">كن بائعاً محترفاً</h3>
                      <p className="text-xs text-zinc-400 font-bold">افتح متجرك وابدأ البيع الآن</p>
                   </div>
                   <Link href="/seller/register" className="w-full"><Button className="w-full h-12 bg-secondary text-primary font-black rounded-xl uppercase shadow-xl hover:bg-white transition-all">ابدأ الآن</Button></Link>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Carousel Section */}
          <section className="space-y-6">
            <div className={cn("flex items-center justify-between", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
               <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                 {t.categories[lang]} <LayoutGrid size={24} className="text-secondary" />
               </h2>
               <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-2 bg-white" onClick={() => handleScroll('prev')}><ChevronRight size={20} className={lang !== 'AR' ? 'rotate-180' : ''} /></Button>
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-2 bg-white" onClick={() => handleScroll('next')}><ChevronLeft size={20} className={lang !== 'AR' ? 'rotate-180' : ''} /></Button>
               </div>
            </div>
            
            {loadingCats ? (
              <div className="flex gap-6 overflow-hidden py-4">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="w-32 h-32 rounded-full bg-zinc-200 animate-pulse shrink-0" />)}
              </div>
            ) : (
              <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth" dir={lang === 'AR' ? "rtl" : "ltr"}>
                 {PART_CATEGORIES.map((cat, i) => {
                   const img = categoryImagesMap[cat.en] || `https://picsum.photos/seed/cat-${i}/150/150`;
                   return (
                     <div key={i} className="shrink-0 flex flex-col items-center gap-3 group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative bg-white pointer-events-none transition-transform group-hover:scale-105">
                           <Image src={img} alt="" fill className="object-cover" sizes="150px" />
                        </div>
                        <Link 
                          href={`/catalog?category=${cat.en}`} 
                          className="text-primary hover:text-secondary text-base md:text-lg font-black transition-all uppercase text-center px-2"
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
          <section className="space-y-6">
            <div className={cn("flex items-center justify-between", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
               <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 uppercase">
                 <Zap size={24} className="text-secondary fill-secondary" /> {t.featured[lang]}
               </h2>
               <Link href="/catalog" className="text-xs font-bold text-secondary hover:underline uppercase">{t.viewAll[lang]}</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" dir={lang === 'AR' ? "rtl" : "ltr"}>
               {loadingFeatured ? (
                 Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse border" />)
               ) : featuredProducts.length > 0 ? (
                 featuredProducts.map((p, i) => (
                   <ProductCard key={i} id={p.productId || p.id} name={p.productName || p.name} price={p.productPrice || p.price} image={p.productImage || (p.images?.[0])} seller={p.sellerName} category={lang === 'AR' ? 'قطعة مميزة' : 'FEATURED'} condition="New" />
                 ))
               ) : (
                 <div className="col-span-full py-10 text-center text-muted-foreground italic font-bold">لا توجد منتجات مميزة متاحة حالياً</div>
               )}
            </div>
          </section>

          {/* Latest Listings Section */}
          <section className="space-y-6">
            <div className={cn("flex items-center justify-between", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
               <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 uppercase">
                 <Package size={24} className="text-secondary" /> {t.latest[lang]}
               </h2>
               <Link href="/catalog" className="text-xs font-bold text-secondary hover:underline uppercase">{t.viewAll[lang]}</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" dir={lang === 'AR' ? "rtl" : "ltr"}>
               {loadingLatest ? (
                 Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse border" />)
               ) : latestListings.length > 0 ? (
                 latestListings.map((p) => (
                   <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.images?.[0]} seller={p.sellerName} category={p.category} condition={p.condition === 'new' ? 'New' : 'Used'} createdAt={p.createdAt} />
                 ))
               ) : (
                 <div className="col-span-full py-10 text-center text-muted-foreground italic font-bold">لا توجد معروضات حديثة حالياً</div>
               )}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
