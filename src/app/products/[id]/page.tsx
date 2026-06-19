
"use client";

import { use, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Phone, Mail, MapPin, ShieldCheck, Truck, Clock, MessageSquare, Share2, Heart, ChevronLeft, ChevronRight, AlertCircle, Star, ImagePlus } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock product data
  const product = {
    id: resolvedParams.id,
    name: "كتلة محرك V8 دقيقة أصلية لسيارة BMW",
    price: 450000,
    category: "قطع المحرك",
    condition: "New",
    seller: {
      name: "EliteMotors DZ",
      location: "الجزائر العاصمة، الدار البيضاء",
      phone: "+213 778 42 89 77",
      rating: 4.9,
      verified: true
    },
    images: [PlaceHolderImages[0].imageUrl, PlaceHolderImages[5].imageUrl, PlaceHolderImages[6].imageUrl],
    description: "محرك V8 كامل بحالة ممتازة، مستورد مباشرة من ألمانيا. متوافق مع موديلات BMW الفئة الخامسة والسابعة (2018-2022). ضمان لمدة 6 أشهر على كافة الأجزاء الميكانيكية. السعر قابل للتفاوض في حدود المعقول."
  };

  const handleAction = (type: string) => {
    switch(type) {
      case 'share':
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "تم نسخ الرابط", description: "يمكنك الآن مشاركته مع أصدقائك." });
        break;
      case 'favorite':
        setIsFavorite(!isFavorite);
        toast({ title: isFavorite ? "تمت الإزالة" : "تمت الإضافة للمفضلة", description: "تجد محفوظاتك في لوحة التحكم." });
        break;
      case 'report':
        toast({ variant: "destructive", title: "تبليغ", description: "تم إرسال بلاغك للإدارة لمراجعة هذا الإعلان." });
        break;
      case 'call':
        window.open(`tel:${product.seller.phone}`);
        break;
      case 'message':
        toast({ title: "رسالة", description: "جاري فتح نظام المحادثة مع البائع..." });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[235px] pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative aspect-video md:aspect-[16/9] rounded-3xl overflow-hidden border-2 border-white shadow-xl bg-muted">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className="bg-secondary text-primary font-black px-4 py-1.5 shadow-lg">{product.condition}</Badge>
                </div>
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm"><ChevronLeft /></Button>
                </div>
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm"><ChevronRight /></Button>
                </div>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border-2 border-border cursor-pointer hover:border-secondary transition-all">
                    <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6 text-right" dir="rtl">
                <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4 border-b pb-6">
                  <div>
                    <h1 className="text-3xl font-black text-primary mb-2">{product.name}</h1>
                    <div className="flex items-center justify-end gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock size={14} /> منذ 4 ساعات</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {product.seller.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-secondary">{product.price.toLocaleString()} <span className="text-lg">دج</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary">الوصف</h3>
                  <p className="text-muted-foreground leading-loose text-lg">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "الحالة", value: "جديد أصلية", icon: <ShieldCheck size={18} /> },
                    { label: "الضمان", value: "6 أشهر", icon: <ShieldCheck size={18} /> },
                    { label: "التوصيل", value: "متوفر 58 ولاية", icon: <Truck size={18} /> },
                    { label: "الفئة", value: product.category, icon: <ImagePlus size={18} /> },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-muted/50 rounded-2xl flex flex-col items-center text-center gap-2">
                      <div className="text-secondary">{item.icon}</div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">{item.label}</span>
                      <span className="text-sm font-black text-primary">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-xl overflow-hidden">
                <div className="bg-destructive p-6 text-white text-right">
                  <h3 className="font-black text-xl mb-1">معلومات البائع</h3>
                  <p className="text-white/70 text-sm">عضو معتمد منذ 2022</p>
                </div>
                <CardContent className="p-6 space-y-6" dir="rtl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden relative border-2 border-secondary/20">
                      <Image src={PlaceHolderImages[4].imageUrl} alt="Seller" fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-primary">{product.seller.name}</h4>
                        <ShieldCheck size={18} className="text-blue-500" />
                      </div>
                      <div className="flex text-yellow-500 gap-1 text-sm font-bold">
                        <span>4.9 / 5.0</span>
                        <Star size={14} fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full h-14 text-lg font-black gap-3 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100" onClick={() => handleAction('call')}>
                      <Phone size={24} /> اتصل بالبائع
                    </Button>
                    <Button variant="outline" className="w-full h-12 font-bold gap-3 border-secondary text-secondary" onClick={() => handleAction('message')}>
                      <MessageSquare size={20} /> مراسلة في التطبيق
                    </Button>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                     <p className="text-[10px] text-muted-foreground font-bold text-center uppercase tracking-widest">تنبيه السلامة</p>
                     <p className="text-[11px] text-muted-foreground text-center">لا ترسل أي أموال مسبقاً. تأكد من القطعة قبل الدفع.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="flex flex-col h-16 rounded-2xl gap-1" onClick={() => handleAction('share')}>
                  <Share2 size={18} />
                  <span className="text-[10px] font-bold">مشاركة</span>
                </Button>
                <Button variant={isFavorite ? "default" : "outline"} className={cn("flex flex-col h-16 rounded-2xl gap-1", isFavorite && "bg-red-500 text-white")} onClick={() => handleAction('favorite')}>
                  <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                  <span className="text-[10px] font-bold">تفضيل</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-16 rounded-2xl gap-1 text-destructive" onClick={() => handleAction('report')}>
                  <AlertCircle size={18} />
                  <span className="text-[10px] font-bold">تبليغ</span>
                </Button>
              </div>

              <div className="bg-zinc-900 p-6 rounded-3xl text-white text-right relative overflow-hidden group">
                 <div className="relative z-10">
                   <h3 className="font-black text-xl mb-2 text-secondary">إعلان ممول</h3>
                   <p className="text-zinc-400 text-sm mb-4 leading-relaxed">احصل على خصم 10% عند شراء طقم الفلاتر والزيت معاً.</p>
                   <Button variant="secondary" className="w-full font-black">مشاهدة العرض</Button>
                 </div>
                 <div className="absolute top-0 left-0 w-full h-full opacity-20 group-hover:scale-110 transition-transform">
                   <Image src={PlaceHolderImages[4].imageUrl} alt="Promo" fill className="object-cover" />
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
