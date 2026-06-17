
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Store, CheckCircle, XCircle, Ban, Eye } from "lucide-react";

const STORES = [
  { id: "S001", name: "Auto Pièces Chlef", owner: "Mohamed B.", status: "Approved", wilaya: "Chlef" },
  { id: "S002", name: "Pièces Renault DZ", owner: "Ahmed Q.", status: "Approved", wilaya: "Alger" },
  { id: "S003", name: "Braking Masters", owner: "Karim L.", status: "Pending", wilaya: "Oran" },
];

export default function StoreManagement() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-primary">Store Management</h1>
        <p className="text-muted-foreground">Approve, reject or moderate seller shops.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Active Store Applications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Store Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STORES.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="pl-6 font-bold">{store.name}</TableCell>
                  <TableCell>{store.owner}</TableCell>
                  <TableCell>{store.wilaya}</TableCell>
                  <TableCell>
                    <Badge variant={store.status === "Approved" ? "default" : "secondary"}>
                      {store.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 space-x-2">
                    <Button variant="outline" size="sm" className="gap-1"><Eye size={14} /> View</Button>
                    <Button variant="outline" size="sm" className="gap-1 text-green-600"><CheckCircle size={14} /> Approve</Button>
                    <Button variant="outline" size="sm" className="gap-1 text-destructive"><XCircle size={14} /> Reject</Button>
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
