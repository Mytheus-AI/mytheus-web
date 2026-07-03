import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader, Fraunces } from "next/font/google";
import "./globals.css";
import "./mytheus.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { MeetingUIProvider } from "@/contexts/MeetingUIContext";
import AppBar from "@/components/AppBar";
import Rail from "@/components/Rail";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  variable: "--font-newsreader",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mytheus",
  description: "Every conversation is captured, summarized, and ready to search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hanken.variable} ${newsreader.variable} ${fraunces.variable}`}>
      <body>
        <ToastProvider>
          <MeetingUIProvider>
            <div className="app">
              <AppBar />
              <div className="app-row">
                <Rail />
                <main className="main">{children}</main>
              </div>
            </div>
          </MeetingUIProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
