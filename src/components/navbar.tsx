"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Phone, Globe, ChevronDown, Store, UserPlus, LogIn, Menu, X, Home, Sparkles, MessageCircle, LayoutGrid, ChevronLeft, ChevronRight, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AISearchBox from "@/components/ai-search-box";
import SiteLogo from "@/components/site-logo";
import { PART_CATEGORIES } from "@/lib/vehicle-data";
import { cn } from "@/lib/utils";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.05-.148-.471-1.138-.646-1.557-.171-.406-.347-.35-.471-.357-.121-.006-.26-.007-.408-.008-.135 0-.354.05-.539.247-.185.198-.708.691-.708 1.684 0 .993.722 1.952.821 2.085.1.133 1.422 2.172 3.444 3.046.482.208.858.332 1.151.426.484.154.925.132 1.272.067.387-.072 1.138-.465 1.298-.914.161-.448.161-.832.113-.914-.047-.082-.172-.132-.469-.281zM12.004 0C5.374 0 0 5.373 0 12c0 2.123.55 4.12 1.519 5.861L.061 24l6.294-1.651A11.947 11.947 0 0 0 12.004 24c6.628 0 12.003-5.373 12.003-12s-5.375-12-12.003-12zm0 21.928c-1.895 0-4.18-.485-5.836-1.391l-.419-.232-3.738.981 1.002-3.642-.256-.407A9.923 9.923 0 0 1 2.006 12C2.006 6.486 6.488 2.004 12.004 2.004c5.514 0 9.996 4.482 9.996 9.996 0 5.516-4.482 9.928-9.996 9.928z"/>
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    <nav className="fixed top-0 left-0 right-0 z-[60] flex flex-col pointer-events-none">
      {/* Top Bar - Interactive Wrapper */}
      <div className="bg-zinc-950 border-b border-white/5 py-1.5 overflow-hidden pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden relative h-6">
            <div className="flex items-center gap-8 whitespace-nowrap animate-ticker-ltr absolute top-0">
               <div className={cn("flex items-center gap-8 text-white/90 uppercase text-[11px] md:text-[13px]", navFont)}>
                  <span className="text-secondary tracking-widest">{lang === 'AR' ? 'للاستفسار:' : 'Inquiry:'}</span>
                  <span className="flex items-center gap-1.5"><Phone size={12} className="text-secondary" /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-1.5"><WhatsAppIcon /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-1.5 font-mono">support@bourouisse.com</span>
               </div>
            </div>
          </div>
          <div className="shrink-0 pl-3 border-l border-white/10 flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={cn("text-white/80 hover:bg-white/10 h-6 px-2 rounded-lg", navFont)}>
                  <Globe size={12} className="text-secondary" />
                  <span className="text-[10px] md:text-xs">{lang}</span>
                  <ChevronDown size={10} className="opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-28 bg-zinc-900 border-white/10 text-white p-1 z-[70]">
                <DropdownMenuItem onClick={() => toggleLang("AR")} className="justify-end font-black text-xs cursor-pointer">العربية</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLang("EN")} className="justify-end font-bold text-xs cursor-pointer">English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLang("FR")} className="justify-end font-bold text-xs cursor-pointer">Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Branding Bar - Primary Interaction Layer */}
      <div className="bg-white py-3 border-b shadow-md relative z-[65] pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4" dir={lang === 'AR' ? "rtl" : "ltr"}>
          <div className="flex items-center gap-2 md:gap-4">
            {/* Hamburger Sheet Menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl border-2 border-zinc-100 h-10 w-10 md:h-12 md:w-12 hover:bg-secondary hover:border-secondary transition-all active:scale-95"
                >
                  <Menu size={24} className="text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side={lang === 'AR' ? "right" : "left"} className="w-[320px] p-0 overflow-y-auto z-[100]" dir={lang === 'AR' ? "rtl" : "ltr"}>
                <SheetHeader className="p-6 bg-zinc-950 text-white">
                  <SheetTitle className="text-right text-secondary font-black">القائمة السريعة</SheetTitle>
                </SheetHeader>
                
                <div className="p-4 space-y-2">
                  <Link href="/catalog" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-3 p-4 rounded-xl font-black text-primary hover:bg-zinc-50 border border-zinc-100">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Sparkles size={20} /></div>
                    <span>{lang === 'AR' ? 'بحث ذكي' : 'Smart Search'}</span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={() => setIsSheetOpen(false)} className="flex flex-col items-center gap-2 p-4 rounded-xl font-black text-primary hover:bg-zinc-50 border border-zinc-100">
                      <LogIn size={24} className="text-primary" />
                      <span className="text-xs">{lang === 'AR' ? 'دخول' : 'Login'}</span>
                    </Link>
                    <Link href="/join" onClick={() => setIsSheetOpen(false)} className="flex flex-col items-center gap-2 p-4 rounded-xl font-black text-primary hover:bg-zinc-50 border border-zinc-100">
                      <UserPlus size={24} className="text-primary" />
                      <span className="text-xs">{lang === 'AR' ? 'حساب جديد' : 'Sign Up'}</span>
                    </Link>
                  </div>

                  <Link href="/seller/register" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-3 p-4 rounded-xl font-black text-white bg-primary hover:bg-zinc-800 transition-colors">
                    <Store size={20} className="text-secondary" />
                    <span>{lang === 'AR' ? 'كن بائعاً معنا' : 'Sell with Us'}</span>
                  </Link>

                  <div className="pt-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="categories" className="border-none">
                        <AccordionTrigger className="flex items-center gap-3 p-4 rounded-xl font-black text-primary hover:bg-zinc-50 border border-zinc-100 no-underline hover:no-underline">
                          <div className="flex items-center gap-3">
                            <LayoutGrid size={20} className="text-zinc-400" />
                            <span>{lang === 'AR' ? 'تصنيفات قطع الغيار' : 'Categories'}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 px-2 grid grid-cols-1 gap-1">
                          {PART_CATEGORIES.map((cat) => (
                            <Link 
                              key={cat.en} 
                              href={`/catalog?category=${cat.en}`} 
                              onClick={() => setIsSheetOpen(false)}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 font-bold text-sm text-zinc-600"
                            >
                              <span>{lang === 'AR' ? cat.ar : cat.en}</span>
                              <ChevronLeft size={14} className="opacity-30" />
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <Link href="https://wa.me/213778428977" target="_blank" className="flex items-center gap-3 p-4 rounded-xl font-black text-green-600 bg-green-50 mt-4">
                    <MessageCircle size={20} />
                    <span>{lang === 'AR' ? 'تواصل مباشر عبر واتساب' : 'WhatsApp Us'}</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="hover:opacity-90 transition-all shrink-0 relative z-[70]">
              <SiteLogo className="min-w-[160px] md:min-w-[240px]" showTagline={true} />
            </Link>
          </div>

          {/* Desktop Navigation - Higher Z-Index */}
          <div className="flex items-center gap-3 relative z-[70]">
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/seller/register">
                <Button className={cn("bg-primary text-secondary hover:bg-black rounded-xl h-10 px-6 uppercase shadow-lg active:scale-95", navFont)}>
                  <Store size={16} className="ml-2" /> {lang === 'AR' ? 'كن بائعاً معنا' : 'Become Seller'}
                </Button>
              </Link>
              <div className="flex items-center gap-2 bg-zinc-50 p-1 rounded-2xl border">
                <Link href="/join">
                  <Button variant="ghost" className={cn("text-primary hover:bg-white rounded-xl h-9 px-4 uppercase active:scale-95", navFont)}>{lang === 'AR' ? 'إنشاء حساب' : 'Join'}</Button>
                </Link>
                <Link href="/login">
                  <Button className={cn("bg-secondary text-primary hover:bg-yellow-500 rounded-xl h-9 px-5 uppercase shadow-sm active:scale-95", navFont)}>{lang === 'AR' ? 'دخول' : 'Login'}</Button>
                </Link>
              </div>
            </div>

            {isNotHome && (
              <Link href="/">
                <Button variant="ghost" size="sm" className={cn("text-primary rounded-xl h-10 px-4 gap-2 hover:bg-zinc-50 border-none active:scale-95", navFont)}>
                   <Home size={18} className="text-secondary" /> <span className="hidden sm:inline">{lang === 'AR' ? 'الرئيسية' : 'Home'}</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Search Bar Layer */}
      {showSearch && (
        <div className="bg-white/80 backdrop-blur-md py-2 border-b relative z-[60] shadow-sm pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4">
            <AISearchBox />
          </div>
        </div>
      )}
    </nav>
  );
}
