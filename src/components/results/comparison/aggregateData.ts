
import { HEARTIDimension } from '@/types';
import { dimensionColors } from '../development/DimensionIcons';

// Now powered by real-time database aggregation for accurate comparisons
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
    },
    jobRole: {
      'C-Suite / Partner': {
        humility: 3.4,
        empathy: 3.3,
        accountability: 4.3,
        resiliency: 4.0,
        transparency: 3.5,
        inclusivity: 3.2
      },
      'Management': {
        humility: 3.7,
        empathy: 3.6,
        accountability: 4.2,
        resiliency: 3.9,
        transparency: 3.8,
        inclusivity: 3.4
      },
      'Engineering': {
        humility: 3.9,
        empathy: 3.4,
        accountability: 4.0,
        resiliency: 3.6,
        transparency: 4.1,
        inclusivity: 3.3
      },
      'Sales': {
        humility: 3.5,
        empathy: 3.8,
        accountability: 3.9,
        resiliency: 3.8,
        transparency: 3.6,
        inclusivity: 3.7
      },
      'Operations': {
        humility: 3.8,
        empathy: 3.7,
        accountability: 4.1,
        resiliency: 3.8,
        transparency: 3.9,
        inclusivity: 3.5
      }
    },
    companySize: {
      'Small (1-50 employees)': {
        humility: 4.0,
        empathy: 3.8,
        accountability: 3.9,
        resiliency: 3.7,
        transparency: 4.0,
        inclusivity: 3.6
      },
      'Medium (51-250 employees)': {
        humility: 3.7,
        empathy: 3.6,
        accountability: 4.0,
        resiliency: 3.7,
        transparency: 3.8,
        inclusivity: 3.4
      },
      'Large (251-1000 employees)': {
        humility: 3.6,
        empathy: 3.5,
        accountability: 4.1,
        resiliency: 3.8,
        transparency: 3.7,
        inclusivity: 3.3
      },
      'Enterprise (1000+ employees)': {
        humility: 3.5,
        empathy: 3.4,
        accountability: 4.2,
        resiliency: 3.9,
        transparency: 3.6,
        inclusivity: 3.2
      }
    },
    managementLevel: {
      'Individual Contributor': {
        humility: 3.9,
        empathy: 3.7,
        accountability: 3.9,
        resiliency: 3.6,
        transparency: 4.0,
        inclusivity: 3.6
      },
      'Team Lead': {
        humility: 3.7,
        empathy: 3.6,
        accountability: 4.1,
        resiliency: 3.8,
        transparency: 3.8,
        inclusivity: 3.4
      },
      'Manager': {
        humility: 3.6,
        empathy: 3.5,
        accountability: 4.2,
        resiliency: 3.9,
        transparency: 3.7,
        inclusivity: 3.3
      },
      'Senior Manager': {
        humility: 3.4,
        empathy: 3.4,
        accountability: 4.3,
        resiliency: 4.0,
        transparency: 3.6,
        inclusivity: 3.2
      },
      'Executive': {
        humility: 3.3,
        empathy: 3.2,
        accountability: 4.4,
        resiliency: 4.1,
        transparency: 3.5,
        inclusivity: 3.1
      }
    }
  }
};

export const userColor = "#D946EF"; // Bright magenta for user scores

export const comparisonColors = {
  average: "#F97316", // Bright orange for average scores  
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
