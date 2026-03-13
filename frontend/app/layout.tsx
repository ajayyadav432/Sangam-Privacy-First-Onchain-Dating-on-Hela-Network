import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sangam — Privacy-First Onchain Dating",
  description: "The world's first fully on-chain, ZK-private dating dApp on Hela Network. Swipe, match, and connect without exposing your identity.",
  keywords: ["blockchain", "dating", "ZK proof", "Hela Network", "Web3", "dApp", "privacy"],
  openGraph: {
    title: "Sangam",
    description: "Swipe, match, and connect on-chain with ZK privacy.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased bg-gray-950 text-white min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}


