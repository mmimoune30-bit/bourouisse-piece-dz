
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Search, 
  Trash2, 
  User, 
  Calendar,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Send,
  Mail,
  MessageCircle,
  Copy,
  ChevronDown,
  History,
  Paperclip,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// --- Mock Initial Data ---
const INITIAL_COMPLAINTS = [
  { 
    id: "CMP-001", 
    user: "كريم بوعلام", 
    userType: "customer",
    subject: "قطعة غير مطابقة للوصف", 
    category: "Product Not Matching Description",
    message: "استلمت مصباحاً أمامياً لسيارة كليو 4 ولكن تبين أنه مكسور من الجانب الداخلي.", 
    status: "New", 
    date: "2024-05-18", 
    priority: "High", 
    phone: "0666111111",
    assignedTo: "غير معين",
    responses: []
  },
  { 
    id: "CMP-002", 
    user: "سمير عيساوي", 
    userType: "customer",
    subject: "تأخر في استلام الطلب", 
    category: "Product Not Received",
    message: "مر أسبوع على الطلب ولم يتصل بي البائع لتأكيد التوصيل.", 
    status: "Under Review", 
    date: "2024-05-17", 
    priority: "Medium", 
    phone: "0666222222",
    assignedTo: "كريم قادري",
    responses: []
  },
  { 
    id: "SEL-001", 
    user: "EliteMotors DZ", 
    userType: "seller",
    subject: "مشكلة في تفعيل باقة Gold", 
    category: "Subscription Issue",
    message: "قمت بالدفع عبر Baridimob منذ 4 ساعات ولم يتغير نوع الحساب في لوحة التحكم.", 
    status: "Waiting Seller", 
    date: "2024-05-18", 
    priority: "Urgent", 
    phone: "0555333333",
    assignedTo: "سميرة بوحفص",
    responses: []
  },
];

const STATUS_LABELS: Record<string, string> = {
  "New": "جديد",
  "Under Review": "قيد المراجعة",
  "Waiting Customer": "في انتظار المشتري",
  "Waiting Seller": "في انتظار البائع",
  "Resolved": "تم الحل",
  "Closed": "مغلقة",
};

const PRIORITY_LABELS: Record<string, string> = {
  "Urgent": "عاجلة جداً",
  "High": "عالية",
  "Medium": "متوسطة",
  "Low": "منخفضة",
};

