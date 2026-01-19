import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SourceProvider } from "@/contexts/source-context";
import { ReaderProvider } from "@/contexts/reader-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEWS DECK >_ Command Center",
  description: "Real-time specialized intelligence dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SourceProvider>
          <ReaderProvider>
            {children}
          </ReaderProvider>
        </SourceProvider>
      </body>
    </html>
  );
}
