'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * مكون منظف أحداث النقر (Pointer Events Cleaner)
 * يقوم برفع أي قفل برمجي يوضع على الـ body بشكل دوري لضمان بقاء الأزرار فعالة.
 */
function PointerEventsCleaner() {
  const pathname = usePathname();

  useEffect(() => {
    const release = () => {
      if (typeof document !== 'undefined') {
        // تحرير الجسم من أي نمط يمنع النقر فوراً
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        
        // البحث عن أي حاويات حماية وإخفائها
        const guards = document.querySelectorAll('[data-radix-focus-guard]');
        guards.forEach(g => (g as HTMLElement).style.display = 'none');
      }
    };

    release();
    
    // مراقبة مكثفة: تشغيل التنظيف عند التحميل وبفترات زمنية لضمان الاستمرارية
    const timer = setTimeout(release, 100);
    const interval = setInterval(release, 1000);

    return () => {
      clearTimeout(timer);
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