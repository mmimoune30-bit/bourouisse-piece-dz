
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Activity, Clock } from "lucide-react";

export default function AuditLogsPage() {
  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
          <History size={32} className="text-secondary" /> سجل العمليات والرقابة (Audit Log)
        </h1>
        <p className="text-muted-foreground mt-1">تتبع كافة نشاطات الطاقم الإداري وتغييرات النظام.</p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden min-h-[400px] flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground space-y-4">
           <Activity size={48} className="mx-auto opacity-20" />
           <p className="font-bold text-xl">السجل فارغ حالياً</p>
           <p className="text-sm">سيتم تسجيل كافة العمليات الإدارية المستقبلية هنا بشكل تلقائي.</p>
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
