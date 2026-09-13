import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/tracking';

const TrackingInjector = () => {
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch tracking settings from backend
    const fetchTrackingSettings = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/settings/tracking_settings`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch tracking settings:', error);
      }
    };
    fetchTrackingSettings();
  }, []);

  useEffect(() => {
    if (!settings) return;

    // Inject GTM Script
    if (settings.gtmId && !document.getElementById('gtm-script')) {
      window.dataLayer = window.dataLayer || [];
      const script = document.createElement('script');
      script.id = 'gtm-script';
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${settings.gtmId}');
      `;
      document.head.appendChild(script);
      
      const noscript = document.createElement('noscript');
      noscript.id = 'gtm-noscript';
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${settings.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(noscript, document.body.firstChild);
    }

    // Inject Google Analytics (gtag.js)
    if (settings.googleAnalyticsId && !document.getElementById('ga-script')) {
      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function(){window.dataLayer.push(arguments);}
      }
      
      const script = document.createElement('script');
      script.id = 'ga-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`;
      document.head.appendChild(script);

      const initScript = document.createElement('script');
      initScript.id = 'ga-init-script';
      initScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.googleAnalyticsId}');
      `;
      document.head.appendChild(initScript);
    }

    // Prepare Pixels array, including legacy fields for backward compatibility
    let pixels = settings.fbPixels || [];
    if (pixels.length === 0 && settings.fbPixelId) {
      pixels = [{ pixelId: settings.fbPixelId }];
    }

    // Inject Facebook Pixel
    if (pixels.length > 0 && !document.getElementById('fb-pixel-script')) {
      const script = document.createElement('script');
      script.id = 'fb-pixel-script';
      
      // Build the init calls for all pixels
      const initCalls = pixels.filter(p => p.pixelId).map(p => `fbq('init', '${p.pixelId}');`).join('\n        ');
      
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        ${initCalls}
      `;
      document.head.appendChild(script);
    }
  }, [settings]);

  // Track Page Views automatically on route change
  useEffect(() => {
    if (settings) {
      // Small delay to ensure scripts are initialized
      setTimeout(() => {
        trackPageView(location.pathname + location.search);
      }, 100);
    }
  }, [location, settings]);

  return null; // This component doesn't render anything visually
};

export default TrackingInjector;
