"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Store, Package, CreditCard, 
  Settings, ShieldAlert, LogOut, Menu, X, 
  Layout as LayoutIcon, History, ShoppingBag, Loader2, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useUser, useAuth } from "@/firebase";
import { logoutUser } from "@/services/auth-service";

const ADMIN_MENU = [
  { name: "لوحة التحكم", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "المستخدمين", href: "/admin/users", icon: Users },
  { name: "المتاجر", href: "/admin/stores", icon: Store },
  { name: "المنتجات", href: "/admin/products", icon: Package },
  { name: "طلبات الشراء", href: "/admin/purchase-requests", icon: ShoppingBag },
  { name: "المدفوعات", href: "/admin/payments", icon: CreditCard },
  { name: "الاشتراكات", href: "/admin/subscriptions", icon: Ticket },
  { name: "البنرات", href: "/admin/banners", icon: LayoutIcon },
  { name: "الشكاوى", href: "/admin/complaints", icon: ShieldAlert },
  { name: "سجل العمليات", href: "/admin/audit-logs", icon: History },
  { name: "منطقة الخطر", href: "/admin/reset", icon: AlertTriangle },
  { name: "الإعدادات", href: "/admin/settings", icon: Settings },
];

const ALLOWED_ADMIN_ROLES = ["Super Admin", "Manager", "Financial Officer", "Customer Service"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useUser();
  const { auth } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (profile && !ALLOWED_ADMIN_ROLES.includes(profile.role)) {
      toast({
        variant: "destructive",
        title: "منع الوصول",
        description: "ليس لديك صلاحية للدخول إلى منطقة الإدارة.",
      });
      router.push("/");
    }
  }, [user, profile, loading, router]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await logoutUser(auth);
      router.push("/login");
      toast({ title: "تم الخروج", description: "تم إنهاء الجلسة الإدارية بأمان." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر تسجيل الخروج." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin mb-4 text-secondary" size={64} />
        <span className="font-black text-2xl tracking-widest uppercase">جاري التحقق...</span>
      </div>
    );
  }

  if (!user || !profile || !ALLOWED_ADMIN_ROLES.includes(profile.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex font-body overflow-x-hidden">
      {/* Sidebar - Fixed on the left */}
      <aside className={cn(
        "bg-zinc-950 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-black font-black shadow-lg">S</div>
          {isSidebarOpen && <span className="font-black text-xl text-secondary">ADMIN</span>}
        </div>

        <nav className="flex-grow px-3 space-y-1 mt-6 overflow-y-auto no-scrollbar">
          {ADMIN_MENU.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-secondary text-primary font-bold shadow-lg" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} className={cn(item.name === "منطقة الخطر" && !isActive && "text-red-500")} />
                {isSidebarOpen && <span className={cn("text-sm", item.name === "منطقة الخطر" && !isActive && "text-red-500")}>{item.name}</span>}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-zinc-400 hover:text-destructive gap-3 px-4 py-6 rounded-xl hover:bg-red-500/10">
            <LogOut size={20} />
            {isSidebarOpen && <span>خروج</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content - Correct Offset */}
      <main className={cn(
        "flex-grow transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "pl-64" : "pl-20"
      )} dir="rtl">
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="rounded-xl">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r">
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{profile.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{profile.role}</p>
              </div>
              <Avatar className="w-10 h-10 border-2 border-secondary/20 rounded-xl">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

import { Ticket } from "lucide-react";
