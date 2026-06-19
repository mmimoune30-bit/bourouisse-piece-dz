
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { History, Search, Download, Filter, User, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_LOGS = [
  { id: 1, employee: "ميمون محمد", role: "SuperAdmin", action: "تغيير إعدادات الصيانة", type: "Settings Change", date: "2024-05-18", time: "14:30:12", status: "Success" },
  { id: 2, employee: "سميرة بوحفص", role: "FinancialOfficer", action: "الموافقة على اشتراك متجر Auto DZ", type: "Payment Approval", date: "2024-05-18", time: "12:15:05", status: "Success" },
  { id: 3, employee: "كريم قادري", role: "CustomerService", action: "الرد على شكوى CMP-001", type: "Complaint Reply", date: "2024-05-18", time: "10:05:44", status: "Success" },
  { id: 4, employee: "يوسف حمدي", role: "Manager", action: "حذف إعلان مخالف", type: "Moderation", date: "2024-05-17", time: "21:45:00", status: "Success" },
  { id: 5, employee: "Admin Principal", role: "SuperAdmin", action: "تسجيل دخول للنظام", type: "Login", date: "2024-05-17", time: "08:00:00", status: "Security" },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <History size={32} className="text-secondary" /> سجل العمليات والرقابة (Audit Log)
          </h1>
          <p className="text-muted-foreground mt-1">تتبع كافة نشاطات الطاقم الإداري وتغييرات النظام.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 font-bold h-11"><Download size={18} /> تصدير السجل</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث بالموظف أو نوع العملية..." 
            className="pr-10 text-right h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="gap-2 font-bold"><Filter size={18} /> تصفية متقدمة</Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50">
              <TableRow>
                <TableHead className="text-right pr-6">الموظف / الدور</TableHead>
                <TableHead className="text-right">العملية</TableHead>
                <TableHead className="text-right">التصنيف</TableHead>
                <TableHead className="text-right">التاريخ والوقت</TableHead>
                <TableHead className="text-left pl-6">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_LOGS.map((log) => (
                <TableRow key={log.id} className="hover:bg-zinc-50/50">
                  <TableCell className="pr-6">
                    <div className="flex flex-col text-right">
                      <span className="font-bold flex items-center gap-2 justify-end">{log.employee} <User size={14} className="text-secondary" /></span>
                      <span className="text-[10px] text-muted-foreground">{log.role}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{log.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-right text-xs">
                      <span className="font-bold">{log.date}</span>
                      <span className="text-muted-foreground">{log.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <Badge className={cn(
                      "font-black text-[10px]",
                      log.status === 'Success' ? "bg-green-600" : "bg-blue-600"
                    )}>
                      {log.status === 'Success' ? 'مكتمل' : 'أمان'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-zinc-900 p-6 rounded-3xl text-white flex flex-row-reverse items-center justify-between shadow-xl">
        <div className="text-right">
          <h3 className="text-lg font-black text-secondary flex items-center justify-end gap-2">نظام الحماية والرقابة <Activity size={18} className="animate-pulse" /></h3>
          <p className="text-sm text-zinc-400">يتم تسجيل كافة العمليات بشكل آمن ولا يمكن تعديلها أو حذفها لضمان شفافية الإدارة.</p>
        </div>
        <Clock className="text-white/10 w-24 h-24" />
      </div>
    </div>
  );
}
