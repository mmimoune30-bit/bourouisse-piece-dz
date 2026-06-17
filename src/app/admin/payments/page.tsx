
"use client";

import React, { useState, useMemo, useRef } from "react";
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
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

// --- Mock Data for Demo ---
const INITIAL_PAYMENTS = [
  { 
    id: "PAY-101", 
    refNumber: "REF-998231",
    userName: "كريم بوعلام", 
    storeName: "Auto Pièces Chlef",
    location: "ولاية الشلف، بلدية الشلف",
    phone: "0555111111",
    amount: 5000, 
    type: "اشتراك ذهبي", 
    method: "CCP", 
    status: "Approved", 
    date: "2024-05-18",
    time: "14:30",
    receiptUrl: "https://picsum.photos/seed/receipt1/400/600",
    planDates: { start: "2024-05-18", end: "2024-06-18" },
    reviewedBy: "ميمون محمد",
    reviewDate: "2024-05-18 15:00",
    notes: "تم التأكد من الرصيد في حساب CCP."
  },
  { 
    id: "PAY-102", 
    refNumber: "REF-998232",
    userName: "أحمد قاسمي", 
    storeName: "Pièces Renault DZ",
    location: "الجزائر، باب الزوار",
    phone: "0555222222",
    amount: 12000, 
    type: "ترقية احترافية", 
    method: "Baridimob", 
    status: "Pending", 
    date: "2024-05-17",
    time: "09:15",
    receiptUrl: "https://picsum.photos/seed/receipt2/400/600",
    planDates: { start: "2024-05-17", end: "2025-05-17" },
    notes: ""
  },
  { 
    id: "PAY-103", 
    refNumber: "REF-998233",
    userName: "سمير عيساوي", 
    storeName: "Hyundai Parts",
    location: "ولاية وهران",
    phone: "0555333333",
    amount: 8000, 
    type: "إعلان ممول", 
    method: "CIB", 
    status: "Rejected", 
    date: "2024-05-16",
    time: "21:45",
    receiptUrl: "https://picsum.photos/seed/receipt3/400/600",
    planDates: { start: "-", end: "-" },
    rejectedBy: "ميمون محمد",
    notes: "الصورة غير واضحة"
  },
];

