
"use client";

import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Lock,
  ArrowRight
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
    const userRole = typeof window !== 'undefined' ? localStorage.getItem("user_role") : null;
    setIsAdmin(["Super Admin", "Manager", "Financial Officer"].includes(userRole || ""));
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const t = {
    shop: { AR: "تسوق", EN: "Shop", FR: "Boutique" },
    catalog: { AR: "الكتالوج الشامل", EN: "Full Catalog", FR: "Catalogue" },
    categories: { AR: "تصنيفات القطع", EN: "Categories", FR: "Catégories" },
    links: { AR: "روابط سريعة", EN: "Quick Links", FR: "Liens Rapides" },
    regSeller: { AR: "سجل كبائع معنا", EN: "Join as Seller", FR: "Vendre" },
    regBuyer: { AR: "سجل كمشتري جديد", EN: "Join as Buyer", FR: "S'inscrire" },
    home: { AR: "الرئيسية", EN: "Home", FR: "Accueil" },
    contact: { AR: "تواصل معنا", EN: "Contact Us", FR: "Contact" },
    rights: { AR: "BOUROUISSE PIECE DT-DZ. © 2024 جميع الحقوق محفوظة", EN: "BOUROUISSE PIECE DT-DZ. © 2024 ALL RIGHTS RESERVED", FR: "BOUROUISSE PIECE DT-DZ. © 2024 TOUS DROITS RÉSERVÉS" }
  };

  const textFont = lang === 'AR' ? 'font-bold' : 'font-medium';
  const headFont = lang === 'AR' ? 'font-black' : 'font-semibold';

  return (
    <footer className="bg-primary text-white pt-10 pb-6 border-t-4 border-secondary">
      <div className="container mx-auto px-4">
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
          <div className="col-span-1 md:col-span-1 space-y-6">
            <SiteLogo brandClassName="text-white text-xl" subtextClassName="text-blue-100 text-[9px]" />
            <div className="flex gap-5 justify-center md:justify-start">
              <Facebook size={22} className="hover:text-secondary cursor-pointer transition-colors" />
              <Instagram size={22} className="hover:text-secondary cursor-pointer transition-colors" />
              <Twitter size={22} className="hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className={cn("text-sm md:text-base uppercase border-secondary border-r-4 pr-3 text-secondary", headFont)}>{t.shop[lang]}</h4>
            <ul className={cn("space-y-2 text-xs md:text-sm text-blue-100/70", textFont)}>
              <li><Link href="/catalog" className="hover:text-white flex items-center gap-2 group"><ArrowRight size={12} className={cn("opacity-0 group-hover:opacity-100 transition-all", lang === 'AR' ? "rotate-180" : "")} /> {t.catalog[lang]}</Link></li>
              <li><Link href="/catalog" className="hover:text-white flex items-center gap-2 group"><ArrowRight size={12} className={cn("opacity-0 group-hover:opacity-100 transition-all", lang === 'AR' ? "rotate-180" : "")} /> {t.categories[lang]}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className={cn("text-sm md:text-base uppercase border-secondary border-r-4 pr-3 text-secondary", headFont)}>{t.links[lang]}</h4>
            <ul className={cn("space-y-2 text-xs md:text-sm text-blue-100/70", textFont)}>
              <li><Link href="/" className="hover:text-white flex items-center gap-2 group"><ArrowRight size={12} className={cn("opacity-0 group-hover:opacity-100 transition-all", lang === 'AR' ? "rotate-180" : "")} /> {t.home[lang]}</Link></li>
              <li><Link href="/seller/register" className="hover:text-white flex items-center gap-2 group"><ArrowRight size={12} className={cn("opacity-0 group-hover:opacity-100 transition-all", lang === 'AR' ? "rotate-180" : "")} /> {t.regSeller[lang]}</Link></li>
              <li><Link href="/buyer/register" className="hover:text-white flex items-center gap-2 group"><ArrowRight size={12} className={cn("opacity-0 group-hover:opacity-100 transition-all", lang === 'AR' ? "rotate-180" : "")} /> {t.regBuyer[lang]}</Link></li>
              {isAdmin && <li><Link href="/admin/dashboard" className="text-secondary flex items-center gap-2 font-black border-2 border-secondary/20 p-1.5 rounded-lg mt-2"><Lock size={14} /> ADMINISTRATION</Link></li>}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className={cn("text-sm md:text-base uppercase border-secondary border-r-4 pr-3 text-secondary", headFont)}>{t.contact[lang]}</h4>
            <ul className={cn("space-y-3 text-xs md:text-sm text-blue-100/70", textFont)}>
              <li className="flex items-center gap-3"><Phone size={16} className="text-secondary shrink-0" /> +213 778 42 89 77</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-secondary shrink-0" /> support@bourouisse.com</li>
              <li className="flex items-center gap-3"><MapPin size={16} className="text-secondary shrink-0" /> Chlef, Algeria</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-blue-100/40 font-bold uppercase tracking-wider">
          <p className="text-center md:text-right">{t.rights[lang]}</p>
          <div className="flex gap-6">
            <Link href="/terms-of-service" className="hover:text-white transition-colors border-b border-transparent hover:border-white">TOS - الشروط</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors border-b border-transparent hover:border-white">PRIVACY - الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
