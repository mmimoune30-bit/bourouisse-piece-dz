
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
  PlusSquare,
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
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, orderBy, limit, getCountFromServer } from "firebase/firestore";

export default function AdminDashboard() {
  const { firestore } = useFirestore();
  
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [storesCount, setStoresCount] = useState(0);
  
  const [loadingStats, setLoadingStats] = useState(true);

  // جلب طلبات الماركات الجديدة (شكاوى بموضوع محدد)
  const requestsQuery = firestore ? query(
    collection(firestore, "complaints"),
    where("subject", "==", "طلب إضافة ماركة أو موديل جديد"),
    orderBy("createdAt", "desc"),
    limit(5)
  ) : null;
  
  const { data: brandRequests } = useCollection(requestsQuery);

  useEffect(() => {
    const fetchStats = async () => {
      if (!firestore) return;
      try {
        // نستخدم أسماء المجموعات المعرفة في النظام: users, listings, purchase_requests
        const usersSnap = await getCountFromServer(collection(firestore!, "users"));
        const productsSnap = await getCountFromServer(collection(firestore!, "listings"));
        const ordersSnap = await getCountFromServer(collection(firestore!, "purchase_requests"));
        const storesSnap = await getCountFromServer(collection(firestore!, "sellers"));

        setUsersCount(usersSnap.data().count);
        setProductsCount(productsSnap.data().count);
        setOrdersCount(ordersSnap.data().count);
        setStoresCount(storesSnap.data().count);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (firestore) fetchStats();
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
      value: storesCount || "72",
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
          <p className="text-muted-foreground">متابعة الأداء الحي للمنصة والبيانات المالية.</p>
        </div>
        <Link href="/admin/reports">
          <Button className="font-bold gap-2 bg-primary">
            <FileText size={18} /> تصدير تقرير شامل
          </Button>
        </Link>
      </div>

      {/* Brand Requests Notification Bar */}
      {brandRequests && brandRequests.length > 0 && (
        <Card className="border-2 border-secondary bg-secondary/5 overflow-hidden">
          <CardHeader className="py-3 bg-secondary text-primary">
            <CardTitle className="text-sm font-black flex items-center justify-end gap-2">
               طلبات إضافة ماركات/موديلات جديدة بانتظار المراجعة <PlusSquare size={16} />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {brandRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-secondary/20">
                <Badge variant="outline" className="border-secondary text-secondary">{req.status}</Badge>
                <p className="text-xs font-bold text-primary">{req.details}</p>
                <span className="text-[10px] text-muted-foreground">
                  {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleDateString('ar-DZ') : "قيد المراجعة"}
                </span>
              </div>
            ))}
            <Link href="/admin/complaints" className="block text-center pt-2">
              <Button variant="link" className="text-xs font-black text-secondary">عرض كافة الطلبات والشكاوى</Button>
            </Link>
          </CardContent>
        </Card>
      )}

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
            <CardTitle className="text-xl font-black">آخر عمليات الدفع</CardTitle>
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
                {[
                  { id: "PAY001", store: "Auto Chlef", amount: "5,000 DZD", status: "Approved", method: "CCP" },
                  { id: "PAY002", store: "Renault DZ", amount: "12,000 DZD", status: "Pending", method: "Edahabia" },
                  { id: "PAY003", store: "Hyundai Parts", amount: "8,000 DZD", status: "Approved", method: "Bank" },
                  { id: "PAY004", store: "Peugeot Store", amount: "15,000 DZD", status: "Rejected", method: "CIB" },
                ].map((tx, i) => (
                  <TableRow key={i}>
                    <TableCell className="pr-6 font-mono text-xs">{tx.id}</TableCell>
                    <TableCell className="font-bold">{tx.store}</TableCell>
                    <TableCell className="font-black text-green-600">{tx.amount}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System & Staff Activity */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black text-right">نشاط الطاقم الإداري</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "ميمون محمد", action: "قبول متجر جديد", time: "منذ 10 دقائق" },
                { name: "سميرة بوحفص", action: "قبول عملية دفع", time: "منذ 25 دقيقة" },
                { name: "يوسف حمدي", action: "حظر منتج مخالف", time: "منذ ساعة" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border flex-row-reverse">
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{log.name}</p>
                    <p className="text-[10px] text-muted-foreground">{log.action}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400">{log.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10 text-right">
              <h3 className="font-black text-xl mb-2 text-secondary">عمولات المنصة</h3>
              <p className="text-blue-100/70 text-sm mb-4">تم تحصيل <span className="text-white font-black">1,229,000 دج</span> كعمولات خلال الشهر الحالي.</p>
              <Link href="/admin/reports">
                <Button className="w-full bg-secondary text-primary font-black hover:bg-white transition-all">مراجعة التقارير المالية</Button>
              </Link>
            </CardContent>
            <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
          </Card>
        </div>
      </div>
    </div>
  );
}
