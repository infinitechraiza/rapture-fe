import RootLayout from "@/components/RootLayout";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Rapture Cafe & Bar",
  description:
    "Experience luxury and comfort at Rapture Cafe & Bar - Your perfect destination",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rapture Cafe & Bar",
  },
  icons: {
    icon: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/rapture_logo.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#4f215c",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/rapture_logo.png" />
        <link rel="apple-touch-icon" href="/rapture_logo.png" />
      </Head>
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
