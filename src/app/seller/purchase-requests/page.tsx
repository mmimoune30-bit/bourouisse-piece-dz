"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  Phone, 
  User, 
  Calendar, 
  Clock, 
  MoreVertical, 
  Search,
  Filter,
  Eye,
  MessageCircle,
  Truck,
  ArrowRight
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, updateDoc, doc, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const STATUS_LABELS: Record<string, string> = {
  "New": "جديد",
  "Under Review": "قيد المراجعة",
  "Accepted": "مقبول",
  "Rejected": "مرفوض",
  "Completed": "مكتمل"
};

export default function SellerPurchaseRequests() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");

  const requestsQuery = query(
    collection(firestore!, "purchase_requests"),
    where("sellerId", "==", "S-99182"), // In real app, use user.uid after linking seller account
    orderBy("createdAt", "desc")
  );

  const { data: requests, loading } = useCollection(requestsQuery);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (!firestore) return;
    const requestRef = doc(firestore, "purchase_requests", id);
    updateDoc(requestRef, { status: newStatus })
      .then(() => toast({ title: "تم تحديث الحالة", description: `تم تغيير حالة الطلب إلى ${STATUS_LABELS[newStatus]}` }))
      .catch(() => toast({ variant: "destructive", title: "خطأ", description: "تعذر تحديث حالة الطلب." }));
  };

  const filtered = requests?.filter(r => 
    r.buyerName.toLowerCase().includes(search.toLowerCase()) || 
    r.requestNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-10">
            <div className="text-right">
              <h1 className="text-4xl font-black text-primary mb-1">طلبات الشراء الواردة</h1>
              <p className="text-muted-foreground font-bold">إدارة المبيعات والتواصل مع المشترين.</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                placeholder="بحث برقم الطلب، اسم المشتري، أو المنتج..." 
                className="pr-12 h-12 rounded-2xl border-2 text-right" 
                dir="rtl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </header>

          <Card className="border-none shadow-xl overflow-hidden rounded-[40px] bg-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-zinc-50">
                  <TableRow>
                    <TableHead className="text-right pr-8">رقم الطلب</TableHead>
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-right">المشتري</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-left pl-8">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 animate-pulse font-bold">جاري تحميل الطلبات...</TableCell></TableRow>
                  ) : filtered?.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-32 text-muted-foreground font-bold">لا توجد طلبات شراء حالياً.</TableCell></TableRow>
                  ) : (
                    filtered?.map((req) => (
                      <TableRow key={req.id} className="hover:bg-zinc-50/50 border-b">
                        <TableCell className="pr-8 font-mono font-bold text-xs text-primary">{req.requestNumber}</TableCell>
                        <TableCell>
                          <div className="flex flex-col text-right">
                            <span className="font-bold text-sm">{req.productName}</span>
                            <span className="text-[10px] text-muted-foreground">الكمية: {req.quantity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-right">
                            <span className="font-bold text-sm flex items-center justify-end gap-1"><User size={12} /> {req.buyerName}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">{req.buyerPhone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-right text-xs">
                             <span className="font-bold">{req.createdAt?.toDate().toLocaleDateString('ar-DZ')}</span>
                             <span className="text-muted-foreground">{req.createdAt?.toDate().toLocaleTimeString('ar-DZ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "font-black text-[10px]",
                            req.status === 'New' ? "bg-red-500" : 
                            req.status === 'Accepted' ? "bg-green-600" : 
                            req.status === 'Rejected' ? "bg-zinc-400" : "bg-blue-600"
                          )}>
                            {STATUS_LABELS[req.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left pl-8">
                          <div className="flex gap-2">
                             <Button variant="outline" size="sm" className="font-bold rounded-xl gap-1 border-primary/20" onClick={() => window.location.href = `tel:${req.buyerPhone}`}>
                                <Phone size={14} /> اتصل
                             </Button>
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical size={18} /></Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="start" dir="rtl" className="w-56 rounded-2xl shadow-2xl p-2">
                                 <DropdownMenuItem className="justify-end gap-2 cursor-pointer font-bold py-3 hover:bg-zinc-50 rounded-xl" onClick={() => handleUpdateStatus(req.id, "Accepted")}>
                                   <CheckCircle size={16} className="text-green-600" /> قبول الطلب
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className="justify-end gap-2 cursor-pointer font-bold py-3 hover:bg-zinc-50 rounded-xl" onClick={() => handleUpdateStatus(req.id, "Under Review")}>
                                   <Clock size={16} className="text-amber-500" /> قيد المراجعة
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className="justify-end gap-2 cursor-pointer font-bold py-3 hover:bg-zinc-50 rounded-xl" onClick={() => handleUpdateStatus(req.id, "Completed")}>
                                   <Truck size={16} className="text-blue-600" /> تم التوصيل
                                 </DropdownMenuItem>
                                 <DropdownMenuSeparator />
                                 <DropdownMenuItem className="justify-end gap-2 cursor-pointer font-bold py-3 text-destructive hover:bg-red-50 rounded-xl" onClick={() => handleUpdateStatus(req.id, "Rejected")}>
                                   <XCircle size={16} /> رفض الطلب
                                 </DropdownMenuItem>
                               </DropdownMenuContent>
                             </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}