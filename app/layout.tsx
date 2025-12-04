import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smart-ex.github.io/js-quizzy';

export const metadata: Metadata = {
  title: "JS Quizzy - Test Your JavaScript Knowledge",
  description: "Offline-first PWA quiz application for testing deep JavaScript concepts including event loop, closures, async/await, this binding, type coercion, and prototypes.",
  keywords: ["JavaScript", "quiz", "programming", "web development", "coding challenge", "PWA", "offline"],
  authors: [{ name: "JS Quizzy Team" }],
  creator: "JS Quizzy",
  publisher: "JS Quizzy",
  manifest: `${basePath}/manifest.webmanifest`,
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: "64x64", type: "image/png" },
      { url: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${basePath}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JS Quizzy",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "JS Quizzy",
    title: "JS Quizzy - Test Your JavaScript Knowledge",
    description: "Master JavaScript with 220+ challenging questions. Test your knowledge on event loops, closures, async/await, and more. Offline-first PWA.",
    images: [
      {
        url: `${siteUrl}${basePath}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "JS Quizzy - JavaScript Quiz Application",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JS Quizzy - Test Your JavaScript Knowledge",
    description: "Master JavaScript with 220+ challenging questions. Test your knowledge on event loops, closures, async/await, and more.",
    images: [`${siteUrl}${basePath}/og-image.png`],
    creator: "@jsquizzy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#22d3ee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
