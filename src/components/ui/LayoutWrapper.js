"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Routes where we don't want the default Navbar and Footer
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/organizer');

  // Specific routes that hide the footer
  const hideFooter = isDashboard || pathname.startsWith('/events');

  return (
    <>
      {!isDashboard && <Navbar />}
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
