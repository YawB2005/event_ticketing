import { Outfit, Inter, Yeseva_One } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar/Navbar";
import Footer from "@/components/ui/Footer/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const yeseva = Yeseva_One({
  weight: "400",
  variable: "--font-yeseva",
  subsets: ["latin"],
});

export const metadata = {
  title: "ETSP - Discover Premium Events",
  description: "Event Ticketing and Showcasing Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${yeseva.variable}`}>
      <body suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
