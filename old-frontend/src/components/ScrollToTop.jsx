import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Route change scroll reset
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Scroll listener for visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      type="button"
      id="scroll-to-top-btn"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`}
      title="Scroll to top"
    >
      <ChevronUp size={22} strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTop;
