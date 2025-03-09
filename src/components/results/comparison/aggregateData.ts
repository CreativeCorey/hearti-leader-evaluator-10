
import { HEARTIDimension } from '@/types';
import { dimensionColors } from '../development/DimensionIcons';

// Extracted aggregate data to a separate file for better maintainability
export const aggregateData = {
  averageScores: {
    humility: 3.8,
    empathy: 3.6,
    accountability: 4.1,
    resiliency: 3.7,
    transparency: 3.9,
    inclusivity: 3.5
  },
  demographics: {
    gender: {
      men: {
        humility: 3.6,
        empathy: 3.5,
        accountability: 4.0,
        resiliency: 3.8,
        transparency: 3.7,
        inclusivity: 3.3
      },
      women: {
        humility: 4.0,
        empathy: 3.9,
        accountability: 4.2,
        resiliency: 3.6,
        transparency: 4.1,
        inclusivity: 3.8
      }
    }
  }
};

export const userColor = "#6366f1";

export const comparisonColors = {
  average: "#8b5cf6",
  men: "#3b82f6",
  women: "#f97316"
};

export const spiderConfig = {
  gridType: "polygon" as "polygon",
  axisLineType: "polygon" as "polygon",
  strokeWidth: 2,
  fillOpacity: 0.6,
  dotSize: 5,
  activeDotSize: 8,
};
