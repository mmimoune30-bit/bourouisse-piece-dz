'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * مكون منظف أحداث النقر (Aggressive Pointer Events Cleaner)
 * يقوم برفع أي قفل برمجي يوضع على الـ body بشكل دوري لضمان بقاء الأزرار فعالة.
 */
function PointerEventsCleaner() {
  const pathname = usePathname();

  useEffect(() => {
    const release = () => {
      if (typeof document !== 'undefined') {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
      }
    };

    release();
    
    // مراقبة مكثفة خلال الثواني الأولى من تحميل أي صفحة
    const timer = setTimeout(release, 100);
    const timer2 = setTimeout(release, 500);
    const interval = setInterval(release, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearInterval(interval);
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