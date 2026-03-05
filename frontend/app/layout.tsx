import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "JOYMEE", description: "Ko'chmas mulk platformasi", viewport: "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
      </head>
      <body>{children}</body>
    </html>
  );
}
