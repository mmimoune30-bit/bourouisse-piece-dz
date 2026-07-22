"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Phone, Mail, Globe, ChevronDown, Store, UserPlus, LogIn, Search, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AISearchBox from "@/components/ai-search-box";
import { cn } from "@/lib/utils";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.05-.148-.471-1.138-.646-1.557-.171-.406-.347-.35-.471-.357-.121-.006-.26-.007-.4 architecture-008-.135 0-.354.05-.539.247-.185.198-.708.691-.708 1.684 0 .993.722 1.952.821 2.085.1.133 1.422 2.172 3.444 3.046.482.208.858.332 1.151.426.484.154.925.132 1.272.067.387-.072 1.138-.465 1.298-.914.161-.448.161-.832.113-.914-.047-.082-.172-.132-.469-.281zM12.004 0C5.374 0 0 5.373 0 12c0 2.123.55 4.12 1.519 5.861L.061 24l6.294-1.651A11.947 11.947 0 0 0 12.004 24c6.628 0 12.003-5.373 12.003-12s-5.375-12-12.003-12zm0 21.928c-1.895 0-4.18-.485-5.836-1.391l-.419-.232-3.738.981 1.002-3.642-.256-.407A9.923 9.923 0 0 1 2.006 12C2.006 6.486 6.488 2.004 12.004 2.004c5.514 0 9.996 4.482 9.996 9.996 0 5.516-4.482 9.928-9.996 9.928z"/>
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [lang, setLang] = useState<"AR" | "EN">("AR");

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
      {/* السطر الأول: التيكر ووسائل التواصل (دائم الظهور) */}
      <div className="bg-white border-b border-zinc-100 py-2 overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden relative h-6">
            <div className="flex items-center gap-12 whitespace-nowrap animate-ticker-ltr absolute top-0">
               <div className="flex items-center gap-8 text-black font-black uppercase text-[11px]">
                  <span className="text-primary tracking-widest">{lang === 'AR' ? 'للاستفسار:' : 'Inquiry:'}</span>
                  <span className="flex items-center gap-2 font-bold"><Phone size={14} className="text-primary" /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-2 font-bold"><WhatsAppIcon /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-2 font-bold"><Mail size={14} className="text-primary" /> support@bourouisse-piecedz.com</span>
               </div>
               <div className="flex items-center gap-8 text-black font-black uppercase text-[11px]">
                  <span className="text-primary tracking-widest">{lang === 'AR' ? 'للاستفسار:' : 'Inquiry:'}</span>
                  <span className="flex items-center gap-2 font-bold"><Phone size={14} className="text-primary" /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-2 font-bold"><WhatsAppIcon /> +213 778 42 89 77</span>
                  <span className="flex items-center gap-2 font-bold"><Mail size={14} className="text-primary" /> support@bourouisse-piecedz.com</span>
               </div>
            </div>
          </div>
          <div className="shrink-0 pl-4 border-l flex items-center gap-2">
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

      {/* السطور الإضافية (تظهر في الصفحة الرئيسية فقط) */}
      {isHome && (
        <>
          {/* سطر الشعار والأزرار */}
          <div className="bg-white py-4 border-b">
            <div className="container mx-auto px-4 flex flex-col md:flex-row-reverse items-center justify-between gap-6">
              {/* Logo Area */}
              <Link href="/" className="flex items-center gap-3" dir="ltr">
                <div className="bg-primary p-2 rounded-xl text-white">
                  <Settings size={28} className="animate-spin-slow" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-primary tracking-tighter">BOUROUISSE <span className="text-secondary">PIECE-DZ</span></span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest" dir="rtl">بورويس لقطع الغيار - M-M CHLEF</span>
                </div>
              </Link>

              {/* Auth & Seller Buttons */}
              <div className="flex flex-wrap items-center gap-2 justify-center" dir="rtl">
                <Link href="/seller/register">
                  <Button className="bg-secondary text-primary font-black hover:bg-zinc-900 hover:text-white rounded-xl gap-2 shadow-lg shadow-secondary/20 h-12 transition-all">
                    <Store size={18} /> كن بائعاً معنا
                  </Button>
                </Link>
                <Link href="/join">
                  <Button variant="outline" className="border-2 border-primary text-primary font-black hover:bg-primary hover:text-white rounded-xl gap-2 h-12 transition-all">
                    <UserPlus size={18} /> إضافة حساب
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" className="text-zinc-600 font-black hover:bg-zinc-100 rounded-xl gap-2 h-12">
                    <LogIn size={18} /> الدخول إلى الحساب
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* الشريط الأزرق مع خانة البحث */}
          <div className="bg-primary py-4 shadow-inner relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <div className="grid grid-cols-8 gap-4 rotate-12 scale-150">
                  {[...Array(24)].map((_, i) => <Settings key={i} size={48} className="text-white" />)}
               </div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <AISearchBox />
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
