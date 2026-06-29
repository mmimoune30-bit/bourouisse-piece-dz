"use client";

import { useState, useEffect } from "react";
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
  UserPlus,
  Edit3,
  History,
  CheckCircle2,
  Trash2,
  UserCog
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
import { toast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const ROLES = ["Super Admin", "Manager", "Financial Officer", "Customer Service", "Moderator", "Seller", "Customer"];

export default function UserManagement() {
  const { firestore } = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Controlled Select values for Shadcn Select within standard forms
  const [newUserRole, setNewUserRole] = useState("Customer");
  const [editUserRole, setEditUserRole] = useState("");

  useEffect(() => {
    if (!firestore) return;

    const q = collection(firestore, "users");
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(data);
        setMounted(true);
      },
      async (error) => {
        const permissionError = new FirestorePermissionError({
          path: "users",
          operation: "list",
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [firestore]);

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: newUserRole,
      status: "Active",
      createdAt: serverTimestamp()
    };

    // Firebase Write Pattern 1: No await, use .catch with errorEmitter
    addDoc(collection(firestore, "users"), data)
      .then(() => {
        setIsAddDialogOpen(false);
        setNewUserRole("Customer"); // Reset role
        toast({ title: "تم الإضافة", description: "تم إنشاء حساب المستخدم الجديد بنجاح." });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: "users",
          operation: "create",
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser || !firestore) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: editUserRole,
    };

    updateDoc(doc(firestore, "users", selectedUser.id), updatedData)
      .then(() => {
        setIsEditDialogOpen(false);
        toast({ title: "تم التحديث", description: "تم تعديل بيانات المستخدم بنجاح." });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: `users/${selectedUser.id}`,
          operation: "update",
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    if (!firestore) return;
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";

    updateDoc(doc(firestore, "users", id), { status: newStatus })
      .then(() => {
        toast({
          title: newStatus === 'Blocked' ? "تم حظر الحساب" : "تم إلغاء الحظر",
          description: `تغيرت حالة الحساب إلى ${newStatus === 'Active' ? 'نشط' : 'محظور'}`,
          variant: newStatus === 'Blocked' ? 'destructive' : 'default'
        });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: `users/${id}`,
          operation: "update",
          requestResourceData: { status: newStatus },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDeleteUser = (id: string) => {
    if (!firestore || !confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً؟")) return;

    deleteDoc(doc(firestore, "users", id))
      .then(() => {
        toast({ variant: "destructive", title: "تم الحذف", description: "تمت إزالة المستخدم من النظام." });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: `users/${id}`,
          operation: "delete",
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (!mounted) return <div className="min-h-screen flex items-center justify-center font-black text-primary animate-pulse">جاري تحميل البيانات...</div>;

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <UserCog size={32} className="text-secondary" /> إدارة المستخدمين والموظفين
          </h1>
          <p className="text-muted-foreground mt-1">التحكم في الأدوار، الصلاحيات، وحالة الحسابات.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold gap-2 h-12 px-8 bg-primary shadow-xl">
              <UserPlus size={18} /> إضافة مستخدم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]" dir="rtl">
            <form onSubmit={handleAddUser}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 justify-end">
                  <UserPlus className="text-secondary" /> إنشاء حساب جديد
                </DialogTitle>
                <DialogDescription className="text-right">أدخل بيانات المستخدم الأساسية واختر دوره الوظيفي.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 text-right">
                <div className="grid gap-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input id="name" name="name" placeholder="الاسم هنا" required className="text-right" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" name="email" type="email" placeholder="email@example.com" required className="text-right" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">الدور الوظيفي</Label>
                  <Select name="role" value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger><SelectValue placeholder="اختر الدور" /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:justify-start">
                <Button type="submit" className="font-bold">حفظ بيانات الحساب</Button>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث بالاسم أو البريد الإلكتروني..." 
            className="pr-10 text-right h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-primary/5 h-11 px-4 flex items-center gap-2 font-bold">
             <ShieldCheck size={16} className="text-secondary" /> {filteredUsers.length} مستخدم مسجل
           </Badge>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50">
              <TableRow>
                <TableHead className="text-right pr-6">المستخدم</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group">
                    <TableCell className="pr-6">
                      <div className="flex items-center gap-3 justify-start flex-row-reverse">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center font-black text-primary border border-secondary/20">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="font-black text-primary">{user.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "font-black text-[10px] uppercase",
                        user.role === 'Super Admin'
                          ? "text-red-600 border-red-200 bg-red-50"
                          : user.role === 'Financial Officer'
                          ? "text-blue-600 border-blue-200 bg-blue-50"
                          : ""
                      )}>
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge className={cn(
                        "font-bold",
                        user.status === "Active" ? "bg-green-600" : "bg-destructive"
                      )}>
                        {user.status === 'Active' ? 'نشط' : 'محظور'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-left pl-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-lg"><MoreVertical size={18} /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56" dir="rtl">
                          <DropdownMenuLabel className="text-right">خيارات الإدارة</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="justify-end gap-2 cursor-pointer" onClick={() => { 
                            setSelectedUser(user); 
                            setEditUserRole(user.role || "Customer");
                            setIsEditDialogOpen(true); 
                          }}>
                            <Edit3 size={16} /> تعديل البيانات
                          </DropdownMenuItem>
                          <DropdownMenuItem className="justify-end gap-2 cursor-pointer" onClick={() => toast({ title: "سجل النشاط", description: "جاري تحميل سجل نشاط المستخدم..." })}>
                            <History size={16} /> سجل العمليات
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className={cn("justify-end gap-2 cursor-pointer font-bold", user.status === 'Active' ? "text-destructive" : "text-green-600")}
                            onClick={() => handleToggleStatus(user.id, user.status)}
                          >
                            {user.status === 'Active' ? (
                              <><Ban size={16} /> حظر الحساب</>
                            ) : (
                              <><CheckCircle2 size={16} /> إلغاء الحظر</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="justify-end gap-2 cursor-pointer text-destructive/50 hover:text-destructive" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 size={16} /> حذف نهائي
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20 text-muted-foreground font-bold">
                    لا يوجد مستخدمون مسجلون حالياً
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <form onSubmit={handleUpdateUser}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 justify-end">
                <Edit3 className="text-secondary" /> تعديل بيانات المستخدم
              </DialogTitle>
              <DialogDescription className="text-right">تحديث معلومات الحساب والصلاحيات للمستخدم: {selectedUser?.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-right">
              <div className="grid gap-2">
                <Label>الاسم الكامل</Label>
                <Input name="name" defaultValue={selectedUser?.name} required className="text-right" />
              </div>
              <div className="grid gap-2">
                <Label>البريد الإلكتروني</Label>
                <Input name="email" type="email" defaultValue={selectedUser?.email} required className="text-right" />
              </div>
              <div className="grid gap-2">
                <Label>الدور الوظيفي (الصلاحيات)</Label>
                <Select name="role" value={editUserRole} onValueChange={setEditUserRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:justify-start">
              <Button type="submit" className="font-bold">حفظ التعديلات</Button>
              <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
