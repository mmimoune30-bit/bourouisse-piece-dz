
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
import { ShieldAlert, Send, Paperclip, AlertCircle, Store, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Subscription Issue",
  "Payment Issue",
  "Customer Dispute",
  "Product Rejection",
  "Account Restriction",
  "Technical Problem",
  "Other"
];

const CATEGORY_LABELS: Record<string, string> = {
  "Subscription Issue": "مشكلة في الاشتراك",
  "Payment Issue": "مشكلة في تحصيل المدفوعات",
  "Customer Dispute": "نزاع مع مشتري",
  "Product Rejection": "رفض إعلان منتج",
  "Account Restriction": "تقييد الحساب",
  "Technical Problem": "مشكلة تقنية في الموقع",
  "Other": "أخرى"
};

export default function NewSellerComplaint() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const complaintId = `SEL-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "تم تسجيل البلاغ",
        description: `رقم البلاغ: ${complaintId}. سيقوم فريق دعم البائعين بمراجعة طلبك.`,
      });
      router.push("/seller/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 flex items-center justify-between flex-row-reverse">
             <div className="text-right">
                <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
                   دعم ومساعدة البائعين <Store size={32} className="text-secondary" />
                </h1>
                <p className="text-muted-foreground mt-1">تواصل مع إدارة المنصة لحل مشكلات المتجر أو الحساب.</p>
             </div>
             <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                <ArrowRight className="rotate-180" size={18} /> رجوع
             </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-xl">
                  <CardHeader className="bg-destructive text-white p-6 text-right">
                    <CardTitle className="text-xl">تفاصيل البلاغ</CardTitle>
                    <CardDescription className="text-white/80">رقم البلاغ التلقائي: {complaintId}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6 text-right" dir="rtl">
                    <div className="space-y-2">
                      <Label className="font-bold">عنوان البلاغ</Label>
                      <Input placeholder="أدخل ملخصاً للمشكلة" required className="h-12" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-bold">التصنيف</Label>
                        <Select required>
                          <SelectTrigger className="h-12"><SelectValue placeholder="اختر فئة المشكلة" /></SelectTrigger>
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
                            <SelectItem value="Low">عادية</SelectItem>
                            <SelectItem value="Medium">متوسطة</SelectItem>
                            <SelectItem value="High">مستعجلة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold">شرح مفصل</Label>
                      <Textarea 
                        placeholder="يرجى شرح الموقف بوضوح..." 
                        className="min-h-[200px] text-lg leading-relaxed" 
                        required 
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="font-bold">المرفقات</Label>
                      <div className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-zinc-50 transition-all cursor-pointer">
                        <Paperclip size={24} className="mb-2" />
                        <span className="text-xs font-bold">رفع صور أو مستندات تدعم بلاغك</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-right">بيانات المتجر</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-right" dir="rtl">
                    <div className="p-3 bg-zinc-50 rounded-xl border">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">المتجر</p>
                      <p className="font-bold">EliteMotors DZ</p>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-xl border">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">المالك</p>
                      <p className="font-bold">ميمون محمد</p>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-xl border">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">نوع الاشتراك</p>
                      <p className="font-black text-secondary">Gold Plan</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-primary text-white">
                  <CardContent className="p-6">
                     <h3 className="font-black text-lg mb-3 text-secondary">إرسال البلاغ</h3>
                     <p className="text-blue-100/70 text-sm mb-6 leading-relaxed">بمجرد الإرسال، سيتم تحويل طلبك مباشرة إلى القسم المختص (المالي، التقني، أو الإداري).</p>
                     <Button type="submit" disabled={loading} className="w-full h-14 bg-secondary text-primary font-black hover:bg-white text-lg gap-2">
                       {loading ? "جاري المعالجة..." : "إرسال الآن"} <Send size={20} />
                     </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
