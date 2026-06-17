
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import AISearchBox from "@/components/ai-search-box";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft } from "lucide-react";

const FEATURED_PRODUCTS = [
  {
    id: "p1",
    name: "مصباح أمامي أيمن Clio 4",
    price: 8500,
    image: PlaceHolderImages[5].imageUrl,
    category: "إضاءة",
    seller: "Auto Pièces Chlef",
    condition: "New" as const
  },
  {
    id: "p3",
    name: "رادياتور Peugeot 208",
    price: 12000,
    image: PlaceHolderImages[4].imageUrl,
    category: "المحرك",
    seller: "Pièces Renault DZ",
    condition: "New" as const
  },
  {
    id: "p2",
    name: "باب أمامي أيسر Clio 4",
    price: 25000,
    image: PlaceHolderImages[6].imageUrl,
    category: "هيكل",
    seller: "Auto Pièces Chlef",
    condition: "Used" as const
  },
  {
    id: "p4",
    name: "صدام أمامي Peugeot 301",
    price: 18000,
    image: PlaceHolderImages[5].imageUrl,
    category: "هيكل",
    seller: "Pièces Renault DZ",
    condition: "Used" as const
  }
];

const TICKER_ADS = [
  { id: "p1", name: "مصباح Clio 4", price: "8,500 DZD", qty: 5, image: PlaceHolderImages[5].imageUrl },
  { id: "p3", name: "رادياتور 208", price: "12,000 DZD", qty: 10, image: PlaceHolderImages[4].imageUrl },
  { id: "p5", name: "فلتر زيت Accent", price: "900 DZD", qty: 50, image: PlaceHolderImages[4].imageUrl },
  { id: "p2", name: "باب Clio 4", price: "25,000 DZD", qty: 1, image: PlaceHolderImages[6].imageUrl },
];

export default function Home() {
  const brandBanner = PlaceHolderImages.find(img => img.id === "brand-banner-bourouisse")?.imageUrl || PlaceHolderImages[5].imageUrl;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-[235px]">
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

        {/* Hero Section */}
        <section className="relative w-full min-h-[500px] lg:min-h-[700px] flex items-start justify-center pt-20 lg:pt-32">
          <div className="absolute inset-0 z-0">
            <Image
              src={brandBanner}
              alt="Bourouisse Scrapyard Background"
              fill
              className="object-cover"
              priority
              data-ai-hint="aerial scrapyard"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="container mx-auto px-4 z-10 flex flex-col items-center">
            <div className="bg-white border-2 border-white p-6 md:p-10 rounded-sm shadow-[0_10px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-700">
               <h1 className="text-3xl md:text-6xl font-black text-destructive tracking-tighter text-center uppercase">
                 بورويس لقطع الغيار
               </h1>
            </div>

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
        </section>
      </main>

      <Footer />
    </div>
  );
}
