
"use client";

import React from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
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
  TrendingUp,
  PlusCircle,
  Layout as LayoutIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const ADMIN_MENU = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Stores", href: "/admin/stores", icon: Store },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: Ticket },
  { name: "Plans", href: "/admin/plans", icon: Settings },
  { name: "Banners", href: "/admin/banners", icon: LayoutIcon },
  { name: "Complaints", href: "/admin/complaints", icon: ShieldAlert },
  { name: "Reports", href: "/admin/reports", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-zinc-950 text-white transition-all duration-300 flex flex-col fixed inset-y-0 z-50",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-black font-black">S</div>
          {isSidebarOpen && <span className="font-black tracking-tighter text-xl">SUPER ADMIN</span>}
        </div>

        <nav className="flex-grow px-3 space-y-1 mt-6">
          {ADMIN_MENU.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-secondary text-primary font-bold shadow-lg shadow-secondary/10" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{item.name}</span>}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-destructive gap-3 px-4 py-6 rounded-xl">
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
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <Input placeholder="Search system records..." className="pl-10 h-11 bg-zinc-50 border-none rounded-xl" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-primary leading-none">Admin Principal</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <Avatar className="w-10 h-10 border-2 border-secondary/20 rounded-xl">
                <AvatarImage src="https://picsum.photos/seed/admin/100/100" />
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
