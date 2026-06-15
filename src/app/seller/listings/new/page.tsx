
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function NewListing() {
  const [images, setImages] = useState<string[]>([]);

  const categories = ["الهيكل", "المحرك", "التوازي و التوازن", "الكهرباء", "الإطارات", "الأكسيسوارات"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-row-reverse items-center justify-between">
            <h1 className="text-3xl font-black text-primary">إضافة إعلان جديد</h1>
            <Button variant="outline" className="text-muted-foreground">حفظ كمسودة</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Info */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-destructive/5 border-b">
                  <CardTitle className="text-lg text-right">معلومات القطعة</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="space-y-2">
                    <Label>اسم القطعة / الإعلان</Label>
                    <Input placeholder="مثال: محرك كامل لسيارة VW Golf 7" className="h-12" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>الفئة</Label>
                      <Select>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat, i) => (
                            <SelectItem key={i} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>الحالة</Label>
                      <Select>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">جديد</SelectItem>
                          <SelectItem value="used">مستعمل</SelectItem>
                          <SelectItem value="scrapped">خارج الخدمة (قطع)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>السعر (دج)</Label>
                    <div className="relative">
                      <Input type="number" placeholder="0.00" className="h-12 pl-12" />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">DZD</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>وصف تفصيلي</Label>
                    <Textarea placeholder="اشرح حالة القطعة، الموديلات المتوافقة معها، وأي تفاصيل أخرى..." className="min-h-[150px]" />
                  </div>
                </CardContent>
              </Card>

              {/* Photos */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-destructive/5 border-b">
                  <CardTitle className="text-lg text-right">الصور</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-right" dir="rtl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors group">
                      <ImagePlus size={32} className="text-muted-foreground group-hover:text-secondary mb-2" />
                      <span className="text-xs font-bold text-muted-foreground">إضافة صور</span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground flex items-center justify-end gap-2">
                    يمكنك إضافة حتى 8 صور. الصور الحقيقية تزيد المبيعات بنسبة 300%.
                    <AlertCircle size={14} />
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-none shadow-sm sticky top-32">
                <CardHeader className="border-b bg-primary text-white text-right">
                  <CardTitle className="text-base">نشر الإعلان</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2 text-right">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-green-600 text-sm font-bold">مجاني</span>
                      <span className="text-sm text-muted-foreground">رسوم النشر</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t">
                      <span className="text-primary text-sm font-bold">قيد المراجعة</span>
                      <span className="text-sm text-muted-foreground">الحالة المتوقعة</span>
                    </div>
                  </div>
                  <Button className="w-full h-12 font-black shadow-lg">نشر الإعلان الآن</Button>
                  <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                    بالنقر على نشر الإعلان، فإنك توافق على <span className="underline">شروط وأحكام</span> Bourouisse PieceDz.
                  </p>
                </CardContent>
              </Card>

              <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/20 flex flex-row-reverse gap-3">
                <CheckCircle2 className="text-secondary shrink-0" size={20} />
                <div className="text-right">
                  <h4 className="font-bold text-sm text-primary">نصيحة للبائع</h4>
                  <p className="text-xs text-muted-foreground mt-1">إضافة رقم الهاتف في الوصف يسهل تواصل المشترين معك مباشرة.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
