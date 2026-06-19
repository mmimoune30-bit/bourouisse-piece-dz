"use client";

import { use, useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Send, MapPin, Phone, User, Mail, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", "09 - Blida", "16 - Alger", "31 - Oran"
];

export default function PurchasePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { firestore } = useFirestore();
  const { user } = useUser();
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");

  // Mock product data (In a real app, fetch from Firestore)
  const product = {
    id: resolvedParams.id,
    name: "محرك كامل رونو كليو 4 - 1.5 dCi",
    price: 450000,
    storeName: "Bourouisse Auto Parts",
    sellerId: "S-99182"
  };

  const handlePostRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const requestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const data = {
      requestNumber,
      productId: product.id,
      productName: product.name,
      sellerId: product.sellerId,
      storeName: product.storeName,
      buyerId: user?.uid || "guest",
      buyerName: formData.get("buyerName") as string,
      buyerPhone: formData.get("buyerPhone") as string,
      buyerEmail: formData.get("buyerEmail") as string,
      wilaya: formData.get("wilaya") as string,
      quantity: Number(formData.get("quantity")),
      deliveryAddress: formData.get("address") as string,
      notes: formData.get("notes") as string,
      status: "New",
      createdAt: serverTimestamp()
    };

    addDoc(collection(firestore, "purchase_requests"), data)
      .then((docRef) => {
        setLoading(false);
        setSubmitted(true);
        setRequestId(docRef.id);
        toast({ title: "تم إرسال الطلب", description: "تم إرسال طلب الشراء للبائع بنجاح." });
      })
      .catch(async (error) => {
        setLoading(false);
        const permissionError = new FirestorePermissionError({
          path: "purchase_requests",
          operation: "create",
          requestResourceData: data
        });
        errorEmitter.emit("permission-error", permissionError);
      });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-[235px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-2xl text-center p-12 rounded-[40px] bg-white">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-black text-primary mb-2">شكراً لك!</h1>
            <p className="text-muted-foreground font-bold mb-8">
              تم إرسال طلب الشراء الخاص بك للبائع. سيقوم صاحب المتجر بالتواصل معك قريباً لتأكيد التوصيل والدفع.
            </p>
            <div className="bg-zinc-50 p-4 rounded-2xl border-2 border-dashed border-primary/10 mb-8">
               <p className="text-xs font-black text-muted-foreground mb-1 uppercase">رقم تتبع الطلب</p>
               <p className="text-xl font-black text-primary font-mono">{requestId.substring(0, 8).toUpperCase()}</p>
            </div>
            <div className="space-y-3">
              <Button className="w-full h-14 font-black rounded-2xl" onClick={() => router.push("/")}>العودة للرئيسية</Button>
              <Button variant="outline" className="w-full h-14 font-black rounded-2xl" onClick={() => router.push("/catalog")}>تصفح المزيد</Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 flex items-center justify-between flex-row-reverse">
             <div className="text-right">
                <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
                   تأكيد طلب الشراء <ShoppingBag size={32} className="text-secondary" />
                </h1>
                <p className="text-muted-foreground mt-1">أدخل بياناتك ليتمكن البائع من شحن القطعة إليك.</p>
             </div>
             <Button variant="ghost" onClick={() => router.back()} className="gap-2 font-bold">
                <ChevronRight size={20} /> رجوع
             </Button>
          </div>

          <form onSubmit={handlePostRequest}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-xl overflow-hidden rounded-[32px]">
                  <CardHeader className="bg-primary text-white p-6 text-right">
                    <CardTitle className="text-xl flex items-center justify-end gap-2">
                       <User size={20} className="text-secondary" /> بيانات المشتري
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6 text-right" dir="rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-black">الاسم الكامل</Label>
                        <Input name="buyerName" placeholder="الاسم واللقب" required className="h-12 border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black">رقم الهاتف</Label>
                        <Input name="buyerPhone" placeholder="05/06/07..." required className="h-12 border-2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black">البريد الإلكتروني</Label>
                      <Input name="buyerEmail" type="email" placeholder="example@mail.com" className="h-12 border-2" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-black">الولاية</Label>
                        <Select name="wilaya" required>
                          <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                          <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black">الكمية المطلوبة</Label>
                        <Input name="quantity" type="number" defaultValue="1" min="1" className="h-12 border-2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black">عنوان التوصيل بالتفصيل</Label>
                      <Textarea name="address" placeholder="البلدية، الحي، رقم الباب..." required className="min-h-[100px] border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black">ملاحظات إضافية للبائع</Label>
                      <Textarea name="notes" placeholder="مثلاً: يرجى التأكد من حالة التغليف..." className="min-h-[80px] border-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
                  <CardHeader className="bg-secondary text-primary p-6 text-right">
                    <CardTitle className="text-xl font-black">ملخص الطلب</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 text-right" dir="rtl">
                    <div className="flex gap-4 border-b pb-4">
                       <div className="w-16 h-16 bg-zinc-100 rounded-xl relative overflow-hidden shrink-0 border">
                         <Image src={PlaceHolderImages[0].imageUrl} alt="Product" fill className="object-cover" />
                       </div>
                       <div>
                         <h4 className="font-black text-sm text-primary leading-tight">{product.name}</h4>
                         <p className="text-[10px] text-muted-foreground mt-1">{product.storeName}</p>
                       </div>
                    </div>
                    <div className="space-y-2 py-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">سعر القطعة:</span>
                         <span className="font-black">{product.price.toLocaleString()} دج</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">التوصيل:</span>
                         <span className="text-green-600 font-bold">حسب الولاية</span>
                       </div>
                       <div className="pt-4 border-t flex justify-between items-center">
                         <span className="font-black text-lg text-primary">المجموع:</span>
                         <span className="font-black text-2xl text-orange-600">{product.price.toLocaleString()} دج</span>
                       </div>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-2xl border flex items-start gap-2">
                       <ShieldCheck className="text-green-600 shrink-0" size={16} />
                       <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                         تسوق بأمان مع منصة بورويس. بياناتك محمية ولن يتم دفع أي مبلغ إلا عند الاستلام أو عبر وسيلة دفع آمنة.
                       </p>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full h-16 bg-primary text-white text-xl font-black rounded-2xl gap-3 shadow-xl hover:bg-secondary hover:text-primary transition-all mt-4"
                    >
                      {loading ? "جاري الإرسال..." : "إتمام الطلب الآن"} <Send size={24} />
                    </Button>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-[32px] flex flex-row-reverse gap-4">
                   <AlertCircle className="text-blue-600 shrink-0" size={24} />
                   <div className="text-right">
                      <h4 className="font-black text-sm text-blue-900">ماذا يحدث بعد الطلب؟</h4>
                      <p className="text-[11px] text-blue-800 mt-2 leading-relaxed font-bold">
                        سيصل إشعار فوري للبائع بطلبك. سيقوم البائع بمراجعة التوفر والاتصال بك هاتفياً لتأكيد الشحن. يمكنك متابعة حالة الطلب من لوحة تحكم المشتري.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
