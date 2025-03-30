
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { dimensionColors, dimensionTitles } from '@/data/heartActivities';
import { LucideIcon } from 'lucide-react';
import { Gauge, Ear, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';
import { formatCategoryName } from '@/utils/formatCategory';
import { useLanguage } from '@/contexts/language/LanguageContext';

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
  const { t } = useLanguage();
  const DimensionIcon = dimensionIcons[dimension] || Gauge;
  
  // Format the category properly, first checking for translations
  const lowerCaseCategory = category?.toLowerCase().replace(/[-_\s&]/g, '') || '';
  const translationKey = `activities.categories.${lowerCaseCategory}`;
  
  // Use translated category if available, otherwise format the provided category
  const displayCategory = t(translationKey, { fallback: formatCategoryName(category) });
  
  return (
    <div className="flex items-center mb-2">
      <Badge className={`${dimensionColors[dimension]} font-normal mr-2 flex items-center gap-1`}>
        <DimensionIcon size={14} />
        {dimensionTitles[dimension]}
      </Badge>
      <span className="text-xs text-muted-foreground dark:text-white dark:font-medium">
        {displayCategory}
      </span>
    </div>
  );
};

export default SavedActivityHeader;
