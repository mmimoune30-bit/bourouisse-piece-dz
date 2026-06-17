
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, MessageSquare, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const COMPLAINTS = [
  { id: "CMP001", user: "كريم بوعلام", subject: "قطعة غير مطابقة للوصف", status: "Open", date: "2024-05-18", priority: "High" },
  { id: "CMP002", user: "سمير عيساوي", subject: "تأخر في استلام الطلب", status: "In Progress", date: "2024-05-17", priority: "Medium" },
  { id: "CMP003", user: "أحمد قاسمي", subject: "منتج غير متوفر رغم الإعلان", status: "Closed", date: "2024-05-16", priority: "Low" },
];

export default function ComplaintsManagement() {
  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-primary">إدارة الشكاوى والدعم</h1>
        <p className="text-muted-foreground">معالجة تقارير المستخدمين وحل النزاعات بين البائع والمشتري.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right pr-6">رقم الشكوى</TableHead>
                <TableHead className="text-right">المشتري</TableHead>
                <TableHead className="text-right">الموضوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الأولوية</TableHead>
                <TableHead className="text-left pl-6">الإجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPLAINTS.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="pr-6 font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-bold">{c.user}</TableCell>
                  <TableCell className="max-w-md truncate">{c.subject}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "Open" ? "destructive" : "secondary"}>
                      {c.status === "Open" ? "مفتوحة" : c.status === "Closed" ? "مغلقة" : "قيد المعالجة"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      c.priority === "High" ? "text-red-600 border-red-200 bg-red-50" : "text-blue-600 border-blue-200 bg-blue-50"
                    )}>
                      {c.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageSquare size={14} /> رد ومعالجة
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
