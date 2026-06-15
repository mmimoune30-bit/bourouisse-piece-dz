
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import AISearchBox from "@/components/ai-search-box";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, CheckCircle2, Zap, Settings, Car, Disc, Sparkles, Plug, Scale } from "lucide-react";

const FEATURED_PRODUCTS = [
  {
    id: "p1",
    name: "كتلة محرك V8 دقيقة",
    price: 450000,
    image: PlaceHolderImages[0].imageUrl,
    category: "المحرك",
    seller: "EliteMotors DZ",
    condition: "New" as const
  },
  {
    id: "p2",
    name: "طقم فرامل سيراميك كربون",
    price: 120000,
    image: PlaceHolderImages[1].imageUrl,
    category: "الهيكل",
    seller: "SpeedHub Algiers",
    condition: "New" as const
  },
  {
    id: "p3",
    name: "إطارات الطرق الوعرة (طقم 4)",
    price: 85000,
    image: PlaceHolderImages[2].imageUrl,
    category: "الإطارات",
    seller: "DesertRoad Parts",
    condition: "New" as const
  },
  {
    id: "p4",
    name: "بطارية سيارة 12 فولت شديدة التحمل",
    price: 18500,
    image: PlaceHolderImages[3].imageUrl,
    category: "الكهرباء",
    seller: "Energy Dz",
    condition: "New" as const
  }
];

const TICKER_ADS = [
  { id: "p1", name: "شاحن توربيني GT20", price: "85,000 DZD", qty: 5, image: PlaceHolderImages[0].imageUrl },
  { id: "p2", name: "طقم فحمات فرامل", price: "12,500 DZD", qty: 15, image: PlaceHolderImages[1].imageUrl },
  { id: "p4", name: "بطارية أصلية 75Ah", price: "19,800 DZD", qty: 10, image: PlaceHolderImages[3].imageUrl },
  { id: "p3", name: "أضواء LED أمامية", price: "18,000 DZD", qty: 8, image: PlaceHolderImages[2].imageUrl },
  { id: "p5", name: "مضخة وقود أصلية", price: "32,000 DZD", qty: 3, image: PlaceHolderImages[0].imageUrl },
];

const CATEGORIES = [
  { name: "الهيكل", icon: <Car size={24} className="text-secondary" />, count: 1500 },
  { name: "المحرك", icon: <Zap size={24} className="text-secondary" />, count: 1240 },
  { name: "التوازي و التوازن", icon: <Scale size={24} className="text-secondary" />, count: 850 },
  { name: "الكهرباء", icon: <Plug size={24} className="text-secondary" />, count: 2100 },
  { name: "الإطارات", icon: <Disc size={24} className="text-secondary" />, count: 900 },
  { name: "الأكسيسوارات", icon: <Sparkles size={24} className="text-secondary" />, count: 1100 },
];

const BRANDS = [
  { 
    name: "Mercedes-Benz", 
    slug: "Mercedes",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.5c4.69 0 8.5 3.81 8.5 8.5 0 .23-.01.46-.03.68l-8.47-4.88V3.5zm-1 5.37l-7.53 4.34c.3-.59.66-1.15 1.08-1.66l6.45-3.71v1.03zm2 0v1.03l6.45 3.71c.42.51.78 1.07 1.08 1.66l-7.53-4.34zm-8.47 5.75l8.47 4.88v4.32c-4.69 0-8.5-3.81-8.5-8.5 0-.23.01-.46.03-.7zm9.47 4.88l8.47-4.88c.02.24.03.47.03.7 0 4.69-3.81 8.5-8.5 8.5v-4.32z" />
      </svg>
    )
  },
  { 
    name: "Volkswagen", 
    slug: "Volkswagen",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.5c4.69 0 8.5 3.81 8.5 8.5s-3.81 8.5-8.5 8.5-8.5-3.81-8.5-8.5 3.81-8.5 8.5-8.5zm0 1.5l-2 5.5h4l-2-5.5zm-3 8.5l2 5.5h2l2-5.5h-1.5l-1.25 3.5h-1.5l-1.25-3.5H9z" />
      </svg>
    )
  },
  { 
    name: "Hyundai", 
    slug: "Hyundai",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C5.37 2 0 6.48 0 12s5.37 10 12 10 12-4.48 12-10S18.63 2 12 2zm3.32 15.11l-1.01-4.22h-4.62l1.01 4.22H8.38l-1.63-6.83h2.32l1.01 4.22h4.62l-1.01-4.22h2.32l1.63 6.83h-2.32z" />
      </svg>
    )
  },
  { 
    name: "Peugeot", 
    slug: "Peugeot",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm6 15l-6 3-6-3V7l6-3 6 3v10zM12 8l-4 2v4l4 2 4-2v-4l-4-2z" />
      </svg>
    )
  },
  { 
    name: "Renault", 
    slug: "Renault",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L5 12l7 10 7-10-7-10zm0 3.5L16.5 12 12 18.5 7.5 12 12 5.5z" />
      </svg>
    )
  }
];

