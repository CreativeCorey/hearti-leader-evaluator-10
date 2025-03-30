
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { dimensionColors, dimensionTitles } from '@/data/heartActivities';
import { LucideIcon } from 'lucide-react';
import { Gauge, Ear, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';
import { formatCategoryName } from '@/utils/formatCategory';

interface SavedActivityHeaderProps {
  dimension: string;
  category: string;
}

const dimensionIcons: Record<string, LucideIcon> = {
  humility: Gauge,
  empathy: Ear,
  accountability: ChartNoAxesCombined,
  resiliency: TreePalm,
  transparency: Blend,
  inclusivity: Users
};

const SavedActivityHeader: React.FC<SavedActivityHeaderProps> = ({ dimension, category }) => {
  const DimensionIcon = dimensionIcons[dimension] || Gauge;
  
  // Format category to add proper spacing
  const formattedCategory = formatCategoryName(category);
  
  return (
    <div className="flex items-center mb-2">
      <Badge className={`${dimensionColors[dimension]} font-normal mr-2 flex items-center gap-1`}>
        <DimensionIcon size={14} />
        {dimensionTitles[dimension]}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {formattedCategory}
      </span>
    </div>
  );
};

export default SavedActivityHeader;
