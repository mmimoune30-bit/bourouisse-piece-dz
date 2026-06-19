
"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, CheckCircle2, XCircle, Package, ArrowRight, Store, MapPin, Truck } from "lucide-react";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  "New": "طلب جديد",
  "Under Review": "قيد المراجعة",
  "Accepted": "تم القبول",
  "Rejected": "مرفوض",
  "Completed": "تم الاستلام"
};

export default function MyPurchaseRequests() {
  const { firestore } = useFirestore();
  const { user } = useUser();

  const requestsQuery = query(
    collection(firestore!, "purchase_requests"),
    where("buyerId", "==", user?.uid || "guest"),
    orderBy("createdAt", "desc")
  );

  const { data: requests, loading } = useCollection(requestsQuery);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-10">
            <div className="text-right">
              <h1 className="text-4xl font-black text-primary mb-1">طلبات الشراء الخاصة بي</h1>
              <p className="text-muted-foreground font-bold">تتبع حالة طلباتك وتواصل مع البائعين.</p>
            </div>
            <Link href="/catalog">
              <Button variant="outline" className="font-bold gap-2 rounded-2xl h-12 border-2 border-primary/20">
                 تصفح المزيد من القطع <ArrowRight className="rotate-180" size={18} />
              </Button>
            </Link>
          </header>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20 font-bold animate-pulse">جاري تحميل طلباتك...</div>
            ) : requests?.length === 0 ? (
              <Card className="border-none shadow-sm p-20 text-center rounded-[40px]">
                <Package size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-2xl font-black text-primary mb-2">ليس لديك أي طلبات شراء بعد</h3>
                <p className="text-muted-foreground font-bold mb-6">ابحث عن قطع الغيار التي تحتاجها وأرسل طلبات شراء للمتاجر.</p>
                <Link href="/catalog">
                  <Button className="font-black px-12 h-14 rounded-2xl shadow-xl">ابدأ التسوق الآن</Button>
                </Link>
              </Card>
            ) : (
              requests?.map((req) => (
                <Card key={req.id} className="border-none shadow-lg overflow-hidden rounded-[32px] bg-white group hover:shadow-2xl transition-all">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row-reverse">
                       <div className="p-8 flex-grow text-right" dir="rtl">
                          <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4 mb-4">
                             <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="font-mono text-[10px] border-primary/20">{req.requestNumber}</Badge>
                                  <Badge className={cn(
                                    "font-black text-[10px]",
                                    req.status === 'New' ? "bg-red-500" : 
                                    req.status === 'Accepted' ? "bg-green-600" : 
                                    req.status === 'Rejected' ? "bg-zinc-400" : "bg-blue-600"
                                  )}>
                                    {STATUS_LABELS[req.status]}
                                  </Badge>
                               </div>
                               <h3 className="text-xl font-black text-primary group-hover:text-secondary transition-colors">{req.productName}</h3>
                             </div>
                             <div className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                               <Clock size={14} /> {req.createdAt?.toDate().toLocaleDateString('ar-DZ')}
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-zinc-100">
                             <div className="space-y-1">
                               <p className="text-[10px] font-black text-muted-foreground uppercase">المتجر</p>
                               <p className="font-bold flex items-center gap-2"><Store size={14} className="text-secondary" /> {req.storeName}</p>
                             </div>
                             <div className="space-y-1">
                               <p className="text-[10px] font-black text-muted-foreground uppercase">الكمية</p>
                               <p className="font-bold">{req.quantity} قطعة</p>
                             </div>
                             <div className="space-y-1">
                               <p className="text-[10px] font-black text-muted-foreground uppercase">جهة الشحن</p>
                               <p className="font-bold flex items-center gap-2"><MapPin size={14} className="text-red-500" /> {req.wilaya}</p>
                             </div>
                          </div>

                          <div className="mt-6 flex flex-col md:flex-row-reverse justify-between items-center gap-4">
                             <p className="text-xs text-muted-foreground font-bold">
                                {req.status === 'New' ? "طلبك بانتظار موافقة البائع. سيتم الاتصال بك قريباً." : 
                                 req.status === 'Accepted' ? "تم قبول طلبك! البائع يجهز القطعة للشحن." :
                                 req.status === 'Completed' ? "تم إكمال العملية بنجاح. نأمل أن تكون راضياً عن الخدمة." :
                                 "تم رفض الطلب أو إلغاؤه من قبل البائع."}
                             </p>
                             <div className="flex gap-2 w-full md:w-auto">
                                <Button variant="outline" className="flex-1 md:flex-none font-bold rounded-xl h-10 border-2">تفاصيل الطلب</Button>
                                <Button className="flex-1 md:flex-none font-black rounded-xl h-10 gap-2">تواصل مع البائع <MessageCircle size={16} /></Button>
                             </div>
                          </div>
                       </div>
                       <div className="md:w-64 bg-zinc-50 border-r md:border-r-0 md:border-l p-8 flex flex-col items-center justify-center text-center">
                          <div className="w-20 h-20 bg-white rounded-[24px] shadow-sm flex items-center justify-center mb-4 border-2 border-secondary/20">
                             {req.status === 'Accepted' || req.status === 'Completed' ? <Truck className="text-green-600 animate-float" size={40} /> : <ShoppingBag className="text-primary opacity-20" size={40} />}
                          </div>
                          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">حالة التوصيل</p>
                          <p className="font-black text-primary">
                             {req.status === 'Completed' ? "تم التوصيل" : 
                              req.status === 'Accepted' ? "جاري الشحن" : "في الانتظار"}
                          </p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Button } from "@/components/ui/button";
