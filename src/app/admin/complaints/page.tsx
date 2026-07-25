
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Search, 
  Trash2, 
  Calendar,
  AlertCircle,
  MoreVertical,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";

const STATUS_LABELS: Record<string, string> = {
  "New": "جديد",
  "Under Review": "قيد المراجعة",
  "Resolved": "تم الحل",
  "Closed": "مغلقة",
};

export default function ComplaintsManagement() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");

  const complaintsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "complaints"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: complaints, loading } = useCollection(complaintsQuery);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!firestore) return;
    try {
      await updateDoc(doc(firestore, "complaints", id), { status: newStatus });
      toast({ title: "تم التحديث", description: "تم تغيير حالة البلاغ." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل التحديث." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("حذف البلاغ نهائياً؟")) return;
    try {
      await deleteDoc(doc(firestore, "complaints", id));
      toast({ title: "تم الحذف", description: "تمت إزالة البلاغ." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل الحذف." });
    }
  };

  const filtered = complaints?.filter(c => 
    c.user?.toLowerCase().includes(search.toLowerCase()) || 
    c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <ShieldAlert size={32} className="text-secondary" /> مركز إدارة الشكاوى (Live)
          </h1>
          <p className="text-muted-foreground mt-1">متابعة البلاغات والنزاعات الحقيقية فقط من Firestore.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <Search className="text-muted-foreground" size={18} />
        <Input 
          placeholder="بحث في البلاغات..." 
          className="text-right border-none shadow-none focus-visible:ring-0" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50">
              <TableHead className="text-right pr-6">رقم البلاغ</TableHead>
              <TableHead className="text-right">المرسل</TableHead>
              <TableHead className="text-right">الموضوع</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-left pl-6">الإجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 animate-pulse font-bold">جاري تحميل البلاغات...</TableCell></TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-32 text-muted-foreground font-bold">لا توجد شكاوى مسجلة في النظام.</TableCell></TableRow>
            ) : (
              filtered?.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="pr-6 font-mono text-xs">{c.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-bold">{c.user || "مستخدم"}</TableCell>
                  <TableCell>{c.subject}</TableCell>
                  <TableCell>
                    <Badge className={cn("font-bold", c.status === 'Resolved' ? 'bg-green-600' : 'bg-red-500')}>
                      {STATUS_LABELS[c.status] || c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}><Trash2 size={18} /></Button>
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
