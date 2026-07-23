
"use client";

import React, { useMemo } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  MessageSquare, 
  Heart, 
  BarChart3, 
  Bell, 
  ShieldCheck, 
  HelpCircle,
  AlertTriangle 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";

export default function SellerDashboard() {
  const { user, profile } = useUser();
  const { firestore } = useFirestore();
  
  // جلب الإشعارات غير المقروءة
  const notificationsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "notifications"), 
      where("userId", "==", user.uid), 
      where("read", "==", false)
    );
  }, [firestore, user]);

  const { data: notifications } = useCollection(notificationsQuery);

  // حساب الأيام المتبقية للاشتراك
  const daysLeft = useMemo(() => {
    if (!profile?.subscription?.endDate) return 0;
    try {
      const end = new Date(profile.subscription.endDate);
      const diff = differenceInDays(end, new Date());
      return diff > 0 ? diff : 0;
    } catch (e) {
      return 0;
    }
  }, [profile]);

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
      title: "مركز الدعم",
      description: "تواصل مع الإدارة وحل المشكلات",
      icon: HelpCircle,
      href: "/seller/support",
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl text-right" dir="rtl">
          
          {/* Header with Notification Badge */}
          <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-black text-primary flex items-center gap-3">
                مرحباً {profile?.name || "بائعنا المميز"} <ShieldCheck className="text-secondary" />
              </h1>
              <p className="text-zinc-600 font-bold">باقة الحساب: <span className="text-secondary">{profile?.subscription?.plan || "Free"}</span></p>
            </div>
            
            <div className="flex items-center gap-3">
               <Link href="/seller/notifications" className="relative group">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border group-hover:bg-primary group-hover:text-white transition-all">
                     <Bell size={24} />
                  </div>
                  {notifications && notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {notifications.length}
                    </span>
                  )}
               </Link>
               <Link href="/seller/listings/new">
                <Button className="h-14 px-8 text-lg font-black gap-3 shadow-xl rounded-2xl bg-primary hover:bg-secondary hover:text-primary transition-all">
                   إضافة قطعة غيار <Plus size={24} />
                </Button>
              </Link>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
             {[
               { label: "مشاهدات الإعلانات", value: "1.2K", icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
               { label: "الطلبات الجديدة", value: "5", icon: ShoppingBag, color: "text-orange-600", bg: "bg-orange-50" },
               { label: "الرسائل", value: "3", icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
               { label: "المفضلة", value: "42", icon: Heart, color: "text-red-600", bg: "bg-red-50" }
             ].map((stat, i) => (
               <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all">
                 <CardContent className="p-6 flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-black text-muted-foreground uppercase">{stat.label}</p>
                     <h3 className="text-2xl font-black text-primary">{stat.value}</h3>
                   </div>
                   <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                     <stat.icon size={24} />
                   </div>
                 </CardContent>
               </Card>
             ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {menuItems.map((item, idx) => (
               <Link key={idx} href={item.href} className="block group">
                 <div className="bg-white p-10 rounded-[40px] shadow-sm border-2 border-transparent group-hover:border-primary/10 group-hover:shadow-xl transition-all flex flex-col items-center text-center relative overflow-hidden h-full min-h-[300px]">
                    <div className={cn("mb-6 p-6 rounded-3xl", item.bg, item.color)}>
                      <item.icon size={48} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-2xl text-primary mb-3">{item.title}</h3>
                    <p className="text-muted-foreground font-bold leading-relaxed text-sm">{item.description}</p>
                 </div>
               </Link>
             ))}
          </div>

          {/* Help/Subscription Alert */}
          {(!profile?.subscription?.endDate || daysLeft < 7) && (
            <div className="mt-12 bg-amber-50 p-8 rounded-[32px] border-2 border-amber-200 flex flex-col md:flex-row-reverse items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-right">
                <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl">
                  <AlertTriangle size={32} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-amber-900">تنبيه: اشتراكك أوشك على الانتهاء</h4>
                   <p className="text-amber-800 font-bold text-sm">جدد اشتراكك الآن لضمان استمرارية ظهور إعلاناتك للمشترين.</p>
                </div>
              </div>
              <Link href="/seller/settings">
                <Button className="h-12 px-10 bg-amber-600 hover:bg-amber-700 font-black rounded-xl">تجديد الاشتراك الآن</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
