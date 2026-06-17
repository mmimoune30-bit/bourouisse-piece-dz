
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Mail, Phone, Lock, ArrowLeft, Facebook } from "lucide-react";
import Link from "next/link";

const WhatsappIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function BuyerRegister() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="border-none shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary mb-2">
                <UserPlus size={24} />
              </div>
              <CardTitle className="text-2xl font-black text-primary">سجل معنا كمشتري</CardTitle>
              <CardDescription>انضم إلينا لتتمكن من الشراء وحفظ الإعلانات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-right" dir="rtl">
              <div className="space-y-2">
                <Label htmlFor="fullname">الاسم الكامل</Label>
                <div className="relative">
                  <Input id="fullname" placeholder="أدخل اسمك الكامل" className="h-12 pr-10" />
                  <UserPlus className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Input id="email" type="email" placeholder="email@example.com" className="h-12 pr-10" />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">رقم الواتساب</Label>
                  <div className="relative">
                    <Input id="whatsapp" placeholder="رقم الواتساب" className="h-12 pr-10 border-green-200 focus:border-green-500" />
                    <WhatsappIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">رابط الفيسبوك (اختياري)</Label>
                  <div className="relative">
                    <Input id="facebook" placeholder="facebook.com/yourprofile" className="h-12 pr-10 border-blue-200 focus:border-blue-500" />
                    <Facebook className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف الأساسي</Label>
                <div className="relative">
                  <Input id="phone" placeholder="05/06/07..." className="h-12 pr-10" />
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input id="password" type="password" placeholder="••••••••" className="h-12 pr-10" />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
              <Button className="w-full h-12 text-base font-bold gap-2">
                تسجيل الحساب <ArrowLeft size={18} />
              </Button>
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-border flex-grow"></div>
                <span className="text-xs text-muted-foreground">أو عبر</span>
                <div className="h-px bg-border flex-grow"></div>
              </div>
              <Button variant="outline" className="w-full h-12 gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                سجل باستخدام Google
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                لديك حساب؟ <Link href="/login" className="text-secondary font-bold underline">دخول</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
