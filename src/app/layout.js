import "./globals.css";
import Navbar from "@/components/ui/Navbar/Navbar";
import Footer from "@/components/ui/Footer/Footer";

const outfit = { variable: "font-outfit" };
const inter = { variable: "font-inter" };
const yeseva = { variable: "font-yeseva" };

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
