
"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import AISearchBox from "@/components/ai-search-box";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, UserPlus, Store, Search, ShieldCheck, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const BANNERS = [
  {
    id: 1,
    image: "https://picsum.photos/seed/auto-hero-1/1200/800",
    ar: {
      title: "انضم إلى منصتنا اليوم",
      description: "سجل متجرك لقطع غيار السيارات ووصل إلى آلاف العملاء في مختلف الولايات.",
      button: "اشترك معنا"
    },
    en: {
      title: "Join Our Marketplace Today",
      description: "Register your auto parts store and reach thousands of customers.",
      button: "Join Us"
    }
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/auto-hero-2/1200/800",
    ar: {
      title: "ابحث عن قطع الغيار بسهولة",
      description: "ابحث حسب نوع السيارة والموديل وسنة الصنع.",
      button: "ابدأ البحث"
    },
    en: {
      title: "Find Auto Parts Easily",
      description: "Search by vehicle brand, model and manufacturing year.",
      button: "Start Searching"
    }
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/auto-hero-3/1200/800",
    ar: {
      title: "إعلانات مجانية للبائعين الجدد",
      description: "أضف قطع الغيار الجديدة والمستعملة مجاناً خلال فترة الإطلاق.",
      button: "أضف إعلانك الآن"
    },
    en: {
      title: "Free Listings for New Sellers",
      description: "Publish your new and used spare parts during the launch period.",
      button: "Post Your Listing"
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

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN";
      if (savedLang) setLang(savedLang);
    };

    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-zinc-50">
      <Navbar />

      <main className="flex-grow pt-[235px]">
        {/* AI SEARCH BOX */}
        <AISearchBox />

        {/* Dynamic Multi-language Hero Section */}
        <section className="relative w-full">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {BANNERS.map((banner) => {
                const content = lang === "AR" ? banner.ar : banner.en;
                return (
                  <CarouselItem key={banner.id}>
                    <div className="relative min-h-[600px] flex items-center justify-center py-20 overflow-hidden">
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={banner.image}
                          alt={content.title}
                          fill
                          className="object-cover animate-ken-burns"
                          priority
                        />
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
                      </div>

                      <div className="container mx-auto px-4 z-10 text-center">
                        <div className={cn(
                          "inline-block bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-700 max-w-4xl",
                          lang === "AR" ? "text-right" : "text-left"
                        )} dir={lang === "AR" ? "rtl" : "ltr"}>
                          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase drop-shadow-2xl leading-tight">
                            {content.title}
                          </h1>
                          <p className="text-xl md:text-2xl text-secondary font-bold italic mb-10 leading-relaxed max-w-2xl">
                            {content.description}
                          </p>
                          <div className={cn(
                            "flex flex-col sm:flex-row gap-4",
                            lang === "AR" ? "sm:justify-end" : "sm:justify-start"
                          )}>
                            <Link href="/join">
                              <Button size="lg" className="h-16 px-12 text-xl font-black gap-3 bg-secondary text-primary hover:bg-white transition-all rounded-2xl shadow-2xl">
                                {content.button} {lang === 'AR' ? <UserPlus size={24} /> : null}
                              </Button>
                            </Link>
                            <Link href="/catalog">
                              <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-black border-2 border-white text-white hover:bg-white hover:text-primary transition-all rounded-2xl shadow-2xl">
                                {lang === 'AR' ? 'تصفح الإعلانات' : 'Browse Listings'}
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
            <CarouselPrevious className={cn("hidden md:flex", lang === 'AR' ? "right-10" : "left-10")} />
            <CarouselNext className={cn("hidden md:flex", lang === 'AR' ? "left-10" : "right-10")} />
          </Carousel>
        </section>

        {/* Featured Stores */}
        <section className="container mx-auto px-4 py-16">
          <div className={cn(
            "flex items-center justify-between mb-8 border-b-4 border-secondary pb-4",
            lang === 'AR' ? "flex-row-reverse" : "flex-row"
          )}>
             <h2 className="text-3xl font-black text-primary">
               {lang === 'AR' ? 'متاجر مميزة' : 'Featured Stores'}
             </h2>
             <Link href="/catalog" className="text-sm font-bold text-muted-foreground hover:text-secondary">
               {lang === 'AR' ? 'عرض كل المتاجر' : 'View All Stores'}
             </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_STORES.map((store, i) => (
              <div key={i} className={cn(
                "bg-white p-6 rounded-3xl shadow-sm border hover:shadow-xl transition-all flex items-center gap-4 group",
                lang === 'AR' ? "flex-row-reverse text-right" : "flex-row text-left"
              )}>
                 <div className="w-20 h-20 rounded-2xl overflow-hidden relative border-2 border-secondary/20 shrink-0">
                    <Image src={store.logo} alt={store.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="flex-grow" dir={lang === 'AR' ? "rtl" : "ltr"}>
                    <h3 className="font-black text-lg text-primary">{store.name}</h3>
                    <p className={cn(
                      "text-sm text-muted-foreground flex items-center gap-1",
                      lang === 'AR' ? "justify-end" : "justify-start"
                    )}>
                      <MapPin size={12} className="text-secondary" /> {store.location}
                    </p>
                    <div className={cn(
                      "mt-2 flex items-center gap-1",
                      lang === 'AR' ? "justify-end" : "justify-start"
                    )}>
                       <ShieldCheck size={14} className="text-blue-500" />
                       <span className="text-[10px] font-black text-blue-600 uppercase">
                         {lang === 'AR' ? 'متجر معتمد' : 'Verified Store'}
                       </span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-16 bg-white rounded-[50px] shadow-inner mb-16">
          <div className={cn(
            "flex items-center justify-between mb-12",
            lang === 'AR' ? "flex-row-reverse" : "flex-row"
          )}>
            <div className={lang === 'AR' ? "text-right" : "text-left"}>
              <h2 className="text-4xl font-black text-primary mb-2">
                {lang === 'AR' ? 'أحدث العروض' : 'Latest Offers'}
              </h2>
              <p className="text-muted-foreground font-bold">
                {lang === 'AR' ? 'قطع غيار أصلية بأسعار تنافسية' : 'Genuine parts at competitive prices'}
              </p>
            </div>
            <Link href="/catalog">
              <Button variant="outline" className="rounded-full px-8 h-12 font-black border-2 border-primary hover:bg-primary hover:text-white transition-all">
                {lang === 'AR' ? 'تصفح الكتالوج الشامل' : 'Browse Catalog'}
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
