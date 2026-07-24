
"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, MapPin, ChevronRight, ShieldCheck, Star, ArrowRight, Store } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";

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

const FEATURED_STORES = [
  { name: "Auto Pièces Chlef", location: "الشلف", logo: PlaceHolderImages.find(img => img.id === "store-logo-1")?.imageUrl || "https://picsum.photos/seed/shop1/100/100", hint: "automotive shop" },
  { name: "Pièces Renault DZ", location: "الجزائر", logo: PlaceHolderImages.find(img => img.id === "store-logo-2")?.imageUrl || "https://picsum.photos/seed/shop2/100/100", hint: "renault parts" },
  { name: "EliteMotors DZ", location: "وهران", logo: PlaceHolderImages.find(img => img.id === "store-logo-3")?.imageUrl || "https://picsum.photos/seed/shop3/100/100", hint: "engine mechanic" },
];

export default function Home() {
  const [lang, setLang] = useState<"AR" | "EN">("AR");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-zinc-50">
      <Navbar />

      <main className="flex-grow pt-[145px]">
        {/* New Hero Section Split into Two Parts */}
        <section className="container mx-auto px-4 mt-6">
          <div className="flex flex-col md:flex-row-reverse gap-4" dir="rtl">
            
            {/* Part 1: Featured Stores (Right - 3/4 Width) */}
            <div className="md:w-3/4 h-[250px] bg-white rounded-[32px] border-2 border-primary/5 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-primary/5 px-6 py-3 border-b flex items-center justify-between">
                 <h2 className="font-black text-primary flex items-center gap-2">
                   <Star size={18} className="text-secondary fill-secondary" /> متاجر متميزة (حصري)
                 </h2>
                 <Link href="/catalog" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                   عرض كافة المتاجر <ArrowLeft size={14} />
                 </Link>
              </div>
              <div className="flex-grow p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {FEATURED_STORES.map((store, i) => (
                   <Link 
                     key={i} 
                     href={`/catalog?query=${encodeURIComponent(store.name)}`}
                     className="bg-zinc-50 hover:bg-zinc-100 p-4 rounded-2xl border flex flex-col items-center text-center group transition-all"
                   >
                     <div className="w-16 h-16 rounded-xl overflow-hidden relative mb-3 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                        <Image src={store.logo} alt={store.name} fill className="object-cover" />
                     </div>
                     <h3 className="font-black text-sm text-primary line-clamp-1 group-hover:text-secondary transition-colors">{store.name}</h3>
                     <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-1">
                        <MapPin size={10} className="text-secondary" /> {store.location}
                     </p>
                     <div className="mt-2 flex items-center gap-1">
                        <ShieldCheck size={12} className="text-blue-500" />
                        <span className="text-[8px] font-black text-blue-600 uppercase">موثق</span>
                     </div>
                   </Link>
                 ))}
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
              {/* Dots for the mini carousel */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                 {BANNERS.map((_, index) => (
                   <div key={index} className={cn("w-1.5 h-1.5 rounded-full transition-all", current === index ? "bg-secondary w-4" : "bg-white/30")} />
                 ))}
              </div>
            </div>

          </div>
        </section>

        {/* Bottom Section (Featured Stores) - Retained but labelled as "Explore All" */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_STORES.map((store, i) => (
              <Link 
                key={i} 
                href={`/catalog?query=${encodeURIComponent(store.name)}`}
                className={cn(
                  "bg-white p-6 rounded-3xl shadow-sm border hover:shadow-xl transition-all flex items-center gap-6 group",
                  lang === 'AR' ? "flex-row-reverse text-right" : "flex-row text-left"
                )}
              >
                 <div className="w-20 h-20 rounded-2xl overflow-hidden relative border-2 border-secondary/20 shrink-0">
                    <Image src={store.logo} alt={store.name} fill className="object-cover group-hover:scale-110 transition-transform" data-ai-hint={store.hint} />
                 </div>
                 <div className="flex-grow" dir={lang === 'AR' ? "rtl" : "ltr"}>
                    <h3 className="font-black text-xl text-primary group-hover:text-secondary transition-colors">{store.name}</h3>
                    <p className={cn(
                      "text-sm text-muted-foreground flex items-center gap-1",
                      lang === 'AR' ? "justify-end" : "justify-start"
                    )}>
                      <MapPin size={14} className="text-secondary" /> {store.location}
                    </p>
                    <div className={cn(
                      "mt-2 flex items-center gap-2",
                      lang === 'AR' ? "justify-end" : "justify-start"
                    )}>
                       <ShieldCheck size={16} className="text-blue-500" />
                       <span className="text-[10px] font-black text-blue-600 uppercase">
                         {lang === 'AR' ? 'متجر معتمد' : 'Verified Store'}
                       </span>
                    </div>
                 </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
