
"use client";

import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-right" dir="rtl">
            <h1 className="text-3xl font-black text-primary mb-4">لوحة تحكم البائع</h1>
            <p className="text-zinc-600 font-bold">
              مرحباً بك في لوحة التحكم الخاصة بك. يمكنك من هنا إدارة إعلاناتك، متابعة طلبات الشراء، وتحديث بيانات متجرك.
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                  <h3 className="font-black text-xl text-primary mb-2">إعلاناتي</h3>
                  <p className="text-sm text-muted-foreground">إدارة قطع الغيار المعروضة</p>
               </div>
               <div className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                  <h3 className="font-black text-xl text-primary mb-2">طلبات الشراء</h3>
                  <p className="text-sm text-muted-foreground">متابعة طلبات الزبائن الواردة</p>
               </div>
               <div className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                  <h3 className="font-black text-xl text-primary mb-2">الإعدادات</h3>
                  <p className="text-sm text-muted-foreground">تحديث بيانات المتجر والاشتراك</p>
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
