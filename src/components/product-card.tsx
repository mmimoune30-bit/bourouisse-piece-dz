"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, MapPin, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, memo } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  seller: string;
  rating?: number;
  condition?: "New" | "Used" | "Refurbished";
  hint?: string;
  createdAt?: any;
}

const ProductCard = memo(function ProductCard({
  id,
  name,
  price,
  image,
  category,
  seller,
  rating = 4.8,
  condition = "New",
  hint = "car parts",
  createdAt
}: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");

  useEffect(() => {
    setMounted(true);
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const getLocale = () => {
    if (lang === 'AR') return 'ar-DZ';
    if (lang === 'EN') return 'en-US';
    return 'fr-FR';
  };

  const formattedDate = createdAt ? (
    typeof createdAt.toDate === 'function' 
      ? createdAt.toDate().toLocaleDateString(getLocale()) 
      : new Date(createdAt).toLocaleDateString(getLocale())
  ) : null;

  const getConditionText = () => {
    if (lang === 'AR') {
      return condition === 'New' ? 'جديد' : condition === 'Used' ? 'مستعمل' : 'مجدد';
    }
    return condition;
  };

  const finalImageSrc = image && image.trim() !== "" ? image : `https://picsum.photos/seed/${id}/400/400`;

  return (
    <Card className="group bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Image Container - Ouedkniss Style */}
      <Link href={`/products/${id}`} className="block relative w-full aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
        <Image 
          src={finalImageSrc} 
          alt={name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
          data-ai-hint={hint}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
        
        {/* Condition Badge */}
        <div className={cn("absolute top-2 z-10", lang === 'AR' ? "left-2" : "right-2")}>
          <Badge className={cn(
            "text-[8px] px-2 py-0.5 font-bold uppercase border-none shadow-sm",
            condition === 'New' ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"
          )}>
            {getConditionText()}
          </Badge>
        </div>

        {/* Image Slider Dots Placeholder */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10 pointer-events-none">
           <div className="w-1.5 h-1.5 rounded-full bg-white shadow-md opacity-100"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-white/50 shadow-sm"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-white/50 shadow-sm"></div>
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
      
      <CardContent className={cn("p-3 flex-grow flex flex-col gap-1.5", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
        {/* Category Label */}
        <div className="text-[9px] uppercase text-secondary font-black tracking-tight mb-0.5">{category}</div>
        
        {/* Product Title */}
        <Link href={`/products/${id}`} className="block">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-secondary transition-colors uppercase min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        {/* Seller Info */}
        <div className="flex items-center gap-1 mt-1 opacity-70">
          <MapPin size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-500 font-bold truncate">{seller}</span>
        </div>

        {/* Price and Date Row */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-base font-black text-gray-900">
              {mounted ? price.toLocaleString() : price} <span className="text-[10px] font-bold">دج</span>
            </span>
          </div>
          
          {formattedDate && (
            <div className="text-[8px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock size={8} /> {formattedDate}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default ProductCard;