
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, MoreVertical, ShieldCheck, Mail, Phone, 
  UserPlus, UserCog, Ban, Key, Trash2 
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

const EMPLOYEES = [
  { id: "E001", name: "ميمون محمد", email: "maymoun@bourouisse.com", phone: "0555111111", role: "SuperAdmin", status: "Active" },
  { id: "E002", name: "أحمد بن علي", email: "ahmed@bourouisse.com", phone: "0555222222", role: "Manager", status: "Active" },
  { id: "E003", name: "سميرة بوحفص", email: "samira@bourouisse.com", phone: "0555333333", role: "FinancialOfficer", status: "Active" },
  { id: "E004", name: "كريم قادري", email: "karim@bourouisse.com", phone: "0555444444", role: "CustomerService", status: "Active" },
];

export default function EmployeeManagementPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <UserCog size={32} className="text-secondary" /> إدارة طاقم العمل والصلاحيات
          </h1>
          <p className="text-muted-foreground mt-1">إضافة موظفين، تعيين الأدوار، ومراقبة الصلاحيات الإدارية.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-bold gap-2 h-12 px-8 bg-primary shadow-xl">
              <UserPlus size={18} /> إضافة موظف جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right font-black text-xl flex items-center gap-2 justify-end">
                <ShieldCheck className="text-secondary" /> إنشاء حساب إداري
              </DialogTitle>
              <DialogDescription className="text-right">أدخل بيانات الموظف واختر الدور الوظيفي المناسب.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input placeholder="الاسم واللقب" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني المهني</Label>
                <Input type="email" placeholder="name@bourouisse.com" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>الدور الوظيفي</Label>
                <Select>
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
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EMPLOYEES.map((emp) => (
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
                    <Badge className="bg-green-600 font-bold">{emp.status}</Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-lg"><MoreVertical size={18} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56" dir="rtl">
                        <DropdownMenuLabel className="text-right">خيارات الإدارة</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-end gap-2 cursor-pointer"><Settings size={16} /> تعديل الصلاحيات</DropdownMenuItem>
                        <DropdownMenuItem className="justify-end gap-2 cursor-pointer"><Key size={16} /> إعادة تعيين كلمة المرور</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-end gap-2 cursor-pointer text-amber-600"><Ban size={16} /> تعطيل الحساب مؤقتاً</DropdownMenuItem>
                        <DropdownMenuItem className="justify-end gap-2 cursor-pointer text-destructive font-bold"><Trash2 size={16} /> حذف الموظف نهائياً</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
