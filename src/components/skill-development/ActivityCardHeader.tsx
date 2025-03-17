
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SkillActivity, dimensionColors } from '@/data/heartActivities';
import { dimensionIcons } from '@/components/results/development/DimensionIcons';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ActivityCardHeaderProps {
  activity: SkillActivity;
  showExpandButton?: boolean;
  toggleExpanded?: () => void;
}

const ActivityCardHeader: React.FC<ActivityCardHeaderProps> = ({ 
  activity, 
  showExpandButton = false,
  toggleExpanded
}) => {
  const { t } = useLanguage();
  const DimensionIcon = dimensionIcons[activity.dimension] || dimensionIcons.humility;
  
  // Always display the dimension name in English
  const dimensionDisplayName = activity.dimension.charAt(0).toUpperCase() + activity.dimension.slice(1);
  
  // Make sure the category is properly translated
  const categoryKey = `activities.categories.${activity.category.toLowerCase().replace(/[- ]/g, '')}`;
  const translatedCategory = t(categoryKey, { fallback: activity.category });
  
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <Badge className={`${dimensionColors[activity.dimension]} font-normal mr-2 flex items-center gap-1`}>
          <DimensionIcon size={14} />
          {dimensionDisplayName}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {translatedCategory}
        </span>
      </div>
      {showExpandButton && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="px-2 py-1 h-auto"
          onClick={toggleExpanded}
        >
          <Plus size={16} />
        </Button>
      )}
    </div>
  );
};

export default ActivityCardHeader;
