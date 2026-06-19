
"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import AISearchBox from "@/components/ai-search-box";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, UserPlus, Store, Search, ShieldCheck, MapPin, ChevronRight, ChevronLeft, LayoutGrid } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";

const BANNERS = [
  {
    id: 1,
    image: "https://picsum.photos/seed/auto-hero-1/1200/800",
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
    image: "https://picsum.photos/seed/auto-hero-2/1200/800",
    link: "/catalog",
    ar: {
      title: "ابحث عن قطع الغيار بسهولة",
      description: "ابحث حسب الماركة والموديل وسنة الصنع.",
      button: "ابدأ البحث"
    },
    en: {
      title: "Find Auto Parts Easily",
      description: "Search by brand, model and manufacturing year.",
      button: "Start Searching"
    }
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/auto-hero-3/1200/800",
    link: "/catalog",
    ar: {
      title: "آلاف قطع الغيار في مكان واحد",
      description: "منتجات جديدة ومستعملة من مختلف ولايات الجزائر.",
      button: "تصفح الإعلانات"
    },
    en: {
      title: "Thousands of Parts in One Place",
      description: "New and used products from various Algerian wilayas.",
      button: "Browse Listings"
    }
  },
  {
    id: 4,
    image: "https://picsum.photos/seed/auto-hero-4/1200/800",
    link: "/catalog",
    ar: {
      title: "متاجر موثوقة ومعتمدة",
      description: "اكتشف المتاجر الموثقة وتواصل مباشرة مع البائعين.",
      button: "استكشف المتاجر"
    },
    en: {
      title: "Trusted & Certified Stores",
      description: "Discover verified stores and connect directly with sellers.",
      button: "Explore Stores"
    }
  },
  {
    id: 5,
    image: "https://picsum.photos/seed/auto-hero-5/1200/800",
    link: "/join",
    ar: {
      title: "أنشئ حسابك مجاناً",
      description: "سجل الآن كبائع أو مشتري واستفد من جميع خدمات المنصة.",
      button: "اشترك معنا"
    },
    en: {
      title: "Create Your Free Account",
      description: "Register now as a seller or buyer and benefit from all platform services.",
      button: "Join Us"
    }
  }
];

const FEATURED_PRODUCTS = [
  { id: "p1", name: "مصباح أمامي أيمن Clio 4", price: 8500, image: PlaceHolderImages[5].imageUrl, category: "إضاءة", seller: "Auto Pièces Chlef", condition: "New" as const },
  { id: "p3", name: "رادياتور Peugeot 208", price: 12000, image: PlaceHolderImages[4].imageUrl, category: "المحرك", seller: "Pièces Renault DZ", condition: "New" as const },
  { id: "p2", name: "باب أمامي أيسر Clio 4", price: 25000, image: PlaceHolderImages[6].imageUrl, category: "هيكل", seller: "Auto Pièces Chlef", condition: "Used" as const },
  { id: "p4", name: "صدام أمامي Peugeot 301", price: 18000, image: PlaceHolderImages[5].imageUrl, category: "هيكل", seller: "Pièces Renault DZ", condition: "Used" as const }
];

