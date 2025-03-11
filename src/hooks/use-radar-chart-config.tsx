
import { useIsMobile } from './use-mobile';

export interface RadarChartConfig {
  gridType: "polygon";
  axisLineType: "polygon";
  strokeWidth: number;
  fillOpacity: number;
  dotSize: number;
  activeDotSize: number;
  outerRadius: string | number;
}

export function useRadarChartConfig(isAnimated = true): {
  config: RadarChartConfig;
  iconSize: number;
  polarRadiusProps: {
    angle: number;
    domain: number[];
    tick: {
      fill: string;
      fontSize: number;
      opacity: number;
    };
    stroke: string;
  };
  polarAngleProps: {
    tick: {
      fill: string;
      fontSize: number;
      fontWeight: number;
      opacity: number;
    };
    tickLine: boolean;
    stroke: string;
  };
} {
  const isMobile = useIsMobile();
  
  return {
    config: {
      gridType: "polygon",
      axisLineType: "polygon",
      strokeWidth: 2,
      fillOpacity: 0.5,
      dotSize: isMobile ? 3 : 4,
      activeDotSize: isMobile ? 5 : 6,
      outerRadius: isMobile ? "58%" : "65%", // Reduced for better icon spacing
    },
    iconSize: isMobile ? 16 : 20, // Increased icon size for better visibility
    polarRadiusProps: {
      angle: 30,
      domain: [0, 5],
      tick: {
        fill: '#9ca3af',
        fontSize: 9,
        opacity: 0.8
      },
      stroke: '#e5e7eb'
    },
    polarAngleProps: {
      tick: {
        fill: '#6b7280',
        fontSize: 11,
        fontWeight: 400, // Reduced from 500 to decrease boldness
        opacity: 0.85
      },
      tickLine: false,
      stroke: '#d1d5db'
    }
  };
}
