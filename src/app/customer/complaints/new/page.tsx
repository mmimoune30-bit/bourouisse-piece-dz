
"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, Send, Paperclip, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Product Not Received",
  "Product Not Matching Description",
  "Damaged Product",
  "Refund Request",
  "Seller Misconduct",
  "Payment Problem",
  "Technical Problem",
  "Other"
];

const CATEGORY_LABELS: Record<string, string> = {
  "Product Not Received": "لم يتم استلام المنتج",
  "Product Not Matching Description": "المنتج غير مطابق للوصف",
  "Damaged Product": "منتج تالف",
  "Refund Request": "طلب استرجاع الأموال",
  "Seller Misconduct": "سوء سلوك من البائع",
  "Payment Problem": "مشكلة في الدفع",
  "Technical Problem": "مشكلة تقنية",
  "Other": "أخرى"
};

export default function NewCustomerComplaint() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const complaintId = `CMP-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "تم إرسال الشكوى",
        description: `رقم تتبع الشكوى الخاص بك هو ${complaintId}. سيتم الرد عليك قريباً.`,
      });
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8 flex items-center justify-between flex-row-reverse">
             <div className="text-right">
                <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
                   تقديم شكوى جديدة <ShieldAlert size={32} className="text-secondary" />
                </h1>
                <p className="text-muted-foreground mt-1">نحن هنا لضمان حقوقك وحل أي مشكلة تواجهها.</p>
             </div>
             <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                <ArrowRight className="rotate-180" size={18} /> رجوع
             </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-primary text-white p-6 text-right">
                 <CardTitle className="text-xl">بيانات الشكوى - رقم {complaintId}</CardTitle>
                 <CardDescription className="text-blue-100">يرجى ملء النموذج بدقة لسرعة المعالجة</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6 text-right" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">الاسم الكامل</Label>
                    <Input defaultValue="كريم بوعلام" readOnly className="bg-zinc-100" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">رقم الهاتف</Label>
                    <Input defaultValue="0666112233" readOnly className="bg-zinc-100" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">فئة الشكوى</Label>
                    <Select required>
                      <SelectTrigger className="h-12"><SelectValue placeholder="اختر نوع المشكلة" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{CATEGORY_LABELS[cat]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">الأولوية</Label>
                    <Select defaultValue="Medium">
                      <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">منخفضة</SelectItem>
                        <SelectItem value="Medium">متوسطة</SelectItem>
                        <SelectItem value="High">عالية</SelectItem>
                        <SelectItem value="Urgent">عاجلة جداً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">موضوع الشكوى</Label>
                  <Input placeholder="مثلاً: تأخر في استلام المحرك..." required className="h-12" />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">تفاصيل المشكلة</Label>
                  <Textarea 
                    placeholder="اشرح المشكلة بالتفصيل (رقم الطلب، اسم البائع، ما حدث بالضبط...)" 
                    className="min-h-[150px] text-lg leading-relaxed" 
                    required 
                  />
                </div>

                <div className="space-y-4">
                  <Label className="font-bold">إرفاق صور أو وثائق (اختياري)</Label>
                  <div className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-zinc-50 transition-all cursor-pointer group">
                    <Paperclip size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold">انقر أو اسحب الملفات هنا</span>
                    <span className="text-[10px] mt-1">صور المنتج، وصل الدفع، محادثات...</span>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
                  <AlertCircle className="text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    سيتم مراجعة بلاغك من قبل فريق خدمة العملاء خلال أقل من 24 ساعة عمل. يمكنك تتبع حالة الشكوى عبر حسابك الشخصي.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1 h-14 text-lg font-black gap-3 shadow-lg">
                {loading ? "جاري الإرسال..." : "إرسال الشكوى الآن"} <Send size={20} />
              </Button>
              <Button type="button" variant="outline" className="h-14 px-8 font-bold" onClick={() => router.back()}>
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
