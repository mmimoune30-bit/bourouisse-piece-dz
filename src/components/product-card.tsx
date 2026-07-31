
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, ShieldCheck, Calendar } from "lucide-react";
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
  rating = 4.5,
  condition = "New",
  hint = "car parts",
  createdAt
}: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"AR" | "EN">("AR");

  useEffect(() => {
    setMounted(true);
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const formattedDate = createdAt ? (
    typeof createdAt.toDate === 'function' 
      ? createdAt.toDate().toLocaleDateString(lang === 'AR' ? 'ar-DZ' : 'en-US') 
      : new Date(createdAt).toLocaleDateString(lang === 'AR' ? 'ar-DZ' : 'en-US')
  ) : null;

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-300 bg-white transform hover:-translate-y-1">
      {/* Clickable Image Area */}
      <Link href={`/products/${id}`} className="block relative aspect-square overflow-hidden bg-muted cursor-pointer">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          data-ai-hint={hint}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className={cn("absolute top-3 flex flex-col gap-2", lang === 'AR' ? "left-3" : "right-3")}>
          <Badge variant={condition === 'New' ? 'default' : 'secondary'} className="font-black shadow-lg uppercase">
            {lang === 'AR' ? (condition === 'New' ? 'جديد' : condition === 'Used' ? 'مستعمل' : 'مجدد') : condition}
          </Badge>
          {condition === 'New' && (
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-none shadow-sm text-black flex items-center gap-1 font-black">
              <ShieldCheck size={12} className="text-secondary" />
              {lang === 'AR' ? 'أصلية' : 'GENUINE'}
            </Badge>
          )}
        </div>
      </Link>
      
      <CardContent className={cn("p-4", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
        <div className="text-[10px] uppercase font-black text-secondary mb-1 tracking-widest">
          {category}
        </div>
        <Link href={`/products/${id}`} className="block mb-2">
          <h3 className="font-headline font-black text-lg text-black line-clamp-1 group-hover:text-secondary transition-colors uppercase">
            {name}
          </h3>
        </Link>
        <div className={cn("flex items-center gap-1 mb-2", lang === 'AR' ? "justify-end" : "justify-start")}>
          <span className="text-xs text-zinc-500 font-black">({rating})</span>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                className={i < Math.floor(rating) ? "" : "text-zinc-200"}
              />
            ))}
          </div>
        </div>
        <div className={cn("flex items-center justify-between mb-2", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
          <span className="text-2xl font-black text-black">
            {mounted ? price.toLocaleString() : price} <span className="text-sm font-black text-zinc-500">{lang === 'AR' ? 'دج' : 'DZD'}</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-black">
            {lang === 'AR' ? 'بواسطة:' : 'By:'} {seller}
          </span>
        </div>

        {formattedDate && (
          <div className={cn("flex items-center gap-1 text-[10px] text-zinc-400 font-black border-t pt-2 mt-2", lang === 'AR' ? "justify-end" : "justify-start")}>
            <span>{lang === 'AR' ? 'نشر في:' : 'Posted:'} {formattedDate}</span>
            <Calendar size={10} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2 group/btn font-black bg-zinc-50 border-2 border-black/10 text-black hover:bg-black hover:text-white transition-all rounded-xl uppercase" variant="outline" asChild>
          <Link href={`/products/${id}`}>
            <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
            {lang === 'AR' ? 'التفاصيل والطلب' : 'Details & Order'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
