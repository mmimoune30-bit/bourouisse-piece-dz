'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Interaction Cleaner Component
 * Forcibly removes pointer-events blocks injected by Radix UI or other libraries.
 */
function PointerEventsCleaner() {
  const pathname = usePathname();

  useEffect(() => {
    const releaseInteraction = () => {
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    };

    // Run immediately
    releaseInteraction();

    // Run again after a short delay to catch late injections
    const timer = setTimeout(releaseInteraction, 500);
    
    // Interval check for the first 5 seconds of mount/navigation
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