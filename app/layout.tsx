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
    "Online quizzes with live monitoring for classrooms: build a quiz, approve who joins, and see integrity signals as they happen.",
};

export const viewport: Viewport = {
  themeColor: "#0a0c10",
  colorScheme: "dark",
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