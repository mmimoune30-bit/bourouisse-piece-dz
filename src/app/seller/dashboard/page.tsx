
"use client";

import React, { useState } from "react";
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
  ChevronRight,
  MoreVertical,
  Clock,
  CheckCircle,
  Eye,
  Heart,
  MessageSquare,
  BarChart3,
  Trash2,
  Tag,
  Download,
  Loader2
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
  { id: "L001", name: "محرك كامل Clio 4", price: "450,000 دج", status: "Active", views: 420, date: "2024-05-15" },
  { id: "L002", name: "مصباح أمامي LED", price: "12,000 دج", status: "Active", views: 185, date: "2024-05-14" },
  { id: "L003", name: "رادياتور تبريد", price: "8,500 دج", status: "Sold", views: 98, date: "2024-05-12" },
];

export default function SellerDashboard() {
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [search, setSearch] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الإعلان نهائياً؟")) {
      setListings(prev => prev.filter(l => l.id !== id));
      toast({ variant: "destructive", title: "تم حذف الإعلان", description: "تمت إزالة القطعة من مخزونك." });
    }
  };

  const handleMarkAsSold = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "Sold" } : l));
    toast({ title: "تم البيع!", description: "تم تحديث حالة الإعلان بنجاح." });
  };

  const handleDownloadReports = () => {
    setIsDownloading(true);
    toast({ 
      title: "جاري المعالجة", 
      description: "يتم الآن تجميع بيانات المبيعات والإحصائيات للشهر الحالي..." 
    });

    // Simulate API/Generation delay
    setTimeout(() => {
      setIsDownloading(false);
      toast({ 
        title: "اكتمل التنزيل", 
        description: "تم تصدير تقرير المبيعات بنجاح بصيغة PDF. (تجريبي)" 
      });
    }, 2500);
  };

  const filteredListings = listings.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 pt-[235px] pb-12">
        <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-10">
          <div className="text-right">
            <h1 className="text-4xl font-black text-primary mb-1">لوحة تحكم المتجر</h1>
            <p className="text-muted-foreground font-bold">مرحباً بك، <span className="text-secondary">EliteMotors DZ</span> (المعرف: BR-S-9918)</p>
          </div>
          <div className="flex gap-3">
            <Link href="/seller/listings/new">
              <Button className="h-14 px-8 text-lg font-black gap-2 shadow-xl bg-primary hover:bg-secondary hover:text-primary transition-all rounded-2xl">
                <Plus size={24} /> إضافة إعلان جديد
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="h-14 px-6 font-bold rounded-2xl border-2 flex gap-2 items-center" 
              onClick={handleDownloadReports}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  جاري التحميل...
                </>
              ) : (
                <>
                  <Download size={20} />
                  تحميل تقارير المبيعات
                </>
              )}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "إجمالي الإعلانات", value: listings.length, icon: <Package className="text-secondary" />, trend: "+4 هذا الأسبوع" },
            { label: "إعلانات نشطة", value: listings.filter(l => l.status === 'Active').length, icon: <CheckCircle className="text-green-500" />, trend: "90% من الإجمالي" },
            { label: "قطع تم بيعها", value: listings.filter(l => l.status === 'Sold').length, icon: <TrendingUp className="text-blue-500" />, trend: "تحليل الأداء" },
            { label: "مشاهدات متجرك", value: "8.4K", icon: <Eye className="text-purple-500" />, trend: "+12% نمو" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-xl transition-all bg-white rounded-3xl">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-zinc-50 rounded-2xl group-hover:bg-primary/5 transition-colors">
                    {stat.icon}
                  </div>
                  <Badge variant="outline" className="font-black text-[10px] uppercase border-zinc-100">{stat.trend}</Badge>
                </div>
                <p className="text-xs font-black text-muted-foreground mb-1 uppercase tracking-widest text-right">{stat.label}</p>
                <h3 className="text-3xl font-black text-primary text-right">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-xl overflow-hidden bg-white rounded-[40px]">
            <CardHeader className="flex flex-row-reverse items-center justify-between border-b p-8 bg-zinc-50/50">
              <div className="text-right">
                <CardTitle className="text-2xl font-black">إعلاناتك الأخيرة</CardTitle>
                <CardDescription className="font-bold">إدارة مخزونك الحالي المتاح للبيع</CardDescription>
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
                <TableHeader className="bg-zinc-50">
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
                      <TableCell className="text-right font-black text-secondary">{item.price}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={cn("font-black", item.status === 'Active' ? "bg-green-600" : "bg-zinc-400")}>
                          {item.status === 'Active' ? 'نشط' : 'تم البيع'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-muted-foreground">{item.views}</TableCell>
                      <TableCell className="text-left pl-8">
                        <div className="flex gap-2">
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5"><MoreVertical size={18} /></Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="start" dir="rtl">
                               <DropdownMenuItem className="justify-end gap-2 cursor-pointer" onClick={() => handleMarkAsSold(item.id)}>
                                 <Tag size={14} /> تم البيع
                               </DropdownMenuItem>
                               <DropdownMenuItem className="justify-end gap-2 cursor-pointer text-destructive" onClick={() => handleDelete(item.id)}>
                                 <Trash2 size={14} /> حذف
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                           <Button variant="outline" size="sm" className="font-bold rounded-lg border-primary/20 text-primary" onClick={() => toast({ title: "تعديل", description: "فتح محرر الإعلانات..." })}>تعديل</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: "المفضلات", value: "240", icon: <Heart className="text-red-500" /> },
                 { label: "رسائل العملاء", value: "12", icon: <MessageSquare className="text-blue-500" /> },
               ].map((action, i) => (
                 <Card key={i} className="border-none shadow-sm p-6 text-center bg-white rounded-3xl cursor-pointer hover:bg-zinc-50 transition-colors" onClick={() => toast({ title: action.label, description: "جاري تحميل البيانات..." })}>
                    <div className="mx-auto w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4">
                       {action.icon}
                    </div>
                    <p className="text-2xl font-black text-primary">{action.value}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{action.label}</p>
                 </Card>
               ))}
            </div>

            <Card className="border-none shadow-xl bg-primary text-white rounded-[40px] overflow-hidden relative">
              <div className="p-8 relative z-10 text-right">
                 <h3 className="text-xl font-black mb-4 flex items-center justify-end gap-2 text-secondary">
                   تحليل الأداء <BarChart3 />
                 </h3>
                 <p className="text-blue-100/70 text-sm leading-relaxed mb-6 font-medium">
                   إعلانات المحركات لديك حصدت <span className="text-secondary font-black">2.4K مشاهدة</span> جديدة هذا الشهر. نقترح إضافة صور أكثر لزيادة المبيعات.
                 </p>
                 <Button variant="secondary" className="w-full h-12 font-black rounded-xl" onClick={() => toast({ title: "الإحصائيات", description: "فتح لوحة التحليلات المتقدمة..." })}>مشاهدة الإحصائيات التفصيلية</Button>
              </div>
              <div className="absolute -bottom-10 -left-10 opacity-10">
                 <BarChart3 size={200} />
              </div>
            </Card>

            <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-[32px] text-right">
               <h4 className="font-black text-amber-800 mb-2 flex items-center justify-end gap-2">تنبيه النظام <Clock size={16} /></h4>
               <p className="text-xs text-amber-700 font-bold leading-relaxed">
                 اشتراكك الحالي "Gold" ينتهي خلال 5 أيام. يرجى التجديد لضمان استمرار ظهور إعلاناتك في مقدمة البحث.
               </p>
               <Button variant="link" className="text-amber-800 font-black p-0 mt-2" onClick={() => toast({ title: "تجديد", description: "فتح بوابة الدفع لتجديد الاشتراك..." })}>تجديد الاشتراك الآن</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
