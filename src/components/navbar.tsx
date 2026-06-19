"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  User, Settings, LayoutDashboard, ChevronDown, ArrowRight, Phone, 
  Mail, Facebook, Car, Zap, Disc, Sparkles, Scale, Plug, ShieldAlert, 
  LogIn, UserPlus, Store, Languages, Globe, ShieldCheck, Lock
} from "lucide-react";
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

const CATEGORY_ICONS = [
  <Car size={24} className="text-black" />,
  <Zap size={24} className="text-black" />,
  <Scale size={24} className="text-black" />,
  <Plug size={24} className="text-black" />,
  <Disc size={24} className="text-black" />,
  <Sparkles size={24} className="text-black" />,
];

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
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-2xl h-[235px] border-b">
      {/* Top Bar: White background with Black text */}
      <div className="bg-white border-b border-zinc-100 py-2">
        <div className={cn(
          "container mx-auto px-4 flex items-center justify-between gap-4",
          lang === 'AR' ? "flex-row-reverse" : "flex-row"
        )}>
          <div className={cn(
            "flex items-center gap-6 text-black",
            lang === 'AR' ? "flex-row-reverse" : "flex-row"
          )}>
            <span className="text-[11px] font-black uppercase tracking-widest">{t.contact}</span>
            <div className={cn(
              "flex items-center gap-2 text-[12px] font-bold",
              lang === 'AR' ? "flex-row-reverse" : "flex-row"
            )}>
              <Phone size={16} className="text-primary" />
              <span dir="ltr">+213 778 42 89 77</span>
            </div>
          </div>
          
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

      <div className={cn(
        "container mx-auto px-4 py-4 flex items-center justify-between gap-4 h-[100px]",
        lang === 'AR' ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className={cn(
            "flex items-center gap-3 group",
            lang === 'AR' ? "flex-row-reverse" : "flex-row"
          )}>
            <div className="bg-secondary p-2 rounded-2xl text-black shadow-lg shadow-secondary/20 group-hover:rotate-12 transition-transform">
              <Settings size={28} className="animate-spin-slow" />
            </div>
            <div className={cn("flex flex-col", lang === 'AR' ? "text-right" : "text-left")}>
              <span className="font-headline font-black text-lg md:text-2xl tracking-tighter text-primary uppercase italic leading-none">
                Bourouisse <span className="text-black">Piece-Dz</span>
              </span>
              <span className="text-[10px] font-bold text-black/50 tracking-[0.2em] uppercase mt-1">
                {lang === 'AR' ? 'قطع غيار وسيارات' : 'Spare Parts & Automobiles'}
              </span>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
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

      {/* Categories Bar: Light Sky Blue background with Black text */}
      <section className="bg-sky-200 border-b-2 border-sky-300 h-[75px] w-full flex items-center overflow-hidden shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-center h-full gap-8">
          <div className={cn(
            "flex items-center gap-6 md:gap-12 overflow-x-auto no-scrollbar justify-center",
            lang === 'AR' ? "flex-row-reverse" : "flex-row"
          )}>
            {t.categories.map((catName, i) => (
              <Link
                key={i}
                href={`/catalog?category=${encodeURIComponent(catName)}`}
                className={cn(
                  "flex items-center gap-3 group transition-all shrink-0",
                  lang === 'AR' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className="p-2 rounded-lg bg-black/5 group-hover:bg-black group-hover:text-sky-200 transition-all group-hover:scale-110 shadow-sm">
                  {CATEGORY_ICONS[i]}
                </div>
                <span className="text-sm md:text-base font-extrabold text-black group-hover:text-primary transition-colors whitespace-nowrap">
                  {catName}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </nav>
  );
}
