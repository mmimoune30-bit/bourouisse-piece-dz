
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
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Ticket, 
  Search, 
  RefreshCcw, 
  XCircle, 
  ArrowUpCircle, 
  Filter,
  Calendar,
  PlusCircle,
  Ban,
  CheckCircle,
  Trash2,
  AlertCircle,
  TrendingUp,
  Clock,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// --- Mock Initial Data ---
const INITIAL_SUBSCRIPTIONS = [
  { id: "SUB-001", storeName: "Auto Pièces Chlef", ownerName: "محمد بن أحمد", plan: "Gold", status: "Active", expiry: "2024-12-18", price: 5000 },
  { id: "SUB-002", storeName: "Pièces Renault DZ", ownerName: "أحمد قاسمي", plan: "Professional", status: "Active", expiry: "2025-01-10", price: 12000 },
  { id: "SUB-003", storeName: "Hyundai Parts", ownerName: "سمير عيساوي", plan: "Silver", status: "Expired", expiry: "2024-05-01", price: 3000 },
  { id: "SUB-004", storeName: "Peugeot Center", ownerName: "ياسين م.", plan: "Free", status: "Active", expiry: "N/A", price: 0 },
];

const PLANS = ["Free", "Silver", "Gold", "Professional"];
const STATUSES = ["Active", "Expired", "Suspended", "Cancelled", "Pending"];

