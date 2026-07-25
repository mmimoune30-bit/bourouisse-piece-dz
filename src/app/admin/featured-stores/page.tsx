
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, Crown, Plus, Search, Calendar, BarChart2, Edit3, Trash2, 
  Settings, Loader2, CheckCircle2, AlertTriangle, Eye, TrendingUp, AlertCircle 
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, where, getDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function FeaturedStoresAdmin() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // States for the controlled form
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [selectedTier, setSelectedTier] = useState<string>("Featured");
  const [selectedPlacement, setSelectedPlacement] = useState<string>("Home");
  const [priority, setPriority] = useState<string>("10");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>("");

  // جلب كافة المتاجر المعتمدة
  const sellersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), where("role", "==", "Seller"), where("status", "==", "Active"));
  }, [firestore]);

  // جلب كافة الحملات الحالية
  const campaignsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "featured_stores");
  }, [firestore]);

  const { data: sellersList, loading: loadingSellers } = useCollection(sellersQuery);
  const { data: campaigns, loading: loadingCampaigns } = useCollection(campaignsQuery);

  const sortedCampaigns = useMemo(() => {
    return [...(campaigns || [])].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }, [campaigns]);

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !selectedStoreId || !startDate || !endDate) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى اختيار المتجر وتحديد المواعيد." });
      return;
    }
    
    setLoading(true);
    try {
      const store = (sellersList || []).find(s => s.id === selectedStoreId);

      if (!store) {
        toast({ variant: "destructive", title: "خطأ", description: "تعذر العثور على بيانات المتجر المختار." });
        setLoading(false);
        return;
      }

      const campaignData = {
        storeId: selectedStoreId,
        storeName: store.name || "متجر غير معروف",
        storeLocation: store.wilaya || "غير محدد",
        storeLogo: store.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${store.name || 'Store'}`,
        tier: selectedTier,
        placement: selectedPlacement,
        priority: Number(priority),
        startDate: startDate,
        endDate: endDate,
        status: "Active",
        stats: { impressions: 0, clicks: 0 },
        createdAt: serverTimestamp()
      };

      await addDoc(collection(firestore, "featured_stores"), campaignData);
      
      toast({ 
        title: "تم التفعيل بنجاح ✅", 
        description: `المتجر "${campaignData.storeName}" متاح الآن كـ ${selectedTier === 'Exclusive' ? 'حصري' : 'مميز'}.` 
      });
      
      // Reset & Close
      setIsAddOpen(false);
      setSelectedStoreId("");
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate("");
      setPriority("10");
    } catch (err: any) {
      console.error("Error adding campaign:", err);
      const permissionError = new FirestorePermissionError({
        path: "featured_stores",
        operation: 'create',
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({ variant: "destructive", title: "خطأ في التفعيل", description: "تأكد من الصلاحيات والاتصال." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("هل تريد إنهاء هذه الحملة الإعلانية وإزالتها؟")) return;
    try {
      await deleteDoc(doc(firestore, "featured_stores", id));
      toast({ title: "تم الحذف", description: "تمت إزالة الحملة بنجاح." });
    } catch (err) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر حذف الحملة." });
    }
  };

  const filtered = sortedCampaigns.filter(c => 
    c.storeName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
             إدارة المتاجر المميزة والحصرية <Crown size={32} className="text-secondary" />
          </h1>
          <p className="text-muted-foreground mt-1">تفعيل ميزات الظهور المدفوع والممول للمتاجر في الصفحة الرئيسية.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="بحث في الحملات الحالية..." 
              className="pr-10 border-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
             <DialogTrigger asChild>
               <Button className="font-black gap-2 h-12 px-8 shadow-xl bg-primary text-white hover:bg-secondary hover:text-primary transition-all">
                  <Plus size={18} /> إضافة متجر للقائمة
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-xl" dir="rtl">
                <form onSubmit={handleAddCampaign}>
                   <DialogHeader>
                      <DialogTitle className="text-right font-black text-xl">تفعيل ميزة "حصري / مميز"</DialogTitle>
                   </DialogHeader>
                   
                   <div className="grid gap-6 py-6 text-right">
                      <div className="space-y-2">
                         <Label className="font-bold">اختر المتجر المعتمد</Label>
                         <Select value={selectedStoreId} onValueChange={setSelectedStoreId} required>
                            <SelectTrigger className="h-14 border-2 bg-white text-right">
                               <SelectValue placeholder={loadingSellers ? "جاري التحميل..." : "اختر المتجر..."} />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                               {sellersList?.length === 0 ? (
                                 <div className="p-4 text-center text-xs text-muted-foreground">لا توجد متاجر معتمدة حالياً</div>
                               ) : sellersList?.map(s => (
                                 <SelectItem key={s.id} value={s.id} className="text-right">
                                   <div className="flex flex-col text-right">
                                      <span className="font-bold">{s.name}</span>
                                      <span className="text-[10px] text-muted-foreground">{s.wilaya} - {s.email}</span>
                                   </div>
                                 </SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label className="font-bold">فئة الإعلان</Label>
                            <Select value={selectedTier} onValueChange={setSelectedTier}>
                               <SelectTrigger className="h-11 border-2"><SelectValue /></SelectTrigger>
                               <SelectContent>
                                  <SelectItem value="Exclusive">👑 متجر حصري (السلايدر العلوي)</SelectItem>
                                  <SelectItem value="Featured">⭐ متجر مميز (الشريط السفلي)</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                         <div className="space-y-2">
                            <Label className="font-bold">ترتيب الظهور (0-100)</Label>
                            <Input value={priority} onChange={(e) => setPriority(e.target.value)} type="number" className="h-11 border-2" />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label className="font-bold">تاريخ البداية</Label>
                            <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="h-11 border-2" required />
                         </div>
                         <div className="space-y-2">
                            <Label className="font-bold">تاريخ الانتهاء</Label>
                            <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" className="h-11 border-2" required />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <Label className="font-bold">مكان الظهور</Label>
                         <Select value={selectedPlacement} onValueChange={setSelectedPlacement}>
                            <SelectTrigger className="h-11 border-2"><SelectValue /></SelectTrigger>
                            <SelectContent>
                               <SelectItem value="Home">الصفحة الرئيسية فقط</SelectItem>
                               <SelectItem value="Search">صفحة البحث فقط</SelectItem>
                               <SelectItem value="Both">الرئيسية والبحث</SelectItem>
                            </SelectContent>
                         </Select>
                      </div>
                   </div>
                   <DialogFooter>
                      <Button type="submit" disabled={loading} className="font-black h-12 px-10 w-full text-lg shadow-lg">
                         {loading ? <Loader2 className="animate-spin" /> : "تفعيل الميزة الآن"}
                      </Button>
                   </DialogFooter>
                </form>
             </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[32px]">
         <CardContent className="p-0">
            <Table>
               <TableHeader className="bg-zinc-50 border-b">
                  <TableRow>
                     <TableHead className="text-right pr-8">المتجر</TableHead>
                     <TableHead className="text-right">الفئة</TableHead>
                     <TableHead className="text-right">الأولوية</TableHead>
                     <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                     <TableHead className="text-right">الحالة</TableHead>
                     <TableHead className="text-left pl-8">إجراءات</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {loadingCampaigns ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 animate-pulse font-bold">جاري تحميل بيانات الحملات...</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-bold italic">لا توجد حملات إعلانية نشطة حالياً.</TableCell></TableRow>
                  ) : (
                    filtered.map((c) => (
                      <TableRow key={c.id} className="hover:bg-zinc-50/50">
                        <TableCell className="pr-8 py-4">
                           <div className="flex flex-col">
                              <span className="font-black text-primary text-base">{c.storeName}</span>
                              <span className="text-[10px] text-muted-foreground">{c.storeLocation}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <Badge variant={c.tier === 'Exclusive' ? 'default' : 'outline'} className={cn(
                             "font-black text-[10px]",
                             c.tier === 'Exclusive' ? 'bg-secondary text-primary' : 'text-blue-600 border-blue-200 bg-blue-50'
                           )}>
                             {c.tier === 'Exclusive' ? '👑 حصري' : '⭐ مميز'}
                           </Badge>
                        </TableCell>
                        <TableCell className="font-mono font-bold">#{c.priority}</TableCell>
                        <TableCell className="text-xs font-bold">{c.endDate}</TableCell>
                        <TableCell>
                           <Badge className={cn(
                             "font-bold text-[10px]",
                             new Date(c.endDate) < new Date() ? "bg-red-500" : "bg-green-600"
                           )}>
                             {new Date(c.endDate) < new Date() ? 'منتهي' : 'نشط'}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-left pl-8">
                           <Button variant="ghost" size="icon" className="text-destructive hover:bg-red-50 rounded-xl" onClick={() => handleDelete(c.id)}>
                             <Trash2 size={18} />
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>

      <div className="bg-primary/5 p-6 rounded-[32px] border-2 border-dashed border-primary/10 flex flex-row-reverse items-start gap-4">
        <AlertCircle className="text-primary shrink-0 mt-1" size={24} />
        <div className="text-right">
          <h4 className="font-black text-primary mb-1">دليل الإعلانات</h4>
          <p className="text-sm text-zinc-600 leading-relaxed font-bold">
            المتاجر **الحصرية** تظهر في السلايدر العلوي الكبير في الصفحة الرئيسية. أما المتاجر **المميزة** فتظهر في شريط تمرير خاص أسفل السلايدر. يتم ترتيب المتاجر بناءً على "الأولوية" تنازلياً.
          </p>
        </div>
      </div>
    </div>
  );
}
