import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const Tracker = () => {
  const location = useLocation();
  const clickQueue = useRef([]);
  const sessionInitialized = useRef(false);
  const sessionId = useRef(sessionStorage.getItem('analytics_session_id'));

  useEffect(() => {
    if (!sessionId.current) {
      sessionId.current = generateUUID();
      sessionStorage.setItem('analytics_session_id', sessionId.current);
    }

    const initTracker = async () => {
      if (sessionInitialized.current) return;
      sessionInitialized.current = true;
      try {
        await fetch(import.meta.env.VITE_API_URL + '/api/analytics/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            sessionId: sessionId.current,
            userAgent: navigator.userAgent
          })
        });
      } catch (error) {
        console.error('Tracker Init Error', error);
      }
    };
    initTracker();

    // Click tracking
    const handleClick = (e) => {
      // Don't track admin area
      if (window.location.pathname.startsWith('/admin')) return;
      
      clickQueue.current.push({
        x: e.pageX,
        y: e.pageY,
        w: window.innerWidth,
        h: Math.max(document.body.scrollHeight, window.innerHeight)
      });
    };

    document.addEventListener('click', handleClick);

    const interval = setInterval(() => {
      if (clickQueue.current.length > 0) {
        const payload = [...clickQueue.current];
        clickQueue.current = [];
        
        fetch(import.meta.env.VITE_API_URL + '/api/analytics/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId.current,
            pageUrl: window.location.pathname,
            clicks: payload
          })
        }).catch(e => console.error('Tracker Click Error', e));
      }
    }, 5000); // Flush every 5s

    return () => {
      document.removeEventListener('click', handleClick);
      clearInterval(interval);
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    fetch(import.meta.env.VITE_API_URL + '/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId.current,
        pageUrl: location.pathname,
        referrer: document.referrer
      })
    }).catch(e => console.error('Tracker Pageview Error', e));
  }, [location.pathname]);

  return null; // Silent component
};

export default Tracker;
