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
  Search
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, where, updateDoc, doc, increment, setDoc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import { toast } from "@/hooks/use-toast";

const BANNERS = [
  {
    id: 1,
    image: "https://picsum.photos/seed/warehouse-dz/1200/400",
    link: "/seller/register",
    ar: {
      title: "اشترك معنا واعرض منتجاتك",
      description: "اعرض قطع الغيار الجديدة والمستعملة ووصل إلى آلاف المشترين.",
      button: "سجل كبائع"
    },
    en: {
      title: "Join Us & List Your Products",
      description: "List new and used spare parts and reach thousands of buyers.",
      button: "Register as Seller"
    }
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/engine-dz/1200/400",
    link: "/catalog",
    ar: {
      title: "ابحث عن قطع الغيار بسهولة",
      description: "محرك بحث متطور حسب الماركة والموديل وسنة الصنع بدقة متناهية.",
      button: "ابدأ البحث"
    },
    en: {
      title: "Find Auto Parts Easily",
      description: "Advanced search by brand, model and manufacturing year.",
      button: "Start Searching"
    }
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

  const categoryMetaQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "categories_metadata");
  }, [firestore]);

  const { data: categoriesMeta } = useCollection(categoryMetaQuery);

  const categoryImagesMap = useMemo(() => {
    const map: Record<string, string> = {};
    categoriesMeta?.forEach(meta => {
      map[meta.id] = meta.imageUrl;
    });
    return map;
  }, [categoriesMeta]);

  const allCampaignsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "featured_stores");
  }, [firestore]);

  const { data: allCampaigns, loading: loadingCampaigns } = useCollection(allCampaignsQuery);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const exclusiveStores = useMemo(() => {
    return (allCampaigns || [])
      .filter(c => 
        c.tier === "Exclusive" && 
        c.status === "Active" && 
        c.startDate <= today && 
        c.endDate >= today
      )
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }, [allCampaigns, today]);

  const featuredStores = useMemo(() => {
    return (allCampaigns || [])
      .filter(c => 
        c.tier === "Featured" && 
        c.status === "Active" && 
        c.startDate <= today && 
        c.endDate >= today
      )
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }, [allCampaigns, today]);

  const allStoresQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "users"),
      where("role", "==", "Seller"),
      where("status", "==", "Active")
    );
  }, [firestore]);

  const { data: allStores, loading: loadingStores } = useCollection(allStoresQuery);

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
    if (!firestore) return;
    updateDoc(doc(firestore, "featured_stores", campaignId), {
      "stats.clicks": increment(1)
    });
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
        await setDoc(doc(firestore, "categories_metadata", catEn), {
          imageUrl: compressed,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        toast({ title: "تم التحديث", description: "تم تحديث صورة التصنيف بنجاح." });
      };
    } catch (err) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر رفع الصورة." });
    } finally {
      setUploadingCat(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-zinc-50">
      <Navbar />

      <main className="flex-grow pt-[170px] md:pt-[190px]">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />

        <section className="container mx-auto px-4 mt-2">
          <div className="flex flex-col lg:flex-row-reverse gap-4" dir="rtl">
            <div className="lg:w-3/4 min-h-[180px] md:h-[220px] bg-white rounded-[24px] border-2 border-primary/5 shadow-sm overflow-hidden flex flex-col relative">
              <div className="bg-primary/5 px-4 md:px-6 py-2 border-b flex items-center justify-between shrink-0 z-20">
                 <h2 className="font-black text-xs md:text-sm text-primary flex items-center gap-2">
                   <Crown size={16} className="text-secondary fill-secondary" /> متاجر حصرية
                 </h2>
                 <Link href="/catalog" className="text-[10px] font-bold text-secondary hover:underline flex items-center gap-1">
                   {lang === 'AR' ? 'تصفح كافة المتاجر' : 'Browse Stores'} <ArrowLeft size={12} />
                 </Link>
              </div>
              
              <div className="flex-grow relative overflow-hidden">
                {loadingCampaigns ? (
                  <div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : exclusiveStores?.length > 0 ? (
                  <Carousel setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="w-full h-full">
                    <CarouselContent className="h-full">
                      {exclusiveStores.map((campaign, i) => (
                        <CarouselItem key={i} className="h-full">
                          <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} onClick={() => handleStoreClick(campaign.id)} className="w-full h-full flex items-center gap-4 md:gap-8 px-4 md:px-12 hover:bg-zinc-50/50 transition-colors group py-4">
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl overflow-hidden relative border-4 border-white shadow-lg shrink-0">
                               <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt={campaign.storeName} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                               <Badge className="bg-secondary text-primary font-black text-[10px] md:text-xs w-fit mr-auto py-0 h-5 md:h-6"><Crown size={10} className="hidden sm:inline" /> متجر حصري</Badge>
                               <h3 className="font-black text-lg md:text-3xl text-primary group-hover:text-secondary transition-colors line-clamp-1">{campaign.storeName}</h3>
                               <p className="text-xs md:text-sm text-muted-foreground font-bold flex items-center gap-1 md:gap-2 justify-end"><MapPin size={14} className="text-secondary" /> {campaign.storeLocation}</p>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground font-bold italic px-10 text-center text-xs md:text-sm">
                    لا توجد إعلانات حصرية نشطة حالياً.
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-1/4 h-[120px] lg:h-[220px] relative rounded-[24px] overflow-hidden group shadow-lg border-4 border-white">
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[Autoplay({ delay: 4000 }), Fade()]}>
                <CarouselContent className="h-full">
                  {BANNERS.map((banner) => {
                    const content = lang === "AR" ? banner.ar : banner.en;
                    return (
                      <CarouselItem key={banner.id} className="h-full">
                        <div className="relative h-full w-full flex items-center justify-center">
                          <Image src={banner.image} alt={content.title} fill className="object-cover" priority />
                          <div className="absolute inset-0 bg-black/70" />
                          <div className="relative z-10 p-4 text-center text-white space-y-2">
                             <h3 className="text-xs md:text-sm font-black leading-tight">{content.title}</h3>
                             <Link href={banner.link} className="block">
                               <Button size="sm" className="w-full h-8 md:h-10 text-[10px] md:text-xs bg-secondary text-primary font-black rounded-lg">{content.button}</Button>
                             </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-4 mt-2">
          <div className="flex flex-row-reverse justify-between items-center mb-4 gap-3 border-b pb-2">
             <div className="text-right">
                <h2 className="text-base md:text-lg font-black text-primary flex items-center justify-end gap-2">
                   تصنيفات قطع الغيار <Tags size={18} className="text-secondary" />
                </h2>
             </div>
             <Link href="/catalog">
               <Button variant="link" className="text-secondary font-black text-[10px] md:text-xs h-auto p-0">عرض الكل <ArrowLeft size={14} /></Button>
             </Link>
          </div>
          
          <div className="flex flex-row-reverse gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scroll-smooth" dir="rtl">
            {PART_CATEGORIES.map((cat, i) => {
              const categoryImage = categoryImagesMap[cat.en] || `https://picsum.photos/seed/cat-${i}/200/200`;
              return (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0 group">
                  <Link 
                    href={`/catalog?category=${encodeURIComponent(cat.en)}`}
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-primary/5 bg-white shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
                  >
                    <Image src={categoryImage} alt={cat.en} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    <div className="absolute inset-0 bg-black/5" />
                  </Link>
                  <Link href={`/catalog?category=${encodeURIComponent(cat.en)}`}>
                    <Button 
                      variant="outline" 
                      className="h-7 md:h-8 px-3 md:px-4 rounded-lg border-2 border-primary/5 bg-white hover:bg-primary hover:text-white hover:border-primary font-black text-[9px] md:text-[10px] transition-all"
                    >
                      {lang === 'AR' ? cat.ar : cat.en}
                    </Button>
                  </Link>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => handleUploadImage(cat.en)}
                      disabled={uploadingCat === cat.en}
                      className="mt-1 flex items-center gap-1 text-primary hover:text-secondary transition-colors"
                    >
                      {uploadingCat === cat.en ? (
                        <Loader2 className="animate-spin" size={10} />
                      ) : (
                        <>
                          <Camera size={10} />
                          <span className="text-[8px] font-bold">تغيير الصورة</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {featuredStores && featuredStores.length > 0 && (
          <section className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4 flex-row-reverse">
              <h2 className="text-base md:text-lg font-black text-primary flex items-center gap-2">
                <Star size={16} className="text-blue-500 fill-blue-500" /> متاجر مميزة
              </h2>
            </div>
            <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4" dir="rtl">
                {featuredStores.map((campaign, i) => (
                  <CarouselItem key={i} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/5 xl:basis-1/6">
                    <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} onClick={() => handleStoreClick(campaign.id)} className="bg-white p-4 rounded-[24px] border-2 border-transparent hover:border-blue-100 hover:shadow-md transition-all block text-center space-y-2 h-full">
                       <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-xl overflow-hidden relative border-2 border-zinc-50 shadow-sm">
                         <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt={campaign.storeName} fill className="object-cover" />
                       </div>
                       <div>
                         <h4 className="font-black text-primary text-[10px] md:text-xs truncate">{campaign.storeName}</h4>
                         <p className="text-[8px] md:text-[10px] text-muted-foreground font-bold">{campaign.storeLocation}</p>
                       </div>
                       <Badge variant="outline" className="text-[8px] h-4 border-blue-200 text-blue-600 bg-blue-50">مميز</Badge>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
        )}

        <section className="container mx-auto px-4 py-8">
          <div className={cn("flex items-center justify-between mb-6 border-b-2 border-secondary pb-2", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
             <h2 className="text-lg md:text-xl font-black text-primary">{lang === 'AR' ? 'استكشف كافة المتاجر المعتمدة' : 'Explore All Verified Stores'}</h2>
             <Link href="/catalog" className="text-xs font-bold text-muted-foreground hover:text-secondary">{lang === 'AR' ? 'مشاهدة المزيد' : 'View More'}</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" dir="rtl">
            {loadingStores ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-zinc-200 animate-pulse rounded-2xl" />)
            ) : allStores?.length > 0 ? (
              allStores.slice(0, 12).map((store) => (
                <Link key={store.id} href={`/catalog?query=${encodeURIComponent(store.name)}`} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border hover:shadow-lg transition-all flex items-center gap-4 md:gap-6 flex-row-reverse text-right group">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden relative border-2 border-zinc-100 shrink-0">
                     <Image src={store.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${store.name}`} alt={store.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                   </div>
                   <div className="flex-grow">
                      <h3 className="font-black text-sm md:text-xl text-primary group-hover:text-secondary transition-colors line-clamp-1">{store.name}</h3>
                      <p className="text-[10px] md:text-sm text-muted-foreground flex items-center gap-1 justify-end"><MapPin size={14} className="text-secondary" /> {store.wilaya || 'الجزائر'}</p>
                      <div className="mt-1 flex items-center gap-1 justify-end">
                        <ShieldCheck size={14} className="text-green-500" />
                        <span className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase">متجر معتمد</span>
                      </div>
                   </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 md:py-32 bg-white rounded-[32px] md:rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center text-zinc-400">
                  <Search className="opacity-10 mb-4 w-12 h-12 md:w-16 md:h-16" />
                  <p className="font-black text-base md:text-lg text-primary/40 px-6 text-center">لا توجد متاجر نشطة حالياً في النظام.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}