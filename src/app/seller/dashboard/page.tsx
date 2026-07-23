
"use client";

import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Package, ShoppingBag, Settings, Plus, MessageSquare, Heart, BarChart3, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SellerDashboard() {
  const menuItems = [
    {
      title: "إعلاناتي",
      description: "إدارة قطع الغيار المعروضة وتعديلها",
      icon: Package,
      href: "/seller/listings",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "طلبات الشراء",
      description: "متابعة طلبات الزبائن الواردة وتأكيدها",
      icon: ShoppingBag,
      href: "/seller/purchase-requests",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "الإعدادات",
      description: "تحديث بيانات المتجر والاشتراك السنوي",
      icon: Settings,
      href: "/seller/settings",
      color: "text-zinc-600",
      bg: "bg-zinc-100"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-right" dir="rtl">
            <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-black text-primary mb-2">لوحة تحكم البائع</h1>
                <p className="text-zinc-600 font-bold">
                  مرحباً بك. إليك نظرة سريعة على أداء متجرك وإدارة نشاطك التجاري.
                </p>
              </div>
              <div className="flex gap-3">
                 <Link href="/seller/listings/new">
                  <Button className="h-14 px-8 text-lg font-black gap-3 shadow-xl rounded-2xl bg-primary hover:bg-secondary hover:text-primary transition-all">
                     إضافة قطعة غيار جديدة <Plus size={24} />
                  </Button>
                </Link>
              </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
               <Card className="border-none shadow-sm overflow-hidden group">
                  <CardContent className="p-6 flex items-center justify-between">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">مشاهدات الإعلانات</p>
                        <h3 className="text-2xl font-black text-primary">1,284</h3>
                        <p className="text-[10px] text-green-600 font-bold mt-1">+12%</p>
                     </div>
                     <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                        <BarChart3 size={24} />
                     </div>
                  </CardContent>
               </Card>

               <Card className="border-none shadow-sm overflow-hidden group">
                  <CardContent className="p-6 flex items-center justify-between">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">الطلبات الجديدة</p>
                        <h3 className="text-2xl font-black text-secondary">5</h3>
                        <p className="text-[10px] text-orange-400 font-bold mt-1">قيد الانتظار</p>
                     </div>
                     <div className="p-3 rounded-xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={24} />
                     </div>
                  </CardContent>
               </Card>

               <Card className="border-none shadow-sm overflow-hidden group">
                  <CardContent className="p-6 flex items-center justify-between">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">الرسائل</p>
                        <h3 className="text-2xl font-black text-green-600">3</h3>
                        <p className="text-[10px] text-zinc-400 font-bold mt-1">استفسارات</p>
                     </div>
                     <div className="p-3 rounded-xl bg-green-50 text-green-600 group-hover:scale-110 transition-transform">
                        <MessageSquare size={24} />
                     </div>
                  </CardContent>
               </Card>

               <Card className="border-none shadow-sm overflow-hidden group">
                  <CardContent className="p-6 flex items-center justify-between">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">المفضلة</p>
                        <h3 className="text-2xl font-black text-red-600">42</h3>
                        <p className="text-[10px] text-zinc-400 font-bold mt-1">حفظ للقطع</p>
                     </div>
                     <div className="p-3 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                        <Heart size={24} />
                     </div>
                  </CardContent>
               </Card>
            </div>
            
            {/* Main Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {menuItems.map((item, idx) => (
                 <Link key={idx} href={item.href} className="block group h-full">
                   <div className="bg-white p-10 rounded-[40px] shadow-sm border-2 border-transparent group-hover:border-primary/10 group-hover:shadow-xl transition-all flex flex-col items-center justify-center text-center relative overflow-hidden h-full min-h-[300px]">
                      <div className={`mb-6 p-6 rounded-3xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                         <item.icon size={48} strokeWidth={2.5} />
                      </div>
                      <h3 className="font-black text-2xl text-primary mb-3 group-hover:text-secondary transition-colors">{item.title}</h3>
                      <p className="text-muted-foreground font-bold leading-relaxed">{item.description}</p>
                      
                      <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-xs font-black text-secondary uppercase tracking-widest flex items-center gap-1">دخول الآن <Plus size={12} /></span>
                      </div>
                   </div>
                 </Link>
               ))}
            </div>

            {/* Help Section */}
            <div className="mt-16 bg-primary p-10 rounded-[48px] text-white flex flex-col md:flex-row-reverse items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
               <div className="relative z-10 text-right space-y-3">
                  <h2 className="text-3xl font-black text-secondary">هل تحتاج إلى مساعدة؟</h2>
                  <p className="text-blue-100 font-bold max-w-xl text-lg leading-relaxed">
                    فريق دعم البائعين متاح دائماً للإجابة على استفساراتك وحل المشكلات التقنية أو المالية التي قد تواجه متجرك.
                  </p>
                  <Link href="/seller/complaints/new" className="inline-block mt-4">
                    <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-black px-10 h-14 rounded-2xl text-lg transition-all gap-2">
                       تقديم بلاغ للإدارة <ArrowLeft size={20} />
                    </Button>
                  </Link>
               </div>
               <div className="absolute -bottom-10 -left-10 opacity-10 rotate-12 scale-150">
                  <Package size={300} />
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

