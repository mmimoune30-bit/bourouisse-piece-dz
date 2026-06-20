
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  User, Settings, LayoutDashboard, ChevronDown, ArrowRight, Phone, 
  Mail, LogIn, UserPlus, Store, Globe, ShieldCheck, Lock, Search, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import AISearchBox from "./ai-search-box";
import Image from "next/image";

const translations = {
  AR: { 
    buyer: "حساب جديد", 
    seller: "كن بائعاً معنا", 
    stats: "لوحة التحكم", 
    new: "إعلان جديد", 
    store: "فتح متجر", 
    admin: "إدارة المنصة",
    back: "رجوع", 
    contact: "للاستفسار:",
    all: "عرض الكل",
    login: "الدخول إلى حسابي",
    join: "انضم إلينا",
    categories: ["الهيكل", "المحرك", "التوازي و التوازن", "الكهرباء", "الإطارات", "الأكسيسوارات"]
  },
  EN: {
    buyer: "New Account",
    seller: "Become a Seller",
    stats: "Dashboard",
    new: "New Listing",
    store: "Open Store",
    admin: "Platform Management",
    back: "Back",
    contact: "Inquiry:",
    all: "View All",
    login: "Login to My Account",
    join: "Join Us",
    categories: ["Body", "Engine", "Suspension", "Electric", "Tires", "Accessories"]
  }
};

const CATEGORY_IMAGE_IDS = [
  "body-category",
  "engine-category",
  "suspension-category",
  "electrical-category",
  "wheels-category",
  "accessories-category"
];

