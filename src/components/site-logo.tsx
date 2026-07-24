"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  subtextClassName?: string;
  showTagline?: boolean;
}

export default function SiteLogo({ className, subtextClassName, showTagline = true }: SiteLogoProps) {
  return (
    <div className={cn("flex flex-col items-center gap-0", className)} dir="ltr">
      {/* Logo Text */}
      <div className="flex flex-col items-center leading-none">
        <span className="text-[20px] md:text-[24px] font-black tracking-tighter text-primary uppercase whitespace-nowrap">
          BOUROUISSE PIECE
        </span>
        <span className="text-[32px] md:text-[44px] font-black text-secondary tracking-tighter mt-[-6px] uppercase whitespace-nowrap">
          DT - DZ
        </span>
        
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
