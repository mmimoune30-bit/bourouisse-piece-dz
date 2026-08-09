
"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <Link href="/" className={cn("flex flex-col items-center gap-0 min-w-[180px] md:min-w-[220px] group transition-all", className)}>
      <div className="relative w-full h-[32px] md:h-[42px] flex items-center justify-center">
        {/* Dynamic Image Logo from Admin Dashboard */}
        {settings?.logoUrl ? (
          <div className="relative w-full h-full flex items-center justify-center transition-transform group-hover:scale-105">
            <Image 
              src={settings.logoUrl} 
              alt={settings?.platformName || "Site Logo"} 
              width={220} 
              height={50} 
              className="object-contain max-h-full" 
              priority 
            />
          </div>
        ) : (
          /* System Default Text-based Animated Logo */
          <div className="relative w-full h-full">
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
        )}
      </div>
      
      {/* Tagline / Subtext - Kept for professional look even with custom logo */}
      {showTagline && (
        <div className="flex flex-col items-center mt-1 w-full border-t border-black/5 pt-1">
          <span className={cn("text-[9px] md:text-[10px] font-black text-center leading-none whitespace-nowrap", subtextClassName || "text-black/70")} dir="rtl">
            لقطع غيارات المركبات الجديدة و المستعملة
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
             <div className="h-[1px] w-4 bg-secondary/30" />
             <span className={cn("text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-center", subtextClassName ? "opacity-60" : "text-zinc-500")}>
               M-M CHLEF
             </span>
             <div className="h-[1px] w-4 bg-secondary/30" />
          </div>
        </div>
      )}
    </Link>
  );
}
