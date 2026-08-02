
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Phone, Mail, Globe, ChevronDown, Store, UserPlus, LogIn, Menu, X, Tags, Home, User
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
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.05-.148-.471-1.138-.646-1.557-.171-.406-.347-.35-.471-.357-.121-.006-.26-.007-.408-.008-.135 0-.354.05-.539.247-.185.198-.708.691-.708 1.684 0 .993.722 1.952.821 2.085.1.133 1.422 2.172 3.444 3.046.482.208.858.332 1.151.426.484.154.925.132 1.272.067.387-.072 1.138-.465 1.298-.914.161-.448.161-.832.113-.914-.047-.082-.172-.132-.469-.281zM12.004 0C5.374 0 0 5.373 0 12c0 2.123.55 4.12 1.519 5.861L.061 24l6.294-1.651A11.947 11.947 0 0 0 12.004 24c6.628 0 12.003-5.373 12.003-12s-5.375-12-12.003-12zm0 21.928c-1.895 0-4.18-.485-5.836-1.391l-.419-.232-3.738.981 1.002-3.642-.256-.407A9.923 9.923 0 0 1 2.006 12C2.006 6.486 6.488 2.004 12.004 2.004c5.514 0 9.996 4.482 9.996 9.996 0 5.516-4.482 9.928-9.996 9.928z"/>
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
  const getBackHomeText = () => lang === 'AR' ? 'الرجوع الى الرئيسية' : lang === 'EN' ? 'Back Home' : 'Retour';
  const getCategoriesText = () => lang === 'AR' ? 'قطع الغيار' : lang === 'EN' ? 'Parts' : 'Pièces';
  const getBecomeSellerText = () => lang === 'AR' ? 'كن بائعاً معنا' : lang === 'EN' ? 'Become Seller' : 'Devenir Vendeur';
  const getJoinNowText = () => lang === 'AR' ? 'إنشاء حساب' : lang === 'EN' ? 'Join Now' : 'Inscription';
  const getLoginText = () => lang === 'AR' ? 'دخول' : lang === 'EN' ? 'Login' : 'Connexion';

  const navFont = lang === 'AR' ? 'font-black' : 'font-bold';
  const boldNavFont = lang === 'AR' ? 'font-black' : 'font-black';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col shadow-2xl">
      {/* Layer 1: Compact Top Info Bar */}
      <div className="bg-zinc-950 border-b border-white/5 py-1 overflow-hidden">
        <div className="w-full px-4 flex items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden relative h-5">
            <div className="flex items-center gap-8 whitespace-nowrap animate-ticker-ltr absolute top-0">
               <div className={cn("flex items-center gap-8 text-white/70 uppercase text-[9px] md:text-[10px]", navFont)}>
                  <span className="text-secondary tracking-widest">{getInquiryText()}</span>
                  <span className="flex items-center gap-1.5"><Phone size={11} className="text-secondary" /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-1.5"><WhatsAppIcon /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-1.5 font-mono">support@bourouisse-piecedz.com</span>
               </div>
            </div>
          </div>
          <div className="shrink-0 pl-3 border-l border-white/10 flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={cn("text-white/80 hover:bg-white/10 hover:text-white gap-1.5 h-6 px-2 rounded-lg", navFont)}>
                  <Globe size={12} className="text-secondary" />
                  <span className="text-[10px] md:text-xs">{lang === 'AR' ? 'AR' : lang === 'EN' ? 'EN' : 'FR'}</span>
                  <ChevronDown size={10} className="opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-28 p-1 rounded-xl shadow-2xl bg-zinc-900 border-white/10 text-white">
                <DropdownMenuItem onClick={() => toggleLang("AR")} className="justify-end font-black text-xs cursor-pointer hover:bg-white/10">العربية</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLang("EN")} className="justify-end font-bold text-xs cursor-pointer hover:bg-white/10">English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLang("FR")} className="justify-end font-bold text-xs cursor-pointer hover:bg-white/10">Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Layer 2: Main Branding & Global Actions */}
      <div className="bg-white py-3 border-b shadow-sm">
        <div className="w-full px-4 flex items-center justify-between gap-4" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-90 transition-all shrink-0">
              <SiteLogo className="min-w-[180px] md:min-w-[240px]" showTagline={true} />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-2 pr-4 border-l border-zinc-100 ml-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("text-primary hover:bg-zinc-50 rounded-xl gap-2 h-10 px-4 text-sm uppercase transition-all", boldNavFont)}>
                    <Tags size={18} className="text-secondary" /> {getCategoriesText()} <ChevronDown size={14} className="opacity-40" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-zinc-100 overflow-y-auto max-h-[60vh]">
                  {PART_CATEGORIES.map((cat) => (
                    <DropdownMenuItem key={cat.en} asChild>
                      <Link href={`/catalog?category=${cat.en}`} className={cn("justify-end py-2.5 px-4 text-xs text-primary uppercase rounded-xl hover:bg-zinc-50 cursor-pointer", lang === 'AR' ? 'font-black' : 'font-bold')}>
                        {lang === 'AR' ? cat.ar : lang === 'EN' ? cat.en : cat.fr}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link href="/seller/register">
                <Button className={cn("bg-primary text-secondary hover:bg-black rounded-xl h-10 px-5 text-xs md:text-sm uppercase shadow-lg shadow-black/5", boldNavFont)}>
                  <Store size={16} className="ml-2" /> {getBecomeSellerText()}
                </Button>
              </Link>

              <div className="flex items-center gap-2 bg-zinc-50 p-1 rounded-2xl border border-zinc-100">
                <Link href="/join">
                  <Button variant="ghost" className={cn("text-primary hover:bg-white hover:shadow-sm rounded-xl h-9 px-4 text-xs md:text-sm uppercase transition-all", boldNavFont)}>
                    {getJoinNowText()}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className={cn("bg-secondary text-primary hover:bg-yellow-500 rounded-xl h-9 px-5 text-xs md:text-sm uppercase shadow-sm", boldNavFont)}>
                    <LogIn size={16} className="ml-2" /> {getLoginText()}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Back Home Button (Mobile/Subpages) */}
            {isNotHome && (
              <Link href="/">
                <Button variant="ghost" size="sm" className={cn("text-primary rounded-xl h-10 px-4 gap-2 hover:bg-zinc-50 text-xs md:text-sm uppercase border-none shadow-none", boldNavFont)}>
                   <Home size={18} className="text-secondary" /> {getBackHomeText()}
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <Button variant="outline" size="icon" className="rounded-xl w-10 h-10 border-2 border-zinc-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3: Dynamic Search Bar (Compact) */}
      {showSearch && (
        <div className="bg-white/80 backdrop-blur-md py-2 border-b relative">
          <div className="w-full px-4 max-w-5xl mx-auto">
            <AISearchBox />
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-[0_30px_60px_rgba(0,0,0,0.15)] py-6 px-6 space-y-3 flex flex-col z-[100]" dir={lang === 'AR' ? "rtl" : "ltr"}>
           <div className="p-2 bg-zinc-50 rounded-2xl mb-4 border border-zinc-100">
             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 px-2">التصنيفات</p>
             <div className="grid grid-cols-2 gap-2">
                {PART_CATEGORIES.slice(0, 4).map(cat => (
                  <Link key={cat.en} href={`/catalog?category=${cat.en}`} onClick={() => setIsMobileMenuOpen(false)} className="bg-white p-3 rounded-xl border border-zinc-100 text-[11px] font-black text-primary text-center">
                    {lang === 'AR' ? cat.ar : cat.en}
                  </Link>
                ))}
             </div>
           </div>
           
           <Link href="/seller/register" onClick={() => setIsMobileMenuOpen(false)}><Button className={cn("w-full bg-primary text-secondary h-14 rounded-2xl text-sm uppercase shadow-xl", boldNavFont)}><Store size={18} className="ml-2" /> {getBecomeSellerText()}</Button></Link>
           <div className="grid grid-cols-2 gap-3">
             <Link href="/join" onClick={() => setIsMobileMenuOpen(false)}><Button variant="outline" className={cn("w-full border-2 border-zinc-200 text-primary h-14 rounded-2xl text-sm uppercase", boldNavFont)}>{getJoinNowText()}</Button></Link>
             <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}><Button className={cn("w-full bg-secondary text-primary h-14 rounded-2xl text-sm uppercase shadow-lg", boldNavFont)}>{getLoginText()}</Button></Link>
           </div>
           
           {isNotHome && <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="w-full"><Button variant="ghost" className={cn("w-full h-14 rounded-2xl text-sm uppercase border-none text-zinc-400", boldNavFont)}><Home size={18} className="ml-2" /> {getBackHomeText()}</Button></Link>}
        </div>
      )}
    </nav>
  );
}
