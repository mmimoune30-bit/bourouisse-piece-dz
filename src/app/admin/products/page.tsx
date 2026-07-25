
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Trash2, Edit, Eye, EyeOff, CheckCircle, Search, Filter, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function ProductManagement() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "listings"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: products, loading } = useCollection(productsQuery);

  const handlePreview = (id: string) => {
    window.open(`/products/${id}`, '_blank');
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (!firestore) return;
    const newStatus = currentStatus === 'Active' ? 'Hidden' : 'Active';
    try {
      await updateDoc(doc(firestore, "listings", id), { status: newStatus });
      toast({ title: newStatus === 'Active' ? "تم الإظهار" : "تم الإخفاء", description: "تم تحديث حالة ظهور المنتج في الكتالوج." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر تحديث الحالة." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;
    try {
      await deleteDoc(doc(firestore, "listings", id));
      toast({ variant: "destructive", title: "تم الحذف", description: "تمت إزالة المنتج نهائياً من قاعدة البيانات." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر حذف المنتج." });
    }
  };

  const filtered = products?.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.sellerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <Package size={32} className="text-secondary" /> إدارة محتوى قطع الغيار
          </h1>
          <p className="text-muted-foreground mt-1">مراجعة، إخفاء، أو حذف الإعلانات المنشورة على المنصة.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-zinc-50/50">
          <CardTitle className="text-xl text-right font-black">قائمة كافة المنتجات (Firestore)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right pr-6">اسم المنتج</TableHead>
                <TableHead className="text-right">المتجر</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 animate-pulse font-bold">جاري المزامنة مع قاعدة البيانات...</TableCell></TableRow>
              ) : filtered?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground font-bold">لا توجد منتجات مسجلة حالياً.</TableCell></TableRow>
              ) : (
                filtered?.map((product) => (
                  <TableRow key={product.id} className="group">
                    <TableCell className="pr-6 font-bold text-primary">{product.name}</TableCell>
                    <TableCell className="text-sm font-medium">{product.sellerName}</TableCell>
                    <TableCell className="font-mono text-secondary font-black">{Number(product.price).toLocaleString()} دج</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-bold",
                        product.status === 'Active' ? "bg-green-600" : "bg-zinc-400"
                      )}>
                        {product.status === 'Active' ? 'نشط' : 'مخفي'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left pl-6">
                      <div className="flex items-center gap-2 justify-start">
                        <Button variant="outline" size="sm" className="gap-2 font-bold" onClick={() => handlePreview(product.id)}>
                          <Eye size={14} /> معاينة
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={cn("gap-1 font-bold", product.status === 'Active' ? "text-amber-600 border-amber-200" : "text-green-600 border-green-200")}
                          onClick={() => toggleStatus(product.id, product.status)}
                        >
                          {product.status === 'Active' ? <><EyeOff size={14} /> إخفاء</> : <><CheckCircle size={14} /> إظهار</>}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1 text-destructive border-destructive/20 hover:bg-red-50"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={14} /> حذف
                        </Button>
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
  );
}
