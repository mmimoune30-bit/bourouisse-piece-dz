
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { User, Settings, LayoutDashboard, ChevronDown, ArrowRight, Phone, Mail, Facebook, Car, Zap, Disc, Sparkles, Scale, Plug, ShieldAlert, LogIn, UserPlus, Store } from "lucide-react";
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
    admin: "لوحة المسؤول (Admin)",
    back: "رجوع", 
    contact: "للاستفسار:",
    all: "عرض الكل",
    login: "الدخول إلى حسابي",
    join: "انضم إلينا",
    categories: ["الهيكل", "المحرك", "التوازي و التوازن", "الكهرباء", "الإطارات", "الأكسيسوارات"]
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

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminCheck = localStorage.getItem("is_admin") === "true";
    setIsAdmin(adminCheck);
  }, []);

  const t = translations.AR;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black shadow-2xl h-[235px]">
      {/* Top Bar: Contact Info */}
      <div className="bg-zinc-900/80 border-b border-white/5 py-2">
        <div className="container mx-auto px-4 flex flex-row-reverse items-center justify-between gap-4">
          <div className="flex flex-row-reverse items-center gap-6 text-white/80">
            <span className="text-[11px] font-black text-secondary uppercase tracking-widest ml-2">{t.contact}</span>
            <div className="flex flex-row-reverse items-center gap-2 text-[12px] font-bold">
              <Phone size={16} className="text-secondary" />
              <span dir="ltr">+213 778 42 89 77</span>
            </div>
          </div>
          {/* Removed login/join links from here as requested */}
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

        {/* Action Buttons Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button variant="default" className="flex gap-2 items-center bg-white text-primary hover:bg-zinc-100 font-black text-sm h-12 px-6 rounded-xl transition-all shadow-xl" asChild>
              <Link href="/login">
                <LogIn size={20} />
                <span className="hidden lg:inline">{t.login}</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="default" className="flex gap-2 items-center bg-white text-primary hover:bg-zinc-100 font-black text-sm h-12 px-6 rounded-xl transition-all shadow-xl" asChild>
              <Link href="/join">
                <UserPlus size={20} />
                <span className="hidden lg:inline">{t.buyer}</span>
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="default" className="flex gap-2 items-center bg-secondary text-primary hover:bg-white font-black text-sm h-12 px-6 rounded-xl transition-all shadow-xl" asChild>
              <Link href="/seller/register">
                <Store size={20} />
                <span className="hidden lg:inline">{t.seller}</span>
              </Link>
            </Button>
          </div>

          {isAdmin && (
            <Button variant="default" className="flex gap-2 items-center bg-destructive text-white hover:bg-red-700 font-black text-sm h-12 px-6 rounded-xl transition-all shadow-xl" asChild>
              <Link href="/admin/dashboard">
                <ShieldAlert size={20} />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            </Button>
          )}

          {pathname !== "/" && (
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 bg-zinc-800 border-2 border-zinc-700 text-white hover:bg-zinc-700 transition-all shadow-xl rounded-xl"
              onClick={() => router.back()}
              title={t.back}
            >
              <ArrowRight size={24} className="w-8 h-8" />
            </Button>
          )}
        </div>
      </div>

      {/* FIXED RED BAR - Categories Only */}
      <section className="bg-destructive border-b-2 border-secondary h-[75px] w-full flex items-center overflow-hidden shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-center h-full gap-8">
          <div className="flex flex-row-reverse items-center gap-6 md:gap-12 overflow-x-auto no-scrollbar justify-center">
            {t.categories.map((catName, i) => (
              <Link
                key={i}
                href={`/catalog?category=${encodeURIComponent(catName)}`}
                className="flex flex-row-reverse items-center gap-3 group transition-all shrink-0"
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
        </div>
      </section>
    </nav>
  );
}
