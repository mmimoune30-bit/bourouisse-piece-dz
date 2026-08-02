
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, ShieldCheck, Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
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

export default function ProductCard({
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
    if (lang === 'EN') return condition;
    return condition === 'New' ? 'Neuf' : condition === 'Used' ? 'Occasion' : 'Reconditionné';
  };

  const getDetailsBtnText = () => {
    if (lang === 'AR') return 'عرض التفاصيل';
    if (lang === 'EN') return 'View Details';
    return 'Détails';
  };

  const getCurrencyText = () => {
    if (lang === 'AR') return 'دج';
    return 'DZD';
  };

  const titleFont = lang === 'AR' ? 'font-black' : 'font-black';
  const normalFont = lang === 'AR' ? 'font-bold' : 'font-bold';
  const buttonFont = lang === 'AR' ? 'font-black' : 'font-black';

  return (
    <Card className="group overflow-hidden border-2 border-transparent hover:border-secondary/20 shadow-sm hover:shadow-2xl transition-all duration-500 bg-white rounded-[24px] flex flex-col h-full">
      <Link href={`/products/${id}`} className="block relative aspect-[5/4] overflow-hidden bg-zinc-100 cursor-pointer">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
          data-ai-hint={hint} 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
           <div className="bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full text-primary text-xs font-black shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
             {getDetailsBtnText()}
           </div>
        </div>
        <div className={cn("absolute top-3 flex flex-col gap-2", lang === 'AR' ? "left-3" : "right-3")}>
          <Badge className={cn(
            "shadow-lg uppercase text-[9px] px-3 py-1 border-none",
            condition === 'New' ? "bg-green-600 text-white" : "bg-orange-500 text-white",
            titleFont
          )}>
            {getConditionText()}
          </Badge>
          {condition === 'New' && (
            <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-zinc-100 flex items-center gap-1">
              <ShieldCheck size={10} className="text-secondary fill-secondary" />
              <span className="text-[8px] font-black text-primary tracking-tighter">أصلية</span>
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className={cn("p-4 flex-grow flex flex-col gap-1.5", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
        <div className={cn("text-[9px] uppercase text-secondary font-black tracking-widest mb-0.5", titleFont)}>{category}</div>
        
        <Link href={`/products/${id}`} className="block">
          <h3 className={cn("text-base md:text-lg text-zinc-900 line-clamp-1 group-hover:text-secondary transition-colors uppercase leading-tight", titleFont)}>{name}</h3>
        </Link>

        <div className={cn("flex items-center justify-between mb-1 mt-1", lang === 'AR' ? "flex-row" : "flex-row-reverse")}>
          <div className="flex text-yellow-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-zinc-200"} />
            ))}
          </div>
          <span className={cn("text-[10px] text-zinc-500 flex items-center gap-1", normalFont)}>
            <MapPin size={10} className="text-zinc-400" /> {seller}
          </span>
        </div>

        <div className="mt-auto pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className={cn("text-xl md:text-2xl text-primary leading-none", lang === 'AR' ? 'font-black' : 'font-black')}>
              {mounted ? price.toLocaleString() : price}
            </span>
            <span className={cn("text-[10px] text-zinc-500 font-black mt-0.5 uppercase", titleFont)}>{getCurrencyText()}</span>
          </div>
          
          {formattedDate && (
            <div className={cn("flex items-center gap-1.5 text-[9px] text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md", normalFont)}>
              <Clock size={10} />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className={cn("w-full h-11 gap-2 bg-zinc-950 text-secondary hover:bg-black hover:scale-[1.02] transition-all rounded-xl uppercase shadow-md shadow-black/10 border-none", buttonFont)} asChild>
          <Link href={`/products/${id}`}>
            <ShoppingCart size={16} />
            {lang === 'AR' ? 'طلب القطعة' : 'ORDER NOW'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
