'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Check if we are on the admin page
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      
      <main style={{ minHeight: '80vh' }}>
        {children}
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}
