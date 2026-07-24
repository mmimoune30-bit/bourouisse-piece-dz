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
    <div className={cn("flex flex-col items-center gap-0 min-w-[200px]", className)} dir="ltr">
      {/* Logo Text Area with Animation */}
      <div className="flex flex-col items-center leading-none transition-all duration-1000 ease-in-out">
        {isArabic ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
            <span className="text-[18px] md:text-[22px] font-black tracking-tight text-primary whitespace-nowrap" dir="rtl">
              بورويس لقطع الغيار
            </span>
            <span className="text-[16px] md:text-[20px] font-black text-secondary tracking-tighter mt-[-2px] uppercase whitespace-nowrap">
              DT - DZ
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
            <span className="text-[20px] md:text-[24px] font-black tracking-tighter text-primary uppercase whitespace-nowrap">
              BOUROUISSE PIECE
            </span>
            <span className="text-[16px] md:text-[20px] font-black text-secondary tracking-tighter mt-[-4px] uppercase whitespace-nowrap">
              DT - DZ
            </span>
          </div>
        )}
        
        {showTagline && (
          <div className="flex flex-col items-center mt-2">
            <span className={cn("text-[10px] md:text-[12px] font-black text-primary/90 text-center", subtextClassName)} dir="rtl">
              لقطع غيارات المركبات الجديدة و المستعملة
            </span>
            <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1 border-t border-zinc-100 pt-1 w-full text-center">
              M-M CHLEF
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
