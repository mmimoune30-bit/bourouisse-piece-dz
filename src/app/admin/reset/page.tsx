
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Trash2, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AdminResetPage() {
  const { firestore } = useFirestore();
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const clearCollection = async (collectionName: string) => {
    if (!firestore) return;
    if (!confirm(`هل أنت متأكد من حذف كافة المستندات في مجموعة "${collectionName}"؟ لا يمكن التراجع!`)) return;

    setLoading(collectionName);
    try {
      const querySnapshot = await getDocs(collection(firestore, collectionName));
      const batch = writeBatch(firestore);
      
      querySnapshot.forEach((d) => {
        batch.delete(doc(firestore, collectionName, d.id));
      });

      await batch.commit();
      toast({
        title: "تم المسح بنجاح",
        description: `تم إفراغ مجموعة ${collectionName} بالكامل من Firestore.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "فشل الحذف",
        description: error.message,
      });
    } finally {
      setLoading(null);
    }
  };

  const handleFullReset = async () => {
    if (!confirm("تحذير نهائي: سيتم مسح كافة بيانات المستخدمين والطلبات والعمليات المالية. هل تريد الاستمرار؟")) return;
    
    await clearCollection("users");
    await clearCollection("purchase_requests");
    await clearCollection("payments");
    
    toast({
      title: "اكتملت إعادة الضبط",
      description: "تم تنظيف قاعدة البيانات. يرجى الآن حذف الحسابات يدوياً من Firebase Authentication.",
    });
    
    router.push("/setup-admin");
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-destructive flex items-center justify-end gap-3">
          <ShieldAlert size={32} /> منطقة الخطر (إعادة ضبط النظام)
        </h1>
        <p className="text-muted-foreground mt-1">أدوات متقدمة لتنظيف قاعدة البيانات وإعادة تهيئة النظام.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-2 border-destructive/20 shadow-xl overflow-hidden">
          <CardHeader className="bg-destructive text-white p-6">
            <CardTitle className="text-xl flex items-center justify-end gap-2">
              <Trash2 size={20} /> مسح بيانات Firestore
            </CardTitle>
            <CardDescription className="text-white/80">هذا الإجراء يحذف المستندات فقط ولا يحذف حسابات الدخول (Auth).</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => clearCollection("users")}
                  disabled={!!loading}
                >
                  {loading === 'users' ? <Loader2 className="animate-spin" /> : "مسح الآن"}
                </Button>
                <div className="text-right">
                  <p className="font-bold">سجلات المستخدمين</p>
                  <p className="text-[10px] text-muted-foreground">مجموعة (users)</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => clearCollection("purchase_requests")}
                  disabled={!!loading}
                >
                  {loading === 'purchase_requests' ? <Loader2 className="animate-spin" /> : "مسح الآن"}
                </Button>
                <div className="text-right">
                  <p className="font-bold">طلبات الشراء</p>
                  <p className="text-[10px] text-muted-foreground">مجموعة (purchase_requests)</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => clearCollection("payments")}
                  disabled={!!loading}
                >
                  {loading === 'payments' ? <Loader2 className="animate-spin" /> : "مسح الآن"}
                </Button>
                <div className="text-right">
                  <p className="font-bold">سجلات المدفوعات</p>
                  <p className="text-[10px] text-muted-foreground">مجموعة (payments)</p>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-14 border-2 border-destructive text-destructive font-black hover:bg-destructive hover:text-white transition-all gap-2"
              onClick={handleFullReset}
              disabled={!!loading}
            >
              <RefreshCw className={loading ? "animate-spin" : ""} /> إعادة ضبط شاملة لكافة المجموعات
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 shadow-xl bg-amber-50/30">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center justify-end gap-2 text-xl font-black">
              <AlertTriangle /> تعليمات هامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-right font-bold text-amber-900 leading-loose">
            <p>لإتمام عملية "إعادة الضبط الكاملة" بنجاح، اتبع الخطوات التالية:</p>
            <ol className="list-decimal list-inside space-y-4 pr-4">
              <li>استخدم الأزرار في الجهة المقابلة لمسح كافة المستندات من Firestore.</li>
              <li>اذهب إلى <a href="https://console.firebase.google.com/" target="_blank" className="text-blue-600 underline">Firebase Console</a> -> Authentication.</li>
              <li>اختر كافة المستخدمين وقم بعمل "Delete Account".</li>
              <li>بمجرد إفراغ النظام، اذهب إلى صفحة <Button variant="link" className="p-0 font-black h-auto" onClick={() => router.push("/setup-admin")}>تأسيس المدير الرئيسي</Button> لإنشاء حسابك الجديد.</li>
            </ol>
            <div className="bg-amber-100 p-4 rounded-xl border border-amber-200 mt-4 text-xs">
              ملاحظة: لا يمكن للأتمتة حذف حسابات Authentication لأسباب أمنية، لذا يجب القيام بهذه الخطوة يدوياً من لوحة تحكم جوجل.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
