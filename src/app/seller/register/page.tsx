
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, ShieldCheck, Zap, ArrowRight, Facebook } from "lucide-react";
import Link from "next/link";

const WhatsappIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna",
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira",
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou",
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine",
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès",
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma",
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - Timimoun", "50 - Bordj Badji Mokhtar",
  "51 - Ouled Djellal", "52 - Béni Abbès", "53 - In Salah", "54 - In Guezzam", "55 - Touggourt",
  "56 - Djanet", "57 - El M'Ghair", "58 - El Meniaa"
];

export default function SellerRegister() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4 max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-right order-2 lg:order-1">
            <h1 className="text-4xl font-black text-primary leading-tight">
              انضم إلى أكبر منصة لقطع الغيار <span className="text-secondary italic">في الجزائر</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              افتح متجرك الإلكتروني الآن وابدأ بالوصول إلى آلاف المشترين يومياً. نوفر لك الأدوات اللازمة لإدارة مبيعاتك بكل سهولة.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "وصول وطني", desc: "بيع منتجاتك في كافة ولايات الجزائر.", icon: <Zap className="text-secondary" /> },
                { title: "عمولة منخفضة", desc: "أفضل الأسعار لنمو تجارتك بشكل أسرع.", icon: <Store className="text-secondary" /> },
                { title: "بائع معتمد", desc: "احصل على شارة التوثيق لزيادة ثقة المشترين.", icon: <ShieldCheck className="text-secondary" /> },
              ].map((feature, i) => (
                <div key={i} className="flex flex-row-reverse items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-border">
                  <div className="p-2 bg-secondary/10 rounded-lg">{feature.icon}</div>
                  <div>
                    <h3 className="font-bold text-primary">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-none shadow-2xl order-1 lg:order-2">
            <CardHeader className="bg-destructive text-white text-right rounded-t-lg">
              <CardTitle className="text-2xl font-black">تسجيل بائع جديد</CardTitle>
              <CardDescription className="text-white/80">املأ البيانات لإنشاء حسابك الاحترافي</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-right" dir="rtl">
              <div className="space-y-2">
                <Label htmlFor="shop-name">اسم المتجر أو البائع</Label>
                <Input id="shop-name" placeholder="مثال: قطع غيار النخبة" className="h-12 border-border focus:ring-secondary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" placeholder="05/06/07..." className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wilaya">الولاية <span className="text-destructive">*</span></Label>
                  <Select required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="اختر الولاية" />
                    </SelectTrigger>
                    <SelectContent>
                      {WILAYAS.map(w => (
                        <SelectItem key={w} value={w}>{w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-seller">رقم الواتساب التجاري</Label>
                  <div className="relative">
                    <Input id="whatsapp-seller" placeholder="WhatsApp" className="h-12 pr-10 border-green-200" />
                    <WhatsappIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook-seller">صفحة الفيسبوك</Label>
                  <div className="relative">
                    <Input id="facebook-seller" placeholder="Facebook Page" className="h-12 pr-10 border-blue-200" />
                    <Facebook className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" placeholder="email@example.com" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" className="h-12" />
              </div>
              <Button className="w-full h-14 text-lg font-black gap-2 shadow-lg">
                إنشاء حساب بائع <ArrowRight className="rotate-180" size={20} />
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                لديك حساب بالفعل؟ <Link href="/login" className="text-secondary font-bold underline">تسجيل الدخول</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
