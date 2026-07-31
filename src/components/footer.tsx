
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
    const allowedRoles = ["Super Admin", "Manager", "Financial Officer", "Customer Service"];
    setIsAdmin(allowedRoles.includes(userRole || ""));

    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const t = {
    desc: {
      AR: "المنصة الجزائرية الأولى المتخصصة في ربط محترفي قطع الغيار بالمستهلكين، مع ضمان تجربة بحث ذكية وسريعة.",
      EN: "The first Algerian platform specialized in connecting auto parts professionals with consumers, ensuring a smart and fast search experience.",
      FR: "La première plateforme algérienne spécialisée dans la mise en relation des professionnels des pièces auto avec les consommateurs."
    },
    shop: { AR: "تسوق", EN: "Shop", FR: "Boutique" },
    catalog: { AR: "تصفح الكتالوج", EN: "Browse Catalog", FR: "Parcourir le Catalogue" },
    engines: { AR: "المحركات", EN: "Engines", FR: "Moteurs" },
    body: { AR: "الهياكل", EN: "Body Parts", FR: "Carrosserie" },
    suspension: { AR: "نظام التعليق", EN: "Suspension", FR: "Suspension" },
    links: { AR: "روابط سريعة", EN: "Quick Links", FR: "Liens Rapides" },
    regSeller: { AR: "سجل كبائع", EN: "Register as Seller", FR: "S'inscrire comme Vendeur" },
    regBuyer: { AR: "سجل كمشتري", EN: "Register as Buyer", FR: "S'inscrire comme Acheteur" },
    login: { AR: "دخول الحساب", EN: "Login", FR: "Connexion" },
    admin: { AR: "لوحة الإدارة", EN: "Admin Panel", FR: "Panneau Admin" },
    contact: { AR: "تواصل معنا", EN: "Contact Us", FR: "Contactez-nous" },
    rights: { AR: "جميع الحقوق محفوظة.", EN: "All rights reserved.", FR: "Tous droits réservés." },
    tos: { AR: "شروط الخدمة", EN: "Terms of Service", FR: "Conditions d'utilisation" },
    privacy: { AR: "سياسة الخصوصية", EN: "Privacy Policy", FR: "Politique de confidentialité" },
    location: { AR: "الشلف، الجزائر - M-M CHLEF", EN: "Chlef, Algeria - M-M CHLEF", FR: "Chlef, Algérie - M-M CHLEF" }
  };

  return (
    <footer className="bg-primary text-white pt-20 pb-10 border-t-8 border-secondary">
      <div className="container mx-auto px-4">
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16",
          lang === 'AR' ? "text-right" : "text-left"
        )} dir={lang === 'AR' ? "rtl" : "ltr"}>
          
          <div className="lg:col-span-2 space-y-8 flex flex-col items-center md:items-start">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <SiteLogo brandClassName="text-white" subtextClassName="text-blue-100" />
            </Link>
            
            <p className="text-sm text-blue-100/60 leading-relaxed max-w-sm">{t.desc[lang]}</p>

            <div className="flex gap-4">
              <Facebook size={24} className="hover:text-secondary cursor-pointer transition-colors" />
              <Twitter size={24} className="hover:text-secondary cursor-pointer transition-colors" />
              <Instagram size={24} className="hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className={cn("font-black text-lg mb-8 border-secondary uppercase", lang === 'AR' ? "border-r-4 pr-4" : "border-l-4 pl-4")}>
               {t.shop[lang]}
            </h4>
            <ul className="space-y-4 text-sm text-blue-100/70 font-bold">
              <li><Link href="/catalog" className="hover:text-secondary">{t.catalog[lang]}</Link></li>
              <li><Link href="/catalog?category=Engine" className="hover:text-secondary">{t.engines[lang]}</Link></li>
              <li><Link href="/catalog?category=Body" className="hover:text-secondary">{t.body[lang]}</Link></li>
              <li><Link href="/catalog?category=Suspension" className="hover:text-secondary">{t.suspension[lang]}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={cn("font-black text-lg mb-8 border-secondary uppercase", lang === 'AR' ? "border-r-4 pr-4" : "border-l-4 pl-4")}>
               {t.links[lang]}
            </h4>
            <ul className="space-y-4 text-sm text-blue-100/70 font-bold">
              <li><Link href="/seller/register" className="hover:text-secondary">{t.regSeller[lang]}</Link></li>
              <li><Link href="/buyer/register" className="hover:text-secondary">{t.regBuyer[lang]}</Link></li>
              <li><Link href="/login" className="hover:text-secondary">{t.login[lang]}</Link></li>
              {isAdmin && <li><Link href="/admin/dashboard" className="text-secondary font-black flex items-center gap-2"><Lock size={12} /> {t.admin[lang]}</Link></li>}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className={cn("font-black text-lg mb-8 border-secondary uppercase", lang === 'AR' ? "border-r-4 pr-4" : "border-l-4 pl-4")}>
               {t.contact[lang]}
            </h4>
            <ul className="space-y-6 text-sm text-blue-100/70 font-bold">
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-secondary shrink-0" />
                <span>support@bourouisse-piecedz.com</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-secondary shrink-0" />
                <span dir="ltr">+213 778 42 89 77</span>
              </li>
              <li className="flex items-center gap-4">
                <MapPin size={20} className="text-secondary shrink-0" />
                <span>{t.location[lang]}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row-reverse justify-between items-center gap-6 text-xs text-blue-100/30">
          <p className="font-bold uppercase tracking-widest">© 2024 BOUROUISSE PIECE DT-DZ. {t.rights[lang]}</p>
          <div className="flex gap-8">
            <Link href="/terms-of-service" className="hover:text-white font-bold transition-colors">{t.tos[lang]}</Link>
            <Link href="/privacy-policy" className="hover:text-white font-bold transition-colors">{t.privacy[lang]}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
