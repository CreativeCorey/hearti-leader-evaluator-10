
// Type definitions for Google Analytics gtag
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}
