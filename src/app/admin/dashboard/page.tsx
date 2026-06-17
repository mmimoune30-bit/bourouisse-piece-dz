
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle
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

const STATS = [
  { label: "Total Users", value: "12,450", trend: "+12%", up: true, icon: Users, color: "bg-blue-500" },
  { label: "Active Stores", value: "854", trend: "+5%", up: true, icon: Store, color: "bg-secondary" },
  { label: "Live Products", value: "45,210", trend: "+18%", up: true, icon: Package, color: "bg-purple-500" },
  { label: "Monthly Sales", value: "4.2M DZD", trend: "-2%", up: false, icon: ShoppingBag, color: "bg-green-500" },
];

const RECENT_STORES = [
  { name: "Auto Pièces Chlef", owner: "Mohamed B.", status: "Pending", date: "2024-05-18" },
  { name: "EliteMotors DZ", owner: "Ahmed R.", status: "Approved", date: "2024-05-17" },
  { name: "Pièces Renault DZ", owner: "Sara K.", status: "Rejected", date: "2024-05-16" },
  { name: "Braking Masters", owner: "Karim L.", status: "Approved", date: "2024-05-15" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">System Overview</h1>
          <p className="text-muted-foreground">Real-time platform performance and metrics.</p>
        </div>
        <Button className="font-bold gap-2 bg-primary">
          <TrendingUp size={18} /> Export Report
        </Button>
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
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-primary mt-1">{stat.value}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Store Management Mini-Table */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-xl font-black">Store Approvals</CardTitle>
            <Button variant="ghost" className="text-secondary font-bold">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Store Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_STORES.map((store, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6 font-bold">{store.name}</TableCell>
                    <TableCell className="text-sm">{store.owner}</TableCell>
                    <TableCell>
                      <Badge variant={
                        store.status === 'Approved' ? 'default' : 
                        store.status === 'Pending' ? 'secondary' : 'destructive'
                      } className="font-bold">
                        {store.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{store.date}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="outline" size="sm" className="font-bold">Review</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Health */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span className="text-sm font-bold text-green-900">Payment Gateway</span>
                </div>
                <Badge className="bg-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <Clock className="text-amber-600" size={20} />
                  <span className="text-sm font-bold text-amber-900">Search Indexing</span>
                </div>
                <Badge className="bg-amber-600">Syncing</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-600" size={20} />
                  <span className="text-sm font-bold text-red-900">Email Server</span>
                </div>
                <Badge className="bg-red-600">Issue</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <h3 className="font-black text-xl mb-2">Platform Growth</h3>
              <p className="text-blue-100/70 text-sm mb-4">You have <span className="text-secondary font-bold">42 pending</span> store applications today. Review them to boost GMV.</p>
              <Button className="w-full bg-secondary text-primary font-black hover:bg-white transition-all">Start Review</Button>
            </CardContent>
            <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
