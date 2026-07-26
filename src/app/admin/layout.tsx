"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Store, Package, CreditCard, 
  Settings, ShieldAlert, LogOut, Menu, X, 
  Layout as LayoutIcon, History, ShoppingBag, Loader2, AlertTriangle, Ticket, Star
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
  { name: "المتاجر المميزة", href: "/admin/featured-stores", icon: Star },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (profile && !ALLOWED_ADMIN_ROLES.includes(profile.role)) {
      toast({
        variant: "destructive",
        title: "منع الوصول",
        description: "ليس لديك صلاحية للدخول إلى منطقة الإدارة.",
      });
      router.replace("/");
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

  if (loading || !user || (user && !profile)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin mb-4 text-secondary" size={64} />
        <span className="font-black text-xl md:text-2xl tracking-widest uppercase">جاري التحقق...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex font-body overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className={cn(
        "bg-zinc-950 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl hidden md:flex",
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

      {/* Mobile Sidebar - Responsive Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
           <aside className="w-64 h-full bg-zinc-950 text-white flex flex-col p-4" onClick={e => e.stopPropagation()}>
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                 <span className="font-black text-secondary">BOUR-ADMIN</span>
                 <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}><X /></Button>
              </div>
              <nav className="flex-grow py-6 space-y-1 overflow-y-auto no-scrollbar">
                {ADMIN_MENU.map((item) => (
                  <a key={item.name} href={item.href} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl", pathname === item.href ? "bg-secondary text-primary font-bold" : "text-zinc-400")}>
                    <item.icon size={18} /> <span className="text-sm">{item.name}</span>
                  </a>
                ))}
              </nav>
              <Button variant="ghost" onClick={handleLogout} className="justify-start gap-3 py-6 rounded-xl text-zinc-400">
                <LogOut size={18} /> خروج
              </Button>
           </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className={cn(
        "flex-grow transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "md:ml-64" : "md:ml-20"
      )} dir="rtl">
        <header className="h-20 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => {
              if (window.innerWidth < 768) setIsMobileMenuOpen(true);
              else setIsSidebarOpen(!isSidebarOpen);
            }} className="rounded-xl">
              <Menu size={20} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-3 pr-2 md:pr-4 border-r">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-bold text-primary">{profile.name}</p>
                <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">{profile.role}</p>
              </div>
              <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-secondary/20 rounded-xl">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}