
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with undefined to avoid hydration mismatches
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  
  React.useEffect(() => {
    // Create a throttled resize handler to improve performance
    let resizeTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let orientationTimeoutId: ReturnType<typeof setTimeout> | null = null;
    
    // Check if running in browser environment
    if (typeof window !== 'undefined') {
      // Initial check
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      
      // Throttled resize handler
      const handleResize = () => {
        if (resizeTimeoutId) {
          clearTimeout(resizeTimeoutId)
        }
        
        resizeTimeoutId = setTimeout(() => {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }, 100) // Throttle resize events
      }
      
      // Handle orientation change with a separate handler
      const handleOrientationChange = () => {
        // Clear any pending resize timeout
        if (resizeTimeoutId) {
          clearTimeout(resizeTimeoutId);
          resizeTimeoutId = null;
        }
        
        // Clear any pending orientation timeout
        if (orientationTimeoutId) {
          clearTimeout(orientationTimeoutId);
        }
        
        // Set a delay before checking dimensions after orientation change
        orientationTimeoutId = setTimeout(() => {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        }, 200);
      }
      
      // Add event listeners
      window.addEventListener("resize", handleResize)
      window.addEventListener("orientationchange", handleOrientationChange)
      
      // Clean up event listeners
      return () => {
        if (resizeTimeoutId) {
          clearTimeout(resizeTimeoutId)
        }
        if (orientationTimeoutId) {
          clearTimeout(orientationTimeoutId)
        }
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("orientationchange", handleOrientationChange)
      }
    }
    
    // Default to false for SSR
    return () => {
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
      if (orientationTimeoutId) clearTimeout(orientationTimeoutId);
    };
  }, [])

  // Return the current state (defaults to false when server-side or not yet determined)
  return isMobile ?? false
}
