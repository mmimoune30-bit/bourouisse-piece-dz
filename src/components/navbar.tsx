"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Phone, Globe, ChevronDown, Store, LogIn, Home, UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AISearchBox from "@/components/ai-search-box";
import SiteLogo from "@/components/site-logo";
import { cn } from "@/lib/utils";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.05-.148-.471-1.138-.646-1.557-.171-.406-.347-.35-.471-.357-.121-.006-.26-.007-.408-.008-.135 0-.354.05-.539.247-.185.198-.708.691-.708 1.684 0 .993.722 1.952.821 2.085.1.133 1.422 2.172 3.444 3.046.482.208.858.332 1.151.426.484.154.925.132 1.272.067.387-.072 1.138-.465 1.298-.914.161-.448.161-.832.113-.914-.047-.082-.172-.132-.469-.281zM12.004 0C5.374 0 0 5.373 0 12c0 2.123.55 4.12 1.519 5.861L.061 24l6.294-1.651A11.947 11.947 0 0 0 12.004 24c6.628 0 12.003-5.373 12.003-12s-5.375-12-12.003-12zm0 21.928c-1.895 0-4.18-.485-5.836-1.391l-.419-.232-3.738.981 1.002-3.642-.256-.407A9.923 9.923 0 0 1 2.006 12C2.006 6.486 6.488 2.004 12.004 2.004c5.514 0 9.996 4.482 9.996 9.996 0 5.516-4.482 9.928-9.996 9.928z"/>
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");

  const HIDDEN_SEARCH_ROUTES = ["/login", "/join", "/buyer/register", "/seller/register", "/setup-admin"];
  const showSearch = !HIDDEN_SEARCH_ROUTES.includes(pathname);
  const isNotHome = pathname !== "/";

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
    if (savedLang) setLang(savedLang);

    const handleLangUpdate = () => {
      const current = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (current) setLang(current);
    };
    window.addEventListener("languageChange", handleLangUpdate);
    return () => window.removeEventListener("languageChange", handleLangUpdate);
  }, []);

  const toggleLang = (newLang: "AR" | "EN" | "FR") => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  const navFont = lang === 'AR' ? 'font-black' : 'font-bold';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col pointer-events-auto">
      {/* 1. Top Ticker Bar */}
      <div className="w-full bg-zinc-950 border-b border-white/5 py-1.5 overflow-hidden shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden relative h-5">
            <div className="flex items-center gap-8 whitespace-nowrap animate-ticker-ltr absolute top-0">
               <div className={cn("flex items-center gap-8 text-white/90 uppercase text-[10px] md:text-[12px]", navFont)}>
                  <span className="text-secondary tracking-widest">{lang === 'AR' ? 'للاستفسار:' : 'Inquiry:'}</span>
                  <span className="flex items-center gap-1.5"><Phone size={10} className="text-secondary" /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-1.5"><WhatsAppIcon /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-1.5 font-mono">support@bourouisse.com</span>
               </div>
            </div>
          </div>
          <div className="shrink-0 pl-3 border-l border-white/10">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={cn("text-white/80 hover:bg-white/10 h-6 px-2 rounded-lg", navFont)}>
                  <Globe size={12} className="text-secondary" />
                  <span className="text-[10px] mx-1">{lang}</span>
                  <ChevronDown size={10} className="opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-28 bg-zinc-900 border-white/10 text-white p-1 z-50">
                <DropdownMenuItem onClick={() => toggleLang("AR")} className="justify-end font-black text-xs cursor-pointer">العربية</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLang("EN")} className="justify-end font-bold text-xs cursor-pointer">English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLang("FR")} className="justify-end font-bold text-xs cursor-pointer">Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Auth Bar */}
      <div className="w-full bg-white py-3 border-b shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4" dir={lang === 'AR' ? "rtl" : "ltr"}>
          <Link href="/" className="hover:opacity-90 transition-all shrink-0">
            <SiteLogo className="min-w-[150px] md:min-w-[220px]" showTagline={true} />
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              <Button asChild className={cn("bg-primary text-secondary hover:bg-black rounded-xl h-10 px-4 md:px-6 uppercase shadow-lg active:scale-95 text-[10px] md:text-xs cursor-pointer", navFont)}>
                <Link href="/seller/register">
                  <Store size={14} className={lang === 'AR' ? "ml-2" : "mr-2"} /> {lang === 'AR' ? 'كن بائعاً معنا' : 'Become Seller'}
                </Link>
              </Button>

              <div className="flex items-center gap-1.5 md:gap-2 bg-zinc-50 p-1 rounded-2xl border">
                <Button asChild variant="ghost" className={cn("text-primary hover:bg-white rounded-xl h-9 px-3 md:px-4 uppercase active:scale-95 text-[10px] md:text-xs cursor-pointer", navFont)}>
                  <Link href="/join">{lang === 'AR' ? 'إنشاء حساب' : 'Join'}</Link>
                </Button>

                <Button asChild className={cn("bg-secondary text-primary hover:bg-yellow-500 rounded-xl h-9 px-4 md:px-5 uppercase shadow-sm active:scale-95 text-[10px] md:text-xs cursor-pointer", navFont)}>
                  <Link href="/login">{lang === 'AR' ? 'دخول' : 'Login'}</Link>
                </Button>
              </div>
            </div>

            {/* Mobile View Buttons */}
            <div className="sm:hidden flex gap-2">
              <Button asChild size="sm" className="bg-secondary text-primary h-9 w-9 rounded-xl p-0 cursor-pointer">
                <Link href="/login"><LogIn size={18} /></Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="h-9 w-9 rounded-xl p-0 cursor-pointer">
                <Link href="/join"><UserPlus size={18} /></Link>
              </Button>
            </div>

            {isNotHome && (
              <Button asChild variant="ghost" size="sm" className={cn("text-primary rounded-xl h-10 px-3 md:px-4 gap-2 hover:bg-zinc-50 border-none active:scale-95 text-[10px] md:text-xs cursor-pointer", navFont)}>
                <Link href="/">
                  <Home size={16} className="text-secondary" /> <span className="hidden md:inline">{lang === 'AR' ? 'الرئيسية' : 'Home'}</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Search Bar Layer */}
      {showSearch && (
        <div className="w-full bg-white/90 backdrop-blur-md py-2 border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <AISearchBox />
          </div>
        </div>
      )}
    </header>
  );
}