
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import AISearchBox from "@/components/ai-search-box";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, UserPlus, Store, Search, ShieldCheck, MapPin } from "lucide-react";

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
  const brandBanner = PlaceHolderImages.find(img => img.id === "brand-banner-bourouisse")?.imageUrl || PlaceHolderImages[5].imageUrl;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-zinc-50">
      <Navbar />

      <main className="flex-grow pt-[235px]">
        {/* AI SEARCH BOX */}
        <AISearchBox />

        {/* Hero Section */}
        <section className="relative w-full min-h-[600px] flex items-center justify-center py-20">
          <div className="absolute inset-0 z-0">
            <Image
              src={brandBanner}
              alt="Bourouisse Scrapyard"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          </div>

          <div className="container mx-auto px-4 z-10 text-center">
            <div className="inline-block bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-700">
               <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4 uppercase drop-shadow-2xl">
                 بورويس لقطع الغيار
               </h1>
               <p className="text-xl md:text-2xl text-secondary font-bold italic mb-8">
                 سوقكم الموثوق في الجزائر
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/join">
                  <Button size="lg" className="h-16 px-12 text-xl font-black gap-3 bg-secondary text-primary hover:bg-white transition-all rounded-2xl shadow-2xl">
                    <UserPlus size={24} /> انضم إلينا الآن
                  </Button>
                </Link>
                <Link href="/catalog">
                  <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-black border-2 border-white text-white hover:bg-white hover:text-primary transition-all rounded-2xl shadow-2xl">
                    تصفح الإعلانات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Stores */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8 flex-row-reverse border-b-4 border-secondary pb-4">
             <h2 className="text-3xl font-black text-primary">متاجر مميزة</h2>
             <Link href="/catalog" className="text-sm font-bold text-muted-foreground hover:text-secondary">عرض كل المتاجر</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_STORES.map((store, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border hover:shadow-xl transition-all flex items-center gap-4 group">
                 <div className="w-20 h-20 rounded-2xl overflow-hidden relative border-2 border-secondary/20 shrink-0">
                    <Image src={store.logo} alt={store.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="text-right flex-grow" dir="rtl">
                    <h3 className="font-black text-lg text-primary">{store.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                      <MapPin size={12} className="text-secondary" /> {store.location}
                    </p>
                    <div className="mt-2 flex items-center justify-end gap-1">
                       <ShieldCheck size={14} className="text-blue-500" />
                       <span className="text-[10px] font-black text-blue-600 uppercase">متجر معتمد</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-16 bg-white rounded-[50px] shadow-inner mb-16">
          <div className="flex items-center justify-between mb-12 flex-row-reverse">
            <div className="text-right">
              <h2 className="text-4xl font-black text-primary mb-2">أحدث العروض</h2>
              <p className="text-muted-foreground font-bold">قطع غيار أصلية بأسعار تنافسية</p>
            </div>
            <Link href="/catalog">
              <Button variant="outline" className="rounded-full px-8 h-12 font-black border-2 border-primary hover:bg-primary hover:text-white transition-all">تصفح الكتالوج الشامل</Button>
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
