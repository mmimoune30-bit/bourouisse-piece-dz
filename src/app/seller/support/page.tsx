
"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    HelpCircle,
    Send,
    Paperclip,
    MessageSquare,
    History,
    CheckCircle,
    Clock,
    ShieldAlert,
    ArrowRight,
    ChevronRight,
    Store,
    User,
  } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MOCK_TICKETS = [
  { id: "T-9912", subject: "مشكلة في تفعيل باقة Gold", status: "Resolved", date: "2024-05-10", lastMsg: "تم تفعيل حسابك، شكراً لصبرك." },
  { id: "T-9988", subject: "استفسار عن عمولات المبيعات", status: "Pending", date: "2024-05-18", lastMsg: "جاري مراجعة طلبك من القسم المالي." },
];

export default function SupportCenter() {
  const router = useRouter();
  const [view, setView] = useState<"list" | "new">("list");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "تم إرسال التذكرة", description: "سيقوم فريق الدعم بالرد عليك قريباً." });
      setView("list");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl text-right" dir="rtl">
          <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black text-primary flex items-center justify-end gap-3">
                 مركز الدعم والمساعدة <HelpCircle size={40} className="text-secondary" />
              </h1>
              <p className="text-muted-foreground font-bold">نحن هنا لمساعدتك في نجاح متجرك.</p>
            </div>
            {view === "list" ? (
              <Button className="h-12 px-8 font-black gap-2" onClick={() => setView("new")}>
                <MessageSquare size={18} /> فتح تذكرة جديدة
              </Button>
            ) : (
              <Button variant="ghost" className="font-bold gap-2" onClick={() => setView("list")}>
                الرجوع للقائمة <ArrowRight size={18} className="rotate-180" />
              </Button>
            )}
          </header>

          {view === "list" ? (
            <div className="grid grid-cols-1 gap-6">
               <h3 className="font-black text-xl border-r-4 border-secondary pr-4 mb-2 text-primary">تذاكري السابقة</h3>
               {MOCK_TICKETS.map((t) => (
                 <Card key={t.id} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
                   <CardContent className="p-6 flex flex-col md:flex-row-reverse items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 text-right">
                         <div className="flex items-center gap-3 justify-end">
                            <Badge variant="outline" className="font-mono text-[10px]">{t.id}</Badge>
                            <h4 className="font-black text-lg text-primary group-hover:text-secondary transition-colors">{t.subject}</h4>
                         </div>
                         <p className="text-sm text-muted-foreground font-bold truncate max-w-md">{t.lastMsg}</p>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase">{t.date}</p>
                            <Badge className={cn("font-bold mt-1", t.status === 'Resolved' ? "bg-green-600" : "bg-amber-500")}>
                              {t.status === 'Resolved' ? 'تم الحل' : 'قيد الانتظار'}
                            </Badge>
                         </div>
                         <Button variant="ghost" size="icon" className="rounded-full"><ChevronRight size={20} className="rotate-180" /></Button>
                      </div>
                   </CardContent>
                 </Card>
               ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
               <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
                  <CardHeader className="bg-primary text-white p-8">
                    <CardTitle className="text-2xl font-black">تفاصيل المشكلة</CardTitle>
                    <CardDescription className="text-blue-100">اشرح مشكلتك بوضوح لسرعة المعالجة.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                     <div className="space-y-2">
                        <Label className="font-black">عنوان الموضوع</Label>
                        <Input placeholder="مثلاً: مشكلة في رفع الصور..." required className="h-12 border-2" />
                     </div>
                     <div className="space-y-2">
                        <Label className="font-black">وصف المشكلة</Label>
                        <Textarea placeholder="اكتب تفاصيل ما حدث معك..." className="min-h-[150px] border-2 text-lg" required />
                     </div>
                     <div className="border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-50 cursor-pointer">
                        <Paperclip size={32} className="mb-2" />
                        <span className="text-xs font-black">إرفاق لقطة شاشة (Screenshot)</span>
                     </div>
                     <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-black bg-primary shadow-xl">
                        {loading ? "جاري الإرسال..." : "إرسال التذكرة الآن"}
                     </Button>
                  </CardContent>
               </Card>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

