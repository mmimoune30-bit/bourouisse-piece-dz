
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowDownRight, ArrowUpRight } from "lucide-react";

const PAYMENTS = [
  { id: "PAY-101", user: "Samir I.", amount: "5,000 DZD", type: "Subscription", status: "Approved", date: "2024-05-18" },
  { id: "PAY-102", user: "Ahmed Q.", amount: "12,000 DZD", type: "Ad Boost", status: "Pending", date: "2024-05-17" },
];

export default function PaymentManagement() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-primary">Payment Management</h1>
        <p className="text-muted-foreground">Track and verify all financial transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Revenue</p>
          <h3 className="text-2xl font-black text-green-600">1.2M DZD</h3>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Pending Payouts</p>
          <h3 className="text-2xl font-black text-amber-600">450k DZD</h3>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Commission Earned</p>
          <h3 className="text-2xl font-black text-primary">120k DZD</h3>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Transaction ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYMENTS.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-6 font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-bold">{p.user}</TableCell>
                  <TableCell className="font-black text-green-600">{p.amount}</TableCell>
                  <TableCell>{p.type}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "Approved" ? "default" : "secondary"}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 text-muted-foreground">{p.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
