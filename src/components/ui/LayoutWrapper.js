"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import { AlertProvider } from './AlertModal/AlertContext';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Routes where we don't want the default Navbar and Footer
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/organizer');

  // Specific routes that hide the footer
  const hideFooter = isDashboard || pathname.startsWith('/events') || pathname.startsWith('/login') || pathname.startsWith('/signup');

  return (
    <AlertProvider>
      {!isDashboard && <Navbar />}
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </AlertProvider>
  );
}
