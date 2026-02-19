import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "FERDOUS AI | The Ultimate AI Operating System",
  description: "Production-grade AI creation platform. Websites, stores, apps, SaaS, games, video, image, voice, social.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans bg-ferdous-bg text-white antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
