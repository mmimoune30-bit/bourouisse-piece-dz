
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Settings, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Layers,
  Clock,
  Package
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const INITIAL_PLANS = [
  { id: "P1", name: "Free", price: "0", duration: "Lifetime", limit: "5", active: true },
  { id: "P2", name: "Silver", price: "3000", duration: "30 Days", limit: "50", active: true },
  { id: "P3", name: "Gold", price: "5000", duration: "30 Days", limit: "Unlimted", active: true },
  { id: "P4", name: "Professional", price: "12000", duration: "90 Days", limit: "Unlimted", active: false },
];

export default function PlansManagement() {
  const [plans, setPlans] = useState(INITIAL_PLANS);

  const toggleStatus = (id: string) => {
    setPlans(prev => prev.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
    toast({
      title: "تم تحديث الخطة",
      description: "تم تغيير حالة ظهور الخطة للبائعين.",
    });
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">إدارة خطط الأسعار</h1>
          <p className="text-muted-foreground">تعديل أسعار العضويات ومميزات كل خطة.</p>
        </div>
        <Button className="font-bold gap-2">
          <Plus size={18} /> إنشاء خطة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map(p => (
          <Card key={p.id} className="p-4 border-none shadow-sm flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-primary">
              <Layers size={20} />
            </div>
            <h4 className="font-black text-primary">{p.name}</h4>
            <p className="text-2xl font-black text-secondary">{p.price} دج</p>
            <Badge variant={p.active ? "default" : "secondary"}>{p.active ? "نشطة" : "معطلة"}</Badge>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg flex items-center gap-2 justify-end">
            <Settings size={20} /> تفاصيل الخطط
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50">
                <TableHead className="text-right pr-6">اسم الخطة</TableHead>
                <TableHead className="text-right">السعر (دج)</TableHead>
                <TableHead className="text-right">المدة</TableHead>
                <TableHead className="text-right">حد المنتجات</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pr-6 font-black text-primary">{p.name}</TableCell>
                  <TableCell className="font-bold">{p.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end text-xs">
                      <Clock size={12} /> {p.duration}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end text-xs">
                      <Package size={12} /> {p.limit} منتج
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={p.active} 
                      onCheckedChange={() => toggleStatus(p.id)} 
                    />
                  </TableCell>
                  <TableCell className="text-left pl-6 space-x-2 space-x-reverse">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit3 size={14} /> تعديل
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-destructive">
                      <Trash2 size={14} /> حذف
                    </Button>
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
