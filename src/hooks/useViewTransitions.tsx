
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from './use-mobile';

export const useViewTransitions = () => {
  const isMobile = useIsMobile();
  const [viewTransitioning, setViewTransitioning] = useState(false);
  const previousMobileState = useRef(isMobile);
  
  // Handle mobile view transitions to prevent freezing
  useEffect(() => {
    // Detect changes in mobile state
    if (previousMobileState.current !== isMobile) {
      setViewTransitioning(true);
      
      // Use a short timeout to allow the UI to update smoothly
      const transitionTimer = setTimeout(() => {
        setViewTransitioning(false);
      }, 150);
      
      // Update the reference to the current mobile state
      previousMobileState.current = isMobile;
      
      return () => clearTimeout(transitionTimer);
    }
  }, [isMobile]);

  // Handle orientation change explicitly
  useEffect(() => {
    const handleOrientationChange = () => {
      // Set transitioning state to true during orientation change
      setViewTransitioning(true);
      
      // Use a slightly longer timeout for orientation changes
      // as they take more time than regular resize events
      setTimeout(() => {
        setViewTransitioning(false);
      }, 300);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {
    isMobile,
    viewTransitioning
  };
};
