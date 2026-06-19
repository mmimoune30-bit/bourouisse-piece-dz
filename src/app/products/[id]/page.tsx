
"use client";

import { use, useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Clock, 
  MessageSquare, 
  Share2, 
  Heart, 
  AlertCircle, 
  MessageCircle,
  ChevronRight,
  Info
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock product data based on screenshot structure
  const product = {
    id: resolvedParams.id,
    name: "SAMSUNG GALAXY TAB S10 FE | 256GB | 8GB RAM | + STYLET SAMSUNG + BOOKCOVER CLAVIER",
    price: 99000,
    oldPrice: 102000,
    condition: "مستعمل - مستعمل",
    delivery: "التوصيل متوفر",
    location: "مستغانم - مستغانم",
    phone: "0673 59 49 24",
    seller: "واد كنيس",
    images: [
      PlaceHolderImages[5].imageUrl,
      PlaceHolderImages[6].imageUrl,
    ],
    description: "صفحة إشهار ، أي محتوى أو خدمة أو منتج معروض هو ملك لصاحب الإعلان ، واد كنيس غير مسؤول عنه - شروط الإستخدام"
  };

  const formattedPrice = mounted ? product.price.toLocaleString() : product.price;
  const formattedOldPrice = mounted ? product.oldPrice.toLocaleString() : product.oldPrice;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[245px] pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Title */}
          <div className="mb-6 text-center">
            <h1 className="text-xl md:text-3xl font-bold text-zinc-800 tracking-tight leading-relaxed uppercase">
              {product.name}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2" dir="rtl">
               <span className="text-red-500 line-through text-sm">{formattedOldPrice} دج</span>
               <span className="text-orange-500 font-bold text-lg">{formattedPrice} دج ثابت</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" dir="rtl">
            
            {/* Sidebar (Left in RTL, Right in LTR) */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* Price & Cart Card */}
              <Card className="border-orange-500 border-2 shadow-none rounded-xl overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                   <div className="text-2xl font-black text-orange-600">{formattedPrice} دج</div>
                   <div className="text-zinc-600 font-bold text-sm">{product.delivery}</div>
                   <div className="flex gap-2 w-full mt-2">
                     <Button className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full gap-2 text-xs">
                        <Truck size={16} /> سلة المشتريات
                     </Button>
                     <Button className="bg-orange-600 hover:bg-orange-700 text-white font-black h-12 px-6 rounded-full text-xs">
                        شراء
                     </Button>
                   </div>
                </CardContent>
              </Card>

              {/* Contact & Info Card */}
              <Card className="border-none shadow-sm rounded-xl">
                <CardContent className="p-5 space-y-5">
                   {/* Location */}
                   <div className="flex items-center gap-3 text-zinc-700 border-b pb-4">
                      <MapPin size={20} className="text-zinc-400" />
                      <span className="font-bold text-sm">{product.location}</span>
                   </div>

                   {/* Social Buttons */}
                   <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="h-10 rounded-full bg-[#7360f2] text-white hover:bg-[#6250d1] border-none text-[10px] gap-1 font-bold">
                         <ViberIcon /> فايبر
                      </Button>
                      <Button variant="outline" className="h-10 rounded-full bg-[#25D366] text-white hover:bg-[#1ebd57] border-none text-[10px] gap-1 font-bold">
                         <MessageCircle size={16} /> واتساب
                      </Button>
                      <Button variant="outline" className="h-10 rounded-full bg-[#0088cc] text-white hover:bg-[#0077b5] border-none text-[10px] gap-1 font-bold">
                         <TelegramIcon /> تيليجرام
                      </Button>
                   </div>

                   {/* Phone Button */}
                   <Button className="w-full h-12 bg-[#eb6e24] hover:bg-[#d45d1d] text-white font-black rounded-full gap-3 text-lg">
                      <Phone size={20} /> {product.phone}
                   </Button>

                   {/* Message Button */}
                   <Button variant="outline" className="w-full h-12 bg-[#52b1ff] hover:bg-[#40a0ef] text-white border-none font-black rounded-full gap-2">
                      <MessageSquare size={18} /> رسالة واد كنيس
                   </Button>

                   {/* Disclaimer */}
                   <div className="flex gap-2 items-start pt-2">
                      <AlertTriangleIcon className="text-zinc-400 shrink-0 mt-1" />
                      <p className="text-[10px] text-zinc-500 leading-normal">
                         {product.description} - <span className="text-orange-500 underline cursor-pointer">شروط الإستخدام</span>
                      </p>
                   </div>
                </CardContent>
              </Card>

              {/* Bottom Actions */}
              <div className="flex justify-between items-center px-2">
                 <Button variant="ghost" className="text-zinc-500 font-bold text-xs gap-2">
                   <AlertCircle size={14} /> تبليغ
                 </Button>
                 <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8"><Share2 size={14} /></Button>
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8"><Heart size={14} /></Button>
                 </div>
              </div>
            </div>

            {/* Main Content (Images) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {product.images.map((img, i) => (
                   <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-sm border">
                      <Image 
                        src={img} 
                        alt={`${product.name} ${i}`} 
                        fill 
                        className="object-cover"
                        priority={i === 0}
                      />
                   </div>
                 ))}
              </div>
              
              {/* Extra Images or Thumbnails could go here */}
              <div className="flex justify-center gap-2">
                 <div className="w-8 h-1.5 bg-orange-500 rounded-full" />
                 <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}
