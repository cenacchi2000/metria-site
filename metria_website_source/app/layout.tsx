import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metria | Review Systems for High-Stakes Decisions",
  description:
    "Metria helps teams review interviews, assessments, and sensitive case material with psychologist-guided protocols and defensible decision records.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Metria",
    description:
      "Review systems for high-stakes decisions.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metria",
    description:
      "Psychologist-guided protocols. Defensible outcomes.",
    images: ["/og.png"],
  },
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
        {children}
      </body>
    </html>
  );
}
