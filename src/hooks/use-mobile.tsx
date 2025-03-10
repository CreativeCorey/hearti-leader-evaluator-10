
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with undefined to avoid hydration mismatches
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  
  React.useEffect(() => {
    // Initial check for client-side only
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      
      // Set up the resize handler with debouncing to prevent excessive calls
      let timeoutId: ReturnType<typeof setTimeout> | null = null
      
      const handleResize = () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        
        timeoutId = setTimeout(() => {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }, 150) // Debounce resize events
      }
      
      // Handle orientation change explicitly for mobile
      const handleOrientationChange = () => {
        // Force a recalculation after orientation change completes
        setTimeout(() => {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }, 200)
      }
      
      window.addEventListener("resize", handleResize)
      window.addEventListener("orientationchange", handleOrientationChange)
      
      // Clean up all event listeners
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("orientationchange", handleOrientationChange)
      }
    }
  }, [])

  // Return the current state (defaults to false when server-side or not yet determined)
  return isMobile ?? false
}
