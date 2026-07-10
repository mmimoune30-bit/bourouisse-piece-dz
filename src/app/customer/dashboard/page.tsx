
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageSquare, 
  ShieldAlert, 
  User, 
  Search, 
  ChevronRight,
  Package,
  Bell,
  MapPin,
  Settings,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const SAVED_ITEMS = [
  { id: "p1", name: "مصباح أمامي أيمن Clio 4", price: "8,500 دج", image: PlaceHolderImages[5].imageUrl, store: "Auto Pièces Chlef" },
  { id: "p3", name: "رادياتور Peugeot 208", price: "12,000 دج", image: PlaceHolderImages[4].imageUrl, store: "Pièces Renault DZ" },
];

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-[235px] pb-12">
        <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-10">
          <div className="text-right">
            <h1 className="text-4xl font-black text-primary mb-1">لوحة تحكم المشتري</h1>
            <p className="text-muted-foreground font-bold">أهلاً بك، <span className="text-primary">كريم بوعلام</span> (المعرف: BR-C-1021)</p>
          </div>
          <div className="flex gap-3">
            <Link href="/catalog">
              <Button className="h-14 px-8 text-lg font-black gap-2 shadow-xl bg-primary hover:bg-secondary hover:text-primary transition-all rounded-2xl">
                <Search size={24} /> ابحث عن قطعة
              </Button>
            </Link>
            <Button variant="outline" className="h-14 w-14 rounded-2xl border-2"><Settings /></Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Sidebar */}
          <div className="space-y-4 text-right order-2 lg:order-1" dir="rtl">
             <Link href="/customer/purchase-requests" className="block">
               <Button variant="ghost" className="w-full h-16 justify-between px-6 bg-white shadow-sm border rounded-2xl hover:bg-zinc-50 hover:border-secondary transition-all font-black text-lg">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center"><ShoppingBag className="text-primary" /></div>
                   طلبات الشراء الخاصة بي
                 </div>
                 <Badge className="bg-secondary text-primary">نشط</Badge>
               </Button>
             </Link>

             {[
               { label: "الإعلانات المحفوظة", icon: <Heart className="text-red-500" />, count: "8" },
               { label: "المراسلات", icon: <MessageSquare className="text-blue-500" />, count: "3" },
               { label: "الشكاوى والنزاعات", icon: <ShieldAlert className="text-amber-500" />, count: "1" },
               { label: "الإشعارات", icon: <Bell className="text-secondary" />, count: "5" },
             ].map((item, i) => (
               <Button key={i} variant="ghost" className="w-full h-16 justify-between px-6 bg-white shadow-sm border rounded-2xl hover:bg-zinc-50 hover:border-secondary transition-all font-black text-lg">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center">{item.icon}</div>
                   {item.label}
                 </div>
                 <Badge className="bg-primary">{item.count}</Badge>
               </Button>
             ))}

             <Card className="mt-8 border-none shadow-xl bg-zinc-900 text-white rounded-[40px] overflow-hidden">
                <CardContent className="p-8 text-center">
                   <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
                      <User size={40} className="text-secondary" />
                   </div>
                   <h3 className="font-black text-xl mb-1">ملفي الشخصي</h3>
                   <p className="text-xs text-zinc-400 mb-6 flex items-center justify-center gap-1"><MapPin size={12} /> الجزائر العاصمة</p>
                   <Button variant="secondary" className="w-full font-black">تعديل البيانات</Button>
                </CardContent>
             </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8 order-1 lg:order-2">
            {/* Saved Items Grid */}
            <Card className="border-none shadow-xl bg-white rounded-[40px] overflow-hidden">
               <CardHeader className="flex flex-row-reverse items-center justify-between border-b p-8 bg-zinc-50/50">
                  <div className="text-right">
                    <CardTitle, CardDescription className="text-2xl font-black flex items-center justify-end gap-2">المفضلة <Heart className="text-red-500" /></CardTitle>
                    <CardDescription className="font-bold">القطع التي قمت بحفظها مؤخراً لمراجعتها</CardDescription>
                  </div>
                  <Button variant="ghost" className="font-black text-primary">تفريغ الكل</Button>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SAVED_ITEMS.map((item) => (
                      <div key={item.id} className="flex flex-row-reverse gap-4 p-4 border rounded-3xl hover:border-secondary transition-all bg-white group">
                         <Link href={`/products/${item.id}`} className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 cursor-pointer">
                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                         </Link>
                         <div className="flex-grow text-right" dir="rtl">
                            <Link href={`/products/${item.id}`}>
                               <h4 className="font-black text-primary line-clamp-1 hover:text-secondary transition-colors">{item.name}</h4>
                            </Link>
                            <p className="text-secondary font-black text-lg">{item.price}</p>
                            <p className="text-[10px] text-muted-foreground font-bold mt-1">بواسطة: {item.store}</p>
                            <div className="mt-3 flex gap-2">
                               <Button size="sm" className="font-bold h-8 px-4 rounded-lg" asChild>
                                  <Link href={`/products/${item.id}`}>اتصل الآن</Link>
                               </Button>
                               <Button size="sm" variant="outline" className="font-bold h-8 px-4 rounded-lg text-destructive border-destructive/20">حذف</Button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <Button variant="outline" className="rounded-full px-8 font-black gap-2">مشاهدة كافة المحفوظات <ChevronRight size={18} /></Button>
                  </div>
               </CardContent>
            </Card>

            {/* Quick Stats/Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-primary p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10 text-right">
                     <h3 className="text-2xl font-black mb-2 flex items-center justify-end gap-2 text-secondary">طلباتي النشطة <Package /></h3>
                     <p className="text-blue-100/70 font-medium mb-6">لديك 3 استفسارات بانتظار رد البائعين.</p>
                     <Link href="/customer/purchase-requests">
                        <Button variant="secondary" className="font-black rounded-xl px-8">متابعة الاستفسارات</Button>
                     </Link>
                  </div>
                  <Package size={120} className="absolute -bottom-10 -left-10 opacity-10 group-hover:scale-110 transition-transform" />
               </div>

               <div className="bg-white p-8 rounded-[40px] border shadow-sm text-right relative group">
                  <h3 className="text-2xl font-black text-primary mb-2 flex items-center justify-end gap-2">نزاعات قائمة <ShieldAlert className="text-amber-500" /></h3>
                  <p className="text-muted-foreground font-bold mb-6">تم الرد على شكواك بخصوص "المصباح الأمامي".</p>
                  <Link href="/customer/complaints/new">
                    <Button variant="outline" className="w-full h-12 font-black border-2 border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl">مراجعة رد الإدارة</Button>
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
