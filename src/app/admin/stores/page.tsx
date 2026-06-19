
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Store, CheckCircle, XCircle, Ban, Eye, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const INITIAL_STORES = [
  "Auto Pièces Chlef", "Pièces Renault DZ", "Peugeot Center", "Hyundai Parts", 
  "Kia Auto", "Toyota Spare Parts", "Mercedes Parts Algeria", "Volkswagen Store", 
  "Fiat Algeria", "Chery Parts DZ", "JAC Auto", "Geely Parts", "Nissan Center", 
  "Suzuki Parts", "Mazda Auto", "Ford Spare Parts", "Opel Service", "Audi Parts", 
  "BMW Auto Parts", "Citroen Store"
].map((name, i) => ({
  id: `S${(i+1).toString().padStart(3, '0')}`,
  name,
  owner: ["محمد بن أحمد", "أحمد قاسمي", "سليم ب.", "ياسين م."][i % 4],
  wilaya: ["الشلف", "الجزائر", "وهران", "سطيف"][i % 4],
  status: i < 15 ? "Approved" : i < 18 ? "Pending" : "Blocked",
  plan: ["Gold", "Professional", "Silver", "Free"][i % 4]
}));

export default function StoreManagement() {
  const [stores, setStores] = useState(INITIAL_STORES);
  const [search, setSearch] = useState("");

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    const statusText = newStatus === 'Approved' ? 'معتمد' : 'محظور';
    toast({
      title: "تم تحديث الحالة",
      description: `تم تغيير حالة المتجر بنجاح إلى ${statusText}.`,
    });
  };

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">إدارة المتاجر</h1>
          <p className="text-muted-foreground">مراجعة طلبات الانضمام، توثيق المتاجر، وإدارة الاشتراكات.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث عن متجر..." 
            className="pr-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right pr-6">اسم المتجر</TableHead>
                <TableHead className="text-right">المالك</TableHead>
                <TableHead className="text-right">الولاية</TableHead>
                <TableHead className="text-right">الخطة</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="pr-6 font-bold text-primary">{store.name}</TableCell>
                  <TableCell>{store.owner}</TableCell>
                  <TableCell>{store.wilaya}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-bold">{store.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-bold",
                      store.status === 'Approved' ? "bg-green-600" : store.status === 'Pending' ? "bg-amber-500" : "bg-destructive"
                    )}>
                      {store.status === 'Approved' ? 'معتمد' : store.status === 'Pending' ? 'قيد المراجعة' : 'محظور'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6 space-x-2 space-x-reverse">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      title="معاينة"
                      onClick={() => toast({ title: "معاينة المتجر", description: `جاري فتح ملف متجر ${store.name}...` })}
                    >
                      <Eye size={16} />
                    </Button>
                    {store.status !== 'Approved' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 hover:bg-green-50" 
                        title="قبول"
                        onClick={() => handleUpdateStatus(store.id, 'Approved')}
                      >
                        <CheckCircle size={16} />
                      </Button>
                    )}
                    {store.status !== 'Blocked' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:bg-red-50" 
                        title="حظر"
                        onClick={() => handleUpdateStatus(store.id, 'Blocked')}
                      >
                        <Ban size={16} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredStores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                    لا توجد متاجر تطابق بحثك.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
