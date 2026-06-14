import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, ArrowRight, CheckCircle2, Package, Truck, Zap, Gauge, Settings } from "lucide-react";

const FEATURED_PRODUCTS = [
  {
    id: "p1",
    name: "كتلة محرك V8 دقيقة",
    price: 450000,
    image: PlaceHolderImages[0].imageUrl,
    category: "قطع المحرك",
    seller: "EliteMotors DZ",
    condition: "New" as const
  },
  {
    id: "p2",
    name: "طقم فرامل سيراميك كربون",
    price: 120000,
    image: PlaceHolderImages[1].imageUrl,
    category: "أنظمة الفرامل",
    seller: "SpeedHub Algiers",
    condition: "New" as const
  },
  {
    id: "p3",
    name: "إطارات الطرق الوعرة (طقم 4)",
    price: 85000,
    image: PlaceHolderImages[2].imageUrl,
    category: "الإطارات والجنوط",
    seller: "DesertRoad Parts",
    condition: "New" as const
  },
  {
    id: "p4",
    name: "فلتر زيت عالي الكفاءة",
    price: 2500,
    image: PlaceHolderImages[3].imageUrl,
    category: "الصيانة العامة",
    seller: "Maintenance Pros",
    condition: "New" as const
  }
];

const CATEGORIES = [
  { name: "قطع المحرك", icon: <Zap size={24} className="text-secondary" />, count: 1240 },
  { name: "ناقل الحركة", icon: <Settings size={24} className="text-secondary" />, count: 850 },
  { name: "الكهرباء", icon: <Gauge size={24} className="text-secondary" />, count: 2100 },
  { name: "الفرامل", icon: <CheckCircle2 size={24} className="text-secondary" />, count: 640 },
  { name: "الإطارات", icon: <Truck size={24} className="text-secondary" />, count: 320 },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-parts")?.imageUrl || PlaceHolderImages[4].imageUrl;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Categories Bar */}
        <section className="bg-destructive border-b-4 border-secondary sticky top-[72px] z-40 overflow-x-auto no-scrollbar shadow-xl py-4">
          <div className="container mx-auto px-4 flex flex-row-reverse items-center justify-start md:justify-center gap-8 md:gap-16 whitespace-nowrap">
            <div className="flex flex-row-reverse items-center">
              <span className="text-lg font-black text-white bg-primary/20 border-2 border-secondary px-5 py-2 rounded-xl ml-4 uppercase tracking-tighter shadow-inner">
                اختيار الفئة:
              </span>
            </div>
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                href={`/catalog?category=${cat.name}`}
                className="flex flex-row-reverse items-center gap-3 group transition-all"
              >
                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-secondary group-hover:text-primary transition-all group-hover:scale-125 shadow-sm">
                  {cat.icon}
                </div>
                <span className="text-sm md:text-base font-extrabold text-white group-hover:text-secondary transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
            <Link href="/catalog" className="text-sm font-black text-secondary border-r-2 border-secondary/30 pr-8 mr-4 hover:underline hover:scale-105 transition-transform">
              عرض الكل
            </Link>
          </div>
        </section>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-16 relative">
          <div className="flex-1 space-y-8 z-20 text-right lg:text-right">
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-border animate-in slide-in-from-right duration-500">
              <span className="text-sm font-medium text-muted-foreground">البحث المدعوم بالذكاء الاصطناعي متاح الآن!</span>
              <span className="bg-secondary text-primary font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">جديد</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-primary leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
              Bourouisse <span className="text-secondary italic">PieceDz</span> لقطع الغيار والسيارات.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed mr-auto lg:mr-0 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Bourouisse-PieceDz وجهتكم الأولى في الجزائر لقطع غيار السيارات عالية الجودة. قطع أصلية، بائعون موثوقون، وتوصيل لكافة الولايات.
            </p>
            <div className="flex flex-col sm:flex-row-reverse gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <Link href="/catalog">
                <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2 group w-full sm:w-auto">
                  استكشف الكتالوج <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold">
                بع قطع غيارك
              </Button>
            </div>
            <div className="flex items-center justify-end gap-8 pt-4 opacity-70">
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-primary">50k+</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">إعلان نشط</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-primary">12k+</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">عميل سعيد</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative w-full aspect-[4/5] lg:aspect-[3/4] max-w-md mx-auto lg:max-w-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute -bottom-20 -left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-soft delay-1000" />
            
            <div className="absolute inset-0 bg-secondary/5 rounded-[2.5rem] rotate-3 transition-transform hover:rotate-0 duration-700" />
            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white z-10">
              <div className="relative w-full h-full animate-ken-burns">
                <Image
                  src={heroImage}
                  alt="Auto parts yard and landscape"
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint="auto yard road"
                />
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white p-5 rounded-2xl shadow-2xl border border-border z-20 animate-float">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 size={24} />
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-sm">جودة مضمونة</p>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">قطع غيار مفحوصة وموثوقة</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -left-6 bg-primary text-white p-4 rounded-2xl shadow-xl z-20 animate-float-delayed hidden md:block">
              <div className="flex items-center gap-3">
                <Truck className="text-secondary" size={20} />
                <span className="text-xs font-bold">توصيل سريع لـ 58 ولاية</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-24 border-t">
          {/* Featured Ads Red Bar Header */}
          <div className="bg-destructive border-r-8 border-secondary p-8 mb-12 rounded-3xl shadow-2xl flex flex-col md:flex-row-reverse justify-between items-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-right z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">إعلانات مميزة</h2>
              <p className="text-white/80 text-lg font-medium">قطع غيار مختارة بعناية من أفضل البائعين الموثوقين في الجزائر.</p>
            </div>
            <div className="flex items-center gap-4 z-10">
              <Link href="/catalog">
                <Button variant="secondary" size="lg" className="rounded-full px-10 h-14 font-black text-lg shadow-lg hover:scale-105 transition-transform">
                  تصفح الكل
                </Button>
              </Link>
              <div className="hidden sm:flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-destructive">
                  <ArrowRight size={20} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-destructive">
                  <ArrowLeft size={20} />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <Button variant="outline" size="lg" className="rounded-full px-12 h-14 font-bold border-2 hover:bg-primary hover:text-white transition-all">
              عرض كل الإعلانات (50,000+)
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 mb-20">
          <div className="bg-primary rounded-[3rem] overflow-hidden relative min-h-[450px] flex items-center shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-l from-primary via-primary/80 to-transparent z-10" />
            <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={PlaceHolderImages[5].imageUrl}
                  alt="Steering wheel"
                  fill
                  className="object-cover object-center scale-110 animate-ken-burns"
                />
            </div>
            <div className="relative z-20 p-8 md:p-20 max-w-2xl text-white text-right ml-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">كن بائعاً معتمداً في Bourouisse-PieceDz</h2>
              <p className="text-lg text-blue-100/70 mb-8 leading-relaxed">
                صل إلى آلاف المشترين عبر الجزائر. أدر مخزونك، تتبع مبيعاتك، ونمِ عملك في قطاع السيارات باستخدام أدواتنا الاحترافية.
              </p>
              <div className="flex flex-col sm:flex-row-reverse gap-4">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold shadow-lg shadow-secondary/20">
                  ابدأ مجاناً
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-white/20 text-white hover:bg-white/10">
                  اقرأ قصص النجاح
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
