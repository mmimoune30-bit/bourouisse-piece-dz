
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertCircle } from "lucide-react";

const COMPLAINTS = [
  { id: "CMP-001", user: "Karim B.", subject: "Delayed Shipping", status: "Open", date: "2024-05-18" },
  { id: "CMP-002", user: "Samir E.", subject: "Wrong Part Received", status: "In Progress", date: "2024-05-17" },
];

export default function ComplaintsManagement() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-primary">Complaints & Support</h1>
        <p className="text-muted-foreground">Manage user reports and platform disputes.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Complaint ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPLAINTS.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="pl-6 font-mono">{c.id}</TableCell>
                  <TableCell className="font-bold">{c.user}</TableCell>
                  <TableCell>{c.subject}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "Open" ? "destructive" : "secondary"}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="outline" size="sm">Resolve</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
