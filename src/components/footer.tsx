
"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Settings, ShieldAlert } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Footer() {
  const qrCode = PlaceHolderImages.find(img => img.id === "site-qr-code")?.imageUrl;

  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Info & QR Code */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="flex flex-col items-start gap-1 group">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-xl text-primary shadow-lg shadow-secondary/20 group-hover:rotate-12 transition-transform">
                  <Settings size={28} className="animate-spin-slow" />
                </div>
                <span className="font-headline font-black text-2xl tracking-tighter uppercase italic">
                  Bourouisse <span className="text-secondary">Piece-Dz</span>
                </span>
              </div>
              <div className="pr-1">
                <span className="text-sm font-bold text-secondary/80 tracking-widest block text-right w-full">
                  لقطع الغيار والسيارات
                </span>
              </div>
            </Link>
            
            <div className="flex flex-col items-center md:items-start gap-4">
              <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Scan to visit / امسح للزيارة</p>
              <div className="bg-white p-2 rounded-2xl shadow-2xl border-2 border-secondary/20 transform hover:scale-105 transition-transform cursor-pointer">
                {qrCode && (
                  <Image 
                    src={qrCode} 
                    alt="Bourouisse QR Code" 
                    width={120} 
                    height={120} 
                    className="rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-2 justify-start md:justify-end">
              <Facebook size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="text-right">
            <h4 className="font-headline font-bold mb-6 text-lg border-r-4 border-secondary pr-4">تسوق حسب الفئة</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/catalog?category=Carrosserie" className="hover:text-secondary transition-colors">الهيكل</Link></li>
              <li><Link href="/catalog?category=Moteur" className="hover:text-secondary transition-colors">المحرك</Link></li>
              <li><Link href="/catalog?category=Suspension" className="hover:text-secondary transition-colors">التوازي و التوازن</Link></li>
              <li><Link href="/catalog?category=Électricité" className="hover:text-secondary transition-colors">الكهرباء</Link></li>
              <li><Link href="/catalog?category=Accessoires" className="hover:text-secondary transition-colors">الأكسيسوارات</Link></li>
            </ul>
          </div>

          <div className="text-right">
            <h4 className="font-headline font-bold mb-6 text-lg border-r-4 border-secondary pr-4">روابط سريعة</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/seller/register" className="hover:text-secondary transition-colors">كن بائعاً معنا</Link></li>
              <li><Link href="/catalog" className="hover:text-secondary transition-colors">تصفح الكتالوج</Link></li>
              <li><Link href="/buyer/register" className="hover:text-secondary transition-colors">حساب جديد</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-secondary transition-colors">لوحة التحكم</Link></li>
            </ul>
          </div>

          <div className="text-right lg:col-span-2">
            <h4 className="font-headline font-bold mb-6 text-lg border-r-4 border-secondary pr-4">اتصل بنا</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li className="flex items-center justify-end gap-3">
                <span>support@bourouisse-piecedz.com</span>
                <Mail size={16} className="text-secondary" />
              </li>
              <li className="flex items-center justify-end gap-3">
                <span dir="ltr">+213 778 42 89 77</span>
                <Phone size={16} className="text-secondary" />
              </li>
              <li className="flex items-center justify-end gap-3">
                <span>الجزائر العاصمة، الجزائر</span>
                <MapPin size={16} className="text-secondary" />
              </li>
              <li className="pt-4 border-t border-white/5">
                <Link href="/customer/complaints/new" className="flex items-center justify-end gap-3 group/link">
                  <span className="font-black text-secondary group-hover:text-white transition-colors">تقديم الشكاوى و الملاحظات</span>
                  <div className="bg-secondary/20 p-2 rounded-lg group-hover:bg-secondary group-hover:text-primary transition-all">
                    <ShieldAlert size={18} />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row-reverse justify-between items-center gap-4 text-sm text-blue-100/40">
          <p className="font-bold">© 2024 Bourouisse Piece-Dz. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link href="/terms-of-service" className="hover:text-white transition-colors">شروط الخدمة</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
