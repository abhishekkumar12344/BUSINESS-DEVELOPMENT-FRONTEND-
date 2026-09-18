import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Sends every new route to the top of the page. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
