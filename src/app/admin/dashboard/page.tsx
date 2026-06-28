"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  Loader2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { collection, query, orderBy, limit, getCountFromServer, getDocs } from "firebase/firestore";

export default function AdminDashboard() {
  const { firestore } = useFirestore();
  
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [storesCount, setStoresCount] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!firestore) return;
      try {
        setLoadingStats(true);
        
        // 1. جلب الإحصائيات (Counts)
        const [usersSnap, productsSnap, ordersSnap, storesSnap] = await Promise.all([
          getCountFromServer(collection(firestore, "users")),
          getCountFromServer(collection(firestore, "products")),
          getCountFromServer(collection(firestore, "orders")),
          getCountFromServer(collection(firestore, "sellers"))
        ]);

        setUsersCount(usersSnap.data().count);
        setProductsCount(productsSnap.data().count);
        setOrdersCount(ordersSnap.data().count);
        setStoresCount(storesSnap.data().count);

        // 2. جلب آخر 10 عمليات دفع
        const q = query(
          collection(firestore, "payments"),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setTransactions(data);

      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAllData();
  }, [firestore]);

  const STATS = [
    {
      label: "إجمالي المستخدمين",
      value: usersCount,
      trend: "+12%",
      up: true,
      icon: Users,
      color: "bg-blue-600",
    },
    {
      label: "المتاجر النشطة",
      value: storesCount,
      trend: "+5%",
      up: true,
      icon: Store,
      color: "bg-amber-500",
    },
    {
      label: "قطع الغيار",
      value: productsCount,
      trend: "+18%",
      up: true,
      icon: Package,
      color: "bg-purple-600",
    },
    {
      label: "الطلبات",
      value: ordersCount,
      trend: "+25%",
      up: true,
      icon: ShoppingBag,
      color: "bg-green-600",
    },
  ];

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">نظرة عامة على النظام</h1>
          <p className="text-muted-foreground">متابعة الأداء الحي للمنصة والبيانات المالية من Firestore.</p>
        </div>
        <Link href="/admin/reports">
          <Button className="font-bold gap-2 bg-primary">
            <FileText size={18} /> تصدير تقرير شامل
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-none shadow-sm overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                    <Icon size={24} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full",
                    stat.up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {stat.trend}
                    {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </div>
                </div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-right">{stat.label}</p>
                <h3 className="text-3xl font-black text-primary mt-1 text-right">
                  {loadingStats ? <Loader2 className="animate-spin text-muted-foreground h-8 w-8 mr-auto" /> : stat.value}
                </h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row-reverse items-center justify-between border-b">
            <CardTitle className="text-xl font-black">آخر عمليات الدفع (أحدث 10)</CardTitle>
            <Link href="/admin/payments">
              <Button variant="ghost" className="text-secondary font-bold">عرض الكل</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right pr-6">رقم العملية</TableHead>
                  <TableHead className="text-right">المتجر</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-left pl-6">الوسيلة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingStats ? (
                   <TableRow>
                     <TableCell colSpan={5} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell>
                   </TableRow>
                ) : transactions.length > 0 ? (
                  transactions.map((tx, i) => (
                    <TableRow key={i}>
                      <TableCell className="pr-6 font-mono text-xs">{tx.id.substring(0, 8)}</TableCell>
                      <TableCell className="font-bold">{tx.storeName || "متجر غير معروف"}</TableCell>
                      <TableCell className="font-black text-green-600">{tx.amount?.toLocaleString()} DZD</TableCell>
                      <TableCell>
                        <Badge variant={
                          tx.status === 'Approved' ? 'default' : 
                          tx.status === 'Pending' ? 'secondary' : 'destructive'
                        } className="font-bold">
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left pl-6 text-muted-foreground">{tx.method}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">لا توجد عمليات دفع مسجلة حالياً.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Activity */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10 text-right">
              <h3 className="font-black text-xl mb-2 text-secondary">عمولات المنصة</h3>
              <p className="text-blue-100/70 text-sm mb-4">يتم احتساب الأرباح بناءً على نسب المبيعات والاشتراكات.</p>
              <Link href="/admin/reports">
                <Button className="w-full bg-secondary text-primary font-black hover:bg-white transition-all">مراجعة التقارير المالية</Button>
              </Link>
            </CardContent>
            <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black text-right">أحدث الطلبات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-center text-muted-foreground py-4">راجع صفحة "Purchase Requests" لمتابعة تفاصيل الطلبات.</p>
              <Link href="/admin/purchase-requests">
                <Button variant="outline" className="w-full font-bold">عرض كافة الطلبات</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}