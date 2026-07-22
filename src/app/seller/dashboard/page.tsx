
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Package, 
  Plus, 
  TrendingUp, 
  Search, 
  MoreVertical,
  Clock,
  CheckCircle,
  Eye,
  Heart,
  MessageSquare,
  BarChart3,
  Archive,
  Tag,
  ShoppingBag,
  Edit3
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INITIAL_LISTINGS = [
  { id: "L001", name: "محرك كامل Clio 4", price: 450000, status: "Active", views: 420, date: "2024-05-15" },
  { id: "L002", name: "مصباح أمامي LED", price: 12000, status: "Active", views: 185, date: "2024-05-14" },
  { id: "L003", name: "رادياتور تبريد", price: 8500, status: "Archived", views: 98, date: "2024-05-12" },
];

export default function SellerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleArchive = (id: string) => {
    if (confirm("هل تريد أرشفة هذا الإعلان؟ سيختفي من البحث العام ولكن سيبقى في سجلاتك.")) {
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: "Archived" } : l));
      toast({ title: "تمت الأرشفة", description: "تم نقل القطعة إلى الأرشيف بنجاح." });
    }
  };

  const handleMarkAsSold = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "Sold" } : l));
    toast({ title: "تم البيع!", description: "تم تحديث حالة الإعلان كقطعة مباعة." });
  };

  const filteredListings = listings.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 pt-20 pb-12">
        <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-10">
          <div className="text-right">
            <h1 className="text-4xl font-black text-primary mb-1">لوحة تحكم المتجر</h1>
            <p className="text-muted-foreground font-bold">مرحباً بك، <span className="text-secondary">EliteMotors DZ</span></p>
          </div>
          <div className="flex gap-3">
            <Link href="/seller/purchase-requests">
              <Button className="h-14 px-8 text-lg font-black gap-2 shadow-xl bg-secondary text-primary hover:bg-white transition-all rounded-2xl">
                <ShoppingBag size={24} /> طلبات الشراء
              </Button>
            </Link>
            <Link href="/seller/listings/new">
              <Button className="h-14 px-8 text-lg font-black gap-2 shadow-xl bg-primary hover:bg-secondary hover:text-primary transition-all rounded-2xl">
                <Plus size={24} /> إضافة قطعة
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "إجمالي الإعلانات", value: listings.length, icon: <Package className="text-secondary" />, trend: "+4 هذا الأسبوع" },
            { label: "إعلانات نشطة", value: listings.filter(l => l.status === 'Active').length, icon: <CheckCircle className="text-green-500" />, trend: "قيد العرض" },
            { label: "قطع مؤرشفة", value: listings.filter(l => l.status === 'Archived').length, icon: <Archive className="text-blue-500" />, trend: "مخفية عن العامة" },
            { label: "مشاهدات", value: "8.4K", icon: <Eye className="text-purple-500" />, trend: "نمو مستمر" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm group hover:shadow-xl transition-all bg-white rounded-3xl">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-zinc-50 rounded-2xl">
                    {stat.icon}
                  </div>
                  <Badge variant="outline" className="font-black text-[10px] uppercase border-zinc-100">{stat.trend}</Badge>
                </div>
                <p className="text-xs font-black text-muted-foreground mb-1 text-right">{stat.label}</p>
                <h3 className="text-3xl font-black text-primary text-right">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-xl overflow-hidden bg-white rounded-[40px]">
          <CardHeader className="flex flex-row-reverse items-center justify-between border-b p-8 bg-zinc-50/50">
            <div className="text-right">
              <CardTitle className="text-2xl font-black">إدارة المخزون</CardTitle>
              <CardDescription className="font-bold">قم بتعديل أو أرشفة منتجاتك الحالية</CardDescription>
            </div>
            <div className="relative w-64 hidden md:block">
               <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
               <Input 
                 placeholder="بحث في إعلاناتي..." 
                 className="pr-10 h-11 rounded-xl border-2" 
                 dir="rtl"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right pr-8">الإعلان</TableHead>
                  <TableHead className="text-right">السعر</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">المشاهدات</TableHead>
                  <TableHead className="text-left pl-8">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((item) => (
                  <TableRow key={item.id} className="hover:bg-zinc-50/50 transition-colors border-b">
                    <TableCell className="font-bold pr-8">
                      <div className="flex flex-col text-right">
                        <span className="text-primary">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{item.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-black text-secondary">
                      {mounted ? item.price.toLocaleString() : item.price} دج
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={cn(
                        "font-black", 
                        item.status === 'Active' ? "bg-green-600" : 
                        item.status === 'Archived' ? "bg-zinc-400" : "bg-blue-600"
                      )}>
                        {item.status === 'Active' ? 'نشط' : item.status === 'Archived' ? 'مؤرشف' : 'مباع'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-muted-foreground">{item.views}</TableCell>
                    <TableCell className="text-left pl-8">
                      <div className="flex gap-2">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical size={18} /></Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="start" dir="rtl" className="p-2 rounded-xl shadow-2xl">
                             <DropdownMenuItem className="justify-end gap-2 cursor-pointer font-bold py-2" onClick={() => handleMarkAsSold(item.id)}>
                               <Tag size={14} className="text-blue-500" /> تم البيع
                             </DropdownMenuItem>
                             <DropdownMenuItem className="justify-end gap-2 cursor-pointer font-bold py-2" onClick={() => handleArchive(item.id)}>
                               <Archive size={14} className="text-amber-600" /> أرشفة المنتج
                             </DropdownMenuItem>
                             <DropdownMenuItem className="justify-end gap-2 cursor-pointer font-bold py-2 text-primary">
                               <Edit3 size={14} /> تعديل البيانات
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                         <Button variant="outline" size="sm" className="font-bold rounded-lg" asChild>
                            <Link href={`/products/${item.id}`}>معاينة</Link>
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
