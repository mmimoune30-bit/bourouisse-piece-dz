
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SellerRegister() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-12">
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
                  <Label htmlFor="city">الولاية</Label>
                  <Input id="city" placeholder="الجزائر" className="h-12" />
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
