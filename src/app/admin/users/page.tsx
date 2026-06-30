
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Plus, MoreVertical, ShieldCheck, Ban, UserPlus, 
  Edit3, CheckCircle2, Trash2, UserCog, Loader2, Mail, Shield 
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
import { collection, onSnapshot, updateDoc, deleteDoc, doc, serverTimestamp, setDoc, query, orderBy } from "firebase/firestore";
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

  // 1. جلب البيانات اللحظي (Real-time Fetching)
  useEffect(() => {
    if (!firestore) return;

    const q = query(collection(firestore, "users"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, 
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

  // 2. إضافة مستخدم (Firestore Record)
  // ملاحظة: إنشاء حساب Auth يتطلب Server-side، هنا ننشئ السجل الذي سيتم "ربطه" عند تسجيل دخول المستخدم
  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    
    // نستخدم الإيميل كمعرف مؤقت حتى يقوم المستخدم بالتسجيل الفعلي، أو نولد ID فريد
    const tempId = `user_${Date.now()}`; 

    const newUser = {
      uid: tempId,
      name,
      email,
      role: selectedRole,
      status: "Active",
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(firestore, "users", tempId), newUser);
      toast({ title: "تمت إضافة السجل", description: "تم إنشاء ملف المستخدم بنجاح في قاعدة البيانات." });
      setIsAddDialogOpen(false);
    } catch (err) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: "users", operation: "create", requestResourceData: newUser }));
    }
  };

  // 3. تحديث الحالة (Active/Blocked)
  const handleToggleStatus = (id: string, currentStatus: string) => {
    if (!firestore) return;
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
    
    updateDoc(doc(firestore, "users", id), { status: newStatus })
      .then(() => toast({ title: "تحديث الحالة", description: `تم تغيير حالة الحساب إلى ${newStatus === 'Active' ? 'نشط' : 'محظور'}.` }))
      .catch(() => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `users/${id}`, operation: "update" })));
  };

  // 4. تحديث الدور (Change Role)
  const handleUpdateRole = (id: string, newRole: string) => {
    if (!firestore) return;
    updateDoc(doc(firestore, "users", id), { role: newRole })
      .then(() => toast({ title: "تحديث الصلاحيات", description: `تم تغيير دور المستخدم إلى ${newRole}.` }))
      .catch(() => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `users/${id}`, operation: "update" })));
  };

  // 5. الحذف (Delete)
  const handleDeleteUser = (id: string) => {
    if (!firestore || !confirm("تحذير: سيتم حذف سجل المستخدم نهائياً من قاعدة البيانات. هل أنت متأكد؟")) return;
    
    deleteDoc(doc(firestore, "users", id))
      .then(() => toast({ variant: "destructive", title: "تم الحذف", description: "تمت إزالة سجل المستخدم من النظام." }))
      .catch(() => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `users/${id}`, operation: "delete" })));
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (!mounted) return (
    <div className="h-screen flex flex-col items-center justify-center font-black text-primary animate-pulse">
      <Loader2 className="animate-spin mb-4 text-secondary" size={48} />
      جاري مزامنة سجلات المستخدمين...
    </div>
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <UserCog size={32} className="text-secondary" /> إدارة الهوية والصلاحيات
          </h1>
          <p className="text-muted-foreground mt-1">التحكم في أدوار المستخدمين، حالات الحسابات، والرقابة الأمنية.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold gap-2 h-12 px-8 bg-primary shadow-xl">
              <UserPlus size={18} /> إضافة مستخدم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <form onSubmit={handleAddUser}>
              <DialogHeader>
                <DialogTitle className="text-right font-black text-xl">بيانات الحساب الجديد</DialogTitle>
                <DialogDescription className="text-right">سيتم إنشاء مستند مستخدم في Firestore مرتبط بالدور المختار.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label className="text-right block">الاسم الكامل</Label>
                  <Input name="name" placeholder="الاسم واللقب" className="h-11" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-right block">البريد الإلكتروني</Label>
                  <Input name="email" type="email" placeholder="example@mail.com" className="h-11" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-right block">الدور الوظيفي</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="اختر الدور" /></SelectTrigger>
                    <SelectContent>
                      {STANDARDIZED_ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:justify-start">
                <Button type="submit" className="font-bold w-full h-12">حفظ البيانات</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث بالاسم، البريد الإلكتروني..." 
            className="pr-10 text-right h-12 rounded-2xl border-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 h-12 px-6 flex items-center gap-3 font-black rounded-2xl">
             <ShieldCheck size={20} className="text-secondary" /> 
             {filteredUsers.length} حساب نشط في النظام
          </Badge>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[32px]">
        <Table>
          <TableHeader className="bg-zinc-50 border-b">
            <TableRow>
              <TableHead className="text-right pr-8 h-14">المستخدم</TableHead>
              <TableHead className="text-right h-14">الدور الوظيفي</TableHead>
              <TableHead className="text-right h-14">الحالة</TableHead>
              <TableHead className="text-left pl-8 h-14">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-zinc-50/50 transition-colors border-b">
                  <TableCell className="pr-8 py-4">
                    <div className="flex items-center gap-4 justify-start flex-row-reverse">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center font-black text-primary border-2 border-secondary/20 uppercase text-lg">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-black text-primary text-base">{user.name}</span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end">
                          {user.email} <Mail size={10} />
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400 mt-1">UID: {user.uid?.substring(0, 12)}...</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "font-black text-[10px] h-7 px-3 rounded-lg uppercase border-2",
                      user.role === 'Super Admin' ? "text-red-700 border-red-200 bg-red-50" : 
                      user.role === 'Seller' ? "text-amber-700 border-amber-200 bg-amber-50" : 
                      user.role === 'Financial Officer' ? "text-blue-700 border-blue-200 bg-blue-50" :
                      "text-zinc-600 border-zinc-200"
                    )}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-black text-[10px] h-7 px-4 rounded-lg",
                      user.status === "Active" ? "bg-green-600" : "bg-destructive shadow-lg shadow-destructive/20"
                    )}>
                      {user.status === 'Active' ? 'نشط' : 'محظور'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 transition-all">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64 p-2 rounded-2xl shadow-2xl border-2" dir="rtl">
                        <DropdownMenuLabel className="text-right flex items-center justify-end gap-2 text-primary">
                          خيارات الإدارة <Shield size={14} />
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem className="justify-end gap-3 cursor-pointer py-3 rounded-xl font-bold" onClick={() => handleToggleStatus(user.id, user.status)}>
                          {user.status === 'Active' ? (
                            <><span className="text-destructive">حظر الحساب فوراً</span> <Ban size={18} className="text-destructive" /></>
                          ) : (
                            <><span className="text-green-600">تنشيط الحساب</span> <CheckCircle2 size={18} className="text-green-600" /></>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        
                        <DropdownMenuLabel className="text-right text-[10px] text-muted-foreground uppercase py-2">تعديل الدور الوظيفي</DropdownMenuLabel>
                        {STANDARDIZED_ROLES.filter(r => r !== user.role).map(role => (
                          <DropdownMenuItem 
                            key={role} 
                            className="justify-end gap-3 cursor-pointer py-2 rounded-lg text-xs font-bold hover:bg-zinc-50"
                            onClick={() => handleUpdateRole(user.id, role)}
                          >
                            تعيين كـ {role}
                          </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="justify-end gap-3 cursor-pointer py-3 rounded-xl text-destructive font-black bg-red-50 hover:bg-red-100" 
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          حذف نهائي للمستند <Trash2 size={18} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-32 text-muted-foreground">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <Search size={64} />
                    <p className="text-2xl font-black">لا توجد سجلات تطابق البحث</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="bg-zinc-900 p-8 rounded-[40px] text-white flex flex-col md:flex-row-reverse items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 text-right space-y-2">
          <h3 className="text-2xl font-black flex items-center justify-end gap-3 text-secondary">
            نظام الرقابة الموحد <ShieldCheck size={28} />
          </h3>
          <p className="text-zinc-400 max-w-xl font-bold text-sm">
            كافة التغييرات التي تجريها على الأدوار أو الحالات يتم تسجيلها في سجل العمليات (Audit Logs) لضمان أعلى معايير الأمان والشفافية في إدارة الطاقم.
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <Button variant="secondary" className="font-black h-12 px-8 rounded-xl shadow-lg hover:scale-105 transition-transform">تنزيل تقرير المستخدمين</Button>
          <Button variant="outline" className="font-black h-12 px-8 rounded-xl border-white/20 text-white hover:bg-white/10 transition-all" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>العودة للأعلى</Button>
        </div>
        <ShieldCheck size={200} className="absolute -bottom-10 -left-10 opacity-5 rotate-12 scale-150" />
      </div>
    </div>
  );
}
