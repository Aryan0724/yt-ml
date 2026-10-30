import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google';
import { PostHogProvider } from "./posthog-provider";
import PostHogPageView from "./posthog-pageview";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://preyt.integralgroups.in"),
  title: {
    default: "PreYT - YouTube Content Intelligence & Video Analysis",
    template: "%s | PreYT"
  },
  description: "Research YouTube topics, evaluate video packaging, and make more informed content decisions with PreYT's creator intelligence tools.",
  openGraph: {
    title: "PreYT - YouTube Content Intelligence & Video Analysis",
    description: "Research YouTube topics, evaluate video packaging, and make more informed content decisions with PreYT's creator intelligence tools.",
    url: "https://preyt.integralgroups.in",
    siteName: "PreYT",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/preyt-logo-dark.png",
        width: 1200,
        height: 630,
        alt: "PreYT YouTube Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PreYT - YouTube Content Intelligence & Video Analysis",
    description: "Research YouTube topics, evaluate video packaging, and make more informed content decisions with PreYT's creator intelligence tools.",
    creator: "@preYTAI",
    images: ["/preyt-logo-dark.png"],
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
