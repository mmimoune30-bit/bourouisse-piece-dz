
import Link from "next/link";
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Settings } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <Link href="/" className="flex flex-col items-start gap-1 group">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-xl text-primary shadow-lg shadow-secondary/20 group-hover:rotate-12 transition-transform">
                  <Settings size={28} className="animate-spin-slow" />
                </div>
                <span className="font-headline font-black text-2xl tracking-tighter uppercase italic">
                  Bourouisse <span className="text-secondary">PieceDz</span>
                </span>
              </div>
              <div className="pr-1">
                <span className="text-sm font-bold text-secondary/80 tracking-widest block text-right w-full">
                  لقطع الغيار والسيارات
                </span>
              </div>
            </Link>
            <p className="text-blue-100/70 text-sm leading-relaxed text-right">
              المنصة الرائدة في الجزائر لبيع وشراء قطع غيار السيارات المميزة. نربط بين البائعين الموثوقين وعشاق السيارات والمحترفين في جميع أنحاء الوطن.
            </p>
            <div className="flex gap-4 pt-2 justify-end">
              <Facebook size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="text-right">
            <h4 className="font-headline font-bold mb-6 text-lg border-r-4 border-secondary pr-4">تسوق حسب الفئة</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/catalog?cat=engine" className="hover:text-secondary transition-colors">المحرك ونظام الحركة</Link></li>
              <li><Link href="/catalog?cat=brakes" className="hover:text-secondary transition-colors">الفرامل ونظام التعليق</Link></li>
              <li><Link href="/catalog?cat=electrical" className="hover:text-secondary transition-colors">الكهرباء والإضاءة</Link></li>
              <li><Link href="/catalog?cat=body" className="hover:text-secondary transition-colors">قطع الهيكل والمرايا</Link></li>
              <li><Link href="/catalog?cat=interior" className="hover:text-secondary transition-colors">الإكسسوارات الداخلية</Link></li>
            </ul>
          </div>

          <div className="text-right">
            <h4 className="font-headline font-bold mb-6 text-lg border-r-4 border-secondary pr-4">روابط سريعة</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/seller/register" className="hover:text-secondary transition-colors">كن بائعاً معنا</Link></li>
              <li><Link href="/how-it-works" className="hover:text-secondary transition-colors">كيف يعمل الموقع</Link></li>
              <li><Link href="/shipping" className="hover:text-secondary transition-colors">معلومات الشحن</Link></li>
              <li><Link href="/faq" className="hover:text-secondary transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/support" className="hover:text-secondary transition-colors">الدعم الفني</Link></li>
            </ul>
          </div>

          <div className="text-right">
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
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row-reverse justify-between items-center gap-4 text-sm text-blue-100/40">
          <p className="font-bold">© 2024 Bourouisse PieceDz. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white">شروط الخدمة</Link>
            <Link href="/privacy" className="hover:text-white">سياسة الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
