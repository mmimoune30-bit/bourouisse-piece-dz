
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  CreditCard, 
  Save, 
  ArrowRight, 
  ImagePlus, 
  Store, 
  Ticket, 
  Calendar,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const PLANS = ["Free", "Silver", "Gold", "Professional"];
const METHODS = ["CCP", "Baridimob", "CIB", "Bank Transfer", "Cash"];

export default function CreatePaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "تم تسجيل العملية",
        description: "تمت إضافة عملية الدفع بنجاح وهي قيد المراجعة.",
      });
      router.push("/admin/payments");
    }, 1500);
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">إنشاء عملية دفع يدوية</h1>
          <p className="text-muted-foreground">تسجيل دفع مباشر أو تحويل بنكي في النظام.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowRight className="rotate-180" size={18} /> رجوع
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2 justify-end">
                <ShieldCheck size={20} className="text-secondary" /> بيانات العملية الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رقم العملية (Payment ID)</Label>
                  <Input placeholder="PAY-XXXX" defaultValue={`PAY-${Math.floor(Math.random() * 10000)}`} />
                </div>
                <div className="space-y-2">
                  <Label>تاريخ العملية</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 justify-end">
                    <Store size={14} /> المتجر المرتبط
                  </Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="اختر المتجر" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chlef">Auto Pièces Chlef</SelectItem>
                      <SelectItem value="renault">Pièces Renault DZ</SelectItem>
                      <SelectItem value="hyundai">Hyundai Parts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 justify-end">
                    <Ticket size={14} /> خطة الاشتراك
                  </Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="اختر الخطة" /></SelectTrigger>
                    <SelectContent>
                      {PLANS.map(p => <SelectItem key={p} value={p.toLowerCase()}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المبلغ (دج)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>وسيلة الدفع</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="اختر الوسيلة" /></SelectTrigger>
                    <SelectContent>
                      {METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-lg text-right">ملاحظات ووثائق</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>ملاحظات إضافية</Label>
                <Textarea placeholder="اكتب أي ملاحظات هنا..." className="min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label>تحميل صورة الوصل</Label>
                <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-zinc-50 transition-all cursor-pointer group">
                  <ImagePlus size={40} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold">انقر لرفع صورة الوصل</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl sticky top-[250px] overflow-hidden">
            <div className="bg-primary p-6 text-white text-right">
              <h3 className="font-black text-xl mb-1">الإجراء النهائي</h3>
              <p className="text-white/70 text-xs">تأكد من صحة البيانات قبل الحفظ</p>
            </div>
            <CardContent className="p-6 space-y-3">
              <Button 
                className="w-full h-14 text-lg font-black gap-2 shadow-lg"
                onClick={handleSave}
                disabled={loading}
              >
                <Save size={20} /> {loading ? "جاري الحفظ..." : "حفظ وتنشيط"}
              </Button>
              <Button variant="outline" className="w-full h-12 font-bold" onClick={() => router.back()}>
                إلغاء العملية
              </Button>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-right">
            <h4 className="font-black text-amber-800 flex items-center gap-2 justify-end mb-1 text-sm">
              <CreditCard size={16} /> تنبيه الأمان
            </h4>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              عند الضغط على "حفظ وتنشيط"، سيتم تفعيل خطة الاشتراك للمتجر المختار فوراً وتحديث تاريخ انتهاء الاشتراك.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