export default function SubscriptionsManagement() {
  const [subs, setSubs] = useState(INITIAL_SUBSCRIPTIONS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Simulated Current User (Admin)
  const currentUser = { name: "ميمون محمد", role: "Super Admin" };
  const isSuperAdmin = currentUser.role === "Super Admin";

  // --- Handlers ---
  const handleAddSubscription = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSub = {
      id: `SUB-${Math.floor(Math.random() * 1000)}`,
      storeName: formData.get("storeName") as string,
      ownerName: formData.get("ownerName") as string,
      plan: formData.get("plan") as string,
      status: formData.get("status") as string,
      expiry: formData.get("expiry") as string,
      price: Number(formData.get("price")),
    };
    setSubs([newSub, ...subs]);
    setIsAddDialogOpen(false);
    toast({ title: "تمت الإضافة", description: "تم إنشاء الاشتراك الجديد بنجاح." });
  };

  const handleRenew = (id: string) => {
    setSubs(prev => prev.map(s => {
      if (s.id === id) {
        const currentExpiry = s.expiry === "N/A" ? new Date() : new Date(s.expiry);
        currentExpiry.setMonth(currentExpiry.getMonth() + 1);
        return { ...s, expiry: currentExpiry.toISOString().split('T')[0], status: "Active" };
      }
      return s;
    }));
    toast({ title: "تم التجديد", description: `تم تمديد الاشتراك ${id} لمدة شهر إضافي.` });
  };

  const handleUpgrade = (id: string, newPlan: string) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, plan: newPlan, status: "Active" } : s));
    toast({ title: "تمت الترقية", description: `تمت ترقية الاشتراك إلى خطة ${newPlan}.` });
  };

  const handleToggleStatus = (id: string, newStatus: string) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    toast({ 
      title: "تم تحديث الحالة", 
      description: `تم تغيير حالة الاشتراك إلى ${newStatus}.`,
      variant: newStatus === 'Cancelled' ? 'destructive' : 'default'
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الاشتراك نهائياً؟")) {
      setSubs(prev => prev.filter(s => s.id !== id));
      toast({ title: "تم الحذف", description: "تمت إزالة سجل الاشتراك بنجاح." });
    }
  };

  // --- Filtering & Stats ---
  const filteredSubs = useMemo(() => {
    return subs.filter(s => {
      const matchesSearch = s.storeName.includes(search) || s.ownerName.includes(search) || s.id.includes(search);
      const matchesStatus = filterStatus === "All" || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [subs, search, filterStatus]);

  const stats = useMemo(() => {
    const active = subs.filter(s => s.status === "Active").length;
    const expired = subs.filter(s => s.status === "Expired").length;
    const revenue = subs.reduce((acc, s) => acc + s.price, 0);
    const pending = subs.filter(s => s.status === "Pending").length;
    return { active, expired, revenue, pending };
  }, [subs]);

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">إدارة اشتراكات المتاجر</h1>
          <p className="text-muted-foreground">التحكم الكامل في عضويات المتاجر، التجديدات، والترقيات.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 font-bold bg-secondary text-primary hover:bg-white">
                <PlusCircle size={18} /> إضافة اشتراك يدوياً
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]" dir="rtl">
              <form onSubmit={handleAddSubscription}>
                <DialogHeader>
                  <DialogTitle className="text-right">إضافة اشتراك جديد</DialogTitle>
                  <DialogDescription className="text-right">قم بملء البيانات لربط متجر بخطة اشتراك.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="block text-right">اسم المتجر</Label>
                      <Input name="storeName" required placeholder="مثلاً: Auto Parts" className="text-right" />
                    </div>
                    <div className="space-y-2">
                      <Label className="block text-right">اسم المالك</Label>
                      <Input name="ownerName" required placeholder="الاسم الكامل" className="text-right" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="block text-right">الخطة</Label>
                      <Select name="plan" defaultValue="Silver">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PLANS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="block text-right">الحالة</Label>
                      <Select name="status" defaultValue="Active">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="block text-right">تاريخ الانتهاء</Label>
                      <Input name="expiry" type="date" className="text-right" />
                    </div>
                    <div className="space-y-2">
                      <Label className="block text-right">المبلغ المدفوع (دج)</Label>
                      <Input name="price" type="number" placeholder="0" className="text-right" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:justify-start">
                  <Button type="submit" className="font-bold">حفظ الاشتراك</Button>
                  <DialogClose asChild><Button variant="outline">إلغاء</Button></DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "اشتراكات نشطة", value: stats.active, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "اشتراكات منتهية", value: stats.expired, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "إيرادات تقديرية", value: `${stats.revenue.toLocaleString()} دج`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/5" },
          { label: "طلبات معلقة", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase">{stat.label}</p>
                <h3 className={cn("text-2xl font-black mt-1", stat.color)}>{stat.value}</h3>
              </div>
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث عن متجر، مالك، أو رقم الاشتراك..." 
            className="pr-10 text-right"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Label className="text-xs font-bold whitespace-nowrap">تصفية حسب:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">الكل</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-primary/5 h-10 px-4 flex items-center gap-2">
            <Ticket size={16} /> {filteredSubs.length} اشتراك
          </Badge>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50">
                <TableHead className="text-right pr-6">رقم الاشتراك</TableHead>
                <TableHead className="text-right">المتجر / المالك</TableHead>
                <TableHead className="text-right">الخطة</TableHead>
                <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubs.map((s) => (
                <TableRow key={s.id} className="group">
                  <TableCell className="pr-6 font-mono text-xs">{s.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-right">
                      <span className="font-bold">{s.storeName}</span>
                      <span className="text-[10px] text-muted-foreground">{s.ownerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-black">{s.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end text-xs font-bold">
                      <Calendar size={12} /> {s.expiry}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-bold",
                      s.status === "Active" ? "bg-green-600" : 
                      s.status === "Expired" ? "bg-destructive" : 
                      s.status === "Suspended" ? "bg-amber-600" : "bg-zinc-500"
                    )}>
                      {s.status === 'Active' ? 'نشط' : 
                       s.status === 'Expired' ? 'منتهي' : 
                       s.status === 'Suspended' ? 'معلق' : 'ملغي'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <div className="flex items-center gap-2 justify-start">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2 font-bold">
                            إدارة <ArrowUpCircle size={14} className="rotate-180" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56" dir="rtl">
                          <DropdownMenuLabel className="text-right">خيارات التحكم</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-right justify-end gap-2" onSelect={() => handleRenew(s.id)}>
                            تجديد الاشتراك <RefreshCcw size={14} />
                          </DropdownMenuItem>
                          
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="text-right justify-end gap-2">
                              تغيير الخطة <ArrowUpCircle size={14} />
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-zinc-900 text-white border-zinc-800" dir="rtl">
                              {PLANS.filter(p => p !== s.plan).map(p => (
                                <DropdownMenuItem key={p} className="text-right justify-end" onSelect={() => handleUpgrade(s.id, p)}>
                                  التحويل إلى {p}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator />
                          
                          {s.status === 'Active' ? (
                            <DropdownMenuItem className="text-right justify-end gap-2 text-amber-600" onSelect={() => handleToggleStatus(s.id, 'Suspended')}>
                              تعليق الاشتراك <Ban size={14} />
                            </DropdownMenuItem>
                          ) : s.status === 'Suspended' ? (
                            <DropdownMenuItem className="text-right justify-end gap-2 text-green-600" onSelect={() => handleToggleStatus(s.id, 'Active')}>
                              إعادة تنشيط <CheckCircle size={14} />
                            </DropdownMenuItem>
                          ) : null}

                          <DropdownMenuItem className="text-right justify-end gap-2 text-destructive font-bold" onSelect={() => handleToggleStatus(s.id, 'Cancelled')}>
                            إلغاء نهائي <XCircle size={14} />
                          </DropdownMenuItem>

                          {isSuperAdmin && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-right justify-end gap-2 text-destructive bg-destructive/5" onSelect={() => handleDelete(s.id)}>
                                حذف السجل <Trash2 size={14} />
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button variant="ghost" size="icon" className="text-muted-foreground" title="سجل العمليات">
                        <History size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Expiration Checker Alert */}
      <div className="bg-zinc-900 p-6 rounded-3xl text-white flex flex-row-reverse items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 text-right">
          <h3 className="text-xl font-black mb-1 flex items-center justify-end gap-2 text-secondary">
            نظام التفتيش التلقائي <Clock className="animate-pulse" />
          </h3>
          <p className="text-sm text-zinc-400">يقوم النظام تلقائياً بتغيير حالة الاشتراكات المنتهية كل 24 ساعة وإشعار المتاجر.</p>
        </div>
        <Button variant="secondary" className="relative z-10 font-black gap-2">
          تشغيل فحص يدوي الآن <RefreshCcw size={16} />
        </Button>
        <TrendingUp className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5" />
      </div>
    </div>
  );
}

// --- Specialized Internal Components ---

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
