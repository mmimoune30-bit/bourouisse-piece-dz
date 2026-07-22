"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, UserPlus, ArrowLeft, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function JoinSelectionPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-12 flex items-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
             <h1 className="text-4xl font-black text-primary mb-4">انضم إلى مجتمع بورويس</h1>
             <p className="text-muted-foreground text-lg">اختر نوع الحساب الذي يناسب احتياجاتك لبدء التجربة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all group overflow-hidden bg-white">
              <div className="h-2 bg-secondary" />
              <CardContent className="p-8 text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-secondary/10 rounded-[32px] flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Store size={48} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary mb-2">أريد البيع (متجر)</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    افتح متجرك الاحترافي، اعرض منتجاتك، وتواصل مع آلاف المشترين في كافة ولايات الجزائر.
                  </p>
                </div>
                <ul className="text-right space-y-3" dir="rtl">
                   <li className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                     <ShieldCheck size={18} className="text-green-500" /> لوحة تحكم متقدمة لإدارة المخزون
                   </li>
                   <li className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                     <Zap size={18} className="text-secondary" /> ترويج ذكي لمنتجاتك
                   </li>
                </ul>
                <Link href="/seller/register" className="block">
                  <Button className="w-full h-14 text-lg font-black gap-2 shadow-lg bg-primary hover:bg-secondary hover:text-primary transition-all">
                    سجل كبائع <ArrowLeft size={20} />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-all group overflow-hidden bg-white">
              <div className="h-2 bg-primary" />
              <CardContent className="p-8 text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <UserPlus size={48} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary mb-2">أريد الشراء (عميل)</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    ابحث عن قطع الغيار، قارن الأسعار، وتواصل مباشرة مع البائعين الموثوقين.
                  </p>
                </div>
                <ul className="text-right space-y-3" dir="rtl">
                   <li className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                     <ShieldCheck size={18} className="text-green-500" /> قائمة المفضلة لحفظ القطع
                   </li>
                   <li className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                     <Zap size={18} className="text-secondary" /> تنبيهات بجديد القطع المطلوبة
                   </li>
                </ul>
                <Link href="/buyer/register" className="block">
                  <Button variant="outline" className="w-full h-14 text-lg font-black gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
                    سجل كمشتري <ArrowLeft size={20} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link href="/login" className="text-primary font-black hover:underline flex items-center justify-center gap-2">
              لديك حساب بالفعل؟ سجل دخولك الآن <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
