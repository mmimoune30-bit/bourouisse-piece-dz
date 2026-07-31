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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setValue(params.get("query") || "");
  }, []);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) {
      params.set("query", query.trim());
    } else {
      params.delete("query");
    }

    const targetUrl = `/catalog?${params.toString()}`;
    
    // الانتقال للنتائج فقط عند الطلب الصريح (Submit)
    if (pathname === '/catalog') {
      router.replace(targetUrl, { scroll: false });
    } else {
      router.push(targetUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(value);
  };

  const getPlaceholder = () => {
    if (lang === 'AR') return "ابحث بذكاء (مثلاً: محرك كليو 4)...";
    if (lang === 'EN') return "Smart Search (e.g., Clio 4 Engine)...";
    return "Recherche (ex: Moteur Clio 4)...";
  };

  const getBtnText = () => lang === 'AR' ? 'بحث' : lang === 'EN' ? 'Search' : 'Rechercher';

  const textFont = lang === 'AR' ? 'font-bold' : 'font-medium';
  const buttonFont = lang === 'AR' ? 'font-black' : 'font-medium';

  return (
    <div className="w-full max-w-4xl mx-auto px-0.5">
      <div className="relative p-0.5 rounded-2xl overflow-hidden shadow-lg group transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary animate-spin-slow opacity-30 group-hover:opacity-70" style={{ animationDuration: '8s' }} />
        <form onSubmit={handleSubmit} className={cn("relative bg-white rounded-xl overflow-hidden flex items-center h-12 border-2 border-primary/10", lang !== 'AR' && "flex-row-reverse")}>
          <div className="flex-grow relative h-full">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={getPlaceholder()}
              className={cn("w-full h-full bg-transparent focus:outline-none text-primary placeholder:text-zinc-400 text-base px-4", lang === 'AR' ? "text-right pr-10" : "text-left pl-10", textFont)}
              dir={lang === 'AR' ? "rtl" : "ltr"}
            />
            <Search className={cn("absolute top-1/2 -translate-y-1/2 text-primary w-5 h-5", lang === 'AR' ? "right-4" : "left-4")} />
          </div>
          <button type="submit" className={cn("h-full bg-primary text-secondary px-6 flex items-center gap-2 hover:bg-black transition-all active:scale-95", lang === 'AR' ? "border-l" : "border-r")}>
            <span className={cn("text-sm md:text-base hidden sm:inline uppercase", buttonFont)}>{getBtnText()}</span>
            <Sparkles size={16} className="text-secondary" />
          </button>
        </form>
      </div>
    </div>
  );
}
