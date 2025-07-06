  import type { Metadata } from "next";
  import { Inter } from "next/font/google";
  import "./globals.css";
  import Navbar from "@/components/Navbar";
  import Footer from "@/components/Footer";

  export const metadata: Metadata = {
    title: "Garage Ke",
    description: "Let's Engineer your car today",
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body className="relative">
          <Navbar/>
          {children}
          <Footer/>
          </body>
      </html>
    );
  }
