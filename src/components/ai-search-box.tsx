"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, Loader2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateSearchSuggestions } from "@/ai/flows/ai-powered-search-suggestions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function AISearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync with URL query
  useEffect(() => {
    const q = searchParams.get("query");
    if (q !== null) setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const res = await generateSearchSuggestions({ query });
          setSuggestions(res.suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("AI Suggestions Error", error);
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

  // Unified Filtering: Instant navigation/update
  const handleInputChange = (val: string) => {
    setQuery(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("query", val);
    else params.delete("query");
    
    // Smoothly push to catalog if not there, or just update params
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={searchRef}>
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-2xl relative">
          
          <div className="absolute -top-3 left-4 flex items-center gap-2 z-10">
            <span className="text-[7px] font-black text-white uppercase tracking-widest bg-zinc-800 px-2 py-0.5 rounded flex items-center gap-1.5 shadow-md">
              {isLoading ? <Loader2 size={6} className="animate-spin" /> : <Sparkles size={6} className="animate-pulse" />}
              AI Smart Filter
            </span>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4 group-focus-within:scale-110 transition-transform z-10" />
            <Input
              placeholder="ابحث بذكاء (ماركة، موديل، رقم قطعة)... الفلترة فورية"
              className="pl-10 pr-12 h-12 bg-white border-2 border-zinc-200 text-black text-sm font-bold placeholder:text-zinc-400 focus:ring-secondary focus:border-secondary transition-all text-right rounded-2xl shadow-sm"
              dir="rtl"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => query.length > 2 && setShowSuggestions(true)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
               <Filter size={18} className="text-zinc-300" />
            </div>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-2 z-[100] text-right">
              <div className="text-[9px] uppercase font-black text-primary px-3 mb-2 flex items-center justify-end gap-2 border-b pb-1">
                مقترحات ذكية
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              </div>
              <div className="grid grid-cols-1 gap-1">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleInputChange(s);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-right px-4 py-3 hover:bg-zinc-50 rounded-xl text-sm font-bold transition-all flex items-center justify-end gap-2 group/item"
                  >
                    {s}
                    <Search size={14} className="text-zinc-300 group-hover/item:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}