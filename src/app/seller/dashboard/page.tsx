
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Heart, 
  ClipboardList, 
  CreditCard, 
  Ticket, 
  MessageSquare, 
  Settings, 
  LogOut,
  MoreVertical,
  Eye,
  TrendingUp,
  CheckCircle,
  Layers,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const SIDEBAR_ITEMS = [
  { name: "الرئيسية", icon: LayoutDashboard, href: "/seller/dashboard", active: true },
  { name: "إعلاناتي", icon: Package, href: "#" },
  { name: "طلبات الشراء", icon: ShoppingBag, href: "/seller/purchase-requests" },
  { name: "المفضلة", icon: Heart, href: "#" },
  { name: "الطلبات", icon: ClipboardList, href: "#" },
  { name: "المدفوعات", icon: CreditCard, href: "#" },
  { name: "الاشتراكات", icon: Ticket, href: "#" },
  { name: "الرسائل", icon: MessageSquare, href: "#" },
  { name: "الإعدادات", icon: Settings, href: "#" },
];

const STATS = [
  { label: "مشاهدات متحركة", value: "8.4K", change: "+12% نمو", icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "قطع تم بيعها", value: "1", change: "تطور الأداء", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "إعلانات نشطة", value: "2", change: "90% من الأسبوع", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  { label: "إجمالي الإعلانات", value: "3", change: "هذا الأسبوع +4", icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
];

const LATEST_ADS = [
  { id: 1, title: "مصباح أمامي تويوتا كورولا 2018", status: "نشط", price: "12,500 دج", date: "2026/07/21", image: "https://picsum.photos/seed/corolla/100/100" },
  { id: 2, title: "محرك بي ام دبليو 2016 X5", status: "في الانتظار", price: "45,000 دج", date: "2026/07/20", image: "https://picsum.photos/seed/bmw/100/100" },
];

export default function SellerDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-row-reverse font-body" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l flex flex-col sticky top-0 h-screen hidden lg:flex shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-3 justify-end mb-10">
            <span className="font-black text-xl text-primary tracking-tighter">BOUROUISSE</span>
            <div className="w-8 h-8 bg-primary rounded-lg" />
          </div>

          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                  item.active 
                    ? "bg-primary/5 text-primary" 
                    : "text-zinc-400 hover:bg-zinc-50 hover:text-primary"
                )}
              >
                <item.icon size={18} />
                <span className="flex-grow text-right">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 font-bold hover:bg-red-50 hover:text-red-600 rounded-xl px-4 py-6">
            <LogOut size={18} />
            <span className="flex-grow text-right">تسجيل خروج</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10">
        <header className="mb-10 text-right">
          <h1 className="text-3xl font-black text-[#1E293B]">لوحة تحكم البائع</h1>
          <p className="text-zinc-400 font-medium mt-1">مرحباً بك في لوحة التحكم الخاصة بك</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                    <stat.icon size={24} />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-black border-zinc-100 text-zinc-500">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-zinc-400 text-xs font-bold mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-[#1E293B]">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Latest Ads Section */}
        <div className="bg-white rounded-[32px] shadow-sm border border-zinc-100 overflow-hidden">
          <div className="p-8 flex items-center justify-between border-b border-zinc-50">
            <Link href="#" className="text-primary text-sm font-black flex items-center gap-1 hover:gap-2 transition-all">
              <ChevronLeft size={16} /> عرض جميع الإعلانات
            </Link>
            <h2 className="text-xl font-black text-[#1E293B]">إعلاناتي الأخيرة</h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-right pr-8 font-black text-zinc-400 text-xs h-12">الصورة</TableHead>
                  <TableHead className="text-right font-black text-zinc-400 text-xs">العنوان</TableHead>
                  <TableHead className="text-right font-black text-zinc-400 text-xs">الحالة</TableHead>
                  <TableHead className="text-right font-black text-zinc-400 text-xs">السعر</TableHead>
                  <TableHead className="text-right font-black text-zinc-400 text-xs">تاريخ النشر</TableHead>
                  <TableHead className="text-center pl-8 font-black text-zinc-400 text-xs">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LATEST_ADS.map((ad) => (
                  <TableRow key={ad.id} className="border-b border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                    <TableCell className="pr-8 py-4">
                      <div className="relative w-16 h-12 rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50">
                        <Image src={ad.image} alt={ad.title} fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-[#1E293B] text-sm">{ad.title}</TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "font-black text-[10px] px-3 py-1 rounded-full",
                          ad.status === 'نشط' ? "bg-green-50 text-green-600 hover:bg-green-100 border-none" : "bg-orange-50 text-orange-600 hover:bg-orange-100 border-none"
                        )}
                      >
                        {ad.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-zinc-700 text-sm">{ad.price}</TableCell>
                    <TableCell className="text-zinc-400 text-xs font-bold">{ad.date}</TableCell>
                    <TableCell className="pl-8 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl text-zinc-400">
                            <MoreVertical size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="rounded-2xl shadow-xl border-zinc-100 w-48 font-bold" dir="rtl">
                          <DropdownMenuItem className="justify-end gap-2 py-3 cursor-pointer">تعديل البيانات</DropdownMenuItem>
                          <DropdownMenuItem className="justify-end gap-2 py-3 cursor-pointer">معاينة الإعلان</DropdownMenuItem>
                          <DropdownMenuItem className="justify-end gap-2 py-3 cursor-pointer text-red-500">حذف الإعلان</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
