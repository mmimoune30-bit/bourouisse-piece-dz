
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Ticket, Search, CheckCircle2, XCircle, Clock, Eye, 
  ExternalLink, Filter, Download, User, CreditCard, ShieldCheck
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, updateDoc, doc, getDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SubscriptionRequestsAdmin() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data: requests, loading } = useCollection(
    query(collection(firestore!, "subscription_requests"), orderBy("createdAt", "desc"))
  );

  const handleApprove = async (request: any) => {
    if (!firestore) return;
    try {
      // 1. تحديث حالة الطلب
      await updateDoc(doc(firestore, "subscription_requests", request.id), { status: "Approved" });

      // 2. تحديث باقة المستخدم
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // افتراض 30 يوم

      await updateDoc(doc(firestore, "users", request.sellerId), {
        "subscription.plan": request.planName,
        "subscription.startDate": new Date().toISOString(),
        "subscription.endDate": expiryDate.toISOString(),
        "subscription.status": "Active"
      });

      // 3. إرسال إشعار
      await addDoc(collection(firestore, "notifications"), {
        userId: request.sellerId,
        title: "تم تفعيل الاشتراك",
        message: `مرحباً ${request.sellerName}، تم قبول طلبك وتفعيل باقة ${request.planName} بنجاح.`,
        type: "success",
        read: false,
        createdAt: serverTimestamp()
      });

      toast({ title: "تم التفعيل", description: "تم تحديث اشتراك البائع وإرسال إشعار له." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "حدث خطأ أثناء التفعيل." });
    }
  };

  const filtered = requests?.filter(r => 
    r.sellerName.toLowerCase().includes(search.toLowerCase()) || 
    r.planName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
          <Ticket size={32} className="text-secondary" /> طلبات تفعيل الاشتراكات
        </h1>
        <p className="text-muted-foreground mt-1">مراجعة المدفوعات اليدوية وتنشيط باقات المتاجر.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث باسم البائع أو الباقة..." 
            className="pr-10 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 h-10 px-4 font-black">
            {filtered?.filter(r => r.status === 'Pending').length} طلب معلق
          </Badge>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="text-right pr-6">البائع</TableHead>
              <TableHead className="text-right">الباقة المطلوبة</TableHead>
              <TableHead className="text-right">المبلغ / المرجع</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">تاريخ الطلب</TableHead>
              <TableHead className="text-left pl-6">الإجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 animate-pulse">جاري جلب البيانات...</TableCell></TableRow>
            ) : filtered?.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="pr-6">
                  <div className="flex flex-col">
                    <span className="font-bold">{req.sellerName}</span>
                    <span className="text-[10px] text-muted-foreground">{req.sellerId}</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary" className="font-black">{req.planName}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-black text-green-600">{req.amount} دج</span>
                    <span className="text-[10px] font-mono text-zinc-400">{req.refNumber || "N/A"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    "font-bold",
                    req.status === 'Pending' ? "bg-amber-500" : req.status === 'Approved' ? "bg-green-600" : "bg-red-600"
                  )}>
                    {req.status === 'Pending' ? 'قيد المراجعة' : req.status === 'Approved' ? 'تم التنشيط' : 'مرفوض'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{req.createdAt?.toDate().toLocaleString('ar-DZ')}</TableCell>
                <TableCell className="text-left pl-6">
                  <div className="flex gap-2">
                    <Dialog>
                       <DialogTrigger asChild>
                         <Button variant="outline" size="sm" onClick={() => setSelectedRequest(req)}><Eye size={14} /></Button>
                       </DialogTrigger>
                       <DialogContent className="max-w-2xl text-right" dir="rtl">
                          <DialogHeader><DialogTitle className="text-right">تفاصيل طلب الاشتراك</DialogTitle></DialogHeader>
                          <div className="grid grid-cols-2 gap-6 py-4">
                             <div className="space-y-4">
                                <div><p className="text-xs text-muted-foreground">البائع:</p><p className="font-bold">{selectedRequest?.sellerName}</p></div>
                                <div><p className="text-xs text-muted-foreground">الباقة:</p><p className="font-black text-primary">{selectedRequest?.planName}</p></div>
                                <div><p className="text-xs text-muted-foreground">المرجع:</p><p className="font-mono">{selectedRequest?.refNumber}</p></div>
                             </div>
                             <div className="border rounded-xl p-2 bg-zinc-50 flex items-center justify-center">
                                <div className="text-center space-y-2">
                                   <ImagePlus size={32} className="mx-auto opacity-20" />
                                   <p className="text-[10px] font-bold">صورة الوصل (قيد التطوير)</p>
                                </div>
                             </div>
                          </div>
                          {selectedRequest?.status === 'Pending' && (
                            <DialogFooter className="gap-2">
                               <Button className="bg-green-600 hover:bg-green-700 font-black h-12" onClick={() => handleApprove(selectedRequest)}>قبول وتفعيل الباقة</Button>
                               <Button variant="destructive" className="font-black h-12" onClick={() => toast({ title: "تم الرفض" })}>رفض الطلب</Button>
                            </DialogFooter>
                          )}
                       </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

import { addDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";
