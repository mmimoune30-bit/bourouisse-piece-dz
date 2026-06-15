"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, User, Settings, LayoutDashboard, ChevronDown, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateSearchSuggestions } from "@/ai/flows/ai-powered-search-suggestions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentLang, setCurrentLang] = useState("AR");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const res = await generateSearchSuggestions({ query });
          setSuggestions(res.suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Failed to fetch AI suggestions", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "AR", name: "العربية", flag: "🇩🇿" },
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "EN", name: "English", flag: "🇺🇸" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-black shadow-xl py-2 border-b border-secondary/20"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-secondary p-2 rounded-xl text-black shadow-lg shadow-secondary/20 group-hover:rotate-12 transition-transform">
            <Settings size={24} className="animate-spin-slow" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-black text-xl md:text-2xl tracking-tighter text-secondary uppercase italic leading-none">
              Bourouisse <span className="text-white">PieceDz</span>
            </span>
            <span className="text-[9px] font-bold text-white/50 tracking-[0.2em] uppercase mt-1">
              Pièces & Automobiles
            </span>
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl relative mx-8" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="ابحث عن قطع الغيار (مثل: فلاتر زيت، فرامل...)"
              className="pl-10 h-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:ring-secondary focus:border-secondary transition-all text-right text-xs"
              dir="rtl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 2 && setShowSuggestions(true)}
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-2 animate-in fade-in slide-in-from-top-2 text-white text-right z-50">
              <div className="text-[10px] uppercase font-bold text-secondary px-3 mb-2 flex items-center justify-end gap-2">
                اقتراحات الذكاء الاصطناعي
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              </div>
              {suggestions.map((s, i) => (
                <Link
                  key={i}
                  href={`/catalog?query=${encodeURIComponent(s)}`}
                  className="w-full text-right px-3 py-2 hover:bg-zinc-800 rounded-lg text-sm transition-colors flex items-center justify-end gap-2 block"
                  onClick={() => setShowSuggestions(false)}
                >
                  {s}
                  <Search size={14} className="text-secondary" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto py-1 px-2 flex flex-col items-center gap-0.5 text-white hover:bg-zinc-800 transition-colors">
                <Languages size={20} className="text-secondary" />
                <span className="text-[10px] font-bold leading-none">langue</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
              <DropdownMenuLabel>اختر اللغة</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code} 
                  onClick={() => setCurrentLang(lang.code)}
                  className={cn("hover:bg-zinc-800", currentLang === lang.code && "bg-zinc-800 font-bold text-secondary")}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/catalog" className="hidden lg:block">
            <Button variant="ghost" className="text-white hover:text-secondary hover:bg-zinc-800 font-bold text-xs h-auto py-2">تصفح الكل</Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center bg-transparent border-secondary text-secondary hover:bg-secondary hover:text-black font-black text-xs h-9">
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">بوابة البائع</span>
                <ChevronDown size={12} className="opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-white">
              <DropdownMenuLabel>أعمالي</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem asChild className="hover:bg-zinc-800">
                <Link href="/seller/dashboard">لوحة التحكم</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-zinc-800">
                <Link href="/seller/listings/new">إضافة إعلان جديد</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="h-auto py-1.5 px-3 flex flex-col items-center gap-0.5 text-white border-white/20 hover:bg-zinc-800 transition-colors group/user" asChild>
            <Link href="/buyer/register">
              <User size={24} className="text-secondary group-hover/user:scale-110 transition-transform" />
              <span className="text-[10px] font-black leading-none uppercase tracking-tighter">بوابة المشتري</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
