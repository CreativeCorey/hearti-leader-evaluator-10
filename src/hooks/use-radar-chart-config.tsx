
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
      fillOpacity: 0.6,
      dotSize: isMobile ? 3 : 5,
      activeDotSize: isMobile ? 6 : 8,
      outerRadius: isMobile ? "50%" : "60%",
    },
    iconSize: isMobile ? 16 : 18
  };
}
