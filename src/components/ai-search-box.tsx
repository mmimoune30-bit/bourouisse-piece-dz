"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Sparkles, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateSearchSuggestions } from "@/ai/flows/ai-powered-search-suggestions";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";

export default function AISearchBox() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await generateSearchSuggestions({ query });
      setSuggestions(res.suggestions || []);
      setOpen(res.suggestions?.length > 0);
    } catch (e) {
      console.error(e);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);

    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (val.length >= 2) {
      timerRef.current = setTimeout(() => {
        fetchSuggestions(val);
      }, 500);
    } else {
      setOpen(false);
    }
  };

  const handleSearch = (query: string) => {
    setOpen(false);
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) {
      params.set("query", query.trim());
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
    if (lang === 'AR') return "ابحث بذكاء (مثلاً: محرك كليو 4)...";
    if (lang === 'EN') return "Smart Search (e.g., Clio 4 Engine)...";
    return "Recherche (ex: Moteur Clio 4)...";
  };

  const getBtnText = () => lang === 'AR' ? 'بحث' : lang === 'EN' ? 'Search' : 'Rechercher';
  const textFont = lang === 'AR' ? 'font-bold' : 'font-medium';

  return (
    <div className="w-full max-w-4xl mx-auto px-0.5">
      <Popover open={open && suggestions.length > 0} onOpenChange={setOpen} modal={false}>
        {/* تم تغيير PopoverTrigger إلى PopoverAnchor لمنع اعتراض أحداث النقر */}
        <PopoverAnchor asChild>
          <div className="relative p-0.5 rounded-2xl overflow-hidden shadow-lg group transition-all">
            {/* إضافة pointer-events-none لمنع الخلفية المتحركة من حجب النقرات */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary animate-spin-slow opacity-30 group-hover:opacity-70 pointer-events-none" style={{ animationDuration: '8s' }} />
            <form onSubmit={handleSubmit} className={cn("relative bg-white rounded-xl overflow-hidden flex items-center h-12 border-2 border-primary/10 z-10", lang !== 'AR' && "flex-row-reverse")}>
              <div className="flex-grow relative h-full">
                <input
                  value={value}
                  onChange={handleInputChange}
                  placeholder={getPlaceholder()}
                  className={cn("w-full h-full bg-transparent focus:outline-none text-primary placeholder:text-zinc-400 text-base px-4 cursor-text", lang === 'AR' ? "text-right pr-10" : "text-left pl-10", textFont)}
                  dir={lang === 'AR' ? "rtl" : "ltr"}
                />
                <Search className={cn("absolute top-1/2 -translate-y-1/2 text-primary w-5 h-5 pointer-events-none", lang === 'AR' ? "right-4" : "left-4")} />
              </div>
              <button type="submit" className={cn("h-full bg-primary text-secondary px-6 flex items-center gap-2 hover:bg-black transition-all active:scale-95 cursor-pointer shrink-0", lang === 'AR' ? "border-l" : "border-r")}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-secondary" />}
                <span className={cn("text-sm md:text-base hidden sm:inline uppercase font-black")}>{getBtnText()}</span>
              </button>
            </form>
          </div>
        </PopoverAnchor>
        
        <PopoverContent 
          className="p-2 w-[var(--radix-popover-trigger-width)] bg-white/95 backdrop-blur-xl border-2 border-primary/10 shadow-2xl rounded-2xl z-[60]" 
          align={lang === 'AR' ? 'end' : 'start'}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="space-y-1" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
             <div className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Zap size={10} className="text-secondary" /> {lang === 'AR' ? 'مقترحات ذكية' : 'AI Suggestions'}
             </div>
             {suggestions.map((s, i) => (
               <button
                 key={i}
                 onClick={() => handleSearch(s)}
                 className="w-full text-right px-4 py-3 hover:bg-primary hover:text-white transition-all rounded-xl text-sm font-bold flex items-center justify-between group cursor-pointer"
               >
                 <span className={lang !== 'AR' ? 'order-1' : ''}>{s}</span>
                 <Search size={14} className="opacity-20 group-hover:opacity-100" />
               </button>
             ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
