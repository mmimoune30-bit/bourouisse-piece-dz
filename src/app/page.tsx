
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
  ChevronRight, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Store, 
  Crown, 
  Sparkles, 
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
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, where, updateDoc, doc, increment, setDoc, orderBy, limit } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import { toast } from "@/hooks/use-toast";

const HERO_SIDE_BANNERS = [
  {
    id: 1,
    image: "https://picsum.photos/seed/join-seller/400/300",
    link: "/seller/register",
    title: "اشترك معنا واعرض منتجاتك",
    button: "سجل كبائع"
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/get-goods/400/300",
    link: "/catalog",
    title: "اشترك معنا واحصل على سلعتك",
    button: "ابدأ التسوق"
  }
];

export default function Home() {
  const { firestore } = useFirestore();
  const { profile } = useUser();
  const [lang, setLang] = useState<"AR" | "EN">("AR");
  const [api, setApi] = useState<CarouselApi>();
  const [uploadingCat, setUploadingCat] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentCatRef = useRef<string>("");

  const isAdmin = profile && ["Super Admin", "Manager"].includes(profile.role);

  // Memoized Queries to prevent ID: ca9 crash
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

  // NEW: Explore Listings Query
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

  const categoryImagesMap = useMemo(() => {
    const map: Record<string, string> = {};
    categoriesMeta?.forEach(meta => { map[meta.id] = meta.imageUrl; });
    return map;
  }, [categoriesMeta]);

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

  const handleUploadImage = async (categoryEn: string) => {
    currentCatRef.current = categoryEn;
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const catEn = currentCatRef.current;
    if (!file || !firestore || !catEn) return;

    setUploadingCat(catEn);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        const compressed = event.target?.result as string;
        await setDoc(doc(firestore, "categories_metadata", catEn), { imageUrl: compressed, updatedAt: new Date().toISOString() }, { merge: true });
        toast({ title: "تم التحديث", description: "تم تحديث صورة التصنيف بنجاح." });
      };
    } catch (err) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل رفع الصورة." });
    } finally {
      setUploadingCat(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-zinc-50">
      <Navbar />

      <main className="flex-grow pt-[170px] md:pt-[190px]">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />

        <section className="w-full px-1 md:px-2 mt-1">
          <div className="flex flex-col lg:flex-row-reverse gap-2" dir="rtl">
            {/* Exclusive Stores Slider */}
            <div className="lg:w-3/4 h-[200px] md:h-[220px] bg-white rounded-xl shadow-sm overflow-hidden flex flex-col relative border border-primary/5">
              <div className="bg-primary/5 px-4 py-1 border-b flex items-center justify-between z-20">
                 <h2 className="font-black text-xs text-primary flex items-center gap-2">
                   <Crown size={14} className="text-secondary fill-secondary" /> متاجر حصرية
                 </h2>
                 <Link href="/catalog" className="text-[9px] font-bold text-secondary hover:underline flex items-center gap-1">تصفح الكل <ArrowLeft size={10} /></Link>
              </div>
              <div className="flex-grow relative">
                {loadingCampaigns ? (
                  <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : exclusiveStores?.length > 0 ? (
                  <Carousel setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="w-full h-full">
                    <CarouselContent className="h-full">
                      {exclusiveStores.map((campaign, i) => (
                        <CarouselItem key={i} className="h-full">
                          <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} onClick={() => handleStoreClick(campaign.id)} className="w-full h-full flex items-center gap-4 px-6 md:px-12 hover:bg-zinc-50/30 transition-colors py-4">
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-xl overflow-hidden relative border-2 border-zinc-100 shadow-sm shrink-0">
                               <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt={campaign.storeName} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                               <Badge className="bg-secondary text-primary font-black text-[9px] w-fit mr-auto">👑 متجر حصري</Badge>
                               <h3 className="font-black text-lg md:text-3xl text-primary line-clamp-1">{campaign.storeName}</h3>
                               <p className="text-xs text-muted-foreground font-bold flex items-center gap-1 justify-end"><MapPin size={12} className="text-secondary" /> {campaign.storeLocation}</p>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground font-bold italic text-xs">لا توجد إعلانات حصرية حالياً.</div>
                )}
              </div>
            </div>

            {/* Alternating Side Ads */}
            <div className="lg:w-1/4 h-[120px] lg:h-[220px] relative rounded-xl overflow-hidden shadow-sm">
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[Autoplay({ delay: 4000 }), Fade()]}>
                <CarouselContent className="h-full">
                  {HERO_SIDE_BANNERS.map((banner) => (
                    <CarouselItem key={banner.id} className="h-full">
                      <div className="relative h-full w-full flex items-center justify-center">
                        <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="relative z-10 p-4 text-center text-white space-y-2">
                           <h3 className="text-xs md:text-sm font-black leading-tight">{banner.title}</h3>
                           <Link href={banner.link} className="block">
                             <Button size="sm" className="w-full h-8 bg-secondary text-primary font-black rounded-lg text-[10px]">{banner.button}</Button>
                           </Link>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="w-full px-1 md:px-2 py-2 mt-1">
          <div className="flex flex-row-reverse justify-between items-center mb-2 px-2 border-b border-primary/5 pb-1">
             <h2 className="text-sm md:text-base font-black text-primary flex items-center gap-2">تصنيفات قطع الغيار <Tags size={16} className="text-secondary" /></h2>
             <Link href="/catalog"><Button variant="link" className="text-secondary font-black text-[9px] h-auto p-0">عرض الكل</Button></Link>
          </div>
          <div className="flex flex-row-reverse gap-3 md:gap-4 overflow-x-auto pb-2 no-scrollbar px-1" dir="rtl">
            {PART_CATEGORIES.map((cat, i) => {
              const categoryImage = categoryImagesMap[cat.en] || `https://picsum.photos/seed/cat-${i}/200/200`;
              return (
                <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                  <Link href={`/catalog?category=${encodeURIComponent(cat.en)}`} className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border border-primary/5 bg-white shadow-sm hover:scale-105 transition-transform flex items-center justify-center">
                    <Image src={categoryImage} alt={cat.en} fill className="object-cover opacity-90" />
                    <div className="absolute inset-0 bg-black/5" />
                  </Link>
                  <Link href={`/catalog?category=${encodeURIComponent(cat.en)}`}>
                    <span className="font-black text-[9px] text-primary bg-white px-2 py-0.5 rounded border border-zinc-100">{lang === 'AR' ? cat.ar : cat.en}</span>
                  </Link>
                  {isAdmin && (
                    <button onClick={() => handleUploadImage(cat.en)} className="text-[7px] font-bold text-secondary flex items-center gap-0.5"><Camera size={8} /> تعديل</button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Stores Slider */}
        {featuredStores && featuredStores.length > 0 && (
          <section className="w-full px-1 md:px-2 py-2">
            <div className="flex items-center justify-between mb-2 px-2 flex-row-reverse">
              <h2 className="text-sm md:text-base font-black text-primary flex items-center gap-2"><Star size={16} className="text-blue-500 fill-blue-500" /> متاجر مميزة</h2>
            </div>
            <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
              <CarouselContent className="-ml-2" dir="rtl">
                {featuredStores.map((campaign, i) => (
                  <CarouselItem key={i} className="pl-2 basis-1/2 sm:basis-1/3 lg:basis-1/6">
                    <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} className="bg-white p-3 rounded-xl border hover:shadow-md transition-all block text-center space-y-1">
                       <div className="w-10 h-10 mx-auto rounded-lg overflow-hidden relative border shadow-sm">
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

        {/* Verified Stores Grid */}
        <section className="w-full px-1 md:px-2 py-4">
          <div className={cn("flex items-center justify-between mb-4 border-b-2 border-secondary pb-1 px-2", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
             <h2 className="text-base md:text-lg font-black text-primary">استكشف كافة المتاجر المعتمدة</h2>
             <Link href="/catalog" className="text-[10px] font-bold text-muted-foreground hover:text-secondary">مشاهدة المزيد</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 px-1" dir="rtl">
            {loadingStores ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-zinc-200 animate-pulse rounded-xl" />)
            ) : allStores?.length > 0 ? (
              allStores.slice(0, 12).map((store) => (
                <Link key={store.id} href={`/catalog?query=${encodeURIComponent(store.name)}`} className="bg-white p-3 rounded-xl shadow-sm border hover:shadow-md transition-all flex items-center gap-4 flex-row-reverse text-right group">
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden relative border shrink-0">
                     <Image src={store.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${store.name}`} alt={store.name} fill className="object-cover" />
                   </div>
                   <div className="flex-grow">
                      <h3 className="font-black text-xs md:text-sm text-primary group-hover:text-secondary truncate">{store.name}</h3>
                      <p className="text-[9px] text-muted-foreground flex items-center gap-1 justify-end"><MapPin size={10} className="text-secondary" /> {store.wilaya || 'الجزائر'}</p>
                      <div className="mt-0.5 flex items-center gap-1 justify-end"><ShieldCheck size={10} className="text-green-500" /><span className="text-[7px] font-black text-zinc-400">معتمد</span></div>
                   </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-10 bg-white rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-zinc-300">
                  <Search size={32} className="opacity-10 mb-2" />
                  <p className="font-black text-xs">لا توجد متاجر نشطة حالياً.</p>
              </div>
            )}
          </div>
        </section>

        {/* NEW: Explore Car Parts Section */}
        <section className="w-full px-1 md:px-2 py-6">
          <div className="flex items-center justify-between mb-4 border-b-2 border-primary/10 pb-1 px-2 flex-row-reverse">
             <div className="text-right">
                <h2 className="text-lg md:text-xl font-black text-primary flex items-center justify-end gap-2">
                   أحدث قطع الغيار المضافة <Package size={20} className="text-secondary" />
                </h2>
                <p className="text-[10px] text-muted-foreground font-bold">تصفح القطع المتوفرة حالياً في كافة الولايات.</p>
             </div>
             <Link href="/catalog" className="text-[10px] font-bold text-secondary hover:underline">عرض كافة القطع</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1" dir="rtl">
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

        {/* NEW: Featured Products Section */}
        {activeFeaturedProducts && activeFeaturedProducts.length > 0 && (
          <section className="w-full px-1 md:px-2 py-6 bg-zinc-900 text-white rounded-t-[32px] mt-6">
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
