
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Trash2, Edit, CheckCircle, Eye, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PRODUCTS = [
  { id: "p1", name: "مصباح أمامي أيمن Clio 4", price: "8500 DZD", store: "Auto Pièces Chlef", status: "Active" },
  { id: "p2", name: "رادياتور Peugeot 208", price: "12000 DZD", store: "Pièces Renault DZ", status: "Active" },
];

export default function ProductManagement() {
  const handlePreview = (id: string) => {
    window.open(`/products/${id}`, '_blank');
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
          <Package size={32} className="text-secondary" /> إدارة محتوى قطع الغيار
        </h1>
        <p className="text-muted-foreground mt-1">مراجعة وتعديل كافة الإعلانات المنشورة على المنصة.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-right">قائمة المنتجات الحية</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50">
              <TableRow>
                <TableHead className="text-right pr-6">اسم المنتج</TableHead>
                <TableHead className="text-right">المتجر</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRODUCTS.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="pr-6 font-bold">{product.name}</TableCell>
                  <TableCell>{product.store}</TableCell>
                  <TableCell className="font-mono text-secondary font-black">{product.price}</TableCell>
                  <TableCell className="text-left pl-6">
                    <div className="flex items-center gap-2 justify-start">
                      <Button variant="outline" size="sm" className="gap-2 font-bold" onClick={() => handlePreview(product.id)}>
                        <Eye size={14} /> معاينة
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1"><Edit size={14} /> تعديل</Button>
                      <Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-red-50"><Trash2 size={14} /> حذف</Button>
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
