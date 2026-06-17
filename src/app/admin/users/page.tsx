
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  ShieldCheck, 
  Ban, 
  Key, 
  Mail,
  Filter,
  UserPlus
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
  { id: "E001", name: "ميمون محمد", email: "maymoun@autopartsdz.com", role: "Super Admin", status: "Active" },
  { id: "E002", name: "أحمد بن علي", email: "ahmed@autopartsdz.com", role: "Manager", status: "Active" },
  { id: "E003", name: "سميرة بوحفص", email: "samira@autopartsdz.com", role: "Financial Officer", status: "Active" },
  { id: "E004", name: "كريم قادري", email: "karim@autopartsdz.com", role: "Customer Service", status: "Active" },
  { id: "E005", name: "يوسف حمدي", email: "youssef@autopartsdz.com", role: "Moderator", status: "Active" },
];

const ROLES = ["Super Admin", "Manager", "Financial Officer", "Customer Service", "Moderator", "Seller", "Customer"];

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-row-reverse justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">إدارة المستخدمين والموظفين</h1>
          <p className="text-muted-foreground">التحكم في الأدوار، الصلاحيات، وحالة الحسابات.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold gap-2">
              <Plus size={18} /> إضافة مستخدم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 justify-end">
                <UserPlus className="text-secondary" /> إضافة مستخدم جديد
              </DialogTitle>
              <DialogDescription className="text-right">
                إنشاء حساب جديد وتعيين الصلاحيات المناسبة.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-right">
              <div className="grid gap-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input id="name" placeholder="الاسم هنا" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">الدور الوظيفي</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="اختر الدور" /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:justify-start">
              <Button type="submit">حفظ البيانات</Button>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right pr-6">المستخدم</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EMPLOYEES.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell className="pr-6">
                    <div className="flex items-center gap-3 justify-start flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-primary">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-bold text-primary">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-black text-[10px] uppercase">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-600 font-bold">{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical size={18} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem className="text-right justify-end">تعديل الصلاحيات</DropdownMenuItem>
                        <DropdownMenuItem className="text-right justify-end">سجل النشاط</DropdownMenuItem>
                        <DropdownMenuItem className="text-right justify-end text-destructive">حظر الحساب</DropdownMenuItem>
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
