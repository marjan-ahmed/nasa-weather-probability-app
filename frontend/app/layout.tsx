import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Exo_2, Lexend } from "next/font/google";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-exo2",
  display: "swap",
})

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lexend",
  display: "swap",
})



export const metadata: Metadata = {
  title: "WeatherAI - NASA Weather Probability App",
  description: "AI-powered weather forecasting and probability analysis using NASA data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${exo2.variable} ${lexend.variable} antialiased `}
      >
          {children}
          <SmoothCursor />
      </body>
    </html>
  );
}
