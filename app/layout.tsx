import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getIconPath } from "@/lib/paths";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  themeColor: "#2563eb",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ServiceWorkerRegistration />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
