import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import { PostHogProvider } from "./posthog-provider";
import PostHogPageView from "./posthog-pageview";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "preYT | Creator Decision Platform",
  description: "Analyze thumbnails, titles, and performance signals before you publish.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#FAF9F6] text-zinc-900`} suppressHydrationWarning>
        <div className="fixed inset-0 pointer-events-none z-50 bg-noise opacity-[0.015] mix-blend-overlay" />
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XBGTFZ9358"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XBGTFZ9358');
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <PostHogPageView />
            {children}
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
