
"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Store, User, CreditCard, ShieldCheck, Save, ImagePlus, 
  ChevronRight, CheckCircle, Package, Clock, Zap, AlertTriangle, ArrowLeft, Upload
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { differenceInDays } from "date-fns";

const AVAILABLE_PLANS = [
  { id: "silver", name: "الباقة الفضية (Silver)", price: 3000, duration: "30 يوم", limit: "50 إعلان", images: "5 صور/إعلان", color: "bg-zinc-100 text-zinc-700" },
  { id: "gold", name: "الباقة الذهبية (Gold)", price: 5000, duration: "30 يوم", limit: "غير محدود", images: "10 صور/إعلان", color: "bg-amber-100 text-amber-700" },
  { id: "professional", name: "الباقة الاحترافية (Professional)", price: 12000, duration: "90 يوم", limit: "غير محدود", images: "20 صورة/إعلان", color: "bg-blue-100 text-blue-700" },
];

export default function SellerSettings() {
  const router = useRouter();
  const { profile } = useUser();
  const { firestore } = useFirestore();
  
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Plan, 2: Payment Details, 3: Success
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [loading, setLoading] = useState(false);

  // حساب الأيام المتبقية
  const daysLeft = useMemo(() => {
    if (!profile?.subscription?.endDate) return 0;
    const end = new Date(profile.subscription.endDate);
    const diff = differenceInDays(end, new Date());
    return diff > 0 ? diff : 0;
  }, [profile]);

  const handleSave = () => {
    toast({ title: "تم الحفظ", description: "تم تحديث بيانات المتجر بنجاح." });
  };

  const submitSubscriptionRequest = async () => {
    if (!firestore || !profile) return;
    setLoading(true);

    const requestData = {
      sellerId: profile.uid,
      sellerName: profile.name,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      type: daysLeft > 0 ? "Upgrade" : "New",
      refNumber: paymentRef,
      status: "Pending",
      createdAt: serverTimestamp(),
      amount: selectedPlan.price
    };

    try {
      await addDoc(collection(firestore, "subscription_requests"), requestData);
      setStep(3);
      toast({ title: "تم إرسال الطلب", description: "جاري مراجعة الوصل من قبل الإدارة المالية." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر إرسال الطلب، حاول ثانية." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl text-right" dir="rtl">
          <header className="mb-10 flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-black text-primary">إعدادات المتجر</h1>
              <p className="text-muted-foreground font-bold">إدارة ملفك التجاري واشتراكك السنوي.</p>
            </div>
            <Button variant="ghost" onClick={() => router.push('/seller/dashboard')} className="font-bold gap-2">
               الرجوع للوحة التحكم <ChevronRight size={16} />
            </Button>
          </header>
          
          <Tabs defaultValue="store" className="space-y-8">
            <TabsList className="bg-white p-1 h-14 rounded-2xl shadow-sm border w-full md:w-auto flex flex-row-reverse overflow-x-auto no-scrollbar">
              <TabsTrigger value="store" className="font-black px-8 rounded-xl gap-2">بيانات المتجر</TabsTrigger>
              <TabsTrigger value="account" className="font-black px-8 rounded-xl gap-2">الحساب الشخصي</TabsTrigger>
              <TabsTrigger value="subscription" className="font-black px-8 rounded-xl gap-2">الاشتراك والفوترة</TabsTrigger>
            </TabsList>

            {/* --- Subscription Tab --- */}
            <TabsContent value="subscription" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-none shadow-xl rounded-[32px] p-8 bg-zinc-900 text-white relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                         <div>
                            <Badge className="bg-secondary text-primary font-black px-4 py-1 mb-2">
                              {profile?.subscription?.plan || "Free Account"}
                            </Badge>
                            <h3 className="text-3xl font-black">حالة الاشتراك الحالي</h3>
                         </div>
                         <ShieldCheck className="text-secondary" size={48} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 mb-8 border-t border-white/10 pt-6">
                         <div>
                            <p className="text-zinc-400 text-xs mb-1">تاريخ الانتهاء</p>
                            <p className="text-xl font-bold">{profile?.subscription?.endDate || "دائم"}</p>
                         </div>
                         <div>
                            <p className="text-zinc-400 text-xs mb-1">الأيام المتبقية</p>
                            <p className="text-xl font-black text-secondary">{daysLeft} يوم</p>
                         </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <Dialog open={isPlanDialogOpen} onOpenChange={(o) => { setIsPlanDialogOpen(o); if(!o) setStep(1); }}>
                          <DialogTrigger asChild>
                            <Button className="flex-1 bg-white text-primary hover:bg-secondary font-black h-14 rounded-2xl gap-2">
                               <Zap size={18} /> تجديد أو ترقية الباقة
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                             {step === 1 && (
                               <>
                                 <DialogHeader>
                                    <DialogTitle className="text-right text-2xl font-black">اختر باقتك الجديدة</DialogTitle>
                                    <DialogDescription className="text-right">استمتع بمزايا أكثر ووصول أوسع للمشترين.</DialogDescription>
                                 </DialogHeader>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                                    {AVAILABLE_PLANS.map((plan) => (
                                      <div 
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan)}
                                        className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all flex flex-col gap-3 relative ${selectedPlan?.id === plan.id ? 'border-primary bg-primary/5' : 'border-zinc-100 hover:border-zinc-200'}`}
                                      >
                                        <Badge className={`w-fit font-black ${plan.color}`}>{plan.name.split(' ')[0]}</Badge>
                                        <div className="text-2xl font-black text-primary">{plan.price.toLocaleString()} <span className="text-xs">دج</span></div>
                                        <div className="space-y-2 mt-2 text-xs font-bold text-zinc-600">
                                          <div className="flex items-center gap-2"><Clock size={12} /> {plan.duration}</div>
                                          <div className="flex items-center gap-2"><Package size={12} /> {plan.limit}</div>
                                          <div className="flex items-center gap-2"><ImagePlus size={12} /> {plan.images}</div>
                                        </div>
                                      </div>
                                    ))}
                                 </div>
                                 <DialogFooter>
                                    <Button disabled={!selectedPlan} className="h-12 px-10 font-black" onClick={() => setStep(2)}>المتابعة للدفع <ChevronRight className="rotate-180" size={18} /></Button>
                                 </DialogFooter>
                               </>
                             )}

                             {step === 2 && (
                               <>
                                 <DialogHeader>
                                    <DialogTitle className="text-right text-2xl font-black">بيانات الدفع وتحميل الوصل</DialogTitle>
                                    <DialogDescription className="text-right">الباقة المختارة: {selectedPlan?.name}</DialogDescription>
                                 </DialogHeader>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                                    <div className="space-y-4">
                                       <div className="p-5 bg-zinc-50 rounded-2xl border-2 border-dashed border-primary/20 space-y-3">
                                          <p className="font-black text-primary mb-2">معلومات الحساب الجاري:</p>
                                          <div className="text-sm space-y-2">
                                             <div className="flex justify-between"><span>الحساب (CCP):</span> <span className="font-mono font-bold">0023456789 / 45</span></div>
                                             <div className="flex justify-between"><span>الاسم:</span> <span className="font-bold">MIMOUNE MOHAMED</span></div>
                                             <div className="flex justify-between"><span>BaridiMob (RIP):</span> <span className="font-mono text-[10px]">00799999002345678945</span></div>
                                          </div>
                                       </div>
                                       <div className="bg-amber-50 p-4 rounded-xl flex gap-3 items-start">
                                          <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                                          <p className="text-[10px] text-amber-800 leading-relaxed font-bold">يرجى كتابة رقم تتبع العملية أو اسمك في خانة المرجع عند التحويل عبر BaridiMob لسرعة التفعيل.</p>
                                       </div>
                                    </div>
                                    <div className="space-y-4">
                                       <div className="space-y-2">
                                          <Label className="font-black">رقم المرجع / العملية</Label>
                                          <Input placeholder="رقم وصل الدفع أو اسم المحول" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} className="h-12 border-2" />
                                       </div>
                                       <div className="border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer">
                                          <Upload size={32} className="mb-2" />
                                          <span className="text-xs font-black">رفع صورة الوصل</span>
                                       </div>
                                    </div>
                                 </div>
                                 <DialogFooter className="gap-2">
                                    <Button className="h-12 px-10 font-black bg-green-600 hover:bg-green-700" disabled={loading} onClick={submitSubscriptionRequest}>
                                      {loading ? "جاري الإرسال..." : "إرسال طلب التفعيل"}
                                    </Button>
                                    <Button variant="ghost" onClick={() => setStep(1)}>رجوع</Button>
                                 </DialogFooter>
                               </>
                             )}

                             {step === 3 && (
                               <div className="py-12 text-center space-y-6">
                                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle size={48} />
                                  </div>
                                  <h3 className="text-2xl font-black text-primary">تم استلام طلبك بنجاح!</h3>
                                  <p className="text-muted-foreground font-bold max-w-sm mx-auto">سيقوم فريق الإدارة بمراجعة الوصل وتفعيل اشتراكك في أقل من 4 ساعات. ستتلقى إشعاراً فور التفعيل.</p>
                                  <Button className="h-12 px-12 font-black rounded-xl" onClick={() => setIsPlanDialogOpen(false)}>إغلاق</Button>
                               </div>
                             )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 font-black h-14 rounded-2xl">سجل المدفوعات</Button>
                      </div>
                   </div>
                   <div className="absolute -bottom-10 -left-10 opacity-5 rotate-12 scale-150"><CreditCard size={300} /></div>
                </Card>

                <Card className="border-none shadow-xl rounded-[32px] p-8 bg-white flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                      <Package size={32} />
                   </div>
                   <h4 className="font-black text-lg mb-2">مميزات باقتك</h4>
                   <ul className="text-xs font-bold text-zinc-500 space-y-3 mb-6">
                      <li className="flex items-center gap-2 justify-center"><CheckCircle size={14} className="text-green-500" /> إعلانات غير محدودة</li>
                      <li className="flex items-center gap-2 justify-center"><CheckCircle size={14} className="text-green-500" /> 10 صور لكل قطعة</li>
                      <li className="flex items-center gap-2 justify-center"><CheckCircle size={14} className="text-green-500" /> دعم فني مميز</li>
                   </ul>
                   <Button variant="outline" className="w-full font-black border-2 h-12 rounded-xl" onClick={() => router.push('/seller/support')}>مركز الدعم الفني</Button>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="store">
               <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
                  <CardHeader className="bg-primary text-white p-8">
                    <CardTitle className="text-2xl font-black">بيانات المتجر</CardTitle>
                    <CardDescription className="text-blue-100">المعلومات التي تظهر للعملاء في الكتالوج.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-black">اسم المتجر</Label>
                        <Input defaultValue={profile?.name} className="h-12 border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black">رقم الواتساب</Label>
                        <Input defaultValue={profile?.phone} className="h-12 border-2" />
                      </div>
                    </div>
                    <Button onClick={handleSave} className="w-full h-14 text-lg font-black gap-2 shadow-xl bg-primary">
                      <Save size={20} /> حفظ التغييرات
                    </Button>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="account">
               <Card className="border-none shadow-xl rounded-[32px] p-8 bg-white">
                  <h3 className="text-xl font-black mb-6">إدارة الحساب والأمان</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-black">البريد الإلكتروني</Label>
                        <Input defaultValue={profile?.email} readOnly className="h-12 border-2 bg-zinc-50" />
                      </div>
                    </div>
                    <Button onClick={() => toast({ title: "كلمة المرور", description: "تم إرسال رابط تعيين كلمة المرور لبريدك." })} variant="outline" className="font-black h-12 border-2">تغيير كلمة المرور</Button>
                  </div>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
