"use client";

import { use, useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Phone, 
  MapPin, 
  Truck, 
  MessageSquare, 
  Share2, 
  Heart, 
  AlertCircle, 
  MessageCircle,
  ShoppingCart,
  Zap,
  Loader2,
  Cpu,
  Calendar,
  Hash,
  ChevronLeft
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

const ViberIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.514 10.603a1.5 1.5 0 1 1-2.923-.66 5.864 5.864 0 0 0-4.534-4.534 1.5 1.5 0 1 1-.66-2.923 8.864 8.864 0 0 1 8.117 8.117zm-4.321 0a1.5 1.5 0 1 1-2.923-.66c.21-.926.862-1.683 1.734-2.1l1.189 2.76zm8.807 1.397c0 8.837-7.163 16-16 16S0 20.837 0 12 7.163-4 16-4s16 7.163 16 16zm-7.608 2.015s-.764-1.254-1.04-1.854l-1.012.357s-.348.125-.563-.122l-1.554-1.802s-.216-.247-.091-.462l.357-1.012c-.6-.276-1.854-1.04-1.854-1.04-.333-.146-.68.126-.68.126l-1.002 1.488s-.361.542-.11 1.25c.346.974 1.63 2.94 2.808 4.043 1.178 1.103 3.327 2.128 4.293 2.3 1.05.187 1.517-.23 1.517-.23l1.411-1.127s.245-.333.02-.562l-2.5-2.247s-.233-.208-.51 0z"/></svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 7.007l-2.003 9.444c-.151.67-.93.945-1.464.514l-3.21-2.584-1.543 1.485c-.176.17-.46.185-.651.034l-.066-.062-.03-.028-2.618-2.02c-.538-.414-.492-1.233.088-1.583l9.043-5.467c.54-.327 1.171.168 1.03 1.267z"/></svg>
);

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { firestore } = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const productRef = resolvedParams.id ? doc(firestore!, "listings", resolvedParams.id) : null;
  const { data: product, loading } = useDoc(productRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContact = (platform: 'whatsapp' | 'viber' | 'telegram' | 'phone') => {
    if (!product?.phone && !product?.sellerPhone) {
      toast({ variant: "destructive", title: "تنبيه", description: "رقم الهاتف غير متوفر لهذا الإعلان." });
      return;
    }
    const phone = (product.phone || product.sellerPhone).replace(/\s/g, '');
    const message = `مرحباً، أنا مهتم بقطعة: ${product.name}`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/${phone.startsWith('0') ? '213' + phone.substring(1) : phone}?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'viber':
        window.open(`viber://chat?number=${phone.startsWith('0') ? '213' + phone.substring(1) : phone}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/+${phone.startsWith('0') ? '213' + phone.substring(1) : phone}`, '_blank');
        break;
      case 'phone':
        window.location.href = `tel:${phone}`;
        break;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-black text-2xl animate-pulse"><Loader2 className="animate-spin mr-2" /> جاري التحميل...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center font-black text-2xl">عذراً، الإعلان غير موجود.</div>;
  }

  const formattedPrice = mounted ? Number(product.price).toLocaleString() : product.price;
  const formattedDate = product.createdAt ? (
    typeof product.createdAt.toDate === 'function' 
      ? product.createdAt.toDate().toLocaleDateString('ar-DZ') 
      : new Date(product.createdAt).toLocaleDateString('ar-DZ')
  ) : "غير متاح";

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[170px] md:pt-[190px] pb-24 lg:pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="mb-6 text-center space-y-2">
            <h1 className="text-xl md:text-3xl font-black text-zinc-800 tracking-tight leading-relaxed uppercase px-4">
              {product.name}
            </h1>
            <div className="flex items-center justify-center gap-2" dir="rtl">
               <span className="text-orange-500 font-black text-2xl md:text-3xl">{formattedPrice} دج</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" dir="rtl">
            
            {/* Left Column (Actions & Info) - Fixed bottom on mobile, side on desktop */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-orange-500 border-2 shadow-xl rounded-2xl md:rounded-[24px] overflow-hidden">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
                   <div className="text-3xl md:text-4xl font-black text-orange-600">{formattedPrice} دج</div>
                   <div className="text-zinc-600 font-bold text-sm md:text-base flex items-center gap-2">
                     <Truck size={18} className="text-orange-500" /> التوصيل متوفر لـ 58 ولاية
                   </div>
                   <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full mt-2">
                     <Button 
                      className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full gap-2 text-base shadow-lg"
                      onClick={() => toast({ title: "سلة المشتريات", description: "تم إضافة القطعة إلى سلتك بنجاح." })}
                     >
                        <ShoppingCart size={20} /> سلة المشتريات
                     </Button>
                     <Link href={`/products/${product.id}/purchase`} className="flex-1">
                        <Button 
                          className="w-full bg-zinc-900 hover:bg-black text-white font-black h-14 px-8 rounded-full text-base shadow-lg gap-2"
                        >
                          <Zap size={20} className="text-secondary" /> شراء الآن
                        </Button>
                     </Link>
                   </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl md:rounded-[24px]">
                <CardContent className="p-6 space-y-6">
                   <div className="flex items-center gap-4 text-zinc-700 border-b pb-4">
                      <MapPin size={22} className="text-orange-500" />
                      <div className="text-right">
                         <span className="font-black text-base block">{product.sellerName}</span>
                         <span className="text-xs text-muted-foreground font-bold">{product.wilaya || "بائع موثوق"}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="h-11 rounded-xl bg-[#7360f2] text-white hover:bg-[#6250d1] border-none text-[10px] md:text-[11px] font-black shadow-sm" onClick={() => handleContact('viber')}>
                         <ViberIcon /> فايبر
                      </Button>
                      <Button variant="outline" className="h-11 rounded-xl bg-[#25D366] text-white hover:bg-[#1ebd57] border-none text-[10px] md:text-[11px] font-black shadow-sm" onClick={() => handleContact('whatsapp')}>
                         <MessageCircle size={16} /> واتساب
                      </Button>
                      <Button variant="outline" className="h-11 rounded-xl bg-[#0088cc] text-white hover:bg-[#0077b5] border-none text-[10px] md:text-[11px] font-black shadow-sm" onClick={() => handleContact('telegram')}>
                         <TelegramIcon /> تليجرام
                      </Button>
                   </div>

                   <Button className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl gap-3 text-xl shadow-xl transition-all" onClick={() => handleContact('phone')}>
                      <Phone size={24} /> {product.phone || "اتصل الآن"}
                   </Button>

                   <div className="flex gap-2 items-start p-4 bg-zinc-50 rounded-2xl">
                      <AlertCircle className="text-zinc-400 shrink-0 mt-0.5" size={16} />
                      <p className="text-[10px] md:text-[11px] text-zinc-500 leading-relaxed font-bold">
                         هذا الإعلان مقدم عبر منصة بورويس. أي خدمة هي مسؤولية صاحب الإعلان.
                      </p>
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column (Gallery & Specs) */}
            <div className="lg:col-span-3 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {product.images?.map((img: string, i: number) => (
                   <div key={i} className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-white shadow-md border-4 border-white group">
                      <Image src={img} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority={i === 0} />
                   </div>
                 ))}
              </div>

              <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
                <CardContent className="p-6 md:p-10 text-right space-y-8">
                   <h2 className="text-2xl md:text-3xl font-black text-primary border-r-8 border-orange-500 pr-4">المواصفات التقنية</h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12 text-sm md:text-base">
                      <div className="space-y-4">
                         <div className="flex justify-between border-b pb-3 items-center">
                            <span className="text-zinc-500 font-bold">الحالة</span>
                            <Badge className="font-black h-7 px-4">{product.condition === 'new' ? 'جديد' : 'مستعمل'}</Badge>
                         </div>
                         <div className="flex justify-between border-b pb-3 items-center">
                            <span className="text-zinc-500 font-bold">الكمية</span>
                            <span className="font-black text-orange-600">{product.quantity || 1} قطعة</span>
                         </div>
                         <div className="flex justify-between border-b pb-3 items-center">
                            <span className="text-zinc-500 font-bold">المتجر</span>
                            <span className="font-black text-primary">{product.sellerName}</span>
                         </div>
                         <div className="flex justify-between border-b pb-3 items-center">
                            <span className="text-zinc-500 font-bold">نوع الطاقة</span>
                            <span className="font-black text-primary">{product.fuelType || "بنزين"}</span>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between border-b pb-3 items-center">
                            <span className="text-zinc-500 font-bold">الماركة</span>
                            <span className="font-black text-primary">{product.brand}</span>
                         </div>
                         <div className="flex justify-between border-b pb-3 items-center">
                            <span className="text-zinc-500 font-bold">الموديل</span>
                            <span className="font-black text-primary">{product.model}</span>
                         </div>
                         <div className="flex justify-between border-b pb-3 items-center">
                            <span className="text-zinc-500 font-bold">السنة</span>
                            <span className="font-black text-primary">{product.year}</span>
                         </div>
                         <div className="flex justify-between border-b pb-3 items-center">
                            <span className="text-zinc-500 font-bold">تاريخ النشر</span>
                            <span className="font-black text-zinc-400 text-xs md:text-sm">{formattedDate}</span>
                         </div>
                      </div>
                   </div>
                   <div className="pt-6 border-t">
                      <h4 className="font-black text-primary mb-4 text-lg">وصف المنتج</h4>
                      <p className="text-zinc-600 leading-loose font-bold whitespace-pre-line text-sm md:text-base">
                        {product.description || "لا يوجد وصف إضافي لهذه القطعة."}
                      </p>
                   </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}