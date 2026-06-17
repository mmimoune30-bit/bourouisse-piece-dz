
"use client";

import React, { useState, useMemo } from "react";
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
  Eye, 
  CheckCircle2, 
  XCircle, 
  FileDown, 
  Search, 
  AlertCircle,
  TrendingUp,
  Clock,
  Ban,
  Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

// --- Mock Data for Demo ---
const INITIAL_PAYMENTS = [
  { 
    id: "PAY-101", 
    userName: "كريم بوعلام", 
    storeName: "Auto Pièces Chlef",
    amount: 5000, 
    type: "اشتراك ذهبي", 
    method: "CCP", 
    status: "Approved", 
    date: "2024-05-18",
    receiptUrl: "https://picsum.photos/seed/receipt1/400/600",
    notes: ""
  },
  { 
    id: "PAY-102", 
    userName: "أحمد قاسمي", 
    storeName: "Pièces Renault DZ",
    amount: 12000, 
    type: "ترقية احترافية", 
    method: "Baridimob", 
    status: "Pending", 
    date: "2024-05-17",
    receiptUrl: "https://picsum.photos/seed/receipt2/400/600",
    notes: ""
  },
  { 
    id: "PAY-103", 
    userName: "سمير عيساوي", 
    storeName: "Hyundai Parts",
    amount: 8000, 
    type: "إعلان ممول", 
    method: "CIB", 
    status: "Rejected", 
    date: "2024-05-16",
    receiptUrl: "https://picsum.photos/seed/receipt3/400/600",
    notes: "الصورة غير واضحة"
  },
];

export default function PaymentManagement() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  // Simulated Role Check
  const currentUser = { name: "ميمون محمد", role: "Financial Officer" };
  const canManagePayments = ["Super Admin", "Financial Officer"].includes(currentUser.role);

  const stats = useMemo(() => {
    const total = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const pending = payments.filter(p => p.status === 'Pending').length;
    const approved = payments.filter(p => p.status === 'Approved').length;
    return { total, pending, approved };
  }, [payments]);

  const filteredPayments = payments.filter(p => 
    p.userName.includes(search) || p.id.includes(search) || p.storeName.includes(search)
  );

  const handleApprove = (id: string) => {
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, status: "Approved", approvalDate: new Date().toISOString(), approvedBy: currentUser.name } : p
    ));
    toast({
      title: "تم قبول العملية",
      description: `تم تفعيل الاشتراك المرتبط بالعملية ${id} بنجاح.`,
    });
  };

  const handleReject = () => {
    if (!rejectReason || !selectedPayment) return;
    setPayments(prev => prev.map(p => 
      p.id === selectedPayment.id ? { ...p, status: "Rejected", notes: rejectReason, rejectedBy: currentUser.name } : p
    ));
    setIsRejectDialogOpen(false);
    setRejectReason("");
    toast({
      variant: "destructive",
      title: "تم رفض العملية",
      description: `تم إرسال إشعار للبائع بالسبب: ${rejectReason}`,
    });
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">الإدارة المالية والمدفوعات</h1>
          <p className="text-muted-foreground">تتبع، توثيق، والموافقة على التحويلات المالية في المنصة.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 font-bold">
            <FileDown size={18} /> تصدير Excel
          </Button>
          <Button variant="outline" className="gap-2 font-bold">
            <FileDown size={18} /> تصدير PDF
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm bg-white overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-xs font-black text-muted-foreground uppercase mb-1">إجمالي الإيرادات</p>
            <h3 className="text-3xl font-black text-green-600">{stats.total.toLocaleString()} دج</h3>
            <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold mt-2">
              <TrendingUp size={12} /> +15% هذا الشهر
            </div>
          </div>
          <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-green-50" />
        </Card>
        <Card className="p-6 border-none shadow-sm bg-white">
          <p className="text-xs font-black text-muted-foreground uppercase mb-1">عمليات قيد المراجعة</p>
          <h3 className="text-3xl font-black text-amber-600">{stats.pending}</h3>
          <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold mt-2">
            <Clock size={12} /> تتطلب مراجعة فورية
          </div>
        </Card>
        <Card className="p-6 border-none shadow-sm bg-white">
          <p className="text-xs font-black text-muted-foreground uppercase mb-1">العمولات المحصلة</p>
          <h3 className="text-3xl font-black text-primary">{(stats.total * 0.05).toLocaleString()} دج</h3>
          <div className="flex items-center gap-1 text-primary text-[10px] font-bold mt-2">
            <CheckCircle2 size={12} /> صافي ربح المنصة (5%)
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث برقم العملية، اسم البائع، أو المتجر..." 
            className="pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <Badge variant="outline" className="bg-primary/5">{filteredPayments.length}</Badge>
          عملية مسجلة
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50">
                <TableHead className="text-right pr-6">رقم العملية</TableHead>
                <TableHead className="text-right">المستخدم / المتجر</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pr-6 font-mono text-xs">{p.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-right">
                      <span className="font-bold">{p.userName}</span>
                      <span className="text-[10px] text-muted-foreground">{p.storeName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-green-600">{p.amount.toLocaleString()} دج</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-bold">{p.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-bold",
                      p.status === "Approved" ? "bg-green-600" : 
                      p.status === "Pending" ? "bg-amber-500" : "bg-destructive"
                    )}>
                      {p.status === 'Approved' ? 'مقبولة' : p.status === 'Pending' ? 'قيد الانتظار' : 'مرفوضة'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6 space-x-2 space-x-reverse">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedPayment(p)}>
                          <Receipt size={14} /> الوصل
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md" dir="rtl">
                        <DialogHeader>
                          <DialogTitle>معاينة وصل الدفع</DialogTitle>
                          <DialogDescription>رقم العملية: {p.id} - بائع: {p.userName}</DialogDescription>
                        </DialogHeader>
                        <div className="relative aspect-[3/4] w-full bg-zinc-100 rounded-xl overflow-hidden border-2 border-dashed">
                          {p.receiptUrl && (
                            <Image src={p.receiptUrl} alt="Receipt" fill className="object-contain" />
                          )}
                        </div>
                        <DialogFooter className="gap-2 sm:justify-start">
                          <Button variant="outline">إغلاق</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {canManagePayments && p.status === 'Pending' && (
                      <div className="flex gap-2 mt-1">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 gap-1"
                          onClick={() => handleApprove(p.id)}
                        >
                          <CheckCircle2 size={14} /> قبول
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => {
                            setSelectedPayment(p);
                            setIsRejectDialogOpen(true);
                          }}
                        >
                          <Ban size={14} /> رفض
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject Reason Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 justify-end">
              <AlertCircle className="text-destructive" /> سبب الرفض
            </DialogTitle>
            <DialogDescription className="text-right">
              يرجى كتابة سبب رفض العملية ليظهر للبائع في لوحة تحكمه.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="block mb-2 text-right">الملاحظات</Label>
            <Input 
              placeholder="مثلاً: الصورة غير واضحة، المبلغ ناقص..." 
              className="text-right"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button variant="destructive" className="font-bold" onClick={handleReject}>تأكيد الرفض</Button>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
