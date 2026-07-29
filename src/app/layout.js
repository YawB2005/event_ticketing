import { Inter, Outfit, Yeseva_One, Righteous } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/ui/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const yeseva = Yeseva_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-yeseva",
});

const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
});

export const metadata = {
  title: "Eventix - Discover Premium Events",
  description: "Event Ticketing and Showcasing Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${yeseva.variable} ${righteous.variable}`}>
      <body suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
