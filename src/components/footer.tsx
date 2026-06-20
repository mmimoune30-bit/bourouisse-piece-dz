
"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  ShieldAlert, 
  QrCode,
  Lock
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Footer() {
  const qrCode = PlaceHolderImages.find(img => img.id === "site-qr-code")?.imageUrl;
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState<"AR" | "EN">("AR");

  const checkAdminStatus = () => {
    const userRole = localStorage.getItem("user_role");
    const allowedRoles = ["SuperAdmin", "Manager", "FinancialOfficer", "CustomerService"];
    setIsAdmin(allowedRoles.includes(userRole || ""));
  };

  useEffect(() => {
    checkAdminStatus();
    const savedLang = localStorage.getItem("app_lang") as "AR" | "EN";
    if (savedLang) setLang(savedLang);

    const handleLangChange = () => {
      const currentLang = localStorage.getItem("app_lang") as "AR" | "EN";
      if (currentLang) setLang(currentLang);
    };

    window.addEventListener("languageChange", handleLangChange);
    window.addEventListener("authChange", checkAdminStatus);
    
    return () => {
      window.removeEventListener("languageChange", handleLangChange);
      window.removeEventListener("authChange", checkAdminStatus);
    };
  }, []);

  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-secondary/30">
      <div className="container mx-auto px-4">
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12",
          lang === 'AR' ? "text-right" : "text-left"
        )} dir={lang === 'AR' ? "rtl" : "ltr"}>
          
          <div className="lg:order-last">
            {isAdmin && (
              <div className="space-y-6">
                <h4 className={cn(
                  "font-headline font-bold text-lg border-secondary pr-4",
                  lang === 'AR' ? "border-r-4" : "border-l-4 pl-4 pr-0"
                )}>
                  {lang === 'AR' ? 'الإدارة' : 'Management'}
                </h4>
                <ul className="space-y-4 text-sm text-blue-100/70">
                  <li>
                    <Link href="/admin/dashboard" className={cn(
                      "flex items-center gap-2 hover:text-secondary transition-colors group",
                      lang === 'AR' ? "justify-start" : "justify-start"
                    )}>
                      <Lock size={14} className="text-secondary" />
                      <span className="font-black underline decoration-secondary/30 decoration-2 underline-offset-4">
                        {lang === 'AR' ? 'إدارة المنصة' : 'Platform Management'}
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className={cn(
              "flex flex-col gap-1 group",
              lang === 'AR' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "flex items-center gap-3",
                lang === 'AR' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className="bg-secondary p-2 rounded-2xl text-primary shadow-lg shadow-secondary/20 group-hover:rotate-12 transition-transform">
                  <Settings size={28} className="animate-spin-slow" />
                </div>
                <span className="font-headline font-black text-2xl tracking-tighter uppercase italic whitespace-nowrap" dir="ltr">
                  {"Bourouisse ".split("").map((char, i) => (
                    <span key={i} className="animate-logo-ripple" style={{ animationDelay: `${i * 0.1}s` }}>
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                  <span className="text-secondary">
                    {"Piece-Dz".split("").map((char, i) => (
                      <span key={i} className="animate-logo-ripple" style={{ animationDelay: `${(i + 11) * 0.1}s` }}>
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
              <div className="w-full">
                <span className={cn(
                  "text-sm font-bold text-secondary/80 tracking-widest block",
                  lang === 'AR' ? "text-right" : "text-left"
                )}>
                  {lang === 'AR' ? 'لقطع الغيار والسيارات' : 'Auto Parts & Vehicles'}
                </span>
              </div>
            </Link>
            
            <div className={cn(
              "flex flex-col items-center gap-4",
              lang === 'AR' ? "md:items-start" : "md:items-start"
            )}>
              <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                <QrCode size={14} /> {lang === 'AR' ? 'امسح للزيارة' : 'Scan to visit'}
              </p>
              <div className="bg-white p-3 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-secondary/20 transform hover:scale-110 transition-all duration-500 cursor-pointer group/qr">
                {qrCode && (
                  <div className="relative">
                    <Image 
                      src={qrCode} 
                      alt="Bourouisse QR Code" 
                      width={180} 
                      height={180} 
                      className="rounded-2xl grayscale group-hover/qr:grayscale-0 transition-all"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/qr:opacity-100 transition-opacity">
                      <div className="bg-primary/90 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">B-DZ</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={cn(
              "flex gap-4 pt-2",
              lang === 'AR' ? "justify-start md:justify-end" : "justify-start"
            )}>
              <Facebook size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className={cn(
              "font-headline font-bold mb-6 text-lg border-secondary pr-4",
              lang === 'AR' ? "border-r-4" : "border-l-4 pl-4 pr-0"
            )}>
              {lang === 'AR' ? 'تسوق حسب الفئة' : 'Shop by Category'}
            </h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/catalog?category=Carrosserie" className="hover:text-secondary transition-colors">{lang === 'AR' ? 'الهيكل' : 'Body'}</Link></li>
              <li><Link href="/catalog?category=Moteur" className="hover:text-secondary transition-colors">{lang === 'AR' ? 'المحرك' : 'Engine'}</Link></li>
              <li><Link href="/catalog?category=Suspension" className="hover:text-secondary transition-colors">{lang === 'AR' ? 'التوازي و التوازن' : 'Suspension'}</Link></li>
              <li><Link href="/catalog?category=Électricité" className="hover:text-secondary transition-colors">{lang === 'AR' ? 'الكهرباء' : 'Electric'}</Link></li>
              <li><Link href="/catalog?category=Accessoires" className="hover:text-secondary transition-colors">{lang === 'AR' ? 'الأكسيسوارات' : 'Accessories'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={cn(
              "font-headline font-bold mb-6 text-lg border-secondary pr-4",
              lang === 'AR' ? "border-r-4" : "border-l-4 pl-4 pr-0"
            )}>
              {lang === 'AR' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/seller/register" className="hover:text-secondary transition-colors">{lang === 'AR' ? 'كن بائعاً معنا' : 'Become a Seller'}</Link></li>
              <li><Link href="/catalog" className="hover:text-secondary transition-colors">{lang === 'AR' ? 'تصفح الكتالوج' : 'Browse Catalog'}</Link></li>
              <li><Link href="/buyer/register" className="hover:text-secondary transition-colors">{lang === 'AR' ? 'حساب جديد' : 'New Account'}</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-secondary transition-colors">{lang === 'AR' ? 'لوحة التحكم' : 'Dashboard'}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className={cn(
              "font-headline font-bold mb-6 text-lg border-secondary pr-4",
              lang === 'AR' ? "border-r-4" : "border-l-4 pl-4 pr-0"
            )}>
              {lang === 'AR' ? 'اتصل بنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li className={cn("flex items-center gap-3", lang === 'AR' ? "justify-start" : "justify-start")}>
                <span>support@bourouisse-piecedz.com</span>
                <Mail size={16} className="text-secondary" />
              </li>
              <li className={cn("flex items-center gap-3", lang === 'AR' ? "justify-start" : "justify-start")}>
                <span dir="ltr">+213 778 42 89 77</span>
                <Phone size={16} className="text-secondary" />
              </li>
              <li className={cn("flex items-center gap-3", lang === 'AR' ? "justify-start" : "justify-start")}>
                <span>{lang === 'AR' ? 'الجزائر العاصمة، الجزائر' : 'Algiers, Algeria'}</span>
                <MapPin size={16} className="text-secondary" />
              </li>
              <li className={cn("pt-4 border-t border-white/5", lang === 'AR' ? "text-right" : "text-left")}>
                <Link href="/customer/complaints/new" className={cn(
                  "flex items-center gap-3 group/link",
                  lang === 'AR' ? "justify-start" : "justify-start"
                )}>
                  <span className="font-black text-secondary group-hover:text-white transition-colors">
                    {lang === 'AR' ? 'تقديم الشكاوى و الملاحظات' : 'Submit Complaints & Feedback'}
                  </span>
                  <div className="bg-secondary/20 p-2 rounded-lg group-hover:bg-secondary group-hover:text-primary transition-all">
                    <ShieldAlert size={18} />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row-reverse justify-between items-center gap-4 text-sm text-blue-100/40">
          <p className="font-bold">© 2024 Bourouisse Piece-Dz. {lang === 'AR' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          <div className="flex gap-6">
            <Link href="/terms-of-service" className="hover:text-white transition-colors">{lang === 'AR' ? 'شروط الخدمة' : 'Terms of Service'}</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">{lang === 'AR' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
