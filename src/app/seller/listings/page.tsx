
"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Package, Plus, Search, Edit3, Archive, Eye, MoreVertical, AlertCircle, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Mock Data
const MOCK_LISTINGS = [
  { id: "L1", name: "مصباح أمامي أيمن Clio 4", price: 8500, category: "إضاءة", status: "Active", date: "2024-05-18", image: "https://picsum.photos/seed/p1/100/100" },
  { id: "L2", name: "محرك كامل 1.5 dCi", price: 450000, category: "المحرك", status: "Active", date: "2024-05-15", image: "https://picsum.photos/seed/p2/100/100" },
  { id: "L3", name: "رادياتور Peugeot 208", price: 12000, category: "التبريد", status: "Archived", date: "2024-05-10", image: "https://picsum.photos/seed/p3/100/100" },
];

export default function SellerListingsPage() {
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState(MOCK_LISTINGS);

  const handleArchive = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: l.status === 'Archived' ? 'Active' : 'Archived' } : l));
    toast({ title: "تم تحديث الحالة", description: "تم تغيير حالة الإعلان بنجاح." });
  };

  const filtered = listings.filter(l => l.name.includes(search));

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-right" dir="rtl">
            <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black text-primary mb-1">إدارة إعلاناتي</h1>
                <p className="text-muted-foreground font-bold">يمكنك هنا تعديل، أرشفة أو إضافة قطع غيار جديدة.</p>
              </div>
              <Link href="/seller/listings/new">
                <Button className="font-black gap-2 h-12 px-6 rounded-xl shadow-lg">
                  <Plus size={18} /> إضافة قطعة جديدة
                </Button>
              </Link>
            </header>

            <Card className="border-none shadow-xl overflow-hidden rounded-[32px] bg-white">
              <CardContent className="p-0">
                <div className="p-6 border-b bg-zinc-50/50 flex flex-col md:flex-row-reverse justify-between items-center gap-4">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      placeholder="بحث في إعلاناتي..." 
                      className="pr-10 text-right h-12 rounded-xl border-2"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Badge variant="outline" className="h-10 px-4 bg-white border-2 font-bold flex items-center gap-2">
                    <Package size={16} /> {filtered.length} قطعة معروضة
                  </Badge>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/80">
                      <TableHead className="text-right pr-8">المنتج</TableHead>
                      <TableHead className="text-right">السعر (دج)</TableHead>
                      <TableHead className="text-right">التصنيف</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">تاريخ النشر</TableHead>
                      <TableHead className="text-left pl-8">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-bold">
                           لا توجد إعلانات مطابقة لبحثك.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((item) => (
                        <TableRow key={item.id} className="hover:bg-zinc-50 transition-colors">
                          <TableCell className="pr-8 py-4">
                             <div className="flex items-center gap-4 justify-start flex-row-reverse">
                                <div className="w-12 h-12 rounded-xl relative overflow-hidden bg-zinc-100 border">
                                   <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <span className="font-black text-primary">{item.name}</span>
                             </div>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">{item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-sm font-bold">{item.category}</TableCell>
                          <TableCell>
                             <Badge className={cn(
                               "font-black text-[10px]",
                               item.status === 'Active' ? "bg-green-600" : "bg-zinc-400"
                             )}>
                               {item.status === 'Active' ? 'نشط' : 'مؤرشف'}
                             </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-bold text-muted-foreground">{item.date}</TableCell>
                          <TableCell className="text-left pl-8">
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical size={18} /></Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="start" dir="rtl" className="w-48 p-2 rounded-2xl shadow-2xl">
                                  <DropdownMenuItem className="justify-end gap-2 font-bold py-3 cursor-pointer rounded-xl hover:bg-zinc-50">
                                     <Eye size={16} /> معاينة الإعلان
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="justify-end gap-2 font-bold py-3 cursor-pointer rounded-xl hover:bg-zinc-50">
                                     <Edit3 size={16} /> تعديل البيانات
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="justify-end gap-2 font-bold py-3 cursor-pointer rounded-xl text-amber-600 hover:bg-amber-50"
                                    onClick={() => handleArchive(item.id)}
                                  >
                                     <Archive size={16} /> {item.status === 'Active' ? 'أرشفة المنتج' : 'تنشيط المنتج'}
                                  </DropdownMenuItem>
                               </DropdownMenuContent>
                             </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="mt-8 flex flex-row-reverse items-center gap-4 bg-blue-50 p-6 rounded-[24px] border-2 border-blue-100">
               <AlertCircle className="text-blue-600 shrink-0" size={24} />
               <p className="text-sm text-blue-900 font-bold leading-relaxed">
                 ملاحظة: يمكنك أرشفة المنتجات بدلاً من حذفها للحفاظ على سجل مبيعاتك وإحصائيات متجرك. الحذف النهائي متاح فقط عبر التواصل مع الإدارة.
               </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
