import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "New Day Power Wash — Professional Pressure Washing Services",
  description: "Commercial and residential power washing services for HOAs, leasing offices, and businesses. Get an instant AI estimate today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark scroll-smooth`}>
      <body className="min-h-screen font-[family-name:var(--font-inter)] bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
