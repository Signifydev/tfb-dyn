import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { Header } from "@/components/travel/Header";
import { Footer } from "@/components/travel/Footer";
import { PromoPopup } from "@/components/travel/PromoPopup";
import { LeadChatbot } from "@/components/travel/LeadChatbot";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel For Benefits - Tour Packages, Adventure & Pilgrimage",
  description: "Discover curated tour packages, thrilling adventures, and pilgrimages across India. Book your dream trip today with exclusive benefits.",
  keywords: "tour packages, adventure travel, CharDham yatra, group tours, bike expeditions, India travel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <PromoPopup />
            <LeadChatbot />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
