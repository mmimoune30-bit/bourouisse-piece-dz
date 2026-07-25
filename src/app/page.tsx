"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, MapPin, ChevronRight, ShieldCheck, Star, ArrowRight, Store, ExternalLink, Crown, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, updateDoc, doc, increment } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";

const BANNERS = [
  {
    id: 1,
    image: "https://picsum.photos/seed/warehouse-dz/1200/400",
    link: "/seller/register",
    hint: "parts warehouse",
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
    hint: "car engine",
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
  const [lang, setLang] = useState<"AR" | "EN">("AR");
  const [api, setApi] = useState<CarouselApi>();

  // جلب كافة الحملات الإعلانية النشطة
  const allCampaignsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "featured_stores");
  }, [firestore]);

  const { data: allCampaigns, loading: loadingCampaigns } = useCollection(allCampaignsQuery);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // المتاجر الحصرية (تظهر في السلايدر العلوي)
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

  // المتاجر المميزة (تظهر في الشريط السفلي)
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

  // جلب كافة المتاجر المعتمدة (للقسم السفلي)
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

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-zinc-50">
      <Navbar />

      <main className="flex-grow pt-[170px]">
        {/* Hero Section - Exclusive Stores Slider */}
        <section className="container mx-auto px-4 mt-6">
          <div className="flex flex-col md:flex-row-reverse gap-4" dir="rtl">
            <div className="md:w-3/4 h-[250px] bg-white rounded-[32px] border-2 border-primary/5 shadow-sm overflow-hidden flex flex-col relative">
              <div className="bg-primary/5 px-6 py-3 border-b flex items-center justify-between shrink-0 z-20">
                 <h2 className="font-black text-primary flex items-center gap-2">
                   <Crown size={18} className="text-secondary fill-secondary" /> متاجر حصرية
                 </h2>
                 <Link href="/catalog" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                   تصفح كافة المتاجر <ArrowLeft size={14} />
                 </Link>
              </div>
              
              <div className="flex-grow relative overflow-hidden">
                {loadingCampaigns ? (
                  <div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : exclusiveStores?.length > 0 ? (
                  <Carousel setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="w-full h-full">
                    <CarouselContent className="h-[194px]">
                      {exclusiveStores.map((campaign, i) => (
                        <CarouselItem key={i} className="h-full">
                          <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} onClick={() => handleStoreClick(campaign.id)} className="w-full h-full flex items-center gap-8 px-10 hover:bg-zinc-50/50 transition-colors group">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden relative border-4 border-white shadow-xl shrink-0">
                               <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt={campaign.storeName} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col gap-2 text-right">
                               <Badge className="bg-secondary text-primary font-black w-fit mr-auto"><Crown size={12} /> متجر حصري</Badge>
                               <h3 className="font-black text-3xl text-primary group-hover:text-secondary transition-colors line-clamp-1">{campaign.storeName}</h3>
                               <p className="text-sm text-muted-foreground font-bold flex items-center gap-2 justify-end"><MapPin size={16} className="text-secondary" /> {campaign.storeLocation}</p>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground font-bold italic px-10 text-center">
                    لا توجد إعلانات حصرية نشطة حالياً. اشترك لظهور متجرك هنا!
                  </div>
                )}
              </div>
            </div>

            {/* Static Promotions Slider */}
            <div className="md:w-1/4 h-[250px] relative rounded-[32px] overflow-hidden group shadow-xl border-4 border-white">
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[Autoplay({ delay: 4000 }), Fade()]}>
                <CarouselContent className="h-[250px]">
                  {BANNERS.map((banner) => {
                    const content = lang === "AR" ? banner.ar : banner.en;
                    return (
                      <CarouselItem key={banner.id} className="h-full">
                        <div className="relative h-full w-full flex items-center justify-center">
                          <Image src={banner.image} alt={content.title} fill className="object-cover" priority />
                          <div className="absolute inset-0 bg-black/70" />
                          <div className="relative z-10 p-6 text-center text-white space-y-3">
                             <h3 className="text-xl font-black">{content.title}</h3>
                             <Link href={banner.link} className="block"><Button size="sm" className="w-full bg-secondary text-primary font-black rounded-xl">{content.button}</Button></Link>
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

        {/* Featured Slider - Small Cards */}
        {featuredStores && featuredStores.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-6 flex-row-reverse">
              <h2 className="text-2xl font-black text-primary flex items-center gap-2">
                <Star size={20} className="text-blue-500 fill-blue-500" /> متاجر مميزة
              </h2>
            </div>
            <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
              <CarouselContent className="-ml-4" dir="rtl">
                {featuredStores.map((campaign, i) => (
                  <CarouselItem key={i} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                    <Link href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`} onClick={() => handleStoreClick(campaign.id)} className="bg-white p-6 rounded-[32px] border-2 border-transparent hover:border-blue-100 hover:shadow-xl transition-all block text-center space-y-4 h-full">
                       <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden relative border-2 border-zinc-50 shadow-sm">
                         <Image src={campaign.storeLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign.storeName}`} alt={campaign.storeName} fill className="object-cover" />
                       </div>
                       <div>
                         <h4 className="font-black text-primary truncate">{campaign.storeName}</h4>
                         <p className="text-xs text-muted-foreground font-bold">{campaign.storeLocation}</p>
                       </div>
                       <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-600 bg-blue-50">متجر مميز</Badge>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
        )}

        {/* Live Stores Section - All Verified */}
        <section className="container mx-auto px-4 py-16">
          <div className={cn("flex items-center justify-between mb-8 border-b-4 border-secondary pb-3", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
             <h2 className="text-3xl font-black text-primary">{lang === 'AR' ? 'استكشف كافة المتاجر المعتمدة' : 'Explore All Verified Stores'}</h2>
             <Link href="/catalog" className="text-sm font-bold text-muted-foreground hover:text-secondary">{lang === 'AR' ? 'مشاهدة المزيد' : 'View More'}</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir="rtl">
            {loadingStores ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-zinc-200 animate-pulse rounded-3xl" />)
            ) : allStores?.length > 0 ? (
              allStores.slice(0, 12).map((store) => (
                <Link key={store.id} href={`/catalog?query=${encodeURIComponent(store.name)}`} className="bg-white p-6 rounded-3xl shadow-sm border hover:shadow-xl transition-all flex items-center gap-6 flex-row-reverse text-right group">
                   <div className="w-20 h-20 rounded-2xl overflow-hidden relative border-2 border-zinc-100 shrink-0">
                     <Image src={store.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${store.name}`} alt={store.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                   </div>
                   <div className="flex-grow">
                      <h3 className="font-black text-xl text-primary group-hover:text-secondary transition-colors">{store.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end"><MapPin size={14} className="text-secondary" /> {store.wilaya || 'الجزائر'}</p>
                      <div className="mt-2 flex items-center gap-2 justify-end">
                        <ShieldCheck size={16} className="text-green-500" />
                        <span className="text-[10px] font-black text-zinc-400 uppercase">متجر معتمد</span>
                      </div>
                   </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-muted-foreground font-bold">لا توجد متاجر نشطة حالياً في النظام.</div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
