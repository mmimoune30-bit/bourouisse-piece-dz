"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsArabic((prev) => !prev);
    }, 10000); // يتبدل كل 10 ثوانٍ
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex flex-col items-center gap-0 min-w-[220px] relative overflow-hidden", className)} dir="ltr">
      {/* Container for logo */}
      <div className="relative w-full h-[32px] md:h-[42px]">
        
        {/* English Version */}
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

        {/* Arabic Version */}
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
      
      {/* Tagline */}
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
