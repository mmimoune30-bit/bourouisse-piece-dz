
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Plus, 
  Settings, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Layers,
  Clock,
  Package,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const INITIAL_PLANS = [
  { id: "P1", name: "Free", price: 0, duration: "Lifetime", limit: "5", active: true },
  { id: "P2", name: "Silver", price: 3000, duration: "30 Days", limit: "50", active: true },
  { id: "P3", name: "Gold", price: 5000, duration: "30 Days", limit: "Unlimited", active: true },
  { id: "P4", name: "Professional", price: 12000, duration: "90 Days", limit: "Unlimited", active: false },
];

export default function PlansManagement() {
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  // --- Handlers ---
  const toggleStatus = (id: string) => {
    setPlans(prev => prev.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
    const plan = plans.find(p => p.id === id);
    toast({
      title: plan?.active ? "تم تعطيل الخطة" : "تم تنشيط الخطة",
      description: `تم تغيير حالة ظهور خطة ${plan?.name} للبائعين.`,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الخطة نهائياً؟ قد يؤثر ذلك على الاشتراكات المرتبطة بها.")) {
      setPlans(prev => prev.filter(p => p.id !== id));
      toast({
        variant: "destructive",
        title: "تم حذف الخطة",
        description: "تمت إزالة بيانات الخطة من النظام.",
      });
    }
  };

  const handleSavePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const planData = {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      duration: formData.get("duration") as string,
      limit: formData.get("limit") as string,
      active: true,
    };

    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, ...planData } : p));
      toast({ title: "تم التحديث", description: "تم تعديل بيانات الخطة بنجاح." });
    } else {
      const newPlan = { ...planData, id: `P${Math.floor(Math.random() * 1000)}` };
      setPlans([newPlan, ...plans]);
      toast({ title: "تمت الإضافة", description: "تم إنشاء خطة أسعار جديدة." });
    }

    setIsDialogOpen(false);
    setEditingPlan(null);
  };

  const openEditDialog = (plan: any) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">إدارة خطط الأسعار</h1>
          <p className="text-muted-foreground">تعديل أسعار العضويات ومميزات كل خطة تظهر للبائعين.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingPlan(null); }}>
          <DialogTrigger asChild>
            <Button className="font-bold gap-2 bg-secondary text-primary hover:bg-white shadow-lg">
              <Plus size={18} /> إنشاء خطة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]" dir="rtl">
            <form onSubmit={handleSavePlan}>
              <DialogHeader>
                <DialogTitle className="text-right">
                  {editingPlan ? "تعديل خطة الأسعار" : "إضافة خطة أسعار جديدة"}
                </DialogTitle>
                <DialogDescription className="text-right">
                  أدخل تفاصيل الخطة والمميزات التي سيحصل عليها البائع.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label className="text-right">اسم الخطة</Label>
                  <Input name="name" defaultValue={editingPlan?.name} required placeholder="مثلاً: الباقة الفضية" className="text-right" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-right">السعر (دج)</Label>
                    <Input name="price" type="number" defaultValue={editingPlan?.price} required placeholder="0" className="text-right" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-right">المدة</Label>
                    <Input name="duration" defaultValue={editingPlan?.duration} required placeholder="مثلاً: 30 يوم" className="text-right" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-right">حد المنتجات</Label>
                  <Input name="limit" defaultValue={editingPlan?.limit} required placeholder="مثلاً: 50 أو Unlimited" className="text-right" />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:justify-start">
                <Button type="submit" className="font-bold">
                  {editingPlan ? "حفظ التعديلات" : "إنشاء الخطة"}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">إلغاء</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map(p => (
          <Card key={p.id} className={cn(
            "p-4 border-none shadow-sm flex flex-col items-center text-center gap-2 transition-all hover:shadow-md",
            p.active ? "bg-white" : "bg-zinc-50 opacity-60"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              p.active ? "bg-secondary/20 text-primary" : "bg-zinc-200 text-zinc-400"
            )}>
              <Layers size={20} />
            </div>
            <h4 className="font-black text-primary">{p.name}</h4>
            <p className="text-2xl font-black text-secondary">{p.price.toLocaleString()} دج</p>
            <Badge variant={p.active ? "default" : "secondary"}>{p.active ? "نشطة" : "معطلة"}</Badge>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg flex items-center gap-2 justify-end">
            <Settings size={20} className="text-secondary" /> تفاصيل وتعديل الخطط
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
              {plans.length > 0 ? (
                plans.map((p) => (
                  <TableRow key={p.id} className="group">
                    <TableCell className="pr-6 font-black text-primary">{p.name}</TableCell>
                    <TableCell className="font-bold text-green-600">{p.price.toLocaleString()} دج</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end text-xs font-bold text-muted-foreground">
                        <Clock size={12} /> {p.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end text-xs font-black text-primary">
                        <Package size={12} /> {p.limit === 'Unlimited' ? 'غير محدود' : `${p.limit} منتج`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground">{p.active ? "نشطة" : "معطلة"}</span>
                        <Switch 
                          checked={p.active} 
                          onCheckedChange={() => toggleStatus(p.id)} 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-left pl-6 space-x-2 space-x-reverse">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 hover:bg-primary hover:text-white transition-all"
                        onClick={() => openEditDialog(p)}
                      >
                        <Edit3 size={14} /> تعديل
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 text-destructive border-destructive/20 hover:bg-destructive hover:text-white transition-all"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 size={14} /> حذف
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={40} className="opacity-20" />
                      <p>لا توجد خطط أسعار مسجلة حالياً</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Helper Alert */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex flex-row-reverse items-start gap-4">
        <AlertCircle className="text-amber-600 shrink-0 mt-1" size={24} />
        <div className="text-right">
          <h4 className="font-black text-amber-900 mb-1">ملاحظة للمدير</h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            عند تعديل سعر خطة معينة، لن يتأثر المشتركون الحاليون إلا عند قيامهم بالتجديد القادم. خطة "Free" يجب أن تظل مفعلة دائماً كخيار افتراضي للمتاجر الجديدة.
          </p>
        </div>
      </div>
    </div>
  );
}
