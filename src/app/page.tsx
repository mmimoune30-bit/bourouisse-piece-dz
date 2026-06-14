
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, CheckCircle2, Package, Truck, Zap } from "lucide-react";

const FEATURED_PRODUCTS = [
  {
    id: "p1",
    name: "Precision V8 Engine Block",
    price: 450000,
    image: PlaceHolderImages[0].imageUrl,
    category: "Engine Parts",
    seller: "EliteMotors DZ",
    condition: "New" as const
  },
  {
    id: "p2",
    name: "Carbon Ceramic Brake Kit",
    price: 120000,
    image: PlaceHolderImages[1].imageUrl,
    category: "Braking Systems",
    seller: "SpeedHub Algiers",
    condition: "New" as const
  },
  {
    id: "p3",
    name: "All-Terrain Rugged Tires (Set of 4)",
    price: 85000,
    image: PlaceHolderImages[2].imageUrl,
    category: "Tires & Rims",
    seller: "DesertRoad Parts",
    condition: "New" as const
  },
  {
    id: "p4",
    name: "High-Efficiency Oil Filter",
    price: 2500,
    image: PlaceHolderImages[3].imageUrl,
    category: "Maintenance",
    seller: "Maintenance Pros",
    condition: "New" as const
  }
];

const CATEGORIES = [
  { name: "Engine Parts", icon: <Zap className="text-secondary" />, count: 1240 },
  { name: "Transmission", icon: <Package className="text-secondary" />, count: 850 },
  { name: "Electrical", icon: <Zap className="text-secondary" />, count: 2100 },
  { name: "Braking", icon: <CheckCircle2 className="text-secondary" />, count: 640 },
  { name: "Tires & Rims", icon: <Truck className="text-secondary" />, count: 320 },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-border animate-in slide-in-from-left duration-500">
              <span className="bg-secondary text-primary font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">New</span>
              <span className="text-sm font-medium text-muted-foreground">AI Search is now available!</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-primary leading-[1.1]">
              Find the Perfect <span className="text-secondary italic">Part</span> for Your Ride.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              AutoPièces DZ is Algeria's premium destination for high-quality automotive components. Genuine parts, verified sellers, and nation-wide delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2">
                Explore Catalog <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold">
                Sell Your Parts
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">50k+</span>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Active Listings</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">12k+</span>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Happy Clients</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">2.5k+</span>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Top Sellers</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative w-full aspect-square lg:aspect-[4/3]">
            <div className="absolute inset-0 bg-secondary/10 rounded-3xl -rotate-2" />
            <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-1000">
              <Image
                src={PlaceHolderImages[4].imageUrl}
                alt="Modern car interior"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-border hidden md:block animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="font-bold text-primary">Verified Quality</p>
                  <p className="text-sm text-muted-foreground text-nowrap">All parts are inspected</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-2">Shop by Category</h2>
                <p className="text-muted-foreground">Quickly find the parts you need by system.</p>
              </div>
              <Button variant="link" className="text-secondary font-bold gap-1">
                View All Categories <ArrowRight size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {CATEGORIES.map((cat, i) => (
                <Link
                  key={i}
                  href={`/catalog?category=${cat.name}`}
                  className="group p-8 rounded-2xl border border-border bg-background hover:bg-primary hover:border-primary transition-all duration-300 text-center"
                >
                  <div className="mb-4 flex justify-center scale-125 group-hover:scale-150 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-primary group-hover:text-white transition-colors mb-1">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground group-hover:text-blue-100/60 transition-colors">{cat.count} Items</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">Curated premium parts from our top-rated sellers.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowRight className="rotate-180" size={18} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <Button variant="outline" size="lg" className="rounded-full px-12 h-14 font-bold">
              View All 50,000+ Listings
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 mb-20">
          <div className="bg-primary rounded-3xl overflow-hidden relative min-h-[400px] flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent z-10" />
            <Image
              src={PlaceHolderImages[5].imageUrl}
              alt="Steering wheel"
              fill
              className="object-cover object-right"
            />
            <div className="relative z-20 p-8 md:p-16 max-w-2xl text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Become an AutoPièces DZ Verified Seller</h2>
              <p className="text-lg text-blue-100/70 mb-8 leading-relaxed">
                Reach thousands of buyers across Algeria. Manage your inventory, track sales, and grow your automotive business with our professional tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold">
                  Get Started for Free
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-white/20 text-white hover:bg-white/10">
                  Read Case Studies
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