export default function PaymentManagement() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

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
      p.id === id ? { ...p, status: "Approved", reviewDate: new Date().toLocaleString(), reviewedBy: currentUser.name } : p
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

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">الإدارة المالية والمدفوعات</h1>
          <p className="text-muted-foreground">تتبع، توثيق، والموافقة على التحويلات المالية في المنصة.</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Link href="/admin/payments/create">
            <Button className="gap-2 font-bold bg-secondary text-primary hover:bg-white">
              <PlusCircle size={18} /> إنشاء عملية دفع
            </Button>
          </Link>
          <Button variant="outline" className="gap-2 font-bold">
            <FileDown size={18} /> تصدير Excel
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
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

      <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl border shadow-sm print:hidden">
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

      <Card className="border-none shadow-sm print:hidden">
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
                  <TableCell className="text-left pl-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedPayment(p)}>
                          <Receipt size={14} /> تفاصيل الوصل
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                        <div ref={printRef} className="space-y-6 p-4">
                          <div className="flex justify-between items-start border-b-2 border-primary pb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary p-2 rounded-xl text-white">
                                <Settings size={32} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-2xl text-primary tracking-tighter">BOUROUISSE PIECE-DZ</span>
                                <span className="text-xs font-bold text-muted-foreground">بوابة الإدارة المالية - وصل رقم: {selectedPayment?.id}</span>
                              </div>
                            </div>
                            <div className="text-left">
                              <Badge className={cn(
                                "text-lg px-4 py-1",
                                selectedPayment?.status === "Approved" ? "bg-green-600" : 
                                selectedPayment?.status === "Pending" ? "bg-amber-500" : "bg-destructive"
                              )}>
                                {selectedPayment?.status === 'Approved' ? 'عملية مقبولة' : selectedPayment?.status === 'Pending' ? 'قيد المراجعة' : 'عملية مرفوضة'}
                              </Badge>
                              <p className="text-[10px] text-muted-foreground mt-2">{new Date().toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Col: Info */}
                            <div className="space-y-6">
                              <section className="space-y-3">
                                <h3 className="font-black text-primary border-r-4 border-secondary pr-3 flex items-center gap-2">
                                  <ShieldCheck size={18} /> بيانات العملية الأساسية
                                </h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm bg-zinc-50 p-4 rounded-xl border">
                                  <span className="text-muted-foreground">رقم العملية:</span>
                                  <span className="font-mono font-bold text-left">{selectedPayment?.id}</span>
                                  <span className="text-muted-foreground">رقم المرجع:</span>
                                  <span className="font-mono font-bold text-left">{selectedPayment?.refNumber}</span>
                                  <span className="text-muted-foreground">تاريخ الدفع:</span>
                                  <span className="font-bold text-left">{selectedPayment?.date}</span>
                                  <span className="text-muted-foreground">وقت الدفع:</span>
                                  <span className="font-bold text-left">{selectedPayment?.time}</span>
                                  <span className="text-muted-foreground">وسيلة الدفع:</span>
                                  <span className="font-black text-primary text-left">{selectedPayment?.method}</span>
                                </div>
                              </section>

                              <section className="space-y-3">
                                <h3 className="font-black text-primary border-r-4 border-secondary pr-3 flex items-center gap-2">
                                  <User size={18} /> بيانات البائع
                                </h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm bg-zinc-50 p-4 rounded-xl border">
                                  <span className="text-muted-foreground">اسم المتجر:</span>
                                  <span className="font-bold text-left">{selectedPayment?.storeName}</span>
                                  <span className="text-muted-foreground">المالك:</span>
                                  <span className="font-bold text-left">{selectedPayment?.userName}</span>
                                  <span className="text-muted-foreground">رقم الهاتف:</span>
                                  <span className="font-bold text-left" dir="ltr">{selectedPayment?.phone}</span>
                                  <span className="text-muted-foreground">الموقع:</span>
                                  <span className="font-bold text-left">{selectedPayment?.location}</span>
                                </div>
                              </section>

                              <section className="space-y-3">
                                <h3 className="font-black text-primary border-r-4 border-secondary pr-3 flex items-center gap-2">
                                  <CreditCard size={18} /> بيانات الاشتراك
                                </h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm bg-primary/5 p-4 rounded-xl border border-primary/10">
                                  <span className="text-muted-foreground">نوع الاشتراك:</span>
                                  <span className="font-black text-primary text-left">{selectedPayment?.type}</span>
                                  <span className="text-muted-foreground">تاريخ البدء:</span>
                                  <span className="font-bold text-left">{selectedPayment?.planDates?.start}</span>
                                  <span className="text-muted-foreground">تاريخ الانتهاء:</span>
                                  <span className="font-bold text-left">{selectedPayment?.planDates?.end}</span>
                                  <div className="col-span-2 border-t mt-2 pt-2 flex justify-between items-center">
                                    <span className="font-black text-lg">المبلغ المدفوع:</span>
                                    <span className="font-black text-2xl text-green-600">{selectedPayment?.amount.toLocaleString()} دج</span>
                                  </div>
                                </div>
                              </section>

                              {selectedPayment?.reviewedBy && (
                                <section className="space-y-2 bg-amber-50 p-4 rounded-xl border border-amber-200">
                                  <p className="text-xs font-black text-amber-800">المراجعة المالية:</p>
                                  <p className="text-sm">بواسطة: <b>{selectedPayment.reviewedBy}</b></p>
                                  <p className="text-[10px] text-amber-600">التاريخ: {selectedPayment.reviewDate}</p>
                                  {selectedPayment.notes && <p className="text-xs mt-2 italic">" {selectedPayment.notes} "</p>}
                                </section>
                              )}
                            </div>

                            {/* Right Col: Receipt Image */}
                            <div className="space-y-4">
                              <h3 className="font-black text-primary flex items-center gap-2 justify-end">
                                <Maximize2 size={18} /> صورة الوصل المرفوعة
                              </h3>
                              <div className="relative aspect-[3/4] w-full bg-zinc-100 rounded-3xl overflow-hidden border-4 border-dashed border-zinc-200 group">
                                {selectedPayment?.receiptUrl && (
                                  <Image src={selectedPayment.receiptUrl} alt="Receipt" fill className="object-contain hover:scale-110 transition-transform cursor-zoom-in" />
                                )}
                              </div>
                              <div className="flex gap-2 print:hidden">
                                <Button variant="outline" className="flex-1 gap-2" asChild>
                                  <a href={selectedPayment?.receiptUrl} target="_blank" download={`receipt-${selectedPayment?.id}.jpg`}>
                                    <Download size={16} /> تحميل الصورة
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <DialogFooter className="print:hidden border-t pt-4 gap-2 flex flex-wrap sm:justify-between items-center w-full">
                          <div className="flex gap-2">
                            <Button variant="outline" className="gap-2" onClick={handlePrint}>
                              <Printer size={16} /> طباعة الوصل
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <Download size={16} /> تصدير PDF
                            </Button>
                          </div>
                          
                          <div className="flex gap-2">
                            {canManagePayments && selectedPayment?.status === 'Pending' && (
                              <>
                                <Button 
                                  className="bg-green-600 hover:bg-green-700 gap-2 font-black"
                                  onClick={() => handleApprove(selectedPayment.id)}
                                >
                                  <CheckCircle2 size={18} /> قبول العملية
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  className="gap-2 font-black"
                                  onClick={() => {
                                    setIsRejectDialogOpen(true);
                                  }}
                                >
                                  <Ban size={18} /> رفض العملية
                                </Button>
                              </>
                            )}
                            <DialogClose asChild>
                               <Button variant="secondary">إغلاق</Button>
                            </DialogClose>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
            <Button variant="destructive" className="font-black" onClick={handleReject}>تأكيد الرفض</Button>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DialogClose({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) {
  return (
    <DialogTrigger asChild={asChild}>
      {children}
    </DialogTrigger>
  );
}
