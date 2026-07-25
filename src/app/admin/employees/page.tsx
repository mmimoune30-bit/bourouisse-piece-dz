
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, MoreVertical, ShieldCheck, Mail, Phone, 
  UserPlus, UserCog, Ban, Key, Trash2, Calendar, Settings, CheckCircle2, Edit3, Loader2
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { cn } from "@/lib/utils";

const ADMIN_ROLES = ["Super Admin", "Manager", "Financial Officer", "Customer Service"];

export default function EmployeeManagementPage() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");

  const employeesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), where("role", "in", ADMIN_ROLES));
  }, [firestore]);

  const { data: employees, loading } = useCollection(employeesQuery);

  const filtered = employees?.filter(emp => 
    emp.name?.toLowerCase().includes(search.toLowerCase()) || 
    emp.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
          <UserCog size={32} className="text-secondary" /> طاقم العمل الإداري (Live)
        </h1>
        <p className="text-muted-foreground mt-1">يظهر هنا فقط الحسابات الإدارية المسجلة فعلياً في Firestore.</p>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <Search className="text-muted-foreground" size={18} />
        <Input 
          placeholder="بحث في الموظفين..." 
          className="text-right border-none shadow-none focus-visible:ring-0" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="text-right pr-6">الموظف</TableHead>
              <TableHead className="text-right">الدور</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-left pl-6">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 animate-pulse">جاري جلب بيانات الموظفين...</TableCell></TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-32 text-muted-foreground font-bold">لا يوجد موظفون إداريون مسجلون حالياً.</TableCell></TableRow>
            ) : (
              filtered?.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="pr-6">
                    <div className="flex flex-col">
                      <span className="font-black text-primary">{emp.name}</span>
                      <span className="text-[10px] text-muted-foreground">{emp.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-black text-[10px] uppercase border-primary/20 text-primary bg-primary/5">
                      {emp.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("font-bold", emp.status === 'Active' ? "bg-green-600" : "bg-zinc-400")}>
                      {emp.status === 'Active' ? 'نشط' : 'معطل'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <Button variant="ghost" size="icon"><MoreVertical size={18} /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
