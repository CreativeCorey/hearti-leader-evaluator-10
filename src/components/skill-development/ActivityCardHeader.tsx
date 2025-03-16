
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
  
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <Badge className={`${dimensionColors[activity.dimension]} font-normal mr-2 flex items-center gap-1`}>
          <DimensionIcon size={14} />
          {t(activity.dimension)}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {activity.category}
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
