
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

  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
          <div className="space-y-6">
            <SiteLogo brandClassName="text-white text-xl" subtextClassName="text-blue-100 text-[9px]" />
            <div className="flex gap-4">
              <Facebook size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase text-secondary tracking-widest">{t.shop[lang]}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/catalog" className="hover:text-white transition-colors">{t.catalog[lang]}</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">{t.categories[lang]}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase text-secondary tracking-widest">{t.links[lang]}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">{t.home[lang]}</Link></li>
              <li><Link href="/seller/register" className="hover:text-white transition-colors">{t.regSeller[lang]}</Link></li>
              <li><Link href="/buyer/register" className="hover:text-white transition-colors">{t.regBuyer[lang]}</Link></li>
              {isAdmin && <li><Link href="/admin/dashboard" className="text-secondary font-black">ADMINISTRATION</Link></li>}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase text-secondary tracking-widest">{t.contact[lang]}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3"><Phone size={16} className="text-secondary" /> +213 778 42 89 77</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-secondary" /> support@bourouisse.com</li>
              <li className="flex items-center gap-3"><MapPin size={16} className="text-secondary" /> Chlef, Algeria</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          <p>{t.rights[lang]}</p>
          <div className="flex gap-6">
            <Link href="/terms-of-service" className="hover:text-white">TOS</Link>
            <Link href="/privacy-policy" className="hover:text-white">PRIVACY</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
