
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
  const [lang, setLang] = useState<"AR" | "EN">("AR");

  useEffect(() => {
    const userRole = typeof window !== 'undefined' ? localStorage.getItem("user_role") : null;
    const allowedRoles = ["Super Admin", "Manager", "Financial Officer", "Customer Service"];
    setIsAdmin(allowedRoles.includes(userRole || ""));
    
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem("app_lang") as "AR" | "EN" : "AR";
    if (savedLang) setLang(savedLang);
  }, []);

  return (
    <footer className="bg-primary text-white pt-20 pb-10 border-t-8 border-secondary">
      <div className="container mx-auto px-4">
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16",
          lang === 'AR' ? "text-right" : "text-left"
        )} dir={lang === 'AR' ? "rtl" : "ltr"}>
          
          <div className="lg:col-span-2 space-y-8 flex flex-col items-center md:items-start">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <SiteLogo 
                brandClassName="text-white" 
                subtextClassName="text-blue-100" 
              />
            </Link>
            
            <p className="text-sm text-blue-100/60 leading-relaxed max-w-sm text-center md:text-right">
               المنصة الجزائرية الأولى المتخصصة في ربط محترفي قطع الغيار بالمستهلكين، مع ضمان تجربة بحث ذكية وسريعة.
            </p>

            <div className="flex gap-4">
              <Facebook size={24} className="hover:text-secondary cursor-pointer transition-colors" />
              <Twitter size={24} className="hover:text-secondary cursor-pointer transition-colors" />
              <Instagram size={24} className="hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-black text-lg mb-8 border-r-4 border-secondary pr-4 uppercase">تسوق</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/catalog" className="hover:text-secondary font-bold">تصفح الكتالوج</Link></li>
              <li><Link href="/catalog?category=Engine" className="hover:text-secondary font-bold">المحركات</Link></li>
              <li><Link href="/catalog?category=Body" className="hover:text-secondary font-bold">الهياكل</Link></li>
              <li><Link href="/catalog?category=Suspension" className="hover:text-secondary font-bold">نظام التعليق</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-lg mb-8 border-r-4 border-secondary pr-4 uppercase">روابط سريعة</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/seller/register" className="hover:text-secondary font-bold">سجل كبائع</Link></li>
              <li><Link href="/buyer/register" className="hover:text-secondary font-bold">سجل كمشتري</Link></li>
              <li><Link href="/login" className="hover:text-secondary font-bold">دخول الحساب</Link></li>
              {isAdmin && <li><Link href="/admin/dashboard" className="text-secondary font-black flex items-center gap-2"><Lock size={12} /> لوحة الإدارة</Link></li>}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-black text-lg mb-8 border-r-4 border-secondary pr-4 uppercase">تواصل معنا</h4>
            <ul className="space-y-6 text-sm text-blue-100/70">
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-secondary shrink-0" />
                <span className="font-bold">support@bourouisse-piecedz.com</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-secondary shrink-0" />
                <span dir="ltr" className="font-bold">+213 778 42 89 77</span>
              </li>
              <li className="flex items-center gap-4">
                <MapPin size={20} className="text-secondary shrink-0" />
                <span className="font-bold">الشلف، الجزائر - M-M CHLEF</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row-reverse justify-between items-center gap-6 text-xs text-blue-100/30">
          <p className="font-bold uppercase tracking-widest">© 2024 BOUROUISSE PIECE DT-DZ. جميع الحقوق محفوظة.</p>
          <div className="flex gap-8">
            <Link href="/terms-of-service" className="hover:text-white font-bold transition-colors">شروط الخدمة</Link>
            <Link href="/privacy-policy" className="hover:text-white font-bold transition-colors">سياسة الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
