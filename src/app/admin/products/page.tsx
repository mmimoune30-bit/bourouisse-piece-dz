
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Trash2, Edit, CheckCircle } from "lucide-react";

const PRODUCTS = [
  { id: "P001", name: "مصباح أمامي أيمن Clio 4", price: "8500 DZD", store: "Auto Pièces Chlef", status: "Active" },
  { id: "P002", name: "رادياتور Peugeot 208", price: "12000 DZD", store: "Pièces Renault DZ", status: "Active" },
];

export default function ProductManagement() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-primary">Product Moderation</h1>
        <p className="text-muted-foreground">Review and manage all part listings across the platform.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Live Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Product Name</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRODUCTS.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="pl-6 font-bold">{product.name}</TableCell>
                  <TableCell>{product.store}</TableCell>
                  <TableCell className="font-mono text-secondary">{product.price}</TableCell>
                  <TableCell className="text-right pr-6 space-x-2">
                    <Button variant="outline" size="sm" className="gap-1"><Edit size={14} /> Edit</Button>
                    <Button variant="outline" size="sm" className="gap-1 text-destructive"><Trash2 size={14} /> Delete</Button>
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
