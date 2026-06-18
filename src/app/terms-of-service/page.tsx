
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
            <div className="bg-primary p-10 text-white text-center">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
                <FileText size={32} />
              </div>
              <h1 className="text-4xl font-black">شروط الخدمة</h1>
              <p className="text-blue-100 mt-2">اتفاقية استخدام منصة بورويس</p>
            </div>
            <CardContent className="p-10 text-right space-y-8" dir="rtl">
              <section>
                <h2 className="text-2xl font-black text-primary mb-4 border-r-4 border-secondary pr-4">شروط وأحكام استخدام منصة قطع غيار السيارات</h2>
                <p className="text-muted-foreground leading-loose">يرجى قراءة هذه الشروط بعناية قبل استخدام المنصة.</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-primary">1. التسجيل</h3>
                  <p className="text-sm text-muted-foreground">يجب على المستخدم تقديم معلومات صحيحة ودقيقة، والمحافظة على سرية كلمة المرور وعدم مشاركتها.</p>
                  
                  <h3 className="text-xl font-bold text-primary">2. مسؤولية البائع</h3>
                  <p className="text-sm text-muted-foreground">يلتزم البائع بنشر معلومات صحيحة وصور حقيقية للمنتجات وتحديد الأسعار بوضوح.</p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-primary">3. مسؤولية المشتري</h3>
                  <p className="text-sm text-muted-foreground">يلتزم المشتري باستخدام المنصة لأغراض مشروعة واحترام البائعين والمستخدمين الآخرين.</p>
                  
                  <h3 className="text-xl font-bold text-primary">4. الإعلانات المحظورة</h3>
                  <p className="text-sm text-muted-foreground">يُمنع نشر المنتجات غير القانونية، المسروقة، المضللة، أو المحتويات المسيئة والمخالفة للقانون.</p>
                </section>
              </div>

              <section className="space-y-3 pt-6 border-t">
                <h3 className="text-xl font-bold text-primary">5. المدفوعات والاشتراكات</h3>
                <p className="text-muted-foreground leading-loose">قد تتطلب بعض الخدمات اشتراكًا مدفوعًا. تخضع عمليات الدفع للمراجعة والتحقق، وتحتفظ الإدارة بحق رفض أو تعليق أي اشتراك مخالف.</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-primary">6. الحظر والإيقاف</h3>
                <p className="text-muted-foreground leading-loose">تحتفظ إدارة المنصة بحق حذف الإعلانات المخالفة، تعليق الحسابات، أو حظر المستخدمين الذين ينتهكون شروط الاستخدام.</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-primary">7. حدود مسؤولية المنصة</h3>
                <p className="text-muted-foreground leading-loose">المنصة تعمل كوسيط إلكتروني بين البائع والمشتري، ولا تتحمل المسؤولية عن جودة المنتجات أو تنفيذ الصفقات أو النزاعات التي قد تنشأ بين الأطراف.</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-primary">8. تعديل الشروط</h3>
                <p className="text-muted-foreground leading-loose">يجوز للمنصة تعديل هذه الشروط في أي وقت، ويعتبر استمرار استخدام المنصة موافقة على التعديلات الجديدة.</p>
              </section>

              <section className="bg-secondary/10 p-6 rounded-2xl border-2 border-secondary/20">
                <h3 className="text-xl font-bold text-primary mb-2">قبول الشروط</h3>
                <p className="text-primary font-black">عند التسجيل أو استخدام المنصة فإنك تقر بأنك قرأت هذه الشروط ووافقت عليها.</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
