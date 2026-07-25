
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  CreditCard, 
  CheckCircle2, 
  FileDown, 
  Search, 
  AlertCircle,
  TrendingUp,
  Clock,
  Ban,
  Receipt,
  PlusCircle,
  Printer,
  Download,
  MapPin,
  User,
  Phone,
  Calendar,
  ShieldCheck,
  Settings,
  Maximize2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, updateDoc, doc } from "firebase/firestore";

export default function PaymentManagement() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const paymentsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "payments"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: payments, loading } = useCollection(paymentsQuery);

  const stats = useMemo(() => {
    const total = payments?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;
    const pending = payments?.filter(p => p.status === 'Pending').length || 0;
    return { total, pending };
  }, [payments]);

  const filteredPayments = payments?.filter(p => 
    p.userName?.includes(search) || p.id?.includes(search) || p.storeName?.includes(search)
  );

  const handleApprove = async (id: string) => {
    if (!firestore) return;
    try {
      await updateDoc(doc(firestore, "payments", id), { status: "Approved" });
      toast({ title: "تم قبول العملية", description: "تم تفعيل العملية بنجاح." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر التحديث." });
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">الإدارة المالية والمدفوعات (Live)</h1>
          <p className="text-muted-foreground">تتبع والموافقة على التحويلات المالية الحقيقية فقط.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/payments/create">
            <Button className="gap-2 font-bold bg-secondary text-primary hover:bg-white">
              <PlusCircle size={18} /> إنشاء عملية دفع
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-none shadow-sm bg-white overflow-hidden relative">
          <p className="text-xs font-black text-muted-foreground uppercase mb-1">إجمالي الإيرادات المسجلة</p>
          <h3 className="text-3xl font-black text-green-600">{stats.total.toLocaleString()} دج</h3>
          <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-green-50" />
        </Card>
        <Card className="p-6 border-none shadow-sm bg-white">
          <p className="text-xs font-black text-muted-foreground uppercase mb-1">عمليات بانتظار المراجعة</p>
          <h3 className="text-3xl font-black text-amber-600">{stats.pending}</h3>
        </Card>
      </div>

      <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            placeholder="بحث في السجلات..." 
            className="w-full pr-10 h-10 border rounded-lg px-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50">
              <TableHead className="text-right pr-6">رقم العملية</TableHead>
              <TableHead className="text-right">البائع / المتجر</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-left pl-6">الإجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 animate-pulse font-bold">جاري تحميل البيانات المالية...</TableCell></TableRow>
            ) : filteredPayments?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-32 text-muted-foreground font-bold">لا توجد عمليات دفع مسجلة حالياً.</TableCell></TableRow>
            ) : (
              filteredPayments?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pr-6 font-mono text-xs">{p.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-bold">{p.userName || p.storeName}</TableCell>
                  <TableCell className="font-black text-green-600">{Number(p.amount).toLocaleString()} دج</TableCell>
                  <TableCell>
                    <Badge className={cn("font-bold", p.status === 'Approved' ? 'bg-green-600' : 'bg-amber-500')}>
                      {p.status === 'Approved' ? 'مقبولة' : 'قيد الانتظار'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <Button variant="outline" size="sm" onClick={() => setSelectedPayment(p)}>تفاصيل</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
