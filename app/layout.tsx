import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getIconPath } from "@/lib/paths";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JS Quiz Master - Test Your JavaScript Knowledge",
  description: "Offline-first PWA quiz application for testing deep JavaScript concepts including event loop, closures, async/await, this binding, type coercion, and prototypes.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JS Quiz Master",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const iconPath = `${basePath}/icons/icon-192.png`;
  
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={iconPath} />
      </head>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ServiceWorkerRegistration />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
