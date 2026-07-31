
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AISearchBox() {
  const [value, setValue] = useState("");
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

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

  const getPlaceholder = () => {
    if (lang === 'AR') return "ابحث بذكاء (مثلاً: محرك كليو 4، إطارات ميشلان)...";
    if (lang === 'EN') return "Smart Search (e.g., Clio 4 Engine, Michelin Tires)...";
    return "Recherche Intelligente (ex: Moteur Clio 4, Pneus Michelin)...";
  };

  const getBtnText = () => {
    if (lang === 'AR') return 'بحث ذكي';
    if (lang === 'EN') return 'Smart Search';
    return 'Recherche IA';
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-1 py-1.5">
      <div className="relative p-1 rounded-[32px] overflow-hidden shadow-2xl group transition-all duration-700 hover:shadow-secondary/20">
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundColor: "#1a2b4b",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23d4a017' fill-opacity='0.4'%3E%3Cpath d='M50 0L61.2 38.8H100L68.8 61.2L80 100L50 77.5L20 100L31.2 61.2L0 38.8H38.8L50 0z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary animate-spin-slow opacity-50 group-hover:opacity-100 transition-opacity duration-1000" style={{ animationDuration: '10s' }} />

        <form 
          onSubmit={handleSubmit} 
          className={cn(
            "relative bg-white rounded-[28px] overflow-hidden flex items-center h-16 border-[6px] border-double border-primary/20",
            lang !== 'AR' && "flex-row-reverse"
          )}
        >
          <div className="hidden md:flex items-center px-5 border-zinc-100 bg-zinc-50 h-full">
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
              placeholder={getPlaceholder()}
              className={cn(
                "w-full h-full bg-transparent focus:outline-none font-black text-primary placeholder:text-zinc-400 placeholder:font-bold text-lg px-6",
                lang === 'AR' ? "text-right pr-14" : "text-left pl-14"
              )}
              dir={lang === 'AR' ? "rtl" : "ltr"}
            />
            <Search className={cn("absolute top-1/2 -translate-y-1/2 text-primary w-6 h-6 transition-transform group-focus-within:scale-125", lang === 'AR' ? "right-5" : "left-5")} />
          </div>

          <button 
            type="submit"
            className={cn(
              "h-full bg-primary text-secondary px-8 flex items-center gap-3 hover:bg-zinc-900 transition-all border-double border-secondary/50 active:scale-95 uppercase",
              lang === 'AR' ? "border-l-4" : "border-r-4"
            )}
          >
            <span className="font-black text-lg hidden sm:inline">{getBtnText()}</span>
            <Sparkles size={22} className="animate-pulse text-secondary" />
          </button>
        </form>
      </div>
    </div>
  );
}