const FEATURED_STORES = [
  { name: "Auto Pièces Chlef", location: "الشلف", logo: PlaceHolderImages[4].imageUrl },
  { name: "Pièces Renault DZ", location: "الجزائر", logo: PlaceHolderImages[5].imageUrl },
  { name: "EliteMotors DZ", location: "وهران", logo: PlaceHolderImages[6].imageUrl },
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

      <main className="flex-grow pt-[235px]">
        {/* AI SEARCH BOX */}
        <AISearchBox />

        {/* Dynamic Multi-language Hero Section - Resized to fit better */}
        <section className="relative w-full">
          <Carousel 
            setApi={setApi}
            className="w-full" 
            opts={{ 
              loop: true,
              duration: 50
            }}
            plugins={[
              Autoplay({ delay: 5000, stopOnInteraction: true }),
              Fade()
            ]}
          >
            <CarouselContent>
              {BANNERS.map((banner) => {
                const content = lang === "AR" ? banner.ar : banner.en;
                return (
                  <CarouselItem key={banner.id}>
                    <div className="relative min-h-[400px] lg:min-h-[500px] flex items-center justify-center py-10 overflow-hidden">
                      {/* Clickable Background Image */}
                      <Link href={banner.link} className="absolute inset-0 z-0 group cursor-pointer block">
                        <Image
                          src={banner.image}
                          alt={content.title}
                          fill
                          className="object-cover animate-ken-burns"
                          priority
                        />
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] group-hover:bg-black/40 transition-colors" />
                      </Link>

                      <div className="container mx-auto px-4 z-10 pointer-events-none">
                        <div className={cn(
                          "max-w-4xl transition-all duration-1000 transform translate-y-0 opacity-100 pointer-events-auto",
                          lang === "AR" ? "mr-auto text-right" : "ml-auto text-left"
                        )} dir={lang === "AR" ? "rtl" : "ltr"}>
                          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase drop-shadow-2xl leading-tight">
                            {content.title}
                          </h1>
                          <p className="text-lg md:text-xl text-secondary font-bold italic mb-8 leading-relaxed max-w-2xl opacity-90">
                            {content.description}
                          </p>
                          <div className={cn(
                            "flex flex-col sm:flex-row gap-4",
                            lang === "AR" ? "sm:justify-start" : "sm:justify-start"
                          )}>
                            <Link href={banner.link}>
                              <Button size="lg" className="h-14 px-10 text-lg font-black gap-3 bg-secondary text-primary hover:bg-white transition-all rounded-xl shadow-2xl">
                                {content.button} {lang === 'AR' ? <ArrowLeft size={20} /> : <ChevronRight size={20} />}
                              </Button>
                            </Link>
                            <Link href="/catalog">
                              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-black border-2 border-white text-white hover:bg-white hover:text-primary transition-all rounded-xl shadow-2xl">
                                {lang === 'AR' ? 'تصفح كافة القطع' : 'Browse All Parts'}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
               <CarouselPrevious className="static translate-y-0 h-10 w-10 bg-white/20 border-white/20 text-white hover:bg-white hover:text-primary" />
               <div className="flex gap-2">
                 {BANNERS.map((_, index) => (
                   <button
                     key={index}
                     onClick={() => onDotButtonClick(index)}
                     className={cn(
                       "w-2.5 h-2.5 rounded-full transition-all duration-300",
                       current === index ? "bg-secondary w-6" : "bg-white/40 hover:bg-white/60"
                     )}
                   />
                 ))}
               </div>
               <CarouselNext className="static translate-y-0 h-10 w-10 bg-white/20 border-white/20 text-white hover:bg-white hover:text-primary" />
            </div>
          </Carousel>
        </section>

        {/* Featured Stores */}
        <section className="container mx-auto px-4 py-12">
          <div className={cn(
            "flex items-center justify-between mb-6 border-b-4 border-secondary pb-3",
            lang === 'AR' ? "flex-row-reverse" : "flex-row"
          )}>
             <h2 className="text-2xl font-black text-primary">
               {lang === 'AR' ? 'متاجر مميزة' : 'Featured Stores'}
             </h2>
             <Link href="/catalog" className="text-sm font-bold text-muted-foreground hover:text-secondary">
               {lang === 'AR' ? 'عرض كل المتاجر' : 'View All Stores'}
             </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_STORES.map((store, i) => (
              <Link 
                key={i} 
                href={`/catalog?query=${encodeURIComponent(store.name)}`}
                className={cn(
                  "bg-white p-5 rounded-2xl shadow-sm border hover:shadow-lg transition-all flex items-center gap-4 group",
                  lang === 'AR' ? "flex-row-reverse text-right" : "flex-row text-left"
                )}
              >
                 <div className="w-16 h-16 rounded-xl overflow-hidden relative border-2 border-secondary/20 shrink-0">
                    <Image src={store.logo} alt={store.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="flex-grow" dir={lang === 'AR' ? "rtl" : "ltr"}>
                    <h3 className="font-black text-base text-primary group-hover:text-secondary transition-colors">{store.name}</h3>
                    <p className={cn(
                      "text-xs text-muted-foreground flex items-center gap-1",
                      lang === 'AR' ? "justify-end" : "justify-start"
                    )}>
                      <MapPin size={10} className="text-secondary" /> {store.location}
                    </p>
                    <div className={cn(
                      "mt-1 flex items-center gap-1",
                      lang === 'AR' ? "justify-end" : "justify-start"
                    )}>
                       <ShieldCheck size={12} className="text-blue-500" />
                       <span className="text-[9px] font-black text-blue-600 uppercase">
                         {lang === 'AR' ? 'متجر معتمد' : 'Verified Store'}
                       </span>
                    </div>
                 </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-12 bg-white rounded-[40px] shadow-inner mb-12">
          <div className={cn(
            "flex items-center justify-between mb-8",
            lang === 'AR' ? "flex-row-reverse" : "flex-row"
          )}>
            <div className={lang === 'AR' ? "text-right" : "text-left"}>
              <h2 className="text-3xl font-black text-primary mb-1">
                {lang === 'AR' ? 'أحدث العروض' : 'Latest Offers'}
              </h2>
              <p className="text-sm text-muted-foreground font-bold">
                {lang === 'AR' ? 'قطع غيار أصلية بأسعار تنافسية' : 'Genuine parts at competitive prices'}
              </p>
            </div>
            <Link href="/catalog">
              <Button variant="outline" className="rounded-full px-6 h-10 text-xs font-black border-2 border-primary hover:bg-primary hover:text-white transition-all">
                {lang === 'AR' ? 'تصفح الكتالوج الشامل' : 'Browse Catalog'}
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
