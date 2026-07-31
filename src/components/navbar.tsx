"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Phone, Mail, Globe, ChevronDown, Store, UserPlus, LogIn, Menu, X, Tags, Home, ArrowRight
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
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import { cn } from "@/lib/utils";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.05-.148-.471-1.138-.646-1.557-.171-.406-.347-.35-.471-.357-.121-.006-.26-.007-.4 architecture-008-.135 0-.354.05-.539.247-.185.198-.708.691-.708 1.684 0 .993.722 1.952.821 2.085.1.133 1.422 2.172 3.444 3.046.482.208.858.332 1.151.426.484.154.925.132 1.272.067.387-.072 1.138-.465 1.298-.914.161-.448.161-.832.113-.914-.047-.082-.172-.132-.469-.281zM12.004 0C5.374 0 0 5.373 0 12c0 2.123.55 4.12 1.519 5.861L.061 24l6.294-1.651A11.947 11.947 0 0 0 12.004 24c6.628 0 12.003-5.373 12.003-12s-5.375-12-12.003-12zm0 21.928c-1.895 0-4.18-.485-5.836-1.391l-.419-.232-3.738.981 1.002-3.642-.256-.407A9.923 9.923 0 0 1 2.006 12C2.006 6.486 6.488 2.004 12.004 2.004c5.514 0 9.996 4.482 9.996 9.996 0 5.516-4.482 9.928-9.996 9.928z"/>
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"AR" | "EN">("AR");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const HIDDEN_SEARCH_ROUTES = ["/login", "/join", "/buyer/register", "/seller/register", "/setup-admin"];
  const showSearch = !HIDDEN_SEARCH_ROUTES.includes(pathname);
  const isNotHome = pathname !== "/";

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as "AR" | "EN";
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLang = (newLang: "AR" | "EN") => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col shadow-md">
      {/* Layer 1: Top Info Bar */}
      <div className="bg-white border-b border-zinc-100 py-1 overflow-hidden">
        <div className="w-full px-2 flex items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden relative h-6">
            <div className="flex items-center gap-12 whitespace-nowrap animate-ticker-ltr absolute top-0">
               <div className="flex items-center gap-8 text-black font-black uppercase text-[10px] md:text-[11px]">
                  <span className="text-black tracking-widest">{lang === 'AR' ? 'للاستفسار:' : 'Inquiry:'}</span>
                  <span className="flex items-center gap-2 font-bold"><Phone size={14} className="text-black" /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-2 font-bold"><WhatsAppIcon /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-2 font-bold"><Mail size={14} className="text-black" /> support@bourouisse-piecedz.com</span>
               </div>
            </div>
          </div>
          <div className="shrink-0 pl-2 border-l flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-black hover:bg-zinc-100 gap-1 md:gap-2 font-black h-7 md:h-8 px-1">
                  <Globe size={14} className="text-black" />
                  <span className="text-[10px] md:text-sm">{lang === 'AR' ? 'العربية' : 'English'}</span>
                  <ChevronDown size={12} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={lang === 'AR' ? "end" : "start"} className="w-32">
                <DropdownMenuItem onClick={() => toggleLang("AR")} className="justify-end font-black cursor-pointer">العربية</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLang("EN")} className="justify-end font-black cursor-pointer">English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Layer 2: Main Branding & Responsive Actions */}
      <div className="bg-white py-2 border-b">
        <div className="w-full px-2 flex items-center justify-between gap-2 md:gap-4">
          
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="hover:opacity-90 transition-opacity shrink-0">
              <SiteLogo className="min-w-[180px] md:min-w-[240px]" />
            </Link>

            {isNotHome && (
              <Link href="/">
                <Button variant="outline" size="sm" className="border-2 border-black text-black font-black rounded-xl h-10 px-4 gap-2 hover:bg-black hover:text-white transition-all shadow-sm">
                   <Home size={16} /> {lang === 'AR' ? 'الرجوع للرئيسية' : 'Back to Home'}
                </Button>
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2" dir="rtl">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-black font-black hover:bg-zinc-50 rounded-xl gap-2 h-11 px-3">
                  <Tags size={18} /> {lang === 'AR' ? 'تصنيفات قطع الغيار' : 'Categories'} <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl overflow-y-auto max-h-[70vh]" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
                {PART_CATEGORIES.map((cat) => (
                  <DropdownMenuItem key={cat.en} asChild>
                    <Link href={`/catalog?category=${cat.en}`} className="justify-end font-black py-2 cursor-pointer rounded-xl text-right w-full text-black">
                      {lang === 'AR' ? cat.ar : cat.en}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/seller/register">
              <Button className="bg-secondary text-black font-black hover:bg-black hover:text-white rounded-xl gap-2 shadow-sm h-11 px-4 transition-all">
                <Store size={18} /> كن بائعاً معنا
              </Button>
            </Link>
            <Link href="/join">
              <Button variant="outline" className="border-2 border-black text-black font-black hover:bg-black hover:text-white rounded-xl gap-2 h-11 px-4 transition-all">
                <UserPlus size={18} /> إضافة حساب
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-black font-black hover:bg-zinc-100 rounded-xl gap-2 h-11 px-3">
                <LogIn size={18} /> دخول
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-xl w-9 h-9 text-black" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-2xl py-6 px-4 space-y-4" dir="rtl">
          {isNotHome && (
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full border-2 border-black text-black font-black h-14 rounded-xl gap-3 text-lg">
                <Home size={22} /> {lang === 'AR' ? 'الرجوع للرئيسية' : 'Back to Home'}
              </Button>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full text-black font-black h-14 rounded-xl gap-3 text-lg justify-start">
                <Tags size={22} /> {lang === 'AR' ? 'تصنيفات قطع الغيار' : 'Categories'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[calc(100vw-32px)] p-2 rounded-2xl shadow-2xl overflow-y-auto max-h-[50vh]" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
              {PART_CATEGORIES.map((cat) => (
                <DropdownMenuItem key={cat.en} asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href={`/catalog?category=${cat.en}`} className="justify-end font-black py-3 cursor-pointer rounded-xl text-right w-full text-black">
                    {lang === 'AR' ? cat.ar : cat.en}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/seller/register" onClick={() => setIsMobileMenuOpen(false)}>
             <Button className="w-full bg-secondary text-black font-black h-14 rounded-2xl gap-3 text-lg">
                <Store size={20} /> كن بائعاً معنا
             </Button>
          </Link>
          <Link href="/join" onClick={() => setIsMobileMenuOpen(false)}>
             <Button variant="outline" className="w-full border-2 border-black text-black font-black h-14 rounded-2xl gap-3 text-lg">
                <UserPlus size={20} /> إضافة حساب
             </Button>
          </Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
             <Button variant="ghost" className="w-full text-black font-black h-14 rounded-2xl gap-3 text-lg">
                <LogIn size={20} /> دخول الحساب
             </Button>
          </Link>
        </div>
      )}

      {/* Layer 3: Global Smart Search Bar */}
      {showSearch && (
        <div className="bg-white py-0.5 border-b shadow-sm relative">
          <div className="w-full px-1 relative z-10">
            <AISearchBox />
          </div>
        </div>
      )}
    </nav>
  );
}
