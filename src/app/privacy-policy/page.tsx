
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
            <div className="bg-primary p-10 text-white text-center">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-4xl font-black">سياسة الخصوصية</h1>
              <p className="text-blue-100 mt-2">نلتزم بحماية خصوصيتك وبياناتك الشخصية</p>
            </div>
            <CardContent className="p-10 text-right space-y-8" dir="rtl">
              <section>
                <h2 className="text-2xl font-black text-primary mb-4 border-r-4 border-secondary pr-4">مرحبًا بكم في منصة قطع غيار السيارات</h2>
                <p className="text-muted-foreground leading-loose">نلتزم بحماية خصوصية مستخدمينا والحفاظ على سرية بياناتهم الشخصية.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-primary mb-3">البيانات التي نقوم بجمعها</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pr-4">
                  <li>الاسم واللقب.</li>
                  <li>رقم الهاتف.</li>
                  <li>البريد الإلكتروني.</li>
                  <li>بيانات المتجر.</li>
                  <li>الولاية والبلدية.</li>
                  <li>صور المنتجات والإعلانات.</li>
                  <li>بيانات الاشتراك والمدفوعات.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-primary mb-3">الغرض من جمع البيانات</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pr-4">
                  <li>إنشاء الحسابات وإدارتها.</li>
                  <li>عرض الإعلانات والمنتجات.</li>
                  <li>تسهيل التواصل بين البائعين والمشترين.</li>
                  <li>معالجة الطلبات والشكاوى.</li>
                  <li>تحسين خدمات المنصة.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-primary mb-3">حماية البيانات</h3>
                <p className="text-muted-foreground leading-loose">تلتزم المنصة باتخاذ التدابير اللازمة لحماية البيانات من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-primary mb-3">مشاركة البيانات</h3>
                <p className="text-muted-foreground leading-loose">لا تقوم المنصة ببيع أو تأجير البيانات الشخصية لأي جهة خارجية إلا إذا تطلب القانون ذلك أو لحماية حقوق المنصة ومستخدميها.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-primary mb-3">حقوق المستخدم</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pr-4">
                  <li>الاطلاع على بياناته.</li>
                  <li>تعديل بياناته.</li>
                  <li>طلب حذف حسابه.</li>
                  <li>تقديم شكوى بخصوص استخدام بياناته.</li>
                </ul>
              </section>

              <section className="bg-zinc-50 p-6 rounded-2xl border-2 border-dashed border-primary/10">
                <h3 className="text-xl font-bold text-primary mb-2">الموافقة</h3>
                <p className="text-muted-foreground">باستخدامك للمنصة فإنك توافق على سياسة الخصوصية هذه.</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