// WhatsApp SVG Icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.05-.148-.471-1.138-.646-1.557-.171-.406-.347-.35-.471-.357-.121-.006-.26-.007-.4 architecture-008-.135 0-.354.05-.539.247-.185.198-.708.691-.708 1.684 0 .993.722 1.952.821 2.085.1.133 1.422 2.172 3.444 3.046.482.208.858.332 1.151.426.484.154.925.132 1.272.067.387-.072 1.138-.465 1.298-.914.161-.448.161-.832.113-.914-.047-.082-.172-.132-.469-.281zM12.004 0C5.374 0 0 5.373 0 12c0 2.123.55 4.12 1.519 5.861L.061 24l6.294-1.651A11.947 11.947 0 0 0 12.004 24c6.628 0 12.003-5.373 12.003-12s-5.375-12-12.003-12zm0 21.928c-1.895 0-4.18-.485-5.836-1.391l-.419-.232-3.738.981 1.002-3.642-.256-.407A9.923 9.923 0 0 1 2.006 12C2.006 6.486 6.488 2.004 12.004 2.004c5.514 0 9.996 4.482 9.996 9.996 0 5.516-4.482 9.928-9.996 9.928z"/>
  </svg>
);

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
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

  const toggleLang = (newLang: "AR" | "EN") => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  const t = translations[lang];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-2xl border-b">
      {/* Top Bar: News Ticker Style */}
      <div className="bg-white border-b border-zinc-100 py-2 overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          
          <div className="flex-1 overflow-hidden relative h-6">
            <div className="flex items-center gap-12 whitespace-nowrap animate-ticker-ltr absolute top-0">
               <div className="flex items-center gap-8 text-black font-black uppercase text-[11px]">
                  <span className="text-primary tracking-widest">{t.contact}</span>
                  <span className="flex items-center gap-2 font-bold"><Phone size={14} className="text-primary" /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-2 font-bold"><WhatsAppIcon /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-2 font-bold"><Mail size={14} className="text-primary" /> support@bourouisse-piecedz.com</span>
               </div>
               <div className="flex items-center gap-8 text-black font-black uppercase text-[11px]">
                  <span className="text-primary tracking-widest">{t.contact}</span>
                  <span className="flex items-center gap-2 font-bold"><Phone size={14} className="text-primary" /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-2 font-bold"><WhatsAppIcon /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-2 font-bold"><Mail size={14} className="text-primary" /> support@bourouisse-piecedz.com</span>
               </div>
            </div>
          </div>

          <div className="shrink-0 bg-white/90 backdrop-blur-sm z-10 pl-4 border-l">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-black hover:bg-zinc-100 gap-2 font-bold">
                  <Globe size={16} className="text-primary" />
                  {lang === 'AR' ? 'العربية' : 'English'}
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={lang === 'AR' ? "end" : "start"} className="w-32">
                <DropdownMenuItem onClick={() => toggleLang("AR")} className="justify-end font-bold cursor-pointer">العربية</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLang("EN")} className="justify-end font-bold cursor-pointer">English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className={cn(
        "container mx-auto px-4 py-4 flex items-center justify-between gap-4",
        lang === 'AR' ? "flex-row-reverse" : "flex-row"
      )}>
        <div className="flex items-center gap-4">
          <Link href="/" className={cn(
            "flex items-center gap-3 group",
            lang === 'AR' ? "flex-row-reverse" : "flex-row"
          )}>
            <div className="bg-secondary p-2 rounded-2xl text-black shadow-lg shadow-secondary/20 group-hover:rotate-12 transition-transform">
              <Settings size={28} className="animate-spin-slow" />
            </div>
            <div className={cn("flex flex-col", lang === 'AR' ? "text-right" : "text-left")}>
              <span className="font-headline font-black text-lg md:text-2xl tracking-tighter text-primary uppercase italic leading-none whitespace-nowrap" dir="ltr">
                {"Bourouisse ".split("").map((char, i) => (
                  <span key={i} className="animate-logo-ripple" style={{ animationDelay: `${i * 0.1}s` }}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
                <span className="text-black">
                  {"Piece-Dz".split("").map((char, i) => (
                    <span key={i} className="animate-logo-ripple" style={{ animationDelay: `${(i + 11) * 0.1}s` }}>
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              </span>
              <span className="text-[10px] font-bold text-black/50 tracking-[0.2em] uppercase mt-1">
                {lang === 'AR' ? 'قطع غيار وسيارات' : 'Spare Parts & Automobiles'}
              </span>
            </div>
          </Link>
        </div>

        <div className={cn(
          "flex items-center gap-3",
          lang === 'AR' ? "flex-row-reverse" : "flex-row"
        )}>
          <Button variant="outline" className="bg-white text-primary border-2 border-primary/20 hover:bg-zinc-50 font-black text-sm h-12 px-6 rounded-xl shadow-xl" asChild>
            <Link href="/login" className="flex gap-2 items-center">
              <LogIn size={20} />
              <span className="hidden lg:inline">{t.login}</span>
            </Link>
          </Button>

          <Button variant="outline" className="bg-white text-primary border-2 border-primary/20 hover:bg-zinc-50 font-black text-sm h-12 px-6 rounded-xl shadow-xl" asChild>
            <Link href="/join" className="flex gap-2 items-center">
              <UserPlus size={20} />
              <span className="hidden lg:inline">{t.buyer}</span>
            </Link>
          </Button>
          
          <Button variant="default" className="bg-secondary text-primary hover:bg-white font-black text-sm h-12 px-6 rounded-xl shadow-xl" asChild>
            <Link href="/seller/register" className="flex gap-2 items-center">
              <Store size={20} />
              <span className="hidden lg:inline">{t.seller}</span>
            </Link>
          </Button>

          {pathname !== "/" && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 bg-white border-2 border-zinc-200 text-black hover:bg-zinc-50 transition-all shadow-xl rounded-xl"
              onClick={() => router.back()}
              title={t.back}
            >
              <ArrowRight size={24} className={cn("w-8 h-8", lang === 'EN' && "rotate-180")} />
            </Button>
          )}
        </div>
      </div>

      {/* SEARCH INTEGRATION */}
      <AISearchBox />

      <section className="bg-sky-200 border-b-2 border-sky-300 h-[75px] w-full flex items-center overflow-hidden shadow-lg relative z-0">
        <div className="container mx-auto px-4 flex items-center justify-center h-full gap-8">
          <div className={cn(
            "flex items-center gap-6 md:gap-12 overflow-x-auto no-scrollbar justify-center",
            lang === 'AR' ? "flex-row-reverse" : "flex-row"
          )}>
            {t.categories.map((catName, i) => {
              const imageId = CATEGORY_IMAGE_IDS[i];
              const imgData = PlaceHolderImages.find(img => img.id === imageId);
              
              return (
                <Link
                  key={i}
                  href={`/catalog?category=${encodeURIComponent(catName)}`}
                  className={cn(
                    "flex items-center gap-3 group transition-all shrink-0",
                    lang === 'AR' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden border-2 border-sky-300 group-hover:border-primary transition-all group-hover:scale-110 shadow-sm relative">
                    {imgData ? (
                      <Image 
                        src={imgData.imageUrl} 
                        alt={catName} 
                        fill 
                        className="object-cover" 
                        data-ai-hint={imgData.imageHint} 
                      />
                    ) : (
                      <div className="w-full h-full bg-white flex items-center justify-center">
                         <Settings size={20} className="text-sky-300" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm md:text-base font-extrabold text-black group-hover:text-primary transition-colors whitespace-nowrap">
                    {catName}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </nav>
  );
}
