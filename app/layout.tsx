import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://inject3r.github.io/fastapi-route"),
  title: {
    default: "FastAPI Route - File-Based Routing for FastAPI",
    template: "%s | FastAPI Route",
  },
  description:
    "FastAPI Route provides file-based routing for FastAPI. Build APIs with files and folders, not decorators. Features include dynamic routes, route groups, hot reload, production cache, custom handlers, and middleware support.",
  keywords: [
    "fastapi route",
    "file-based routing",
    "fastapi routing",
    "python web framework",
    "api routing",
    "fastapi alternative",
    "fastapi file routing",
    "python async api",
    "fastapi middleware",
    "dynamic routes fastapi",
    "fastapi hot reload",
  ],
  authors: [{ name: "Abolfazl Hosseini", url: "https://github.com/inject3r" }],
  creator: "Abolfazl Hosseini",
  publisher: "FastAPI Route",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  openGraph: {
    title: "FastAPI Route - File-Based Routing for FastAPI",
    description:
      "Build APIs with files and folders, not decorators. File-based routing system for FastAPI with hot reload, production cache, and zero configuration.",
    url: "https://inject3r.github.io/fastapi-route",
    siteName: "FastAPI Route",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastAPI Route - File-Based Routing for FastAPI",
    description:
      "Build APIs with files and folders, not decorators. File-based routing for FastAPI.",
    creator: "@inject3r",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
  manifest: "/manifest.json",
  category: "technology",
  classification: "Software Development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-black text-gray-200`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
