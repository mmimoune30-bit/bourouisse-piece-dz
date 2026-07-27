
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
    <div className="w-full max-w-4xl mx-auto px-2 py-2">
      {/* Container with Moroccan Geometric Pattern */}
      <div className="relative p-1 rounded-[28px] overflow-hidden shadow-xl group transition-all duration-500 hover:shadow-2xl">
        
        {/* Moroccan Pattern Background (Zellige Inspired) */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%231a2b4b' fill-opacity='1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20h40v40H20V20zm20 0L20 40l20 20 20-20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Animated Gradient Border (Blue & Gold) */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary animate-spin-slow opacity-30 group-hover:opacity-100 transition-opacity duration-1000" style={{ animationDuration: '8s' }} />

        {/* Form Body */}
        <form 
          onSubmit={handleSubmit} 
          className="relative bg-white rounded-[24px] overflow-hidden flex items-center h-14 border-4 border-double border-primary/10"
        >
          {/* Moroccan Left Accent */}
          <div className="hidden md:flex items-center px-4 border-r border-zinc-100 bg-zinc-50/50">
            <div className="w-6 h-6 text-secondary rotate-45 border-2 border-primary flex items-center justify-center">
               <div className="w-2 h-2 bg-primary rotate-45" />
            </div>
          </div>

          <div className="flex-grow relative h-full">
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="ابحث بذكاء عن قطعة غيار (مثلاً: محرك كليو 4)..."
              className="w-full h-full pr-12 pl-4 bg-transparent focus:outline-none text-right font-black text-primary placeholder:text-zinc-400 placeholder:font-bold"
              dir="rtl"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 transition-transform group-focus-within:scale-110" />
          </div>

          {/* Search Button with Sparkle */}
          <button 
            type="submit"
            className="h-full bg-primary text-secondary px-6 flex items-center gap-2 hover:bg-zinc-900 transition-colors border-l-4 border-double border-secondary/50"
          >
            <span className="font-black hidden sm:inline">بحث ذكي</span>
            <Sparkles size={18} className="animate-pulse" />
          </button>

          {/* Moroccan Right Accent */}
          <div className="hidden md:flex items-center px-4 border-l border-zinc-100 bg-zinc-50/50">
             <div className="w-6 h-6 text-secondary rotate-45 border-2 border-primary flex items-center justify-center">
               <div className="w-2 h-2 bg-primary rotate-45" />
            </div>
          </div>
        </form>
      </div>

      {/* Moroccan Sub-Decoration (Optional visual line) */}
      <div className="flex items-center justify-center gap-4 mt-1 opacity-40">
         <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-primary" />
         <div className="w-2 h-2 bg-secondary rotate-45" />
         <div className="w-3 h-3 border border-primary rotate-45 flex items-center justify-center">
            <div className="w-1 h-1 bg-secondary rotate-45" />
         </div>
         <div className="w-2 h-2 bg-secondary rotate-45" />
         <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-primary" />
      </div>
    </div>
  );
}
