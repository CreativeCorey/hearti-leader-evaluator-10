
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
      outerRadius: isMobile ? "65%" : "75%",
    },
    iconSize: isMobile ? 14 : 18 // Increased icon size for better visibility
  };
}
