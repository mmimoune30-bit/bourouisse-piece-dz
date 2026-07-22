
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Trash2, Edit, Eye, EyeOff, CheckCircle, Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const INITIAL_PRODUCTS = [
  { id: "p1", name: "مصباح أمامي أيمن Clio 4", price: "8500 DZD", store: "Auto Pièces Chlef", status: "Active" },
  { id: "p2", name: "رادياتور Peugeot 208", price: "12000 DZD", store: "Pièces Renault DZ", status: "Active" },
  { id: "p3", name: "محرك كامل 1.5 dCi", price: "450000 DZD", store: "Bourouisse Parts", status: "Hidden" },
];

export default function ProductManagement() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const handlePreview = (id: string) => {
    window.open(`/products/${id}`, '_blank');
  };

  const toggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'Active' ? 'Hidden' : 'Active';
        toast({ title: newStatus === 'Active' ? "تم الإظهار" : "تم الإخفاء", description: "تم تحديث حالة ظهور المنتج في الكتالوج." });
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟ لا يمكن التراجع عن هذا الإجراء.")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ variant: "destructive", title: "تم الحذف", description: "تمت إزالة المنتج نهائياً من قاعدة البيانات." });
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <Package size={32} className="text-secondary" /> إدارة محتوى قطع الغيار
          </h1>
          <p className="text-muted-foreground mt-1">مراجعة، إخفاء، أو حذف الإعلانات المنشورة على المنصة.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 font-bold"><Filter size={18} /> تصفية</Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-zinc-50/50">
          <CardTitle className="text-xl text-right font-black">قائمة كافة المنتجات</CardTitle>
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
              {products.map((product) => (
                <TableRow key={product.id} className="group">
                  <TableCell className="pr-6 font-bold text-primary">{product.name}</TableCell>
                  <TableCell className="text-sm font-medium">{product.store}</TableCell>
                  <TableCell className="font-mono text-secondary font-black">{product.price}</TableCell>
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
                        onClick={() => toggleStatus(product.id)}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