export default function Home() {
  const brandBanner = PlaceHolderImages.find(img => img.id === "brand-banner-bourouisse")?.imageUrl || PlaceHolderImages[5].imageUrl;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-[146px]">
        {/* Categories & Brands Bar - Sticky */}
        <section className="bg-destructive border-b-2 border-secondary sticky top-[146px] z-40 overflow-hidden shadow-lg py-3">
          <div className="container mx-auto px-4 flex flex-col md:flex-row-reverse items-center justify-between gap-6 md:gap-8">
            
            {/* Left Side: Brand Logos */}
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {BRANDS.map((brand, i) => (
                <Link 
                  key={i} 
                  href={`/catalog?brand=${brand.slug}`}
                  className="flex flex-col items-center group transition-all duration-300 transform hover:scale-110"
                >
                  <div className="text-white hover:text-secondary transition-colors drop-shadow-lg">
                    {brand.icon}
                  </div>
                  <span className="text-[10px] md:hidden font-bold text-white mt-1 uppercase tracking-tighter">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Middle: Category Links */}
            <div className="flex flex-row-reverse items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar flex-grow justify-center">
              <div className="flex flex-row-reverse items-center">
                <span className="text-sm font-black text-white bg-primary/20 border border-secondary px-4 py-1.5 rounded-lg ml-3 uppercase tracking-tighter shadow-inner whitespace-nowrap">
                  الفئة:
                </span>
              </div>
              {CATEGORIES.map((cat, i) => (
                <Link
                  key={i}
                  href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-row-reverse items-center gap-2.5 group transition-all shrink-0"
                >
                  <div className="p-2 rounded-lg bg-white/10 group-hover:bg-secondary group-hover:text-primary transition-all group-hover:scale-110 shadow-sm">
                    {cat.icon}
                  </div>
                  <span className="text-sm md:text-base font-extrabold text-white group-hover:text-secondary transition-colors whitespace-nowrap">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Right Side: Quick Link */}
            <Link href="/catalog" className="text-xs font-black text-secondary border-r-2 border-secondary/30 pr-6 mr-3 hover:underline whitespace-nowrap hidden lg:block">
              عرض الكل
            </Link>
          </div>
        </section>

        {/* Dynamic Ticker Bar */}
        <section className="h-24 flex items-center bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 animate-gradient-dynamic overflow-hidden border-b border-sky-300/30 shadow-xl relative z-30 group">
          <div className="flex whitespace-nowrap animate-scroll-left group-hover:[animation-play-state:paused] cursor-pointer">
            {[...TICKER_ADS, ...TICKER_ADS].map((ad, i) => (
              <Link key={i} href={`/catalog`} className="flex items-center gap-6 px-12 text-white hover:bg-white/20 transition-all h-full transform hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white/50 shrink-0 shadow-xl">
                    <Image
                      src={ad.image}
                      alt={ad.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black uppercase tracking-tight text-white drop-shadow-md">{ad.name}</span>
                    <div className="flex items-center gap-4 mt-1">
                       <span className="text-[11px] font-bold text-sky-100">
                        الكمية: <span className="text-white font-black">{ad.qty}</span>
                      </span>
                      <span className="text-[11px] font-black text-primary bg-white px-3 py-1 rounded-full border border-sky-200 shadow-sm">
                        {ad.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* AI SEARCH BOX */}
        <AISearchBox />

        {/* Hero Section with New Background Image */}
        <section className="relative w-full min-h-[500px] lg:min-h-[700px] flex items-start justify-center pt-20 lg:pt-32">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src={brandBanner}
              alt="Bourouisse Scrapyard Background"
              fill
              className="object-cover"
              priority
              data-ai-hint="aerial scrapyard"
            />
            {/* Overlay for readability if needed, but keeping it clear as per request */}
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Content Area */}
          <div className="container mx-auto px-4 z-10 flex flex-col items-center">
            {/* Main Brand Box (Recreating the style from the image) */}
            <div className="bg-white border-2 border-white p-6 md:p-10 rounded-sm shadow-[0_10px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-700">
               <h1 className="text-3xl md:text-6xl font-black text-destructive tracking-tighter text-center">
                 بورويس لقطع الغيار
               </h1>
            </div>

            {/* Additional Hero Content */}
            <div className="mt-12 text-center max-w-2xl bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom duration-1000">
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
                وجهتكم الأولى لقطع الغيار <span className="text-secondary italic">في الجزائر</span>
              </h2>
              <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8">
                نضمن لكم أفضل جودة وأسرع توصيل في الجزائر. تصفح آلاف الإعلانات من بائعين معتمدين.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/catalog">
                  <Button size="lg" className="h-14 px-10 text-lg font-black gap-2 group shadow-xl bg-secondary text-primary hover:bg-white transition-all">
                    استكشف الكتالوج <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/seller/register">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-black border-2 border-white text-white hover:bg-white hover:text-primary transition-all shadow-xl">
                    بع قطع غيارك
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="bg-destructive border-r-4 border-secondary p-6 mb-8 rounded-2xl shadow-lg flex flex-col md:flex-row-reverse justify-between items-center gap-4 relative overflow-hidden group">
            <div className="text-right z-10">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1 uppercase tracking-tighter">إعلانات مميزة</h2>
              <p className="text-white/80 text-sm font-medium">قطع غيار مختارة بعناية من بائعين موثوقين.</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <Link href="/catalog">
                <Button variant="secondary" size="sm" className="rounded-full px-6 h-10 font-black text-sm shadow-md hover:scale-105 transition-transform">
                  تصفح الكل
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/catalog">
              <Button variant="outline" size="lg" className="rounded-full px-10 h-12 font-bold border-2 hover:bg-primary hover:text-white transition-all">
                عرض كل الإعلانات (50,000+)
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 mb-10">
          <div className="bg-primary rounded-3xl overflow-hidden relative min-h-[350px] flex items-center shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-l from-primary via-primary/80 to-transparent z-10" />
            <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={PlaceHolderImages[6].imageUrl}
                  alt="Car accessories"
                  fill
                  className="object-cover scale-110"
                />
            </div>
            <div className="relative z-20 p-8 md:p-12 max-w-xl text-white text-right ml-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">كن بائعاً معتمداً معنا</h2>
              <p className="text-base text-blue-100/70 mb-6 leading-relaxed">
                انضم إلى أكبر منصة لقطع الغيار في الجزائر وقم ببيع منتجاتك لآلاف المشترين يومياً.
              </p>
              <div className="flex flex-col sm:flex-row-reverse gap-3">
                <Link href="/seller/register">
                  <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-bold shadow-lg w-full sm:w-auto">
                    ابدأ مجاناً
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base font-bold border-white/20 text-white w-full sm:w-auto">
                  تعرف على المميزات
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
