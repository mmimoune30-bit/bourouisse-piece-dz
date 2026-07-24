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
      {/* Icon Area: The Stylized 'B' from the Image */}
      <div className="relative mb-1">
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 md:w-20 md:h-20 fill-primary"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main 'B' shape simplified */}
          <path d="M30 20 H55 C70 20 75 35 65 45 C75 55 70 80 50 80 H30 V20 Z M42 32 V44 H52 C58 44 58 32 52 32 H42 Z M42 54 V68 H55 C62 68 62 54 55 54 H42 Z" />
          {/* Golden Swoosh arc */}
          <path
            d="M25 65 Q 45 35 75 40"
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-secondary"
            style={{ stroke: "hsl(var(--secondary))" }}
          />
        </svg>
      </div>

      {/* Text Area */}
      <div className="flex flex-col items-center leading-none">
        <span className="text-[14px] md:text-[16px] font-black tracking-tight text-primary uppercase whitespace-nowrap">
          BOUROUISSE PIECE
        </span>
        <span className="text-[28px] md:text-[36px] font-serif font-black text-secondary tracking-tighter mt-[-4px] uppercase whitespace-nowrap">
          DT - DZ
        </span>
        
        {showTagline && (
          <div className="flex flex-col items-center mt-1">
            <span className={cn("text-[9px] md:text-[10px] font-black text-primary/80 text-center", subtextClassName)} dir="rtl">
              لقطع غيارات المركبات الجديدة و المستعملة
            </span>
            <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5">
              M-M CHLEF
            </span>
          </div>
        )}
      </div>
    </div>
  );
}