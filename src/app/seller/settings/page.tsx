
"use client";

import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, User, CreditCard, ShieldCheck, Save, ImagePlus, Globe, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function SellerSettings() {
  const router = useRouter();
  const handleSave = () => {
    toast({ title: "تم الحفظ", description: "تم تحديث بيانات المتجر بنجاح." });
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-right" dir="rtl">
            <header className="mb-10">
              <div className="flex items-center justify-end gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.push('/seller/dashboard')} className="font-bold gap-2">
                  <ChevronRight size={16} /> الرجوع للوحة التحكم
                </Button>
              </div>
              <h1 className="text-4xl font-black text-primary">إعدادات المتجر</h1>
              <p className="text-muted-foreground font-bold">إدارة ملفك التجاري، الحساب الشخصي، وتفاصيل الاشتراك.</p>
            </header>
            
            <Tabs defaultValue="store" className="space-y-8">
              <TabsList className="bg-white p-1 h-14 rounded-2xl shadow-sm border w-full md:w-auto overflow-x-auto no-scrollbar flex flex-row-reverse">
                <TabsTrigger value="store" className="font-black px-8 rounded-xl gap-2"><Store size={18} /> بيانات المتجر</TabsTrigger>
                <TabsTrigger value="account" className="font-black px-8 rounded-xl gap-2"><User size={18} /> الحساب الشخصي</TabsTrigger>
                <TabsTrigger value="subscription" className="font-black px-8 rounded-xl gap-2"><CreditCard size={18} /> الاشتراك</TabsTrigger>
              </TabsList>

              <TabsContent value="store">
                <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
                  <CardHeader className="bg-primary text-white p-8">
                    <CardTitle className="text-2xl font-black">الملف التجاري للمتجر</CardTitle>
                    <CardDescription className="text-blue-100">هذه البيانات تظهر للزبائن في صفحة المنتج والكتالوج.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-black">اسم المتجر</Label>
                        <Input defaultValue="EliteMotors DZ" className="h-12 border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black">الموقع الإلكتروني (إن وجد)</Label>
                        <Input placeholder="www.example.dz" className="h-12 border-2 text-left" dir="ltr" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-black">وصف المتجر (عن المتجر)</Label>
                      <Input defaultValue="متخصصون في قطع غيار السيارات الأصلية المستوردة من أوروبا." className="h-12 border-2" />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <Label className="font-black">شعار المتجر (Logo)</Label>
                      <div className="w-32 h-32 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-zinc-50 cursor-pointer group">
                        <ImagePlus size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black mt-2">تغيير الشعار</span>
                      </div>
                    </div>

                    <Button onClick={handleSave} className="w-full h-14 text-lg font-black gap-2 mt-4 shadow-xl bg-primary">
                      <Save size={20} /> حفظ التغييرات
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account">
                <Card className="border-none shadow-xl rounded-[32px] p-8 bg-white">
                  <h3 className="text-xl font-black mb-6">بيانات تسجيل الدخول والأمان</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-black">الاسم واللقب</Label>
                        <Input defaultValue="ميمون محمد" className="h-12 border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black">رقم الهاتف</Label>
                        <Input defaultValue="0778428977" className="h-12 border-2" />
                      </div>
                    </div>
                    <Button onClick={handleSave} className="font-black px-12 h-12 rounded-xl bg-primary">تحديث الحساب</Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="subscription">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <Card className="md:col-span-2 border-none shadow-xl rounded-[32px] p-8 bg-zinc-900 text-white">
                      <div className="flex justify-between items-start mb-10">
                         <div>
                            <Badge className="bg-secondary text-primary font-black px-4 py-1 mb-2">Gold Plan</Badge>
                            <h3 className="text-3xl font-black">باقتك الحالية</h3>
                         </div>
                         <ShieldCheck className="text-secondary" size={48} />
                      </div>
                      <div className="space-y-4 mb-8">
                         <div className="flex justify-between text-zinc-400"><span>تاريخ التجديد:</span> <span className="text-white font-bold">2024-12-18</span></div>
                         <div className="flex justify-between text-zinc-400"><span>حالة الاشتراك:</span> <span className="text-green-400 font-bold">نشط</span></div>
                      </div>
                      <Button className="w-full bg-white text-primary hover:bg-secondary font-black h-14 rounded-2xl shadow-lg">تجديد أو ترقية الباقة</Button>
                   </Card>
                   
                   <Card className="border-none shadow-xl rounded-[32px] p-8 flex flex-col items-center justify-center text-center bg-white">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                         <Globe size={32} />
                      </div>
                      <h4 className="font-black mb-2">مركز المساعدة</h4>
                      <p className="text-xs text-muted-foreground font-bold mb-6 leading-relaxed">إذا كنت تواجه مشكلة في الدفع أو التفعيل، تواصل معنا.</p>
                      <Button variant="outline" className="w-full font-black border-2 h-12 rounded-xl" onClick={() => router.push('/seller/complaints/new')}>تواصل مع الدعم</Button>
                   </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
