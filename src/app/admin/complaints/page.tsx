
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  User, 
  Calendar,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Share2,
  Send,
  Mail,
  MessageCircle,
  Copy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// --- Mock Data ---
const INITIAL_COMPLAINTS = [
  { id: "CMP-001", user: "كريم بوعلام", subject: "قطعة غير مطابقة للوصف", message: "استلمت مصباحاً أمامياً لسيارة كليو 4 ولكن تبين أنه مكسور من الجانب الداخلي.", status: "Open", date: "2024-05-18", priority: "High", phone: "0666111111" },
  { id: "CMP-002", user: "سمير عيساوي", subject: "تأخر في استلام الطلب", message: "مر أسبوع على الطلب ولم يتصل بي البائع لتأكيد التوصيل.", status: "In Progress", date: "2024-05-17", priority: "Medium", phone: "0666222222" },
  { id: "CMP-003", user: "أحمد قاسمي", subject: "منتج غير متوفر رغم الإعلان", message: "ذهبت للمحل المذكور وأخبروني أن القطعة بيعت منذ شهر.", status: "Closed", date: "2024-05-16", priority: "Low", phone: "0555222222" },
];

const STATUS_LABELS: Record<string, string> = {
  Open: "مفتوحة",
  "In Progress": "قيد المعالجة",
  Closed: "مغلقة",
};

