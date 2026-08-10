'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * مكون منظف أحداث النقر (Pointer Events Cleaner)
 * يقوم برفع القفل البرمجي الذي قد تضعه المكتبات الخارجية على عنصر body.
 */
function PointerEventsCleaner() {
  const pathname = usePathname();

  useEffect(() => {
    const releaseInteraction = () => {
      // إجبار المتصفح على تحرير التفاعل مع الصفحة
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    };

    // التنفيذ الفوري
    releaseInteraction();

    // التنفيذ بعد تأخير بسيط للتأكد من استقرار المكونات
    const timer = setTimeout(releaseInteraction, 300);
    
    // مراقبة دورية خلال الـ 5 ثواني الأولى من التحميل
    const interval = setInterval(releaseInteraction, 1000);
    const stopInterval = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      clearTimeout(stopInterval);
    };
  }, [pathname]);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen" suppressHydrationWarning>
        <FirebaseClientProvider>
          <PointerEventsCleaner />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}