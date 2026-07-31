"use client";

import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SiteLogo from "@/components/site-logo";

export default function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    const userRole = localStorage.getItem("user_role");
    setIsAdmin(["Super Admin", "Manager", "Financial Officer"].includes(userRole || ""));
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const t = {
    shop: { AR: "تسوق", EN: "Shop", FR: "Boutique" },
    catalog: { AR: "الكتالوج", EN: "Catalog", FR: "Catalogue" },
    links: { AR: "روابط", EN: "Links", FR: "Liens" },
    regSeller: { AR: "سجل كبائع", EN: "Register", FR: "Vendre" },
    contact: { AR: "تواصل", EN: "Contact", FR: "Contact" },
    rights: { AR: "BOUROUISSE PIECE DT-DZ. © 2024", EN: "BOUROUISSE PIECE DT-DZ. © 2024", FR: "BOUROUISSE PIECE DT-DZ. © 2024" }
  };

  return (
    <footer className="bg-primary text-white pt-8 pb-4 border-t-4 border-secondary">
      <div className="container mx-auto px-4">
        <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-6 mb-8", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
          <div className="col-span-2 md:col-span-1 space-y-4">
            <SiteLogo brandClassName="text-white text-lg" subtextClassName="text-blue-100 text-[8px]" />
            <div className="flex gap-4 justify-center md:justify-start">
              <Facebook size={18} className="hover:text-secondary cursor-pointer" />
              <Instagram size={18} className="hover:text-secondary cursor-pointer" />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-xs uppercase border-secondary border-r-2 pr-2">{t.shop[lang]}</h4>
            <ul className="space-y-1 text-[10px] text-blue-100/60 font-bold">
              <li><Link href="/catalog" className="hover:text-white">{t.catalog[lang]}</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-xs uppercase border-secondary border-r-2 pr-2">{t.links[lang]}</h4>
            <ul className="space-y-1 text-[10px] text-blue-100/60 font-bold">
              <li><Link href="/seller/register" className="hover:text-white">{t.regSeller[lang]}</Link></li>
              {isAdmin && <li><Link href="/admin/dashboard" className="text-secondary flex items-center gap-1"><Lock size={10} /> Admin</Link></li>}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-xs uppercase border-secondary border-r-2 pr-2">{t.contact[lang]}</h4>
            <ul className="space-y-1 text-[10px] text-blue-100/60 font-bold">
              <li className="flex items-center gap-2"><Phone size={12} className="text-secondary" /> +213 778 42 89 77</li>
              <li className="flex items-center gap-2"><MapPin size={12} className="text-secondary" /> Chlef, DZ</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[8px] text-blue-100/30 font-bold uppercase tracking-widest">
          <p>{t.rights[lang]}</p>
          <div className="flex gap-4">
            <Link href="/terms-of-service" className="hover:text-white">TOS</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}