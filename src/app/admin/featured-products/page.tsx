
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
  Zap, Plus, Search, Calendar, Edit3, Trash2, 
  Loader2, CheckCircle2, AlertCircle, Package 
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, where } from "firebase/firestore";
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

export default function FeaturedProductsAdmin() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // States for the controlled form
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [priority, setPriority] = useState<string>("10");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>("");

  // جلب كافة المنتجات النشطة
  const listingsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "listings"), where("status", "==", "Active"));
  }, [firestore]);

  // جلب كافة الحملات الحالية
  const campaignsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "featured_products");
  }, [firestore]);

  const { data: listings, loading: loadingListings } = useCollection(listingsQuery);
  const { data: campaigns, loading: loadingCampaigns } = useCollection(campaignsQuery);

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !selectedProductId || !startDate || !endDate) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى اختيار المنتج وتحديد المواعيد." });
      return;
    }
    
    setLoading(true);
    try {
      const product = (listings || []).find(l => l.id === selectedProductId);

      if (!product) {
        toast({ variant: "destructive", title: "خطأ", description: "تعذر العثور على بيانات المنتج." });
        setLoading(false);
        return;
      }

      const campaignData = {
        productId: selectedProductId,
        productName: product.name,
        productPrice: product.price,
        productImage: product.images?.[0] || "",
        sellerName: product.sellerName,
        priority: Number(priority),
        startDate: startDate,
        endDate: endDate,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(firestore, "featured_products"), campaignData);
      
      toast({ title: "تم التفعيل بنجاح ✅", description: `المنتج "${product.name}" معروض الآن في القائمة المميزة.` });
      setIsAddOpen(false);
      setSelectedProductId("");
    } catch (err) {
      toast({ variant: "destructive", title: "خطأ في التفعيل", description: "فشل الحفظ في قاعدة البيانات." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("هل تريد إزالة هذا المنتج من القائمة المميزة؟")) return;
    try {
      await deleteDoc(doc(firestore, "featured_products", id));
      toast({ title: "تم الحذف", description: "تمت إزالة المنتج بنجاح." });
    } catch (err) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر الحذف." });
    }
  };

  const filtered = campaigns?.filter(c => 
    c.productName?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
             إدارة المنتجات المميزة <Zap size={32} className="text-secondary" />
          </h1>
          <p className="text-muted-foreground mt-1">اختيار أفضل قطع الغيار لعرضها في قسم "المنتجات الموصى بها".</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
             <DialogTrigger asChild>
               <Button className="font-black gap-2 h-12 px-8 shadow-xl bg-primary text-white hover:bg-secondary hover:text-primary transition-all">
                  <Plus size={18} /> إضافة منتج للقائمة
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-xl" dir="rtl">
                <form onSubmit={handleAddCampaign}>
                   <DialogHeader>
                      <DialogTitle className="text-right font-black text-xl">ترويج منتج جديد</DialogTitle>
                   </DialogHeader>
                   
                   <div className="grid gap-6 py-6 text-right">
                      <div className="space-y-2">
                         <Label className="font-bold">اختر المنتج من الكتالوج</Label>
                         <Select value={selectedProductId} onValueChange={setSelectedProductId} required>
                            <SelectTrigger className="h-14 border-2 bg-white text-right">
                               <SelectValue placeholder={loadingListings ? "جاري التحميل..." : "اختر المنتج..."} />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                               {listings?.map(l => (
                                 <SelectItem key={l.id} value={l.id} className="text-right">
                                   <div className="flex flex-col text-right">
                                      <span className="font-bold">{l.name}</span>
                                      <span className="text-[10px] text-muted-foreground">{l.sellerName} - {l.price} دج</span>
                                   </div>
                                 </SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label className="font-bold">ترتيب الظهور (0-100)</Label>
                            <Input value={priority} onChange={(e) => setPriority(e.target.value)} type="number" className="h-11 border-2" />
                         </div>
                         <div className="space-y-2">
                            <Label className="font-bold">تاريخ البداية</Label>
                            <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="h-11 border-2" required />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <Label className="font-bold">تاريخ الانتهاء</Label>
                         <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" className="h-11 border-2" required />
                      </div>
                   </div>
                   <DialogFooter>
                      <Button type="submit" disabled={loading} className="font-black h-12 px-10 w-full text-lg shadow-lg">
                         {loading ? <Loader2 className="animate-spin" /> : "تفعيل الترويج الآن"}
                      </Button>
                   </DialogFooter>
                </form>
             </DialogContent>
          </Dialog>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[24px]">
         <CardContent className="p-0">
            <Table>
               <TableHeader className="bg-zinc-50 border-b">
                  <TableRow>
                     <TableHead className="text-right pr-8 h-14">المنتج</TableHead>
                     <TableHead className="text-right h-14">السعر</TableHead>
                     <TableHead className="text-right h-14">الأولوية</TableHead>
                     <TableHead className="text-right h-14">تاريخ الانتهاء</TableHead>
                     <TableHead className="text-left pl-8 h-14">إجراءات</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {loadingCampaigns ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-20 animate-pulse">جاري التحميل...</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">لا توجد منتجات مميزة نشطة حالياً.</TableCell></TableRow>
                  ) : (
                    filtered.map((c) => (
                      <TableRow key={c.id} className="hover:bg-zinc-50/50 border-b">
                        <TableCell className="pr-8 py-4">
                           <div className="flex flex-col">
                              <span className="font-black text-primary">{c.productName}</span>
                              <span className="text-[10px] text-muted-foreground">{c.sellerName}</span>
                           </div>
                        </TableCell>
                        <TableCell className="font-black text-secondary">{c.productPrice} دج</TableCell>
                        <TableCell className="font-mono font-bold">#{c.priority}</TableCell>
                        <TableCell className="text-xs font-bold">{c.endDate}</TableCell>
                        <TableCell className="text-left pl-8">
                           <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}>
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
    </div>
  );
}
