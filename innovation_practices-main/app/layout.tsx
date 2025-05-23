import type { Metadata } from "next";
import { Nunito } from "next/font/google";
// styling
import "slick-carousel/slick/slick.css";
import "./globals.css";
// components
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Passport",
  description: "Tour and Travel app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'bg-primary text-tertiary overflow-x-hidden ${nunito.variable}'}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
