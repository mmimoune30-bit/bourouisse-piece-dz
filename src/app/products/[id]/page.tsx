
"use client";

import { use, useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { 
  Phone, 
  MapPin, 
  Truck, 
  MessageSquare, 
  Share2, 
  Heart, 
  AlertCircle, 
  MessageCircle,
  Settings
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

// Custom Social Icons
const ViberIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.514 10.603a1.5 1.5 0 1 1-2.923-.66 5.864 5.864 0 0 0-4.534-4.534 1.5 1.5 0 1 1-.66-2.923 8.864 8.864 0 0 1 8.117 8.117zm-4.321 0a1.5 1.5 0 1 1-2.923-.66c.21-.926.862-1.683 1.734-2.1l1.189 2.76zm8.807 1.397c0 8.837-7.163 16-16 16S0 20.837 0 12 7.163-4 16-4s16 7.163 16 16zm-7.608 2.015s-.764-1.254-1.04-1.854l-1.012.357s-.348.125-.563-.122l-1.554-1.802s-.216-.247-.091-.462l.357-1.012c-.6-.276-1.854-1.04-1.854-1.04-.333-.146-.68.126-.68.126l-1.002 1.488s-.361.542-.11 1.25c.346.974 1.63 2.94 2.808 4.043 1.178 1.103 3.327 2.128 4.293 2.3 1.05.187 1.517-.23 1.517-.23l1.411-1.127s.245-.333.02-.562l-2.5-2.247s-.233-.208-.51 0z"/></svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 7.007l-2.003 9.444c-.151.67-.93.945-1.464.514l-3.21-2.584-1.543 1.485c-.176.17-.46.185-.651.034l-.066-.062-.03-.028-2.618-2.02c-.538-.414-.492-1.233.088-1.583l9.043-5.467c.54-.327 1.171.168 1.03 1.267z"/></svg>
);

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [mounted, setMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const product = {
    id: resolvedParams.id,
    name: "محرك كامل رونو كليو 4 - Moteur Complet Renault Clio 4 1.5 dCi 90ch",
    price: 450000,
    oldPrice: 485000,
    condition: "مستعمل - حالة ممتازة",
    delivery: "التوصيل متوفر لـ 58 ولاية",
    location: "الشلف - بلدية الشلف",
    phone: "0778 42 89 77",
    seller: "Bourouisse Auto Parts",
    images: [
      PlaceHolderImages[0].imageUrl,
      PlaceHolderImages[5].imageUrl,
    ],
    description: "هذا الإعلان مقدم عبر منصة بورويس بـيـس. أي محتوى أو خدمة هي مسؤولية صاحب الإعلان. بورويس بـيـس وسيط إلكتروني فقط. - شروط الإستخدام"
  };

  const formattedPrice = mounted ? product.price.toLocaleString() : product.price;
  const formattedOldPrice = mounted ? product.oldPrice.toLocaleString() : product.oldPrice;

  const handleContact = (platform: 'whatsapp' | 'viber' | 'telegram' | 'phone') => {
    const phone = product.phone.replace(/\s/g, '');
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

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[245px] pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="mb-6 text-center">
            <h1 className="text-xl md:text-3xl font-black text-zinc-800 tracking-tight leading-relaxed uppercase">
              {product.name}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2" dir="rtl">
               <span className="text-zinc-400 line-through text-sm">{formattedOldPrice} دج</span>
               <span className="text-orange-500 font-black text-xl">{formattedPrice} دج ثابت</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" dir="rtl">
            
            <div className="lg:col-span-1 space-y-4">
              
              <Card className="border-orange-500 border-2 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                   <div className="text-3xl font-black text-orange-600">{formattedPrice} دج</div>
                   <div className="text-zinc-600 font-bold text-sm flex items-center gap-2">
                     <Truck size={16} className="text-orange-500" /> {product.delivery}
                   </div>
                   <div className="flex gap-2 w-full mt-2">
                     <Button 
                      className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full gap-2 text-sm shadow-lg"
                      onClick={() => toast({ title: "تمت الإضافة", description: "تم إضافة القطعة إلى سلة المشتريات." })}
                     >
                        سلة المشتريات
                     </Button>
                     <Button 
                      className="bg-zinc-900 hover:bg-black text-white font-black h-14 px-8 rounded-full text-sm shadow-lg"
                      onClick={() => toast({ title: "طلب شراء", description: "جاري تحويلك لبوابة الدفع..." })}
                     >
                        شراء
                     </Button>
                   </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-5 space-y-5">
                   <div className="flex items-center gap-3 text-zinc-700 border-b pb-4">
                      <MapPin size={20} className="text-orange-500" />
                      <span className="font-black text-sm">{product.location}</span>
                   </div>

                   <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        className="h-12 rounded-xl bg-[#7360f2] text-white hover:bg-[#6250d1] border-none text-[11px] gap-1 font-black shadow-md"
                        onClick={() => handleContact('viber')}
                      >
                         <ViberIcon /> فايبر
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-12 rounded-xl bg-[#25D366] text-white hover:bg-[#1ebd57] border-none text-[11px] gap-1 font-black shadow-md"
                        onClick={() => handleContact('whatsapp')}
                      >
                         <MessageCircle size={16} /> واتساب
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-12 rounded-xl bg-[#0088cc] text-white hover:bg-[#0077b5] border-none text-[11px] gap-1 font-black shadow-md"
                        onClick={() => handleContact('telegram')}
                      >
                         <TelegramIcon /> تيليجرام
                      </Button>
                   </div>

                   <Button 
                    className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl gap-3 text-xl shadow-xl transition-all active:scale-95"
                    onClick={() => handleContact('phone')}
                   >
                      <Phone size={24} /> {product.phone}
                   </Button>

                   <Button 
                    variant="outline" 
                    className="w-full h-14 bg-zinc-800 hover:bg-black text-white border-none font-black rounded-xl gap-2 shadow-lg"
                    onClick={() => toast({ title: "مراسلة", description: "سيتم فتح صندوق المحادثة قريباً." })}
                   >
                      <MessageSquare size={18} /> مراسلة بورويس بـيـس
                   </Button>

                   <div className="flex gap-2 items-start pt-2 bg-zinc-50 p-3 rounded-xl">
                      <AlertCircle className="text-zinc-400 shrink-0 mt-0.5" size={14} />
                      <p className="text-[10px] text-zinc-500 leading-relaxed font-bold">
                         {product.description} - <span className="text-orange-500 underline cursor-pointer hover:text-orange-600">شروط الإستخدام</span>
                      </p>
                   </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center px-2">
                 <Button 
                  variant="ghost" 
                  className="text-zinc-500 font-bold text-xs gap-2 hover:text-destructive"
                  onClick={() => toast({ variant: "destructive", title: "تبليغ", description: "شكراً لك، تم إرسال بلاغك للإدارة للمراجعة." })}
                 >
                   <AlertCircle size={14} /> تبليغ عن مخالفة
                 </Button>
                 <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full h-10 w-10 hover:bg-zinc-100 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({ title: "تم النسخ", description: "تم نسخ رابط الإعلان لمشاركته." });
                      }}
                    >
                      <Share2 size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`rounded-full h-10 w-10 transition-all ${isLiked ? 'bg-red-50 text-red-500 border-red-200' : 'hover:bg-zinc-100'}`}
                      onClick={() => {
                        setIsLiked(!isLiked);
                        toast({ title: isLiked ? "تم الإزالة" : "تمت الإضافة", description: isLiked ? "تم إزالة القطعة من المفضلة." : "تم إضافة القطعة لقائمة مفضلاتك." });
                      }}
                    >
                      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                    </Button>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {product.images.map((img, i) => (
                   <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-md border-4 border-white group cursor-zoom-in">
                      <Image 
                        src={img} 
                        alt={`${product.name} ${i}`} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={i === 0}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                   </div>
                 ))}
              </div>
              
              <div className="flex justify-center gap-2">
                 <div className="w-10 h-1.5 bg-orange-500 rounded-full" />
                 <div className="w-2 h-1.5 bg-zinc-300 rounded-full" />
                 <div className="w-2 h-1.5 bg-zinc-300 rounded-full" />
              </div>

              <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-8 text-right space-y-6">
                   <h2 className="text-2xl font-black text-primary border-r-4 border-orange-500 pr-4">تفاصيل إضافية</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                      <div className="space-y-4">
                         <div className="flex justify-between border-b pb-2">
                            <span className="text-zinc-500 font-bold">الحالة:</span>
                            <span className="font-black text-primary">{product.condition}</span>
                         </div>
                         <div className="flex justify-between border-b pb-2">
                            <span className="text-zinc-500 font-bold">المتجر:</span>
                            <span className="font-black text-orange-600">{product.seller}</span>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between border-b pb-2">
                            <span className="text-zinc-500 font-bold">المنصة:</span>
                            <span className="font-black text-primary">Bourouisse Piece-Dz</span>
                         </div>
                         <div className="flex justify-between border-b pb-2">
                            <span className="text-zinc-500 font-bold">رقم الإعلان:</span>
                            <span className="font-mono font-bold text-zinc-400">#B-DZ-99182</span>
                         </div>
                      </div>
                   </div>
                   <div className="pt-4">
                      <p className="text-zinc-600 leading-loose font-bold">
                        محرك مستورد من فرنسا، مستعمل بحالة ممتازة. تم اختباره وضمانه لمدة 3 أشهر. 
                        متوفر مع علبة السرعة أو بدونها. السعر المعروض هو للمحرك فقط.
                        تواصل معنا للمزيد من المعلومات أو المعاينة في مقرنا بالشلف.
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
