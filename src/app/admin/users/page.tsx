
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Plus, MoreVertical, ShieldCheck, Ban, UserPlus, 
  Edit3, History, CheckCircle2, Trash2, UserCog, Loader2 
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
import { collection, onSnapshot, updateDoc, deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const STANDARDIZED_ROLES = [
  "Super Admin", 
  "Manager", 
  "Financial Officer", 
  "Customer Service", 
  "Seller", 
  "Customer"
];

export default function UserManagement() {
  const { firestore } = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Customer");

  useEffect(() => {
    if (!firestore) return;

    const unsubscribe = onSnapshot(collection(firestore, "users"), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(data);
        setMounted(true);
      },
      async (error) => {
        const permissionError = new FirestorePermissionError({ path: "users", operation: "list" });
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [firestore]);

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    
    // ملاحظة تقنية: في البيئة الحقيقية، نحتاج UID من Firebase Auth. 
    // هنا نقوم بإنشاء سجل تمهيدي في Firestore بانتظار تسجيل دخول المستخدم الحقيقي.
    // المعرف هنا سيكون الإيميل مؤقتاً أو UID يدوياً إذا توفر.
    const tempUid = `temp_${Date.now()}`; 

    const newUser = {
      uid: tempUid,
      name,
      email,
      role: selectedRole,
      status: "Active",
      createdAt: serverTimestamp()
    };

    try {
      // استخدام setDoc مع المعرف المحدد لضمان النظام
      await setDoc(doc(firestore, "users", tempUid), newUser);
      toast({ title: "تمت الإضافة", description: "تم إنشاء سجل المستخدم بنجاح." });
      setIsAddDialogOpen(false);
    } catch (err) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: "users", operation: "write", requestResourceData: newUser }));
    }
  };

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    if (!firestore) return;
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
    updateDoc(doc(firestore, "users", id), { status: newStatus })
      .then(() => toast({ title: "تم التحديث", description: "تغيرت حالة الحساب بنجاح." }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `users/${id}`, operation: "update" })));
  };

  const handleDeleteUser = (id: string) => {
    if (!firestore || !confirm("حذف نهائي للمستخدم؟")) return;
    deleteDoc(doc(firestore, "users", id))
      .then(() => toast({ variant: "destructive", title: "تم الحذف", description: "تمت إزالة سجل المستخدم." }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `users/${id}`, operation: "delete" })));
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (!mounted) return (
    <div className="h-96 flex items-center justify-center font-black text-primary animate-pulse">
      <Loader2 className="animate-spin mr-2" /> جاري تحميل قاعدة بيانات المستخدمين...
    </div>
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <UserCog size={32} className="text-secondary" /> سجل الحسابات الموحد
          </h1>
          <p className="text-muted-foreground mt-1">إدارة الصلاحيات، الأدوار، والرقابة على الحسابات.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold gap-2 h-12 px-8 bg-primary">
              <UserPlus size={18} /> إضافة مستخدم يدوي
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <form onSubmit={handleAddUser}>
              <DialogHeader>
                <DialogTitle className="text-right font-black">إضافة مستخدم جديد</DialogTitle>
                <DialogDescription className="text-right">سيتم إنشاء سجل بيانات للمستخدم في Firestore.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label className="text-right block">الاسم الكامل</Label>
                  <Input name="name" placeholder="الاسم واللقب" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-right block">البريد الإلكتروني</Label>
                  <Input name="email" type="email" placeholder="example@mail.com" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-right block">الدور الوظيفي</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STANDARDIZED_ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:justify-start">
                <Button type="submit" className="font-bold">حفظ البيانات</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث بالاسم أو البريد..." 
            className="pr-10 text-right h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="bg-primary/5 h-11 px-4 flex items-center gap-2 font-bold">
           <ShieldCheck size={16} className="text-secondary" /> {filteredUsers.length} حساب مسجل
        </Badge>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="text-right pr-6">المستخدم</TableHead>
              <TableHead className="text-right">الدور الوظيفي</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-left pl-6">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="pr-6">
                    <div className="flex items-center gap-3 justify-start flex-row-reverse">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center font-black text-primary border border-secondary/20 uppercase">
                        {user.name?.charAt(0)}
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-black text-primary">{user.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "font-black text-[10px]",
                      user.role === 'Super Admin' ? "text-red-600 border-red-200 bg-red-50" : 
                      user.role === 'Seller' ? "text-amber-600 border-amber-200 bg-amber-50" : ""
                    )}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.status === "Active" ? "bg-green-600" : "bg-destructive"}>
                      {user.status === 'Active' ? 'نشط' : 'محظور'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical size={18} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56" dir="rtl">
                        <DropdownMenuLabel className="text-right">إدارة الحساب</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-end gap-2 cursor-pointer" onClick={() => handleUpdateStatus(user.id, user.status)}>
                          {user.status === 'Active' ? <><Ban size={16} /> حظر</> : <><CheckCircle2 size={16} /> تنشيط</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="justify-end gap-2 cursor-pointer text-destructive" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 size={16} /> حذف نهائي
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-muted-foreground">لا توجد سجلات مطابقة</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
