"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, Car, Settings, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateSearchSuggestions } from "@/ai/flows/ai-powered-search-suggestions";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AISearchBox() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  const SPECIAL_CATEGORIES = [
    { name: "مركبات خارج الخدمة", icon: <Car size={32} />, href: "/catalog?category=Véhicules hors service (مركبات خارج الخدمة)" },
    { name: "محركات كاملة", icon: <Settings size={32} />, href: "/catalog?category=Moteur (المحرك)" },
    { name: "نصف محرك", icon: <Layers size={32} />, href: "/catalog?category=Moteur (المحرك)" },
  ];

  return (
    <div className="w-full bg-zinc-950/40 border-b border-secondary/5 py-2" ref={searchRef}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row-reverse items-center justify-between gap-4">
        
        {/* Right Side: Special Categories */}
        <div className="flex flex-row-reverse items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar">
          {SPECIAL_CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="flex flex-col items-center gap-0.5 group shrink-0"
            >
              <div className="w-14 h-14 rounded-xl bg-black border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-black transition-all shadow-xl">
                {cat.icon}
              </div>
              <span className="text-[12px] font-black text-secondary group-hover:text-white transition-colors text-center whitespace-nowrap uppercase tracking-tighter">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Left Side: AI Search Box */}
        <div className="w-full max-w-sm relative">
          <div className="absolute -top-4 left-0 flex items-center gap-2">
            <span className="text-[8px] font-black text-secondary uppercase tracking-widest bg-black px-2 py-0.5 rounded border border-secondary/20 flex items-center gap-1.5">
              <Sparkles size={8} className="animate-pulse" />
              AI Search
            </span>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 group-focus-within:scale-110 transition-transform z-10" />
            <Input
              placeholder="ابحث بذكاء..."
              className="pl-12 h-10 bg-white border-2 border-secondary/30 text-primary text-xl font-black placeholder:text-zinc-400 focus:ring-secondary focus:border-secondary transition-all text-right rounded-xl shadow-lg"
              dir="rtl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 2 && setShowSuggestions(true)}
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-secondary/30 p-2 animate-in fade-in slide-in-from-top-2 z-50 text-white text-right">
              <div className="text-[9px] uppercase font-black text-secondary px-3 mb-2 flex items-center justify-end gap-2 border-b border-white/10 pb-1">
                اقتراحات البحث الذكي
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              </div>
              <div className="grid grid-cols-1 gap-1">
                {suggestions.map((s, i) => (
                  <Link
                    key={i}
                    href={`/catalog?query=${encodeURIComponent(s)}`}
                    className="w-full text-right px-3 py-2 hover:bg-secondary hover:text-black rounded-lg text-sm font-bold transition-all flex items-center justify-end gap-2 group/item block"
                    onClick={() => setShowSuggestions(false)}
                  >
                    {s}
                    <Search size={14} className="text-secondary group-hover/item:text-black" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
