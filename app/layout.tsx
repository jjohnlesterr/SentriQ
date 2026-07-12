import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppToaster } from "@/components/ui/toaster";
import { AuthModalProvider } from "@/store/useAuthModal";
import AuthModalManager from "@/components/modals/AuthModalManager";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "SentriQ - Quiz Monitoring",
  description:
    "A smart quiz and monitoring platform designed to ensure integrity and fairness during digital assessments.",

  icons: {
    icon: "/logo-final.png",
    shortcut: "/logo-final.png",
    apple: "/logo-final.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d14" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthModalProvider>
          {children}
          <AuthModalManager />
        </AuthModalProvider>

        <AppToaster />
      </body>
    </html>
  );
}