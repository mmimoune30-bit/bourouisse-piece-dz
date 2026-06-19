
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, MoreVertical, ShieldCheck, Mail, Phone, 
  UserPlus, UserCog, Ban, Key, Trash2, Calendar, Settings, CheckCircle2, Edit3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const INITIAL_EMPLOYEES = [
  { id: "E001", name: "ميمون محمد", email: "maymoun@bourouisse.com", phone: "0555111111", role: "SuperAdmin", status: "Active", dateCreated: "2024-01-15" },
  { id: "E002", name: "أحمد بن علي", email: "ahmed@bourouisse.com", phone: "0555222222", role: "Manager", status: "Active", dateCreated: "2024-02-10" },
  { id: "E003", name: "سميرة بوحفص", email: "samira@bourouisse.com", phone: "0555333333", role: "FinancialOfficer", status: "Active", dateCreated: "2024-03-05" },
  { id: "E004", name: "كريم قادري", email: "karim@bourouisse.com", phone: "0555444444", role: "CustomerService", status: "Inactive", dateCreated: "2024-04-20" },
];

export default function EmployeeManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fix Hydration: Only render content after mount
  useEffect(() => {
    setEmployees(INITIAL_EMPLOYEES);
    setMounted(true);
  }, []);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: newStatus } : emp));
    toast({
      title: "تحديث الحالة",
      description: `تم تغيير حالة الموظف إلى ${newStatus === 'Active' ? 'نشط' : 'غير نشط'}`
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الموظف نهائياً؟")) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      toast({
        variant: "destructive",
        title: "حذف موظف",
        description: "تمت إزالة بيانات الموظف من النظام بنجاح."
      });
    }
  };

  const handleAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: "تم الحفظ", description: "جاري إنشاء الحساب الإداري..." });
    setIsAddDialogOpen(false);
  };

  const handleUpdateEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: "تم التحديث", description: "تم تعديل بيانات الموظف بنجاح." });
    setIsEditDialogOpen(false);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) || 
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center font-black text-primary animate-pulse">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <UserCog size={32} className="text-secondary" /> إدارة طاقم العمل والصلاحيات
          </h1>
          <p className="text-muted-foreground mt-1">إضافة موظفين، تعيين الأدوار، ومراقبة الصلاحيات الإدارية.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold gap-2 h-12 px-8 bg-primary shadow-xl">
              <UserPlus size={18} /> إضافة موظف جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <form onSubmit={handleAddEmployee}>
              <DialogHeader>
                <DialogTitle className="text-right font-black text-xl flex items-center gap-2 justify-end">
                  <ShieldCheck className="text-secondary" /> إنشاء حساب إداري
                </DialogTitle>
                <DialogDescription className="text-right">أدخل بيانات الموظف واختر الدور الوظيفي المناسب.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label>الاسم الكامل</Label>
                  <Input placeholder="الاسم واللقب" className="h-11" required />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني المهني</Label>
                  <Input type="email" placeholder="name@bourouisse.com" className="h-11" required />
                </div>
                <div className="space-y-2">
                  <Label>الدور الوظيفي</Label>
                  <Select defaultValue="CustomerService">
                    <SelectTrigger className="h-11"><SelectValue placeholder="اختر الدور" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SuperAdmin">Super Admin (كامل الصلاحيات)</SelectItem>
                      <SelectItem value="Manager">Manager (إدارة المحتوى)</SelectItem>
                      <SelectItem value="FinancialOfficer">Financial Officer (الإدارة المالية)</SelectItem>
                      <SelectItem value="CustomerService">Customer Service (خدمة العملاء)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:justify-start">
                <Button type="submit" className="font-bold">حفظ وتفعيل الحساب</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث بالاسم أو البريد الإلكتروني..." 
            className="pr-10 text-right h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50">
              <TableRow>
                <TableHead className="text-right pr-6">الموظف</TableHead>
                <TableHead className="text-right">بيانات الاتصال</TableHead>
                <TableHead className="text-right">الدور الوظيفي</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id} className="group">
                  <TableCell className="pr-6">
                    <div className="flex items-center gap-3 justify-end">
                      <div className="flex flex-col text-right">
                        <span className="font-black text-primary">{emp.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{emp.id}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center font-black text-primary border border-secondary/20">
                        {emp.name.charAt(0)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-right text-xs gap-1">
                      <span className="flex items-center gap-2 justify-end">{emp.email} <Mail size={12} className="text-muted-foreground" /></span>
                      <span className="flex items-center gap-2 justify-end" dir="ltr"><Phone size={12} className="text-muted-foreground" /> {emp.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "font-black text-[10px] uppercase",
                      emp.role === 'SuperAdmin' ? "text-red-600 border-red-200 bg-red-50" :
                      emp.role === 'FinancialOfficer' ? "text-blue-600 border-blue-200 bg-blue-50" :
                      "text-zinc-600 border-zinc-200"
                    )}>
                      {emp.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-bold",
                      emp.status === "Active" ? "bg-green-600" : "bg-zinc-400"
                    )}>
                      {emp.status === "Active" ? "نشط" : "غير نشط"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end text-xs text-muted-foreground">
                      <Calendar size={12} /> {emp.dateCreated}
                    </div>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-lg"><MoreVertical size={18} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56" dir="rtl">
                        <DropdownMenuLabel className="text-right">خيارات الإدارة</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-end gap-2 cursor-pointer" onClick={() => { setEditingEmployee(emp); setIsEditDialogOpen(true); }}>
                          <Edit3 size={16} /> تعديل البيانات
                        </DropdownMenuItem>
                        <DropdownMenuItem className="justify-end gap-2 cursor-pointer" onClick={() => toast({ title: "تعديل الصلاحيات", description: "فتح محرر الصلاحيات المتقدم..." })}>
                          <UserCog size={16} /> تعيين دور وظيفي
                        </DropdownMenuItem>
                        <DropdownMenuItem className="justify-end gap-2 cursor-pointer" onClick={() => toast({ title: "كلمة المرور", description: "تم إرسال رابط إعادة تعيين كلمة المرور للموظف." })}>
                          <Key size={16} /> إعادة تعيين كلمة المرور
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="justify-end gap-2 cursor-pointer text-amber-600"
                          onClick={() => handleToggleStatus(emp.id, emp.status)}
                        >
                          {emp.status === 'Active' ? (
                            <><Ban size={16} /> تعطيل الحساب</>
                          ) : (
                            <><CheckCircle2 size={16} className="text-green-600" /> تفعيل الحساب</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="justify-end gap-2 cursor-pointer text-destructive font-bold"
                          onClick={() => handleDelete(emp.id)}
                        >
                          <Trash2 size={16} /> حذف الموظف نهائياً
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <form onSubmit={handleUpdateEmployee}>
            <DialogHeader>
              <DialogTitle className="text-right font-black text-xl flex items-center gap-2 justify-end">
                <Edit3 className="text-secondary" /> تعديل بيانات الموظف
              </DialogTitle>
              <DialogDescription className="text-right">تعديل الملف الشخصي للموظف: {editingEmployee?.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input defaultValue={editingEmployee?.name} className="h-11" required />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني المهني</Label>
                <Input type="email" defaultValue={editingEmployee?.email} className="h-11" required />
              </div>
              <div className="space-y-2">
                <Label>الدور الوظيفي</Label>
                <Select defaultValue={editingEmployee?.role}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="FinancialOfficer">Financial Officer</SelectItem>
                    <SelectItem value="CustomerService">Customer Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:justify-start">
              <Button type="submit" className="font-bold">حفظ التغييرات</Button>
              <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
