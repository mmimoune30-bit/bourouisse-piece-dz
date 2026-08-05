"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, ShieldCheck, Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

  const finalImageSrc = image && image.trim() !== "" ? image : `https://picsum.photos/seed/${id}/400/300`;

  return (
    <Card className="group bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full">
      <Link href={`/products/${id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image 
          src={finalImageSrc} 
          alt={name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
          data-ai-hint={hint}
          sizes="(max-width: 768px) 50vw, 300px"
          loading="lazy"
        />
        <div className={cn("absolute top-2", lang === 'AR' ? "left-2" : "right-2")}>
          <Badge className={cn(
            "text-[8px] px-2 py-0.5 font-bold uppercase",
            condition === 'New' ? "bg-green-600" : "bg-orange-500"
          )}>
            {getConditionText()}
          </Badge>
        </div>
      </Link>
      
      <CardContent className={cn("p-3 flex-grow flex flex-col gap-1", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
        <div className="text-[9px] uppercase text-secondary font-bold tracking-tight mb-0.5">{category}</div>
        
        <Link href={`/products/${id}`} className="block">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-secondary transition-colors uppercase">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-500 font-medium truncate">{seller}</span>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-black text-gray-900">
              {mounted ? price.toLocaleString() : price} <span className="text-[10px] font-bold">دج</span>
            </span>
          </div>
          
          {formattedDate && (
            <div className="text-[8px] text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded">
              {formattedDate}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default ProductCard;
