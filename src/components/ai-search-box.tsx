
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, Car, Settings, Layers, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateSearchSuggestions } from "@/ai/flows/ai-powered-search-suggestions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AISearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const res = await generateSearchSuggestions({ query });
          setSuggestions(res.suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Failed to fetch AI suggestions", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 400);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      setShowSuggestions(false);
      router.push(`/catalog?query=${encodeURIComponent(query)}`);
    }
  };

  const SPECIAL_CATEGORIES = [
    { name: "مركبات خارج الخدمة", icon: <Car size={24} />, href: "/catalog?category=Véhicules hors service (مركبات خارج الخدمة)" },
    { name: "محركات كاملة", icon: <Settings size={24} />, href: "/catalog?category=Moteur (المحرك)" },
    { name: "نصف محرك", icon: <Layers size={24} />, href: "/catalog?category=Moteur (المحرك)" },
  ];

  return (
    <div className="w-full bg-white py-2 relative z-10" ref={searchRef}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row-reverse items-center justify-between gap-4">
        
        {/* Right Side: Special Categories */}
        <div className="flex flex-row-reverse items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar">
          {SPECIAL_CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="flex items-center gap-2 group shrink-0 bg-zinc-50 hover:bg-secondary px-3 py-2 rounded-xl transition-all border border-zinc-100 hover:border-secondary"
            >
              <div className="text-primary group-hover:text-black">
                {cat.icon}
              </div>
              <span className="text-[11px] font-black text-black group-hover:text-primary transition-colors whitespace-nowrap uppercase tracking-tighter">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Left Side: AI Search Box */}
        <div className="w-full max-w-lg relative">
          <div className="absolute -top-3 left-2 flex items-center gap-2 z-10">
            <span className="text-[7px] font-black text-white uppercase tracking-widest bg-primary px-2 py-0.5 rounded flex items-center gap-1.5 shadow-lg">
              {isLoading ? (
                <Loader2 size={6} className="animate-spin" />
              ) : (
                <Sparkles size={6} className="animate-pulse" />
              )}
              AI Search
            </span>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4 group-focus-within:scale-110 transition-transform z-10" />
            <Input
              placeholder="ابحث بذكاء..."
              className="pl-10 h-11 bg-zinc-50 border-2 border-zinc-100 text-black text-base font-black placeholder:text-zinc-400 focus:ring-secondary focus:border-secondary transition-all text-right rounded-xl shadow-inner"
              dir="rtl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 2 && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {showSuggestions && (suggestions.length > 0 || isLoading) && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-zinc-100 p-2 animate-in fade-in slide-in-from-top-2 z-[100] text-black text-right">
              <div className="text-[9px] uppercase font-black text-primary px-3 mb-2 flex items-center justify-end gap-2 border-b border-zinc-50 pb-1">
                اقتراحات البحث الذكي
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              </div>
              <div className="grid grid-cols-1 gap-1">
                {isLoading ? (
                  <div className="p-4 flex items-center justify-center gap-2 text-zinc-400 text-xs">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    جاري التفكير...
                  </div>
                ) : (
                  suggestions.map((s, i) => (
                    <Link
                      key={i}
                      href={`/catalog?query=${encodeURIComponent(s)}`}
                      className="w-full text-right px-4 py-3 hover:bg-zinc-50 rounded-xl text-sm font-bold transition-all flex items-center justify-end gap-2 group/item block"
                      onClick={() => setShowSuggestions(false)}
                    >
                      {s}
                      <Search size={14} className="text-primary group-hover/item:scale-110 transition-transform" />
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
