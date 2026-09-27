"use client";
import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import TrackingInjector from './TrackingInjector';
import ScrollToTop from './ScrollToTop';
import ChatBot from './ChatBot';
import SideCart from './SideCart';
import Tracker from './Tracker';
import Maintenance from '../views/Maintenance';
import { usePathname } from 'next/navigation';
export default function ClientLayout({ children }) {
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = React.useState('');
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
    const fetchMaintenance = async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/settings/general_settings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.maintenanceMode) {
            setMaintenanceMode(true);
            setMaintenanceMessage(data.maintenanceMessage);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaintenance();
  }, []);

  let userInfo = {};
  if (typeof window !== 'undefined') {
    userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  }
  const isAdmin = userInfo?.isAdmin || userInfo?.role === 'superadmin' || userInfo?.role === 'admin';

  if (maintenanceMode && !isAdmin) {
    return <Maintenance message={maintenanceMessage} />;
  }

  const isAdminRoute = pathname && pathname.startsWith('/admin');

  return (
    <HelmetProvider>
      <Suspense fallback={null}>
        {!isAdminRoute && <ScrollToTop />}
        {!isAdminRoute && <ChatBot />}
        <Tracker />
        <TrackingInjector />
        {mounted && <Toaster position="top-right" />}
        
        {!isAdminRoute && <Navbar />}
        <div className={isAdminRoute ? "" : "page-wrapper"}>{children}</div>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <SideCart />}
        
        {!isAdminRoute && (!maintenanceMode || isAdmin) && <MobileBottomNav />}
      </Suspense>
    </HelmetProvider>
  );
}
