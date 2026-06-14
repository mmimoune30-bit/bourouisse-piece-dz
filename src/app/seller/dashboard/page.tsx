"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart3, 
  Package, 
  Plus, 
  TrendingUp, 
  Users, 
  Search, 
  ChevronRight,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Total Revenue", value: "2,450,000 DZD", trend: "+12.5%", icon: <TrendingUp className="text-green-500" /> },
  { label: "Active Listings", value: "128", trend: "+4 this week", icon: <Package className="text-secondary" /> },
  { label: "Orders Monthly", value: "45", trend: "+8.2%", icon: <BarChart3 className="text-blue-500" /> },
  { label: "Client Satisfaction", value: "4.9/5", trend: "Top Tier", icon: <Users className="text-purple-500" /> },
];

const RECENT_LISTINGS = [
  { id: "L001", name: "OEM Turbocharger GT20", price: "85,000 DZD", status: "Active", views: 420, date: "2024-05-15" },
  { id: "L002", name: "Bosch Injector Set (4pcs)", price: "42,000 DZD", status: "Active", views: 185, date: "2024-05-14" },
  { id: "L003", name: "Ceramic Brake Pads - Front", price: "12,500 DZD", status: "Low Stock", views: 98, date: "2024-05-12" },
  { id: "L004", name: "Engine Control Unit (ECU)", price: "120,000 DZD", status: "Sold", views: 240, date: "2024-05-10" },
];

const RECENT_ORDERS = [
  { id: "ORD-9921", buyer: "Karim B.", amount: "15,000 DZD", status: "Processing", time: "2 hours ago" },
  { id: "ORD-9918", buyer: "Sarah M.", amount: "42,000 DZD", status: "Shipped", time: "5 hours ago" },
  { id: "ORD-9915", buyer: "Ahmed R.", amount: "8,500 DZD", status: "Delivered", time: "1 day ago" },
];

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 pt-32 pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-primary">Seller Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, <span className="font-bold text-secondary">EliteMotors DZ</span>. Here's your business at a glance.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Download Reports</Button>
            <Link href="/seller/listings/new">
              <Button className="gap-2 font-bold">
                <Plus size={18} /> New Listing
              </Button>
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {STATS.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-muted rounded-xl">
                    {stat.icon}
                  </div>
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-full",
                    stat.trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Listings Table */}
          <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-white">
              <div>
                <CardTitle>Recent Listings</CardTitle>
                <CardDescription>Manage your active inventory.</CardDescription>
              </div>
              <Button variant="ghost" className="text-secondary gap-1">
                View All <ChevronRight size={16} />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Listing</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_LISTINGS.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium pl-6">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{item.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === 'Active' ? 'default' : item.status === 'Sold' ? 'outline' : 'secondary'}
                          className={cn(
                            item.status === 'Low Stock' && "bg-amber-100 text-amber-700 border-amber-200"
                          )}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.views}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Side Panel Orders */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  Recent Orders
                  <Badge variant="outline" className="bg-secondary text-primary font-bold">New</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {RECENT_ORDERS.map((order) => (
                  <div key={order.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      order.status === 'Processing' ? "bg-amber-100 text-amber-600" : 
                      order.status === 'Shipped' ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                    )}>
                      {order.status === 'Processing' ? <Clock size={20} /> : 
                       order.status === 'Shipped' ? <Package size={20} /> : <CheckCircle size={20} />}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className="font-bold text-sm text-primary truncate">{order.buyer}</h4>
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">{order.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{order.time}</span>
                        <span className="font-bold text-secondary text-xs">{order.amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-4" variant="outline">
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary text-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle size={20} className="text-secondary" />
                  Seller Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-100/70 leading-relaxed mb-4">
                  Listings with high-quality images of the actual part sell <span className="text-secondary font-bold">3.5x faster</span> than stock photos.
                </p>
                <Button variant="secondary" className="w-full font-bold">Update Images</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}