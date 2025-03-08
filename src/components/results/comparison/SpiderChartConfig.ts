
// Spider chart configuration for radar charts
export const spiderConfig = {
  gridType: "polygon" as "polygon",
  axisLineType: "polygon" as "polygon",
  strokeWidth: 2,
  fillOpacity: 0.6,
  dotSize: 5,
  activeDotSize: 8,
};

// Modern gradient colors matching the palette
export const chartColors = {
  userColor: "#6366f1",
  comparisonColors: {
    average: "#9E0059", // Purple from gradient
    men: "#E02639", // Red from gradient
    women: "#390099" // Blue from gradient
  }
};

export const getComparisonColor = (compareMode: 'none' | 'average' | 'men' | 'women') => {
  switch (compareMode) {
    case 'average': return chartColors.comparisonColors.average;
    case 'men': return chartColors.comparisonColors.men;
    case 'women': return chartColors.comparisonColors.women;
    default: return "#000000";
  }
};

export const getComparisonLabel = (compareMode: 'none' | 'average' | 'men' | 'women') => {
  switch (compareMode) {
    case 'average': return 'Average';
    case 'men': return 'Men';
    case 'women': return 'Women';
    default: return '';
  }
};

export const getBadgeVariant = (score: number) => {
  if (score >= 4.5) return "gradient-green";
  if (score >= 3.5) return "gradient-blue";
  if (score >= 2.5) return "gradient";
  return "gradient-red";
};
