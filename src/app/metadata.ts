import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Bourouisse Piece DZ",
  description: "منصة قطع غيار السيارات في الجزائر",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bourouisse",
  },
  formatDetection: {
    telephone: false,
  },
};