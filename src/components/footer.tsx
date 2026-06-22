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

  useEffect(() => {
    const userRole = localStorage.getItem("user_role");
    const allowedRoles = ["SuperAdmin", "Manager", "FinancialOfficer", "CustomerService"];
    setIsAdmin(allowedRoles.includes(userRole || ""));
    
    const savedLang = localStorage.getItem("app_lang") as "AR" | "EN";
    if (savedLang) setLang(savedLang);
  }, []);

  const siteName = "Bourouisse -Piece DT-dz";
  const subtext = lang === 'AR' ? "بورويس لقطع الغيار - M-M CHLEF" : "Bourouisse Parts - M-M CHLEF";

  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-secondary/30">
      <div className="container mx-auto px-4">
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12",
          lang === 'AR' ? "text-right" : "text-left"
        )} dir={lang === 'AR' ? "rtl" : "ltr"}>
          
          <div className="lg:col-span-2 space-y-8">
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
                  {subtext}
                </p>
              </div>
            </Link>
            
            <p className="text-sm text-blue-100/60 leading-relaxed max-w-sm">
               المنصة الجزائرية الأولى المتخصصة في ربط محترفي قطع الغيار بالمستهلكين، مع ضمان تجربة بحث ذكية وسريعة.
            </p>

            <div className={cn("flex gap-4", lang === 'AR' ? "justify-start" : "justify-start")}>
              <Facebook size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-black text-lg mb-6 border-r-4 border-secondary pr-4">تسوق</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/catalog" className="hover:text-secondary">تصفح الكتالوج</Link></li>
              <li><Link href="/catalog?category=Moteur" className="hover:text-secondary">المحركات</Link></li>
              <li><Link href="/catalog?category=Carrosserie" className="hover:text-secondary">الهياكل</Link></li>
              <li><Link href="/catalog?category=Suspension" className="hover:text-secondary">نظام التعليق</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-lg mb-6 border-r-4 border-secondary pr-4">روابط سريعة</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/seller/register" className="hover:text-secondary">سجل كبائع</Link></li>
              <li><Link href="/buyer/register" className="hover:text-secondary">سجل كمشتري</Link></li>
              <li><Link href="/login" className="hover:text-secondary">دخول الحساب</Link></li>
              {isAdmin && <li><Link href="/admin/dashboard" className="text-secondary font-black flex items-center gap-2"><Lock size={12} /> الإدارة</Link></li>}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-black text-lg mb-6 border-r-4 border-secondary pr-4">تواصل معنا</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li className="flex items-center gap-3">
                <span>support@bourouisse.dz</span>
                <Mail size={16} className="text-secondary" />
              </li>
              <li className="flex items-center gap-3">
                <span dir="ltr">+213 778 42 89 77</span>
                <Phone size={16} className="text-secondary" />
              </li>
              <li className="flex items-center gap-3">
                <span>الشلف، الجزائر</span>
                <MapPin size={16} className="text-secondary" />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row-reverse justify-between items-center gap-4 text-xs text-blue-100/30">
          <p className="font-bold">© 2024 Bourouisse Piece-Dz. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link href="/terms-of-service" className="hover:text-white">شروط الخدمة</Link>
            <Link href="/privacy-policy" className="hover:text-white">سياسة الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}