import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://india-reform-intelligence.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "India Reform Intelligence — AI-Powered National Progress",
    template: "%s | India Reform Intelligence",
  },
  description:
    "Track daily corruption from Indian newspapers. AI step-by-step reform solutions. Monitor sector gaps, governance failures, and national progress.",
  keywords: [
    "India corruption",
    "भ्रष्टाचार",
    "reform",
    "governance",
    "AI analysis",
    "Indian newspapers",
    "civic awareness",
  ],
  authors: [{ name: "India Reform Intelligence" }],
  openGraph: {
    title: "India Reform Intelligence",
    description: "Daily corruption tracking with AI-powered step-by-step solutions",
    url: siteUrl,
    siteName: "India Reform Intelligence",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Reform Intelligence",
    description: "Daily corruption tracking with AI-powered reform solutions",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#191817",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}