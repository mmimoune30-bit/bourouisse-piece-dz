
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Phone, Mail, Globe, ChevronDown, Store, UserPlus, LogIn, Menu, X, Tags, Home
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
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.05-.148-.471-1.138-.646-1.557-.171-.406-.347-.35-.471-.357-.121-.006-.26-.007-.4 architecture-008-.135 0-.354.05-.539.247-.185.198-.708.691-.708 1.684 0 .993.722 1.952.821 2.085.1.133 1.422 2.172 3.444 3.046.482.208.858.332 1.151.426.484.154.925.132 1.272.067.387-.072 1.138-.465 1.298-.914.161-.448.161-.832.113-.914-.047-.082-.172-.132-.469-.281zM12.004 0C5.374 0 0 5.373 0 12c0 2.123.55 4.12 1.519 5.861L.061 24l6.294-1.651A11.947 11.947 0 0 0 12.004 24c6.628 0 12.003-5.373 12.003-12s-5.375-12-12.003-12zm0 21.928c-1.895 0-4.18-.485-5.836-1.391l-.419-.232-3.738.981 1.002-3.642-.256-.407A9.923 9.923 0 0 1 2.006 12C2.006 6.486 6.488 2.004 12.004 2.004c5.514 0 9.996 4.482 9.996 9.996 0 5.516-4.482 9.928-9.996 9.928z"/>
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const HIDDEN_SEARCH_ROUTES = ["/login", "/join", "/buyer/register", "/seller/register", "/setup-admin"];
  const showSearch = !HIDDEN_SEARCH_ROUTES.includes(pathname);
  const isNotHome = pathname !== "/";

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const toggleLang = (newLang: "AR" | "EN" | "FR") => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  const getInquiryText = () => lang === 'AR' ? 'للاستفسار:' : lang === 'EN' ? 'Inquiry:' : 'Demande:';
  const getBackHomeText = () => lang === 'AR' ? 'الرئيسية' : lang === 'EN' ? 'Home' : 'Accueil';
  const getCategoriesText = () => lang === 'AR' ? 'تصنيفات قطع الغيار' : lang === 'EN' ? 'Categories' : 'Catégories';
  const getBecomeSellerText = () => lang === 'AR' ? 'كن بائعاً معنا' : lang === 'EN' ? 'Sell with us' : 'Vendre';
  const getJoinNowText = () => lang === 'AR' ? 'إضافة حساب' : lang === 'EN' ? 'Join' : 'S\'inscrire';
  const getLoginText = () => lang === 'AR' ? 'دخول' : lang === 'EN' ? 'Login' : 'Connexion';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col shadow-sm">
      {/* Layer 1: Compact Top Info Bar */}
      <div className="bg-white border-b border-zinc-50 py-0.5 overflow-hidden">
        <div className="w-full px-2 flex items-center justify-between gap-2">
          <div className="flex-1 overflow-hidden relative h-5">
            <div className="flex items-center gap-6 whitespace-nowrap animate-ticker-ltr absolute top-0">
               <div className="flex items-center gap-6 text-black font-black uppercase text-[9px] md:text-[10px]">
                  <span className="text-black tracking-tight">{getInquiryText()}</span>
                  <span className="flex items-center gap-1.5 font-bold"><Phone size={12} /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-1.5 font-bold"><WhatsAppIcon /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-1.5 font-bold"><Mail size={12} /> support@bourouisse-piecedz.com</span>
               </div>
            </div>
          </div>
          <div className="shrink-0 pl-1 border-l flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-black hover:bg-zinc-100 gap-1 font-black h-6 px-1">
                  <Globe size={12} />
                  <span className="text-[9px] md:text-xs">{lang === 'AR' ? 'AR' : lang === 'EN' ? 'EN' : 'FR'}</span>
                  <ChevronDown size={10} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-24">
                <DropdownMenuItem onClick={() => toggleLang("AR")} className="justify-end font-black text-xs">العربية</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLang("EN")} className="justify-end font-black text-xs">English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLang("FR")} className="justify-end font-black text-xs">Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Layer 2: Main Branding */}
      <div className="bg-white py-1.5 border-b">
        <div className="w-full px-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-90 transition-opacity shrink-0">
              <SiteLogo className="min-w-[160px] md:min-w-[200px]" showTagline={true} />
            </Link>
            {isNotHome && (
              <Link href="/">
                <Button variant="outline" size="sm" className="border-2 border-black text-black font-black rounded-lg h-8 px-2 gap-1.5 hover:bg-black hover:text-white text-[10px] uppercase">
                   <Home size={14} /> {getBackHomeText()}
                </Button>
              </Link>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2" dir={lang === 'AR' ? "rtl" : "ltr"}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-black font-black hover:bg-zinc-50 rounded-lg gap-1.5 h-9 px-3 text-sm md:text-base uppercase">
                  <Tags size={18} /> {getCategoriesText()} <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-xl overflow-y-auto max-h-[60vh]">
                {PART_CATEGORIES.map((cat) => (
                  <DropdownMenuItem key={cat.en} asChild>
                    <Link href={`/catalog?category=${cat.en}`} className="justify-end font-black py-1.5 text-xs text-black uppercase">
                      {lang === 'AR' ? cat.ar : lang === 'EN' ? cat.en : cat.fr}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/seller/register"><Button className="bg-secondary text-black font-black rounded-lg h-9 px-4 text-sm md:text-base uppercase">{getBecomeSellerText()}</Button></Link>
            <Link href="/join"><Button variant="outline" className="border-2 border-black text-black font-black rounded-lg h-9 px-4 text-sm md:text-base uppercase">{getJoinNowText()}</Button></Link>
            <Link href="/login"><Button variant="ghost" className="text-black font-black h-9 px-4 text-sm md:text-base uppercase">{getLoginText()}</Button></Link>
          </div>

          <div className="lg:hidden">
            <Button variant="ghost" size="icon" className="rounded-lg w-8 h-8" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Layer 3: Search Bar */}
      {showSearch && (
        <div className="bg-white py-2 border-b relative">
          <div className="w-full px-4">
            <AISearchBox />
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-xl py-4 px-4 space-y-2 flex flex-col" dir={lang === 'AR' ? "rtl" : "ltr"}>
           {isNotHome && <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="w-full"><Button variant="outline" className="w-full border-2 border-black font-black h-12 rounded-lg text-sm uppercase"><Home size={18} className="ml-2" /> {getBackHomeText()}</Button></Link>}
           <Link href="/seller/register" onClick={() => setIsMobileMenuOpen(false)}><Button className="w-full bg-secondary text-black font-black h-12 rounded-lg text-sm uppercase">{getBecomeSellerText()}</Button></Link>
           <Link href="/join" onClick={() => setIsMobileMenuOpen(false)}><Button variant="outline" className="w-full border-2 border-black font-black h-12 rounded-lg text-sm uppercase">{getJoinNowText()}</Button></Link>
           <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}><Button variant="ghost" className="w-full font-black h-12 rounded-lg text-sm uppercase">{getLoginText()}</Button></Link>
        </div>
      )}
    </nav>
  );
}
