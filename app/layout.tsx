import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google';
import { PostHogProvider } from "./posthog-provider";
import PostHogPageView from "./posthog-pageview";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PreYT | YouTube Growth Analytics & Pre-Upload Intelligence",
  description: "Pick the perfect topic, title, and thumbnail based on real YouTube data. Audit your drafts against 14.8M uploads before you film.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        {/* Google Analytics & Google Tag via Official Next.js Integration */}
        <GoogleAnalytics gaId="G-XBGTFZ9358" />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
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
