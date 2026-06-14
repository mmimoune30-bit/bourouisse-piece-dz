
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateSearchSuggestions } from "@/ai/flows/ai-powered-search-suggestions";
import { cn } from "@/lib/utils";

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

  return (
    <div className="w-full bg-zinc-950/50 border-b border-secondary/10 py-6" ref={searchRef}>
      <div className="container mx-auto px-4 flex justify-start">
        <div className="w-full max-w-2xl relative">
          <div className="absolute -top-6 left-0 flex items-center gap-2">
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] bg-black px-2 py-0.5 rounded border border-secondary/20 flex items-center gap-1">
              <Sparkles size={10} className="animate-pulse" />
              AI Powered Search
            </span>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-6 h-6 group-focus-within:scale-110 transition-transform" />
            <Input
              placeholder="ابحث بذكاء عن أي قطعة غيار أو مركبة..."
              className="pl-14 h-16 bg-black border-2 border-secondary/30 text-white text-xl placeholder:text-zinc-600 focus:ring-secondary focus:border-secondary transition-all text-right rounded-2xl shadow-2xl"
              dir="rtl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 2 && setShowSuggestions(true)}
            />
            <div className="absolute inset-0 bg-secondary/5 blur-xl rounded-2xl -z-10 group-focus-within:opacity-100 opacity-0 transition-opacity" />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-zinc-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-secondary/20 p-3 animate-in fade-in slide-in-from-top-4 z-50 text-white text-right">
              <div className="text-[10px] uppercase font-black text-secondary px-4 mb-3 flex items-center justify-end gap-2 border-b border-white/5 pb-2">
                اقتراحات البحث الذكي
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              </div>
              <div className="grid grid-cols-1 gap-1">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="w-full text-right px-4 py-3 hover:bg-secondary hover:text-black rounded-xl text-base font-bold transition-all flex items-center justify-end gap-3 group/item"
                    onClick={() => {
                      setQuery(s);
                      setShowSuggestions(false);
                    }}
                  >
                    {s}
                    <Search size={16} className="text-secondary group-hover/item:text-black" />
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