const PRIORITY_LABELS: Record<string, string> = {
  High: "عالية",
  Medium: "متوسطة",
  Low: "منخفضة",
};

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [responseMsg, setResponseMsg] = useState("");

  // --- Handlers ---
  const handleUpdateStatus = (id: string, newStatus: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    toast({ title: "تم تحديث الحالة", description: `تغيرت حالة الشكوى إلى ${STATUS_LABELS[newStatus]}` });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل تريد حذف سجل الشكوى نهائياً؟")) {
      setComplaints(prev => prev.filter(c => c.id !== id));
      toast({ variant: "destructive", title: "تم الحذف", description: "تمت إزالة الشكوى من النظام." });
    }
  };

  const handleSendResponse = () => {
    if (!responseMsg) return;
    // Simulate sending
    toast({ title: "تم إرسال الرد", description: "تم إشعار المستخدم برد الإدارة." });
    setResponseMsg("");
    handleUpdateStatus(selectedComplaint.id, "In Progress");
  };

  const handleShareResponse = (platform: 'whatsapp' | 'sms' | 'email' | 'copy') => {
    if (!responseMsg || !selectedComplaint) {
      toast({ variant: "destructive", title: "تنبيه", description: "يرجى كتابة الرد أولاً قبل المشاركة." });
      return;
    }
    
    const fullText = `رد الإدارة بخصوص بلاغكم رقم ${selectedComplaint.id}:\n\n${responseMsg}\n\nتحياتنا، إدارة Bourouisse Piece-Dz`;
    const encodedText = encodeURIComponent(fullText);
    const phone = selectedComplaint.phone;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/${phone.startsWith('0') ? '213' + phone.substring(1) : phone}?text=${encodedText}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:${phone}?body=${encodedText}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=رد على بلاغ رقم ${selectedComplaint.id}&body=${encodedText}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(fullText);
        toast({ title: "تم النسخ", description: "تم نسخ نص الرد إلى الحافظة." });
        break;
    }
  };

  // --- Filtering & Stats ---
  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = c.user.includes(search) || c.id.includes(search) || c.subject.includes(search);
      const matchesStatus = filterStatus === "All" || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, filterStatus]);

  const stats = useMemo(() => ({
    total: complaints.length,
    open: complaints.filter(c => c.status === "Open").length,
    pending: complaints.filter(c => c.status === "In Progress").length,
  }), [complaints]);

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
          <ShieldAlert size={32} className="text-secondary" /> إدارة الشكاوى والدعم
        </h1>
        <p className="text-muted-foreground mt-1">مركز حل النزاعات وتقديم الدعم الفني للمستخدمين.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "إجمالي البلاغات", value: stats.total, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "شكاوى مفتوحة", value: stats.open, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "قيد المعالجة", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
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
            placeholder="بحث بالاسم، الرقم، أو الموضوع..." 
            className="pr-10 text-right h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Label className="text-xs font-bold whitespace-nowrap">عرض:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">الكل</SelectItem>
              <SelectItem value="Open">المفتوحة فقط</SelectItem>
              <SelectItem value="In Progress">قيد المعالجة</SelectItem>
              <SelectItem value="Closed">المغلقة</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-primary/5 h-11 px-4 flex items-center gap-2">
             {filtered.length} بلاغ
          </Badge>
        </div>
      </div>

      {/* Complaints Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50">
                <TableHead className="text-right pr-6">الرقم</TableHead>
                <TableHead className="text-right">المشتري</TableHead>
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
                  <TableCell className="font-bold">{c.user}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{c.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end text-xs">
                      <Calendar size={12} /> {c.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.status === "Open" ? "destructive" : c.status === "Closed" ? "default" : "secondary"} className="font-bold">
                      {STATUS_LABELS[c.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "font-black text-[10px]",
                      c.priority === "High" ? "text-red-600 border-red-200 bg-red-50" : 
                      c.priority === "Medium" ? "text-amber-600 border-amber-200 bg-amber-50" : 
                      "text-blue-600 border-blue-200 bg-blue-50"
                    )}>
                      {PRIORITY_LABELS[c.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left pl-6 space-x-2 space-x-reverse">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedComplaint(c)}>
                          <MessageSquare size={14} /> رد ومعالجة
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl" dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="text-right text-xl font-black flex items-center gap-2">
                             معالجة البلاغ: {selectedComplaint?.id}
                          </DialogTitle>
                          <DialogDescription className="text-right">
                             مراجعة تفاصيل الشكوى والرد على المستخدم.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                          {/* Info Section */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-zinc-50 rounded-xl border">
                              <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">صاحب الشكوى</p>
                              <p className="font-bold flex items-center gap-2"><User size={14} /> {selectedComplaint?.user}</p>
                              <p className="text-xs text-muted-foreground mt-1" dir="ltr">{selectedComplaint?.phone}</p>
                            </div>
                            <div className="p-3 bg-zinc-50 rounded-xl border">
                              <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">الأولوية</p>
                              <Badge variant="outline">{PRIORITY_LABELS[selectedComplaint?.priority]}</Badge>
                              <p className="text-[10px] text-muted-foreground mt-1">تاريخ البلاغ: {selectedComplaint?.date}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-black">موضوع الشكوى:</Label>
                            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                              <h4 className="font-bold text-primary mb-2">{selectedComplaint?.subject}</h4>
                              <p className="text-sm leading-relaxed">{selectedComplaint?.message}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                             <div className="flex justify-between items-center">
                               <Label className="font-black">إرسال رد رسمي:</Label>
                               <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                   <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-primary">
                                     <Share2 size={16} /> مشاركة الرد
                                   </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="w-48" dir="rtl">
                                   <DropdownMenuItem onClick={() => handleShareResponse('whatsapp')} className="gap-2 justify-end cursor-pointer">
                                     WhatsApp <MessageCircle size={14} className="text-green-500" />
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleShareResponse('sms')} className="gap-2 justify-end cursor-pointer">
                                     SMS <Send size={14} className="text-blue-500" />
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleShareResponse('email')} className="gap-2 justify-end cursor-pointer">
                                     البريد الإلكتروني <Mail size={14} className="text-red-500" />
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleShareResponse('copy')} className="gap-2 justify-end cursor-pointer border-t">
                                     نسخ النص <Copy size={14} />
                                   </DropdownMenuItem>
                                 </DropdownMenuContent>
                               </DropdownMenu>
                             </div>
                             <Textarea 
                              placeholder="اكتب ردك هنا ليرسل للمستخدم..." 
                              className="min-h-[100px] text-right"
                              value={responseMsg}
                              onChange={(e) => setResponseMsg(e.target.value)}
                             />
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                             <Label className="font-black whitespace-nowrap">تغيير الحالة إلى:</Label>
                             <div className="flex gap-2">
                               <Button size="sm" variant={selectedComplaint?.status === 'In Progress' ? 'default' : 'outline'} onClick={() => handleUpdateStatus(selectedComplaint.id, 'In Progress')}>
                                 قيد المعالجة
                               </Button>
                               <Button size="sm" variant={selectedComplaint?.status === 'Closed' ? 'default' : 'outline'} className="text-green-600 border-green-200" onClick={() => handleUpdateStatus(selectedComplaint.id, 'Closed')}>
                                 إغلاق وحل
                               </Button>
                             </div>
                          </div>
                        </div>

                        <DialogFooter className="gap-2 sm:justify-start">
                          <Button className="font-black gap-2" onClick={handleSendResponse}>
                            إرسال الرد وتحديث <MessageSquare size={16} />
                          </Button>
                          <DialogClose asChild>
                            <Button variant="outline">إغلاق</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                     <div className="flex flex-col items-center gap-2 opacity-30">
                        <MessageSquare size={48} />
                        <p>لا توجد شكاوى مطابقة للبحث</p>
                     </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="bg-zinc-900 p-6 rounded-3xl text-white flex flex-row-reverse items-center justify-between shadow-xl overflow-hidden relative">
        <div className="relative z-10 text-right">
          <h3 className="text-xl font-black mb-1 flex items-center justify-end gap-2 text-secondary">
            ميثاق الجودة والدعم <CheckCircle2 className="text-green-400" />
          </h3>
          <p className="text-sm text-zinc-400">يجب الرد على جميع البلاغات "عالية الأولوية" خلال أقل من 12 ساعة عمل.</p>
        </div>
        <Button variant="secondary" className="font-black gap-2">
          تصدير تقرير الشكاوى <Clock size={16} />
        </Button>
        <div className="absolute -bottom-6 -left-6 opacity-5 rotate-12">
          <ShieldAlert size={140} />
        </div>
      </div>
    </div>
  );
}
