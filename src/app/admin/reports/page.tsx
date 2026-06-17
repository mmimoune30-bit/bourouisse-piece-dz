
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, PieChart, TrendingUp } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-primary">System Reports</h1>
        <p className="text-muted-foreground">Generate and export performance data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-secondary" />
            <h3 className="font-bold text-xl">Sales Report</h3>
          </div>
          <p className="text-sm text-muted-foreground">Detailed breakdown of all marketplace transactions and commissions.</p>
          <div className="flex gap-2">
            <Button className="gap-2"><Download size={16} /> Export PDF</Button>
            <Button variant="outline" className="gap-2"><Download size={16} /> Export Excel</Button>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <PieChart className="text-secondary" />
            <h3 className="font-bold text-xl">User Activity</h3>
          </div>
          <p className="text-sm text-muted-foreground">Statistics on user registration, login frequency, and shop engagement.</p>
          <div className="flex gap-2">
            <Button className="gap-2"><Download size={16} /> Export PDF</Button>
            <Button variant="outline" className="gap-2"><Download size={16} /> Export Excel</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
