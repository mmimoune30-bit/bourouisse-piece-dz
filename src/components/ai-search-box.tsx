"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
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
    const normalizedQuery = typeof query === "string" ? query.trim() : "";
    if (normalizedQuery) {
      params.set("query", normalizedQuery);
    } else {
      params.delete("query");
    }

    const targetUrl = `/catalog?${params.toString()}`;
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
    if (lang === 'AR') return "ابحث عن قطعة غيار...";
    if (lang === 'EN') return "Search for parts...";
    return "Rechercher des pièces...";
  };

  const getBtnText = () => lang === 'AR' ? 'بحث' : lang === 'EN' ? 'Search' : 'Rechercher';
  const textFont = lang === 'AR' ? 'font-bold' : 'font-medium';

  return (
    <div className="w-full max-w-4xl mx-auto px-0.5 relative z-[100]">
      <form onSubmit={handleSubmit} className={cn("relative bg-white rounded-xl overflow-hidden flex items-center h-12 border-2 border-primary/10 shadow-lg group", lang !== 'AR' && "flex-row-reverse")}>
        <div className="flex-grow relative h-full">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={getPlaceholder()}
            className={cn("w-full h-full bg-transparent focus:outline-none text-primary placeholder:text-zinc-400 text-base px-4 cursor-text", lang === 'AR' ? "text-right pr-10" : "text-left pl-10", textFont)}
            dir={lang === 'AR' ? "rtl" : "ltr"}
          />
          <Search className={cn("absolute top-1/2 -translate-y-1/2 text-primary w-5 h-5 pointer-events-none", lang === 'AR' ? "right-4" : "left-4")} />
        </div>
        <button 
          type="submit" 
          className={cn(
            "h-full bg-primary text-secondary px-6 flex items-center gap-2 hover:bg-black transition-all active:scale-95 cursor-pointer shrink-0 border-none", 
            lang === 'AR' ? "ml-[-1px]" : "mr-[-1px]"
          )}
        >
          <Search size={18} />
          <span className={cn("text-sm md:text-base hidden sm:inline uppercase font-black")}>{getBtnText()}</span>
        </button>
      </form>
    </div>
  );
}