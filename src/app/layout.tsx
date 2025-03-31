"use client"; 

import "./globals.css";
import { ReactNode } from "react";
import Header from "./../components/Header";
import Footer from "./../components/Footer";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>Self-Improvement Portal</title>
        <meta
          name="description"
          content="Log your daily habits, track analytics, and challenge yourself!"
        />
      </head>
      <body>
        <Header />
        <main className="min-h-screen p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

