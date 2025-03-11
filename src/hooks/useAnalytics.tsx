
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/utils/analytics';

/**
 * Hook to track page views with Google Analytics
 * Add this to your Layout component or any component that wraps your routes
 */
export const usePageTracking = (): void => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view when location changes
    trackPageView(location.pathname + location.search);
  }, [location]);
};
