"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { User, Settings, LayoutDashboard, ChevronDown, Languages, ArrowRight, Phone, Mail, Facebook } from "lucide-react";
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

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState("AR");

  const languages = [
    { code: "AR", name: "العربية", flag: "🇩🇿" },
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "EN", name: "English", flag: "🇺🇸" },
  ];

  // Custom SVGs for TikTok and Viber since they are not in Lucide
  const TikTokIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.5c0 1.25-.23 2.48-.91 3.51-.89 1.4-2.39 2.34-4.04 2.39-1.52.05-3.08-.43-4.24-1.41-1.39-1.14-2.15-2.92-2-4.69.11-1.92 1.3-3.75 3.09-4.52.48-.21 1-.34 1.52-.39v4.03c-.48.08-1 .31-1.35.66-.41.4-.64.97-.62 1.54.02.66.42 1.3 1.02 1.57.51.24 1.1.28 1.62.1.66-.23 1.13-.88 1.13-1.58V.02z" />
    </svg>
  );

  const ViberIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.34 1.32C17.14.34 14.54 0 12 0 6.64 0 2.27 4.37 2.27 9.73c0 2.61 1.02 5.09 2.87 6.94l-1.07 3.9c-.11.41.24.78.65.67l3.9-1.07c1.85 1.85 4.33 2.87 6.94 2.87 5.36 0 9.73-4.37 9.73-9.73 0-2.54-.34-5.14-1.32-7.34l-.6.35c.82 1.83 1.1 4 1.1 6.12 0 4.93-4.01 8.93-8.93 8.93-2.33 0-4.6-.9-6.32-2.52l-.46-.46-3.23.88.88-3.23-.46-.46-3.23.88.88-3.23-.46-.46c-1.62-1.72-2.52-3.99-2.52-6.32 0-4.93 4.01-8.93 8.93-8.93 2.12 0 4.29.28 6.12 1.1l.35-.6zM15.54 13.52c-.34.34-.84.45-1.28.29-.44-.16-.83-.49-1.12-.89-.29-.4-.52-.86-.67-1.36-.15-.5-.22-1.01-.22-1.52 0-.34.03-.68.08-1.01l1.54.34c-.04.22-.06.45-.06.67 0 .34.05.68.15 1.01.1.33.25.64.44.91.19.27.42.5.68.68.26.18.55.32.86.41.31.09.64.13.97.13.15 0 .29-.01.44-.04l.34 1.54c-.22.03-.45.05-.67.06-.51 0-1.02-.07-1.52-.22-.5-.15-.96-.38-1.36-.67-.4-.29-.73-.68-.89-1.12-.16-.44-.05-.94.29-1.28l-.34-1.54-.34 1.54z" />
    </svg>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black shadow-2xl border-b-2 border-secondary/30">
      {/* Top Bar: Contact & Social Info */}
      <div className="bg-zinc-900/80 border-b border-white/5 py-2">
        <div className="container mx-auto px-4 flex flex-row-reverse items-center justify-between gap-4">
          <div className="flex flex-row-reverse items-center gap-6 text-white/80">
            <span className="text-[11px] font-black text-secondary uppercase tracking-widest ml-2">للاستفسار:</span>
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
            <Link href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary hover:text-black transition-all shadow-md">
              <Facebook size={24} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary hover:text-black transition-all shadow-md">
              <TikTokIcon />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary hover:text-black transition-all shadow-md">
              <ViberIcon />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-5 flex items-center justify-between gap-4">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-secondary p-2.5 rounded-2xl text-black shadow-lg shadow-secondary/20 group-hover:rotate-12 transition-transform">
              <Settings size={36} className="animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-black text-xl md:text-3xl tracking-tighter text-secondary uppercase italic leading-none">
                Bourouisse <span className="text-white">Piece-Dz</span>
              </span>
              <span className="text-[11px] font-bold text-white/50 tracking-[0.25em] uppercase mt-1.5">
                Pièces & Automobiles
              </span>
            </div>
          </Link>
        </div>

        {/* Portals Section & Language */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-white h-14 px-8 rounded-xl flex items-center justify-center text-primary shadow-2xl border border-white/10 cursor-pointer group hover:bg-zinc-100 transition-all font-black text-base min-w-[120px]">
                {languages.find(l => l.code === currentLang)?.name || "اللغة"}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white p-2">
              <DropdownMenuLabel className="text-center">اختر اللغة / Choisir la langue</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code} 
                  onClick={() => setCurrentLang(lang.code)}
                  className={cn("hover:bg-zinc-800 cursor-pointer h-10 rounded-lg", currentLang === lang.code && "bg-secondary/10 font-bold text-secondary")}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Buyer Portal */}
          <Button variant="default" className="flex gap-3 items-center bg-white text-primary hover:bg-zinc-100 font-black text-base h-14 px-8 rounded-xl transition-all shadow-2xl border border-white/10" asChild>
            <Link href="/buyer/register">
              <User size={24} />
              <span className="hidden lg:inline">بوابة المشتري</span>
            </Link>
          </Button>
          
          {/* Seller Portal (Dropdown) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="flex gap-3 items-center bg-white text-primary hover:bg-zinc-100 font-black text-base h-14 px-8 rounded-xl transition-all shadow-2xl border border-white/10">
                <LayoutDashboard size={24} />
                <span className="hidden lg:inline">بوابة البائع</span>
                <ChevronDown size={16} className="opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-zinc-900 border-zinc-800 text-white p-2">
              <DropdownMenuLabel className="text-secondary">إدارة الأعمال</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem asChild className="hover:bg-zinc-800 cursor-pointer h-12 rounded-lg mt-1">
                <Link href="/seller/dashboard" className="w-full font-bold">لوحة التحكم الإحصائية</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-zinc-800 cursor-pointer h-12 rounded-lg mt-1">
                <Link href="/seller/listings/new" className="w-full font-bold">إضافة إعلان جديد</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-zinc-800 cursor-pointer h-12 rounded-lg mt-1">
                <Link href="/seller/register" className="w-full font-bold text-secondary">فتح متجر احترافي</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Back Button */}
          {pathname !== "/" && (
            <div className="flex flex-col items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 bg-white border-2 border-white text-primary hover:bg-zinc-100 hover:text-primary transition-all shadow-2xl rounded-xl"
                onClick={() => router.back()}
                title="رجوع"
              >
                <ArrowRight size={28} />
              </Button>
              <span className="text-[12px] font-black text-secondary uppercase tracking-tight">رجوع</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
