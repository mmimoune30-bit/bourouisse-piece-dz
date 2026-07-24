
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Store, CheckCircle, XCircle, Ban, Eye, Search, Loader2, MapPin, User, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { doc, updateDoc, collection, query, where } from "firebase/firestore";

export default function StoreManagement() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");

  // جلب كافة المستخدمين الذين يحملون دور بائع (Seller)
  const sellersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), where("role", "==", "Seller"));
  }, [firestore]);

  const { data: sellers, loading, error } = useCollection(sellersQuery);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!firestore) return;
    try {
      await updateDoc(doc(firestore, "users", id), { status: newStatus });
      toast({
        title: "تم تحديث الحالة",
        description: `تم تغيير حالة المتجر بنجاح إلى ${newStatus === 'Active' ? 'معتمد' : 'محظور'}.`,
      });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر تحديث حالة المتجر." });
    }
  };

  const handlePreviewStore = (name: string) => {
    window.open(`/catalog?query=${encodeURIComponent(name)}`, '_blank');
  };

  const filteredStores = useMemo(() => {
    return sellers?.filter(s => 
      s.name?.toLowerCase().includes(search.toLowerCase()) || 
      s.email?.toLowerCase().includes(search.toLowerCase())
    ) || [];
  }, [sellers, search]);

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <Store size={32} className="text-secondary" /> إدارة المتاجر المعتمدة
          </h1>
          <p className="text-muted-foreground mt-1">مراجعة حسابات البائعين، توثيق المتاجر، وإدارة الصلاحيات.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث عن متجر..." 
            className="pr-10 h-11 border-2" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[32px]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50 border-b">
              <TableRow>
                <TableHead className="text-right pr-8 h-14 font-black">المتجر / المالك</TableHead>
                <TableHead className="text-right h-14 font-black">الموقع</TableHead>
                <TableHead className="text-right h-14 font-black">الاشتراك</TableHead>
                <TableHead className="text-right h-14 font-black">الحالة</TableHead>
                <TableHead className="text-left pl-8 h-14 font-black">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                    <p className="mt-2 font-bold text-muted-foreground">جاري جلب المتاجر من السيرفر...</p>
                  </TableCell>
                </TableRow>
              ) : filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <TableRow key={store.id} className="hover:bg-zinc-50/50 transition-colors border-b">
                    <TableCell className="pr-8 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-primary text-base">{store.name}</span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          {store.email} <Mail size={10} />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-bold text-sm">
                        <MapPin size={14} className="text-secondary" /> {store.wilaya || 'غير محدد'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-black text-[10px] bg-primary/5 text-primary border-primary/10">
                        {store.subscription?.plan || "Free"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-black text-[10px] h-7 px-4 rounded-lg",
                        store.status === 'Active' ? "bg-green-600" : "bg-destructive"
                      )}>
                        {store.status === 'Active' ? 'معتمد (نشط)' : 'محظور'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left pl-8 space-x-2 space-x-reverse">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 font-bold rounded-xl border-2"
                        onClick={() => handlePreviewStore(store.name)}
                      >
                        <Eye size={16} /> معاينة
                      </Button>
                      {store.status !== 'Active' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600 border-green-200 hover:bg-green-50 rounded-xl" 
                          onClick={() => handleUpdateStatus(store.id, 'Active')}
                        >
                          <CheckCircle size={16} className="ml-1" /> اعتماد
                        </Button>
                      )}
                      {store.status === 'Active' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive border-red-200 hover:bg-red-50 rounded-xl" 
                          onClick={() => handleUpdateStatus(store.id, 'Blocked')}
                        >
                          <Ban size={16} className="ml-1" /> حظر
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32 text-muted-foreground font-bold">
                    لا توجد متاجر مطابقة لبحثك في قاعدة البيانات.
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
