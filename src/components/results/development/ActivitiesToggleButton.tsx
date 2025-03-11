
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ActivitiesToggleButtonProps {
  showActivities: boolean;
  onToggle: () => void;
}

const ActivitiesToggleButton: React.FC<ActivitiesToggleButtonProps> = ({
  showActivities,
  onToggle
}) => {
  return (
    <Button 
      variant="outline" 
      onClick={onToggle}
      className="w-full mb-4 flex justify-between items-center"
    >
      <span>Developmental Activities</span>
      {showActivities ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </Button>
  );
};

export default ActivitiesToggleButton;
