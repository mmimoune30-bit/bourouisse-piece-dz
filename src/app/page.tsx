
"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, MapPin, ChevronRight, ShieldCheck, Star, ArrowRight, Store, ExternalLink, Crown, Sparkles } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, orderBy, updateDoc, doc, increment } from "firebase/firestore";

const BANNERS = [
  {
    id: 1,
    image: PlaceHolderImages.find(img => img.id === "hero-banner-1")?.imageUrl || "https://picsum.photos/seed/warehouse/1200/400",
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
    image: PlaceHolderImages.find(img => img.id === "hero-banner-2")?.imageUrl || "https://picsum.photos/seed/engine/1200/400",
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
  const [current, setCurrent] = useState(0);

  // جلب المتاجر الحصرية (Exclusive) للظهور في السلايدر العلوي
  const exclusiveQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "featured_stores"),
      where("tier", "==", "Exclusive"),
      where("status", "==", "Active"),
      orderBy("priority", "desc")
    );
  }, [firestore]);

  const { data: exclusiveStores, loading: loadingExclusive } = useCollection(exclusiveQuery);

  // جلب المتاجر المميزة (Featured) للظهور في القسم السفلي
  const featuredQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "featured_stores"),
      where("tier", "==", "Featured"),
      where("status", "==", "Active"),
      orderBy("priority", "desc")
    );
  }, [firestore]);

  const { data: featuredStores } = useCollection(featuredQuery);

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN";
      if (savedLang) setLang(savedLang);
    };

    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleStoreClick = (campaignId: string) => {
    if (!firestore) return;
    updateDoc(doc(firestore, "featured_stores", campaignId), {
      "stats.clicks": increment(1)
    });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-zinc-50">
      <Navbar />

      <main className="flex-grow pt-[145px]">
        {/* Hero Section Split into Two Parts */}
        <section className="container mx-auto px-4 mt-6">
          <div className="flex flex-col md:flex-row-reverse gap-4" dir="rtl">
            
            {/* Part 1: Exclusive Stores (Right - 3/4 Width) */}
            <div className="md:w-3/4 h-[250px] bg-white rounded-[32px] border-2 border-primary/5 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-primary/5 px-6 py-3 border-b flex items-center justify-between shrink-0">
                 <h2 className="font-black text-primary flex items-center gap-2">
                   <Crown size={18} className="text-secondary fill-secondary" /> متاجر حصرية (إعلان ممول)
                 </h2>
                 <Link href="/catalog" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                   تصفح كافة المتاجر <ArrowLeft size={14} />
                 </Link>
              </div>
              
              <div className="flex-grow relative">
                {loadingExclusive ? (
                  <div className="h-full w-full flex items-center justify-center animate-pulse bg-zinc-50">
                    <span className="font-bold text-zinc-400">جاري جلب المتاجر المميزة...</span>
                  </div>
                ) : exclusiveStores?.length > 0 ? (
                  <Carousel 
                    opts={{ loop: true }} 
                    plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
                    className="w-full h-full"
                  >
                    <CarouselContent className="h-[194px]">
                      {exclusiveStores.map((campaign, i) => (
                        <CarouselItem key={i} className="h-full">
                          <Link 
                            href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`}
                            onClick={() => handleStoreClick(campaign.id)}
                            className="w-full h-full flex items-center gap-8 px-10 hover:bg-zinc-50/50 transition-colors group"
                          >
                            <div className="w-32 h-32 rounded-3xl overflow-hidden relative border-4 border-white shadow-xl shrink-0 group-hover:scale-105 transition-transform">
                               <Image src={campaign.storeLogo || "https://picsum.photos/seed/store/200/200"} alt={campaign.storeName} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col gap-2">
                               <div className="flex items-center gap-2">
                                  <Badge className="bg-secondary text-primary font-black px-3 py-1 flex items-center gap-1">
                                    <Crown size={12} /> حصري
                                  </Badge>
                                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">موثق</span>
                               </div>
                               <h3 className="font-black text-3xl text-primary group-hover:text-secondary transition-colors">{campaign.storeName}</h3>
                               <p className="text-sm text-muted-foreground font-bold flex items-center gap-2">
                                  <MapPin size={16} className="text-secondary" /> مقر المتجر: {campaign.storeLocation}
                               </p>
                               <div className="mt-2 flex gap-3">
                                  <Button size="sm" variant="outline" className="rounded-xl font-bold border-2 gap-2">
                                     زيارة المتجر <ExternalLink size={14} />
                                  </Button>
                               </div>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground font-bold italic">
                     لا توجد إعلانات حصرية حالياً.
                  </div>
                )}
              </div>
            </div>

            {/* Part 2: Banners & Promos (Left - 1/4 Width) */}
            <div className="md:w-1/4 h-[250px] relative rounded-[32px] overflow-hidden group shadow-xl border-4 border-white">
              <Carousel 
                setApi={setApi}
                className="w-full h-full" 
                opts={{ loop: true, duration: 50 }}
                plugins={[Autoplay({ delay: 4000, stopOnInteraction: true }), Fade()]}
              >
                <CarouselContent className="h-[250px]">
                  {BANNERS.map((banner) => {
                    const content = lang === "AR" ? banner.ar : banner.en;
                    return (
                      <CarouselItem key={banner.id} className="h-full">
                        <div className="relative h-full w-full flex items-center justify-center">
                          <Image
                            src={banner.image}
                            alt={content.title}
                            fill
                            className="object-cover animate-ken-burns"
                            priority
                          />
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
                          
                          <div className="relative z-10 p-6 text-center text-white space-y-3">
                             <h3 className="text-xl font-black leading-tight tracking-tight">{content.title}</h3>
                             <p className="text-[10px] text-blue-100 font-bold opacity-80 line-clamp-2">{content.description}</p>
                             <Link href={banner.link} className="block">
                                <Button size="sm" className="w-full bg-secondary text-primary font-black rounded-xl h-10 hover:bg-white transition-all shadow-lg">
                                  {content.button}
                                </Button>
                             </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                 {BANNERS.map((_, index) => (
                   <div key={index} className={cn("w-1.5 h-1.5 rounded-full transition-all", current === index ? "bg-secondary w-4" : "bg-white/30")} />
                 ))}
              </div>
            </div>

          </div>
        </section>

        {/* Middle Section (Featured Stores Slider) */}
        {featuredStores && featuredStores.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-6 flex-row-reverse">
              <h2 className="text-2xl font-black text-primary flex items-center gap-2">
                 <Star size={20} className="text-blue-500 fill-blue-500" /> متاجر مميزة
              </h2>
            </div>
            <div className="relative">
               <Carousel 
                  opts={{ align: "start", dragFree: true }} 
                  className="w-full"
               >
                 <CarouselContent className="-ml-4" dir="rtl">
                   {featuredStores.map((campaign, i) => (
                     <CarouselItem key={i} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                       <Link 
                        href={`/catalog?query=${encodeURIComponent(campaign.storeName)}`}
                        onClick={() => handleStoreClick(campaign.id)}
                        className="bg-white p-6 rounded-[32px] border-2 border-transparent hover:border-blue-100 hover:shadow-xl transition-all block text-center space-y-4"
                       >
                          <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden relative border-2 border-zinc-50 shadow-sm">
                             <Image src={campaign.storeLogo || "https://picsum.photos/seed/store/200/200"} alt={campaign.storeName} fill className="object-cover" />
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
            </div>
          </section>
        )}

        {/* Bottom Section (All Stores) */}
        <section className="container mx-auto px-4 py-16">
          <div className={cn(
            "flex items-center justify-between mb-8 border-b-4 border-secondary pb-3",
            lang === 'AR' ? "flex-row-reverse" : "flex-row"
          )}>
             <h2 className="text-3xl font-black text-primary">
               {lang === 'AR' ? 'تصفح كافة المتاجر' : 'Explore All Stores'}
             </h2>
             <Link href="/catalog" className="text-sm font-bold text-muted-foreground hover:text-secondary">
               {lang === 'AR' ? 'مشاهدة المزيد' : 'View More'}
             </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir="rtl">
            {/* عرض عينة من المتاجر العادية */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-white p-6 rounded-3xl shadow-sm border hover:shadow-xl transition-all flex items-center gap-6 group flex-row-reverse text-right"
              >
                 <div className="w-20 h-20 rounded-2xl overflow-hidden relative border-2 border-zinc-100 shrink-0">
                    <Image src={`https://picsum.photos/seed/${i+100}/200/200`} alt="Store" fill className="object-cover group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="flex-grow">
                    <h3 className="font-black text-xl text-primary group-hover:text-secondary transition-colors">متجر الغيار السريع</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                      <MapPin size={14} className="text-secondary" /> ولاية الشلف
                    </p>
                    <div className="mt-2 flex items-center gap-2 justify-end">
                       <ShieldCheck size={16} className="text-zinc-400" />
                       <span className="text-[10px] font-black text-zinc-400 uppercase">
                         متجر مسجل
                       </span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
