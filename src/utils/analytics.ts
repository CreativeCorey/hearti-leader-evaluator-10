
// Simple wrapper around Google Analytics
export const initializeAnalytics = (measurementId: string): void => {
  // Skip analytics in development mode
  if (import.meta.env.DEV) {
    console.log('Analytics tracking disabled in development mode');
    return;
  }

  try {
    // Load Google Analytics script dynamically
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize the dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    // Initialize gtag
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    
    console.log('Google Analytics initialized');
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
};

// Track page views
export const trackPageView = (path: string): void => {
  try {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path
      });
    }
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

// Track custom events
export const trackEvent = (
  category: string, 
  action: string, 
  label?: string, 
  value?: number
): void => {
  try {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};