const EMPLOYEES = ["كريم قادري", "سميرة بوحفص", "يوسف حمدي", "ميمون محمد"];

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [responseMsg, setResponseMsg] = useState("");
  const [internalNote, setInternalNote] = useState("");

  // --- Core Handlers ---
  const handleUpdateStatus = (id: string, newStatus: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    toast({ title: "تم تحديث الحالة", description: `تغيرت حالة الشكوى إلى ${STATUS_LABELS[newStatus]}` });
  };

  const handleAssign = (id: string, employee: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, assignedTo: employee, status: "Under Review" } : c));
    toast({ title: "تم تعيين الموظف", description: `تم إسناد الشكوى إلى ${employee}` });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل تريد حذف سجل الشكوى نهائياً؟ لا يمكن التراجع عن هذا الإجراء.")) {
      setComplaints(prev => prev.filter(c => c.id !== id));
      toast({ variant: "destructive", title: "تم الحذف بنجاح", description: "تمت إزالة سجل الشكوى من قاعدة البيانات." });
    }
  };

  const handleSendResponse = (platform: 'system' | 'whatsapp' | 'sms' | 'email' | 'copy' = 'system') => {
    if (!responseMsg) {
      toast({ variant: "destructive", title: "تنبيه", description: "يرجى كتابة نص الرد أولاً." });
      return;
    }

    const fullText = `رد الإدارة بخصوص بلاغكم رقم ${selectedComplaint.id}:\n\n${responseMsg}\n\nتحياتنا، إدارة Bourouisse Piece-Dz`;
    const phone = selectedComplaint.phone;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/${phone.startsWith('0') ? '213' + phone.substring(1) : phone}?text=${encodeURIComponent(fullText)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:${phone}?body=${encodeURIComponent(fullText)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=رد على بلاغ رقم ${selectedComplaint.id}&body=${encodeURIComponent(fullText)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(fullText);
        toast({ title: "تم النسخ", description: "تم نسخ نص الرد إلى الحافظة." });
        return;
    }

    toast({ title: "تم إرسال الرد", description: `تم إشعار المستخدم وتحديث حالة البلاغ.` });
    handleUpdateStatus(selectedComplaint.id, "Waiting Customer");
    setResponseMsg("");
  };

  // --- Filtering & Stats ---
  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = c.user.toLowerCase().includes(search.toLowerCase()) || 
                          c.id.toLowerCase().includes(search.toLowerCase()) || 
                          c.subject.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "All" || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, filterStatus]);

  const stats = useMemo(() => ({
    total: complaints.length,
    new: complaints.filter(c => c.status === "New").length,
    open: complaints.filter(c => ["Under Review", "Waiting Customer", "Waiting Seller"].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === "Resolved" || c.status === "Closed").length,
  }), [complaints]);

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <ShieldAlert size={32} className="text-secondary" /> مركز إدارة الشكاوى (CRM)
          </h1>
          <p className="text-muted-foreground mt-1">إدارة نزاعات المشترين وبلاغات البائعين والدعم الفني.</p>
        </div>
        <Button variant="outline" className="font-bold gap-2">
          <History size={18} /> سجل العمليات الإدارية
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "إجمالي البلاغات", value: stats.total, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "بلاغات جديدة", value: stats.new, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "قيد المعالجة", value: stats.open, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "تم الحل", value: stats.resolved, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase">{s.label}</p>
                <h3 className={cn("text-3xl font-black mt-1", s.color)}>{s.value}</h3>
              </div>
              <div className={cn("p-4 rounded-2xl", s.bg)}>
                <s.icon size={28} className={s.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث بالاسم، رقم البلاغ، أو الموضوع..." 
            className="pr-10 text-right h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Label className="text-xs font-bold whitespace-nowrap">عرض الحالة:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-44 h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">كل البلاغات</SelectItem>
              {Object.keys(STATUS_LABELS).map(key => (
                <SelectItem key={key} value={key}>{STATUS_LABELS[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-primary/5 h-11 px-4 flex items-center gap-2">
             {filtered.length} بلاغ متاح
          </Badge>
        </div>
      </div>

      {/* Complaints Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50">
                <TableHead className="text-right pr-6">رقم البلاغ</TableHead>
                <TableHead className="text-right">المرسل / الدور</TableHead>
                <TableHead className="text-right">الموضوع</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الأولوية</TableHead>
                <TableHead className="text-left pl-6">الإجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="group">
                  <TableCell className="pr-6 font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-right">
                      <span className="font-bold flex items-center gap-2">
                        {c.user} {c.userType === 'seller' && <Badge variant="outline" className="text-[9px] h-4 bg-secondary/10 border-secondary/20">متجر</Badge>}
                      </span>
                      <span className="text-[10px] text-muted-foreground">المسؤول: {c.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate font-medium">{c.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end text-xs">
                      <Calendar size={12} /> {c.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-bold",
                      c.status === "New" ? "bg-red-500" : 
                      c.status === "Under Review" ? "bg-amber-500" : 
                      c.status === "Resolved" ? "bg-green-600" : "bg-zinc-500"
                    )}>
                      {STATUS_LABELS[c.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "font-black text-[10px]",
                      c.priority === "Urgent" ? "text-red-700 border-red-300 bg-red-50 animate-pulse" : 
                      c.priority === "High" ? "text-red-600 border-red-200 bg-red-50" : 
                      c.priority === "Medium" ? "text-amber-600 border-amber-200 bg-amber-50" : 
                      "text-blue-600 border-blue-200 bg-blue-50"
                    )}>
                      {PRIORITY_LABELS[c.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6">
                    <div className="flex items-center gap-2 justify-start">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2 font-bold" onClick={() => {
                            setSelectedComplaint(c);
                            setResponseMsg("");
                          }}>
                            <MessageSquare size={14} /> معالجة
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                          <DialogHeader>
                            <DialogTitle className="text-right text-2xl font-black flex items-center gap-3 border-b pb-4">
                               تفاصيل البلاغ: {selectedComplaint?.id} 
                               <Badge className={selectedComplaint?.status === 'New' ? 'bg-red-500' : 'bg-amber-500'}>
                                 {STATUS_LABELS[selectedComplaint?.status]}
                               </Badge>
                            </DialogTitle>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
                             {/* Complainant Info */}
                             <div className="space-y-6 md:border-l pl-4">
                                <section className="space-y-3">
                                  <h3 className="font-black text-primary flex items-center gap-2">
                                    <User size={18} className="text-secondary" /> بيانات صاحب البلاغ
                                  </h3>
                                  <div className="bg-zinc-50 p-4 rounded-2xl border text-sm space-y-2">
                                    <div className="flex justify-between"><span>الاسم:</span> <span className="font-bold">{selectedComplaint?.user}</span></div>
                                    <div className="flex justify-between"><span>الدور:</span> <Badge variant="secondary">{selectedComplaint?.userType === 'customer' ? 'مشتري' : 'بائع'}</Badge></div>
                                    <div className="flex justify-between"><span>الهاتف:</span> <span className="font-mono">{selectedComplaint?.phone}</span></div>
                                    <div className="flex justify-between"><span>التاريخ:</span> <span>{selectedComplaint?.date}</span></div>
                                  </div>
                                </section>

                                <section className="space-y-3">
                                  <h3 className="font-black text-primary flex items-center gap-2">
                                    <UserPlus size={18} className="text-secondary" /> التعيين والمتابعة
                                  </h3>
                                  <Select onValueChange={(v) => handleAssign(selectedComplaint.id, v)} defaultValue={selectedComplaint?.assignedTo}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="تعيين موظف..." /></SelectTrigger>
                                    <SelectContent>
                                      {EMPLOYEES.map(emp => <SelectItem key={emp} value={emp}>{emp}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                  <div className="pt-2">
                                    <Label className="text-xs font-bold mb-1 block">تغيير الحالة يدوياً:</Label>
                                    <div className="grid grid-cols-2 gap-1">
                                      {Object.keys(STATUS_LABELS).map(key => (
                                        <Button 
                                          key={key} 
                                          size="sm" 
                                          variant={selectedComplaint?.status === key ? 'default' : 'outline'} 
                                          className="text-[10px] h-8"
                                          onClick={() => handleUpdateStatus(selectedComplaint.id, key)}
                                        >
                                          {STATUS_LABELS[key]}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </section>
                             </div>

                             {/* Message & Actions */}
                             <div className="md:col-span-2 space-y-6">
                                <section className="space-y-2">
                                  <Label className="font-black text-lg">موضوع الشكوى:</Label>
                                  <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl">
                                    <h4 className="font-black text-primary text-xl mb-3">{selectedComplaint?.subject}</h4>
                                    <p className="text-base leading-relaxed text-zinc-700">{selectedComplaint?.message}</p>
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                     <Badge variant="outline" className="gap-1"><Paperclip size={12} /> مرفق_1.jpg</Badge>
                                     <Badge variant="outline" className="gap-1"><Paperclip size={12} /> الوصل.pdf</Badge>
                                  </div>
                                </section>

                                <section className="space-y-4 pt-4 border-t">
                                  <div className="flex justify-between items-center">
                                    <Label className="font-black text-lg">كتابة رد رسمي:</Label>
                                    <span className="text-[10px] text-muted-foreground">سيصل هذا الرد للمستخدم مباشرة</span>
                                  </div>
                                  <Textarea 
                                    placeholder="اكتب ردك هنا للمستخدم..." 
                                    className="min-h-[150px] text-lg leading-relaxed shadow-inner"
                                    value={responseMsg}
                                    onChange={(e) => setResponseMsg(e.target.value)}
                                  />
                                  
                                  <div className="flex flex-wrap gap-2">
                                    <div className="flex w-full sm:w-auto gap-1">
                                      <Button 
                                        className="flex-grow font-black gap-2 rounded-l-none h-12 px-8" 
                                        onClick={() => handleSendResponse('system')}
                                      >
                                        إرسال وتحديث <Send size={18} />
                                      </Button>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button className="px-3 rounded-r-none border-r border-white/20 h-12">
                                            <ChevronDown size={18} />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-64" dir="rtl">
                                          <DropdownMenuLabel className="text-right">وسيلة الإرسال الخارجية</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => handleSendResponse('whatsapp')} className="gap-3 justify-end cursor-pointer py-3 font-bold">
                                             WhatsApp <MessageCircle size={18} className="text-green-500" />
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleSendResponse('sms')} className="gap-3 justify-end cursor-pointer py-3 font-bold">
                                             رسالة قصيرة SMS <Send size={18} className="text-blue-500" />
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleSendResponse('email')} className="gap-3 justify-end cursor-pointer py-3 font-bold">
                                             بريد إلكتروني <Mail size={18} className="text-red-500" />
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => handleSendResponse('copy')} className="gap-3 justify-end cursor-pointer py-3">
                                             نسخ النص فقط <Copy size={18} />
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                    <Button variant="outline" className="h-12 border-green-200 text-green-700 hover:bg-green-50 gap-2 font-bold" onClick={() => handleUpdateStatus(selectedComplaint.id, "Resolved")}>
                                      <CheckCircle2 size={18} /> تم حل المشكلة نهائياً
                                    </Button>
                                  </div>
                                </section>

                                <section className="pt-4 border-t space-y-2">
                                   <Label className="font-bold text-xs text-muted-foreground uppercase">ملاحظات إدارية داخلية (لا تظهر للمستخدم):</Label>
                                   <div className="flex gap-2">
                                      <Input placeholder="أضف ملاحظة للفريق..." className="h-10" />
                                      <Button variant="secondary" size="sm">إضافة</Button>
                                   </div>
                                </section>
                             </div>
                          </div>

                          <DialogFooter className="border-t pt-4 sm:justify-start">
                             <DialogClose asChild><Button variant="secondary" className="font-bold">إغلاق النافذة</Button></DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-red-50 transition-colors" 
                        title="حذف الشكوى"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                     <div className="flex flex-col items-center gap-3 opacity-30">
                        <ShieldAlert size={64} />
                        <p className="text-xl font-bold">لا توجد شكاوى مطابقة لمعايير البحث</p>
                     </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CRM Footer */}
      <div className="bg-zinc-900 p-8 rounded-[32px] text-white flex flex-col md:flex-row-reverse items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 text-right space-y-1">
          <h3 className="text-2xl font-black flex items-center justify-end gap-3 text-secondary">
            ميثاق جودة الخدمة <CheckCircle2 className="text-green-400" />
          </h3>
          <p className="text-zinc-400 max-w-xl">
            يجب الاستجابة للبلاغات "العاجلة" في أقل من 4 ساعات، والبلاغات "العادية" في أقل من 24 ساعة لضمان استمرارية ثقة المستخدمين في المنصة.
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <Button variant="secondary" className="font-black px-8 h-12 shadow-lg">تحميل تقرير الأداء الشهري</Button>
        </div>
        <div className="absolute -bottom-10 -left-10 opacity-5 rotate-12 scale-150">
          <ShieldAlert size={200} />
        </div>
      </div>
    </div>
  );
}
