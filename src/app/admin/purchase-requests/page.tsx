
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Calendar, 
  User, 
  Store, 
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const STATUS_LABELS: Record<string, string> = {
  "New": "جديد",
  "Under Review": "قيد المراجعة",
  "Accepted": "مقبول",
  "Rejected": "مرفوض",
  "Completed": "مكتمل"
};

export default function AdminPurchaseRequests() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");

  const requestsQuery = query(
    collection(firestore!, "purchase_requests"),
    orderBy("createdAt", "desc")
  );

  const { data: requests, loading } = useCollection(requestsQuery);

  const handleDelete = (id: string) => {
    if (!firestore || !confirm("هل تريد حذف هذا الطلب نهائياً من السجلات؟")) return;
    deleteDoc(doc(firestore, "purchase_requests", id))
      .then(() => toast({ variant: "destructive", title: "تم الحذف", description: "تمت إزالة طلب الشراء من قاعدة البيانات." }))
      .catch(() => toast({ variant: "destructive", title: "خطأ", description: "تعذر حذف الطلب." }));
  };

  const filtered = requests?.filter(r => 
    r.buyerName.toLowerCase().includes(search.toLowerCase()) || 
    r.storeName.toLowerCase().includes(search.toLowerCase()) ||
    r.productName.toLowerCase().includes(search.toLowerCase()) ||
    r.requestNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <ShoppingBag size={32} className="text-secondary" /> إدارة طلبات الشراء
          </h1>
          <p className="text-muted-foreground mt-1">مراقبة كافة التعاملات التجارية والطلبات بين المشترين والبائعين.</p>
        </div>
        <Button variant="outline" className="font-bold gap-2 h-11"><Download size={18} /> تصدير التقرير التجاري</Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث بالمشتري، المتجر، أو رقم الطلب..." 
            className="pr-10 text-right h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/5 h-11 px-4 flex items-center gap-2 font-bold">
             {filtered?.length || 0} طلب شراء مسجل
          </Badge>
          <Button variant="ghost" className="gap-2 font-bold"><Filter size={18} /> تصفية متقدمة</Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50">
              <TableRow>
                <TableHead className="text-right pr-6">رقم الطلب</TableHead>
                <TableHead className="text-right">المتجر / البائع</TableHead>
                <TableHead className="text-right">المنتج / الكمية</TableHead>
                <TableHead className="text-right">المشتري</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-left pl-6">إجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-20 animate-pulse font-bold">جاري تحميل البيانات الإحصائية...</TableCell></TableRow>
              ) : filtered?.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-20 text-muted-foreground font-bold">لا توجد عمليات مسجلة حالياً.</TableCell></TableRow>
              ) : (
                filtered?.map((req) => (
                  <TableRow key={req.id} className="hover:bg-zinc-50/50">
                    <TableCell className="pr-6 font-mono font-bold text-xs">{req.requestNumber}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-right">
                        <span className="font-bold flex items-center gap-2 justify-end">{req.storeName} <Store size={12} className="text-secondary" /></span>
                        <span className="text-[10px] text-muted-foreground">ID: {req.sellerId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-right">
                        <span className="font-bold text-sm">{req.productName}</span>
                        <span className="text-[10px] font-black text-secondary">الكمية: {req.quantity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-right">
                        <span className="font-bold flex items-center gap-2 justify-end">{req.buyerName} <User size={12} /></span>
                        <span className="text-[10px] text-muted-foreground">{req.wilaya}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-bold text-[10px]",
                        req.status === 'New' ? "bg-red-500" : 
                        req.status === 'Accepted' ? "bg-green-600" : 
                        req.status === 'Rejected' ? "bg-zinc-400" : "bg-blue-600"
                      )}>
                        {STATUS_LABELS[req.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-right text-xs">
                        <span className="font-bold">{req.createdAt?.toDate().toLocaleDateString('ar-DZ')}</span>
                        <span className="text-muted-foreground">{req.createdAt?.toDate().toLocaleTimeString('ar-DZ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-left pl-6">
                      <div className="flex items-center gap-2">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/5" onClick={() => toast({ title: "معاينة", description: "فتح تفاصيل الطلب التجارية..." })}><Eye size={16} /></Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-red-50" onClick={() => handleDelete(req.id)}><Trash2 size={16} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 border-none shadow-sm bg-primary text-white overflow-hidden relative">
            <div className="relative z-10">
               <h4 className="text-xs font-black uppercase text-blue-100 mb-1">إجمالي التداولات</h4>
               <h3 className="text-3xl font-black">4.5M دج</h3>
            </div>
            <ShoppingBag className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
         </Card>
         <Card className="p-6 border-none shadow-sm bg-white overflow-hidden relative">
            <h4 className="text-xs font-black uppercase text-muted-foreground mb-1">طلبات بانتظار المراجعة</h4>
            <h3 className="text-3xl font-black text-red-500">{filtered?.filter(r => r.status === 'New').length || 0}</h3>
            <Clock className="absolute -bottom-4 -right-4 w-24 h-24 text-zinc-50" />
         </Card>
         <Card className="p-6 border-none shadow-sm bg-white overflow-hidden relative">
            <h4 className="text-xs font-black uppercase text-muted-foreground mb-1">نسبة النجاح (Conversion)</h4>
            <h3 className="text-3xl font-black text-green-600">82%</h3>
            <CheckCircle2 className="absolute -bottom-4 -right-4 w-24 h-24 text-zinc-50" />
         </Card>
      </div>
    </div>
  );
}
