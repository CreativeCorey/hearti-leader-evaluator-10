
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActivitiesToggleButtonProps {
  showActivities: boolean;
  onToggle: () => void;
}

const ActivitiesToggleButton: React.FC<ActivitiesToggleButtonProps> = ({
  showActivities,
  onToggle
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      variant="outline" 
      onClick={onToggle}
      className={`w-full ${isMobile ? 'mt-6' : 'mb-4'} flex justify-between items-center`}
    >
      <span>Developmental Activities</span>
      {showActivities ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </Button>
  );
};

export default ActivitiesToggleButton;
