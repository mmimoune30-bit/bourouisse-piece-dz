
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Store, Package, CreditCard, 
  Settings, ShieldAlert, FileText, LogOut, Menu, X, 
  Bell, Search, Ticket, Layout as LayoutIcon, ShieldCheck, 
  History, UserPlus, ShoppingBag, UserCircle, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";
import { logoutUser } from "@/services/auth-service";
import { useAuth } from "@/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ADMIN_MENU = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Stores", href: "/admin/stores", icon: Store },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Purchase Requests", href: "/admin/purchase-requests", icon: ShoppingBag },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: Ticket },
  { name: "Pricing Plans", href: "/admin/plans", icon: ShieldCheck },
  { name: "Banners", href: "/admin/banners", icon: LayoutIcon },
  { name: "Complaints", href: "/admin/complaints", icon: ShieldAlert },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
  { name: "Settings", href: "/admin/settings", icon: Settings },
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

    // إذا لم يكن هناك مستخدم مسجل
    if (!user) {
      router.push("/login");
      return;
    }

    // إذا اكتمل التحميل ولم يتم العثور على ملف شخصي أو الدور غير مسموح به
    if (!profile || !ALLOWED_ADMIN_ROLES.includes(profile.role)) {
      toast({
        variant: "destructive",
        title: "منع الوصول",
        description: "ليس لديك صلاحية للدخول إلى لوحة التحكم الإدارية.",
      });
      router.push("/");
    }
  }, [user, profile, loading, router]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await logoutUser(auth);
      router.push("/login");
      toast({ title: "تم تسجيل الخروج", description: "تم الخروج من لوحة الإدارة بأمان." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل تسجيل الخروج." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-black text-2xl animate-pulse">
        <Loader2 className="animate-spin mb-4 text-secondary" size={48} />
        <span className="tracking-widest">تحقق من الصلاحيات...</span>
      </div>
    );
  }

  // منع وميض المحتوى قبل إعادة التوجيه
  if (!user || !profile || !ALLOWED_ADMIN_ROLES.includes(profile.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-zinc-950 text-white transition-all duration-300 flex flex-col fixed inset-y-0 z-50",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-black font-black shadow-lg shadow-secondary/20">S</div>
          {isSidebarOpen && <span className="font-black tracking-tighter text-xl text-secondary">SUPER ADMIN</span>}
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
                    ? "bg-secondary text-primary font-bold shadow-lg shadow-secondary/10" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{item.name}</span>}
                {!isSidebarOpen && isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-l-full" />}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-zinc-400 hover:text-destructive gap-3 px-4 py-6 rounded-xl hover:bg-red-500/10">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-grow transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "mr-64" : "mr-20"
      )} dir="rtl">
        {/* Top Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="rounded-xl">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-primary leading-none group-hover:text-secondary transition-colors">{profile.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{profile.role}</p>
              </div>
              <Avatar className="w-10 h-10 border-2 border-secondary/20 rounded-xl">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
