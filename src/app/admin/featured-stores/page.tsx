
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, Crown, Plus, Search, Calendar, BarChart2, Edit3, Trash2, 
  Settings, Loader2, CheckCircle2, AlertTriangle, Eye, TrendingUp, AlertCircle 
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

export default function FeaturedStoresAdmin() {
  const { firestore } = useFirestore();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  // تثبيت الاستعلامات لتجنب إعادة التحميل المستمرة
  const usersQuery = useMemo(() => firestore ? collection(firestore, "users") : null, [firestore]);
  const campaignsQuery = useMemo(() => firestore ? collection(firestore, "featured_stores") : null, [firestore]);

  const { data: allUsers, loading: loadingUsers, error: usersError } = useCollection(usersQuery);
  const { data: campaigns, loading: loadingCampaigns, error: campaignsError } = useCollection(campaignsQuery);

  const sellersList = useMemo(() => {
    return allUsers?.filter(u => u.role === 'Seller').sort((a, b) => (a.name || '').localeCompare(b.name || '')) || [];
  }, [allUsers]);

  const sortedCampaigns = useMemo(() => {
    return [...(campaigns || [])].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }, [campaigns]);

  const handleAddCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !selectedStoreId) {
      toast({ variant: "destructive", title: "تنبيه", description: "يرجى اختيار متجر من القائمة." });
      return;
    }
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const store = sellersList.find(s => s.uid === selectedStoreId);

    const data = {
      storeId: selectedStoreId,
      storeName: store?.name || "Unknown",
      storeLocation: store?.wilaya || "غير محدد",
      storeLogo: store?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${store?.name || 'Store'}`,
      tier: formData.get("tier") as string,
      placement: formData.get("placement") as string,
      priority: Number(formData.get("priority")),
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: "Active",
      stats: { impressions: 0, clicks: 0 },
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(firestore, "featured_stores"), data);
      toast({ title: "تم تفعيل الحملة", description: `المتجر ${data.storeName} يظهر الآن في القائمة المميزة.` });
      setIsAddOpen(false);
      setSelectedStoreId("");
    } catch (e: any) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر إنشاء الحملة. تأكد من الصلاحيات." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("هل تريد إنهاء هذه الحملة الإعلانية؟")) return;
    try {
      await deleteDoc(doc(firestore, "featured_stores", id));
      toast({ title: "تم الإزالة", description: "تم حذف المتجر من القائمة المميزة." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر الحذف." });
    }
  };

  const filtered = sortedCampaigns.filter(c => 
    c.storeName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
             إدارة المتاجر المميزة <Crown size={32} className="text-secondary" />
          </h1>
          <p className="text-muted-foreground mt-1">بيع وإدارة مساحات العرض الحصرية والمميزة في الصفحة الرئيسية.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={(val) => { setIsAddOpen(val); if(!val) setSelectedStoreId(""); }}>
           <DialogTrigger asChild>
             <Button className="font-black gap-2 h-12 px-8 shadow-xl bg-primary text-white">
                <Plus size={18} /> إضافة متجر للقائمة
             </Button>
           </DialogTrigger>
           <DialogContent className="max-w-xl" dir="rtl">
              <form onSubmit={handleAddCampaign}>
                 <DialogHeader>
                    <DialogTitle className="text-right font-black text-xl">تفعيل ميزة "حصري / مميز"</DialogTitle>
                 </DialogHeader>
                 
                 {(usersError) && (
                   <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm font-bold">
                     <AlertCircle size={18} /> خطأ في جلب بيانات المتاجر. تأكد من اتصال الإنترنت.
                   </div>
                 )}

                 <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                       <Label className="font-bold">اختر المتجر من القائمة الموثقة</Label>
                       <Select 
                        value={selectedStoreId} 
                        onValueChange={setSelectedStoreId}
                        required
                       >
                          <SelectTrigger className="h-14 border-2 bg-white">
                             <SelectValue placeholder={loadingUsers ? "جاري جلب المتاجر..." : "اختر المتجر..."} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                             {loadingUsers ? (
                               <div className="flex items-center justify-center p-4"><Loader2 className="animate-spin text-primary" /></div>
                             ) : sellersList.length > 0 ? (
                               sellersList.map(s => (
                                 <SelectItem key={s.uid} value={s.uid} className="text-right flex-row-reverse">
                                   {s.name} ({s.wilaya || 'بدون ولاية'})
                                 </SelectItem>
                               ))
                             ) : (
                               <div className="p-4 text-center text-xs font-bold text-muted-foreground">لا يوجد بائعين مسجلين حالياً</div>
                             )}
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="font-bold">فئة الإعلان</Label>
                          <Select name="tier" defaultValue="Featured">
                             <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                             <SelectContent>
                                <SelectItem value="Exclusive">👑 متجر حصري (أعلى الصفحة)</SelectItem>
                                <SelectItem value="Featured">⭐ متجر مميز (قائمة عرضية)</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <Label className="font-bold">ترتيب الظهور (0-100)</Label>
                          <Input name="priority" type="number" defaultValue="10" className="h-11" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="font-bold">تاريخ البداية</Label>
                          <Input name="startDate" type="date" className="h-11" required />
                       </div>
                       <div className="space-y-2">
                          <Label className="font-bold">تاريخ الانتهاء</Label>
                          <Input name="endDate" type="date" className="h-11" required />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <Label className="font-bold">مكان الظهور</Label>
                       <Select name="placement" defaultValue="Home">
                          <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                          <SelectContent>
                             <SelectItem value="Home">الصفحة الرئيسية فقط</SelectItem>
                             <SelectItem value="Search">صفحة البحث فقط</SelectItem>
                             <SelectItem value="Both">الرئيسية والبحث</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
                 <DialogFooter className="gap-2 sm:justify-start">
                    <Button type="submit" disabled={loading || !selectedStoreId} className="font-black h-12 px-10 min-w-[150px]">
                       {loading ? <Loader2 className="animate-spin" /> : "تفعيل الميزة الآن"}
                    </Button>
                 </DialogFooter>
              </form>
           </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="border-none shadow-sm bg-white p-6">
            <div className="flex justify-between items-center">
               <div><p className="text-xs font-black text-muted-foreground uppercase">متاجر حصرية نشطة</p><h3 className="text-3xl font-black text-primary">{sortedCampaigns.filter(c => c.tier === 'Exclusive').length}</h3></div>
               <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Crown /></div>
            </div>
         </Card>
         <Card className="border-none shadow-sm bg-white p-6">
            <div className="flex justify-between items-center">
               <div><p className="text-xs font-black text-muted-foreground uppercase">متاجر مميزة نشطة</p><h3 className="text-3xl font-black text-blue-600">{sortedCampaigns.filter(c => c.tier === 'Featured').length}</h3></div>
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Star /></div>
            </div>
         </Card>
         <Card className="border-none shadow-sm bg-primary text-white p-6">
            <div className="flex justify-between items-center">
               <div><p className="text-xs font-black text-blue-100 uppercase">إجمالي النقرات اليوم</p><h3 className="text-3xl font-black text-secondary">1.4K</h3></div>
               <div className="p-3 bg-white/10 text-white rounded-xl"><TrendingUp /></div>
            </div>
         </Card>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[32px]">
         <CardContent className="p-0">
            <Table>
               <TableHeader className="bg-zinc-50 border-b">
                  <TableRow>
                     <TableHead className="text-right pr-8">المتجر</TableHead>
                     <TableHead className="text-right">الفئة</TableHead>
                     <TableHead className="text-right">الأولوية</TableHead>
                     <TableHead className="text-right">الفترة الزمنية</TableHead>
                     <TableHead className="text-right">الأداء (Clicks/Imp)</TableHead>
                     <TableHead className="text-left pl-8">الإجراءات</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {loadingCampaigns ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 animate-pulse font-bold">جاري تحميل الحملات...</TableCell></TableRow>
                  ) : (campaignsError) ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 text-destructive font-bold">تعذر تحميل بيانات الحملات من السيرفر.</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-bold">لا توجد حملات إعلانية مفعلة حالياً.</TableCell></TableRow>
                  ) : (
                    filtered.map((c) => (
                      <TableRow key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                        <TableCell className="pr-8 py-4">
                           <div className="flex flex-col">
                              <span className="font-black text-primary">{c.storeName}</span>
                              <span className="text-[10px] text-muted-foreground">{c.storeLocation}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           {c.tier === 'Exclusive' ? (
                             <Badge className="bg-secondary text-primary font-black gap-1"><Crown size={12} /> حصري</Badge>
                           ) : (
                             <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-black gap-1"><Star size={12} /> مميز</Badge>
                           )}
                        </TableCell>
                        <TableCell className="font-mono font-bold text-zinc-500">#{c.priority}</TableCell>
                        <TableCell>
                           <div className="flex flex-col text-[10px] font-bold">
                              <span className="text-green-600">من: {c.startDate}</span>
                              <span className="text-red-600">إلى: {c.endDate}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-4 text-xs font-black">
                              <span className="flex items-center gap-1 text-blue-600"><Eye size={12} /> {c.stats?.impressions || 0}</span>
                              <span className="flex items-center gap-1 text-orange-600"><TrendingUp size={12} /> {c.stats?.clicks || 0}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-left pl-8">
                           <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}><Trash2 size={18} /></Button>
                           </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
    </div>
  );
}
