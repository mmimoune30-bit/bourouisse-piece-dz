"use client";

import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  QrCode,
  Lock
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const WheelIcon = () => (
  <div className="relative w-10 h-10 animate-spin-slow text-secondary">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
    </svg>
  </div>
);

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

  const siteName = "Bourouisse -Piece DT-dz";
  const tagline = "بورويس لقطع الغيار   -   M-M CHLEF";

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
                    <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-secondary transition-colors group">
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
            <Link href="/" className="flex items-center gap-3 mb-6" dir="ltr">
              <WheelIcon />
              <div className="flex flex-col items-center">
                <div className="flex gap-[1px]">
                  {siteName.split("").map((letter, i) => (
                    <span 
                      key={i} 
                      className={cn(
                        "text-xl font-black inline-block animate-logo-ripple",
                        letter === "-" || i > 12 ? "text-secondary" : "text-white"
                      )}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </span>
                  ))}
                </div>
                <p className="text-[9px] font-bold text-secondary tracking-tighter" dir="rtl">
                  {tagline}
                </p>
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
              <li className="flex items-center gap-3">
                <span>support@bourouisse-piecedz.com</span>
                <Mail size={16} className="text-secondary" />
              </li>
              <li className="flex items-center gap-3">
                <span dir="ltr">+213 778 42 89 77</span>
                <Phone size={16} className="text-secondary" />
              </li>
              <li className="flex items-center gap-3">
                <span>{lang === 'AR' ? 'الجزائر العاصمة، الجزائر' : 'Algiers, Algeria'}</span>
                <MapPin size={16} className="text-secondary" />
              </li>
              <li className={cn("pt-4 border-t border-white/5", lang === 'AR' ? "text-right" : "text-left")}>
                <Link href="/customer/complaints/new" className="flex items-center gap-3 group/link">
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
