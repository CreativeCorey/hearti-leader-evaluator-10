
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
      dotSize: 5,
      activeDotSize: 8,
      outerRadius: isMobile ? "60%" : "65%",
    },
    iconSize: isMobile ? 20 : 18
  };
}
