
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AISearchBox() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // مزامنة القيمة مع الرابط عند التحميل
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("query") || "";
    setValue(q);
  }, []);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(window.location.search);

    if (query.trim()) {
      params.set("query", query.trim());
    } else {
      params.delete("query");
    }

    if (pathname === '/catalog') {
      router.replace(`/catalog?${params.toString()}`);
    } else {
      router.push(`/catalog?${params.toString()}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(value);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-1 py-1">
      {/* Moroccan Zellige Ornamented Container */}
      <div className="relative p-1 rounded-[32px] overflow-hidden shadow-2xl group transition-all duration-700 hover:shadow-secondary/20">
        
        {/* Intricate Zellige Pattern Background */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundColor: "#1a2b4b", // Royal Blue Base
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23d4a017' fill-opacity='0.4'%3E%3Cpath d='M50 0L61.2 38.8H100L68.8 61.2L80 100L50 77.5L20 100L31.2 61.2L0 38.8H38.8L50 0z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Glowing Golden Border Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary animate-spin-slow opacity-50 group-hover:opacity-100 transition-opacity duration-1000" style={{ animationDuration: '10s' }} />

        {/* Search Bar Body */}
        <form 
          onSubmit={handleSubmit} 
          className="relative bg-white rounded-[28px] overflow-hidden flex items-center h-16 border-[6px] border-double border-primary/20"
        >
          {/* Moroccan Left Motif */}
          <div className="hidden md:flex items-center px-5 border-r-2 border-zinc-100 bg-zinc-50">
            <div className="relative w-8 h-8 flex items-center justify-center">
               <div className="absolute inset-0 border-2 border-secondary rotate-45" />
               <div className="absolute inset-0 border-2 border-primary rotate-0" />
               <div className="w-2 h-2 bg-secondary rounded-full" />
            </div>
          </div>

          <div className="flex-grow relative h-full">
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="ابحث بذكاء (مثلاً: محرك كليو 4، إطارات ميشلان)..."
              className="w-full h-full pr-14 pl-6 bg-transparent focus:outline-none text-right font-black text-primary placeholder:text-zinc-400 placeholder:font-bold text-lg"
              dir="rtl"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-primary w-6 h-6 transition-transform group-focus-within:scale-125" />
          </div>

          {/* Luxury Search Button */}
          <button 
            type="submit"
            className="h-full bg-primary text-secondary px-8 flex items-center gap-3 hover:bg-zinc-900 transition-all border-l-4 border-double border-secondary/50 active:scale-95"
          >
            <span className="font-black text-lg hidden sm:inline">بحث ذكي</span>
            <Sparkles size={22} className="animate-pulse text-secondary" />
          </button>

          {/* Moroccan Right Motif */}
          <div className="hidden md:flex items-center px-5 border-l-2 border-zinc-100 bg-zinc-50">
             <div className="relative w-8 h-8 flex items-center justify-center">
               <div className="absolute inset-0 border-2 border-secondary rotate-45" />
               <div className="absolute inset-0 border-2 border-primary rotate-0" />
               <div className="w-2 h-2 bg-secondary rounded-full" />
            </div>
          </div>
        </form>
      </div>

      {/* Elegant Moroccan Sub-Line Decoration */}
      <div className="flex items-center justify-center gap-6 mt-2 opacity-60">
         <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-primary to-secondary" />
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rotate-45" />
            <div className="w-4 h-4 border-2 border-primary rotate-45 flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-secondary rotate-45" />
            </div>
            <div className="w-2 h-2 bg-secondary rotate-45" />
         </div>
         <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-primary to-secondary" />
      </div>
    </div>
  );
}
