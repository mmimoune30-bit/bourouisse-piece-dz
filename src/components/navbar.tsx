
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { User, Settings, LayoutDashboard, ChevronDown, ArrowRight, Phone, Mail, Facebook, Car, Zap, Disc, Sparkles, Scale, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

const translations = {
  AR: { 
    buyer: "بوابة المشتري", 
    seller: "بوابة البائع", 
    stats: "لوحة التحكم", 
    new: "إعلان جديد", 
    store: "فتح متجر", 
    back: "رجوع", 
    contact: "للاستفسار:",
    all: "عرض الكل",
    categories: ["الهيكل", "المحرك", "التوازي و التوازن", "الكهرباء", "الإطارات", "الأكسيسوارات"]
  },
  FR: { 
    buyer: "Portail Acheteur", 
    seller: "Portail Vendeur", 
    stats: "Tableau de bord", 
    new: "Nouvelle annonce", 
    store: "Ouvrir boutique", 
    back: "Retour", 
    contact: "Contact:",
    all: "Voir tout",
    categories: ["Carrosserie", "Moteur", "Suspension", "Électricité", "Pneus", "Accessoires"]
  },
  EN: { 
    buyer: "Buyer Portal", 
    seller: "Seller Portal", 
    stats: "Dashboard", 
    new: "New Listing", 
    store: "Open Pro Shop", 
    back: "Back", 
    contact: "Contact:",
    all: "View All",
    categories: ["Body", "Engine", "Suspension", "Electricity", "Tires", "Accessories"]
  }
};

const CATEGORY_ICONS = [
  <Car size={24} className="text-secondary" />,
  <Zap size={24} className="text-secondary" />,
  <Scale size={24} className="text-secondary" />,
  <Plug size={24} className="text-secondary" />,
  <Disc size={24} className="text-secondary" />,
  <Sparkles size={24} className="text-secondary" />,
];

const BRANDS = [
  { name: "Mercedes", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.5c4.69 0 8.5 3.81 8.5 8.5 0 .23-.01.46-.03.68l-8.47-4.88V3.5zm-1 5.37l-7.53 4.34c.3-.59.66-1.15 1.08-1.66l6.45-3.71v1.03zm2 0v1.03l6.45 3.71c.42.51.78 1.07 1.08 1.66l-7.53-4.34zm-8.47 5.75l8.47 4.88v4.32c-4.69 0-8.5-3.81-8.5-8.5 0-.23.01-.46.03-.7zm9.47 4.88l8.47-4.88c.02.24.03.47.03.7 0 4.69-3.81 8.5-8.5 8.5v-4.32z" /></svg> },
  { name: "Volkswagen", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.5c4.69 0 8.5 3.81 8.5 8.5s-3.81 8.5-8.5 8.5-8.5-3.81-8.5-8.5 3.81-8.5 8.5-8.5zm0 1.5l-2 5.5h4l-2-5.5zm-3 8.5l2 5.5h2l2-5.5h-1.5l-1.25 3.5h-1.5l-1.25-3.5H9z" /></svg> },
  { name: "Hyundai", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C5.37 2 0 6.48 0 12s5.37 10 12 10 12-4.48 12-10S18.63 2 12 2zm3.32 15.11l-1.01-4.22h-4.62l1.01 4.22H8.38l-1.63-6.83h2.32l1.01 4.22h4.62l-1.01-4.22h2.32l1.63 6.83h-2.32z" /></svg> },
  { name: "Peugeot", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm6 15l-6 3-6-3V7l6-3 6 3v10zM12 8l-4 2v4l4 2 4-2v-4l-4-2z" /></svg> },
  { name: "Renault", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L5 12l7 10 7-10-7-10zm0 3.5L16.5 12 12 18.5 7.5 12 12 5.5z" /></svg> },
  { name: "Kia", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.5c4.69 0 8.5 3.81 8.5 8.5s-3.81 8.5-8.5 8.5-8.5-3.81-8.5-8.5 3.81-8.5 8.5-8.5zm3.5 11l-1.5-4-1.5 4h3zm-5.5 0h-2l1-4 1 4z" /></svg> }
];

const WhatsappIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState<keyof typeof translations>("AR");

  const languages = [
    { code: "AR", name: "العربية", flag: "🇩🇿" },
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "EN", name: "English", flag: "🇺🇸" },
  ];

  const t = translations[currentLang];

  const TikTokIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.5c0 1.25-.23 2.48-.91 3.51-.89 1.4-2.39 2.34-4.04 2.39-1.52.05-3.08-.43-4.24-1.41-1.39-1.14-2.15-2.92-2-4.69.11-1.92 1.3-3.75 3.09-4.52.48-.21 1-.34 1.52-.39v4.03c-.48.08-1 .31-1.35.66-.41.4-.64.97-.62 1.54.02.66.42 1.3 1.02 1.57.51.24 1.1.28 1.62.1.66-.23 1.13-.88 1.13-1.58V.02z" />
    </svg>
  );

  const ViberIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.34 1.32C17.14.34 14.54 0 12 0 6.64 0 2.27 4.37 2.27 9.73c0 2.61 1.02 5.09 2.87 6.94l-1.07 3.9c-.11.41.24.78.65.67l3.9-1.07c1.85 1.85 4.33 2.87 6.94 2.87 5.36 0 9.73-4.37 9.73-9.73 0-2.54-.34-5.14-1.32-7.34l-.6.35c.82 1.83 1.1 4 1.1 6.12 0 4.93-4.01 8.93-8.93 8.93-2.33 0-4.6-.9-6.32-2.52l-.46-.46-3.23.88.88-3.23-.46-.46-3.23.88.88-3.23-.46-.46c-1.62-1.72-2.52-3.99-2.52-6.32 0-4.93 4.01-8.93 8.93-8.93 2.12 0 4.29.28 6.12 1.1l.35-.6zM15.54 13.52c-.34.34-.84.45-1.28.29-.44-.16-.83-.49-1.12-.89-.29-.4-.52-.86-.67-1.36-.15-.5-.22-1.01-.22-1.52 0-.34.03-.68.08-1.01l1.54.34c-.04.22-.06.45-.06.67 0 .34.05.68.15 1.01.1.33.25.64.44.91.19.27.42.5.68.68.26.18.55.32.86.41.31.09.64.13.97.13.15 0 .29-.01.44-.04l.34 1.54c-.22.03-.45.05-.67.06-.51 0-1.02-.07-1.52-.22-.5-.15-.96-.38-1.36-.67-.4-.29-.73-.68-.89-1.12-.16-.44-.05-.94.29-1.28l-.34-1.54-.34 1.54z" />
    </svg>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black shadow-2xl h-[235px]">
      {/* Top Bar: Contact & Social Info */}
      <div className="bg-zinc-900/80 border-b border-white/5 py-2">
        <div className="container mx-auto px-4 flex flex-row-reverse items-center justify-between gap-4">
          <div className="flex flex-row-reverse items-center gap-6 text-white/80">
            <span className="text-[11px] font-black text-secondary uppercase tracking-widest ml-2">{t.contact}</span>
            <div className="flex flex-row-reverse items-center gap-2 text-[12px] font-bold">
              <Phone size={16} className="text-secondary" />
              <span dir="ltr">+213 778 42 89 77</span>
            </div>
            <div className="flex flex-row-reverse items-center gap-2 text-[12px] font-bold hidden sm:flex">
              <Mail size={16} className="text-secondary" />
              <span>support@bourouisse-piece-dz.com</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary hover:text-black transition-all shadow-xl">
              <Facebook size={18} />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary hover:text-black transition-all shadow-xl">
              <TikTokIcon />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary hover:text-black transition-all shadow-xl">
              <ViberIcon />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 h-[100px]">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-secondary p-2 rounded-2xl text-black shadow-lg shadow-secondary/20 group-hover:rotate-12 transition-transform">
              <Settings size={28} className="animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-black text-lg md:text-2xl tracking-tighter text-secondary uppercase italic leading-none">
                Bourouisse <span className="text-white">Piece-Dz</span>
              </span>
              <span className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase mt-1">
                Pièces & Automobiles
              </span>
            </div>
          </Link>
        </div>

        {/* Portals Section & Language */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white h-12 px-6 rounded-xl flex items-center justify-center text-primary shadow-xl border-2 border-white/20 font-black text-sm min-w-[120px] hover:bg-zinc-100 transition-all uppercase"
              >
                {languages.find(l => l.code === currentLang)?.name || "اللغة"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white p-2">
              <DropdownMenuLabel className="text-center">Language / اللغة</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code} 
                  onSelect={() => setCurrentLang(lang.code as any)}
                  className={cn("hover:bg-zinc-800 cursor-pointer h-10 rounded-lg", currentLang === lang.code && "bg-secondary/10 font-bold text-secondary")}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <Link href="https://wa.me/213778428977" target="_blank" className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
              <WhatsappIcon size={20} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
              <Facebook size={20} />
            </Link>
            <Button variant="default" className="flex gap-2 items-center bg-white text-primary hover:bg-zinc-100 font-black text-sm h-12 px-6 rounded-xl transition-all shadow-xl" asChild>
              <Link href="/buyer/register">
                <User size={20} />
                <span className="hidden lg:inline">{t.buyer}</span>
              </Link>
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="flex gap-2 items-center bg-white text-primary hover:bg-zinc-100 font-black text-sm h-12 px-6 rounded-xl transition-all shadow-xl">
                <LayoutDashboard size={20} />
                <span className="hidden lg:inline">{t.seller}</span>
                <ChevronDown size={14} className="opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-zinc-900 border-zinc-800 text-white p-2">
              <DropdownMenuLabel className="text-secondary">{t.seller}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem asChild className="hover:bg-zinc-800 cursor-pointer h-12 rounded-lg mt-1">
                <Link href="/seller/dashboard" className="w-full font-bold">{t.stats}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-zinc-800 cursor-pointer h-12 rounded-lg mt-1">
                <Link href="/seller/listings/new" className="w-full font-bold">{t.new}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-zinc-800 cursor-pointer h-12 rounded-lg mt-1">
                <Link href="/seller/register" className="w-full font-bold text-secondary">{t.store}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <div className="p-2 flex items-center justify-around">
                 <Link href="#" className="text-green-500 hover:scale-125 transition-transform"><WhatsappIcon size={24} /></Link>
                 <Link href="#" className="text-blue-500 hover:scale-125 transition-transform"><Facebook size={24} /></Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {pathname !== "/" && (
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 bg-destructive border-2 border-destructive text-white hover:bg-red-700 transition-all shadow-xl rounded-xl"
              onClick={() => router.back()}
              title={t.back}
            >
              <ArrowRight size={24} />
            </Button>
          )}
        </div>
      </div>

      {/* FIXED RED BAR - Brands & Categories */}
      <section className="bg-destructive border-b-2 border-secondary h-[75px] w-full flex items-center overflow-hidden shadow-lg">
        <div className="container mx-auto px-4 flex flex-col md:flex-row-reverse items-center justify-between h-full gap-4">
          {/* Brand Logos */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
            {BRANDS.map((brand, i) => (
              <Link 
                key={i} 
                href={`/catalog?brand=${brand.name}`}
                className="flex flex-col items-center group transition-all duration-300 transform hover:scale-110 shrink-0"
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

          {/* Category Links */}
          <div className="flex flex-row-reverse items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar flex-grow justify-center">
            {t.categories.map((catName, i) => (
              <Link
                key={i}
                href={`/catalog?category=${encodeURIComponent(catName)}`}
                className="flex flex-row-reverse items-center gap-2.5 group transition-all shrink-0"
              >
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-secondary group-hover:text-primary transition-all group-hover:scale-110 shadow-sm">
                  {CATEGORY_ICONS[i]}
                </div>
                <span className="text-sm md:text-base font-extrabold text-white group-hover:text-secondary transition-colors whitespace-nowrap">
                  {catName}
                </span>
              </Link>
            ))}
          </div>

          <Link href="/catalog" className="text-xs font-black text-secondary border-r-2 border-secondary/30 pr-6 mr-3 hover:underline whitespace-nowrap hidden lg:block">
            {t.all}
          </Link>
        </div>
      </section>
    </nav>
  );
}
