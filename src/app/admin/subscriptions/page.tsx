
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Ticket, 
  Search, 
  RefreshCcw, 
  XCircle, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Filter,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_SUBSCRIPTIONS = [
  { id: "SUB-001", store: "Auto Pièces Chlef", plan: "Gold", status: "Active", expiry: "2024-12-18", price: "5000 DZD" },
  { id: "SUB-002", store: "Pièces Renault DZ", plan: "Professional", status: "Active", expiry: "2025-01-10", price: "12000 DZD" },
  { id: "SUB-003", store: "Hyundai Parts", plan: "Silver", status: "Expired", expiry: "2024-05-01", price: "3000 DZD" },
  { id: "SUB-004", store: "Peugeot Center", plan: "Free", status: "Active", expiry: "N/A", price: "0 DZD" },
];

export default function SubscriptionsManagement() {
  const [subs, setSubs] = useState(INITIAL_SUBSCRIPTIONS);
  const [search, setSearch] = useState("");

  const filteredSubs = subs.filter(s => 
    s.store.includes(search) || s.plan.includes(search)
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">إدارة الاشتراكات</h1>
          <p className="text-muted-foreground">متابعة اشتراكات المتاجر والخطط الفعالة.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 font-bold">
            <Filter size={18} /> تصفية النتائج
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث عن متجر أو خطة..." 
            className="pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="bg-primary/5 h-10 px-4 flex items-center gap-2">
          <Ticket size={16} /> {filteredSubs.length} اشتراك
        </Badge>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50">
                <TableHead className="text-right pr-6">رقم الاشتراك</TableHead>
                <TableHead className="text-right">المتجر</TableHead>
                <TableHead className="text-right">الخطة</TableHead>
                <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubs.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="pr-6 font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-bold">{s.store}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-black">{s.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end text-xs text-muted-foreground">
                      <Calendar size={12} /> {s.expiry}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary">{s.price}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-bold",
                      s.status === "Active" ? "bg-green-600" : "bg-destructive"
                    )}>
                      {s.status === 'Active' ? 'نشط' : 'منتهي'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6 space-x-2 space-x-reverse">
                    <Button variant="outline" size="sm" className="gap-1">
                      <RefreshCcw size={14} /> تجديد
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-blue-600">
                      <ArrowUpCircle size={14} /> ترقية
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-destructive">
                      <XCircle size={14} /> إلغاء
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
