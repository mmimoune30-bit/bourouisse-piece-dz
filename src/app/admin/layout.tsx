
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  CreditCard, 
  Settings, 
  ShieldAlert, 
  FileText, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Ticket,
  Layout as LayoutIcon,
  ShieldCheck,
  History,
  UserPlus,
  Lock,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
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
  { name: "Employees", href: "/admin/employees", icon: UserPlus },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Stores", href: "/admin/stores", icon: Store },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: Ticket },
  { name: "Pricing Plans", href: "/admin/plans", icon: ShieldCheck },
  { name: "Banners", href: "/admin/banners", icon: LayoutIcon },
  { name: "Complaints", href: "/admin/complaints", icon: ShieldAlert },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Role & Auth Protection
    const userRole = localStorage.getItem("user_role");
    const allowedRoles = ["SuperAdmin", "Manager", "FinancialOfficer", "CustomerService"];
    
    if (!userRole) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      toast({
        variant: "destructive",
        title: "Access Denied / منع الوصول",
        description: "You do not have permission to access the administration panel. / ليس لديك صلاحية للوصول.",
      });
      router.push("/");
      return;
    }

    // Mock Admin User
    setAdminUser({
      name: "Admin Principal",
      role: userRole,
      avatar: "https://picsum.photos/seed/admin/100/100"
    });
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_role");
    router.push("/login");
    toast({ title: "Logged Out", description: "You have been logged out of the admin panel." });
  };

  if (isLoading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-black text-2xl animate-pulse">VERIFYING ACCESS...</div>;

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
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Top Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="rounded-xl">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <Input placeholder="Search system records..." className="pl-10 h-11 bg-zinc-50 border-none rounded-xl focus-visible:ring-secondary" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-4 text-xs hover:bg-zinc-50 cursor-pointer border-b">
                    <p className="font-bold text-primary">New Store Request</p>
                    <p className="text-muted-foreground mt-1">"Auto DZ" submitted a store registration.</p>
                    <span className="text-[10px] text-secondary mt-2 block">2 mins ago</span>
                  </div>
                  <div className="p-4 text-xs hover:bg-zinc-50 cursor-pointer border-b">
                    <p className="font-bold text-primary">High Priority Complaint</p>
                    <p className="text-muted-foreground mt-1">CMP-1029 requires immediate attention.</p>
                    <span className="text-[10px] text-secondary mt-2 block">1 hour ago</span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 pl-4 border-l cursor-pointer group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-primary leading-none group-hover:text-secondary transition-colors">{adminUser?.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{adminUser?.role}</p>
                  </div>
                  <Avatar className="w-10 h-10 border-2 border-secondary/20 rounded-xl group-hover:border-secondary transition-all">
                    <AvatarImage src={adminUser?.avatar} />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" dir="rtl">
                <DropdownMenuLabel className="text-right">حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-end gap-2 cursor-pointer"><UserCircle size={18} /> ملفي الشخصي</DropdownMenuItem>
                <DropdownMenuItem className="justify-end gap-2 cursor-pointer"><Settings size={18} /> إعدادات الإدارة</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="justify-end gap-2 cursor-pointer text-destructive font-bold"><LogOut size={18} /> تسجيل الخروج</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
