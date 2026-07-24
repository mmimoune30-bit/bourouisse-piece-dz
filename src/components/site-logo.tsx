
"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  subtextClassName?: string;
  showTagline?: boolean;
}

export default function SiteLogo({ className, subtextClassName, showTagline = true }: SiteLogoProps) {
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsArabic((prev) => !prev);
    }, 10000); // يتبدل كل 10 ثوانٍ
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex flex-col items-center gap-0 min-w-[180px] relative overflow-hidden", className)} dir="ltr">
      {/* الوعاء الرئيسي للشعار مع تقليل الارتفاع */}
      <div className="relative w-full h-[32px] md:h-[38px]">
        
        {/* النسخة الإنجليزية */}
        <div 
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center leading-none transition-all duration-1000 ease-in-out",
            isArabic ? "-translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
          )}
        >
          <span className="text-[16px] md:text-[19px] font-black tracking-tighter text-primary uppercase whitespace-nowrap">
            BOUROUISSE PIECE
          </span>
          <span className="text-[11px] md:text-[13px] font-black text-secondary tracking-tighter mt-[-2px] uppercase whitespace-nowrap">
            DT - DZ
          </span>
        </div>

        {/* النسخة العربية */}
        <div 
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center leading-none transition-all duration-1000 ease-in-out",
            isArabic ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          )}
        >
          <span className="text-[15px] md:text-[18px] font-black tracking-tight text-primary whitespace-nowrap" dir="rtl">
            بورويس لقطع الغيار
          </span>
          <span className="text-[11px] md:text-[13px] font-black text-secondary tracking-tighter mt-[-1px] uppercase whitespace-nowrap">
            DT - DZ
          </span>
        </div>
      </div>
      
      {/* العبارة الوصفية - تم تقليل الهوامش والمسافات */}
      {showTagline && (
        <div className="flex flex-col items-center mt-0.5 w-full border-t border-zinc-100 pt-0.5">
          <span className={cn("text-[8px] md:text-[10px] font-black text-primary/90 text-center leading-none", subtextClassName)} dir="rtl">
            لقطع غيارات المركبات الجديدة و المستعملة
          </span>
          <span className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5 text-center">
            M-M CHLEF
          </span>
        </div>
      )}
    </div>
  );
}
