
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  ShieldCheck, 
  Ban, 
  Key, 
  Mail,
  Filter,
  UserPlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const USERS_DATA = [
  { id: "U001", name: "Karim Boualam", email: "karim@test.com", role: "Customer", status: "Active", joined: "2024-05-10" },
  { id: "U002", name: "Samir Issawi", email: "samir@test.com", role: "Seller", status: "Active", joined: "2024-05-12" },
  { id: "U003", name: "Ahmed Qasmi", email: "ahmed@renault.dz", role: "Seller", status: "Blocked", joined: "2024-04-20" },
  { id: "U004", name: "Admin Support", email: "support@site.com", role: "Moderator", status: "Active", joined: "2024-01-01" },
  { id: "U005", name: "Finance Manager", email: "finance@site.com", role: "Financial Officer", status: "Active", joined: "2024-02-15" },
];

const ROLES = ["Super Admin", "Manager", "Financial Officer", "Customer Service", "Moderator", "Seller", "Customer"];

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to add user would go here
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">User Management</h1>
          <p className="text-muted-foreground">Manage roles, permissions, and account status.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold gap-2">
              <Plus size={18} /> Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddUser}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="text-secondary" /> Add New User
                </DialogTitle>
                <DialogDescription>
                  Create a new user account with specific roles and permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Account Role</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Initial Password</Label>
                  <Input id="password" type="password" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Account</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b bg-white p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search by name, email or ID..." 
                className="pl-10 h-11 bg-zinc-50 border-none rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="gap-2 h-11 rounded-xl">
                <Filter size={18} /> Filter
              </Button>
              <Button variant="outline" className="gap-2 h-11 rounded-xl">
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 py-4">User Details</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS_DATA.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map((user) => (
                <TableRow key={user.id} className="group hover:bg-zinc-50 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-primary">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-lg border-primary/10 text-[10px] font-black uppercase tracking-wider">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-bold",
                      user.status === 'Active' ? "bg-green-500" : "bg-destructive"
                    )}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{user.joined}</TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-3 py-3 rounded-lg">
                          <ShieldCheck size={18} className="text-blue-500" /> View Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 py-3 rounded-lg">
                          <Mail size={18} className="text-zinc-500" /> Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 py-3 rounded-lg">
                          <Key size={18} className="text-amber-500" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className={cn(
                          "gap-3 py-3 rounded-lg",
                          user.status === 'Active' ? "text-destructive hover:bg-destructive/10" : "text-green-600 hover:bg-green-50"
                        )}>
                          <Ban size={18} /> {user.status === 'Active' ? 'Block Account' : 'Unblock Account'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
