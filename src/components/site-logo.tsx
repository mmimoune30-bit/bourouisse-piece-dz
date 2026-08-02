
"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import Image from "next/image";

interface SiteLogoProps {
  className?: string;
  brandClassName?: string;
  subtextClassName?: string;
  showTagline?: boolean;
}

export default function SiteLogo({ 
  className, 
  brandClassName, 
  subtextClassName, 
  showTagline = true 
}: SiteLogoProps) {
  const [isArabic, setIsArabic] = useState(false);
  const { firestore } = useFirestore();
  const { data: settings } = useDoc(firestore ? doc(firestore, "site_settings", "global") : null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsArabic((prev) => !prev);
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  // إذا كان هناك شعار صورة مرفوع من لوحة التحكم، نعرضه هو فقط
  if (settings?.logoUrl) {
    return (
      <div className={cn("flex items-center justify-center min-w-[160px]", className)}>
        <Image 
          src={settings.logoUrl} 
          alt="Site Logo" 
          width={220} 
          height={60} 
          className="object-contain max-h-[50px] md:max-h-[60px]" 
          priority 
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-0 min-w-[220px] relative overflow-hidden", className)} dir="ltr">
      <div className="relative w-full h-[32px] md:h-[42px]">
        <div 
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center leading-none transition-all duration-1000 ease-in-out",
            isArabic ? "-translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
          )}
        >
          <span className={cn("text-[18px] md:text-[22px] font-black tracking-tighter uppercase whitespace-nowrap", brandClassName || "text-black")}>
            BOUROUISSE PIECE
          </span>
          <span className="text-[12px] md:text-[15px] font-black text-secondary tracking-tighter mt-[-3px] uppercase whitespace-nowrap">
            DT - DZ
          </span>
        </div>

        <div 
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center leading-none transition-all duration-1000 ease-in-out",
            isArabic ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          )}
        >
          <span className={cn("text-[17px] md:text-[21px] font-black tracking-tight whitespace-nowrap", brandClassName || "text-black")} dir="rtl">
            بورويس لقطع الغيار
          </span>
        </div>
      </div>
      
      {showTagline && (
        <div className="flex flex-col items-center mt-0 w-full border-t border-black/5 pt-0.5">
          <span className={cn("text-[9px] md:text-[11px] font-black text-center leading-none", subtextClassName || "text-black/80")} dir="rtl">
            لقطع غيارات المركبات الجديدة و المستعملة
          </span>
          <span className={cn("text-[8px] md:text-[9.5px] font-bold uppercase tracking-[0.15em] mt-0.5 text-center", subtextClassName ? "opacity-60" : "text-zinc-500")}>
            M-M CHLEF
          </span>
        </div>
      )}
    </div>
  );
}
